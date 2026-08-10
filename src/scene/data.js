// ---------- scene data ----------
const starCount=560,starPos=new Float32Array(starCount*3),starSize=new Float32Array(starCount),starCol=new Float32Array(starCount*3);
for(let i=0;i<starCount;i++){starPos[i*3]=(Math.random()-.5)*38;starPos[i*3+1]=(Math.random()-.32)*20;starPos[i*3+2]=-4-Math.random()*70;starSize[i]=1+Math.random()*3.6;const c=Math.random()<.2?hex('#bd91ff'):Math.random()<.16?hex('#8aefff'):hex('#f8eaff');starCol.set(c,i*3)}
const starBuffers={p:gl.createBuffer(),s:gl.createBuffer(),c:gl.createBuffer()};gl.bindBuffer(gl.ARRAY_BUFFER,starBuffers.p);gl.bufferData(gl.ARRAY_BUFFER,starPos,gl.STATIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,starBuffers.s);gl.bufferData(gl.ARRAY_BUFFER,starSize,gl.STATIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,starBuffers.c);gl.bufferData(gl.ARRAY_BUFFER,starCol,gl.STATIC_DRAW);
const CARD_COUNT=16,LASER_COUNT=288,CYCLE=SEQUENCE_DURATION;
let laserSeeds=[],cardAnchors=[];
const fract=v=>v-Math.floor(v);
function patternPoints(idx){
  const pts=[],mode=idx%5;
  if(mode===0){
    for(let ring=0;ring<12;ring++)for(let j=0;j<24;j++){
      const a=j/24*Math.PI*2+ring*.135,r=.36+ring*.22,petal=1+.09*Math.sin(a*6+ring*.42);
      pts.push([Math.cos(a)*r*petal,Math.sin(a)*r*.70,ring/11,j/24]);
    }
  }else if(mode===1){
    for(let arm=0;arm<8;arm++)for(let j=0;j<36;j++){
      const t=j/35,a=arm/8*Math.PI*2+t*Math.PI*3.45,r=.24+t*2.78;
      pts.push([Math.cos(a)*r,Math.sin(a)*r*.71,t,arm/8]);
    }
  }else if(mode===2){
    for(let y=0;y<16;y++)for(let x=0;x<18;x++){
      const xx=(x-8.5)*.33+Math.sin(y*.78)*.07,yy=(y-7.5)*.24+Math.sin(x*.63+y*.25)*.045;
      pts.push([xx,yy,y/15,x/17]);
    }
  }else if(mode===3){
    for(let petal=0;petal<16;petal++)for(let j=0;j<18;j++){
      const t=j/17,a=petal/16*Math.PI*2+Math.sin(t*Math.PI)*.23,r=.30+t*2.55,wave=1+.11*Math.sin(t*Math.PI*3+petal*.8);
      pts.push([Math.cos(a)*r*wave,Math.sin(a)*r*.72*wave,t,petal/16]);
    }
  }else{
    for(let fan=0;fan<16;fan++)for(let j=0;j<18;j++){
      const t=j/17,spread=(fan-7.5)/7.5,fanOpen=.38+.72*t,r=.36+t*2.4;
      const x=spread*fanOpen*r+.06*Math.sin(fan*.7+t*3.5),y=-1.15+t*2.95+.08*Math.cos(fan*.45+t*2.2);
      pts.push([x,y*.76,t,fan/16]);
    }
  }
  return pts;
}
function cardIndexForPoint(p,mode){
  if(mode===0)return Math.floor(fract(p[3])*CARD_COUNT)%CARD_COUNT;
  if(mode===1)return (Math.floor(fract(p[3])*8)*2+(p[2]>.52?1:0))%CARD_COUNT;
  if(mode===2)return (Math.floor(fract(p[3])*8)*2+(p[2]>.50?1:0))%CARD_COUNT;
  if(mode===4)return Math.floor(fract(p[3])*CARD_COUNT)%CARD_COUNT;
  return Math.floor(fract(p[3])*CARD_COUNT)%CARD_COUNT;
}
function rebuildPattern(idx){
  const mode=idx%5,pts=patternPoints(idx),acc=Array.from({length:CARD_COUNT},()=>({x:0,y:0,l:0,n:0}));
  laserSeeds=pts.slice(0,LASER_COUNT).map((p,i)=>{
    const angle=Math.atan2(p[1]/.72,p[0]),cardIndex=cardIndexForPoint(p,mode);
    const type=(mode===0?(i%6===0?3:1):mode===1?(i%5===0?2:1):mode===2?(i%4===0?4:2):mode===3?(i%5===0?3:1):(i%3===0?1:0));
    const a=acc[cardIndex];a.x+=p[0];a.y+=p[1];a.l+=p[2];a.n++;
    return{x:p[0],y:p[1],layer:p[2],branch:p[3],cardIndex,seed:i*.731+idx*1.17,color:i%7===0?0:i%3===0?1:2,delay:p[2]*.85+(i%6)*.012,phase:fract(i*.61803398875+idx*.137),bulletType:type,bulletRot:angle+(type===1?Math.PI*.5:0)};
  });
  cardAnchors=acc.map((a,i)=>a.n?{x:a.x/a.n,y:a.y/a.n,layer:a.l/a.n}:{x:Math.cos(i/CARD_COUNT*Math.PI*2)*1.7,y:Math.sin(i/CARD_COUNT*Math.PI*2)*1.1,layer:.5});
}
rebuildPattern(0);
function cardPositions(local){
  const arr=[],shot=sequenceState.shot,open=easeOut(smooth((local-.10)/Math.max(.9,shot.safeIn*.72)));
  for(let i=0;i<CARD_COUNT;i++){
    const anchor=cardAnchors[i],a=Math.atan2(anchor.y,anchor.x),breath=.10*Math.sin(time*.63+i*1.71),spread=.70+breath;
    const px=bossPos[0]+anchor.x*spread*open+.10*Math.sin(i*2.17+time*.17)*open;
    const py=bossPos[1]+anchor.y*.59*open+.10*Math.cos(i*1.37+time*.22)*open;
    const pz=bossPos[2]+(anchor.layer-.5)*2.35*open+.32*Math.sin(a*2.0+time*.14+i*.19)*open;
    arr.push({p:[px,py,pz],a,i,anchor});
  }
  return arr;
}
function projectToImpactPlane(p){const dir=norm(sub(p,CAMERA.eye)),den=Math.max(.0001,dot(dir,camForward)),t=dot(sub(impactPlaneCenter,CAMERA.eye),camForward)/den;return add(CAMERA.eye,scale(dir,t))}
function targetWorld(s,local){
  const mode=sequenceState.shot.mode,activeT=Math.max(0,local-.35);
  let rot=0,drift=.02+(.01*Math.sin(time*.78+s.seed)),sx=1,sy=1;
  if(mode===0){rot=.12*Math.sin(activeT*1.4)+.18*activeT;sy=.96;}
  else if(mode===1){rot=.08*Math.sin(activeT*1.2)-.12*activeT;sx=.92;sy=.84;}
  else if(mode===2){rot=.02*Math.sin(activeT*1.8);sx=1.05;sy=.92;}
  else if(mode===3){rot=-.15*Math.sin(activeT*1.25)-.10*activeT;sx=.94;sy=.98;}
  else {rot=.03*Math.sin(activeT*2.0)+.06*activeT;sx=1.08;sy=.88;drift=.028;}
  const cr=Math.cos(rot),sr=Math.sin(rot),wave=Math.sin(time*.78+s.seed);
  const x=(s.x*cr-s.y*sr)*sx+drift*Math.cos(s.seed)+wave*.02*(mode===4?1.5:1.0);
  const y=(s.x*sr+s.y*cr)*sy+drift*Math.sin(s.seed*.73);
  return add(impactPlaneCenter,add(scale(camRight,x),scale(camUp,y)));
}
