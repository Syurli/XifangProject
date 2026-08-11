// ---------- math ----------
const M4=()=>new Float32Array(16);
function ident(o){o.fill(0);o[0]=o[5]=o[10]=o[15]=1;return o}
function mul(o,a,b){const r=M4();for(let c=0;c<4;c++)for(let rr=0;rr<4;rr++)r[c*4+rr]=a[rr]*b[c*4]+a[4+rr]*b[c*4+1]+a[8+rr]*b[c*4+2]+a[12+rr]*b[c*4+3];o.set(r);return o}
function T(x,y,z){const o=ident(M4());o[12]=x;o[13]=y;o[14]=z;return o}
function S(x,y,z){const o=ident(M4());o[0]=x;o[5]=y;o[10]=z;return o}
function RX(a){const o=ident(M4()),c=Math.cos(a),s=Math.sin(a);o[5]=c;o[6]=s;o[9]=-s;o[10]=c;return o}
function RY(a){const o=ident(M4()),c=Math.cos(a),s=Math.sin(a);o[0]=c;o[2]=-s;o[8]=s;o[10]=c;return o}
function RZ(a){const o=ident(M4()),c=Math.cos(a),s=Math.sin(a);o[0]=c;o[1]=s;o[4]=-s;o[5]=c;return o}
function compose(p=[0,0,0],r=[0,0,0],s=[1,1,1]){let o=T(...p),q=M4();mul(q,o,RZ(r[2]));mul(o,q,RY(r[1]));mul(q,o,RX(r[0]));mul(o,q,S(...s));return o}
function perspective(o,fovy,asp,n,f){const t=1/Math.tan(fovy/2);o.fill(0);o[0]=t/asp;o[5]=t;o[10]=(f+n)/(n-f);o[11]=-1;o[14]=2*f*n/(n-f);return o}
function sub(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]]}
function add(a,b){return[a[0]+b[0],a[1]+b[1],a[2]+b[2]]}
function scale(a,s){return[a[0]*s,a[1]*s,a[2]*s]}
function len(a){return Math.hypot(a[0],a[1],a[2])}
function norm(a){const d=len(a)||1;return[a[0]/d,a[1]/d,a[2]/d]}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function mix3(a,b,t){return[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)]}
function lookAt(o,e,t,u){const z=norm(sub(e,t)),x=norm(cross(u,z)),y=cross(z,x);ident(o);o[0]=x[0];o[4]=x[1];o[8]=x[2];o[1]=y[0];o[5]=y[1];o[9]=y[2];o[2]=z[0];o[6]=z[1];o[10]=z[2];o[12]=-dot(x,e);o[13]=-dot(y,e);o[14]=-dot(z,e);return o}
function basisMatrix(right,up,forward,pos,s=[1,1,1]){const o=ident(M4());o[0]=right[0]*s[0];o[1]=right[1]*s[0];o[2]=right[2]*s[0];o[4]=up[0]*s[1];o[5]=up[1]*s[1];o[6]=up[2]*s[1];o[8]=forward[0]*s[2];o[9]=forward[1]*s[2];o[10]=forward[2]*s[2];o[12]=pos[0];o[13]=pos[1];o[14]=pos[2];return o}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function lerp(a,b,t){return a+(b-a)*t}
function smooth(t){t=clamp(t,0,1);return t*t*(3-2*t)}
function easeOut(t){t=clamp(t,0,1);return 1-Math.pow(1-t,3)}
function hex(h){h=h.replace('#','');const n=parseInt(h,16);return[((n>>16)&255)/255,((n>>8)&255)/255,(n&255)/255]}
function bezier(a,b,c,d,t){const u=1-t,uu=u*u,tt=t*t;return[
  uu*u*a[0]+3*uu*t*b[0]+3*u*tt*c[0]+tt*t*d[0],
  uu*u*a[1]+3*uu*t*b[1]+3*u*tt*c[1]+tt*t*d[1],
  uu*u*a[2]+3*uu*t*b[2]+3*u*tt*c[2]+tt*t*d[2]]}
function bezierTangent(a,b,c,d,t){const u=1-t;return norm([
  3*u*u*(b[0]-a[0])+6*u*t*(c[0]-b[0])+3*t*t*(d[0]-c[0]),
  3*u*u*(b[1]-a[1])+6*u*t*(c[1]-b[1])+3*t*t*(d[1]-c[1]),
  3*u*u*(b[2]-a[2])+6*u*t*(c[2]-b[2])+3*t*t*(d[2]-c[2])])}
