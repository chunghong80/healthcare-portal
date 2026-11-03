import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {Presentation,PresentationFile} from '@oai/artifact-tool';
import {GlobalFonts} from '@napi-rs/canvas';
const root='C:/Users/user/OneDrive/Desktop/헬스케어포털';
const skill='C:/Users/user/.codex/plugins/cache/openai-primary-runtime/presentations/26.905.11957/skills/presentations';
const tmp=path.join(root,'.ppt-build','brief');
await fs.mkdir(tmp,{recursive:true});
GlobalFonts.registerFromPath('C:/Windows/Fonts/malgun.ttf','Malgun Gothic');
GlobalFonts.registerFromPath('C:/Windows/Fonts/malgunbd.ttf','Malgun Gothic');
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const p=Presentation.create({slideSize:{width:1280,height:720}});
const font='Malgun Gothic',ink='#152D3B',teal='#087C82',muted='#536974';
const slides=[];
function text(s,v,x,y,w,h,size=29,color=ink,bold=false){const a=s.shapes.add({geometry:'textbox',position:{left:x,top:y,width:w,height:h},fill:'none',line:{fill:'none',width:0}});a.text=v;a.text.style={typeface:font,fontSize:size,color,bold,autoFit:'none'};return a;}
function slide(title,sub,notes){const s=p.slides.add();slides.push(s);s.background.fill='#FFFFFF';text(s,title,64,46,1150,78,45,ink,true);text(s,sub,66,130,1148,68,25,muted);text(s,'헬스케어포털 업무 소개',66,667,1000,30,16,muted);text(s,String(slides.length).padStart(2,'0'),1160,667,54,30,16,teal,true);s.speakerNotes.textFrame.setText(notes+'\n근거: 사용자 설명(2026.10.01), FEATURES.md의 서비스 구성. 회원정보와 등급은 고객사가 정하여 제공한다. 회사는 로그인·인증을 통해 해당 회원의 서비스를 안내·제공한다. 고객사와 기존 고객사의 등급은 계속 추가된다.');return s;}
function row(s,label,body,y){text(s,label,66,y,265,76,30,teal,true);text(s,body,354,y,852,95,29);}
function table(s,values,widths){const t=s.tables.add({rows:values.length,columns:values[0].length,left:66,top:228,width:1148,height:330,columnWidths:widths,values});t.borders.assign({fill:'#DCE5E8',width:1,style:'solid'});for(let r=0;r<values.length;r++)for(let c=0;c<values[0].length;c++){const a=t.getCell(r,c);a.fill=r===0?ink:(r%2?'#F1F6F7':'#FFFFFF');a.text.style={typeface:font,fontSize:27,color:r===0?'#FFFFFF':ink,bold:r===0||c===0,autoFit:'none'};}return t;}

let s=slide('우리 회사와 헬스케어포털','외부 기획자·개발자를 위한 업무 소개',
'우리 회사는 고객사 회원에게 헬스케어 서비스를 제공합니다. 홈페이지는 회원이 자신의 서비스 혜택을 확인하고 신청하는 창구입니다. 이번 설명의 핵심은 회원정보와 등급을 회사가 임의로 정하지 않고 고객사가 제공한다는 점, 그리고 고객사·등급이 계속 늘어나는 구조입니다.');
row(s,'우리 회사의 업무','고객사 회원에게 건강상담, 진료예약 지원,\n건강검진 예약 등 헬스케어 서비스를 제공합니다.',230);
row(s,'홈페이지의 역할','회원이 본인에게 해당하는 서비스를 확인하고\n이용·신청할 수 있는 창구입니다.',365);
text(s,'회원마다 소속 고객사와 등급에 따라 이용할 수 있는 서비스가 달라집니다.',66,555,1148,82,29,teal,true);

s=slide('고객사와 우리 회사의 역할','회원정보와 등급은 고객사가 정해서 제공합니다',
'고객사는 어떤 회원에게 어떤 등급을 부여할지 정해 전달합니다. 우리 회사는 전달받은 회원정보와 등급을 기준으로 회원을 확인하고, 고객사·등급별 서비스가 홈페이지에 나타나고 이용되도록 운영합니다. 회원정보 전달 방식과 인증 방식은 이 자료의 설명 범위에 포함하지 않습니다.');
table(s,[['구분','고객사','우리 회사'],['회원정보','서비스 대상 회원정보 제공','전달받은 정보로 회원 확인'],['회원 등급','회원별 등급을 결정하여 제공','등급별 제공서비스 연결·관리'],['서비스 이용','대상 회원과 등급의 기준 제공','로그인·인증 후 서비스 안내·제공']],[230,440,478]);
text(s,'우리 회사는 고객사가 제공한 회원정보와 등급을 기준으로 서비스를 운영합니다.',66,593,1148,68,27,teal,true);

