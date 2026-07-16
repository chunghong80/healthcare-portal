$ErrorActionPreference = "Stop"

function Process-File {
    param([string]$FilePath)
    
    $content = Get-Content -Path $FilePath -Raw -Encoding UTF8

    $oldBlockStart = "} else if (isMedicalApptGroup) {`r`n      if (!state.activeSubId) {`r`n        detailContentHtml = ``"
    $oldBlockStartNoCr = "} else if (isMedicalApptGroup) {`n      if (!state.activeSubId) {`n        detailContentHtml = ``"
    
    $newBlockStart = "} else if (isMedicalApptGroup) {`r`n        detailContentHtml = ``"
    
    if ($content.Contains($oldBlockStart)) {
        $content = $content.Replace($oldBlockStart, $newBlockStart)
    } elseif ($content.Contains($oldBlockStartNoCr)) {
        $content = $content.Replace($oldBlockStartNoCr, $newBlockStart.Replace("`r", ""))
    } else {
        Write-Host "Start block not found in $FilePath"
    }

    $oldBlockEnd = "        `;`r`n      }`r`n    } else if (isHospitalGuideGroup) {"
    $oldBlockEndNoCr = "        `;`n      }`n    } else if (isHospitalGuideGroup) {"
    
    $newBlockEnd = "        `;`r`n    } else if (isHospitalGuideGroup) {"
    
    if ($content.Contains($oldBlockEnd)) {
        $content = $content.Replace($oldBlockEnd, $newBlockEnd)
    } elseif ($content.Contains($oldBlockEndNoCr)) {
        $content = $content.Replace($oldBlockEndNoCr, $newBlockEnd.Replace("`r", ""))
    } else {
        Write-Host "End block not found in $FilePath"
    }

    [System.IO.File]::WriteAllText($FilePath, $content, (New-Object System.Text.UTF8Encoding($false)))
    Write-Host "Successfully processed $FilePath"
}

Process-File "app.js"
