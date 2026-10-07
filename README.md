# 视界实验室 · EyeVisPro

本地运行的中文眼球视觉原理 3D 交互教学网页。通过眼球剖面、代表性光线、结构标注和六个教学步骤，观察「为什么能看见」。第一阶段采用程序生成的 Demo Eye，无需下载模型或连接在线服务。

## 启动

需要 Node.js **22.14 或更高版本**及 npm。

```bash
npm install
npm run dev
```

打开终端显示的本地地址（默认 `http://127.0.0.1:5173`）。若端口占用，Vite 会选择下一可用端口。安装依赖需要网络；依赖安装后，页面、模型、图标和动画均在本地运行。

```bash
npm run build       # TypeScript 检查与生产构建，输出 dist/
npm run preview     # 本地预览构建产物
npm run typecheck   # 仅检查 TypeScript
npm test            # 教学状态和光线路径约束测试
```

生产版需要用静态 HTTP 服务器托管 `dist/`，不应直接双击 `index.html`。

## 当前功能

- 全中文三栏教学工作台，六个视觉原理步骤与十种眼球结构。
- 完整眼球 / 半剖视模式；鼠标旋转、滚轮缩放、右键拖动平移、重置视角。
- 点击模型或结构列表查看说明，当前结构与相关结构高亮。
- 世界空间结构标签，随相机运动投影，支持隐藏。
- 独立光线系统，角膜与晶状体处改变方向；两组光线在视网膜形成倒立、缩小的箭头。
- 播放、暂停、重新播放、上一步 / 下一步、连续播放控制。
- 观察远处 / 近处切换与晶状体厚度演示；明亮 / 较暗环境与瞳孔口径演示。
- 视网膜光信号转为神经信号的视神经脉冲演示。
- WebGL 错误的中文回退提示，以及独立于 WebGL 的说明和控制面板。

鼠标左键拖动旋转，滚轮缩放，右键拖动平移；点击结构或标签选中。页面「操作帮助」包含交互说明。

## 教学范围

流程：物体反射光 → 角膜折射 → 瞳孔开口 → 晶状体进一步聚焦 → 玻璃体 → 视网膜倒立成像 → 视神经信号。

瞳孔是虹膜中央的开口，控制进光量；近处观察时晶状体更凸，远处观察时相对更扁。程序模型的尺寸、折射路径、信号速度均为教学示意，不进行严格光线追踪。第一阶段未实现近视、远视、散光、矫正镜片、双眼视觉或完整大脑模型。

角膜、瞳孔、晶状体、视网膜及视神经的基础视觉流程参考 [美国国家眼科研究所说明](https://www.nei.nih.gov/eye-health-information/healthy-vision/how-eyes-work)。

## 技术栈

React 19 / TypeScript / Vite 7 / Three.js / React Three Fiber 9 / drei / Zustand / CSS / lucide-react。无后端、账户、SaaS、运行时 CDN 字体或远程纹理。React 与 Fiber 的主版本配对遵循 [React Three Fiber 官方说明](https://r3f.docs.pmnd.rs/getting-started/installation)。

## 目录

```text
EyeVisPro/
├── docs/
│   ├── requirements.md       完整需求与当前阶段
│   ├── architecture.md       方案、坐标与组件职责
│   └── project_memory.md     实现状态、验证与后续事项
├── public/
│   ├── favicon.svg
│   └── models/eye/           正式 GLB 预留目录
├── src/
│   ├── components/
│   │   ├── viewer/           模型、光线、标注、相机
│   │   ├── layout/           标题、导航、说明
│   │   ├── controls/         视图与动画控制
│   │   └── ui/               通用界面组件
│   ├── data/                 结构、教学步骤、标注
│   ├── store/viewerStore.ts  统一教学状态
│   ├── types/                共享类型
│   ├── utils/optics.ts       光学示意路径生成
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── tests/                    有意义的状态与光学约束验证
├── index.html
├── package.json
└── vite.config.ts
```

## 模型与替换

当前是 `EyeModel.tsx` 内的程序几何，**没有附带正式 GLB**。独立结构 Mesh 通过 `eyeStructures.ts` 中的 `modelObjectName → structureId` 映射连接教学数据。坐标：眼球中心原点，X 负为前端，Y 向上，Z 正半球是切除面；默认球体半径约 1.65。

正式模型放入 `public/models/eye/`，推荐 `eye_full.glb` 与 `eye_cutaway.glb`。命名建议 `Cornea_Mesh`、`Iris_Mesh`、`Pupil_Mesh`、`Lens_Mesh`、`Vitreous_Mesh`、`Retina_Mesh`、`Macula_Mesh`、`Sclera_Mesh`、`CiliaryBody_Mesh`、`OpticNerve_Mesh`；精确名称以数据文件映射为准。

接入正式模型时：

1. 先更新三份文档，记录资产来源、许可、尺寸、坐标与切面方案。
2. 在 EyeModel 层使用 `useGLTF` / `Suspense` 加载本地资产，归一化比例与坐标。
3. 遍历已命名 Mesh，通过集中映射注册点击、hover 与高亮材质；保留 store 与 UI 的结构 ID。
4. 按完整 / 剖面状态切换结构 Mesh 或两个资产，更新标注锚点和光线表面坐标。
5. 保留中文加载失败回退；验证未知 Mesh、标注缺失、资源释放与两种视图。

这是后续模型适配工作，当前版本不会尝试请求不存在的 `.glb`。Viewer、UI 和教学数据可继续复用。

## 如何扩展

- **新结构**：先更新文档；在 `types/index.ts` 增加 ID，在 `eyeStructures.ts` 增加中文说明与名称映射，在模型层增加对应 Mesh。需要标注时继续新增锚点。
- **新教学步骤**：在 `visionPrinciples.ts` 增加标题、短说明、关键理解、关联结构、相机预设、动画类型和时长；更新动画分段以及必要的步骤数量约束。
- **新光线动画**：在 `optics.ts` 扩展纯路径生成，在 `LightRaySystem.tsx` 按 `animationType` 选择路径与进度区间。使用 `useMemo` 复用几何，`useFrame/ref` 更新运动对象，避免逐帧 React 状态更新。
- **新标注**：在 `annotations.ts` 添加 `structureId`、世界空间 `position` 与 `labelPosition`；外部结构设定 `fullVisible`，避免完整模型显示不可见的内部标注。

任何需求变更均须先核对 `docs/requirements.md`，明显架构变更同步 `architecture.md`，开发完成更新 `project_memory.md`。

交互形式参考了用户指定的 [MSD 三维眼球示例](https://www.msdmanuals.com/professional/multimedia/3dmodel/eye-anterior-and-posterior-chambers) 与 [BioDigital 示例](https://human.biodigital.com/widget/?be=2hjF&initial=true&ui-annotations=true&ui-info=true&ui-zoom=true&ui-help=true&ui-tools-display=primary&ui-tools=true&uaid=3A0Tp)。本项目使用独立实现的界面和程序模型。
