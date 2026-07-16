$lines = Get-Content "app.js" -Encoding UTF8

$lines[4664] = "                <h3 style=`"font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px;`">약관 및 개인정보 동의</h3>"
$lines[4665] = "                "
$lines[4666] = "            <h2 style=`"font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 12px; margin-top: 12px;`">"
$lines[4667] = "              건강검진 예약 서비스를<br/>이용하기 위해 아래 동의가 필요합니다."
$lines[4668] = "            </h2>"
$lines[4669] = "            <p style=`"font-size: 15px; color: #64748b; margin-bottom: 40px;`">모든 필수 항목에 동의해야 예약 신청이 가능합니다.</p>"
$lines[4670] = ""
$lines[4671] = ""
$lines[4672] = ""
$lines[4673] = ""

Set-Content "app.js" -Value $lines -Encoding UTF8
