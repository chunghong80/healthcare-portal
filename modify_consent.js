const fs = require('fs');

function processFile(filename) {
    let content = fs.readFileSync(filename, 'utf8');

    // 1. Change routing
    content = content.replace(
        /window\.location\.hash = '#\/portal\/' \+ state\.activeClient\.id \+ '\/' \+ state\.activeSite\.siteId \+ '\/' \+ state\.activeMenuId \+ '\/consent';/g,
        `window.location.hash = '#/portal/' + state.activeClient.id + '/' + state.activeSite.siteId + '/' + state.activeMenuId + '/checkup-target';`
    );

    // 2. Extract consent block
    const consentStartRegex = /\} else if \(state\.activeSubId === 'consent'\) \{\s*detailContentHtml = `\s*<div class="consent-wrapper fade-in"[^>]*>([\s\S]*?)<div style="display: flex; gap: 12px; margin-top: 24px;">\s*<button[^>]*>이전<\/button>\s*<button id="btn-next-consent"[^>]*>다음<\/button>\s*<\/div>\s*<\/div>\s*`;/m;
    
    const match = content.match(consentStartRegex);
    if (!match) {
        console.log("Consent block not found in " + filename);
        return;
    }

    let consentHtml = match[1];
    
    // Remove the step 1 badge and title from consentHtml
    consentHtml = consentHtml.replace(/<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 24px;">\s*<span style="background: #2563eb; color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 4px;">STEP 1<\/span>\s*<span style="font-size: 14px; font-weight: 700; color: #475569;">약관 및 개인정보 동의<\/span>\s*<\/div>/, '');

    // Replace the text "다음 단계로 이동할 수 있습니다" with "예약 신청이 가능합니다"
    consentHtml = consentHtml.replace('다음 단계로 이동할 수 있습니다.', '예약 신청이 가능합니다.');

    // Remove the original consent block entirely
    content = content.replace(match[0], '');

    // 3. Insert consentHtml into checkup-summary
    const summaryTargetRegex = /(<div style="display: flex; gap: 12px;">\s*<button onclick="window\.history\.back\(\)"[^>]*>이전 단계<\/button>\s*<button onclick=")([\s\S]*?)(" style="flex: 1; padding: 16px; border-radius: 8px; border: none; background: #2563eb; color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: background 0\.2s;">예약신청완료<\/button>\s*<\/div>\s*<\/div>\s*`;\s*\}\s*\})/m;

    content = content.replace(summaryTargetRegex, (m, p1, p2, p3) => {
        const newOnclick = `window.submitCheckupConsent();\n                ` + p2;
        const disabledStyle = `flex: 1; padding: 16px; border-radius: 8px; border: none; background: #94a3b8; color: white; font-size: 16px; font-weight: 700; cursor: not-allowed; transition: background 0.2s;`;
        
        return consentHtml + `\n            ` + 
               p1 + `id="btn-next-consent" disabled onclick="` + 
               newOnclick + `" style="${disabledStyle}">예약신청완료</button>\n            </div>\n          </div>\n        \`;\n      }\n    }`;
    });

    // 4. Update submitCheckupConsent to NOT change location hash
    content = content.replace(
        /window\.location\.hash = '#\/portal\/' \+ state\.activeClient\.id \+ '\/' \+ state\.activeSite\.siteId \+ '\/' \+ state\.activeMenuId \+ '\/checkup-target';\s*\};/,
        `};`
    );

    // 5. Update STEP numbers 2->1, 3->2, 4->3, 5->4
    content = content.replace(/<span style="([^"]*)">STEP 2<\/span>/g, '<span style="$1">STEP 1</span>');
    content = content.replace(/<span style="([^"]*)">STEP 3<\/span>/g, '<span style="$1">STEP 2</span>');
    content = content.replace(/<span style="([^"]*)">STEP 4<\/span>/g, '<span style="$1">STEP 3</span>');
    content = content.replace(/<span style="([^"]*)">STEP 5<\/span>/g, '<span style="$1">STEP 4</span>');

    fs.writeFileSync(filename, content, 'utf8');
    console.log("Processed " + filename);
}

processFile('c:\\Users\\user\\OneDrive\\Desktop\\헬스케어포털\\app.js');
processFile('c:\\Users\\user\\OneDrive\\Desktop\\헬스케어포털\\m_app.js');
