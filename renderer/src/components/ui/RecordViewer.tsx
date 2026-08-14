import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface RecordInfo {
  title?: string;
  artist?: string;
  texture?: string | null;
}

interface Props {
  record?: RecordInfo;
  onClose?: () => void;
  onInteractionStart?: () => void;
  onInteractionEnd?: (wasDrag: boolean) => void;
}

export default function RecordViewer({ record, onClose, onInteractionStart, onInteractionEnd }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const texture = record?.texture ?? null;

  return (
    <div className="record-viewer" role="dialog" aria-modal="true" ref={containerRef}>
      <button className="rv-close" onClick={onClose} aria-label="close">✕</button>

      <div className="record-viewer-content">
        <div className="record-visual">
          <Canvas camera={{ position: [-1, 0, 3], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} />
            <ViewerScene texture={texture} onInteractionStart={onInteractionStart} onInteractionEnd={onInteractionEnd} />
          </Canvas>
        </div>

        <div className="record-info-panel">
          <div className="record-meta">
            <span className="record-kicker">Now playing</span>
            <h2>{record?.title ?? 'Untitled Record'}</h2>
            <p>{record?.artist ?? 'Unknown Artist'}</p>
          </div>

          <div className="record-slider-container">
            <input type="range" min={0} max={100} defaultValue={35} aria-label="Adjust view" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewerScene({ texture, onInteractionStart, onInteractionEnd }: { texture?: string | null; onInteractionStart?: () => void; onInteractionEnd?: (wasDrag: boolean) => void }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const discRef = useRef<THREE.Mesh | null>(null);
  const tex = texture ? useLoader(THREE.TextureLoader, texture) : null;

  // rotation state (current, target, velocity)
  const current = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const start = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  const maxAngle = { x: Math.PI / 6, y: Math.PI / 6 };
  const sensitivity = 220; // px for tanh curve

  useFrame((_, dt) => {
    // spring simulation
    const k = 60; // stiffness
    const d = 12; // damping
    // integrate velocities
    vel.current.x += (target.current.x - current.current.x) * k * dt;
    vel.current.y += (target.current.y - current.current.y) * k * dt;
    // damping
    vel.current.x *= Math.exp(-d * dt);
    vel.current.y *= Math.exp(-d * dt);
    current.current.x += vel.current.x * dt;
    current.current.y += vel.current.y * dt;

    if (groupRef.current) {
      groupRef.current.rotation.x = current.current.x;
      groupRef.current.rotation.y = current.current.y;
    }
  });

  useEffect(() => {
    function onPointerMove(ev: PointerEvent) {
      if (!dragging.current) return;
      const dx = ev.clientX - start.current.x;
      const dy = ev.clientY - start.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 6) hasMovedRef.current = true;
      // use tanh curve for diminishing returns
      const ty = maxAngle.y * Math.tanh(dx / sensitivity);
      const tx = maxAngle.x * Math.tanh(dy / sensitivity);
      target.current.x = tx;
      target.current.y = ty;
    }
    function onPointerUp() {
      const wasDrag = hasMovedRef.current;
      dragging.current = false;
      // spring back
      target.current.x = 0;
      target.current.y = 0;
      try { onInteractionEnd && onInteractionEnd(wasDrag); } catch (e) {}
      // do NOT remove listeners here; keep them for future interactions
      hasMovedRef.current = false;
    }
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  function onPointerDownOnObject(e: any) {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    dragging.current = true;
    start.current.x = e.clientX;
    start.current.y = e.clientY;
    // reset velocities so spring follows pointer cleanly
    vel.current.x = 0;
    vel.current.y = 0;
    hasMovedRef.current = false;
    try { onInteractionStart && onInteractionStart(); } catch (e) {}
  }

  const discOffset = 0.1; // how much disc pops out

  // local sizes (bigger)
  const bigSquare = 2.2;
  const discRadius = 1.0;
  const spinSpeed = 2.0; // radians per second
  const emergence = useRef({ t: 0 });

  useFrame((_, dt) => {
    // animate emergence on load (t from 0->1)
    emergence.current.t = THREE.MathUtils.clamp(emergence.current.t + dt * 1.7, 0, 1);
    // lerp disc position and spin
    if (discRef.current) {
      const startX = bigSquare / 2 - 0.6; // hidden start
      const targetX = bigSquare / 2 + discOffset;
      const x = THREE.MathUtils.lerp(startX, targetX, emergence.current.t);
      discRef.current.position.x = x;
      discRef.current.rotation.z += spinSpeed * dt;
    }

    // keep group rotation handled by spring (done above)
  });

  return (
    <group ref={groupRef}>
      {/* big square */}
      <mesh ref={meshRef} position={[0, 0, 0]} rotation={[0, 0, 0]} onPointerDown={onPointerDownOnObject}>
        <boxGeometry args={[bigSquare, bigSquare, 0.12]} />
        {tex ? (
          <meshStandardMaterial map={tex} metalness={0.2} roughness={0.6} />
        ) : (
          <meshStandardMaterial color={'#222'} metalness={0.2} roughness={0.6} />
        )}
      </mesh>

      {/* spinning disc that emerges */}
      <group position={[0, 0, 0]}>
        <mesh ref={discRef} position={[bigSquare / 2 - 0.6, 0, 0.02]} rotation={[0, 0, 0]} onPointerDown={onPointerDownOnObject}>
          
            <ringGeometry args={[0.4, discRadius, 64]} />
            <meshStandardMaterial color={'#000'} metalness={0.1} roughness={0.5} />

            <mesh>
                <ringGeometry args={[0.1, 0.4, 64]} />
                {tex ? (
                    <meshStandardMaterial map={tex} metalness={0.1} roughness={0.5} />
                ) : (
                    <meshStandardMaterial color={'#000'} metalness={0.1} roughness={0.5} />
                )}
            </mesh>
        </mesh>
      </group>
    </group>
  );
}
