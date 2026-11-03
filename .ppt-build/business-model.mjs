import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {GlobalFonts} from '@napi-rs/canvas';
const root='C:/Users/user/OneDrive/Desktop/헬스케어포털';
const skill='C:/Users/user/.codex/plugins/cache/openai-primary-runtime/presentations/26.905.11957/skills/presentations';
const tmp=path.join(root,'.ppt-build','business-model');
await fs.mkdir(tmp,{recursive:true});
GlobalFonts.registerFromPath('C:/Windows/Fonts/malgun.ttf','Malgun Gothic');
GlobalFonts.registerFromPath('C:/Windows/Fonts/malgunbd.ttf','Malgun Gothic');
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const p=Presentation.create({slideSize:{width:1280,height:720}}),slides=[];
const F='Malgun Gothic',I='#163344',T='#087D80',M='#556E79',A='#AB641B';
function txt(s,v,x,y,w,h,size=26,color=I,bold=false,alignment='left'){
 const a=s.shapes.add({geometry:'textbox',name:v.slice(0,30),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});
 a.text=v;a.text.style={typeface:F,fontSize:size,color,bold,alignment,autoFit:'none'};return a;
}
function slide(title,sub,notes){
 const s=p.slides.add();slides.push(s);s.background.fill='#FFFFFF';
 txt(s,title,62,43,1155,80,43,I,true);txt(s,sub,64,128,1150,68,24,M);
 txt(s,'헬스케어포털 사업 구조와 구축 목적',64,674,1080,28,15,M);
 txt(s,String(slides.length).padStart(2,'0'),1165,674,48,28,16,T,true);
 s.speakerNotes.textFrame.setText(notes+'\n\n근거: 사용자가 직접 제공한 사업 설명(2026.10.02)과 회원·등급 관련 설명(2026.10.01). 운영·구축 방향은 사용자 요구를 도식화한 설명이며 기술 규격이나 계약 상세 정책을 확정하는 문서는 아니다. A사·B사와 등급명은 설명용 가상 예시다.');return s;
}
function node(s,title,body,x,y,w,h,type='normal',titleSize=28,bodySize=24){
 const color=type==='main'?T:type==='new'?A:I;
 const fill=type==='main'?'#EAF6F4':type==='new'?'#FFF3E5':'#F1F5F7';
 const a=s.shapes.add({geometry:'roundRect',name:title,position:{left:x,top:y,width:w,height:h},fill,line:{fill:color,width:2},borderRadius:12});
 txt(s,title,x+12,y+(body?20:Math.max(12,(h-42)/2)),w-24,54,titleSize,color,true,'center');
 if(body)txt(s,body,x+18,y+78,w-36,h-84,bodySize,I,false,'center');return a;
}
function conn(s,a,b,from='right',to='left',color='#819DA9',kind='straight'){
 return s.shapes.connect(a,b,{kind,fromSide:from,toSide:to,line:{fill:color,width:3,style:'solid'},tail:{type:'triangle',width:'med',length:'med'}});
}
function footer(s,v){txt(s,v,64,610,1150,54,26,T,true);}

