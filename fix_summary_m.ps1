$lines = Get-Content "m_app.js" -Encoding UTF8

# First occurrence
$lines[4607] = "                <h3 style=`"font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px;`">약관 및 개인정보 동의</h3>"
$lines[4608] = "                "
$lines[4609] = "            <h2 style=`"font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 12px; margin-top: 12px;`">"
$lines[4610] = "              건강검진 예약 서비스를<br/>이용하기 위해 아래 동의가 필요합니다."
$lines[4611] = "            </h2>"
$lines[4612] = "            <p style=`"font-size: 15px; color: #64748b; margin-bottom: 40px;`">모든 필수 항목에 동의해야 예약 신청이 가능합니다.</p>"
$lines[4613] = ""
$lines[4614] = ""
$lines[4615] = ""
$lines[4616] = ""

# Second occurrence
$lines[4837] = "                <h3 style=`"font-size: 18px; font-weight: 800; color: #0f172a; margin-bottom: 16px;`">약관 및 개인정보 동의</h3>"
$lines[4838] = "                "
$lines[4839] = "            <h2 style=`"font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1.4; margin-bottom: 12px; margin-top: 12px;`">"
$lines[4840] = "              건강검진 예약 서비스를<br/>이용하기 위해 아래 동의가 필요합니다."
$lines[4841] = "            </h2>"
$lines[4842] = "            <p style=`"font-size: 15px; color: #64748b; margin-bottom: 40px;`">모든 필수 항목에 동의해야 예약 신청이 가능합니다.</p>"
$lines[4843] = ""
$lines[4844] = ""
$lines[4845] = ""
$lines[4846] = ""

Set-Content "m_app.js" -Value $lines -Encoding UTF8
