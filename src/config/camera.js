// Cinematic camera timeline and framing data.
const CAMERA_DEFAULT={eye:[0,1.2,8],target:[0,1,-8],up:[0,1,0],fov:36*Math.PI/180,near:.075,far:120};
const SHOT_DURATION=8.2;
const CAMERA_SHOTS=[
  {name:'SHOT 01',label:'镜头一·尾追贴地建立',skill:'星河散华',mode:0,duration:SHOT_DURATION,safeIn:1.20,safeOut:7.10,technique:'CHASE / SAME DIRECTION'},
  {name:'SHOT 02',label:'镜头二·右舷爬升领航',skill:'扇面米粒阵',mode:4,duration:SHOT_DURATION,safeIn:1.45,safeOut:7.15,technique:'LEAD PURSUIT / BANK'},
  {name:'SHOT 03',label:'镜头三·迎头压缩擦身',skill:'针束压制',mode:2,duration:SHOT_DURATION,safeIn:1.15,safeOut:6.95,technique:'HEAD-ON / WHIP PASS'},
  {name:'SHOT 04',label:'镜头四·左翼并行长焦',skill:'花瓣回旋',mode:3,duration:SHOT_DURATION,safeIn:1.35,safeOut:7.15,technique:'SIDE TRACK / TELEPHOTO'},
  {name:'SHOT 05',label:'镜头五·尾追脱离拉远',skill:'终端坠流',mode:1,duration:SHOT_DURATION,safeIn:1.70,safeOut:6.95,technique:'TAIL CHASE / PULL AWAY'}
];
// 五个“镜头”共享同一条闭合摄影航迹。所有端点只定义摄影节拍，不再让相机在镜头边界减速到 0。
// 关键帧同时保存构图参数，使用循环 Catmull-Rom 插值以保证位置、构图和动势在镜头边界连续。
const CAMERA_KEYS=[
  {eye:[0,1.25,8.2],   fov:38.5,roll:.000,lookLift:.18,lookSide:-.08,bossSide:.10,bossLift:1.70,bossDepth:24.2,playerSide:-.12,playerLift:.35,playerDepth:4.70,planeDepth:10.7,planeLift:.02},
  {eye:[9.8,2.50,-2.8],fov:34.5,roll:-.120,lookLift:.48,lookSide:.38,bossSide:.65,bossLift:1.50,bossDepth:22.8,playerSide:-.36,playerLift:.32,playerDepth:4.55,planeDepth:10.3,planeLift:.10},
  {eye:[5.4,7.70,-16.2],fov:39.5,roll:.100,lookLift:-.28,lookSide:-.34,bossSide:-.50,bossLift:2.25,bossDepth:25.4,playerSide:.42,playerLift:.55,playerDepth:5.10,planeDepth:11.4,planeLift:-.20},
  {eye:[-4.8,3.90,-28.2],fov:31.5,roll:-.035,lookLift:.05,lookSide:.02,bossSide:-.05,bossLift:1.58,bossDepth:21.5,playerSide:.02,playerLift:.25,playerDepth:4.25,planeDepth:10.0,planeLift:.00},
  {eye:[-12.0,1.80,-12.2],fov:40.5,roll:.115,lookLift:.34,lookSide:.35,bossSide:1.05,bossLift:1.20,bossDepth:25.7,playerSide:-.52,playerLift:.12,playerDepth:5.30,planeDepth:11.6,planeLift:.20}
];
