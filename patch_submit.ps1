$ErrorActionPreference = "Stop"

function Patch-File {
    param([string]$Path)
    $content = Get-Content -Path $Path -Raw -Encoding UTF8

    # Patch category assignment based on activeSubId
    $target1 = @"
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
    $repl1 = @"
  let category = '건강상담';
  const menus = state.activeClient?.menus || [];
  const activeMenu = state.activeMenuId ? menus.find(m => m.id === state.activeMenuId) : null;
  const menuLabel = activeMenu ? activeMenu.label : '';
  
  if (state.activeSubId === 'expert') {
    category = '병원안내';
  } else if (state.activeSubId === 'appt') {
    category = '진료예약';
  } else if (state.activeMenuId === 'hospitalGuide' || menuLabel.includes('병원안내')) {
    category = '병원안내';
  } else if (state.activeMenuId === 'medicalAppt' || menuLabel.includes('진료예약')) {
    category = '진료예약';
  }
"@

    # Patch redirection to mypage
    $target2 = @"
    alert('신청이 완료되었습니다.');
    window.location.hash = `#/portal/` + state.activeClient.id + `/` + state.activeSite.siteId + `/` + state.activeMenuId + `/` + historySubId;
"@
    $target2alt = "alert('신청이 완료되었습니다.');`r`n    window.location.hash = `"#/portal/`$(state.activeClient.id)/`$(state.activeSite.siteId)/`$(state.activeMenuId)/`$(historySubId)`";"
    
    $repl2 = @"
    alert('신청이 완료되었습니다.');
    window.mypageMainTab = 'history';
    window.location.hash = `#/portal/` + state.activeClient.id + `/` + state.activeSite.siteId + `/mypage`;
"@
    $repl2alt = "alert('신청이 완료되었습니다.');`r`n    window.mypageMainTab = 'history';`r`n    window.location.hash = `"#/portal/`$(state.activeClient.id)/`$(state.activeSite.siteId)/mypage`";"

    if ($content.Contains($target1)) {
        $content = $content.Replace($target1, $repl1)
    } else {
        $content = $content.Replace($target1.Replace("`r`n", "`n"), $repl1.Replace("`r`n", "`n"))
    }

    if ($content.Contains($target2alt)) {
        $content = $content.Replace($target2alt, $repl2alt)
    } else {
        $content = $content.Replace($target2alt.Replace("`r`n", "`n"), $repl2alt.Replace("`r`n", "`n"))
    }
    
    # Also patch online form redirect
    $target3 = @"
    alert('온라인 문의가 접수되었습니다.\\n빠른 시일 내에 답변해 드리겠습니다.');
    window.location.hash = `#/portal/` + state.activeClient.id + `/` + state.activeSite.siteId + `/` + state.activeMenuId + `/` + historySubId;
"@
    $target3alt = "alert('온라인 문의가 접수되었습니다.\\n빠른 시일 내에 답변해 드리겠습니다.');`r`n    window.location.hash = `"#/portal/`$(state.activeClient.id)/`$(state.activeSite.siteId)/`$(state.activeMenuId)/`$(historySubId)`";"
    
    $repl3alt = "alert('온라인 문의가 접수되었습니다.\\n빠른 시일 내에 답변해 드리겠습니다.');`r`n    window.mypageMainTab = 'history';`r`n    window.location.hash = `"#/portal/`$(state.activeClient.id)/`$(state.activeSite.siteId)/mypage`";"

    if ($content.Contains($target3alt)) {
        $content = $content.Replace($target3alt, $repl3alt)
    } else {
        $content = $content.Replace($target3alt.Replace("`r`n", "`n"), $repl3alt.Replace("`r`n", "`n"))
    }

    [System.IO.File]::WriteAllText($Path, $content, (New-Object System.Text.UTF8Encoding($false)))
}

Patch-File "app.js"
Patch-File "m_app.js"
Write-Host "submitConsulting patched!"