s=slide('회원의 로그인과 서비스 이용','인증된 회원의 고객사·등급에 맞는 서비스를 보여줍니다',
'회원이 포털에 접속하면 로그인과 인증 절차를 거칩니다. 확인한 회원정보로 소속 고객사와 등급을 파악하고 그에 해당하는 서비스를 보여줍니다. 회원은 표시된 서비스 내용을 확인하고 상담·예약 등을 신청합니다. 인증을 거쳤다는 이유만으로 모든 고객사·등급의 서비스를 이용할 수 있는 것은 아닙니다.');
row(s,'1. 로그인·인증','홈페이지에 접속한 회원이 누구인지 확인합니다.',220);
row(s,'2. 자격 확인','고객사가 제공한 정보에서 회원의 소속과 등급을 확인합니다.',320);
row(s,'3. 서비스 표시','해당 고객사·등급에 연결된 서비스를 보여줍니다.',420);
row(s,'4. 서비스 이용','회원이 서비스 내용을 확인하고 이용·신청합니다.',520);

s=slide('고객사와 등급은 계속 추가됩니다','운영 중에도 신규 고객사와 기존 고객사의 신규 등급을 반영해야 합니다',
'고객사가 한 번 정해지고 끝나는 홈페이지가 아닙니다. 신규 고객사가 추가되고 기존 고객사 안에도 새로운 등급이 추가됩니다. 신규 고객사는 회원정보·등급·서비스 구성을 새로 반영하고, 기존 고객사의 신규 등급은 해당 고객사 내 등급과 제공서비스에 추가합니다. A사와 B사는 설명용 가상 사례이며 실제 고객사 계약이나 서비스 조건을 뜻하지 않습니다.');
table(s,[['운영 중 변화','예시','홈페이지에 반영할 내용'],['신규 고객사 추가','A사 이용 중 B사 신규 추가','B사 회원·등급·서비스 구성'],['기존 고객사 등급 추가','A사 기본·VIP에 특별등급 추가','A사 특별등급의 제공서비스'],['회원정보 갱신','고객사가 신규·변경 정보 제공','해당 회원의 서비스 이용 기준']],[340,390,418]);
text(s,'고객사와 등급을 추가할 때마다 해당 회원에게 맞는 서비스가 연결되어야 합니다.',66,590,1148,78,27,teal,true);

s=slide('홈페이지에 구현해야 할 핵심 기능','고객사·등급별 서비스 제공과 지속적인 운영 변경을 지원',
'외부 기획자와 개발자가 홈페이지에 구현할 핵심 요구사항은 로그인·인증, 회원의 고객사·등급 확인, 그에 맞는 서비스 표시·이용, 신규 고객사·신규 등급 관리입니다. 관리자에서 고객사·등급과 서비스를 설정·추가하는 구조는 기존 관리자 기획과 연결합니다. 데이터 전달이나 인증 연동의 구체적인 방식은 이후 상세 기획에서 정합니다.');
row(s,'회원 확인','로그인·인증과 고객사·등급 정보 확인',220);
row(s,'맞춤 서비스 제공','고객사·등급에 따라 서비스와 이용·신청 메뉴 표시',320);
row(s,'서비스 연결 관리','고객사별 등급과 제공서비스를 관리자에서 설정',420);
row(s,'추가·변경 대응','신규 고객사·신규 등급과 회원정보 변경을 반영',520);

const candidate=path.join(tmp,'candidate.pptx');await(await PresentationFile.exportPptx(p)).save(candidate);
const final=path.join(root,'output','헬스케어포털_업무소개_간단설명_v1.1.pptx');
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:final,pythonExecutable:'C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe',integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','12192000,6858000','--validate-heading-fit','--require-native-table-slide','2','--require-native-table-slide','4'],explicitTotalSlideCount:5,requiredNativeTableOwnerSlides:[2,4],fontPolicy:{basis:'design',families:[font]},verifyArtifactToolImport:true,receiptPath:path.join(tmp,'validation-v1.1.json')});
for(let i=0;i<slides.length;i++){const b=await p.export({slide:slides[i],format:'png',scale:1});await fs.writeFile(path.join(tmp,`slide-${i+1}.png`),new Uint8Array(await b.arrayBuffer()));}
console.log(final);


