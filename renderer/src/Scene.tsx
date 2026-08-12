import { Canvas, useThree} from "@react-three/fiber";
import './Scene.css';
import { Store_1 } from "./components/environments/Stores";
import { CONSTANTS } from "./constants/constants";
import { RecordSquare, RecordDisc, RecordLayer } from "./components/objects/Records";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

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
  const recordSquareCount = 8;
  const recordSquareRowCount = 8;
  const recordSquareColumnCount = 2;
  const recordSquareLayerCount = 2;
  const squareSize: [number, number, number] = [1.2, 1.2, 0.05];

  // provide one image path per cover (served from public/)
  const coverPaths = Array.from({ length: recordSquareCount }, (_, i) => `https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/03/7f/ef/037fef16-46d5-f338-62e2-e974342d5be2/artwork.jpg/1000x1000bb.jpg`);
  // const textures = useTexture(coverPaths);

  const recordLayers = Array.from({ length: recordSquareLayerCount }, (_, index) => (
    <RecordLayer
      key={index}
      position={[-1.5, CONSTANTS.FLOOR_SHELF_UPPER_BOTTOM, -3.3 + (0.15 * index)]}
      rotation={[-Math.PI / 12, 0, 0]}
      squareSize={squareSize}
      texturePath ={coverPaths[index]}
    />
  ));
  const recordSquares = Array.from({ length: recordSquareCount }, (_, index) => (
    <RecordSquare
      key={index}
      position={[-1.5, CONSTANTS.FLOOR_SHELF_UPPER_BOTTOM, -3.3 + (0.15 * index)]}
      rotation={[-Math.PI / 12, 0, 0]}
      squareSize={squareSize}
      texturePath ={coverPaths[index]}
    />
  ));

  

  return (
    <Canvas shadows>
      <ambientLight intensity={0.5} />

      <CameraHelper />
      <Store_1 position={[0, -3, -1]} />

      {recordSquares}
      {/* <RecordSquare position={[-1.5, -1, -3]}></RecordSquare> */}
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