// 1. Contracting entities, service operator and beneficiaries.
let s=slide('우리 회사의 B2B 헬스케어 사업 구조','고객사와 위탁계약을 맺고, 고객사의 보험가입·멤버십·EAP 고객에게 서비스를 제공합니다',
'우리 회사의 현재 사업은 B2B 모델입니다. 고객사와 위탁계약을 맺고 그 고객사의 보험가입고객, 멤버십고객, EAP고객에게 헬스케어서비스를 제공합니다. 고객사는 서비스 대상 회원정보와 등급을 정해 제공합니다. 우리 회사는 제공받은 기준에 따라 서비스를 운영합니다. 계약 상대인 고객사와 실제 이용 고객을 구분해 설명합니다. 수익 방식이나 정산 구조는 이번 설명에 포함하지 않습니다.');
const client=node(s,'고객사','위탁계약 체결\n회원정보·등급 제공',64,257,310,213);
const operator=node(s,'우리 회사','콜센터 기반 운영\n대상별 서비스 제공',485,257,310,213,'main');
const users=node(s,'이용 고객','보험가입고객\n멤버십고객\nEAP고객',904,257,310,213);
conn(s,client,operator);conn(s,operator,users);
txt(s,'서비스 위탁',374,317,111,35,18,M,true,'center');
txt(s,'서비스 제공',794,317,111,35,18,M,true,'center');
txt(s,'계약과 대상 기준',64,505,310,40,25,I,true,'center');
txt(s,'헬스케어서비스 운영',485,505,310,40,25,T,true,'center');
txt(s,'혜택 확인과 이용',904,505,310,40,25,I,true,'center');
footer(s,'고객사가 정한 회원·등급 기준에 맞춰 우리 회사가 서비스를 제공합니다.');

// 2. Two operational service branches, rooted in the call center.
s=slide('콜센터를 중심으로 제공하는 헬스케어서비스','상담·검진·진료 지원과 특정질병 진단 고객의 추가 지원을 운영합니다',
'현재 서비스는 콜센터 기반으로 운영합니다. 건강상담, 검진설계 및 건강검진우대예약, 명의나 병원안내, 상급병원 진료예약을 제공합니다. 암·심장질환·뇌혈관질환 등 특정질병을 진단받은 고객에게는 간호사 진료동행과 기타 부가서비스를 제공합니다. 실제 제공 범위는 해당 고객사·등급 조건에 연결합니다. 포털은 이 업무의 안내·이용 창구와 설정·관리 기반으로 설명하며 콜센터 업무의 자동 대체를 전제하지 않습니다.');
const call=node(s,'콜센터','상담 접수\n서비스 안내·연계',64,329,265,175,'main');
const ordinary=node(s,'상담·검진·진료 지원','건강상담 / 검진설계·건강검진우대예약\n명의·병원안내 / 상급병원 진료예약',466,221,748,174,'normal',30,26);
const diagnosis=node(s,'특정질병 진단 고객 지원','암·심장질환·뇌혈관질환 등\n간호사 진료동행 및 기타 부가서비스',466,442,748,159,'new',30,26);
conn(s,call,ordinary,'right','left','#819DA9','elbow');conn(s,call,diagnosis,'right','left',A,'elbow');
footer(s,'고객사와 등급에 따라 제공할 서비스의 범위가 달라집니다.');

// 3. Business variation drives the portal requirement.
s=slide('헬스케어포털이 필요한 이유','여러 고객사의 서로 다른 조건을 홈페이지에 반영하고, 운영 중 변화에도 대응해야 합니다',
'고객사별 계약과 대상 고객의 특성이 다르므로 안내할 서비스와 이용 메뉴가 달라집니다. 같은 고객사 안에서도 등급별 구성이 다를 수 있습니다. 신규 고객사가 계속 추가되고 기존 고객사에도 등급이 추가됩니다. 이를 공통 기반 위에서 전용사이트로 구성하고 관리해야 합니다. 따라서 포털의 사업상 목적은 고객에게 해당 서비스를 보여주는 동시에 관리자가 고객사별 설정을 반복하고 빠르게 런칭할 수 있는 구조를 제공하는 것입니다.');
const v1=node(s,'고객사별 서비스 차이','',64,218,358,92);
const v2=node(s,'고객의 등급·특성 차이','',64,364,358,92);
const v3=node(s,'고객사·등급의 지속 추가','',64,508,358,92,'new',27);
const portal=node(s,'고객사·등급별 전용사이트','회원에게 해당 서비스 안내·제공\n관리자는 정해진 규칙으로 맞춤 설정\n설정 후 빠르게 서비스 런칭',624,263,590,294,'main',31,27);
conn(s,v1,portal,'right','left','#819DA9','elbow');conn(s,v2,portal);conn(s,v3,portal,'right','left',A,'elbow');
footer(s,'포털은 다양한 고객사 조건을 반복해서 설정하고 운영하는 공통 기반입니다.');

