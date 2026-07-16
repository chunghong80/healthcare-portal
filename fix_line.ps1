$lines = Get-Content "app.js" -Encoding UTF8
$lines[3513] = ""
Set-Content "app.js" -Value $lines -Encoding UTF8
