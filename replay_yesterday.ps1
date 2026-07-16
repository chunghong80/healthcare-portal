$transcriptPath = "C:\Users\user\.gemini\antigravity\brain\92b04564-1f37-442b-b440-08cfe7d7f48c\.system_generated\logs\transcript_full.jsonl"
$filesToReplay = @("app.js", "m_app.js")

git checkout HEAD app.js m_app.js

$fileContents = @{}
foreach ($f in $filesToReplay) {
    $fileContents[$f] = Get-Content -Path $f -Raw -Encoding UTF8
}

Write-Host "=== REPLAYING YESTERDAY ==="

$lines = Get-Content -Path $transcriptPath -Encoding UTF8
foreach ($line in $lines) {
    $obj = $line | ConvertFrom-Json
    if ($obj.type -eq 'PLANNER_RESPONSE') {
        if ($obj.tool_calls) {
            foreach ($tc in $obj.tool_calls) {
                $name = $tc.name
                $args = $tc.args
                $targetFile = $args.TargetFile
                
                if ([string]::IsNullOrEmpty($targetFile)) { continue }
                
                $matchedFile = $null
                foreach ($f in $filesToReplay) {
                    if ($targetFile.EndsWith($f)) {
                        $matchedFile = $f
                        break
                    }
                }
                
                if (-not $matchedFile) { continue }
                
                $content = $fileContents[$matchedFile]
                
                if ($name -eq 'replace_file_content') {
                    $target = $args.TargetContent
                    $repl = $args.ReplacementContent
                    
                    if ($content.Contains($target)) {
                        $content = $content.Replace($target, $repl)
                        Write-Host "[$matchedFile] Applied replace_file_content at step $($obj.step_index)"
                    } else {
                        $targetCrlf = $target.Replace("`n", "`r`n")
                        $targetLf = $target.Replace("`r`n", "`n")
                        if ($content.Contains($targetCrlf)) {
                            $content = $content.Replace($targetCrlf, $repl.Replace("`n", "`r`n"))
                            Write-Host "[$matchedFile] Applied CRLF replace_file_content at step $($obj.step_index)"
                        } elseif ($content.Contains($targetLf)) {
                            $content = $content.Replace($targetLf, $repl.Replace("`r`n", "`n"))
                            Write-Host "[$matchedFile] Applied LF replace_file_content at step $($obj.step_index)"
                        } else {
                            Write-Host "[$matchedFile] FAILED replace_file_content at step $($obj.step_index)"
                        }
                    }
                    $fileContents[$matchedFile] = $content
                }
                elseif ($name -eq 'multi_replace_file_content') {
                    $chunks = $args.ReplacementChunks
                    $i = 0
                    foreach ($chunk in $chunks) {
                        $target = $chunk.TargetContent
                        $repl = $chunk.ReplacementContent
                        
                        if ($content.Contains($target)) {
                            $content = $content.Replace($target, $repl)
                            Write-Host "[$matchedFile] Applied multi_replace chunk $i at step $($obj.step_index)"
                        } else {
                            $targetCrlf = $target.Replace("`n", "`r`n")
                            $targetLf = $target.Replace("`r`n", "`n")
                            if ($content.Contains($targetCrlf)) {
                                $content = $content.Replace($targetCrlf, $repl.Replace("`n", "`r`n"))
                                Write-Host "[$matchedFile] Applied CRLF multi_replace chunk $i at step $($obj.step_index)"
                            } elseif ($content.Contains($targetLf)) {
                                $content = $content.Replace($targetLf, $repl.Replace("`r`n", "`n"))
                                Write-Host "[$matchedFile] Applied LF multi_replace chunk $i at step $($obj.step_index)"
                            } else {
                                Write-Host "[$matchedFile] FAILED multi_replace chunk $i at step $($obj.step_index)"
                            }
                        }
                        $i++
                    }
                    $fileContents[$matchedFile] = $content
                }
                elseif ($name -eq 'write_to_file') {
                    $fileContents[$matchedFile] = $args.CodeContent
                    Write-Host "[$matchedFile] Applied write_to_file at step $($obj.step_index)"
                }
            }
        }
    }
}

foreach ($f in $filesToReplay) {
    [System.IO.File]::WriteAllText($f, $fileContents[$f], (New-Object System.Text.UTF8Encoding($false)))
}

Write-Host "Replay finished!"
