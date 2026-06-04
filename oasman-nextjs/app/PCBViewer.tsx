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
  // Extra Y rotation (radians) accumulated from horizontal drag gestures.
  const dragRef = useRef(0)

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
    // pan-y lets the browser keep handling vertical scroll natively while we
    // capture horizontal drags to spin the model.
    renderer.domElement.style.touchAction = "pan-y"
    renderer.domElement.style.cursor = "grab"
    mount.appendChild(renderer.domElement)

    // ─── Lighting rig ───
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    const key = new THREE.DirectionalLight(0xfff8ee, 1.6)
    key.position.set(5, 7, 4)
    scene.add(key)

    const fill = new THREE.DirectionalLight(0xd0e8ff, 0.55)
    fill.position.set(-5, 2, -2)
    scene.add(fill)

    const rim = new THREE.DirectionalLight(0x60A5FA, 0.35)
    rim.position.set(0, -4, -6)
    scene.add(rim)

    const pTop = new THREE.PointLight(0xffffff, 0.9, 0, 2)
    pTop.position.set(0, 5, 2)
    scene.add(pTop)

    const pBottom = new THREE.PointLight(0x2563EB, 0.25, 0, 2)
    pBottom.position.set(0, -3, 1)
    scene.add(pBottom)

    // ─── Group that we rotate (pivots about the centered board) ───
    const group = new THREE.Group()
    scene.add(group)

    let disposed = false
    let frameId = 0

    // ─── Instant placeholder: an angled blue PCB-like board ───
    // Shown immediately so the viewer isn't empty while the (sometimes slow)
    // OBJ/MTL model loads. Built in the same ~3 unit scale the real model is
    // fit to, then swapped out once the real model is ready. Tracks its own
    // geometries/materials so they can be disposed on swap/cleanup.
    const placeholder = new THREE.Group()
    const placeholderResources: Array<THREE.BufferGeometry | THREE.Material> = []
    const trackGeo = <T extends THREE.BufferGeometry>(g: T) => {
      placeholderResources.push(g)
      return g
    }
    const trackMat = <T extends THREE.Material>(m: T) => {
      placeholderResources.push(m)
      return m
    }

    // Board substrate (blue solder mask).
    const boardMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1e40af,
        metalness: 0.15,
        roughness: 0.55,
      })
    )
    const board = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.0, 2.0, 0.12)), boardMat)
    placeholder.add(board)

    // Gold-ish copper pads / traces material.
    const copperMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xd9a441,
        metalness: 0.85,
        roughness: 0.35,
      })
    )
    // A large IC chip.
    const chipMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x111827,
        metalness: 0.3,
        roughness: 0.5,
      })
    )
    const bigChip = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.8, 0.8, 0.12)), chipMat)
    bigChip.position.set(-0.4, 0.1, 0.12)
    placeholder.add(bigChip)

    // A couple of smaller components.
    const smallChip = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.45, 0.3, 0.1)), chipMat)
    smallChip.position.set(0.75, 0.45, 0.11)
    placeholder.add(smallChip)

    const connector = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.6, 0.22, 0.18)), copperMat)
    connector.position.set(0.6, -0.6, 0.15)
    placeholder.add(connector)

    // Scattered copper pads.
    const padGeo = trackGeo(new THREE.BoxGeometry(0.16, 0.16, 0.04))
    const padSpots: Array<[number, number]> = [
      [-1.2, 0.7],
      [-1.2, 0.4],
      [-1.2, 0.1],
      [1.25, -0.3],
      [1.25, 0.0],
      [0.0, -0.7],
      [-0.3, -0.7],
    ]
    for (const [px, py] of padSpots) {
      const pad = new THREE.Mesh(padGeo, copperMat)
      pad.position.set(px, py, 0.085)
      placeholder.add(pad)
    }

    // Sit at a pleasing angle (matches the model's diagonal resting pose).
    placeholder.rotation.set(-0.45, 0.55, 0.18)
    group.add(placeholder)

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
            // Swap the placeholder for the real model.
            group.remove(placeholder)
            placeholderResources.forEach((r) => r.dispose())
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

    // ─── Horizontal drag to spin ───
    // Tracks pointer movement and decides per-gesture whether the user is
    // dragging horizontally (spin the model) or vertically (let the page
    // scroll). Once a vertical scroll intent is detected we bail out so we
    // never fight the browser's scrolling.
    const el = renderer.domElement
    let dragging = false
    let decided = false
    let isHorizontal = false
    let startX = 0
    let startY = 0
    let lastX = 0
    const DRAG_SENSITIVITY = 0.01 // radians per pixel

    const onPointerDown = (e: PointerEvent) => {
      dragging = true
      decided = false
      isHorizontal = false
      startX = e.clientX
      startY = e.clientY
      lastX = e.clientX
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      if (!decided) {
        const dx = Math.abs(e.clientX - startX)
        const dy = Math.abs(e.clientY - startY)
        // Wait until there's enough movement to classify the gesture.
        if (dx < 6 && dy < 6) return
        decided = true
        isHorizontal = dx > dy
        if (isHorizontal) {
          el.style.cursor = "grabbing"
          el.setPointerCapture(e.pointerId)
        } else {
          // Vertical intent: release so the page scrolls normally.
          dragging = false
          return
        }
      }
      if (!isHorizontal) return
      e.preventDefault()
      const dx = e.clientX - lastX
      lastX = e.clientX
      dragRef.current += dx * DRAG_SENSITIVITY
    }

    const onPointerUp = (e: PointerEvent) => {
      dragging = false
      decided = false
      el.style.cursor = "grab"
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    }

    el.addEventListener("pointerdown", onPointerDown)
    el.addEventListener("pointermove", onPointerMove)
    el.addEventListener("pointerup", onPointerUp)
    el.addEventListener("pointercancel", onPointerUp)

    // ─── Animation loop: flat at top, eases into diagonal + spin on scroll ───
    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const s = scrollRef.current
      const targetX = -0.5 * s
      const targetY = s * Math.PI * 2.6 + dragRef.current
      const targetZ = 0.42 * s
      group.rotation.x += (targetX - group.rotation.x) * 0.055
      group.rotation.y += (targetY - group.rotation.y) * 0.055
      group.rotation.z += (targetZ - group.rotation.z) * 0.055
      renderer.render(scene, camera)
    }

    // ─── Only run the render loop while the viewer is on screen ───
    // Otherwise the WebGL scene keeps rendering at 60fps off-screen, which
    // pins the GPU and causes scroll stutter elsewhere on the page (mobile).
    let running = false
    const start = () => {
      if (running || disposed) return
      running = true
      frameId = requestAnimationFrame(animate)
    }
    const stop = () => {
      if (!running) return
      running = false
      cancelAnimationFrame(frameId)
    }

    const visObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start()
        else stop()
      },
      { threshold: 0 }
    )
    visObserver.observe(mount)

    // ─── Cleanup ───
    return () => {
      disposed = true
      stop()
      visObserver.disconnect()
      cancelAnimationFrame(frameId)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("scroll", onScroll)
      el.removeEventListener("pointerdown", onPointerDown)
      el.removeEventListener("pointermove", onPointerMove)
      el.removeEventListener("pointerup", onPointerUp)
      el.removeEventListener("pointercancel", onPointerUp)
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
            "radial-gradient(ellipse at center, rgba(96,165,250,0.18), transparent 70%)",
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
