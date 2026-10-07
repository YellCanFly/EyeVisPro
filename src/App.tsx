import { useState } from 'react'
import { ChevronRight, MousePointer2, Move3D } from 'lucide-react'
import EyeViewer from './components/viewer/EyeViewer'
import Header from './components/layout/Header'
import PrinciplePanel from './components/layout/PrinciplePanel'
import InfoPanel from './components/layout/InfoPanel'
import ViewControls from './components/controls/ViewControls'
import ContextControls from './components/controls/ContextControls'
import AnimationControls from './components/controls/AnimationControls'
import HelpDialog from './components/ui/HelpDialog'
import { useViewerStore } from './store/viewerStore'
import { visionPrinciples } from './data/visionPrinciples'
import './styles.css'

export default function App() {
  const [helpOpen, setHelpOpen] = useState(false)
  const currentStep = useViewerStore((state) => state.currentVisionStep)
  const viewMode = useViewerStore((state) => state.viewMode)
  const showLightRays = useViewerStore((state) => state.showLightRays)
  const step = visionPrinciples[currentStep]

  return (
    <div className="app-shell">
      <Header onHelp={() => setHelpOpen(true)} />
      <main className="main-content">
        <section className="page-intro" aria-labelledby="page-title">
          <div>
            <div className="eyebrow"><span className="live-dot" /> 发现人眼的精妙之处</div>
            <h1 id="page-title">看见，从一束光开始<span>。</span></h1>
            <p>走进眼球内部，跟随光线的旅程，探索我们如何看见这个世界。</p>
          </div>
          <div className="intro-note"><Move3D size={21} strokeWidth={1.6} /><span>旋转、探索、理解<small>让抽象原理变得直观</small></span></div>
        </section>

        <div className="workspace">
          <PrinciplePanel />
          <section className="viewer-panel" aria-label="眼球三维交互演示">
            <ViewControls />
            <div className="viewer-stage">
              <div className="scene-heading"><span className="scene-status" />{viewMode === 'cutaway' ? '半剖视图' : '完整眼球'}<span className="scene-heading-separator" />交互式模型</div>
              <div className="scene-step-pill"><span>{String(currentStep + 1).padStart(2, '0')}</span>{step.title}</div>
              <EyeViewer />
              <div className="scene-footer">
                <span><MousePointer2 size={13} /> 拖动旋转 · 滚轮缩放</span>
                {showLightRays && <span className="ray-legend"><i />示意光线</span>}
              </div>
            </div>
            <ContextControls />
          </section>
          <InfoPanel />
        </div>

        <AnimationControls />
        <footer className="page-footer">
          <p><span className="footer-dot" /> 教学示意模型 · 光线路径与结构比例经过简化</p>
          <button className="text-button" onClick={() => setHelpOpen(true)}>第一次探索？查看操作帮助 <ChevronRight size={14} /></button>
        </footer>
      </main>
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
