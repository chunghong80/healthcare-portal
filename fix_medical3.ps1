$ErrorActionPreference = "Stop"

function Process-File {
    param([string]$FilePath)
    
    $content = Get-Content -Path $FilePath -Raw -Encoding UTF8

    $oldBlockEnd = "        `;`r`n      }`r`n    } else if (isCheckupGroup) {"
    $oldBlockEndNoCr = "        `;`n      }`n    } else if (isCheckupGroup) {"
    
    $newBlockEnd = "        `;`r`n    } else if (isCheckupGroup) {"
    
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
