import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
// Use a permissive props shape to avoid relying on r3f internal typings
type MeshProps = Record<string, any>;

type Vec3 = [number, number, number];

interface RecordSquareProps extends MeshProps {
  position?: Vec3;
  rotation?: Vec3;
  coverColor?: string;
  recordColor?: string;
  squareSize?: [number, number, number];
  texturePath?: string;
  recordRadius?: number;
  recordThickness?: number;
}

export const RecordSquare: React.FC<RecordSquareProps> = ({
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

  return (
    <mesh geometry={geom} position={position} rotation={rotation} {...props}>
      <meshStandardMaterial map={coverTexture} />
    </mesh>
  );
};

interface RecordSetProps {
  count: number;
  bottom: number;
  left: number;
  back: number;
  coverPaths: string[];
  squareSize?: [number, number, number];
}

export const RecordSet: React.FC<RecordSetProps> = ({
  count,
  coverPaths,
  squareSize = [1.2, 1.2, 0.05],
  bottom,
  left,
  back,
}) => {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <RecordSquare
          key={index}
          position={[left, bottom, back + (0.1 * index)]}
          rotation={[-Math.PI / 12, 0, 0]}
          squareSize={squareSize}
          texturePath={coverPaths[index]}
        />
      ))}
    </>
  );
};

interface RecordLayerProps {
  recordColumns: RecordSetProps[];
  position?: [number, number, number];
}

export const RecordLayer: React.FC<RecordLayerProps> = ({
  recordColumns,
  position = [0, 0, 0],
}) => {
  return (
    <>
      {recordColumns.map((recordSet, index) => (
        <group
          key={index}
          position={position}
        >
          <RecordSet {...recordSet} />
        </group>
      ))}
    </>
  );
};

export const RecordDisc: React.FC<RecordSquareProps> = ({
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
    <mesh geometry={geom} material={mat} position={position} rotation={[Math.PI / 2, 0, 0]} {...props} castShadow>
      {/* small center label */}
      <mesh castShadow position={[0, 0, recordThickness / 2 + 0.001]} rotation={[0, 0, 0]} >
        <cylinderGeometry args={[0.08, 0.08, 0.002, 32]} />
        <meshStandardMaterial color={'#e5e5e5'} metalness={0.1} roughness={0.9} />
      </mesh>
    </mesh>
  );
};

export default RecordDisc;
