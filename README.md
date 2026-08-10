# XifangProject

西方 Project 的浏览器预演仓库。当前首页为 **3D 弹幕 Boss 战电影运镜 / 2D 判定** 的 WebGL 原型。

## 在线预览

GitHub Pages 部署后访问：

`https://syurli.github.io/XifangProject/`

## 工程结构

```text
.
├─ index.html                  # GitHub Pages 入口，仅保留 DOM 结构
├─ assets/
│  └─ styles/
│     └─ main.css              # HUD、电影框、控制 UI 与响应式样式
├─ src/
│  ├─ main.js                  # WebGL 生命周期、场景、弹幕、输入与运行时调度
│  ├─ config/
│  │  └─ camera.js             # 5 镜头摄影节拍、连续航迹与构图配置
│  └─ render/
│     └─ shaders.js            # GLSL Shader 源码
└─ .github/
   └─ workflows/
      └─ pages.yml             # GitHub Pages 自动部署
```

## 本地运行

项目使用 ES Modules，建议通过任意静态服务器运行，而不是直接双击 `index.html`：

```bash
python -m http.server 8080
```

然后打开 `http://localhost:8080/`。

## 操作

- `WASD` / 方向键：二维相对位移
- `Shift`：低速专注、碰撞核心与高危命中提示
- “专注预览”：锁定专注模式
- “暂停”：暂停时间轴
- “重置”：从镜头组起点重新播放

## 架构原则

- 摄影运动属于表现层；玩家输入始终映射到屏幕相对二维坐标。
- Boss、玩家模型和投影平面可随镜头在世界空间运动，但逻辑判定不随摄影机位改变。
- Shader 与镜头配置从主运行时分离，方便继续拆分 `bullet / spellcard / camera director / effects` 等模块。

## 部署

`main` 分支有提交时，`.github/workflows/pages.yml` 会将仓库根目录作为静态站点发布到 GitHub Pages。
