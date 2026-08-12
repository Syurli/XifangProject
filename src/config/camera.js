// Cinematic camera timeline and framing data.
const CAMERA_DEFAULT={eye:[0,1.2,8],target:[0,1,-8],up:[0,1,0],fov:36*Math.PI/180,near:.075,far:120};

// 5 skill phases / 12 actual cuts. Several cuts are cinematic-only inserts.
// Itano-inspired inserts are adapted to this prototype: the camera never crosses the action axis,
// and missile/beam density is visual-only until the active combat cut resumes.
const CAMERA_SHOTS=[
  {name:'CUT 01',phase:0,label:'建立·低位尾追',skill:'星河散华',mode:0,duration:3.4,operation:false,role:'ESTABLISH',technique:'CHASE WIDE / AXIS LOCK',clarity:'LOW_FX'},
  {name:'CUT 02',phase:0,label:'战斗·尾追进入',skill:'星河散华',mode:0,duration:5.0,operation:true,role:'COMBAT',technique:'CHASE / MATCH VECTOR',clarity:'COMBAT'},

  {name:'CUT 03',phase:1,label:'Boss起手·同侧近景',skill:'扇面米粒阵',mode:4,duration:1.55,operation:false,role:'BOSS_CLOSE',technique:'SAME-SIDE CLOSE / EYELINE',clarity:'HERO_FX'},
  {name:'CUT 04',phase:1,label:'板野一·导引束穿越',skill:'扇面米粒阵',mode:4,duration:2.05,operation:false,role:'ITANO_PASS',technique:'MISSILE PASS / NEAR-LENS PARALLAX',clarity:'ITANO'},
  {name:'CUT 05',phase:1,label:'战斗·右翼近距并行',skill:'扇面米粒阵',mode:4,duration:4.95,operation:true,role:'COMBAT_CLOSE',technique:'SIDE CHASE / SAME AXIS',clarity:'COMBAT_CLOSE'},

  {name:'CUT 06',phase:2,label:'高速·长焦擦身',skill:'针束压制',mode:2,duration:4.8,operation:true,role:'COMBAT_TELE',technique:'TELEPHOTO PASS / MATCH ACTION',clarity:'COMBAT'},
  {name:'CUT 07',phase:2,label:'主角反应·近景',skill:'针束压制',mode:2,duration:1.25,operation:false,role:'PLAYER_CLOSE',technique:'REACTION CLOSE / SAME SCREEN VECTOR',clarity:'HERO_FX'},

  {name:'CUT 08',phase:3,label:'板野二·蛇行追逐',skill:'花瓣回旋',mode:3,duration:2.4,operation:false,role:'ITANO_CHASE',technique:'WEAVE CHASE / DEPTH LAYERS',clarity:'ITANO'},
  {name:'CUT 09',phase:3,label:'战斗·同侧侧追',skill:'花瓣回旋',mode:3,duration:5.2,operation:true,role:'COMBAT_SIDE',technique:'SIDE TRACK / AXIS LOCK',clarity:'COMBAT'},

  {name:'CUT 10',phase:4,label:'主角决断·近景',skill:'终端坠流',mode:1,duration:1.35,operation:false,role:'PLAYER_CLOSE',technique:'REACTION CLOSE / MOTION HOLD',clarity:'HERO_FX'},
  {name:'CUT 11',phase:4,label:'板野三·弹幕开花',skill:'终端坠流',mode:1,duration:2.45,operation:false,role:'ITANO_BLOOM',technique:'SWARM BLOOM / CAMERA THREAD',clarity:'ITANO'},
  {name:'CUT 12',phase:4,label:'终局·尾追脱离大全景',skill:'终端坠流',mode:1,duration:5.6,operation:true,role:'COMBAT_WIDE',technique:'CHASE RELEASE / PULL BACK',clarity:'COMBAT_WIDE'}
];

