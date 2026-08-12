function queueCard(c){
  const profile=visualProfile(),pulse=.5+.5*Math.sin(time*2+c.i),col=c.i%3===0?hex('#8fefff'):c.i%2?hex('#c18cff'):hex('#ff659f'),cs=profile.cardScale||1;
  const rot=[.20*Math.sin(c.a*2+time*.14),-.26*Math.cos(c.a),-c.a+Math.PI/2+Math.sin(time*.65+c.i)*.06],base=compose(c.p,rot,[cs,cs,cs]);
  queue(opaque,meshes.box,child(base,compose([0,0,0],[0,0,Math.PI/4],[.215,.215,.025])),hex('#170d27'),1,.06,.34,.42);
  queue(opaque,meshes.box,child(base,compose([0,0,.018],[0,0,Math.PI/4],[.145,.145,.028])),hex('#322042'),1,.05,.28,.34);
  queue(additive,meshes.torus,child(base,compose([0,0,.055],[0,0,time*.22+c.i],[.105,.105,.038])),col,.42*profile.bloom,.86,.52,.035);
  queue(additive,meshes.torus,child(base,compose([0,0,.062],[0,0,-time*.13-c.i*.3],[.165,.165,.025])),mix3(col,[1,1,1],.18),.14*profile.bloom,.72,.38,.025);
  for(let k=0;k<4;k++){const a=k*Math.PI/2+time*.06*(c.i%2?1:-1),off=[Math.cos(a)*.19,Math.sin(a)*.19,.07];queue(additive,meshes.sphere,child(base,compose(off,[0,0,0],[.018+.004*pulse,.018+.004*pulse,.012])),k%2?col:hex('#fff7ff'),.34*profile.bloom,.80,.42,.018)}
  queue(additive,meshes.sphere,child(base,compose([0,0,.078],[0,0,0],[.036+.008*pulse,.036+.008*pulse,.016])),hex('#fff5ff'),.52*profile.bloom,1.0,.34,.025);
}
function laserColor(id){return id===0?hex('#8fefff'):id===1?hex('#c995ff'):hex('#ff5e9f')}
function queueLaserField(cards,local){
  resetLaserBatches();
  const shot=sequenceState.shot,focus=player.focus,operation=sequenceState.operation,profile=visualProfile();
  const cinematic=!operation,itano=shot.role&&shot.role.startsWith('ITANO'),hero=shot.role==='PLAYER_CLOSE';
  if(hero)return;

  const actionT=local,front=fract(actionT*.145+shot.phase*.11),front2=fract(front+.43),focusCandidates=[];
  const structuralRate=Math.max(24,profile.structuralRate|0),sampleStride=itano?2:1;
  const edgeFade=operation?smooth(local/.28)*(1-smooth((local-shot.duration+.28)/.28)):1;

  for(let i=0;i<laserSeeds.length;i+=sampleStride){
    const s=laserSeeds[i],start=cards[s.cardIndex].p,end=targetWorld(s,local),col=laserColor(s.color);
    const d1=cyclicDistance(s.layer,front),d2=cyclicDistance(s.layer,front2),primary=1-smooth((d1-.075)/.12),secondary=(1-smooth((d2-.055)/.095))*.36;
    const structural=(i%structuralRate===0)?.42:0;
    let wave=Math.max(primary,secondary,structural);
    if(cinematic&&!itano)wave*=.22;
    if(itano){
      const lane=fract(s.phase+local*.24),lanePulse=rangePulse(lane,.12,.58,.13);
      wave=Math.max(structural*.75,lanePulse*(.22+.55*primary));
    }
    const visual=edgeFade*wave;if(visual<=.008)continue;
    const pulse=fract(actionT*.28+s.branch*.34+s.phase*.16),charge=rangePulse(pulse,.52,.88,.12),strike=rangePulse(pulse,.86,.99,.045);
    const guideAlpha=visual*.010*profile.fiberAlpha,terminalAlpha=visual*.042*profile.fiberAlpha;
    if(i%8===0||itano&&i%5===0)pushFiberCurve(start,end,(focus?.0030:.0042)*profile.fiberWidth,mix3(col,[1,1,1],.18),guideAlpha,s.seed);
    pushRibbon(start,mix3(start,end,.16),.010*profile.fiberWidth,col,guideAlpha*1.25,guideAlpha*.36);
    pushRibbon(mix3(start,end,.84),end,.011*profile.fiberWidth,col,terminalAlpha*.32,terminalAlpha*(.62+charge*.34));

    if(itano&&profile.crossingRate>0&&i%profile.crossingRate===0){
      const passGate=rangePulse(fract(local*.34+s.phase),.28,.68,.12);
      if(passGate>.08)pushCameraCrossing(end,mix3(col,[1,1,1],.10),visual*.0035*passGate,s.seed);
    }else if(operation&&profile.crossingRate>0&&i%profile.crossingRate===0&&primary>.42){
      pushCameraCrossing(end,mix3(col,[1,1,1],.12),visual*.0026,s.seed);
    }

    const typeScale=s.bulletType===2?1.08:s.bulletType===1?1.03:1;
    const size=((focus?7.4:6.4)+primary*(focus?2.5:1.55)+strike*2.6)*typeScale*profile.impactScale;
    const alpha=visual*((focus?.56:.46)+primary*.12+strike*.14)*profile.impactAlpha;
    if(!itano||i%3===0)pushImpact(end,size,col,alpha,s.bulletType,s.bulletRot+Math.sin(time*.24+s.seed)*.05);

    if(operation){
      const playerPlane=projectToImpactPlane(playerWorldPos()),near=len(sub(end,playerPlane)),danger=primary*.55+strike*.9-near*.12;
      if(focus&&near<2.15)focusCandidates.push({end,col,near,danger,charge,strike,seed:s.seed});
      if(strike>.50&&i%72===0)queue(additive,meshes.torus,ringModel(add(end,scale(camForward,-.02)),.085+.075*strike,.07,time*.12+s.seed),col,.05+.07*strike,.62,.40,.015);
    }
  }

  if(player.focus&&operation){
    const playerPlane=projectToImpactPlane(playerWorldPos());
    queue(additive,meshes.torus,ringModel(add(playerPlane,scale(camForward,-.024)),.13,.10,time*.12),hex('#8fefff'),.20,.72,.56,.02);
    queue(additive,meshes.torus,ringModel(add(playerPlane,scale(camForward,-.042)),.06,.09,-time*.18),hex('#fffaff'),.28,.92,.64,.02);
    focusCandidates.sort((a,b)=>b.danger-a.danger);for(const c of focusCandidates.slice(0,8)){const r=.065+.045*(1-c.charge)+.028*c.strike;queue(additive,meshes.torus,ringModel(add(c.end,scale(camForward,-.018)),r,.078,time*.08+c.seed),c.col,.10+.12*c.charge+.10*c.strike,.64,.44,.018)}
  }

  if(cinematic&&!itano){
    const cue=add(impactPlaneCenter,scale(camUp,-1.60));queue(additive,meshes.torus,ringModel(cue,.15+.018*Math.sin(time*2),.075,time*.08),hex('#fff2ff'),.06,.52,.34,.015);
  }
}
