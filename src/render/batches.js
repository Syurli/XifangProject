// ---------- draw groups ----------
const opaque=[],alpha=[],additive=[];
function queue(pass,mesh,model,color,opacity=1,emissive=0,rim=.1,gloss=.25){pass.push({mesh,model,color,opacity,emissive,rim,gloss})}
function flushOpaque(){gl.disable(gl.BLEND);gl.depthMask(true);for(const o of opaque)draw(o.mesh,o.model,o.color,o.opacity,o.emissive,o.rim,o.gloss);opaque.length=0}
function flushAlpha(){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);for(const o of alpha)draw(o.mesh,o.model,o.color,o.opacity,o.emissive,o.rim,o.gloss);alpha.length=0}
function flushAdditive(){gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);for(const o of additive)draw(o.mesh,o.model,o.color,o.opacity,o.emissive,o.rim,o.gloss);additive.length=0;gl.depthMask(true);gl.disable(gl.BLEND)}

function drawStars(){
  const profile=visualProfile(),count=Math.max(180,Math.floor(starCount*profile.starAlpha));
  gl.useProgram(pointProgram);gl.uniformMatrix4fv(PL.uVP,false,VP);gl.bindBuffer(gl.ARRAY_BUFFER,starBuffers.p);gl.enableVertexAttribArray(PL.aPos);gl.vertexAttribPointer(PL.aPos,3,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,starBuffers.s);gl.enableVertexAttribArray(PL.aSize);gl.vertexAttribPointer(PL.aSize,1,gl.FLOAT,false,0,0);gl.bindBuffer(gl.ARRAY_BUFFER,starBuffers.c);gl.enableVertexAttribArray(PL.aColor);gl.vertexAttribPointer(PL.aColor,3,gl.FLOAT,false,0,0);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);gl.drawArrays(gl.POINTS,0,count);gl.depthMask(true);gl.disable(gl.BLEND)
}

const laserBuffers={p:gl.createBuffer(),c:gl.createBuffer(),a:gl.createBuffer(),x:gl.createBuffer()};
const impactBuffers={p:gl.createBuffer(),s:gl.createBuffer(),c:gl.createBuffer(),a:gl.createBuffer(),t:gl.createBuffer(),r:gl.createBuffer()};
let laserPos=[],laserCol=[],laserAlpha=[],laserAcross=[],impactPos=[],impactSize=[],impactCol=[],impactAlpha=[],impactType=[],impactRot=[];
function resetLaserBatches(){laserPos=[];laserCol=[];laserAlpha=[];laserAcross=[];impactPos=[];impactSize=[];impactCol=[];impactAlpha=[];impactType=[];impactRot=[]}
function pushRibbon(a,b,width,color,alphaA,alphaB){
  const d=norm(sub(b,a)),mid=scale(add(a,b),.5),viewDir=norm(sub(CAMERA.eye,mid));let side=norm(cross(d,viewDir));if(len(side)<.001)side=camRight;
  const sa=scale(side,width),a0=sub(a,sa),a1=add(a,sa),b0=sub(b,sa),b1=add(b,sa);
  const verts=[a0,a1,b0,b0,a1,b1],alph=[alphaA,alphaA,alphaB,alphaB,alphaA,alphaB],across=[-1,1,-1,-1,1,1];
  for(let i=0;i<6;i++){laserPos.push(...verts[i]);laserCol.push(...color);laserAlpha.push(alph[i]);laserAcross.push(across[i]);}
}
function pushFiberCurve(start,end,width,color,alpha,seed){
  const bend=add(scale(camRight,Math.sin(seed*1.31)*.10),scale(camUp,Math.cos(seed*.87)*.075));
  const c1=add(mix3(start,end,.34),bend),c2=sub(mix3(start,end,.72),scale(bend,.62));
  let prev=start;
  for(let k=1;k<=5;k++){const t=k/5,p=bezier(start,c1,c2,end,t);pushRibbon(prev,p,width*(.86+.14*Math.sin(t*Math.PI)),color,alpha*(1-t*.25),alpha*(1-t*.42));prev=p;}
}
function pushCameraCrossing(end,color,alpha,seed){
  const toward=norm(sub(CAMERA.eye,end)),nearCam=add(CAMERA.eye,scale(toward,-.16));
  const lateral=add(scale(camRight,Math.sin(seed*1.7)*.08),scale(camUp,Math.cos(seed*1.13)*.06));
  const through=add(add(CAMERA.eye,scale(toward,1.05)),lateral);
  pushRibbon(end,nearCam,.0068,color,alpha,alpha*.24);
  pushRibbon(nearCam,through,.011,mix3(color,[1,1,1],.28),alpha*.24,0.0);
}
function pushImpact(p,size,color,alpha,type=0,rot=0){impactPos.push(...p);impactSize.push(size);impactCol.push(...color);impactAlpha.push(alpha);impactType.push(type);impactRot.push(rot)}
function drawLaserRibbons(){if(!laserAlpha.length)return;gl.useProgram(laserProgram);gl.uniformMatrix4fv(LL.uVP,false,VP);
  const attrs=[[laserBuffers.p,laserPos,LL.aPos,3],[laserBuffers.c,laserCol,LL.aColor,3],[laserBuffers.a,laserAlpha,LL.aAlpha,1],[laserBuffers.x,laserAcross,LL.aAcross,1]];
  for(const [b,data,loc,n] of attrs){gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,0,0)}
  gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.depthMask(false);gl.drawArrays(gl.TRIANGLES,0,laserAlpha.length);gl.depthMask(true);gl.disable(gl.BLEND);
}
function drawImpactSprites(){if(!impactAlpha.length)return;gl.useProgram(impactProgram);gl.uniformMatrix4fv(IL.uVP,false,VP);
  const attrs=[[impactBuffers.p,impactPos,IL.aPos,3],[impactBuffers.s,impactSize,IL.aSize,1],[impactBuffers.c,impactCol,IL.aColor,3],[impactBuffers.a,impactAlpha,IL.aAlpha,1],[impactBuffers.t,impactType,IL.aType,1],[impactBuffers.r,impactRot,IL.aRot,1]];
  for(const [b,data,loc,n] of attrs){gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.DYNAMIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,n,gl.FLOAT,false,0,0)}
  gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.drawArrays(gl.POINTS,0,impactAlpha.length);gl.depthMask(true);gl.disable(gl.BLEND);
}