// All camera paths stay on the same side of the action axis.
// path = cubic Bezier camera path. Framing values are [start,end].
const CAMERA_SETUPS=[
  {path:[[0,1.30,9.4],[.6,1.18,8.0],[1.0,1.22,6.4],[1.5,1.32,4.9]],fov:[41,38],roll:[-.01,-.035],lookLift:[.18,.25],lookSide:[-.10,.08],bossSide:[.08,.24],bossLift:[1.58,1.52],bossDepth:[25,23.5],playerSide:[-.10,-.18],playerLift:[.28,.31],playerDepth:[4.8,4.65],planeDepth:[11,10.6],planeLift:[.02,.05]},
  {path:[[1.5,1.32,4.9],[2.0,1.38,2.2],[2.55,1.45,-.6],[3.0,1.52,-3.2]],fov:[38,35.5],roll:[-.035,-.065],lookLift:[.25,.34],lookSide:[.08,.28],bossSide:[.24,.52],bossLift:[1.52,1.46],bossDepth:[23.5,22.3],playerSide:[-.18,-.28],playerLift:[.31,.34],playerDepth:[4.65,4.5],planeDepth:[10.6,10.3],planeLift:[.05,.08]},

  {path:[[-4.7,2.45,-4.0],[-4.1,2.55,-5.3],[-3.5,2.63,-6.5],[-2.9,2.72,-7.6]],fov:[28.5,30.5],roll:[-.07,-.09],lookLift:[.46,.50],lookSide:[.40,.30],bossSide:[.95,.60],bossLift:[1.44,1.56],bossDepth:[13.0,14.2],playerSide:[-.42,-.35],playerLift:[.22,.28],playerDepth:[4.0,4.1],planeDepth:[8.5,8.9],planeLift:[.08,.06]},
  {path:[[-3.0,2.75,-7.8],[-2.1,2.85,-9.0],[-1.0,2.96,-10.5],[.2,3.05,-12.0]],fov:[34,37],roll:[-.10,-.13],lookLift:[.50,.42],lookSide:[.36,.20],bossSide:[.72,.36],bossLift:[1.55,1.68],bossDepth:[16.0,18.2],playerSide:[-.36,-.28],playerLift:[.26,.34],playerDepth:[4.15,4.4],planeDepth:[9.1,9.7],planeLift:[.05,.02]},
  {path:[[-4.6,2.70,-6.3],[-3.4,2.86,-8.2],[-1.6,3.08,-11.1],[.8,3.35,-14.3]],fov:[32,35],roll:[-.10,-.14],lookLift:[.43,.54],lookSide:[.46,.23],bossSide:[.92,.38],bossLift:[1.50,1.72],bossDepth:[17.0,18.8],playerSide:[-.52,-.30],playerLift:[.24,.36],playerDepth:[4.2,4.45],planeDepth:[9.3,9.8],planeLift:[.09,.04]},

  {path:[[2.6,4.8,-18.4],[2.1,4.4,-16.2],[1.4,3.8,-13.8],[.2,3.15,-10.9]],fov:[30,37.5],roll:[.045,.085],lookLift:[-.03,-.20],lookSide:[-.08,-.28],bossSide:[-.24,-.54],bossLift:[2.02,2.20],bossDepth:[20.5,23.5],playerSide:[.30,.42],playerLift:[.47,.54],playerDepth:[4.9,5.1],planeDepth:[10.8,11.4],planeLift:[-.12,-.20]},
  {path:[[-1.2,2.45,-7.4],[-1.6,2.50,-8.0],[-2.0,2.54,-8.7],[-2.3,2.58,-9.4]],fov:[27,29],roll:[.02,.00],lookLift:[.12,.17],lookSide:[-.20,-.10],bossSide:[-.42,-.30],bossLift:[1.50,1.60],bossDepth:[15.0,16.0],playerSide:[.22,.18],playerLift:[.20,.25],playerDepth:[3.7,3.8],planeDepth:[8.5,8.8],planeLift:[.02,.03]},

  {path:[[-2.5,3.0,-9.8],[-1.6,3.15,-11.6],[-.4,3.35,-13.4],[1.1,3.55,-15.0]],fov:[35,39],roll:[-.055,-.105],lookLift:[.30,.18],lookSide:[.34,.16],bossSide:[.56,.28],bossLift:[1.55,1.74],bossDepth:[18.4,20.2],playerSide:[-.36,-.24],playerLift:[.28,.34],playerDepth:[4.4,4.6],planeDepth:[9.7,10.2],planeLift:[.06,.02]},
  {path:[[-3.9,3.05,-9.5],[-3.0,3.20,-11.8],[-1.4,3.42,-14.0],[.7,3.62,-16.2]],fov:[34,36],roll:[-.06,-.08],lookLift:[.24,.18],lookSide:[.30,.12],bossSide:[.48,.16],bossLift:[1.58,1.72],bossDepth:[19.0,21.0],playerSide:[-.30,-.18],playerLift:[.30,.36],playerDepth:[4.5,4.65],planeDepth:[9.9,10.4],planeLift:[.05,.00]},

  {path:[[-1.0,2.30,-7.1],[-1.4,2.34,-7.7],[-1.8,2.38,-8.3],[-2.1,2.42,-8.9]],fov:[27,28.5],roll:[.015,.00],lookLift:[.10,.16],lookSide:[-.18,-.08],bossSide:[-.36,-.24],bossLift:[1.48,1.58],bossDepth:[14.8,15.8],playerSide:[.20,.16],playerLift:[.18,.24],playerDepth:[3.65,3.8],planeDepth:[8.4,8.8],planeLift:[.02,.03]},
  {path:[[-2.2,2.8,-9.4],[-1.2,2.95,-11.2],[.1,3.15,-13.0],[1.6,3.35,-14.8]],fov:[36,41],roll:[-.07,-.11],lookLift:[.28,.16],lookSide:[.34,.12],bossSide:[.60,.22],bossLift:[1.52,1.78],bossDepth:[18.0,21.0],playerSide:[-.34,-.18],playerLift:[.27,.34],playerDepth:[4.35,4.65],planeDepth:[9.6,10.4],planeLift:[.06,.02]},
  {path:[[4.6,2.18,-7.3],[5.0,2.10,-10.2],[3.8,2.02,-15.1],[.8,2.28,-21.2]],fov:[36,43],roll:[.07,.015],lookLift:[.34,.48],lookSide:[.34,.04],bossSide:[.82,.16],bossLift:[1.30,1.64],bossDepth:[19.4,27.5],playerSide:[-.46,-.10],playerLift:[.18,.27],playerDepth:[4.7,5.4],planeDepth:[10.2,12.1],planeLift:[.15,.20]}
];

