var fso = new ActiveXObject('Scripting.FileSystemObject');
var file = fso.OpenTextFile('c:\\Users\\user\\OneDrive\\Desktop\\헬스케어포털\\admin.js', 1);
var code = file.ReadAll();
file.Close();
try {
    eval(code);
    WScript.Echo('No Syntax Errors in eval');
} catch(e) {
    WScript.Echo('Error: ' + e.message + ' on line ' + (e.line || 'unknown'));
}
