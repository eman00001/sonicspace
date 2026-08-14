import React from 'react';
import { Canvas, useThree} from "@react-three/fiber";
import './Scene.css';
import { Store_1 } from "./components/environments/Stores";
// import { CONSTANTS } from "./constants/constants";
import { EmptySquare, EmptyDisc, RecordSquare, RecordDisc} from "./components/objects/Records";
import RecordViewer from './components/ui/RecordViewer';
import AddSongs from './components/ui/AddSongs';
import { OrbitControls } from "@react-three/drei";
import { useEffect, useState } from "react";
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
    FLOOR_SHELF_UPPER_BOTTOM: -0.35,
    FLOOR_SHELF_LOWER_BOTTOM: -3.2,
    WALL_DEPTH: 2,
};

function WallsAndFloor() {
  const { viewport, size } = useThree();
  var size_x = size.width/100 * CONSTANTS.ROOM_X_SCALE;
  var size_y = CONSTANTS.ROOM_Y;
  var size_z = viewport.width * CONSTANTS.ROOM_Z_SCALE;

  const wfmaterials = [
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
    new THREE.MeshBasicMaterial({ visible: false }),
    new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: "orange" }),
  ];

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

function Scene() {
  // hard code for now but can be dynamic later if shelf size is dynamic
  const recordSquareCount = 47;
  const recordDiscCount = 3;
  const recordSquareRowCount = 6;
  const recordSquareColumnCount = Math.floor(CONSTANTS.SHELF_LENGTH/1.2);
  const recordSquareLayerCount = 2;
  const squareSize: [number, number, number] = [1.2, 1.2, 0.05];

  // provide one image path per cover (served from public/)
  const coverPaths = Array.from({ length: recordSquareCount }, (_, i) => `https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/03/7f/ef/037fef16-46d5-f338-62e2-e974342d5be2/artwork.jpg/1000x1000bb.jpg`);
  // const textures = useTexture(coverPaths);
  type RecordOverlay = {
    type: 'square' | 'disc';
    record: {
      title: string;
      artist: string;
      texture?: string;
    };
  };
  const [overlay, setOverlay] = useState<null | RecordOverlay>(null);
  const lastInteractionStartedInside = React.useRef(false);
  const lastInteractionWasDrag = React.useRef(false);
  const [addSongsOpen, setAddSongsOpen] = useState(false);
  const recordSquares: React.ReactNode[] = [];

  for (let i = 0; i < recordSquareLayerCount; i++) {
    for (let j = 0; j < recordSquareColumnCount; j++) {
      for (let k = 0; k < recordSquareRowCount; k++) {

        const index =
          i * (recordSquareColumnCount * recordSquareRowCount) +
          j * recordSquareRowCount +
          k;

        if (index >= recordSquareCount) {
          recordSquares.push(
            <EmptySquare
              key={index}
              position={[
                -CONSTANTS.SHELF_LENGTH/2 + 1.2 + (j*CONSTANTS.FLOOR_SHELF_COLUMN_SPACING),
                i==1?CONSTANTS.FLOOR_SHELF_LOWER_BOTTOM + i:CONSTANTS.FLOOR_SHELF_UPPER_BOTTOM - i,
                -3.3 + (0.22 * k)
              ]}
              rotation={[-Math.PI / 9, 0, 0]}
              squareSize={squareSize}
              onClick={() => setAddSongsOpen(false)}
            />
          );
          break;
        }

        const recordTitle = `Shelf Track ${index + 1}`;
        const recordArtist = 'Placeholder Artist';

        recordSquares.push(
          <RecordSquare
            key={index}
            title={recordTitle}
            artist={recordArtist}
            position={[
              -CONSTANTS.SHELF_LENGTH/2 + 1.2 + (j*CONSTANTS.FLOOR_SHELF_COLUMN_SPACING),
              i==1?CONSTANTS.FLOOR_SHELF_LOWER_BOTTOM + i:CONSTANTS.FLOOR_SHELF_UPPER_BOTTOM - i,
              -3.3 + (0.22 * k)
            ]}
            rotation={[-Math.PI / 9, 0, 0]}
            squareSize={squareSize}
            texturePath={coverPaths[index]}
            onClick={() => setOverlay({
              type: 'square',
              record: {
                title: recordTitle,
                artist: recordArtist,
                texture: coverPaths[index],
              },
            })}
          />
        );
      }
    }
  }
  const recordDiscs: React.ReactNode[] = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 3; j++) {
      const index = (i * 2) + j;

      const discTitle = `Disc ${i + 1}-${j + 1}`;
      const discArtist = 'Placeholder Artist';
      

      if (index >= recordDiscCount) {
        recordDiscs.push(
          <EmptyDisc
          key={`${discTitle}-${j}`}
          title={discTitle}
          artist={discArtist}
          position={[-1.37 + (j*1.35), 1.55 + (i*1.35), -3.5]}
          rotation={[-Math.PI / 12, 0, 0]}
          texturePath={"/assets/charlotte_cover.jpg"}
          onClick={() => setOverlay({
            type: 'disc',
            record: {
              title: discTitle,
              artist: discArtist,
              texture: '/assets/charlotte_cover.jpg',
            },
          })}
        />
        );
        break;
      }

      recordDiscs.push(
        <RecordDisc
          key={`${discTitle}-${j}`}
          title={discTitle}
          artist={discArtist}
          position={[-1.37 + (j*1.35), 1.55 + (i*1.35), -3.5]}
          rotation={[-Math.PI / 12, 0, 0]}
          texturePath={"/assets/charlotte_cover.jpg"}
          onClick={() => setOverlay({
            type: 'disc',
            record: {
              title: discTitle,
              artist: discArtist,
              texture: '/assets/charlotte_cover.jpg',
            },
          })}
        />
      );
    }
  }

  return (
    <div className="scene-container" style={{ width: '100%', height: '100%', position: 'relative' }}>
      {!addSongsOpen && (
        <button className="add-songs-button" onClick={() => setAddSongsOpen(true)}>+ Add Songs</button>
      )}
      <Canvas shadows>
        <ambientLight intensity={0.5} />

        <Store_1 position={[0, -3, -1]} />

        {recordDiscs}
        {recordSquares}

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
      {addSongsOpen && (
        <div className="overlay" onClick={() => setAddSongsOpen(false)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <AddSongs onClose={() => setAddSongsOpen(false)} />
          </div>
        </div>
      )}

      {overlay && (
        <div className="overlay" onClick={() => {
          // ignore closing if last interaction started inside viewer or was a drag
          if (lastInteractionStartedInside.current || lastInteractionWasDrag.current) {
            lastInteractionStartedInside.current = false;
            lastInteractionWasDrag.current = false;
            return;
          }
          setOverlay(null);
        }}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <RecordViewer
              record={overlay.record}
              onClose={() => setOverlay(null)}
              onInteractionStart={() => { lastInteractionStartedInside.current = true; lastInteractionWasDrag.current = false; }}
              onInteractionEnd={(wasDrag) => { lastInteractionWasDrag.current = wasDrag; }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Scene
