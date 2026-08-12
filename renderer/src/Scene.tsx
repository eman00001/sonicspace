import { Canvas, useThree} from "@react-three/fiber";
import './Scene.css';
import { Store_1 } from "./components/environments/Stores";
// import { CONSTANTS } from "./constants/constants";
import { RecordSquare, RecordDisc} from "./components/objects/Records";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

var CONSTANTS = {
    BACK_WALL_Z_OFFSET: -3.7,
    ROOM_Y: 7.4,
    ROOM_X_SCALE: 0.7,
    ROOM_Z_SCALE: 1.1,
    ROOM_Y_OFFSET: 0.76,
    WINDOW_BREAKPOINT: 6,
    SHELF_LENGTH: 5.9,
    FLOOR_SHELF_ROW_SPACING: 0.1,
    FLOOR_SHELF_COLUMN_SPACING: 1.25,
    FLOOR_SHELF_BACK: -3.3,
    FLOOR_SHELF_LEFT: -1.7,
    FLOOR_SHELF_UPPER_BOTTOM: -1.2,
    FLOOR_SHELF_LOWER_BOTTOM: -2.4,
    WALL_DEPTH: 2,
};

function WallsAndFloor() {
  const { viewport, size } = useThree();
  var size_x = size.width/100 * CONSTANTS.ROOM_X_SCALE;
  var size_y = CONSTANTS.ROOM_Y;
  var size_z = viewport.width * CONSTANTS.ROOM_Z_SCALE;

  const wfmaterials = useMemo(() => [
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshBasicMaterial({ visible: false }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
  ], []);

  if (size_x < CONSTANTS.WINDOW_BREAKPOINT) {
    return (
      <mesh material={wfmaterials} position={[0, CONSTANTS.ROOM_Y_OFFSET, CONSTANTS.BACK_WALL_Z_OFFSET + size_z / 2]} receiveShadow>
        <boxGeometry args={[CONSTANTS.WINDOW_BREAKPOINT, size_y, CONSTANTS.WINDOW_BREAKPOINT + 0.2]} />
      </mesh>
    );
  }

  return (
      <mesh material={wfmaterials} position={[0, CONSTANTS.ROOM_Y_OFFSET, CONSTANTS.BACK_WALL_Z_OFFSET + size_z / 2]} receiveShadow>
        <boxGeometry args={[size_x, size_y, size_z]} />
      </mesh>
  );
}

function CameraHelper() {
  const { camera, scene } = useThree();

  useEffect(() => {
    const helper = new THREE.CameraHelper(camera);
    scene.add(helper);

    return () => {
      scene.remove(helper);
      // dispose helper resources if present
      try {
        // @ts-ignore
        helper.geometry?.dispose?.();
        // @ts-ignore
        if (Array.isArray((helper as any).material)) {
          (helper as any).material.forEach((m: any) => m?.dispose && m.dispose());
        } else {
          (helper as any).material?.dispose?.();
        }
      } catch (e) {
        // ignore disposal errors
      }
    };
  }, [camera, scene]);

  return null;
}

function Scene() {
  // hard code for now but can be dynamic later if shelf size is dynamic
  const recordSquareCount = 34;
  const recordSquareRowCount = 8;
  const recordSquareColumnCount = Math.floor(CONSTANTS.SHELF_LENGTH/1.2);
  const recordSquareLayerCount = 2;
  const squareSize: [number, number, number] = [1.2, 1.2, 0.05];

  // provide one image path per cover (served from public/)
  const coverPaths = Array.from({ length: recordSquareCount }, (_, i) => `https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/03/7f/ef/037fef16-46d5-f338-62e2-e974342d5be2/artwork.jpg/1000x1000bb.jpg`);
  // const textures = useTexture(coverPaths);
  var done = false;
  const recordSquares: React.ReactNode[] = [];

  for (let i = 0; i < recordSquareLayerCount; i++) {
    for (let j = 0; j < recordSquareColumnCount; j++) {
      for (let k = 0; k < recordSquareRowCount; k++) {

        const index =
          i * (recordSquareColumnCount * recordSquareRowCount) +
          j * recordSquareRowCount +
          k;

        if (index >= recordSquareCount) {
          break;
        }

        recordSquares.push(
          <RecordSquare
            key={index}
            position={[
              -CONSTANTS.SHELF_LENGTH/2 + 1.2 + (j*CONSTANTS.FLOOR_SHELF_COLUMN_SPACING),
              CONSTANTS.FLOOR_SHELF_UPPER_BOTTOM - i,
              -3.3 + 0.15 * k
            ]}
            rotation={[-Math.PI / 12, 0, 0]}
            squareSize={squareSize}
            texturePath={coverPaths[index]}
          />
        );
      }
    }
  }
  

  return (
    <Canvas shadows>
      <ambientLight intensity={0.5} />

      <CameraHelper />
      <Store_1 position={[0, -3, -1]} />

      {recordSquares}
      <RecordDisc position={[-1.6, 1.75, -3.5]} rotation={[-Math.PI / 12, 0, 0]}></RecordDisc>
      <WallsAndFloor></WallsAndFloor>
      <OrbitControls  
        target={[0, 0, 0]}
        enableDamping
        enablePan={false}
        minDistance={4}
        maxDistance={10}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={(2*Math.PI) / 4}
        minAzimuthAngle={-Math.PI / 6}
        maxAzimuthAngle={Math.PI / 6}
      />
    </Canvas>
  )
}

export default Scene
