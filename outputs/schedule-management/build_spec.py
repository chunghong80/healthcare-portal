from pathlib import Path
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.section import WD_SECTION_START, WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT

out=Path(__file__).parent
d=Document()
s=d.sections[0]
s.page_width=Cm(21); s.page_height=Cm(29.7)
s.top_margin=Cm(1.7); s.bottom_margin=Cm(1.6)
s.left_margin=Cm(1.8); s.right_margin=Cm(1.8)
for name in ['Normal','Title','Heading 1','Heading 2']:
    st=d.styles[name]; st.font.name='맑은 고딕'; st.font.color.rgb=RGBColor(0,0,0)
    st.element.rPr.rFonts.set(qn('w:eastAsia'),'맑은 고딕')
d.styles['Normal'].font.size=Pt(10.5)
d.styles['Normal'].paragraph_format.space_after=Pt(5)
d.styles['Normal'].paragraph_format.line_spacing=1.1
d.styles['Title'].font.size=Pt(23)
d.styles['Heading 1'].font.size=Pt(14)
d.styles['Heading 1'].paragraph_format.space_before=Pt(10)
d.styles['Heading 1'].paragraph_format.space_after=Pt(6)

def p(t): return d.add_paragraph(t)
def h(t): return d.add_heading(t,1)
def table(headers, rows, widths):
    t=d.add_table(rows=1, cols=len(headers)); t.alignment=WD_TABLE_ALIGNMENT.CENTER; t.autofit=False
    for i,a in enumerate(headers): t.rows[0].cells[i].text=a
    for row in rows:
        for c,a in zip(t.add_row().cells,row): c.text=a
    for ri,row in enumerate(t.rows):
        for ci,c in enumerate(row.cells):
            c.width=Cm(widths[ci]); c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
            pr=c._tc.get_or_add_tcPr()
            borders=OxmlElement('w:tcBorders')
            for edge in ['top','left','bottom','right']:
                e=OxmlElement('w:'+edge); e.set(qn('w:val'),'single'); e.set(qn('w:sz'),'4'); e.set(qn('w:color'),'D9D9D9'); borders.append(e)
            pr.append(borders)
            margins=OxmlElement('w:tcMar')
            for edge in ['top','left','bottom','right']:
                e=OxmlElement('w:'+edge); e.set(qn('w:w'),'90'); e.set(qn('w:type'),'dxa'); margins.append(e)
            pr.append(margins)
            if ri==0:
                shade=OxmlElement('w:shd'); shade.set(qn('w:fill'),'E8EDF5'); pr.append(shade)
            for pp in c.paragraphs:
                pp.paragraph_format.space_after=Pt(1)
                for r in pp.runs: r.font.size=Pt(9.5); r.bold=(ri==0)
        rowpr=row._tr.get_or_add_trPr(); rowpr.append(OxmlElement('w:cantSplit'))
    t.rows[0]._tr.get_or_add_trPr().append(OxmlElement('w:tblHeader'))
    d.add_paragraph().paragraph_format.space_after=Pt(0)
    return t

d.add_paragraph('검진일정 관리 화면정의서','Title')
p('개발 요청  |  2026년 10월 14일  |  버전 1.0')
p('병원 관리자와 다솜케어 관리자가 병원별 휴일과 장비검사 마감을 관리하고, 고객은 저장된 일정만 조회합니다. 날짜 선택과 설정 버튼은 즉시 반영하지 않으며, 변경 목록을 확인한 뒤 최종 저장합니다.')
h('1 사용자와 권한')
table(['사용자','조회 및 관리 범위'],[
('병원 관리자','본인 병원 일정 조회 및 휴일·검사 마감 설정과 해제'),
('다솜케어 관리자','권한이 있는 병원 선택 후 동일한 관리 기능 사용'),
('고객','병원 일정과 검사 가능 여부 조회만 가능')],[4,13.4])
h('2 관리자 화면 구성')
table(['영역','필요 기능'],[
('상단','병원 선택, 변경 이력. 병원 관리자는 본인 병원으로 고정'),
('달력','월 이동, 저장된 상태 표시, 선택 날짜와 저장 전 변경 구분'),
('날짜 선택','하루 / 복수 날짜 / 기간 중 선택. 월을 이동해도 선택 유지'),
('기간 선택','시작일·종료일 직접 입력, 1일·1주·1개월·3개월 빠른 선택'),
('반복 요일','기간 안에서 토요일 등 요일 복수 선택. 종료 없음도 설정 가능'),
('휴일 설정','휴일 설정 / 휴일 해제 선택, 사유 입력. 병원 전체에 적용'),
('검사 마감','검사 검색·복수 선택, 검사군 선택, 마감 설정 / 마감 해제'),
('변경 목록','날짜·검사·설정 내용·사유 확인, 항목 제거, 전체 변경 취소'),
('하단 버튼','변경 목록에 담기 → 최종 저장. 변경이 없으면 저장 비활성')],[4,13.4])
h('3 날짜 선택 방식')
p('하루는 날짜 1개만 선택합니다. 복수 날짜는 클릭할 때마다 선택·해제하며, 띄엄띄엄 선택할 수 있습니다. 기간은 시작일과 종료일을 포함한 모든 날짜를 선택합니다.')
p('반복 요일은 기간 방식에서 사용합니다. 예를 들어 10월 전체와 토요일을 선택하면 해당 기간의 토요일만 대상이 됩니다. 종료 없음은 반복 설정에만 허용하며, 저장 후 해제할 때까지 유지합니다.')
p('빠른 기간은 시작일 기준입니다. 1일은 당일, 1주는 7일, 1개월·3개월은 해당 개월 뒤 같은 날짜의 전날까지입니다. 말일은 달력에 맞춰 보정하고 계산된 종료일을 표시합니다.')

