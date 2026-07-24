'use client';

import React, { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Sparkles, Trail, MeshDistortMaterial, Billboard } from '@react-three/drei';
import * as THREE from 'three';

/* ════ MATERIALS ════ */
function useMaterials() {
  return useMemo(() => ({
    gold: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FFD700'),
      metalness: 0.98,
      roughness: 0.05,
      reflectivity: 1.0,
      envMapIntensity: 3.0,
      emissive: new THREE.Color('#FF6600'),
      emissiveIntensity: 0.08,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      sheen: 0.5,
      sheenColor: new THREE.Color('#FFE066'),
    }),
    goldDark: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#B8860B'),
      metalness: 0.95,
      roughness: 0.12,
      emissive: new THREE.Color('#4A2800'),
      emissiveIntensity: 0.06,
      clearcoat: 0.4,
    }),
    horn: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#00D4EE'),
      metalness: 0.2,
      roughness: 0.05,
      emissive: new THREE.Color('#00F0FF'),
      emissiveIntensity: 2.5,
      transparent: true,
      opacity: 0.92,
      transmission: 0.1,
    }),
    eye: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#FF0000'),
      emissive: new THREE.Color('#FF0000'),
      emissiveIntensity: 3.0,
      metalness: 0.0,
      roughness: 0.0,
      clearcoat: 1.0,
    }),
    eyeGlow: new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FF3B5C'),
      transparent: true,
      opacity: 0.4,
    }),
    nose: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#CC7700'),
      metalness: 0.8,
      roughness: 0.3,
    }),
    noseRing: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#00F0FF'),
      metalness: 0.3,
      roughness: 0.05,
      emissive: new THREE.Color('#00F0FF'),
      emissiveIntensity: 1.8,
    }),
    hoof: new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#1A1A1A'),
      metalness: 0.7,
      roughness: 0.2,
      emissive: new THREE.Color('#FFD700'),
      emissiveIntensity: 0.3,
    }),
    ground: new THREE.MeshBasicMaterial({
      color: new THREE.Color('#FFD700'),
      transparent: true,
      opacity: 0.03,
    }),
  }), []);
}

/* ════ PARTICLE DUST ════ */
function DustParticles() {
  const ref = useRef<THREE.Points>(null!);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const n = 200;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i*3]   = (Math.random()-0.5) * 5;
      pos[i*3+1] = Math.random() * 2 - 2;
      pos[i*3+2] = (Math.random()-0.5) * 4 - 1;
      const isGold = Math.random() > 0.4;
      col[i*3]   = isGold ? 1.0 : 0.0;
      col[i*3+1] = isGold ? 0.85 : 0.94;
      col[i*3+2] = isGold ? 0.0 : 1.0;
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, []);

  useFrame((s) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      pos.setX(i, pos.getX(i) - 0.008);
      pos.setY(i, pos.getY(i) + 0.004 * Math.sin(s.clock.elapsedTime + i));
      if (pos.getX(i) < -3) { pos.setX(i, 2.5); pos.setY(i, -2 + Math.random()); }
    }
    pos.needsUpdate = true;
    ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.1) * 0.05;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.04} vertexColors transparent opacity={0.6}
        sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false}
      />
    </points>
  );
}

/* ════ ENERGY RINGS ════ */
function EnergyRing({ r, color, speed, tilt, offset=0 }: any) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.z = s.clock.elapsedTime * speed + offset;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[r, 0.006, 8, 120]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/* ════ FLOATING COIN ════ */
function Coin({ pos, delay=0 }: { pos:[number,number,number]; delay?:number }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.05;
    ref.current.position.y = pos[1] + Math.sin(s.clock.elapsedTime * 1.2 + delay) * 0.25;
  });
  return (
    <mesh ref={ref} position={pos} castShadow>
      <cylinderGeometry args={[0.14, 0.14, 0.035, 32]} />
      <meshPhysicalMaterial
        color="#FFD700" metalness={0.98} roughness={0.04}
        emissive="#FF8800" emissiveIntensity={0.15} clearcoat={1}
      />
    </mesh>
  );
}

