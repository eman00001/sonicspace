import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
// Use a permissive props shape to avoid relying on r3f internal typings
type MeshProps = Record<string, any>;

type Vec3 = [number, number, number];

interface Props extends MeshProps {
  position?: Vec3;
  rotation?: Vec3;
  coverColor?: string;
  recordColor?: string;
  coverSize?: [number, number, number];
  recordRadius?: number;
  recordThickness?: number;
}

export const RecordCover: React.FC<Props> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  coverColor = '#111',
  coverSize = [1.4, 1.4, 0.05],
  ...props
}) => {
  const geom = useMemo(() => new THREE.BoxGeometry(coverSize[0], coverSize[1], coverSize[2]), [coverSize]);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: coverColor, metalness: 0.1, roughness: 0.6 }), [coverColor]);

  useEffect(() => {
    return () => {
      geom.dispose();
      // @ts-ignore
      mat.dispose && mat.dispose();
    };
  }, [geom, mat]);

  return (
    <mesh geometry={geom} material={mat} position={position} rotation={rotation} {...props} />
  );
};

export const Record: React.FC<Props> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  recordColor = '#000',
  recordRadius = 0.5,
  recordThickness = 0.02,
  ...props
}) => {
  const geom = useMemo(() => new THREE.CylinderGeometry(recordRadius, recordRadius, recordThickness, 64), [recordRadius, recordThickness]);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: recordColor, metalness: 0.6, roughness: 0.25 }), [recordColor]);

  useEffect(() => {
    return () => {
      geom.dispose();
      // @ts-ignore
      mat.dispose && mat.dispose();
    };
  }, [geom, mat]);

  return (
    <mesh geometry={geom} material={mat} position={position} rotation={[Math.PI / 2, 0, 0]} {...props}>
      {/* small center label */}
      <mesh position={[0, 0, recordThickness / 2 + 0.001]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.002, 32]} />
        <meshStandardMaterial color={'#e5e5e5'} metalness={0.1} roughness={0.9} />
      </mesh>
    </mesh>
  );
};

export default Record;
