import { Canvas, useThree } from "@react-three/fiber";
import './App.css';
import { Store_1 } from "./models/scenes/Store_1";
import { RecordCover, Record } from "./models/objects/Records";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

function WallsAndFloor() {
  const { viewport } = useThree();

  // 25% of the viewport width
  const size_x = viewport.width * 1.1;
  const size_y = viewport.height * 1.3;
  const wfmaterials = useMemo(() => [
    new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: "orange" }),
    new THREE.MeshBasicMaterial({ visible: false }), // +Z
    new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: "orange" }),
  ], []);

  useEffect(() => {
    return () => {
      wfmaterials.forEach((m) => { if ((m as any).dispose) (m as any).dispose(); });
    };
  }, [wfmaterials]);

  return (
    <mesh material={wfmaterials} position={[0, 0, -1]}>
      <boxGeometry args={[size_x, size_y, 6]} />
      {/* <meshStandardMaterial color="orange" /> */}
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
