import { Eye, RotateCcw, Scan, Tag, Zap } from 'lucide-react'
import { useViewerStore } from '../../store/viewerStore'

export default function ViewControls() {
  const viewMode = useViewerStore((state) => state.viewMode)
  const annotations = useViewerStore((state) => state.showAnnotations)
  const rays = useViewerStore((state) => state.showLightRays)
  const setViewMode = useViewerStore((state) => state.setViewMode)
  const toggleAnnotations = useViewerStore((state) => state.toggleAnnotations)
  const toggleRays = useViewerStore((state) => state.toggleRays)
  const resetCamera = useViewerStore((state) => state.resetCamera)

  return (
    <div className="view-toolbar">
      <div className="segmented view-segmented" role="group" aria-label="模型显示方式">
        <button className={viewMode === 'full' ? 'selected' : ''} aria-pressed={viewMode === 'full'} onClick={() => setViewMode('full')}><Eye size={14} />完整眼球</button>
        <button className={viewMode === 'cutaway' ? 'selected' : ''} aria-pressed={viewMode === 'cutaway'} onClick={() => setViewMode('cutaway')}><Scan size={14} />半剖视图</button>
      </div>
      <div className="view-toolbar-actions">
        <button className={`toolbar-toggle ${annotations ? 'enabled' : ''}`} aria-label={annotations ? '隐藏结构标注' : '显示结构标注'} aria-pressed={annotations} onClick={toggleAnnotations}><Tag size={15} /><span>标注</span></button>
        <button className={`toolbar-toggle ${rays ? 'enabled' : ''}`} aria-label={rays ? '隐藏示意光线' : '显示示意光线'} aria-pressed={rays} onClick={toggleRays}><Zap size={15} /><span>光线</span></button>
        <span className="toolbar-divider" />
        <button className="icon-button reset-view" aria-label="重置视角" title="重置视角" onClick={resetCamera}><RotateCcw size={16} /></button>
      </div>
    </div>
  )
}
