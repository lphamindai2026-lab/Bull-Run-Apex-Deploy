'use client';

import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, MeshDistortMaterial, Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';

/* ── Procedural 3D Bull built entirely from Three.js geometry ── */
function BullMesh({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const groupRef  = useRef<THREE.Group>(null!);
  const bodyRef   = useRef<THREE.Mesh>(null!);
  const headRef   = useRef<THREE.Group>(null!);
  const horn1Ref  = useRef<THREE.Mesh>(null!);
  const horn2Ref  = useRef<THREE.Mesh>(null!);
  const dustRef   = useRef<THREE.Points>(null!);

  // Premium gold metallic material
  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FFD700'),
    metalness: 0.95,
    roughness: 0.08,
    envMapIntensity: 2.0,
    emissive: new THREE.Color('#FF8C00'),
    emissiveIntensity: 0.12,
  }), []);

  const darkGoldMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#CC8800'),
    metalness: 0.9,
    roughness: 0.15,
    emissive: new THREE.Color('#552200'),
    emissiveIntensity: 0.08,
  }), []);

  const hornGlowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#00F0FF'),
    metalness: 0.3,
    roughness: 0.1,
    emissive: new THREE.Color('#00F0FF'),
    emissiveIntensity: 1.2,
    transparent: true,
    opacity: 0.9,
  }), []);

  const eyeMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color('#FF3B5C'),
    emissive: new THREE.Color('#FF0000'),
    emissiveIntensity: 2.0,
  }), []);

  // Dust particles
  const dustParticles = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = 120;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*3;
      pos[i*3+1] = Math.random()*1.5 - 1.5;
      pos[i*3+2] = (Math.random()-0.5)*2 - 1;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (!groupRef.current) return;

    // Mouse tracking - head rotation
    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, mouseX * 0.5, 0.06);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -mouseY * 0.2, 0.06);
    }

    // Breathing animation
    if (bodyRef.current) {
      bodyRef.current.scale.y = 1 + Math.sin(t * 1.2) * 0.018;
      bodyRef.current.scale.x = 1 + Math.sin(t * 1.2) * 0.01;
    }

    // Group subtle sway
    groupRef.current.rotation.y = Math.sin(t * 0.4) * 0.06;
    groupRef.current.position.y = Math.sin(t * 0.9) * 0.08;

    // Horn glow pulse
    if (horn1Ref.current && horn2Ref.current) {
      const glowIntensity = Math.sin(t * 2.5) * 0.8 + 1.4;
      (horn1Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glowIntensity;
      (horn2Ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity = glowIntensity;
    }

    // Dust drift
    if (dustRef.current) {
      const pos = dustRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        pos.setY(i, pos.getY(i) + 0.003);
        pos.setX(i, pos.getX(i) - 0.005);
        if (pos.getY(i) > 0.5) { pos.setY(i, -1.5); pos.setX(i, (Math.random()-0.5)*3); }
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>

      {/* ── BODY ── */}
      <mesh ref={bodyRef} position={[0, 0.3, 0]} material={goldMat} castShadow>
        <sphereGeometry args={[0.85, 32, 24]} />
      </mesh>
      {/* Body elongation */}
      <mesh position={[0, 0.25, 0.2]} material={goldMat} castShadow>
        <cylinderGeometry args={[0.72, 0.65, 1.1, 24]} />
      </mesh>

      {/* ── CHEST / FRONT ── */}
      <mesh position={[0, 0.0, 0.75]} material={goldMat} castShadow>
        <sphereGeometry args={[0.68, 28, 20]} />
      </mesh>

      {/* ── MUSCULAR SHOULDERS ── */}
      <mesh position={[0.72, 0.55, 0.3]} rotation={[0,0,-0.4]} material={goldMat} castShadow>
        <sphereGeometry args={[0.42, 24, 18]} />
      </mesh>
      <mesh position={[-0.72, 0.55, 0.3]} rotation={[0,0,0.4]} material={goldMat} castShadow>
        <sphereGeometry args={[0.42, 24, 18]} />
      </mesh>

      {/* ── HUMP ── */}
      <mesh position={[0, 0.95, -0.1]} material={goldMat} castShadow>
        <sphereGeometry args={[0.38, 20, 16]} />
      </mesh>

      {/* ── NECK ── */}
      <mesh position={[0, 0.72, 0.65]} rotation={[0.5, 0, 0]} material={goldMat} castShadow>
        <cylinderGeometry args={[0.32, 0.44, 0.7, 20]} />
      </mesh>

      {/* ── HEAD ── */}
      <group ref={headRef} position={[0, 0.75, 1.25]}>
        {/* Main head */}
        <mesh position={[0, 0, 0]} material={goldMat} castShadow>
          <sphereGeometry args={[0.44, 28, 20]} />
        </mesh>
        {/* Snout */}
        <mesh position={[0, -0.1, 0.32]} material={darkGoldMat} castShadow>
          <sphereGeometry args={[0.26, 20, 16]} />
        </mesh>
        {/* Nose ring */}
        <mesh position={[0, -0.16, 0.52]} rotation={[Math.PI/2, 0, 0]} material={hornGlowMat}>
          <torusGeometry args={[0.09, 0.02, 10, 20]} />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.22, 0.1, 0.28]} material={eyeMat}>
          <sphereGeometry args={[0.06, 12, 12]} />
        </mesh>
        <mesh position={[-0.22, 0.1, 0.28]} material={eyeMat}>
          <sphereGeometry args={[0.06, 12, 12]} />
        </mesh>

        {/* ── HORNS with cyan glow ── */}
        <mesh ref={horn1Ref} position={[0.28, 0.38, 0.12]} rotation={[-0.3, 0.3, 0.5]} material={hornGlowMat} castShadow>
          <coneGeometry args={[0.07, 0.55, 12]} />
        </mesh>
        <mesh ref={horn2Ref} position={[-0.28, 0.38, 0.12]} rotation={[-0.3, -0.3, -0.5]} material={hornGlowMat} castShadow>
          <coneGeometry args={[0.07, 0.55, 12]} />
        </mesh>

        {/* ── EARS ── */}
        <mesh position={[0.4, 0.28, -0.05]} rotation={[0.2, 0.3, 0.8]} material={darkGoldMat}>
          <sphereGeometry args={[0.12, 12, 10]} />
        </mesh>
        <mesh position={[-0.4, 0.28, -0.05]} rotation={[0.2, -0.3, -0.8]} material={darkGoldMat}>
          <sphereGeometry args={[0.12, 12, 10]} />
        </mesh>
      </group>

      {/* ── FRONT LEGS ── */}
      <mesh position={[0.38, -0.52, 0.55]} rotation={[0.15, 0, 0]} material={goldMat} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.85, 14]} />
      </mesh>
      <mesh position={[-0.38, -0.52, 0.55]} rotation={[0.15, 0, 0]} material={goldMat} castShadow>
        <cylinderGeometry args={[0.16, 0.12, 0.85, 14]} />
      </mesh>
      {/* Front hooves */}
      <mesh position={[0.38, -0.98, 0.65]} material={darkGoldMat}>
        <sphereGeometry args={[0.13, 14, 10]} />
      </mesh>
      <mesh position={[-0.38, -0.98, 0.65]} material={darkGoldMat}>
        <sphereGeometry args={[0.13, 14, 10]} />
      </mesh>

      {/* ── REAR LEGS ── */}
      <mesh position={[0.42, -0.5, -0.5]} rotation={[-0.1, 0, 0]} material={goldMat} castShadow>
        <cylinderGeometry args={[0.17, 0.13, 0.9, 14]} />
      </mesh>
      <mesh position={[-0.42, -0.5, -0.5]} rotation={[-0.1, 0, 0]} material={goldMat} castShadow>
        <cylinderGeometry args={[0.17, 0.13, 0.9, 14]} />
      </mesh>

      {/* ── TAIL ── */}
      <mesh position={[0, 0.25, -0.95]} rotation={[-0.6, 0, 0]} material={darkGoldMat}>
        <cylinderGeometry args={[0.04, 0.08, 0.5, 8]} />
      </mesh>

      {/* ── DUST PARTICLES ── */}
      <points ref={dustRef} geometry={dustParticles} position={[0, -0.5, -0.5]}>
        <pointsMaterial
          color="#FFD700"
          size={0.035}
          transparent opacity={0.5}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

    </group>
  );
}

