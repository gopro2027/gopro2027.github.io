"use client"

import { Suspense, useEffect, useRef } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js"
import * as THREE from "three"

/* ─── Shimmer fallback while the model loads ─── */
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 0.05, 1.6]} />
      <meshStandardMaterial color="#1a1a1a" />
    </mesh>
  )
}

/* ─── Lighting rig ─── */
function Lights() {
  return (
    <>
      {/* Soft ambient */}
      <ambientLight intensity={0.5} />
      {/* Key light – warm, top-left */}
      <directionalLight position={[5, 7, 4]} intensity={1.6} color="#fff8ee" />
      {/* Fill light – cool blue-white, right side */}
      <directionalLight position={[-5, 2, -2]} intensity={0.55} color="#d0e8ff" />
      {/* Back rim – gold accent */}
      <directionalLight position={[0, -4, -6]} intensity={0.35} color="#bca082" />
      {/* Point above for component highlights */}
      <pointLight position={[0, 5, 2]} intensity={0.9} color="#ffffff" decay={2} />
      {/* Subtle point below for underside glow */}
      <pointLight position={[0, -3, 1]} intensity={0.25} color="#8b6946" decay={2} />
    </>
  )
}

/* ─── The PCB mesh ─── */
function PCBModel({
  scrollRef,
}: {
  scrollRef: React.MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const initialised = useRef(false)

  // Load MTL first, then OBJ with materials applied
  const materials = useLoader(
    MTLLoader,
    "/assets/pcb/3D_PCB1_5_2026-06-03.mtl"
  )
  materials.preload()

  const obj = useLoader(
    OBJLoader,
    "/assets/pcb/3D_PCB1_5_2026-06-03.obj",
    (loader) => {
      ;(loader as OBJLoader).setMaterials(materials)
    }
  )

  // Auto-center and scale the model once loaded
  useEffect(() => {
    if (!groupRef.current || initialised.current) return
    initialised.current = true

    // Measure the loaded geometry
    const box = new THREE.Box3().setFromObject(obj)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)

    // Offset the inner object so its geometric center sits exactly at the
    // group's origin — this makes the group rotate about the PCB center.
    obj.position.sub(center)

    // Fit to a ~3 unit bounding box (scale the group about the centered origin)
    const scale = 3.0 / maxDim
    groupRef.current.scale.setScalar(scale)
    groupRef.current.position.set(0, 0, 0)

    // Start flat, facing the camera, at the top of the page
    groupRef.current.rotation.set(0, 0, 0)
  }, [obj])

  // Scroll-driven rotation with smooth lerp (pivots about the centered origin).
  // At scroll top (s = 0) the board is flat; it eases into a diagonal 3/4
  // angle and spins as the user scrolls down.
  useFrame(() => {
    if (!groupRef.current) return
    const s = scrollRef.current
    const targetX = -0.5 * s
    const targetY = s * Math.PI * 1.6
    const targetZ = 0.42 * s
    const rot = groupRef.current.rotation
    rot.x += (targetX - rot.x) * 0.055
    rot.y += (targetY - rot.y) * 0.055
    rot.z += (targetZ - rot.z) * 0.055
  })

  return (
    <group ref={groupRef}>
      <primitive object={obj} />
    </group>
  )
}

/* ─── Public component ─── */
export default function PCBViewer() {
  // Use a ref so scroll updates never trigger re-renders
  const scrollRef = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      // Map the first ~1.5 viewport heights of scroll to 0–1
      const maxScroll = window.innerHeight * 1.4
      scrollRef.current = Math.min(window.scrollY / maxScroll, 1)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
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
      <Canvas
        camera={{ position: [0, 1.5, 6], fov: 38 }}
        gl={{ alpha: true, antialias: true }}
        style={{
          background: "transparent",
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Lights />
        <Suspense fallback={<LoadingFallback />}>
          <PCBModel scrollRef={scrollRef} />
        </Suspense>
      </Canvas>
    </div>
  )
}
