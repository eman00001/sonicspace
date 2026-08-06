import { Canvas } from "@react-three/fiber";
import './App.css';
import { Store_1 } from "./models//scenes/Store_1";
import { CameraControls  } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

function CameraHelper() {
  const { camera, scene } = useThree();

  useEffect(() => {
    const helper = new THREE.CameraHelper(camera);
    scene.add(helper);

    return () => {
      scene.remove(helper);
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
      <Store_1 position={[0, 0, 0]} />

      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      <CameraControls  />
    </Canvas>
  )
}

export default App