d.add_page_break()
h('4 설정과 최종 저장')
p('① 병원과 날짜를 선택합니다. ② 휴일 또는 검사 마감과 사유를 입력합니다. ③ 변경 목록에 담습니다. ④ 목록을 확인하고 최종 저장을 누릅니다. ⑤ 대상 병원·날짜·검사·변경 건수·영향 예약을 확인한 뒤 저장 확정을 누릅니다.')
p('변경 목록에 담기 전에는 입력폼만 바뀝니다. 목록에 담은 후에는 관리자 달력에 저장 전 미리보기를 표시합니다. 고객은 저장 확정에 성공한 변경만 확인합니다. 휴일 예시 영역은 설명용이며, 실제 화면에서는 선택한 설정 탭의 입력폼만 표시합니다.')
h('5 적용과 해제 기준')
p('휴일은 병원 전체의 신규 날짜 선택을 막습니다. 검사 마감은 선택한 검사만 막으며, 다른 검사는 가능합니다. 둘이 겹치면 고객에게 휴일을 우선 표시하고 상세에서 검사 마감도 확인할 수 있습니다.')
p('휴일과 검사 마감은 별도로 유지합니다. 휴일 해제는 검사 마감을 해제하지 않으며, 검사 마감 해제는 병원 휴일을 해제하지 않습니다. 해제 후에도 기본 운영일·예약 가능 기간 등 기존 조건을 다시 확인합니다.')
p('검사군은 병원에 연결된 표준검사 기준으로 적용합니다. 예를 들어 대장내시경 전체는 수면·비수면을 포함합니다. 동일 자원에 해당하는 검사만 그룹으로 묶고, 저장 시 실제 대상 검사 목록을 확정합니다.')
p('겹치는 날짜에 설정과 해제가 함께 담기면 충돌 위치를 안내하고 정리 전 저장을 막습니다. 반복 설정과 하루 예외는 별도 보관하며, 하루 예외가 우선합니다. 반복 규칙 수정·삭제는 지정한 적용일부터 반영합니다.')
h('6 기존 예약과 저장 안전장치')
p('기존 예약은 자동 취소·변경하지 않습니다. 저장 확인창에 영향 예약 건수와 조회 링크를 표시하고, 영향 예약이 있으면 확인 체크 후 저장합니다. 일정 변경 후 해당 예약의 조치는 신청내역에서 별도로 처리합니다.')
p('날짜·검사 누락, 시작일이 종료일보다 늦은 경우는 목록에 담을 수 없습니다. 사유는 필수입니다. 미저장 상태에서 병원 전환이나 화면 이탈 시 변경 내용을 버릴지 확인합니다.')
p('같은 병원 일정을 다른 관리자가 먼저 바꿨다면 변경 내용을 다시 확인하도록 안내합니다. 최종 저장은 전체 성공 또는 전체 실패로 처리하고, 실패 시 변경 목록을 유지합니다. 변경 이력에는 관리자·일시·대상·변경 전후 값·사유를 남깁니다.')
h('7 고객 조회 화면')
p('병원·패키지·추가검사를 기준으로 월별 달력과 날짜 상세를 보여줍니다. 휴일, 필요한 검사 마감, 선택 가능을 글자와 색상으로 구분합니다. 휴일·마감일도 눌러 상세 사유를 볼 수 있지만 신청 날짜로 선택할 수는 없습니다.')
p('패키지 필수검사 또는 선택한 추가검사가 하나라도 마감이면 그 구성으로 날짜 선택을 막습니다. 선택형 검사는 고객이 실제로 선택한 검사만 판단합니다. 신청 최종 제출 시 최신 저장 상태를 다시 확인합니다.')
h('8 개발 완료 확인')
p('하루·비연속 복수 날짜·월을 넘는 기간 선택, 매주 토요일 반복 휴일, 3개월 검사군 마감, 저장 전 고객 미반영, 저장 후 반영, 휴일과 마감의 독립 해제, 기존 예약 유지, 동시 수정 충돌을 확인합니다.')

s=d.add_section(WD_SECTION_START.NEW_PAGE)
s.orientation=WD_ORIENT.LANDSCAPE; s.page_width=Cm(29.7); s.page_height=Cm(21)
s.top_margin=Cm(1.2); s.bottom_margin=Cm(1.2); s.left_margin=Cm(1.4); s.right_margin=Cm(1.4)
h('9 관리자 화면 구성안')
p('병원·다솜케어 관리자 공통 화면. 반복 휴일 영역은 휴일 탭에서 제공하는 입력 예시입니다.')
d.add_picture(str(out/'01-admin-schedule.png'),width=Cm(22))
d.add_page_break()
h('10 고객 조회 화면 구성안')
p('저장된 상태만 표시합니다. MRI가 마감된 날짜의 패키지 선택 제한을 보여주는 예시입니다.')
d.add_picture(str(out/'02-customer-schedule.png'),width=Cm(24))
d.save(out/'검진일정관리_화면정의서.docx')
print(out/'검진일정관리_화면정의서.docx')
