import { useEffect, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { useViewerStore } from '../../store/viewerStore'
import { visionPrinciples } from '../../data/visionPrinciples'

export default function CameraController() {
  const { camera, size } = useThree()
  const controls = useRef<OrbitControlsType>(null)
  const transitioning = useRef(true)
  const targetPosition = useRef(new THREE.Vector3(0, 0.3, 9))
  const targetLookAt = useRef(new THREE.Vector3(-0.35, 0, 0))
  const mode = useViewerStore((state) => state.viewMode)
  const revision = useViewerStore((state) => state.cameraRevision)
  const selected = useViewerStore((state) => state.selectedStructure)
  const step = useViewerStore((state) => state.currentVisionStep)
  const preset = mode === 'full' ? 'front' : selected
    ? (['cornea', 'iris', 'pupil'].includes(selected) ? 'front' : 'side-cutaway')
    : (visionPrinciples[step]?.cameraPreset ?? 'side-cutaway')
  const fitZoom = Math.min(size.width / (mode === 'cutaway' ? 7.8 : 5.5), size.height / 5.25)

  useEffect(() => {
    targetPosition.current.set(...(preset === 'side-cutaway' ? [0.0, 0.25, 9] : [-6.5, 2.8, 7.4]) as [number, number, number])
    targetLookAt.current.set(mode === 'cutaway' ? -0.35 : 0.03, 0, 0)
    transitioning.current = true
  }, [mode, revision, preset])

  useEffect(() => {
    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = fitZoom
      camera.updateProjectionMatrix()
    }
  }, [camera, fitZoom, revision, preset])

  useFrame((_, delta) => {
    if (!transitioning.current || !controls.current) return
    const amount = 1 - Math.exp(-delta * 6)
    camera.position.lerp(targetPosition.current, amount)
    controls.current.target.lerp(targetLookAt.current, amount)
    controls.current.update()
    if (camera.position.distanceToSquared(targetPosition.current) < 0.0001) transitioning.current = false
  })

  return <OrbitControls ref={controls} makeDefault enableDamping dampingFactor={0.075}
    minZoom={Math.min(40, fitZoom * 0.45)} maxZoom={Math.max(280, fitZoom * 4)} enablePan enableRotate enableZoom
    mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN }}
    onStart={() => { transitioning.current = false }} />
}