function cyclicDistance(a,b){const d=Math.abs(a-b);return Math.min(d,1-d)}
function rangePulse(v,a,b,soft=.08){return smooth((v-a)/soft)*(1-smooth((v-b)/soft))}
function shotEnvelope(t){const s=Math.sin(Math.PI*clamp(t,0,1));return s*s}
function setupAt(i){return CAMERA_SETUPS[(i%CAMERA_SETUPS.length+CAMERA_SETUPS.length)%CAMERA_SETUPS.length]}
function shotScalar(prop,idx,t){const v=setupAt(idx)[prop];return lerp(v[0],v[1],smooth(t))}
function shotIndexAt(local){
  for(let i=CAMERA_SHOTS.length-1;i>=0;i--)if(local>=SHOT_OFFSETS[i])return i;
  return 0;
}
const view=M4(),proj=M4(),VP=M4();let camForward=[0,-.12,-.99],camRight=[1,0,0],camUp=[0,1,0];
function setVec3(dst,src){dst[0]=src[0];dst[1]=src[1];dst[2]=src[2];}
function applyCameraShot(t){
  const local=((t%SEQUENCE_DURATION)+SEQUENCE_DURATION)%SEQUENCE_DURATION;
  const idx=shotIndexAt(local),shot=CAMERA_SHOTS[idx],segLocal=local-SHOT_OFFSETS[idx],raw=clamp(segLocal/shot.duration,0,1),setup=setupAt(idx);
  // Every setup is an independent camera move. Cuts are hard edits; the camera never interpolates across an edit boundary.
  const eye=bezier(setup.path[0],setup.path[1],setup.path[2],setup.path[3],raw),tangent=bezierTangent(setup.path[0],setup.path[1],setup.path[2],setup.path[3],raw);
  let right=norm(cross(tangent,[0,1,0]));if(len(right)<.001)right=[1,0,0];let up=norm(cross(right,tangent));
  const env=shotEnvelope(raw);
  let roll=shotScalar('roll',idx,raw),lookLift=shotScalar('lookLift',idx,raw),lookSide=shotScalar('lookSide',idx,raw),fov=shotScalar('fov',idx,raw);

  // Active chase: retain forward lead so the new shot is already moving when it appears.
  if(idx===1){lookSide+=.12*env;roll-=.018*env;}
  // Boss wind-up: slight push and breathing roll, but no dead stop in the insert.
  if(idx===2){const charge=smooth(raw);lookLift+=.10*charge;fov-=1.0*charge;}
  // Close parallel combat: keep screen travel toward the same lead side.
  if(idx===3){lookSide+=.28*env;roll-=.028*env;fov-=1.0*env;}
  // Telephoto pass: compression and a restrained pan simulate a near-pass without crossing the action axis.
  if(idx===4){const pass=Math.exp(-Math.pow((raw-.58)/.12,2));const pan=Math.tanh((raw-.55)*6);lookSide+=.46*pan*env;roll+=.055*pan*env;fov+=3.8*pass;}
  // Player close-up: carry previous bank through the cut, then settle rather than resetting posture instantly.
  if(idx===5){const settle=1-smooth(raw);roll+=.035*settle;lookSide-=.08*settle;}
  // Boss second wind-up: hold the eyeline briefly while camera still advances.
  if(idx===6){const hold=1-smooth(Math.abs(raw-.42)/.42);lookLift+=.14*hold;fov-=1.2*hold;}
  // Side-track combat: reduce roll to improve bullet readability but retain lateral parallax.
  if(idx===7){roll*=1-.35*env;lookSide+=.12*env;}
  // Final player insert: preserve action-bank and cut back out before the pose completes.
  if(idx===8){roll+=.030*(1-smooth(raw));lookLift+=.07*env;}
  // Finale: release scale progressively and return close to level without crossing the axis.
  if(idx===9){lookLift+=.18*env;roll*=1-.58*env;fov+=1.2*easeOut(raw);}

  const cr=Math.cos(roll),sr=Math.sin(roll);up=norm(add(scale(up,cr),scale(right,sr)));
  const target=add(add(add(eye,scale(tangent,18)),scale(up,lookLift)),scale(right,lookSide));
  setVec3(CAMERA.eye,eye);setVec3(CAMERA.target,target);setVec3(CAMERA.up,up);CAMERA.fov=clamp(fov,25,46)*Math.PI/180;
  const operation=shot.operation!==false&&segLocal>=shot.safeIn&&segLocal<=shot.safeOut;
  sequenceState={index:idx,patternKey:shot.patternKey,local,segment:segLocal,shot,blend:0,progress:raw,operation,technique:shot.technique};
}
function updateCamera(){lookAt(view,CAMERA.eye,CAMERA.target,CAMERA.up);perspective(proj,CAMERA.fov,W/H,CAMERA.near,CAMERA.far);mul(VP,proj,view);camForward=norm(sub(CAMERA.target,CAMERA.eye));camRight=norm(cross(camForward,CAMERA.up));camUp=norm(cross(camRight,camForward));}
function updateBattleFrame(){
  const idx=sequenceState.index,p=sequenceState.progress,travel=shotEnvelope(p),local=sequenceState.segment;
  const bossSide=shotScalar('bossSide',idx,p)+Math.sin(local*.52+idx)*.10*travel;
  const bossLift=shotScalar('bossLift',idx,p)+Math.sin(local*.72+idx*.8)*.065*travel;
  const bossDepth=shotScalar('bossDepth',idx,p)+Math.cos(local*.35)*.18*travel;
  bossPos=add(add(add(CAMERA.eye,scale(camForward,bossDepth)),scale(camRight,bossSide)),scale(camUp,bossLift));
  const playerSide=shotScalar('playerSide',idx,p),playerLift=shotScalar('playerLift',idx,p),playerDepth=shotScalar('playerDepth',idx,p);
  playerRenderBase=add(add(add(CAMERA.eye,scale(camForward,playerDepth)),scale(camRight,playerSide)),scale(camUp,playerLift));
  const planeDepth=shotScalar('planeDepth',idx,p),planeLift=shotScalar('planeLift',idx,p);
  impactPlaneCenter=add(add(CAMERA.eye,scale(camForward,planeDepth)),scale(camUp,planeLift));
}
function playerWorldPos(){return add(add(playerRenderBase,scale(camRight,player.x)),scale(camUp,player.y))}
