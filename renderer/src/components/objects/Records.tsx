import React, { useEffect, useRef, useState } from 'react';
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
  title?: string;
  artist?: string;
}

interface EmptyProps extends MeshProps {
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
  const geom = new THREE.BoxGeometry(squareSize[0], squareSize[1], squareSize[2]);

  const edges = new THREE.EdgesGeometry(geom);

  useEffect(() => {
    return () => {
      edges.dispose();
    };
  }, [edges]);

  const meshRef = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);
  const baseY = position[1];

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
      {hovered && (
        <lineSegments geometry={edges} raycast={() => null}>
          <lineBasicMaterial color={'#39ff14'} toneMapped={false} />
        </lineSegments>
      )}
    </mesh>
  );
};

export const EmptyDisc: React.FC<EmptyProps> = ({
  position = [0, 0, 0],
  rotation = [Math.PI/2, 0, 0],
  recordColor = '#000',
  recordRadius = 0.5,
  recordThickness = 0.02,
  ...props
}) => {
  var geom = new THREE.RingGeometry(0.05, 0.6, 64);
  const edges = new THREE.EdgesGeometry();
  return (
    <mesh
      geometry={geom}
      position={position}
      rotation={rotation}
      castShadow
    >
      <meshStandardMaterial color={'#808080'} metalness={0.1} roughness={0.9} />

      {/* small center label */}
      <mesh castShadow position={[0, 0, recordThickness / 2 + 0.001]} rotation={[0, 0, 0]} raycast={() => null}>
        <ringGeometry args={[0.25, 0.6, 32]} />
        <meshStandardMaterial color={'#000'} metalness={0.1} roughness={0.9} />
        <lineSegments geometry={edges} raycast={() => null}>
          <lineBasicMaterial color={'#39ff14'} toneMapped={false} />
        </lineSegments>
      </mesh>
      
    </mesh>
  );
}

export const EmptySquare: React.FC<EmptyProps> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  coverColor = '#111',
  squareSize = [1.2, 1.2, 0.05],
  ...props
}) => {
  const geom = new THREE.BoxGeometry(squareSize[0], squareSize[1], squareSize[2]);

  const edges = new THREE.EdgesGeometry(geom);
  return (
    <mesh
      geometry={geom}
      position={position}
      rotation={rotation}
      {...props}
    >
      <meshStandardMaterial color={'#858585'} />

        <lineSegments geometry={edges} raycast={() => null}>
          <lineBasicMaterial color={'#39ff14'} toneMapped={false} />
        </lineSegments>
    </mesh>
  );
}

export const RecordDisc: React.FC<RecordProps> = ({
  position = [0, 0, 0],
  rotation = [Math.PI/2, 0, 0],
  recordColor = '#000',
  recordRadius = 0.5,
  recordThickness = 0.02,
  texturePath = '',
  ...props
}) => {
  const coverTexture = useTexture(texturePath);
  const geom = new THREE.RingGeometry(0.05, 0.6, 64);
  const mat = new THREE.MeshStandardMaterial({ color: recordColor, metalness: 0.6, roughness: 0.25 });
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);
  const baseY = position[1];

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetY = hovered ? baseY + yOffset - 0.05 : baseY;
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, Math.min(1, 6 * delta));
  });

  useEffect(() => {
    return () => {
      geom.dispose();
      // @ts-ignore
      mat.dispose && mat.dispose();
    };
  }, [geom, mat]);

  const edges = new THREE.EdgesGeometry(geom);

  useEffect(() => {
    return () => {
      edges.dispose();
    };
  }, [edges]);

  return (
    <mesh
      ref={meshRef}
      geometry={geom}
      // material={mat}
      position={position}
      rotation={rotation}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      {...props}
      castShadow
    >
      <meshStandardMaterial map={coverTexture} metalness={0.1} roughness={0.9} />

      {/* small center label */}
      <mesh castShadow position={[0, 0, recordThickness / 2 + 0.001]} rotation={[0, 0, 0]} raycast={() => null}>
        <ringGeometry args={[0.25, 0.6, 32]} />
        <meshStandardMaterial color={'#000'} metalness={0.1} roughness={0.9} />
        {hovered && (
          <lineSegments geometry={edges} raycast={() => null}>
            <lineBasicMaterial color={'#39ff14'} toneMapped={false} />
          </lineSegments>
        )}
      </mesh>
      
    </mesh>
  );
};

export default RecordDisc;
