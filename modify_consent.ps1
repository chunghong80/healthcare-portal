$ErrorActionPreference = "Stop"

function Process-File($filename) {
    Write-Host "Processing $filename"
    $content = Get-Content -Path $filename -Raw -Encoding UTF8

    # 1. Change routing
    $search = "window\.location\.hash = '#/portal/' \+ state\.activeClient\.id \+ '/' \+ state\.activeSite\.siteId \+ '/' \+ state\.activeMenuId \+ '/consent';"
    $replace = "window.location.hash = '#/portal/' + state.activeClient.id + '/' + state.activeSite.siteId + '/' + state.activeMenuId + '/checkup-target';"
    $content = $content -replace [regex]::Escape("window.location.hash = '#/portal/' + state.activeClient.id + '/' + state.activeSite.siteId + '/' + state.activeMenuId + '/consent';"), $replace

    # 2. Extract consent block
    $regex = [regex]'(?sm)\} else if \(state\.activeSubId === ''consent''\) \{\s*detailContentHtml = `\s*<div class="consent-wrapper fade-in"[^>]*>(.*?)<div style="display: flex; gap: 12px; margin-top: 24px;">\s*<button[^>]*>이전</button>\s*<button id="btn-next-consent"[^>]*>다음</button>\s*</div>\s*</div>\s*`;'
    $match = $regex.Match($content)
    
    if (-not $match.Success) {
        Write-Host "Consent block not found in $filename"
        return
    }

    $consentHtml = $match.Groups[1].Value
    
    # Remove the step 1 badge and title from consentHtml
    $step1Regex = '(?sm)<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">\s*<span style="background: #2563eb; color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 4px;">STEP 1</span>\s*<span style="font-size: 14px; font-weight: 700; color: #475569;">약관 및 개인정보 동의</span>\s*</div>'
    $consentHtml = $consentHtml -replace $step1Regex, ""
    
    # Replace the text
    $consentHtml = $consentHtml.Replace("다음 단계로 이동할 수 있습니다.", "예약 신청이 가능합니다.")
    
    # Remove the original consent block entirely
    $content = $content.Replace($match.Value, "")

    # 3. Insert consentHtml into checkup-summary
    $summaryRegex = [regex]'(?sm)(<div style="display: flex; gap: 12px;">\s*<button onclick="window\.history\.back\(\)"[^>]*>이전 단계</button>\s*<button onclick=")(.*?)(Style="flex: 1; padding: 16px; border-radius: 8px; border: none; background: #2563eb; color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0\.2s;">예약신청완료</button>\s*</div>\s*</div>\s*`;\s*\}\s*\})'
    
    # Wait, the summary regex had a small bug: Style="flex should be " style="flex
    $summaryRegex = [regex]'(?sm)(<div style="display: flex; gap: 12px;">\s*<button onclick="window\.history\.back\(\)"[^>]*>이전 단계</button>\s*<button onclick=")(.*?)(" style="flex: 1; padding: 16px; border-radius: 8px; border: none; background: #2563eb; color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0\.2s;">예약신청완료</button>\s*</div>\s*</div>\s*`;\s*\}\s*\})'
    
    $summaryMatch = $summaryRegex.Match($content)
    if ($summaryMatch.Success) {
        $p1 = $summaryMatch.Groups[1].Value
        $p2 = $summaryMatch.Groups[2].Value
        $p3 = $summaryMatch.Groups[3].Value
        
        $newOnclick = "window.submitCheckupConsent();`n                " + $p2
        $disabledStyle = "flex: 1; padding: 16px; border-radius: 8px; border: none; background: #94a3b8; color: white; font-size: 16px; font-weight: 700; cursor: not-allowed; transition: background 0.2s;"
        
        $replacement = $consentHtml + "`n            " + $p1 + "id=`"btn-next-consent`" disabled onclick=`"" + $newOnclick + "`" style=`"" + $disabledStyle + "`">예약신청완료</button>`n            </div>`n          </div>`n        \`;`n      }`n    }"
        
        $content = $content.Replace($summaryMatch.Value, $replacement)
    } else {
        Write-Host "Summary block not found in $filename"
    }

    # 4. Update submitCheckupConsent to NOT change location hash
    $hashRegex = '(?sm)window\.location\.hash = ''#/portal/'' \+ state\.activeClient\.id \+ ''/'' \+ state\.activeSite\.siteId \+ ''/'' \+ state\.activeMenuId \+ ''/checkup-target'';\s*\};'
    $content = $content -replace $hashRegex, "};"

    # 5. Update STEP numbers 2->1, 3->2, 4->3, 5->4
    $content = $content -replace '<span style="([^"]*)">STEP 2</span>', '<span style="$1">STEP 1</span>'
    $content = $content -replace '<span style="([^"]*)">STEP 3</span>', '<span style="$1">STEP 2</span>'
    $content = $content -replace '<span style="([^"]*)">STEP 4</span>', '<span style="$1">STEP 3</span>'
    $content = $content -replace '<span style="([^"]*)">STEP 5</span>', '<span style="$1">STEP 4</span>'

    Set-Content -Path $filename -Value $content -Encoding UTF8
    Write-Host "Processed $filename"
}

Process-File "app.js"
Process-File "m_app.js"
