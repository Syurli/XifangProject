window.__errors=[];
window.addEventListener('error',e=>window.__errors.push(String(e.message)+' @ '+e.lineno+':'+e.colno+'\n'+(e.error&&e.error.stack||'')));
'use strict';
const canvas=document.getElementById('gl');
const gl=canvas.getContext('webgl',{alpha:false,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
if(!gl){document.body.innerHTML='<div style="padding:30px;color:white">当前浏览器无法创建WebGL上下文。</div>';throw new Error('WebGL unavailable');}
const UI={phase:document.getElementById('phaseText'),focus:document.getElementById('focusState'),fps:document.getElementById('fps'),focusTag:document.getElementById('focusTag'),intro:document.getElementById('intro'),pause:document.getElementById('pause'),reset:document.getElementById('reset'),focusBtn:document.getElementById('focusBtn'),modePill:document.getElementById('modePill'),modeText:document.getElementById('modeText'),cameraState:document.getElementById('cameraState'),skillState:document.getElementById('skillState')};
let W=1,H=1,DPR=1,time=parseFloat(new URLSearchParams(location.search).get('t')||'0')||0,last=performance.now(),paused=false,fpsSmooth=60,patternIndex=-1,focusToggle=new URLSearchParams(location.search).get('focus')==='1';
const keys=Object.create(null);
const CAMERA={...CAMERA_DEFAULT,eye:[...CAMERA_DEFAULT.eye],target:[...CAMERA_DEFAULT.target],up:[...CAMERA_DEFAULT.up]};
const SHOT_OFFSETS=[];let SEQUENCE_DURATION=0;for(const shot of CAMERA_SHOTS){SHOT_OFFSETS.push(SEQUENCE_DURATION);SEQUENCE_DURATION+=shot.duration}
let shotIndex=-1,sequenceState={index:0,local:0,segment:0,shot:CAMERA_SHOTS[0],blend:0,progress:0,operation:false,technique:CAMERA_SHOTS[0].technique};
const player={x:0,y:-1.52,z:0,vx:0,vy:0,focus:false};
let bossPos=[0,1.35,-15.2],impactPlaneCenter=[0,-.05,-3.25],playerRenderBase=[0,0,0];
