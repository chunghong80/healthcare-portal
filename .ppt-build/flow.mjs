import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {GlobalFonts} from '@napi-rs/canvas';
const root='C:/Users/user/OneDrive/Desktop/헬스케어포털';
const skill='C:/Users/user/.codex/plugins/cache/openai-primary-runtime/presentations/26.905.11957/skills/presentations';
const tmp=path.join(root,'.ppt-build','flow');await fs.mkdir(tmp,{recursive:true});
GlobalFonts.registerFromPath('C:/Windows/Fonts/malgun.ttf','Malgun Gothic');GlobalFonts.registerFromPath('C:/Windows/Fonts/malgunbd.ttf','Malgun Gothic');
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const p=Presentation.create({slideSize:{width:1280,height:720}});const slides=[];
const F='Malgun Gothic',I='#173344',T='#087F82',M='#58707A',A='#AF6A15';
function txt(s,v,x,y,w,h,size=26,color=I,bold=false,align='left'){const o=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});o.text=v;o.text.style={typeface:F,fontSize:size,color,bold,alignment:align,autoFit:'none'};return o;}
function slide(title,sub,notes){const s=p.slides.add();slides.push(s);s.background.fill='#FFFFFF';txt(s,title,64,45,1152,77,45,I,true);txt(s,sub,66,129,1148,58,25,M);txt(s,'헬스케어포털 업무 흐름',66,672,1000,28,16,M);txt(s,String(slides.length).padStart(2,'0'),1164,672,48,28,16,T,true);s.speakerNotes.textFrame.setText(notes+'\n근거: 사용자가 직접 설명한 업무 구조(2026.10.01). 고객사는 회원정보와 등급을 정해 제공하고, 회사는 로그인·인증을 통해 고객에게 해당하는 서비스를 보여주고 제공한다. 고객사와 기존 고객사의 등급은 계속 추가된다. 서비스 예시는 FEATURES.md 참고.');return s;}
function node(s,title,body,x,y,w,h,variant='normal'){
 const color=variant==='new'?A:variant==='main'?T:I;
 const fill=variant==='new'?'#FFF4E4':variant==='main'?'#EAF6F5':'#F1F5F7';
 const shape=s.shapes.add({geometry:'roundRect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:color,width:2},borderRadius:12});
 txt(s,title,x+12,y+(body?18:Math.max(14,(h-42)/2)),w-24,50,29,color,true,'center');
 if(body)txt(s,body,x+14,y+76,w-28,h-82,24,I,false,'center');
 return shape;
}
function conn(s,a,b,from='right',to='left',color='#83A1AD',kind='straight'){
 return s.shapes.connect(a,b,{kind,fromSide:from,toSide:to,line:{fill:color,width:3,style:'solid'},tail:{type:'triangle',width:'med',length:'med'}});
}

let s=slide('고객사·우리 회사·회원의 업무 관계','고객사는 이용 대상을 정하고, 우리 회사는 해당 회원의 서비스를 운영합니다',
'이 그림은 고객사와 회사, 회원의 역할 관계입니다. 고객사는 회원정보와 등급을 결정해 제공합니다. 회사는 그 정보를 기준으로 로그인한 회원의 고객사와 등급을 확인하고 해당 서비스를 보여주고 제공합니다. 회원은 홈페이지에서 혜택을 확인하고 이용·신청합니다.');
const customer=node(s,'고객사','회원정보 제공\n회원별 등급 결정',66,245,310,177);
const company=node(s,'우리 회사','회원 확인\n등급별 서비스 연결',485,245,310,177,'main');
const member=node(s,'회원','로그인·인증\n서비스 확인·이용',904,245,310,177);
conn(s,customer,company);conn(s,company,member);
txt(s,'정보 전달',374,292,112,42,20,M,true,'center');
txt(s,'서비스 제공',788,292,124,36,17,M,true,'center');
txt(s,'헬스케어포털',485,199,310,40,24,T,true,'center');
txt(s,'제공 서비스 예시',66,479,1148,43,26,I,true);
txt(s,'건강상담      진료예약 지원      건강검진 예약      건강정보',66,533,1148,52,28,T);
txt(s,'회원정보와 등급의 결정 주체는 고객사입니다.',66,610,1148,43,25,I,true);

s=slide('로그인부터 서비스 이용까지의 흐름','고객사가 제공한 회원정보·등급을 기준으로 서비스가 달라집니다',
'회원은 로그인과 인증을 거칩니다. 회사는 고객사가 제공한 회원정보에서 소속 고객사와 등급을 확인하고 그에 맞는 서비스를 보여줍니다. 회원은 표시된 혜택을 확인해 이용·신청합니다. 전달 방법이나 인증 기술을 정하는 그림이 아니라 업무 흐름입니다.');
const data=node(s,'고객사 정보','',365,208,250,82);
txt(s,'회원정보 + 회원별 등급',350,170,280,35,21,M,false,'center');
const login=node(s,'로그인·인증','회원 확인',65,370,240,150);
const identify=node(s,'소속·등급','회원정보 기준 확인',370,370,240,150,'main');
const display=node(s,'서비스 표시','회원별 혜택 안내',675,370,240,150,'main');
const apply=node(s,'서비스 이용','상담·예약 신청',980,370,235,150);
conn(s,login,identify);conn(s,identify,display);conn(s,display,apply);conn(s,data,identify,'bottom','top',T);
txt(s,'같은 홈페이지를 이용해도 고객사와 등급에 따라 서비스가 달라집니다.',65,572,1150,72,29,T,true);

s=slide('고객사·등급 추가와 서비스 연결','처음 정한 구성에 고정하지 않고, 운영 중 추가되는 고객사·등급을 반영합니다',
'A사와 B사는 설명용 가상 사례입니다. 기존 고객사 A사에 신규 등급이 생기면 A사의 등급 목록에 추가하고 해당 등급 서비스를 연결합니다. 신규 고객사 B사가 추가되면 B사의 회원정보와 등급을 반영하고 등급별 서비스를 연결합니다. 따라서 홈페이지에는 고객사·등급·제공서비스를 계속 추가하고 관리하는 기능이 필요합니다.');
txt(s,'기존 고객사에 새로운 등급 추가',66,198,1148,43,27,I,true);
const a=node(s,'고객사 A사','',66,282,245,96);
const old=node(s,'기본·VIP 등급','',463,250,308,69);
const add=node(s,'새 등급 추가','',463,356,308,69,'new');
const serv=node(s,'서비스 연결','',944,282,270,96,'main');
conn(s,a,old,'right','left','#83A1AD','elbow');conn(s,a,add,'right','left',A,'elbow');
conn(s,old,serv,'right','left','#83A1AD','elbow');conn(s,add,serv,'right','left',A,'elbow');
txt(s,'신규 고객사 추가',66,452,1148,43,27,I,true);
const b=node(s,'신규 B사','',66,519,245,82,'new');
const tiers=node(s,'회원정보·등급 반영','',463,519,308,82,'new');
const bs=node(s,'서비스 연결','',944,519,270,82,'main');
conn(s,b,tiers,'right','left',A);conn(s,tiers,bs,'right','left',A);
txt(s,'홈페이지에 필요한 관리 기능: 고객사 등록, 등급 추가, 등급별 제공서비스 설정',66,622,1148,42,24,T,true);

const candidate=path.join(tmp,'candidate.pptx');await(await PresentationFile.exportPptx(p)).save(candidate);
const final=path.join(root,'output','헬스케어포털_업무흐름도_v1.1.pptx');
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:final,pythonExecutable:'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],explicitTotalSlideCount:3,fontPolicy:{basis:'design',families:[F]},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation-v1.1.json')});
for(let i=0;i<slides.length;i++){const blob=await p.export({slide:slides[i],format:'png',scale:1});await fs.writeFile(path.join(tmp,`slide-${i+1}.png`),new Uint8Array(await blob.arrayBuffer()));}
console.log(final);

