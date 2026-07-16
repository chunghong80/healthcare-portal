$ErrorActionPreference = "Stop"

function Process-File {
    param([string]$FilePath)
    
    $content = Get-Content -Path $FilePath -Raw -Encoding UTF8

    # 1. Update routing
    $oldRoute = "window.location.hash = '#/portal/' + state.activeClient.id + '/' + state.activeSite.siteId + '/' + state.activeMenuId + '/consent';"
    $newRoute = "window.location.hash = '#/portal/' + state.activeClient.id + '/' + state.activeSite.siteId + '/' + state.activeMenuId + '/checkup-target';"
    $content = $content.Replace($oldRoute, $newRoute)

    # 2. Extract and remove consent block
    $startStr = "} else if (state.activeSubId === 'consent') {"
    $endStr = "      } else if (state.activeSubId === 'checkup-target') {"
    
    $startIdx = $content.IndexOf($startStr)
    $endIdx = $content.IndexOf($endStr)
    
    if ($startIdx -eq -1 -or $endIdx -eq -1) {
        Write-Host "Consent block boundaries not found in $FilePath"
        return
    }
    
    $consentBlock = $content.Substring($startIdx, $endIdx - $startIdx)
    $content = $content.Remove($startIdx, $endIdx - $startIdx)
    
    # Extract just the HTML inside consent-wrapper
    $htmlMatch = [regex]::Match($consentBlock, "(?s)<div class=`"consent-wrapper fade-in`"[^>]*>(.*?)<div style=`"display: flex; gap: 12px; margin-top: 24px;`">")
    if (-not $htmlMatch.Success) {
        Write-Host "Inner HTML not found in $FilePath"
        return
    }
    $consentHtml = $htmlMatch.Groups[1].Value

    # Remove the STEP 1 badge row
    $consentHtml = $consentHtml -replace "(?s)<div style=`"display: flex; align-items: center; gap: 8px; margin-bottom: 24px;`">\s*<span[^>]*>STEP 1</span>\s*<span[^>]*>약관 및 개인정보 동의</span>\s*</div>", ""
    
    # Update text
    $consentHtml = $consentHtml.Replace("다음 단계로 이동할 수 있습니다.", "예약 신청이 가능합니다.")
    
    # Clean up some trailing spaces or newlines from consentHtml
    $consentHtml = $consentHtml.TrimEnd()

    # 3. Insert consent HTML right before the summary block's final buttons
    $sumStart = "<div style=`"display: flex; gap: 12px;`">`n              <button onclick=`"window.history.back()`""
    
    if ($content.IndexOf($sumStart) -eq -1) {
        $sumStart = "<div style=`"display: flex; gap: 12px;`">`r`n              <button onclick=`"window.history.back()`""
    }
    
    if ($content.IndexOf($sumStart) -eq -1) {
        Write-Host "Summary start string not found in $FilePath"
        return
    }
    
    $sumIdx = $content.IndexOf($sumStart)
    
    $btnPart = "`n              <button id=`"btn-next-consent`" disabled onclick=`"`n                window.submitCheckupConsent();`n"
    
    # Replace `<button onclick="` with the new button definition
    # But wait, there are two `<button onclick=` inside that block. 
    # Let's just insert the $consentHtml and replace the "예약신청완료" button.
    
    $targetBtnStr = "<button onclick=`"`n                let hist = JSON.parse"
    if ($content.IndexOf($targetBtnStr) -eq -1) {
        $targetBtnStr = "<button onclick=`"`r`n                let hist = JSON.parse"
    }
    
    if ($content.IndexOf($targetBtnStr) -eq -1) {
        Write-Host "Target button string not found in $FilePath"
        return
    }
    
    $newBtnStr = "<button id=`"btn-next-consent`" disabled onclick=`"`n                window.submitCheckupConsent();`n                let hist = JSON.parse"
    $content = $content.Replace($targetBtnStr, $newBtnStr)
    
    # Change the style of 예약신청완료 button
    $oldStyle = "background: #2563eb; color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0.2s;`">예약신청완료</button>"
    $newStyle = "background: #94a3b8; color: white; font-size: 16px; font-weight: 700; cursor: not-allowed; transition: background 0.2s;`">예약신청완료</button>"
    $content = $content.Replace($oldStyle, $newStyle)
    
    # Finally, insert the consent HTML right before the <div style="display: flex; gap: 12px;">
    $insertText = "`n            <div style=`"background: white; border: 1px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); margin-bottom: 40px; padding: 24px;`">`n                <h3 style=`"font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px;`">약관 및 개인정보 동의</h3>`n                " + $consentHtml + "`n            </div>`n`n            "
    
    $content = $content.Replace($sumStart, $insertText + $sumStart)

    # 4. Remove hash change from submitCheckupConsent
    $hashChangeRegex = "(?s)window\.location\.hash = '#/portal/' \+ state\.activeClient\.id \+ '/' \+ state\.activeSite\.siteId \+ '/' \+ state\.activeMenuId \+ '/checkup-target';"
    $content = $content -replace $hashChangeRegex, ""

    # 5. Shift STEP numbers
    $content = $content -replace "(<span[^>]*>STEP )2(</span>)", "`${1}1`$2"
    $content = $content -replace "(<span[^>]*>STEP )3(</span>)", "`${1}2`$2"
    $content = $content -replace "(<span[^>]*>STEP )4(</span>)", "`${1}3`$2"
    $content = $content -replace "(<span[^>]*>STEP )5(</span>)", "`${1}4`$2"

    [System.IO.File]::WriteAllText($FilePath, $content, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Successfully processed $FilePath"
}

Process-File "app.js"
Process-File "m_app.js"