// Per-cut visual budgets. These are intentionally conservative: readability first.
const VISUAL_PROFILES={
  LOW_FX:{impactScale:.72,impactAlpha:.42,fiberAlpha:.42,fiberWidth:.72,crossingRate:0,structuralRate:64,cardScale:.86,starAlpha:.70,bloom:.68},
  HERO_FX:{impactScale:.62,impactAlpha:.26,fiberAlpha:.28,fiberWidth:.62,crossingRate:0,structuralRate:96,cardScale:.78,starAlpha:.58,bloom:.55},
  ITANO:{impactScale:.82,impactAlpha:.34,fiberAlpha:.80,fiberWidth:.72,crossingRate:5,structuralRate:48,cardScale:.72,starAlpha:.52,bloom:.62},
  COMBAT:{impactScale:.88,impactAlpha:.70,fiberAlpha:.42,fiberWidth:.82,crossingRate:18,structuralRate:54,cardScale:.90,starAlpha:.62,bloom:.72},
  COMBAT_CLOSE:{impactScale:.74,impactAlpha:.66,fiberAlpha:.34,fiberWidth:.72,crossingRate:26,structuralRate:64,cardScale:.82,starAlpha:.52,bloom:.64},
  COMBAT_WIDE:{impactScale:.98,impactAlpha:.74,fiberAlpha:.48,fiberWidth:.90,crossingRate:14,structuralRate:48,cardScale:.96,starAlpha:.68,bloom:.74}
};