// 4. Shared portal framework fans out into client/tier-specific sites.
s=slide('공통 기반에서 고객사·등급별 전용사이트를 구성','전용사이트는 고객사 또는 등급에 맞게 서비스와 노출 구성을 달리하는 개념입니다',
'한 공통 운영 기반에서 고객사별 사이트를 만들거나 필요에 따라 고객사 내 특정 등급의 전용사이트를 만들 수 있습니다. 아래 A사·B사와 기본·VIP는 설명용 예시이며 실제 계약 구성을 뜻하지 않습니다. 회원은 로그인·인증을 통해 소속 고객사와 등급에 맞는 서비스를 확인하고 이용합니다. 사이트 구분, 서비스 이용 자격, 화면 노출은 고객사 기준과 관리자 설정이 함께 연결되어야 합니다.');
const base=node(s,'헬스케어포털 공통 기반','',370,208,540,90,'main',31);
const siteA=node(s,'A사 전용사이트','A사 회원 대상\nA사 서비스·메뉴 구성',64,422,354,170,'normal',27,25);
const siteB1=node(s,'B사 기본등급 사이트','B사 기본등급 대상\n해당 등급 서비스 구성',464,422,354,170,'normal',27,25);
const siteB2=node(s,'B사 VIP등급 사이트','B사 VIP등급 대상\n해당 등급 서비스 구성',864,422,350,170,'new',27,25);
conn(s,base,siteA,'bottom','top','#819DA9','elbow');conn(s,base,siteB1,'bottom','top',T);conn(s,base,siteB2,'bottom','top',A,'elbow');
footer(s,'구성 예시 · 회원은 로그인·인증 후 본인의 고객사·등급에 해당하는 서비스를 이용');

// 5. Common functionality and configurable differences.
s=slide('공통 기능과 고객사별 가변 설정','공통 요소는 재사용하고, 고객사별 차이는 설정으로 반영하는 구조가 필요합니다',
'이 페이지는 사용자 요구에서 도출한 구현 방향입니다. 공통 기반은 로그인·인증과 회원 확인, 서비스 안내·이용의 기본 흐름, 공통 화면과 운영 기능, 고객사·등급 추가 관리를 포함합니다. 가변 설정은 고객사별 서비스 구성, 등급별 제공 범위, 메뉴·콘텐츠 노출 여부, 안내·신청 연결을 뜻합니다. 브랜드 표현은 기존 포털 기획의 사이트별 설정과 연결하는 항목입니다. 가변성이 있어도 서비스 이용 자격은 고객사 기준에 맞게 적용해야 합니다.');
const fixed=node(s,'공통으로 유지할 기반','로그인·인증과 회원 확인\n서비스 안내·이용의 기본 흐름\n공통 화면과 운영 기능\n고객사·등급의 추가 관리',64,224,524,310,'normal',30,27);
const variable=node(s,'고객사별로 달라질 설정','사이트명·브랜드 표현\n고객사·등급별 서비스 구성\n메뉴·콘텐츠의 노출 여부\n서비스별 안내·신청 연결',680,224,534,310,'new',30,27);
const rules=node(s,'공통 규칙 안에서 고객사별 맞춤 구성','',370,590,540,65,'main',27);
conn(s,fixed,rules,'bottom','top','#819DA9','elbow');conn(s,variable,rules,'bottom','top',A,'elbow');

