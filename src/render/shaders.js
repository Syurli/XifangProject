// GLSL programs kept separate from runtime orchestration.
const SHADERS = {
  meshProgram: {
    vertex: `
attribute vec3 aPos;attribute vec3 aNormal;
uniform mat4 uModel;uniform mat4 uVP;
varying vec3 vPos;varying vec3 vNormal;
void main(){vec4 w=uModel*vec4(aPos,1.0);vPos=w.xyz;vNormal=normalize(mat3(uModel)*aNormal);gl_Position=uVP*w;}`,
    fragment: `precision mediump float;
varying vec3 vPos;varying vec3 vNormal;
uniform vec3 uColor;uniform vec3 uCamera;uniform vec3 uLight;uniform vec3 uFogColor;
uniform float uOpacity;uniform float uEmissive;uniform float uRim;uniform float uGloss;
void main(){
  vec3 n=normalize(vNormal);vec3 l=normalize(-uLight);vec3 v=normalize(uCamera-vPos);vec3 h=normalize(l+v);
  float ndl=max(dot(n,l),0.0);float spec=pow(max(dot(n,h),0.0),24.0)*uGloss;
  float rim=pow(1.0-max(dot(n,v),0.0),2.35);
  vec3 c=uColor*(0.14+ndl*0.9)+vec3(spec)+uColor*(uEmissive+rim*uRim);
  float d=length(uCamera-vPos);float fog=smoothstep(23.0,62.0,d);c=mix(c,uFogColor,fog);
  gl_FragColor=vec4(c,uOpacity);
}`,
  },
  pointProgram: {
    vertex: `attribute vec3 aPos;attribute float aSize;attribute vec3 aColor;uniform mat4 uVP;varying vec3 vColor;void main(){vec4 p=uVP*vec4(aPos,1.0);gl_Position=p;gl_PointSize=aSize*(1.0/clamp(-p.z*.043,.58,3.0));vColor=aColor;}`,
    fragment: `precision mediump float;varying vec3 vColor;void main(){vec2 p=gl_PointCoord*2.0-1.0;float d=dot(p,p);if(d>1.0)discard;float a=pow(1.0-d,2.15);gl_FragColor=vec4(vColor*a,a);}`,
  },
  laserProgram: {
    vertex: `
attribute vec3 aPos;attribute vec3 aColor;attribute float aAlpha;attribute float aAcross;
uniform mat4 uVP;varying vec3 vColor;varying float vAlpha;varying float vAcross;
void main(){gl_Position=uVP*vec4(aPos,1.0);vColor=aColor;vAlpha=aAlpha;vAcross=aAcross;}`,
    fragment: `precision mediump float;varying vec3 vColor;varying float vAlpha;varying float vAcross;
void main(){float edge=pow(max(0.0,1.0-abs(vAcross)),1.7);float core=pow(max(0.0,1.0-abs(vAcross)*1.8),3.0);float a=vAlpha*(edge*.62+core*.72);gl_FragColor=vec4(vColor,a);}`,
  },
  impactProgram: {
    vertex: `
attribute vec3 aPos;attribute float aSize;attribute vec3 aColor;attribute float aAlpha;attribute float aType;attribute float aRot;
uniform mat4 uVP;varying vec3 vColor;varying float vAlpha;varying float vType;varying float vRot;
void main(){vec4 p=uVP*vec4(aPos,1.0);gl_Position=p;gl_PointSize=aSize*(1.0/clamp(-p.z*.043,.60,3.0));vColor=aColor;vAlpha=aAlpha;vType=aType;vRot=aRot;}`,
    fragment: `precision mediump float;varying vec3 vColor;varying float vAlpha;varying float vType;varying float vRot;
float capsule(vec2 p,float halfLen,float radius){p.y-=clamp(p.y,-halfLen,halfLen);return length(p)/radius;}
void main(){
  vec2 q=gl_PointCoord*2.0-1.0;float c=cos(vRot),s=sin(vRot);q=mat2(c,-s,s,c)*q;
  float d;
  if(vType<.5){d=length(q);}                                  // round orb
  else if(vType<1.5){d=length(vec2(q.x*1.72,q.y*.72));}      // rice bullet
  else if(vType<2.5){d=capsule(vec2(q.x*1.28,q.y),.48,.28);} // needle
  else if(vType<3.5){                                       // petal
    vec2 p=q;p.y+=.10;float taper=1.15+.52*max(p.y,0.0);d=length(vec2(p.x*taper,p.y*.82));
  }else{d=(abs(q.x)+abs(q.y))*.88;}                          // diamond / shard
  if(d>1.08)discard;
  float body=1.0-smoothstep(.76,1.01,d);float rim=(1.0-smoothstep(.86,1.02,d))-(1.0-smoothstep(.58,.78,d));
  float core=1.0-smoothstep(.0,.42,d);float outline=(1.0-smoothstep(.92,1.07,d))*smoothstep(.70,.90,d);
  vec3 ink=vec3(.055,.018,.085);vec3 col=mix(vColor,vec3(1.0),core*.66+rim*.12);col=mix(col,ink,outline*.68);
  float a=vAlpha*(body*.82+rim*.34+core*.28+outline*.46);gl_FragColor=vec4(col*a,a);
}`,
  },
  postProgram: {
    vertex: `attribute vec2 aPos;varying vec2 vUv;void main(){vUv=aPos*.5+.5;gl_Position=vec4(aPos,0.0,1.0);}`,
    fragment: `precision mediump float;varying vec2 vUv;uniform sampler2D uScene;uniform vec2 uTexel;uniform float uFocus;
vec3 sampleScene(vec2 uv){return texture2D(uScene,clamp(uv,0.001,0.999)).rgb;}
void main(){
  float band=abs(vUv.y-.54);float blur=smoothstep(.24,.49,band)*(1.0-uFocus*.34);
  vec2 px=uTexel*(.65+blur*3.1);
  vec3 c=sampleScene(vUv)*.34;
  c+=sampleScene(vUv+vec2(px.x,0.0))*.11;c+=sampleScene(vUv-vec2(px.x,0.0))*.11;
  c+=sampleScene(vUv+vec2(0.0,px.y))*.11;c+=sampleScene(vUv-vec2(0.0,px.y))*.11;
  c+=sampleScene(vUv+px)*.055;c+=sampleScene(vUv-px)*.055;
  c+=sampleScene(vUv+vec2(px.x,-px.y))*.055;c+=sampleScene(vUv+vec2(-px.x,px.y))*.055;
  vec3 base=sampleScene(vUv);
  c=mix(base,c,blur*.72);
  vec3 bloom=max(sampleScene(vUv+uTexel*vec2(3.0,2.0))-.58,0.0)+max(sampleScene(vUv-uTexel*vec2(3.0,2.0))-.58,0.0);
  c+=bloom*(.095-uFocus*.025);
  c=mix(c,vec3(dot(c,vec3(.299,.587,.114))),.035);
  c*=vec3(1.035,.985,1.065);
  float vign=1.0-smoothstep(.38,.76,length(vUv-.5));c*=mix(.72,1.0,vign);
  c*=1.0-uFocus*.045;
  gl_FragColor=vec4(pow(max(c,0.0),vec3(.94)),1.0);
}`,
  },
};
