$ErrorActionPreference = "Stop"

function Process-File {
    param([string]$FilePath)
    
    $content = Get-Content -Path $FilePath -Raw -Encoding UTF8

    $searchStr = "onclick=`"submitConsulting()`">신청 완료</button>`n          </div>`n        `;`n      }`n    } else if (isCheckupGroup) {"
    $searchStrCr = "onclick=`"submitConsulting()`">신청 완료</button>`r`n          </div>`r`n        `;`r`n      }`r`n    } else if (isCheckupGroup) {"

    $replaceStr = "onclick=`"submitConsulting()`">신청 완료</button>`n          </div>`n        `;`n    } else if (isCheckupGroup) {"
    $replaceStrCr = "onclick=`"submitConsulting()`">신청 완료</button>`r`n          </div>`r`n        `;`r`n    } else if (isCheckupGroup) {"

    if ($content.Contains($searchStrCr)) {
        $content = $content.Replace($searchStrCr, $replaceStrCr)
        Write-Host "Replaced CRLF block in $FilePath"
    } elseif ($content.Contains($searchStr)) {
        $content = $content.Replace($searchStr, $replaceStr)
        Write-Host "Replaced LF block in $FilePath"
    } else {
        Write-Host "Could not find either block in $FilePath"
    }

    [System.IO.File]::WriteAllText($FilePath, $content, (New-Object System.Text.UTF8Encoding($false)))
}

Process-File "app.js"
