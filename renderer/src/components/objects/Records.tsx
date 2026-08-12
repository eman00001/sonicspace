import React, { useMemo, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
// Use a permissive props shape to avoid relying on r3f internal typings
type MeshProps = Record<string, any>;

type Vec3 = [number, number, number];

interface RecordProps extends MeshProps {
  position?: Vec3;
  rotation?: Vec3;
  coverColor?: string;
  recordColor?: string;
  squareSize?: [number, number, number];
  texturePath?: string;
  recordRadius?: number;
  recordThickness?: number;
}

const yOffset = 0.15;

export const RecordSquare: React.FC<RecordProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  coverColor = '#111',
  squareSize = [1.2, 1.2, 0.05],
  texturePath = '',
  ...props
}) => {
  const coverTexture = useTexture(texturePath);
  const geom = useMemo(
    () => new THREE.BoxGeometry(squareSize[0], squareSize[1], squareSize[2]),
    [squareSize]
  );

  const meshRef = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);
  const baseY = useMemo(() => position[1], [position]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetY = hovered ? baseY + yOffset : baseY;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, Math.min(1, 6 * delta));
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geom}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      {...props}
    >
      <meshStandardMaterial map={coverTexture} />
    </mesh>
  );
};

export const RecordDisc: React.FC<RecordProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  recordColor = '#000',
  recordRadius = 0.5,
  recordThickness = 0.02,
  ...props
}) => {
  const geom = useMemo(() => new THREE.CylinderGeometry(recordRadius, recordRadius, recordThickness, 64), [recordRadius, recordThickness]);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: recordColor, metalness: 0.6, roughness: 0.25 }), [recordColor]);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);
  const baseY = useMemo(() => position[1], [position]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetY = hovered ? baseY + yOffset : baseY;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, Math.min(1, 6 * delta));
  });

  useEffect(() => {
    return () => {
      geom.dispose();
      // @ts-ignore
      mat.dispose && mat.dispose();
    };
  }, [geom, mat]);

  return (
    <mesh
      ref={meshRef}
      geometry={geom}
      material={mat}
      position={position}
      rotation={[Math.PI / 2, 0, 0]}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      {...props}
      castShadow
    >
      {/* small center label */}
      <mesh castShadow position={[0, 0, recordThickness / 2 + 0.001]} rotation={[0, 0, 0]} >
        <cylinderGeometry args={[0.08, 0.08, 0.002, 32]} />
        <meshStandardMaterial color={'#e5e5e5'} metalness={0.1} roughness={0.9} />
      </mesh>
    </mesh>
  );
};

export default RecordDisc;
