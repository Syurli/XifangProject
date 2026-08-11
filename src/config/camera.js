// Cinematic camera timeline and framing data.
const CAMERA_DEFAULT={eye:[0,1.2,8],target:[0,1,-8],up:[0,1,0],fov:36*Math.PI/180,near:.075,far:120};

// Five combat skill blocks are preserved, but the editorial timeline now contains ten real cuts.
// Performance inserts are genuine non-interactive shots instead of simply padding the head/tail of a gameplay camera.
// Axis rule: every camera path stays on the same side (negative world X) of the primary flight/action axis.
const CAMERA_SHOTS=[
  {name:'CUT 01',label:'镜头一A·低位尾追建立',skill:'星河散华',patternKey:0,mode:0,duration:2.40,safeIn:9,safeOut:0,operation:false,showCards:false,showField:false,performance:'开场建立 / 双方同向高速进入',technique:'CHASE WIDE / SAME SIDE'},
  {name:'CUT 02',label:'镜头一B·尾追交战',skill:'星河散华',patternKey:0,mode:0,duration:5.80,safeIn:.55,safeOut:5.25,operation:true,showCards:true,showField:true,performance:'',technique:'CHASE ATTACK / MATCH VECTOR'},

  {name:'CUT 03',label:'镜头二A·Boss蓄势特写',skill:'扇面米粒阵',patternKey:1,mode:4,duration:2.40,safeIn:1.95,safeOut:0,operation:false,showCards:true,showField:true,performance:'Boss攻击前起手 / 符卡展开',technique:'BOSS CLOSE / SAME AXIS'},
  {name:'CUT 04',label:'镜头二B·同侧近距并行',skill:'扇面米粒阵',patternKey:1,mode:4,duration:6.00,safeIn:.50,safeOut:5.45,operation:true,showCards:true,showField:true,performance:'',technique:'CUT-IN CLOSE / LEAD ROOM'},

  {name:'CUT 05',label:'镜头三·长焦压缩擦身',skill:'针束压制',patternKey:2,mode:2,duration:6.20,safeIn:.55,safeOut:5.55,operation:true,showCards:true,showField:true,performance:'',technique:'TELEPHOTO PASS / NO AXIS CROSS'},
  {name:'CUT 06',label:'镜头三B·主角反应特写',skill:'针束压制',patternKey:2,mode:2,duration:2.00,safeIn:9,safeOut:0,operation:false,showCards:false,showField:false,performance:'关键擦身后的主角近景 / 动作延续',technique:'PLAYER CLOSE / MOTION MATCH'},

  {name:'CUT 07',label:'镜头四A·Boss二次起手',skill:'花瓣回旋',patternKey:3,mode:3,duration:2.30,safeIn:1.85,safeOut:0,operation:false,showCards:true,showField:true,performance:'Boss抬手锁定 / 攻击前静压',technique:'BOSS INSERT / EYELINE HOLD'},
  {name:'CUT 08',label:'镜头四B·同侧侧追交战',skill:'花瓣回旋',patternKey:3,mode:3,duration:6.00,safeIn:.50,safeOut:5.45,operation:true,showCards:true,showField:true,performance:'',technique:'SIDE TRACK / SAME SCREEN DIR'},

  {name:'CUT 09',label:'镜头五A·主角决断特写',skill:'终端坠流',patternKey:4,mode:1,duration:1.80,safeIn:9,safeOut:0,operation:false,showCards:false,showField:false,performance:'最终攻势前主角近景 / 保留上一镜侧倾',technique:'PLAYER INSERT / CUT ON ACTION'},
  {name:'CUT 10',label:'镜头五B·尾追脱离大全景',skill:'终端坠流',patternKey:4,mode:1,duration:7.40,safeIn:.65,safeOut:6.70,operation:true,showCards:true,showField:true,performance:'',technique:'CHASE RELEASE / PULL BACK'}
];