/* ── Orbit rings ── */
function OrbitRing({ radius, color, speed, tilt }: any) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = s.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.008, 8, 80]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

/* ── Gold coin ── */
function GoldCoin({ position, speed }: { position: [number,number,number]; speed: number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.04 * speed;
    ref.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * speed + position[0]) * 0.3;
  });
  return (
    <mesh ref={ref} position={position} castShadow>
      <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
      <meshStandardMaterial color="#FFD700" metalness={0.95} roughness={0.05}
        emissive="#FF8800" emissiveIntensity={0.2} />
    </mesh>
  );
}

/* ── Floating data chip ── */
function DataChip({ position, color }: { position: [number,number,number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.02;
    ref.current.position.y = position[1] + Math.sin(s.clock.elapsedTime * 0.8 + position[0]) * 0.15;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.28, 0.18, 0.04]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.1}
        emissive={color} emissiveIntensity={0.4} transparent opacity={0.85} />
    </mesh>
  );
}

/* ── Scene wrapper ── */
function Scene({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#1a1a2e" />
      <directionalLight position={[5, 8, 5]} intensity={2.5} color="#FFE066" castShadow />
      <pointLight position={[-3, 3, 3]} intensity={3} color="#00F0FF" distance={8} />
      <pointLight position={[3, -1, 4]} intensity={2} color="#FFD700" distance={6} />
      <pointLight position={[0, 5, -2]} intensity={1.5} color="#9D4EDD" distance={7} />
      <spotLight position={[0, 8, 2]} angle={0.4} intensity={4} color="#FFE066" penumbra={0.5} castShadow />

      {/* Bull */}
      <Float speed={0.6} rotationIntensity={0.08} floatIntensity={0.3}>
        <BullMesh mouseX={mouseX} mouseY={mouseY} />
      </Float>

      {/* Orbit rings */}
      <OrbitRing radius={2.2} color="#FFD700" speed={0.3} tilt={Math.PI/4} />
      <OrbitRing radius={2.8} color="#00F0FF" speed={-0.2} tilt={-Math.PI/6} />
      <OrbitRing radius={3.4} color="#9D4EDD" speed={0.15} tilt={Math.PI/3} />

      {/* Gold coins */}
      <GoldCoin position={[2.2, 0.5, -0.5]} speed={1.1} />
      <GoldCoin position={[-2.0, 0.2, -0.8]} speed={0.9} />
      <GoldCoin position={[1.6, -0.4, 1.0]} speed={1.3} />

      {/* Data chips */}
      <DataChip position={[2.8, 1.2, 0.3]} color="#00F0FF" />
      <DataChip position={[-2.5, 0.8, 0.5]} color="#9D4EDD" />
      <DataChip position={[1.8, -0.8, -1.2]} color="#FFD700" />
      <DataChip position={[-1.6, 1.8, -0.6]} color="#22FF88" />

      {/* Gold sparkles */}
      <Sparkles count={120} scale={6} size={1.2} speed={0.4} color="#FFD700" opacity={0.6} />
      <Sparkles count={60} scale={4} size={0.8} speed={0.3} color="#00F0FF" opacity={0.4} />

      {/* Ground glow disc */}
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[2.5, 64]} />
        <meshBasicMaterial color="#FFD700" transparent opacity={0.04} />
      </mesh>
    </>
  );
}

/* ── Main export ── */
export default function BullScene() {
  const [mouse, setMouse] = React.useState({ x: 0, y: 0 });

  return (
    <div
      className="w-full h-full"
      onMouseMove={e => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setMouse({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top)  / rect.height - 0.5) * -2,
        });
      }}
    >
      <Canvas
        camera={{ position: [0, 0.8, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.4 }}
        shadows
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene mouseX={mouse.x} mouseY={mouse.y} />
        </Suspense>
      </Canvas>
    </div>
  );
}
