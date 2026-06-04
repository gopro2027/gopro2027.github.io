"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"

/**
 * Vanilla Three.js PCB viewer.
 *
 * Intentionally does NOT use @react-three/fiber: fiber bundles its own
 * react-reconciler that reads React-version-specific internals
 * (e.g. ReactCurrentBatchConfig), which breaks when the host app's React
 * version differs from what fiber expects. Vanilla Three.js sidesteps that
 * entirely and works on any React version.
 */
export default function PCBViewer() {
  const mountRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let width = mount.clientWidth || 800
    let height = mount.clientHeight || 520

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100)
    camera.position.set(0, 0, 6)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // ─── Lighting rig ───
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    const key = new THREE.DirectionalLight(0xfff8ee, 1.6)
    key.position.set(5, 7, 4)
    scene.add(key)

    const fill = new THREE.DirectionalLight(0xd0e8ff, 0.55)
    fill.position.set(-5, 2, -2)
    scene.add(fill)

    const rim = new THREE.DirectionalLight(0xbca082, 0.35)
    rim.position.set(0, -4, -6)
    scene.add(rim)

    const pTop = new THREE.PointLight(0xffffff, 0.9, 0, 2)
    pTop.position.set(0, 5, 2)
    scene.add(pTop)

    const pBottom = new THREE.PointLight(0x8b6946, 0.25, 0, 2)
    pBottom.position.set(0, -3, 1)
    scene.add(pBottom)

    // ─── Group that we rotate (pivots about the centered board) ───
    const group = new THREE.Group()
    scene.add(group)

    let disposed = false
    let frameId = 0

    // ─── Load model (MTL then OBJ) ───
    const mtlLoader = new MTLLoader()
    mtlLoader.load(
      "/assets/pcb/3D_PCB1_5_2026-06-03.mtl",
      (materials) => {
        if (disposed) return
        materials.preload()
        const objLoader = new OBJLoader()
        objLoader.setMaterials(materials)
        objLoader.load(
          "/assets/pcb/3D_PCB1_5_2026-06-03.obj",
          (obj) => {
            if (disposed) return
            // Center geometry at the group origin so rotation pivots about
            // the PCB center, then scale to fit a ~3 unit bounding box.
            const box = new THREE.Box3().setFromObject(obj)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            const maxDim = Math.max(size.x, size.y, size.z) || 1
            obj.position.sub(center)
            group.scale.setScalar(3.0 / maxDim)
            group.add(obj)
          },
          undefined,
          (err) => console.error("PCB OBJ load error:", err)
        )
      },
      undefined,
      (err) => console.error("PCB MTL load error:", err)
    )

    // ─── Resize handling ───
    const onResize = () => {
      width = mount.clientWidth || width
      height = mount.clientHeight || height
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener("resize", onResize)

    // ─── Scroll mapping (0 at top → 1 after ~1.4 viewports) ───
    const onScroll = () => {
      const maxScroll = window.innerHeight * 1.4
      scrollRef.current = Math.min(window.scrollY / maxScroll, 1)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    // ─── Animation loop: flat at top, eases into diagonal + spin on scroll ───
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const s = scrollRef.current
      const targetX = -0.5 * s
      const targetY = s * Math.PI * 1.6
      const targetZ = 0.42 * s
      group.rotation.x += (targetX - group.rotation.x) * 0.055
      group.rotation.y += (targetY - group.rotation.y) * 0.055
      group.rotation.z += (targetZ - group.rotation.z) * 0.055
      renderer.render(scene, camera)
    }
    animate()

    // ─── Cleanup ───
    return () => {
      disposed = true
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
      scene.traverse((o) => {
        const mesh = o as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const mat = mesh.material
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
        else if (mat) (mat as THREE.Material).dispose()
      })
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      style={{
        width: "100%",
        height: "520px",
        position: "relative",
        borderRadius: "24px",
        overflow: "hidden",
      }}
    >
      {/* Soft floor glow beneath the board */}
      <div
        style={{
          position: "absolute",
          bottom: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "55%",
          height: "60px",
          background:
            "radial-gradient(ellipse at center, rgba(188,160,130,0.18), transparent 70%)",
          filter: "blur(12px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
      />
    </div>
  )
}