// 6. Administrator setup and launch flow.
s=slide('관리자의 맞춤 설정과 서비스 런칭 흐름','정해진 규칙에 따라 고객사별 구성을 설정하고 확인한 뒤 서비스를 오픈합니다',
'관리자가 고객사의 회원정보·등급 기준을 반영하고 사이트를 생성합니다. 고객사·등급을 사이트에 연결하고 제공서비스와 메뉴 노출을 설정합니다. 고객사·등급별 화면과 이용 가능 서비스를 확인한 후 런칭합니다. 이는 업무 흐름을 설명하는 구축 방향이며 실제 승인 단계나 운영 담당자는 별도 상세 기획에서 정합니다. 중요한 목표는 고객사·등급이 추가될 때 기존 공통 기능을 재사용하고 관리자 설정으로 빠르게 대응하는 것입니다.');
const n1=node(s,'대상 등록','고객사 제공\n회원·등급',64,297,194,196,'normal',27,24);
const n2=node(s,'사이트 생성','고객사·등급\n사이트 연결',303,297,194,196,'normal',27,24);
const n3=node(s,'맞춤 설정','제공서비스\n메뉴 노출',542,297,194,196,'main',27,24);
const n4=node(s,'구성 확인','등급별 화면\n이용 범위',781,297,194,196,'normal',27,24);
const n5=node(s,'서비스 런칭','사이트 오픈\n변경 관리',1020,297,194,196,'main',25,24);
conn(s,n1,n2);conn(s,n2,n3);conn(s,n3,n4);conn(s,n4,n5);
txt(s,'신규 고객사 추가 또는 기존 고객사 등급 추가 시에도 같은 설정 흐름을 적용',64,543,1150,76,28,T,true);

// 7. Implications for the incoming planning, design and engineering team.
s=slide('이번 구축에서 만드는 기본 판','고객사별 전용사이트를 지속적으로 만들고 관리할 수 있는 구조를 함께 설계합니다',
'외부 기획자·디자이너·개발자가 같은 구축 목적을 공유하도록 정리한 구현 방향입니다. 기획은 공통·가변 항목과 관리자 설정 규칙을 정의합니다. 디자인은 공통 화면을 재사용하면서 메뉴 노출과 브랜드가 달라지는 구성을 표현합니다. 개발은 고객사·등급·사이트·서비스를 연결하고 설정 기반으로 구성이 바뀌는 구조를 구현합니다. 이 단계는 상세 기술 설계나 각 서비스의 완료 기준을 확정하는 단계가 아닙니다.');
const foundation=node(s,'공통 기반 + 설정 가능한 구조','',337,211,606,82,'main',31);
const planning=node(s,'기획','공통·가변 항목 정의\n고객사·등급 설정 규칙\n관리자 운영 흐름',64,401,354,191,'normal',31,25);
const design=node(s,'디자인','재사용 가능한 공통 화면\n노출 조합별 화면 구성\n고객사별 브랜드 적용',464,401,354,191,'normal',31,25);
const development=node(s,'개발','고객사·등급·서비스 연결\n설정 기반의 사이트 구성\n신규 고객사·등급 추가',864,401,350,191,'normal',31,25);
conn(s,foundation,planning,'bottom','top','#819DA9','elbow');conn(s,foundation,design,'bottom','top',T);conn(s,foundation,development,'bottom','top','#819DA9','elbow');
footer(s,'목표: 고객사별 맞춤 서비스를 관리자가 빠르게 구성하고 런칭할 수 있는 포털');

const candidate=path.join(tmp,'candidate.pptx');await(await PresentationFile.exportPptx(p)).save(candidate);
const final=path.join(root,'output','헬스케어포털_사업구조와_구축목적_v1.1.pptx');
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:final,pythonExecutable:'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],explicitTotalSlideCount:7,fontPolicy:{basis:'design',families:[F]},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation-v1.1.json')});
for(let i=0;i<slides.length;i++){const b=await p.export({slide:slides[i],format:'png',scale:1});await fs.writeFile(path.join(tmp,`slide-${i+1}.png`),new Uint8Array(await b.arrayBuffer()));}
console.log(final);

