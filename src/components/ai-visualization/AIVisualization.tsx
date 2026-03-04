import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Pulse: a small sphere that travels along an edge ──────────────────────────
interface PulseData {
  start: THREE.Vector3;
  end: THREE.Vector3;
  speed: number;
  offset: number;
  color: string;
}

function DataPulse({ start, end, speed, offset, color }: PulseData) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = ((clock.getElapsedTime() * speed + offset) % 1 + 1) % 1;
    meshRef.current.position.lerpVectors(start, end, t);
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// ── Main 3-D node graph ───────────────────────────────────────────────────────
function NodeGraph() {
  const groupRef = useRef<THREE.Group>(null);

  const NODE_COUNT = 60;
  const CONNECT_DIST = 2.8;

  const { positions, connections, pulses } = useMemo(() => {
    // Build node positions
    const pos: THREE.Vector3[] = Array.from({ length: NODE_COUNT }, () =>
      new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
      ),
    );

    // Build flat Float32Array for BufferGeometry points
    const posFlat = new Float32Array(NODE_COUNT * 3);
    pos.forEach((v, i) => { posFlat[i * 3] = v.x; posFlat[i * 3 + 1] = v.y; posFlat[i * 3 + 2] = v.z; });

    // Build edges
    const edgeVerts: number[] = [];
    const pulseList: PulseData[] = [];
    const colors = ['#00E5FF', '#7C4DFF', '#00BCD4'];

    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (pos[i].distanceTo(pos[j]) < CONNECT_DIST) {
          edgeVerts.push(pos[i].x, pos[i].y, pos[i].z, pos[j].x, pos[j].y, pos[j].z);
          if (Math.random() < 0.3) {
            pulseList.push({
              start: pos[i],
              end: pos[j],
              speed: 0.3 + Math.random() * 0.4,
              offset: Math.random(),
              color: colors[Math.floor(Math.random() * colors.length)],
            });
          }
        }
      }
    }

    return {
      positions: posFlat,
      connections: new Float32Array(edgeVerts),
      pulses: pulseList.slice(0, 40), // cap to keep perf reasonable
    };
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.06;
      groupRef.current.rotation.x = clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={NODE_COUNT} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="#00E5FF" size={0.12} transparent opacity={0.9} sizeAttenuation />
      </points>

      {/* Edges */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={connections.length / 3} array={connections} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#7C4DFF" transparent opacity={0.25} />
      </lineSegments>

      {/* Animated data pulses */}
      {pulses.map((p, i) => (
        <DataPulse key={i} {...p} />
      ))}
    </group>
  );
}

// ── Floating particles background ────────────────────────────────────────────
function Particles() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 200;
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.04} transparent opacity={0.15} sizeAttenuation />
    </points>
  );
}

// ── Public section component ──────────────────────────────────────────────────
export default function AIVisualization() {
  return (
    <section id="ai-visualization" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          AI System <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00E5FF] to-[#7C4DFF]">Visualization</span>
        </h2>
        <p className="text-white/40 max-w-lg mx-auto">
        Live 3D rendering of an intelligent node network — every glowing edge carries a data pulse.
        </p>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-white/5 border border-white/10" style={{ height: 480 }}>
        <Canvas camera={{ position: [0, 0, 14], fov: 55 }}>
          <ambientLight intensity={0.2} />
          <Particles />
          <NodeGraph />
        </Canvas>
        {/* Vignette overlay */}
        <div className="pointer-events-none absolute inset-0 bg-radial-[ellipse_70%_60%_at_50%_50%] from-transparent to-[#0A0A0A]/70" />
        {/* Glow hint */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/40" />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-8 mt-8 text-sm text-white/40 font-mono">
        {[
          { color: '#00E5FF', label: 'Nodes' },
          { color: '#7C4DFF', label: 'Connections' },
          { color: '#00BCD4', label: 'Data pulses' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
