// ---------- shaders ----------
function shader(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s}
function program(vs,fs){const p=gl.createProgram();gl.attachShader(p,shader(gl.VERTEX_SHADER,vs));gl.attachShader(p,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p}
const meshProgram=program(SHADERS.meshProgram.vertex,SHADERS.meshProgram.fragment);
const pointProgram=program(SHADERS.pointProgram.vertex,SHADERS.pointProgram.fragment);
const laserProgram=program(SHADERS.laserProgram.vertex,SHADERS.laserProgram.fragment);
const impactProgram=program(SHADERS.impactProgram.vertex,SHADERS.impactProgram.fragment);
const postProgram=program(SHADERS.postProgram.vertex,SHADERS.postProgram.fragment);
const ML={aPos:gl.getAttribLocation(meshProgram,'aPos'),aNormal:gl.getAttribLocation(meshProgram,'aNormal'),uModel:gl.getUniformLocation(meshProgram,'uModel'),uVP:gl.getUniformLocation(meshProgram,'uVP'),uColor:gl.getUniformLocation(meshProgram,'uColor'),uCamera:gl.getUniformLocation(meshProgram,'uCamera'),uLight:gl.getUniformLocation(meshProgram,'uLight'),uFogColor:gl.getUniformLocation(meshProgram,'uFogColor'),uOpacity:gl.getUniformLocation(meshProgram,'uOpacity'),uEmissive:gl.getUniformLocation(meshProgram,'uEmissive'),uRim:gl.getUniformLocation(meshProgram,'uRim'),uGloss:gl.getUniformLocation(meshProgram,'uGloss')};
const PL={aPos:gl.getAttribLocation(pointProgram,'aPos'),aSize:gl.getAttribLocation(pointProgram,'aSize'),aColor:gl.getAttribLocation(pointProgram,'aColor'),uVP:gl.getUniformLocation(pointProgram,'uVP')};
const LL={aPos:gl.getAttribLocation(laserProgram,'aPos'),aColor:gl.getAttribLocation(laserProgram,'aColor'),aAlpha:gl.getAttribLocation(laserProgram,'aAlpha'),aAcross:gl.getAttribLocation(laserProgram,'aAcross'),uVP:gl.getUniformLocation(laserProgram,'uVP')};
const IL={aPos:gl.getAttribLocation(impactProgram,'aPos'),aSize:gl.getAttribLocation(impactProgram,'aSize'),aColor:gl.getAttribLocation(impactProgram,'aColor'),aAlpha:gl.getAttribLocation(impactProgram,'aAlpha'),aType:gl.getAttribLocation(impactProgram,'aType'),aRot:gl.getAttribLocation(impactProgram,'aRot'),uVP:gl.getUniformLocation(impactProgram,'uVP')};
const QL={aPos:gl.getAttribLocation(postProgram,'aPos'),uScene:gl.getUniformLocation(postProgram,'uScene'),uTexel:gl.getUniformLocation(postProgram,'uTexel'),uFocus:gl.getUniformLocation(postProgram,'uFocus')};
