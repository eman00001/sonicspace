import { Canvas, useThree, useFrame } from "@react-three/fiber";
import './App.css';
import { Store_1 } from "./components/environments/Stores";
import { CONSTANTS } from "./constants/constants";
import { RecordCover, Record } from "./components/objects/Records";
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
      <mesh material={wfmaterials} position={[0, CONSTANTS.ROOM_Y_OFFSET, CONSTANTS.BACK_WALL_Z_OFFSET + size_z / 2]}>
        <boxGeometry args={[CONSTANTS.WINDOW_BREAKPOINT, size_y, CONSTANTS.WINDOW_BREAKPOINT + 0.2]} />
      </mesh>
    );
  }

  return (
      <mesh material={wfmaterials} position={[0, CONSTANTS.ROOM_Y_OFFSET, CONSTANTS.BACK_WALL_Z_OFFSET + size_z / 2]}>
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

function App() {

  

  return (
    <Canvas shadows>
      <ambientLight intensity={0.5} />

      <CameraHelper />
      <Store_1 position={[0, -3, -1]} />

      <RecordCover></RecordCover>
      <Record position={[0, 3, -1]}></Record>
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

export default App
