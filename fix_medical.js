const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

// 1. Remove the opening brace for !state.activeSubId
const startStr = "} else if (isMedicalApptGroup) {";
const startIdx = content.indexOf(startStr);
if (startIdx !== -1) {
    const nextIfIdx = content.indexOf("if (!state.activeSubId) {", startIdx);
    if (nextIfIdx !== -1 && nextIfIdx < startIdx + 100) {
        // Remove it
        const before = content.substring(0, nextIfIdx);
        const after = content.substring(nextIfIdx + 25);
        content = before + after;
        console.log("Removed opening brace!");
    } else {
        console.log("Opening brace not found right after startStr.");
    }
} else {
    console.log("startStr not found.");
}

// 2. Remove the closing brace right before `} else if (isCheckupGroup) {`
const endStr = "} else if (isCheckupGroup) {";
const endIdx = content.indexOf(endStr, startIdx);
if (endIdx !== -1) {
    // Find the nearest closing brace before `} else if (isCheckupGroup) {`
    // The previous text should be like:
    //         `;
    //       }
    //     } else if (isCheckupGroup) {
    const beforeEndStr = content.substring(endIdx - 100, endIdx);
    const lastBraceIdx = beforeEndStr.lastIndexOf("}");
    if (lastBraceIdx !== -1) {
        const globalBraceIdx = endIdx - 100 + lastBraceIdx;
        const before = content.substring(0, globalBraceIdx);
        const after = content.substring(globalBraceIdx + 1);
        content = before + after;
        console.log("Removed closing brace!");
    } else {
        console.log("Closing brace not found before endStr.");
    }
} else {
    console.log("endStr not found.");
}

fs.writeFileSync('app.js', content, 'utf8');
console.log("Done");
