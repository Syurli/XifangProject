function phaseText(local){
  const shot=sequenceState.shot;
  if(local<shot.safeIn*.46)return `${shot.label} · ${shot.technique}：沿上一镜速度矢量继续运动`;
  if(local<shot.safeIn)return `${shot.label} · 动作匹配：角色转向先发生，相机随后接管`;
  if(local<shot.safeIn+.55)return `${shot.label} · ${shot.skill}：二维危险波前开始锁定`;
  if(local<shot.safeOut)return player.focus?`${shot.label} · ${shot.skill}：专注模式仅强调邻近高危层`:`${shot.label} · ${shot.skill}：相对位移操控 / 摄影航迹不改判定`;
  return `${shot.label} · 收束：保持屏幕运动方向并把动势交给下一镜`;
}
function update(dt){
  applyCameraShot(time);updateCamera();updateBattleFrame();
  const f=focusToggle||keys.ShiftLeft||keys.ShiftRight;player.focus=!!f;
  const canOperate=sequenceState.operation,sp=f?1.02:2.18;
  let dx=canOperate?((keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)):0,dy=canOperate?((keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)):0,l=Math.hypot(dx,dy)||1;dx/=l;dy/=l;
  player.vx=lerp(player.vx,dx*sp,1-Math.pow(.001,dt));player.vy=lerp(player.vy,dy*sp,1-Math.pow(.001,dt));
  player.x=clamp(player.x+player.vx*dt,-2.65,2.65);player.y=clamp(player.y+player.vy*dt,-2.0,.56);
  UI.focus.textContent=f?'ON':'OFF';UI.focusTag.classList.toggle('on',f);UI.focusBtn.classList.toggle('on',focusToggle);UI.modePill.classList.toggle('on',f);
  UI.modeText.textContent=canOperate?(f?'FOCUS / DANGER LAYER':'RELATIVE CONTROL / ACTIVE'):'CINEMATIC / INPUT HOLD';
  if(sequenceState.index!==patternIndex){patternIndex=sequenceState.index;rebuildPattern(sequenceState.shot.mode)}
  if(UI.cameraState)UI.cameraState.textContent=sequenceState.shot.name;if(UI.skillState)UI.skillState.textContent=canOperate?sequenceState.shot.skill:'PERFORMANCE';
}
function renderScene(){
  gl.bindFramebuffer(gl.FRAMEBUFFER,sceneFbo);gl.viewport(0,0,canvas.width,canvas.height);gl.clearColor(.016,.004,.032,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.disable(gl.CULL_FACE);gl.depthMask(true);gl.disable(gl.BLEND);
  drawStars();queueEnvironment();queueMagicStage();queueBoss();const local=sequenceState.segment,cards=cardPositions(local);for(const c of cards)queueCard(c);queueLaserField(cards,local);queuePlayer();flushOpaque();flushAlpha();drawLaserRibbons();drawImpactSprites();flushAdditive();UI.phase.textContent=phaseText(local);
}
function postProcess(){gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,canvas.width,canvas.height);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.depthMask(true);gl.useProgram(postProgram);gl.bindBuffer(gl.ARRAY_BUFFER,quadBuffer);gl.enableVertexAttribArray(QL.aPos);gl.vertexAttribPointer(QL.aPos,2,gl.FLOAT,false,0,0);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,sceneTex);gl.uniform1i(QL.uScene,0);gl.uniform2f(QL.uTexel,1/canvas.width,1/canvas.height);gl.uniform1f(QL.uFocus,player.focus?1:0);gl.drawArrays(gl.TRIANGLES,0,6)}
function render(){renderScene();postProcess()}
function resize(){DPR=Math.min(1.65,devicePixelRatio||1);W=innerWidth;H=innerHeight;canvas.width=Math.max(1,Math.floor(W*DPR));canvas.height=Math.max(1,Math.floor(H*DPR));canvas.style.width=W+'px';canvas.style.height=H+'px';applyCameraShot(time);updateCamera();updateBattleFrame();makeTargets()}
function frame(now){const dt=Math.min(.033,(now-last)/1000||0);last=now;if(!paused){time+=dt;update(dt)}render();fpsSmooth=lerp(fpsSmooth,1/Math.max(dt,.001),.05);UI.fps.textContent=Math.round(fpsSmooth);requestAnimationFrame(frame)}
addEventListener('resize',resize);addEventListener('keydown',e=>{keys[e.code]=true;if(e.code.startsWith('Arrow')||e.code.startsWith('Shift'))e.preventDefault()});addEventListener('keyup',e=>{keys[e.code]=false});
UI.focusBtn.onclick=()=>{focusToggle=!focusToggle};UI.pause.onclick=()=>{paused=!paused;UI.pause.classList.toggle('on',paused);UI.pause.textContent=paused?'继续':'暂停'};UI.reset.onclick=()=>{time=0;patternIndex=-1;player.x=0;player.y=-1.52;player.vx=player.vy=0;rebuildPattern(0)};
resize();setTimeout(()=>UI.intro.classList.add('hide'),1150);requestAnimationFrame(frame);
