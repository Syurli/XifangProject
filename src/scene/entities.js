function queueEnvironment(){
  const profile=visualProfile(),bg=profile.starAlpha;
  // moon / distant halo: deliberately subdued so bullets remain the brightest moving layer
  queue(opaque,meshes.sphere,compose([5.4,4.7,-37],[0,0,0],[5.9,5.9,1.4]),hex('#806f94'),1,.025,.06,.12);
  queue(additive,meshes.torus,compose([5.4,4.7,-36.7],[0,0,time*.018],[6.4,6.4,.28]),hex('#9c70bf'),.045*bg,.55,.42,.05);
  // layered floating shrine terraces
  for(let i=0;i<7;i++){const z=-8.5-i*5.0,w=8.5+i*1.28;queue(alpha,meshes.box,compose([0,-3.22+i*.045,z],[0,0,.018*Math.sin(i)],[w,.05,2.05]),hex(i%2?'#281031':'#160c20'),.20*bg,.025,.10,.07)}
  // torii silhouettes: fewer and darker than previous version
  for(let i=0;i<4;i++){const z=-20-i*8,side=i%2?-1:1,x=side*(6.2+i*.9),s=1+i*.12,col=hex(i%2?'#281031':'#201128');queue(alpha,meshes.box,compose([x,-.6,z],[0,0,0],[.16,3.2*s,.16]),col,.20*bg,.01,.08,.06);queue(alpha,meshes.box,compose([x+1.35*s,-.6,z],[0,0,0],[.16,3.2*s,.16]),col,.20*bg,.01,.08,.06);queue(alpha,meshes.box,compose([x+.68*s,1.0*s,z],[0,0,0],[1.78*s,.11,.20]),col,.22*bg,.015,.09,.06)}
  // cloud volumes: sparse silhouettes only
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2,r=7.6+(i%3)*1.45,z=-17-(i%4)*6.0;queue(alpha,meshes.sphere,compose([Math.cos(a)*r,-1.85+Math.sin(a*2)*1.1,z],[0,0,0],[2.3+(i%2)*.7,.52,1.4]),hex(i%2?'#21112d':'#291233'),.045*bg,.08,.16,.05)}
}
function queueMagicStage(){
  const profile=visualProfile(),hero=sequenceState.shot.role==='PLAYER_CLOSE',k=hero?.25:profile.bloom;
  queue(additive,meshes.torus,compose([0,1.35,-15.34],[0,0,time*.115],[3.45,3.45,.20]),hex('#83edff'),.055*k,.68,.50,.035);
  queue(additive,meshes.torus,compose([0,1.35,-15.45],[0,0,-time*.17],[2.95,2.95,.17]),hex('#ff5f9f'),.065*k,.70,.52,.035);
  const nodes=sequenceState.shot.role&&sequenceState.shot.role.startsWith('ITANO')?6:8;
  for(let i=0;i<nodes;i++){const a=i/nodes*Math.PI*2+time*.075,p=[Math.cos(a)*3.18,1.35+Math.sin(a)*1.82,-15.48];queue(additive,meshes.cone,compose(p,[Math.PI/2,a,0],[.06,.24,.06]),hex(i%2?'#aa7eff':'#7decff'),.11*k,.60,.38,.035)}
}
function queueBoss(){
  const role=sequenceState.shot.role,sc=role==='BOSS_CLOSE'?.64:role&&role.startsWith('ITANO')?.50:.56,b=compose(bossPos,[0,.055*Math.sin(time*.6),0],[sc,sc,sc]);
  queue(opaque,meshes.sphere,child(b,compose([0,.72,0],[0,0,0],[.34,.37,.32])),hex('#ffe5ef'),1,.04,.18,.42);queue(opaque,meshes.sphere,child(b,compose([0,.73,-.08],[0,0,0],[.42,.42,.36])),hex('#6a276f'),1,.06,.28,.35);queue(opaque,meshes.cone,child(b,compose([0,-.05,0],[0,0,0],[.68,1.3,.64])),hex('#4d155f'),1,.03,.25,.28);queue(opaque,meshes.cylinder,child(b,compose([-.54,.08,0],[0,0,-.72],[.13,.78,.13])),hex('#d990ff'),1,.06,.22,.38);queue(opaque,meshes.cylinder,child(b,compose([.54,.08,0],[0,0,.72],[.13,.78,.13])),hex('#d990ff'),1,.06,.22,.38);queue(additive,meshes.torus,child(b,compose([0,.73,-.05],[Math.PI/2,0,0],[.45,.45,.45])),hex('#ff7eb8'),.36,.72,.42,.035);queue(opaque,meshes.cone,child(b,compose([0,1.08,-.02],[0,0,0],[.62,.62,.62])),hex('#381047'),1,.02,.22,.22);queue(additive,meshes.torus,child(b,compose([0,-.36,-.05],[0,0,0],[.98,.6,.98])),hex('#aa75ff'),.12,.62,.34,.035)
}
function queuePlayer(){
  const role=sequenceState.shot.role,psc=role==='PLAYER_CLOSE'?.235:role&&role.startsWith('ITANO')?.16:.18,bank=clamp(-player.vx*.14,-.28,.28),bob=Math.sin(time*2.1)*.014,p=add(playerWorldPos(),scale(camUp,bob)),base=basisMatrix(camRight,camUp,scale(camForward,-1),p,[psc,psc,psc]);
  queue(opaque,meshes.sphere,child(base,compose([0,.42,0],[0,0,0],[.22,.24,.21])),hex('#ffe8df'),1,.03,.12,.4);queue(opaque,meshes.sphere,child(base,compose([0,.45,-.04],[0,0,0],[.28,.26,.25])),hex('#35213f'),1,.02,.2,.3);queue(opaque,meshes.cone,child(base,compose([0,-.1,0],[0,0,0],[.39,.8,.35])),hex('#d72c54'),1,.04,.2,.32);queue(opaque,meshes.cone,child(base,compose([0,-.28,.02],[Math.PI,0,0],[.56,.42,.5])),hex('#fff5ee'),1,.02,.14,.35);queue(opaque,meshes.cylinder,child(base,compose([-.34,.02,0],[0,0,-.78],[.08,.5,.08])),hex('#fff3e9'),1,.02,.12,.32);queue(opaque,meshes.cylinder,child(base,compose([.34,.02,0],[0,0,.78],[.08,.5,.08])),hex('#fff3e9'),1,.02,.12,.32);queue(opaque,meshes.box,child(base,compose([-.25,.58,-.02],[0,.2,-.35],[.3,.16,.08])),hex('#ff315e'),1,.12,.22,.38);queue(opaque,meshes.box,child(base,compose([.25,.58,-.02],[0,-.2,.35],[.3,.16,.08])),hex('#ff315e'),1,.12,.22,.38);queue(additive,meshes.sphere,child(base,compose([-.46,-.03,-.05],[0,0,0],[.10,.10,.10])),hex('#ff5a8e'),.48,.58,.38,.035);queue(additive,meshes.sphere,child(base,compose([.46,-.03,-.05],[0,0,0],[.10,.10,.10])),hex('#ffffff'),.42,.50,.34,.035);
  if(!player.focus&&role!=='PLAYER_CLOSE'){for(let i=1;i<=2;i++){const a=.035*(3-i);const q=[p[0]-player.vx*i*.018,p[1]-player.vy*i*.014,p[2]+.055*i];queue(additive,meshes.sphere,compose(q,[0,0,0],[.045*i,.022*i,.032*i]),i%2?hex('#ff4d8d'):hex('#a56fff'),a,.68,.34,.015)}}
  if(player.focus&&sequenceState.operation){const core=[p[0],p[1]-.035,p[2]+.048];queue(additive,meshes.sphere,compose(core,[0,0,0],[.045,.045,.045]),hex('#ffffff'),1,1.6,.8,.02);queue(additive,meshes.torus,ringModel(add(core,scale(camForward,-.01)),.105,.22,time*.22),hex('#ff4f91'),.68,1.0,.62,.02);queue(additive,meshes.torus,ringModel(add(core,scale(camForward,-.025)),.185,.15,-time*.13),hex('#8feeff'),.14,.62,.46,.02)}
}
