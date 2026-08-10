# XifangProject

西方 Project 的浏览器预演仓库。当前首页为 **3D 弹幕 Boss 战电影运镜 / 2D 判定** 的 WebGL 原型。

## 在线预览

GitHub Pages：`https://syurli.github.io/XifangProject/`

## 工程结构

```text
.
├─ index.html
├─ assets/styles/main.css
├─ src/
│  ├─ config/camera.js         # 五镜头摄影节拍、连续航迹、构图数据
│  ├─ core/runtime.js          # Canvas / WebGL / UI 状态初始化
│  ├─ core/math-camera.js      # 数学、Catmull-Rom、Camera Director
│  ├─ render/shaders.js        # GLSL 源码
│  ├─ render/programs.js       # WebGL Program 与 Uniform/Attribute 绑定
│  ├─ render/geometry.js       # 基础 Mesh 与几何生成
│  ├─ render/targets.js        # FBO / 后处理 Render Target
│  ├─ render/batches.js        # 透明/加法/光束/命中点批处理
│  ├─ scene/data.js            # 星场、符卡、弹幕图案数据
│  ├─ scene/entities.js        # 环境、Boss、玩家、符卡实体表现
│  ├─ effects/danmaku.js       # 光纤、命中波前、专注提示
│  └─ game/loop.js             # 输入、阶段、渲染与主循环
└─ .github/workflows/pages.yml
```

## 本地运行

本项目无 npm/构建依赖，可直接以静态服务器运行：

```bash
python -m http.server 8080
```

然后访问 `http://localhost:8080/`。

## 操作

- `WASD` / 方向键：二维相对位移
- `Shift`：低速专注、碰撞核心与高危命中提示
- “专注预览”：锁定专注模式
- “暂停”：暂停时间轴
- “重置”：从镜头组起点重新播放

## 架构原则

- 摄影运动属于表现层，玩家输入始终是屏幕相对二维坐标。
- Boss、玩家模型和投影面可随摄影机在世界空间运动，逻辑判定不随镜头变化。
- Camera / Render / Scene / Effects / Game Loop 已解耦，后续可继续映射到 Unreal 的 Camera Director、Niagara、Pattern Simulation 等模块。

## 部署

`main` 分支发生提交时，GitHub Actions 会将仓库根目录发布到 GitHub Pages。
