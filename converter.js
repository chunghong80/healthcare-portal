const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'app.js');
const targetPath = path.join(__dirname, 'app_utf8.js');

try {
  if (!fs.existsSync(appJsPath)) {
    console.error('app.js file not found!');
    process.exit(1);
  }
  
  const buffer = fs.readFileSync(appJsPath);
  let content;
  
  // UTF-16LE detection
  if (buffer[0] === 0xff && buffer[1] === 0xfe) {
    content = buffer.toString('utf16le');
  } else {
    // Force try UTF-16LE, if it's UTF-16 without BOM
    const testStr = buffer.toString('utf16le');
    if (testStr.includes('\u0000') || (!testStr.includes('function') && !testStr.includes('const'))) {
      // If UTF-16LE looks bad, it might be UTF-8 with duplicate syntax error
      content = buffer.toString('utf8');
    } else {
      content = testStr;
    }
  }
  
  // Also clean up the duplicated broken string from previous replacement if it's there
  if (content.includes('(제휴사)", serviceName: "A기업"')) {
    // Replace the duplicate tail
    content = content.replace(/\(제휴사\)", serviceName: "A기업", csNumber: "1588-1003", clientLink: "", dasomLink: "", themeColor: "#5b21b6", themeColorRgb: "91, 33, 182", logoText: "A기업 복지라운지", heroText: { title: "임직원 복지 라운지", subtitle: "A기업 임직원만을 위한 프리미엄 건강 관리 혜택을 만나보세요." }, menus: \[\] \}\n\};\s*/g, '');
  }
  
  fs.writeFileSync(targetPath, content, 'utf8');
  console.log('SUCCESS: app_utf8.js has been created in UTF-8 format!');
} catch (e) {
  console.error('ERROR during conversion:', e.message);
}