/* ════ DATA HOLOGRAM ════ */
function DataHolo({ pos, color, label }: { pos:[number,number,number]; color:string; label:string }) {
  const ref = useRef<THREE.Group>(null!);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.015;
    ref.current.position.y = pos[1] + Math.sin(s.clock.elapsedTime + pos[0]) * 0.12;
  });
  return (
    <group ref={ref} position={pos}>
      <mesh>
        <boxGeometry args={[0.22, 0.12, 0.03]} />
        <meshPhysicalMaterial
          color={color} metalness={0.6} roughness={0.1}
          emissive={color} emissiveIntensity={0.6}
          transparent opacity={0.75} transmission={0.1}
        />
      </mesh>
      {/* corner accents */}
      {[[-0.09,0.04,0],[0.09,0.04,0],[-0.09,-0.04,0],[0.09,-0.04,0]].map((p,i)=>(
        <mesh key={i} position={p as [number,number,number]}>
          <boxGeometry args={[0.015,0.015,0.04]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

/* ════ MAIN BULL ════ */
function Bull({ mx, my }: { mx:number; my:number }) {
  const m = useMaterials();
  const root = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Mesh>(null!);
  const head = useRef<THREE.Group>(null!);
  const h1   = useRef<THREE.Mesh>(null!);
  const h2   = useRef<THREE.Mesh>(null!);
  const fl   = useRef<THREE.Group>(null!); // front left
  const fr   = useRef<THREE.Group>(null!); // front right
  const rl   = useRef<THREE.Group>(null!); // rear left
  const rr   = useRef<THREE.Group>(null!); // rear right
  const tail = useRef<THREE.Group>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (!root.current) return;

    // Whole body subtle sway
    root.current.rotation.y = Math.sin(t * 0.35) * 0.06;
    root.current.position.y = Math.sin(t * 0.9) * 0.06;

    // Head follows mouse with inertia
    if (head.current) {
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, mx * 0.6, 0.07);
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -my * 0.25, 0.07);
    }

    // Breathing — chest expands
    if (body.current) {
      const breath = 1 + Math.sin(t * 1.3) * 0.022;
      body.current.scale.set(breath, 1 + Math.sin(t * 1.3) * 0.015, breath);
    }

    // Horn glow pulse
    if (h1.current && h2.current) {
      const g = Math.sin(t * 3) * 1.0 + 2.0;
      (h1.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = g;
      (h2.current.material as THREE.MeshPhysicalMaterial).emissiveIntensity = g;
    }

    // Leg walk cycle
    const stride = Math.sin(t * 2.5) * 0.15;
    if (fl.current) fl.current.rotation.x  =  stride;
    if (fr.current) fr.current.rotation.x  = -stride;
    if (rl.current) rl.current.rotation.x  = -stride;
    if (rr.current) rr.current.rotation.x  =  stride;

    // Tail wag
    if (tail.current) {
      tail.current.rotation.x = Math.sin(t * 2.2) * 0.3;
      tail.current.rotation.z = Math.sin(t * 1.8) * 0.15;
    }
  });

  const S = (geo: React.ReactElement, mat: THREE.Material, ref?: React.Ref<THREE.Mesh>) =>
    ref ? <mesh ref={ref as React.Ref<THREE.Mesh>} castShadow>{geo}<primitive object={mat} attach="material" /></mesh>
        : <mesh castShadow>{geo}<primitive object={mat} attach="material" /></mesh>;

  return (
    <group ref={root} position={[0, -0.7, 0]}>

      {/* ── BODY ── */}
      <mesh ref={body} position={[0, 0.45, 0]} castShadow>
        <sphereGeometry args={[0.88, 40, 32]} />
        <primitive object={m.gold} attach="material" />
      </mesh>
      {/* Belly elongation */}
      <mesh position={[0, 0.32, 0.12]} castShadow>
        <cylinderGeometry args={[0.75, 0.68, 1.15, 32]} />
        <primitive object={m.gold} attach="material" />
      </mesh>

      {/* ── CHEST ── */}
      <mesh position={[0, 0.08, 0.82]} castShadow>
        <sphereGeometry args={[0.65, 32, 24]} />
        <primitive object={m.gold} attach="material" />
      </mesh>

      {/* ── HUMP ── */}
      <mesh position={[0, 1.06, -0.08]} castShadow>
        <sphereGeometry args={[0.36, 24, 18]} />
        <primitive object={m.gold} attach="material" />
      </mesh>

      {/* ── MUSCULAR SHOULDERS ── */}
      {[0.78, -0.78].map((x, i) => (
        <mesh key={i} position={[x, 0.62, 0.35]} castShadow>
          <sphereGeometry args={[0.42, 24, 18]} />
          <primitive object={m.gold} attach="material" />
        </mesh>
      ))}

      {/* ── NECK ── */}
      <mesh position={[0, 0.84, 0.76]} rotation={[0.55, 0, 0]} castShadow>
        <cylinderGeometry args={[0.33, 0.46, 0.72, 24]} />
        <primitive object={m.gold} attach="material" />
      </mesh>

      {/* ── HEAD ── */}
      <group ref={head} position={[0, 0.88, 1.38]}>
        {/* Skull */}
        <mesh castShadow>
          <sphereGeometry args={[0.46, 36, 28]} />
          <primitive object={m.gold} attach="material" />
        </mesh>
        {/* Forehead ridge */}
        <mesh position={[0, 0.22, 0.18]} castShadow>
          <sphereGeometry args={[0.26, 20, 16]} />
          <primitive object={m.gold} attach="material" />
        </mesh>
        {/* Snout */}
        <mesh position={[0, -0.1, 0.36]} castShadow>
          <sphereGeometry args={[0.27, 24, 18]} />
          <primitive object={m.nose} attach="material" />
        </mesh>
        {/* Chin */}
        <mesh position={[0, -0.22, 0.28]} castShadow>
          <sphereGeometry args={[0.18, 18, 14]} />
          <primitive object={m.nose} attach="material" />
        </mesh>
        {/* Nose ring */}
        <mesh position={[0, -0.18, 0.56]} rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[0.1, 0.022, 12, 28]} />
          <primitive object={m.noseRing} attach="material" />
        </mesh>

        {/* Eyes */}
        {[0.24, -0.24].map((x, i) => (
          <group key={i} position={[x, 0.1, 0.32]}>
            {/* Eye glow halo */}
            <mesh>
              <sphereGeometry args={[0.09, 12, 12]} />
              <primitive object={m.eyeGlow} attach="material" />
            </mesh>
            {/* Iris */}
            <mesh>
              <sphereGeometry args={[0.065, 12, 12]} />
              <primitive object={m.eye} attach="material" />
            </mesh>
            {/* Pupil */}
            <mesh position={[0, 0, 0.058]}>
              <sphereGeometry args={[0.025, 10, 10]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
          </group>
        ))}

        {/* ── HORNS ── */}
        {[
          [0.3, 0.42, 0.08,  0.3,  0.35, 0.55],
          [-0.3, 0.42, 0.08, 0.3, -0.35, 0.55],
        ].map(([hx, hy, hz, rx, rz, rr], i) => {
          const ref = i === 0 ? h1 : h2;
          return (
            <group key={i}>
              {/* Horn base */}
              <mesh position={[hx, hy, hz] as [number,number,number]}
                    rotation={[-rx, 0, rz as number]} ref={ref} castShadow>
                <coneGeometry args={[0.075, 0.62, 16]} />
                <primitive object={m.horn} attach="material" />
              </mesh>
              {/* Horn tip glow sphere */}
              <mesh position={[
                hx + (i===0?0.22:-0.22),
                hy + 0.48,
                hz + 0.08
              ]}>
                <sphereGeometry args={[0.04, 12, 12]} />
                <meshBasicMaterial color="#00F0FF" transparent opacity={0.8}
                  blending={THREE.AdditiveBlending} />
              </mesh>
            </group>
          );
        })}

        {/* Ears */}
        {[0.44, -0.44].map((x, i) => (
          <mesh key={i} position={[x, 0.3, -0.02]}
                rotation={[0.2, i===0?0.4:-0.4, i===0?0.7:-0.7]} castShadow>
            <sphereGeometry args={[0.13, 14, 12]} />
            <primitive object={m.goldDark} attach="material" />
          </mesh>
        ))}
      </group>

      {/* ── FRONT LEGS ── */}
      {[0.42, -0.42].map((x, i) => {
        const ref = i === 0 ? fl : fr;
        return (
          <group key={i} ref={ref} position={[x, 0, 0.65]}>
            <mesh position={[0, -0.42, 0]} rotation={[0.1, 0, 0]} castShadow>
              <cylinderGeometry args={[0.16, 0.13, 0.88, 18]} />
              <primitive object={m.gold} attach="material" />
            </mesh>
            {/* Knee knob */}
            <mesh position={[0, -0.72, 0.04]}>
              <sphereGeometry args={[0.14, 14, 12]} />
              <primitive object={m.gold} attach="material" />
            </mesh>
            {/* Lower leg */}
            <mesh position={[0, -1.08, 0.06]} rotation={[-0.1, 0, 0]} castShadow>
              <cylinderGeometry args={[0.11, 0.09, 0.5, 16]} />
              <primitive object={m.gold} attach="material" />
            </mesh>
            {/* Hoof */}
            <mesh position={[0, -1.38, 0.06]}>
              <sphereGeometry args={[0.12, 16, 12]} />
              <primitive object={m.hoof} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* ── REAR LEGS ── */}
      {[0.44, -0.44].map((x, i) => {
        const ref = i === 0 ? rl : rr;
        return (
          <group key={i} ref={ref} position={[x, 0, -0.55]}>
            <mesh position={[0, -0.42, 0]} rotation={[-0.1, 0, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.14, 0.92, 18]} />
              <primitive object={m.gold} attach="material" />
            </mesh>
            {/* Hock */}
            <mesh position={[0, -0.78, -0.05]}>
              <sphereGeometry args={[0.15, 14, 12]} />
              <primitive object={m.gold} attach="material" />
            </mesh>
            {/* Lower leg */}
            <mesh position={[0, -1.12, 0.02]} rotation={[0.15, 0, 0]} castShadow>
              <cylinderGeometry args={[0.11, 0.09, 0.5, 16]} />
              <primitive object={m.gold} attach="material" />
            </mesh>
            {/* Hoof */}
            <mesh position={[0, -1.4, 0.04]}>
              <sphereGeometry args={[0.12, 16, 12]} />
              <primitive object={m.hoof} attach="material" />
            </mesh>
          </group>
        );
      })}

      {/* ── TAIL ── */}
      <group ref={tail} position={[0, 0.55, -1.0]}>
        <mesh rotation={[-0.7, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.08, 0.45, 10]} />
          <primitive object={m.goldDark} attach="material" />
        </mesh>
        <mesh position={[0, -0.35, -0.2]} rotation={[-1.0, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.3, 10]} />
          <primitive object={m.goldDark} attach="material" />
        </mesh>
        {/* Tail tuft */}
        <mesh position={[0, -0.6, -0.38]}>
          <sphereGeometry args={[0.09, 12, 10]} />
          <meshBasicMaterial color="#CC8800" />
        </mesh>
      </group>

      {/* ── GROUND SHADOW/GLOW ── */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.2, 64]} />
        <primitive object={m.ground} attach="material" />
      </mesh>

      {/* Dust */}
      <DustParticles />
    </group>
  );
}

/* ════ SCENE ════ */
function Scene({ mx, my }: { mx:number; my:number }) {
  return (
    <>
      {/* Environment lighting for reflections */}
      <ambientLight intensity={0.4} color="#1a1030" />
      <directionalLight position={[5, 10, 6]} intensity={3.5} color="#FFE066" castShadow
        shadow-mapSize={[2048, 2048]} />
      <pointLight position={[-4, 4, 3]} intensity={4.0} color="#00F0FF" distance={10} />
      <pointLight position={[4, 2, 4]} intensity={3.0} color="#FFD700" distance={8} />
      <pointLight position={[0, 6, -2]} intensity={2.0} color="#9D4EDD" distance={8} />
      <pointLight position={[0, -1, 3]} intensity={1.5} color="#FF6600" distance={6} />
      <spotLight position={[0, 10, 3]} angle={0.35} intensity={6} color="#FFE066"
        penumbra={0.6} castShadow />
      {/* Rim light — cyan from behind */}
      <pointLight position={[0, 3, -4]} intensity={5} color="#00F0FF" distance={10} />

      {/* Bull */}
      <Float speed={0.5} rotationIntensity={0.05} floatIntensity={0.2}>
        <Bull mx={mx} my={my} />
      </Float>

      {/* Energy rings */}
      <EnergyRing r={2.4} color="#FFD700" speed={0.25}  tilt={Math.PI/4} />
      <EnergyRing r={3.1} color="#00F0FF" speed={-0.18} tilt={-Math.PI/5} />
      <EnergyRing r={3.8} color="#9D4EDD" speed={0.12}  tilt={Math.PI/3} />
      <EnergyRing r={4.5} color="#FFD700" speed={-0.08} tilt={Math.PI/6} offset={Math.PI} />

      {/* Gold coins */}
      <Coin pos={[ 2.4,  0.6, -0.6]} delay={0.0} />
      <Coin pos={[-2.2,  0.3, -0.8]} delay={1.2} />
      <Coin pos={[ 1.8, -0.3,  1.0]} delay={2.1} />
      <Coin pos={[-1.5,  1.2, -0.3]} delay={0.7} />

      {/* Data holograms */}
      <DataHolo pos={[ 2.9, 1.3,  0.2]} color="#00F0FF" label="BUY" />
      <DataHolo pos={[-2.7, 0.9,  0.4]} color="#9D4EDD" label="SMC" />
      <DataHolo pos={[ 1.9,-0.7, -1.2]} color="#FFD700" label="OB"  />
      <DataHolo pos={[-1.6, 1.9, -0.5]} color="#22FF88" label="FVG" />

      {/* Premium sparkles — gold + cyan layers */}
      <Sparkles count={160} scale={7.5} size={1.4} speed={0.35} color="#FFD700" opacity={0.55} />
      <Sparkles count={80}  scale={5.5} size={0.9} speed={0.25} color="#00F0FF" opacity={0.35} />
      <Sparkles count={50}  scale={3.5} size={0.6} speed={0.4}  color="#9D4EDD" opacity={0.25} />
    </>
  );
}

/* ════ EXPORT ════ */
export default function BullScene() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  return (
    <div className="w-full h-full"
      onMouseMove={e => {
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        setMouse({
          x: ((e.clientX - r.left)  / r.width  - 0.5) * 2,
          y: ((e.clientY - r.top)   / r.height - 0.5) * -2,
        });
      }}>
      <Canvas
        camera={{ position: [0, 0.8, 5.2], fov: 42 }}
        gl={{
          antialias: true, alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.6,
          powerPreference: 'high-performance',
        }}
        shadows
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene mx={mouse.x} my={mouse.y} />
        </Suspense>
      </Canvas>
    </div>
  );
}