// Each cut owns an independent cubic-Bezier camera move. World-space position is allowed to jump at edits.
// Montage continuity comes from action-axis discipline, screen-direction matching, eyeline and cut-on-action timing.
const CAMERA_SETUPS=[
  {
    path:[[-1.35,1.20,9.6],[-1.65,1.12,7.4],[-2.05,1.22,4.5],[-2.45,1.38,1.5]],
    fov:[41.0,38.5],roll:[-.012,-.030],lookLift:[.16,.22],lookSide:[-.16,.04],
    bossSide:[.12,.34],bossLift:[1.62,1.54],bossDepth:[25.6,24.0],playerSide:[-.14,-.24],playerLift:[.30,.33],playerDepth:[4.85,4.68],planeDepth:[10.9,10.6],planeLift:[.02,.05]
  },
  {
    path:[[-2.45,1.38,1.5],[-2.75,1.46,-1.7],[-3.20,1.66,-5.5],[-3.70,1.90,-9.7]],
    fov:[38.5,35.5],roll:[-.030,-.072],lookLift:[.22,.34],lookSide:[.04,.30],
    bossSide:[.34,.60],bossLift:[1.54,1.44],bossDepth:[24.0,22.6],playerSide:[-.24,-.34],playerLift:[.33,.36],playerDepth:[4.68,4.48],planeDepth:[10.6,10.2],planeLift:[.05,.08]
  },
  {
    // Boss close-up stays on the established side of the action axis; the cut changes shot size, not screen direction.
    path:[[-5.65,2.80,-8.4],[-5.82,2.94,-9.8],[-6.00,3.12,-11.3],[-6.18,3.34,-12.9]],
    fov:[29.0,27.0],roll:[-.055,-.075],lookLift:[.34,.42],lookSide:[.28,.12],
    bossSide:[.28,.08],bossLift:[.90,1.02],bossDepth:[7.10,6.35],playerSide:[-1.90,-1.70],playerLift:[-.10,.00],playerDepth:[4.10,4.00],planeDepth:[8.7,8.5],planeLift:[.08,.10]
  },
  {
    // Same-side parallel cut: strong lead room is kept in front of the flight vector.
    path:[[-6.05,2.48,-6.0],[-6.18,2.62,-9.2],[-6.05,2.90,-12.8],[-5.72,3.22,-16.6]],
    fov:[31.0,34.5],roll:[-.095,-.128],lookLift:[.40,.52],lookSide:[.48,.24],
    bossSide:[1.02,.46],bossLift:[1.44,1.68],bossDepth:[16.5,18.8],playerSide:[-.58,-.32],playerLift:[.24,.37],playerDepth:[4.10,4.46],planeDepth:[9.2,9.8],planeLift:[.10,.04]
  },
  {
    // Telephoto compression replaces the old axis-crossing head-on setup. Camera remains negative-X throughout.
    path:[[-5.70,4.42,-15.8],[-5.35,4.16,-18.4],[-4.82,3.72,-21.2],[-4.18,3.20,-24.0]],
    fov:[29.0,36.5],roll:[.025,.070],lookLift:[-.02,-.22],lookSide:[-.08,-.30],
    bossSide:[-.22,-.58],bossLift:[2.02,2.20],bossDepth:[20.0,23.2],playerSide:[.28,.44],playerLift:[.46,.54],playerDepth:[4.82,5.08],planeDepth:[10.8,11.4],planeLift:[-.12,-.20]
  },
  {
    // Player reaction close-up inherits the previous banking direction; camera keeps drifting forward instead of stopping.
    path:[[-4.28,2.08,-20.6],[-4.20,2.12,-21.5],[-4.10,2.18,-22.6],[-3.98,2.26,-23.8]],
    fov:[27.0,28.5],roll:[.068,.040],lookLift:[.04,.12],lookSide:[-.20,-.08],
    bossSide:[2.10,2.35],bossLift:[1.40,1.55],bossDepth:[17.0,18.0],playerSide:[-.58,-.42],playerLift:[-.02,.06],playerDepth:[1.72,1.92],planeDepth:[7.8,8.0],planeLift:[.00,.02]
  },
  {
    // Reverse subject, not reverse axis: Boss insert is still photographed from the same side of the flight line.
    path:[[-5.28,3.02,-21.4],[-5.18,3.08,-22.5],[-5.06,3.18,-23.7],[-4.92,3.32,-25.0]],
    fov:[27.5,29.5],roll:[.030,.008],lookLift:[.22,.16],lookSide:[.18,.04],
    bossSide:[-.22,-.04],bossLift:[1.02,1.18],bossDepth:[6.20,7.10],playerSide:[-2.10,-1.85],playerLift:[.10,.16],playerDepth:[3.95,4.10],planeDepth:[8.2,8.6],planeLift:[.04,.02]
  },
  {
    path:[[-6.35,2.42,-18.4],[-6.48,2.58,-21.4],[-6.24,2.86,-25.0],[-5.82,3.18,-29.0]],
    fov:[32.0,34.0],roll:[-.040,.018],lookLift:[.18,.08],lookSide:[.28,.02],
    bossSide:[-.62,-.18],bossLift:[1.30,1.56],bossDepth:[14.0,17.0],playerSide:[.44,.16],playerLift:[.16,.28],playerDepth:[4.05,4.34],planeDepth:[9.0,9.8],planeLift:[.04,.00]
  },
  {
    // Final player insert is a cut-on-action: shot size changes while the banking vector is preserved.
    path:[[-5.55,2.05,-27.5],[-5.42,2.08,-28.4],[-5.26,2.13,-29.5],[-5.08,2.20,-30.7]],
    fov:[26.5,28.0],roll:[.042,.018],lookLift:[.08,.16],lookSide:[-.16,-.02],
    bossSide:[2.20,2.45],bossLift:[1.36,1.46],bossDepth:[18.0,19.0],playerSide:[-.50,-.36],playerLift:[-.04,.04],playerDepth:[1.62,1.82],planeDepth:[7.8,8.0],planeLift:[.00,.02]
  },
  {
    // Wide release remains on the same side, then eases toward the axis without crossing it.
    path:[[-5.75,2.22,-29.0],[-5.50,2.18,-32.5],[-4.35,2.14,-38.2],[-2.15,2.38,-46.0]],
    fov:[36.0,44.0],roll:[.070,.012],lookLift:[.34,.50],lookSide:[.34,.05],
    bossSide:[.82,.16],bossLift:[1.26,1.64],bossDepth:[19.0,28.0],playerSide:[-.46,-.10],playerLift:[.18,.28],playerDepth:[4.62,5.42],planeDepth:[10.3,12.2],planeLift:[.16,.22]
  }
];
