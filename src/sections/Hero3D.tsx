import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, OrbitControls, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { TRUCK } from '@/data/menu'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, UtensilsCrossed, ClipboardList } from 'lucide-react'

/* ── 3D pieces ─────────────────────────────────────────────── */

function CricketBall() {
  const group = useRef<THREE.Group>(null)
  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.6
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15
  })
  return (
    <Float speed={1.6} rotationIntensity={0.25} floatIntensity={1.1}>
      <group ref={group} position={[0, 1.6, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.55, 48, 48]} />
          <meshStandardMaterial color="#c1121f" roughness={0.35} metalness={0.15} />
        </mesh>
        {/* seam */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.552, 0.012, 12, 72]} />
          <meshStandardMaterial color="#f8f4e3" roughness={0.6} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0.35, 0]}>
          <torusGeometry args={[0.552, 0.008, 12, 72]} />
          <meshStandardMaterial color="#e8dcc0" roughness={0.6} />
        </mesh>
      </group>
    </Float>
  )
}

function Stumps({ position = [0, 0, -1.6] as [number, number, number] }) {
  const stumpXs = [-0.22, 0, 0.22]
  return (
    <group position={position}>
      {stumpXs.map((x) => (
        <mesh key={x} position={[x, 0.55, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.035, 1.1, 16]} />
          <meshStandardMaterial color="#e8c468" roughness={0.5} />
        </mesh>
      ))}
      {/* bails */}
      {[-0.11, 0.11].map((x) => (
        <mesh key={x} position={[x, 1.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, 0.18, 12]} />
          <meshStandardMaterial color="#f5dfa0" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function Bat({ position = [1.4, 0.62, -1.2] as [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.4, -0.28]}>
      {/* blade */}
      <mesh castShadow>
        <boxGeometry args={[0.34, 1.1, 0.09]} />
        <meshStandardMaterial color="#d9b382" roughness={0.55} />
      </mesh>
      {/* handle */}
      <mesh position={[0, 0.78, 0]}>
        <cylinderGeometry args={[0.045, 0.05, 0.5, 12]} />
        <meshStandardMaterial color="#7a4a21" roughness={0.7} />
      </mesh>
    </group>
  )
}

function Floodlight({
  position,
  target = [0, 0.8, 0] as [number, number, number],
}: {
  position: [number, number, number]
  target?: [number, number, number]
}) {
  const light = useRef<THREE.SpotLight>(null)
  const targetRef = useRef<THREE.Object3D>(null)
  return (
    <group position={position}>
      {/* pole */}
      <mesh position={[0, -2.2, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 4.4, 10]} />
        <meshStandardMaterial color="#3a4763" roughness={0.6} metalness={0.5} />
      </mesh>
      {/* head */}
      <mesh>
        <boxGeometry args={[0.7, 0.28, 0.22]} />
        <meshStandardMaterial
          color="#ffe9b0"
          emissive="#ffcf5e"
          emissiveIntensity={2.2}
        />
      </mesh>
      <spotLight
        ref={light}
        position={[0, 0, 0]}
        angle={0.5}
        penumbra={0.6}
        intensity={140}
        color="#ffd98a"
        castShadow
        target={targetRef.current ?? undefined}
      />
      <object3D ref={targetRef} position={target} />
      {/* visible beam cone */}
      <mesh position={[0, -2.1, 0]}>
        <coneGeometry args={[1.7, 4.2, 24, 1, true]} />
        <meshBasicMaterial
          color="#ffcf5e"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  )
}

function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[14, 64]} />
        <meshStandardMaterial color="#0d2b1a" roughness={0.9} />
      </mesh>
      {/* pitch strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, -0.5]} receiveShadow>
        <planeGeometry args={[1.6, 6]} />
        <meshStandardMaterial color="#8a7a52" roughness={0.95} />
      </mesh>
      {/* boundary rope */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[9.6, 9.75, 72]} />
        <meshBasicMaterial color="#f5dfa0" transparent opacity={0.5} />
      </mesh>
      <ContactShadows position={[0, 0.02, 0]} opacity={0.55} scale={12} blur={2.2} />
    </>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#060a16']} />
      <fog attach="fog" args={['#060a16', 9, 20]} />
      <ambientLight intensity={0.25} />
      <Stars radius={40} depth={20} count={2200} factor={3} saturation={0} fade speed={0.6} />
      <Ground />
      <CricketBall />
      <Stumps />
      <Bat />
      <Floodlight position={[-3.4, 4.6, -2.6]} />
      <Floodlight position={[3.4, 4.6, -2.6]} />
      <OrbitControls
        autoRotate
        autoRotateSpeed={0.55}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  )
}

/* ── Hero section with HTML overlay ────────────────────────── */

export default function Hero3D() {
  return (
    <section className="relative h-[92vh] min-h-[620px] w-full overflow-hidden">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 2.4, 8.5], fov: 46 }}
        className="absolute inset-0"
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* gradient overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background" />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary backdrop-blur-sm">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary" />
          100% Vegetarian · Vegan options
        </div>

        <h1 className="font-display mt-6 text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">
          <span className="block text-foreground">CHILL AT</span>
          <span className="text-glow block text-primary">BOUNDARY</span>
        </h1>

        <p className="mt-5 max-w-xl text-sm text-muted-foreground sm:text-base">
          Indian-fusion street food served under the floodlights. Openers to Tail
          Enders — build your innings, compare combos, then pick up at{' '}
          <span className="font-semibold text-foreground">326 Rio Park Dr</span>.
        </p>

        <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="font-semibold">
            <a href="#menu">
              <UtensilsCrossed className="mr-2 h-4 w-4" /> Browse the Menu
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
            <a href="#planner">
              <ClipboardList className="mr-2 h-4 w-4" /> Plan your Order
            </a>
          </Button>
        </div>

        <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <a href={TRUCK.mapsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-primary">
            <MapPin className="h-3.5 w-3.5 text-primary" /> {TRUCK.address}
          </a>
          <a href={TRUCK.phoneHref} className="flex items-center gap-1.5 hover:text-primary">
            <Phone className="h-3.5 w-3.5 text-primary" /> {TRUCK.phone}
          </a>
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        Drag to orbit · Scroll for menu
      </div>
    </section>
  )
}
