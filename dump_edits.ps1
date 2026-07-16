$transcriptPath = "C:\Users\user\.gemini\antigravity\brain\92b04564-1f37-442b-b440-08cfe7d7f48c\.system_generated\logs\transcript_full.jsonl"

$lines = Get-Content -Path $transcriptPath -Encoding UTF8
$output = ""

foreach ($line in $lines) {
    $obj = $line | ConvertFrom-Json
    if ($obj.type -eq 'PLANNER_RESPONSE') {
        if ($obj.tool_calls) {
            foreach ($tc in $obj.tool_calls) {
                if ($tc.args.TargetFile -match "app.js") {
                    $output += "========== STEP $($obj.step_index) : $($tc.name) ==========`n"
                    if ($tc.name -eq 'replace_file_content') {
                        $output += "--- TARGET ---`n$($tc.args.TargetContent)`n--- REPLACEMENT ---`n$($tc.args.ReplacementContent)`n`n"
                    } elseif ($tc.name -eq 'multi_replace_file_content') {
                        foreach ($chunk in $tc.args.ReplacementChunks) {
                            $output += "--- TARGET ---`n$($chunk.TargetContent)`n--- REPLACEMENT ---`n$($chunk.ReplacementContent)`n`n"
                        }
                    }
                }
            }
        }
    }
}

Set-Content -Path "app_js_edits.txt" -Value $output -Encoding UTF8
