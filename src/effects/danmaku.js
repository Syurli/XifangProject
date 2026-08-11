function queueCard(c){
  const pulse=.5+.5*Math.sin(time*2+c.i),col=c.i%3===0?hex('#8fefff'):c.i%2?hex('#c18cff'):hex('#ff659f');
  const rot=[.20*Math.sin(c.a*2+time*.14),-.26*Math.cos(c.a),-c.a+Math.PI/2+Math.sin(time*.65+c.i)*.06],base=compose(c.p,rot,[1,1,1]);
  queue(opaque,meshes.box,child(base,compose([0,0,0],[0,0,Math.PI/4],[.215,.215,.025])),hex('#170d27'),1,.06,.34,.42);
  queue(opaque,meshes.box,child(base,compose([0,0,.018],[0,0,Math.PI/4],[.145,.145,.028])),hex('#322042'),1,.05,.28,.34);
  queue(additive,meshes.torus,child(base,compose([0,0,.055],[0,0,time*.22+c.i],[.105,.105,.038])),col,.58,.98,.58,.04);
  queue(additive,meshes.torus,child(base,compose([0,0,.062],[0,0,-time*.13-c.i*.3],[.165,.165,.025])),mix3(col,[1,1,1],.18),.20,.82,.42,.03);
  for(let k=0;k<4;k++){const a=k*Math.PI/2+time*.06*(c.i%2?1:-1),off=[Math.cos(a)*.19,Math.sin(a)*.19,.07];queue(additive,meshes.sphere,child(base,compose(off,[0,0,0],[.021+.006*pulse,.021+.006*pulse,.014])),k%2?col:hex('#fff7ff'),.58,.95,.52,.02)}
  queue(additive,meshes.sphere,child(base,compose([0,0,.078],[0,0,0],[.043+.010*pulse,.043+.010*pulse,.018])),hex('#fff5ff'),.78,1.2,.4,.03);
}
function laserColor(id){return id===0?hex('#8fefff'):id===1?hex('#c995ff'):hex('#ff5e9f')}
function queueLaserField(cards,local){
  resetLaserBatches();
  const shot=sequenceState.shot;
  // Character close-ups deliberately remove the projection field so the insert reads as a clean reaction shot.
  // Boss wind-up inserts keep a low-weight prelude field because the attack source is the point of the shot.
  if(shot.showField===false)return;
  const focus=player.focus,operation=sequenceState.operation;
  const enter=smooth((local-shot.safeIn)/.38),leave=1-smooth((local-shot.safeOut)/.42),actionMask=enter*leave;
  const actionT=Math.max(0,local-shot.safeIn),front=fract(actionT*.145),front2=fract(front+.43);
  const focusCandidates=[];
  for(let i=0;i<laserSeeds.length;i++){
    const s=laserSeeds[i],start=cards[s.cardIndex].p,end=targetWorld(s,local),col=laserColor(s.color);
    const d1=cyclicDistance(s.layer,front),d2=cyclicDistance(s.layer,front2),primary=1-smooth((d1-.075)/.12),secondary=(1-smooth((d2-.055)/.095))*.42;
    const structural=(i%36===0)?.52:0,wave=Math.max(primary,secondary,structural),activation=actionMask*wave;
    const prelude=operation?0:(1-smooth(Math.abs((local-shot.safeIn*.62)-s.layer*.42)/.55))*.22;
    const visual=Math.max(activation,prelude*(i%8===0?1:.22));if(visual<=.004)continue;
    const pulse=fract(actionT*.28+s.branch*.34+s.phase*.16),charge=rangePulse(pulse,.52,.88,.12),strike=rangePulse(pulse,.86,.99,.045);
    const guideAlpha=visual*(operation?.010:.018),terminalAlpha=visual*(operation?.045:.026);
    if(i%8===0)pushFiberCurve(start,end,focus?.0032:.0048,mix3(col,[1,1,1],.20),guideAlpha,s.seed);
    pushRibbon(start,mix3(start,end,.16),focus?.008:.013,col,guideAlpha*1.5,guideAlpha*.45);
    pushRibbon(mix3(start,end,.84),end,focus?.009:.014,col,terminalAlpha*.42,terminalAlpha*(.72+charge*.45));
    if(i%9===0&&operation&&primary>.35)pushCameraCrossing(end,mix3(col,[1,1,1],.15),visual*.0045,s.seed);
    const typeScale=s.bulletType===2?1.12:s.bulletType===1?1.05:1,size=((focus?8.1:7.1)+primary*(focus?3.2:2.0)+strike*3.6)*typeScale;
    const alpha=visual*((focus?.62:.52)+primary*.16+strike*.18);
    pushImpact(end,size,col,alpha,s.bulletType,s.bulletRot+Math.sin(time*.24+s.seed)*.07);
    const playerPlane=projectToImpactPlane(playerWorldPos()),near=len(sub(end,playerPlane)),danger=primary*.55+strike*.9-near*.12;
    if(focus&&operation&&near<2.15)focusCandidates.push({end,col,near,danger,charge,strike,seed:s.seed});
    if(strike>.42&&i%48===0&&operation)queue(additive,meshes.torus,ringModel(add(end,scale(camForward,-.02)),.10+.10*strike,.08,time*.12+s.seed),col,.08+.10*strike,.72,.48,.02);
  }
  const playerPlane=projectToImpactPlane(playerWorldPos());
  if(player.focus&&operation){
    queue(additive,meshes.torus,ringModel(add(playerPlane,scale(camForward,-.024)),.13,.10,time*.12),hex('#8fefff'),.22,.78,.62,.02);
    queue(additive,meshes.torus,ringModel(add(playerPlane,scale(camForward,-.042)),.06,.09,-time*.18),hex('#fffaff'),.31,1.0,.7,.02);
    focusCandidates.sort((a,b)=>b.danger-a.danger);for(const c of focusCandidates.slice(0,12)){const r=.07+.055*(1-c.charge)+.035*c.strike;queue(additive,meshes.torus,ringModel(add(c.end,scale(camForward,-.018)),r,.085,time*.08+c.seed),c.col,.12+.15*c.charge+.12*c.strike,.72,.52,.02)}
  }
  if(!operation){
    const cue=add(impactPlaneCenter,scale(camUp,-1.62));queue(additive,meshes.torus,ringModel(cue,.18+.025*Math.sin(time*2),.09,time*.08),hex('#fff2ff'),.08,.56,.38,.02);
  }
}
