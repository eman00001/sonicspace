import { Canvas, useThree, useFrame } from "@react-three/fiber";
import './App.css';
import { Store_1 } from "./components/environments/Stores";
import { RecordCover, Record } from "./components/objects/Records";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

function WallsAndFloor() {
  const { viewport, size } = useThree();

  

  var size_x = size.width/100 * 0.7;
  var size_y = 7.4;
  var size_z = viewport.width * 1.1;

  const wfmaterials = useMemo(() => [
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshBasicMaterial({ visible: false }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
  ], []);

  if (size_x < 5.8) {
    return (
      <mesh material={wfmaterials} position={[0, 0.76, -3.7 + size_z / 2]}>
        <boxGeometry args={[5.8, size_y, 6]} />
      </mesh>
    );
  }

  return (
      <mesh material={wfmaterials} position={[0, 0.76, -3.7 + size_z / 2]}>
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
      {/* <directionalLight position={[5, 5, 0]} /> */}

      <CameraHelper />
      <Store_1 position={[0, -3, -1]} />

      {/* <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh> */}
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
      {/* <CameraControls  /> */}
    </Canvas>
  )
}

export default App
