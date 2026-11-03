from pathlib import Path
import ast, html, base64
root=Path(__file__).parent
tree=ast.parse((root/'build_spec.py').read_text(encoding='utf-8'))
parts=[]
for n in tree.body:
    if not isinstance(n,ast.Expr) or not isinstance(n.value,ast.Call): continue
    c=n.value
    if isinstance(c.func,ast.Name) and c.func.id in ['p','h']:
        text=ast.literal_eval(c.args[0])
        tag='p' if c.func.id=='p' else 'h2'
        parts.append(f'<{tag}>{html.escape(text)}</{tag}>')
    elif isinstance(c.func,ast.Name) and c.func.id=='table':
        headers,rows,widths=[ast.literal_eval(a) for a in c.args]
        parts.append('<table><thead><tr>'+''.join('<th>'+html.escape(t)+'</th>' for t in headers)+'</tr></thead><tbody>')
        for row in rows: parts.append('<tr>'+''.join('<td>'+html.escape(t)+'</td>' for t in row)+'</tr>')
        parts.append('</tbody></table>')
    elif isinstance(c.func,ast.Attribute) and c.func.attr=='add_picture':
        file='01-admin-schedule.png' if '01-admin' in ast.unparse(c) else '02-customer-schedule.png'
        b64=base64.b64encode((root/file).read_bytes()).decode()
        parts.append(f'<figure><img alt="{file}" src="data:image/png;base64,{b64}"></figure>')
text='\n'.join(parts)
page='''<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>검진일정 관리 화면정의서</title><style>
*{box-sizing:border-box}body{margin:0;background:#f2f4f8;color:#172132;font-family:"Malgun Gothic","맑은 고딕",sans-serif;line-height:1.75;font-size:16px}main{max-width:1120px;margin:32px auto;background:white;padding:50px 64px;border-radius:12px}h1{font-size:32px;margin:0 0 16px;color:#101522}h2{font-size:22px;margin:32px 0 12px;color:#101522;break-after:avoid}p{margin:10px 0}table{width:100%;border-collapse:collapse;margin:16px 0 24px;font-size:15px}th,td{border:1px solid #d9d9d9;padding:11px 16px;text-align:left;vertical-align:middle}th{background:#e8edf5;color:#101522}td:first-child{width:23%;font-weight:600}tr{break-inside:avoid}figure{margin:20px 0 36px}img{max-width:100%;height:auto;display:block}nav{display:flex;flex-wrap:wrap;gap:16px;margin:18px 0 28px}a{color:#4130ba}button{background:#5546d8;color:white;border:0;border-radius:8px;padding:10px 18px;font:inherit;cursor:pointer}.actions{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:20px}.meta{color:#677386;font-size:14px}@media(max-width:700px){main{margin:0;padding:24px 18px;border-radius:0}h1{font-size:27px}table{font-size:13px}td,th{padding:8px}.actions{display:block}}@media print{body{background:white;font-size:10.5pt;line-height:1.5}main{margin:0;padding:0;max-width:none}.actions,nav{display:none}h1{font-size:22pt}h2{font-size:14pt;margin-top:18pt}table{font-size:9.5pt}td,th{padding:6pt}figure{break-inside:avoid}img{max-height:170mm;width:auto;max-width:100%}h2:nth-of-type(9),h2:nth-of-type(10){break-before:page}@page{size:A4;margin:17mm}}
</style></head><body><main><div class="actions"><span class="meta">개발요청용 화면정의서</span><button onclick="window.print()">인쇄 또는 PDF 저장</button></div><h1>검진일정 관리 화면정의서</h1><nav><a href="#admin">관리자 화면 보기</a><a href="#customer">고객 화면 보기</a></nav>'''+text+'''</main></body></html>'''
page=page.replace('<h2>9 관리자','<h2 id="admin">9 관리자').replace('<h2>10 고객','<h2 id="customer">10 고객')
(root/'검진일정관리_화면정의서.html').write_text(page,encoding='utf-8')
assert page.count('<table>')==2 and page.count('<figure>')==2
assert '최종 저장' in page and '종료 없음' in page and '동시 수정' in page
print('화면정의서 저장 완료: 본문 10개 절, 표 2개, 화면 이미지 2개')
