import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {GlobalFonts} from '@napi-rs/canvas';
const root='C:/Users/user/OneDrive/Desktop/헬스케어포털';
const skill='C:/Users/user/.codex/plugins/cache/openai-primary-runtime/presentations/26.1013.11914/skills/presentations';
const tmp=path.join(root,'.ppt-build','tier-concept');await fs.mkdir(tmp,{recursive:true});
GlobalFonts.registerFromPath('C:/Windows/Fonts/malgun.ttf','Malgun Gothic');GlobalFonts.registerFromPath('C:/Windows/Fonts/malgunbd.ttf','Malgun Gothic');
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const p=Presentation.create({slideSize:{width:1280,height:900}}),s=p.slides.add();s.background.fill='#FFFFFF';
const F='Malgun Gothic',N='#15394D',G='#639E31',D='#356A24',L='#E8F1DF',M='#65747D';
function txt(v,x,y,w,h,size=26,color=N,bold=false,alignment='left'){
 const a=s.shapes.add({geometry:'textbox',name:v.slice(0,32),position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=v;a.text.style={typeface:F,fontSize:size,color,bold,alignment,autoFit:'none'};return a;
}
function rect(x,y,w,h,fill,line='none',stroke=0){return s.shapes.add({geometry:'rect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:line,width:stroke}});}
function node(label,x,y,w,h,type='plain',size=26){
 const a=rect(x,y,w,h,type==='member'?N:type==='client'?L:'#F4F6F7',type==='member'?N:type==='client'?G:'#A8BBC5',type==='member'?0:1.5);
 txt(label,x+6,y+(h-40)/2,w-12,44,size,type==='member'?'#FFFFFF':N,true,'center');return a;
}
function connect(a,b,kind='elbow',color='#92A5AE'){
 s.shapes.connect(a,b,{kind,fromSide:'right',toSide:'left',line:{fill:color,width:2.5,style:'solid'},tail:{type:'triangle',width:'med',length:'med'}});
}
txt('고객사별 서비스 등급과 포털 구성',46,26,960,63,39,N,true);
txt('교보다솜케어',1010,41,230,40,25,N,true,'right');
rect(0,99,1280,5,G);
txt('서비스 등급은 회원에게 제공할 서비스의 구성을 구분하는 기준입니다.',48,124,1186,48,29,N,true);
txt('가입 상품·계약 조건에 따라 등급이 달라지며, 한 회원이 여러 고객사·등급에 연결될 수 있습니다.',48,178,1186,48,24,M);
for(const [label,x,w] of [['회원',48,164],['고객사',310,185],['서비스 등급',600,190],['제공서비스·이용조건',910,320]])txt(label,x,240,w,42,25,D,true,'center');
const member=node('회원 1명',48,386,164,92,'member',28);
const clientA=node('고객사 A',310,306,185,84,'client',27);
const clientB=node('고객사 B',310,504,185,84,'client',27);
const tierA1=node('기본등급',600,292,190,70,'plain',27);
const tierA2=node('VIP등급',600,406,190,70,'plain',27);
const tierB1=node('멤버십등급',600,504,190,70,'plain',26);
const serviceA1=node('A사 기본등급 서비스',910,292,320,70,'plain',25);
const serviceA2=node('A사 VIP등급 서비스',910,406,320,70,'plain',25);
const serviceB1=node('B사 멤버십 서비스',910,504,320,70,'plain',25);
connect(member,clientA);connect(member,clientB);
connect(clientA,tierA1);connect(clientA,tierA2);
connect(clientB,tierB1,'straight');
connect(tierA1,serviceA1,'straight');connect(tierA2,serviceA2,'straight');connect(tierB1,serviceB1,'straight');
txt('복수 고객사 가입',43,490,180,42,20,M,false,'center');
txt('A사에서 복수 등급 보유',545,374,298,37,19,M,false,'center');
txt('고객사·등급명은 관계 설명을 위한 예시입니다.',48,604,1186,34,19,M);
txt('운영 중에도 신규 고객사와 기존 고객사의 서비스 등급은 계속 추가됩니다.',48,654,1186,48,28,D,true);
rect(48,713,1184,1,'#D4DED0');
txt('포털 구성에 필요한 사항',48,728,1186,44,29,N,true);
txt('01  고객사별 등급 등록·관리',48,790,550,42,26,D,true);
txt('02  등급별 서비스·이용조건 설정',666,790,566,42,26,D,true);
txt('03  로그인한 회원에게 맞는 서비스 표시',48,841,570,42,25,N);
txt('04  신규 고객사·등급의 지속적인 추가',666,841,566,42,25,N);
rect(0,893,1280,7,G);
s.speakerNotes.textFrame.setText('서비스 등급은 회원에게 제공하는 서비스 구성을 구분하는 기준이다. 동일 고객사에서도 가입 상품이나 계약 조건에 따라 등급이 달라진다. 하나의 회원이 복수 고객사에 속할 수 있으며 동일 고객사에서 복수 등급을 가질 수도 있다. 그림은 A사 기본·VIP등급과 B사 멤버십등급을 함께 가진 한 회원을 예시로 표현했다. 실제 등급명과 혜택 구성은 가상의 예시이며 복수 등급의 서비스 합산·중복 제거 방식은 이 그림으로 확정하지 않는다. 로그인한 회원의 고객사와 등급을 확인해 해당 서비스에 연결하고, 관리자에게 고객사별 등급·서비스·이용조건의 관리 및 추가 기능이 필요함을 설명한다. 근거: 사용자가 제공한 PPT 5페이지와 이번 요청의 본문.');
const candidate=path.join(tmp,'candidate.pptx');await(await PresentationFile.exportPptx(p)).save(candidate);
const final=path.join(root,'output','고객사별_서비스등급_설명슬라이드_v1.0.pptx');
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:final,pythonExecutable:'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,8572500','--validate-heading-fit'],explicitTotalSlideCount:1,fontPolicy:{basis:'design',families:[F]},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation.json')});
const b=await p.export({slide:s,format:'png',scale:1});await fs.writeFile(path.join(tmp,'preview.png'),new Uint8Array(await b.arrayBuffer()));console.log(final);
