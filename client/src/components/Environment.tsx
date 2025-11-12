import { useMemo } from "react";
import * as THREE from "three";

export function Environment() {
  const terrainSize = 1000;
  
  const terrainGeometry = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(terrainSize, terrainSize, 50, 50);
    const positions = geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const noise = Math.sin(x * 0.01) * Math.cos(y * 0.01) * 5;
      positions[i + 2] = noise;
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, [terrainSize]);
  
  return (
    <>
      <color attach="background" args={["#87CEEB"]} />
      
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[100, 100, 50]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={500}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        geometry={terrainGeometry}
      >
        <meshStandardMaterial color="#4a7c4e" />
      </mesh>
      
      <Sky />
      
      <GridHelper />
    </>
  );
}

function Sky() {
  const clouds = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 500,
      y: Math.random() * 100 + 50,
      z: (Math.random() - 0.5) * 500,
      scale: Math.random() * 15 + 10,
    }));
  }, []);
  
  return (
    <>
      <mesh position={[0, 0, -400]}>
        <sphereGeometry args={[50, 32, 32]} />
        <meshBasicMaterial color="#FDB813" />
      </mesh>
      
      {clouds.map((cloud) => (
        <mesh key={cloud.id} position={[cloud.x, cloud.y, cloud.z]}>
          <sphereGeometry args={[cloud.scale, 16, 16]} />
          <meshBasicMaterial color="#ffffff" opacity={0.8} transparent />
        </mesh>
      ))}
    </>
  );
}

function GridHelper() {
  return (
    <gridHelper
      args={[1000, 100, "#666666", "#444444"]}
      position={[0, 0.1, 0]}
    />
  );
}
