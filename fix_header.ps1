$ErrorActionPreference = "Stop"

function Process-File {
    param([string]$FilePath)
    
    $content = Get-Content -Path $FilePath -Raw -Encoding UTF8

    $oldTarget = "                <h3 style=`"font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px;`">약관 및 개인정보 동의</h3>`r`n                `r`n            <div style=`"display: flex; align-items: center; gap: 8px; margin-bottom: 24px;`">`r`n              <span style=`"background: #2563eb; color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 4px;`">STEP 1</span>`r`n              <span style=`"font-size: 14px; font-weight: 700; color: #475569;`">약관 및 개인정보 동의</span>`r`n            </div>`r`n            <h2 style=`"font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 12px;`">`r`n              건강검진 예약 서비스를<br/>이용하기 위해 아래 동의가 필요합니다.`r`n            </h2>`r`n            <p style=`"font-size: 15px; color: #64748b; margin-bottom: 40px;`">모든 필수 항목에 동의해야 다음 단계로 이동할 수 있습니다.</p>"

    $oldTargetNoCr = "                <h3 style=`"font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px;`">약관 및 개인정보 동의</h3>`n                `n            <div style=`"display: flex; align-items: center; gap: 8px; margin-bottom: 24px;`">`n              <span style=`"background: #2563eb; color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 4px;`">STEP 1</span>`n              <span style=`"font-size: 14px; font-weight: 700; color: #475569;`">약관 및 개인정보 동의</span>`n            </div>`n            <h2 style=`"font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 12px;`">`n              건강검진 예약 서비스를<br/>이용하기 위해 아래 동의가 필요합니다.`n            </h2>`n            <p style=`"font-size: 15px; color: #64748b; margin-bottom: 40px;`">모든 필수 항목에 동의해야 다음 단계로 이동할 수 있습니다.</p>"

    $newTarget = "                <h3 style=`"font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px;`">약관 및 개인정보 동의</h3>`r`n                `r`n            <h2 style=`"font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 12px; margin-top: 12px;`">`r`n              건강검진 예약 서비스를<br/>이용하기 위해 아래 동의가 필요합니다.`r`n            </h2>`r`n            <p style=`"font-size: 15px; color: #64748b; margin-bottom: 40px;`">모든 필수 항목에 동의해야 예약 신청이 가능합니다.</p>"

    if ($content.Contains($oldTarget)) {
        $content = $content.Replace($oldTarget, $newTarget)
    } elseif ($content.Contains($oldTargetNoCr)) {
        $content = $content.Replace($oldTargetNoCr, $newTarget.Replace("`r", ""))
    } else {
        Write-Host "Target not found in $FilePath"
    }

    [System.IO.File]::WriteAllText($FilePath, $content, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Successfully processed $FilePath"
}

Process-File "app.js"
Process-File "m_app.js"
