import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {GlobalFonts} from '@napi-rs/canvas';
const root='C:/Users/user/OneDrive/Desktop/헬스케어포털';
const skill='C:/Users/user/.codex/plugins/cache/openai-primary-runtime/presentations/26.905.11957/skills/presentations';
const tmp=path.join(root,'.ppt-build','main-services');await fs.mkdir(tmp,{recursive:true});
GlobalFonts.registerFromPath('C:/Windows/Fonts/malgun.ttf','Malgun Gothic');GlobalFonts.registerFromPath('C:/Windows/Fonts/malgunbd.ttf','Malgun Gothic');
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const p=Presentation.create({slideSize:{width:1280,height:720}}),s=p.slides.add();s.background.fill='#FFFFFF';
const F='Malgun Gothic',I='#163344',T='#087D80',M='#556E79';
function text(v,x,y,w,h,size=26,color=I,bold=false,alignment='left'){const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=v;a.text.style={typeface:F,fontSize:size,color,bold,alignment,autoFit:'none'};return a;}
function box(x,y,w,h,fill,line){return s.shapes.add({geometry:'roundRect',position:{left:x,top:y,width:w,height:h},fill,line:{fill:line,width:2},borderRadius:12});}
text('우리 회사의 5대 주요 헬스케어서비스',64,43,1150,78,43,I,true);
text('고객사 회원을 대상으로 상담, 의료기관 이용, 검진 및 진료동행 서비스를 제공합니다',64,128,1150,55,24,M);
const hub=box(64,344,278,157,'#EAF6F4',T);
text('5대 주요 서비스',76,365,254,47,29,T,true,'center');
text('고객사 회원 대상\n콜센터 기반 안내·연계',76,425,254,68,23,I,false,'center');
const services=[
 ['건강상담','건강 관련 문의와 상담 제공'],
 ['병원(명의)안내','고객의 상황에 맞는 병원과 의료진 안내'],
 ['진료예약','상급병원 진료예약 지원'],
 ['건강검진우대예약','검진설계와 제휴 검진기관 우대예약 지원'],
 ['간호사진료동행','특정질병 진단 고객의 병원 진료에 간호사 동행'],
];
services.forEach(([title,desc],i)=>{
 const y=194+i*93;
 const node=box(476,y,738,80,'#F1F5F7','#A1B5BD');
 text(title,493,y+5,705,39,28,T,true);
 text(desc,493,y+43,705,33,23,I);
 s.shapes.connect(hub,node,{kind:'elbow',fromSide:'right',toSide:'left',line:{fill:'#819DA9',width:2.5,style:'solid'},tail:{type:'triangle',width:'med',length:'med'}});
});
text('고객사와 회원 등급에 따라 제공서비스의 범위를 구성합니다.',64,671,1150,30,20,M);
s.speakerNotes.textFrame.setText('우리 회사의 주요 서비스는 건강상담, 병원(명의)안내, 진료예약, 건강검진우대예약, 간호사진료동행입니다. 현재 콜센터를 기반으로 서비스 안내와 연계를 운영합니다. 건강검진우대예약에는 검진설계와 예약 지원이 포함됩니다. 간호사진료동행은 암·심장질환·뇌혈관질환 등 특정질병을 진단받은 고객에게 제공하는 서비스입니다. 실제 제공 범위는 고객사와 회원 등급 조건에 맞게 구성합니다. 근거: 사용자가 직접 제공한 사업 설명 및 주요서비스 지정(2026.10.02).');
const candidate=path.join(tmp,'candidate.pptx');await(await PresentationFile.exportPptx(p)).save(candidate);
const final=path.join(root,'output','헬스케어포털_5대주요서비스_한페이지_v1.0.pptx');
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:final,pythonExecutable:'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit'],explicitTotalSlideCount:1,fontPolicy:{basis:'design',families:[F]},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation.json')});
const b=await p.export({slide:s,format:'png',scale:1});await fs.writeFile(path.join(tmp,'preview.png'),new Uint8Array(await b.arrayBuffer()));console.log(final);
