$ErrorActionPreference = "Stop"

function Safe-Normalize([string]$Text) {
    if ($Text -eq $null) { return "" }
    return $Text -replace "`r`n", "`n"
}

function Patch-File {
    param([string]$Path, [string]$TabsPayload, [string]$ModalPayload, [string]$CheckupPayload)
    
    $content = Get-Content -Path $Path -Raw -Encoding UTF8
    $content = Safe-Normalize $content
    
    $modalText = Get-Content -Path $ModalPayload -Raw -Encoding UTF8
    $modalText = Safe-Normalize $modalText

    # 1. Modals (We'll just re-inject them if missing)
    if ($content.IndexOf("window.showCheckupSupportModal") -eq -1) {
        $insertPos = $content.IndexOf("const defaultMenus")
        if ($insertPos -eq -1) { $insertPos = $content.IndexOf("const BRAND_DEFAULTS") }
        # Re-inject with LF ending
        $content = $content.Substring(0, $insertPos) + $modalText + "`n" + $content.Substring($insertPos)
    }

    # 2. Redirect `isCheckupGroup` click to modal instead of direct routing
    $targetRoute1 = Safe-Normalize "window.location.hash = ``#/portal/`$(clientId)/`$(siteId)/`$(menuId)/`$(firstSubId)``;"
    $replRoute1 = Safe-Normalize @"
        if (menuId === 'checkupAppt') {
          window.showCheckupSupportModal();
        } else {
          window.location.hash = ``#/portal/`$(clientId)/`$(siteId)/`$(menuId)/`$(firstSubId)``;
        }
"@
    $targetRoute2 = Safe-Normalize "window.location.hash = '#/portal/' + clientId + '/' + siteId + '/' + menuId + '/' + firstSubId;"
    $replRoute2 = Safe-Normalize @"
        if (menuId === 'checkupAppt') {
          window.showCheckupSupportModal();
        } else {
          window.location.hash = '#/portal/' + clientId + '/' + siteId + '/' + menuId + '/' + firstSubId;
        }
"@
    $content = $content.Replace($targetRoute1, $replRoute1)
    $content = $content.Replace($targetRoute2, $replRoute2)

    # 3. Patch submitConsulting redirect and title
    $submitCond1Old = Safe-Normalize @"
  let category = '건강상담';
  const menus = state.activeClient?.menus || [];
  const activeMenu = state.activeMenuId ? menus.find(m => m.id === state.activeMenuId) : null;
  const menuLabel = activeMenu ? activeMenu.label : '';
  if (state.activeMenuId === 'hospitalGuide' || menuLabel.includes('병원안내')) {
    category = '병원안내';
  } else if (state.activeMenuId === 'medicalAppt' || menuLabel.includes('진료예약')) {
    category = '진료예약';
  }
"@
    $submitCond1New = Safe-Normalize @"
  let category = '건강상담';
  const menus = state.activeClient?.menus || [];
  const activeMenu = state.activeMenuId ? menus.find(m => m.id === state.activeMenuId) : null;
  const menuLabel = activeMenu ? activeMenu.label : '';
  if (state.activeSubId === 'appt') {
    category = '진료예약';
  } else if (state.activeSubId === 'expert') {
    category = '병원안내';
  } else if (state.activeMenuId === 'hospitalGuide' || menuLabel.includes('병원안내')) {
    category = '병원안내';
  } else if (state.activeMenuId === 'medicalAppt' || menuLabel.includes('진료예약')) {
    category = '진료예약';
  }
"@
    $content = $content.Replace($submitCond1Old.Trim(), $submitCond1New.Trim())

    $redirectPhoneOld = Safe-Normalize "window.location.hash = ``#/portal/`$(state.activeClient.id)/`$(state.activeSite.siteId)/`$(state.activeMenuId)/`$(historySubId)``;"
    $redirectPhoneNew = Safe-Normalize @"
    window.mypageMainTab = 'history';
    window.location.hash = ``#/portal/`$(state.activeClient.id)/`$(state.activeSite.siteId)/mypage``;
"@
    $content = $content.Replace($redirectPhoneOld, $redirectPhoneNew)

    $titleOld = Safe-Normalize "title: state.activeMenuId === 'medicalAppt' ? '진료예약 상담 신청' : (state.activeMenuId === 'hospitalGuide' ? '병원안내 상담 신청' : '전화 건강상담 신청'),"
    $titleNew = Safe-Normalize "title: (state.activeMenuId === 'medicalAppt' || state.activeSubId === 'appt') ? '진료예약 상담 신청' : ((state.activeMenuId === 'hospitalGuide' || state.activeSubId === 'expert') ? '병원안내 상담 신청' : '전화 건강상담 신청'),"
    $content = $content.Replace($titleOld, $titleNew)

    # 4. Modify conditionals for tabs
    $oldConds = Safe-Normalize @"
    const isConsultingGroup = state.activeMenuId === 'healthConsulting' || activeMenu?.id === 'healthConsulting' || pageTitle.includes('상담');
    const isHistoryPage = state.activeSubId === 'consultHistory' || activeSub?.id === 'consultHistory' || state.activeSubId === 'history' || activeSub?.id === 'history' || ((pageTitle.includes('이력') || pageTitle.includes('내역')) && !pageTitle.includes('검진'));
    const isCheckupHistoryPage = state.activeSubId === 'checkupHistory' || activeSub?.id === 'checkupHistory' || state.activeSubSubId === 'checkupHistory' || activeSubSub?.id === 'checkupHistory' || pageTitle.includes('신청이력');
    const isHospitalGuideGroup = state.activeMenuId === 'hospitalGuide' || activeMenu?.id === 'hospitalGuide' || pageTitle.includes('병원안내');
    const isMedicalApptGroup = state.activeMenuId === 'medicalAppt' || activeMenu?.id === 'medicalAppt' || pageTitle.includes('진료예약');
    const isCheckupGroup = state.activeMenuId === 'checkupAppt' || activeMenu?.id === 'checkupAppt' || pageTitle.includes('건강검진');
"@
    $newConds = Get-Content payload_conds.txt -Raw -Encoding UTF8
    $newConds = Safe-Normalize $newConds
    
    $content = $content.Replace($oldConds.Trim(), $newConds.Trim())

    # 5. Replace isConsultingGroup block entirely
    $startMarker = Safe-Normalize "} else if (isConsultingGroup) {"
    $endMarker = Safe-Normalize "} else if (state.activeSubId === searchSubId) {"
    
    $startIdx = $content.IndexOf($startMarker)
    $endIdx = $content.IndexOf($endMarker, $startIdx)

    if ($startIdx -ne -1 -and $endIdx -ne -1) {
        $tabsContent = Get-Content $TabsPayload -Raw -Encoding UTF8
        $tabsContent = Safe-Normalize $tabsContent
        # Insert with LF ending
        $content = $content.Substring(0, $startIdx) + $tabsContent + "`n      " + $content.Substring($endIdx)
    }

    # 6. Replace the searchSubId condition with isSearchGroup condition
    $searchCondOld = Safe-Normalize "      } else if (state.activeSubId === searchSubId) {"
    $searchCondNew = Safe-Normalize "      } else if (isSearchGroup) {"
    $content = $content.Replace($searchCondOld, $searchCondNew)

    # 7. Delete the redundant isMedicalApptGroup block
    $deleteStart = [char]10 + "      }" + [char]10 + [char]10 + "    } else if (isMedicalApptGroup) {"
    $deleteEnd = Safe-Normalize "    } else if (isCheckupGroup) {"
    $delStartIdx = $content.IndexOf($deleteStart)
    $delEndIdx = $content.IndexOf($deleteEnd, $delStartIdx)
    if ($delStartIdx -ne -1 -and $delEndIdx -ne -1) {
        $content = $content.Substring(0, $delStartIdx) + "`n" + $content.Substring($delEndIdx)
    }

    # 8. Replace checkup main page layout
    $checkupStart = [char]10 + "    } else if (isCheckupGroup) {" + [char]10 + "      if (!state.activeSubId) {"
    $checkupEnd = Safe-Normalize "      } else if (state.activeSubId === 'checkupPreferred' ||"
    
    $chkStartIdx = $content.IndexOf($checkupStart)
    $chkEndIdx = $content.IndexOf($checkupEnd, $chkStartIdx)
    
    if ($chkStartIdx -ne -1 -and $chkEndIdx -ne -1) {
        $checkupText = Get-Content $CheckupPayload -Raw -Encoding UTF8
        $checkupText = Safe-Normalize $checkupText
        $content = $content.Substring(0, $chkStartIdx) + $checkupStart + "`n          detailContentHtml = ``" + $checkupText + "`n        ``;" + $content.Substring($chkEndIdx)
    }

    # 9. Update window.submitCheckupDesign and define window.updateCheckupConsultType
    $submitOld = [char]10 + "window.submitCheckupDesign = function () {"
    $submitStartIdx = $content.IndexOf($submitOld)
    $submitEndIdx = $content.IndexOf("window.submitCheckupDirect = function ()", $submitStartIdx)
    
    if ($submitStartIdx -ne -1 -and $submitEndIdx -ne -1) {
        $newSubmitCode = @'
window.updateCheckupConsultType = function (type) {
  const phoneFields = document.getElementById('checkup-phone-fields');
  const guidanceBox = document.getElementById('checkup-guidance-box');
  const dateInput = document.getElementById('checkup-date');

  if (type === 'phone') {
    if (phoneFields) phoneFields.style.display = 'grid';
    if (dateInput) dateInput.required = true;
    if (guidanceBox) {
      guidanceBox.innerHTML = `
        <i style="display: block; margin-bottom: 6px; font-style: normal; font-weight: 700; color: #1e293b;">상담 가능 시간은 평일 오전 9시 ~ 오후 6시입니다.</i>
        <i style="display: block; font-style: normal;">상담을 원하시는 날짜와 시간대를 선택하시고, 상담받고 싶은 내용을 간단히 작성해 주세요. 남겨주신 내용을 확인한 후 간호사가 직접 전화드리겠습니다.</i>
      `;
    }
  } else {
    if (phoneFields) phoneFields.style.display = 'none';
    if (dateInput) dateInput.required = false;
    if (guidanceBox) {
      guidanceBox.innerHTML = `
        <i style="display: block; margin-bottom: 6px; font-style: normal; font-weight: 700; color: #1e293b;">온라인 문의 안내</i>
        <i style="display: block; font-style: normal;">상담받고 싶은 내용을 작성해 주세요. 접수된 문의는 확인 후 영업일 기준 3일 이내에 온라인으로 답변드리겠습니다.</i>
      `;
    }
  }
};

window.submitCheckupDesign = function () {
  const name = document.getElementById('checkup-name').value;
  const phone = document.getElementById('checkup-phone').value;
  const date = document.getElementById('checkup-date')?.value;
  const time = document.getElementById('checkup-time')?.value;
  const memo = document.getElementById('checkup-memo').value;
  const type = document.querySelector('input[name="checkup-consult-type"]:checked')?.value || 'phone';

  if (type === 'phone') {
    if (!phone || !date || !memo) {
      alert('연락처, 상담 희망 일자, 건강 우려사항을 모두 입력해주세요.');
      return;
    }
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    if (date < todayStr) {
      showModal('신청 불가', '과거 날짜로는 상담을 신청하실 수 없습니다. 오늘 이후의 날짜를 선택해주세요.');
      return;
    }
  } else {
    if (!phone || !memo) {
      alert('연락처와 문의 내용을 모두 입력해주세요.');
      return;
    }
  }

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const inquiries = JSON.parse(localStorage.getItem('hc_inquiries') || '[]');
  const newEntry = {
    id: Date.now(),
    clientId: state.activeClient.id,
    userId: state.currentUser.id,
    userName: state.currentUser.name,
    type: type,
    category: '건강검진',
    title: type === 'phone' ? '건강검진 전화상담 신청' : '건강검진 온라인 문의 신청',
    content: type === 'phone'
      ? `[전화상담 신청]\n성함: ${name}\n연락처: ${phone}\n상담시간대: ${time}\n\n[상담/요청 내용]\n${memo}`
      : `[온라인 문의 신청]\n성함: ${name}\n연락처: ${phone}\n\n[상담/요청 내용]\n${memo}`,
    date: todayStr,
    status: '접수완료',
    answer: null,
    answerDate: null,
    consultDate: type === 'phone' ? date : null,
    consultTime: type === 'phone' ? time : null
  };

  inquiries.push(newEntry);
  localStorage.setItem('hc_inquiries', JSON.stringify(inquiries));

  if (type === 'phone') {
    showToast('건강검진 전화상담 신청이 접수되었습니다.');
  } else {
    showToast('건강검진 온라인 문의가 접수되었습니다.');
  }
  setTimeout(() => {
    let targetHash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/checkupHistory`;
    const site = state.activeClient.sites.find(s => s.siteId === state.activeSite.siteId);
    const checkupMenu = site?.menus?.find(m => m.id === 'checkupAppt');
    if (checkupMenu && checkupMenu.children) {
        for (const sub of checkupMenu.children) {
            if (sub.id === 'checkupHistory' || sub.label?.includes('신청이력')) {
                targetHash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/${sub.id}`;
                break;
            }
            if (sub.children && sub.children.some(c => c.id === 'checkupHistory' || c.label?.includes('신청이력'))) {
                const subSub = sub.children.find(c => c.id === 'checkupHistory' || c.label?.includes('신청이력'));
                targetHash = `#/portal/${state.activeClient.id}/${state.activeSite.siteId}/checkupAppt/${sub.id}/${subSub.id}`;
                break;
            }
        }
    }
    window.location.hash = targetHash;
  }, 1500);
};
'@
        $content = $content.Substring(0, $submitStartIdx) + [char]10 + $newSubmitCode + "`n`n" + $content.Substring($submitEndIdx)
    }

    # Restore CRLF line endings
    $contentCRLF = $content -replace "(?<!`r)`n", "`r`n"

    [System.IO.File]::WriteAllText($Path, $contentCRLF, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Patched $Path cleanly with normalized line endings."
}

Patch-File "app.js" "payload_tabs_pc.txt" "payload_modal_pc.txt" "payload_checkup_pc.txt"
Patch-File "m_app.js" "payload_tabs_mobile.txt" "payload_modal_mobile.txt" "payload_checkup_mobile.txt"
