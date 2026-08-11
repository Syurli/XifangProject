// Cinematic camera timeline and framing data.
const CAMERA_DEFAULT={eye:[0,1.2,8],target:[0,1,-8],up:[0,1,0],fov:36*Math.PI/180,near:.075,far:120};
const SHOT_DURATION=8.2;
const CAMERA_SHOTS=[
  {name:'SHOT 01',label:'镜头一·低位尾追建立',skill:'星河散华',mode:0,duration:SHOT_DURATION,safeIn:1.20,safeOut:7.00,technique:'CHASE WIDE / MATCH VECTOR'},
  {name:'SHOT 02',label:'镜头二·右翼近距并行',skill:'扇面米粒阵',mode:4,duration:SHOT_DURATION,safeIn:1.35,safeOut:7.05,technique:'CUT-IN CLOSE / SAME AXIS'},
  {name:'SHOT 03',label:'镜头三·迎头长焦擦身',skill:'针束压制',mode:2,duration:SHOT_DURATION,safeIn:1.15,safeOut:6.85,technique:'HEAD-ON / WHIP MATCH'},
  {name:'SHOT 04',label:'镜头四·Boss近景反打',skill:'花瓣回旋',mode:3,duration:SHOT_DURATION,safeIn:1.45,safeOut:7.00,technique:'CLOSE REVERSE / EYELINE'},
  {name:'SHOT 05',label:'镜头五·尾追脱离大全景',skill:'终端坠流',mode:1,duration:SHOT_DURATION,safeIn:1.55,safeOut:6.90,technique:'CHASE RELEASE / PULL BACK'}
];
// 五个镜头现在是五条独立摄影段：镜头边界允许硬切，不再共享闭合样条。
// 连续性由“动作轴 + 屏幕速度方向 + 视线方向”维持，而不是由相机世界坐标连续维持。
// 每条 path 为 cubic Bezier 摄影轨迹；frame 为该镜头内部的构图起终值。
const CAMERA_SETUPS=[
  {
    path:[[0,1.25,9.2],[1.1,1.05,5.8],[2.3,1.30,1.2],[3.0,1.55,-2.6]],
    fov:[39.5,36.0],roll:[-.015,-.060],lookLift:[.18,.32],lookSide:[-.12,.26],
    bossSide:[.10,.55],bossLift:[1.62,1.46],bossDepth:[24.6,22.8],playerSide:[-.12,-.28],playerLift:[.30,.34],playerDepth:[4.75,4.55],planeDepth:[10.8,10.4],planeLift:[.02,.08]
  },
  {
    // 与上一镜保持同向飞行，但硬切到右翼近距机位；主体仍沿画面右前方运动。
    path:[[-5.6,2.55,-3.5],[-3.7,2.75,-6.8],[-1.5,3.05,-10.8],[1.8,3.35,-14.3]],
    fov:[31.5,35.0],roll:[-.105,-.145],lookLift:[.42,.54],lookSide:[.48,.22],
    bossSide:[1.10,.42],bossLift:[1.48,1.72],bossDepth:[16.8,18.6],playerSide:[-.56,-.30],playerLift:[.24,.36],playerDepth:[4.15,4.45],planeDepth:[9.2,9.8],planeLift:[.10,.04]
  },
  {
    // 镜头跨到前方做迎头压缩，但利用安全窗完成轴线越过；擦身点后用甩镜接回原运动方向。
    path:[[3.6,5.2,-20.5],[2.8,4.7,-18.0],[1.5,3.8,-13.8],[-1.8,3.1,-9.4]],
    fov:[30.0,39.0],roll:[.055,.105],lookLift:[-.08,-.26],lookSide:[-.16,-.36],
    bossSide:[-.34,-.72],bossLift:[2.12,2.28],bossDepth:[21.0,24.0],playerSide:[.34,.46],playerLift:[.50,.55],playerDepth:[4.90,5.15],planeDepth:[10.9,11.5],planeLift:[-.14,-.22]
  },
  {
    // 高速动作后突然切近：Boss占据更大画幅，短暂强调表情/起手，再让玩家重新进入同向并行关系。
    path:[[-2.9,2.75,-7.0],[-4.3,2.85,-9.6],[-5.4,3.15,-13.1],[-5.9,3.65,-16.8]],
    fov:[27.5,32.0],roll:[-.025,.020],lookLift:[.18,.08],lookSide:[.22,-.06],
    bossSide:[-.72,-.18],bossLift:[1.34,1.58],bossDepth:[12.8,16.2],playerSide:[.48,.14],playerLift:[.14,.26],playerDepth:[4.05,4.30],planeDepth:[8.8,9.7],planeLift:[.05,.00]
  },
  {
    // 从中近景硬切回尾追大全景，先继承上一镜屏幕右向动势，再逐渐拉远释放规模感。
    path:[[4.8,2.15,-7.2],[5.4,2.05,-10.0],[4.0,1.95,-14.8],[1.0,2.25,-20.8]],
    fov:[36.0,43.0],roll:[.075,.018],lookLift:[.34,.48],lookSide:[.34,.04],
    bossSide:[.86,.18],bossLift:[1.28,1.62],bossDepth:[19.2,27.0],playerSide:[-.48,-.12],playerLift:[.18,.26],playerDepth:[4.65,5.35],planeDepth:[10.2,12.0],planeLift:[.16,.20]
  }
];
