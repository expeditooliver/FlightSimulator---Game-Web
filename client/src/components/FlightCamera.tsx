import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFlight } from "@/lib/stores/useFlight";

export function FlightCamera() {
  const { camera } = useThree();
  const aircraft = useFlight((state) => state.aircraft);
  const cameraMode = useFlight((state) => state.cameraMode);
  const targetPosition = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  
  useFrame(() => {
    const position = aircraft.position;
    const rotation = aircraft.rotation;
    
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyEuler(rotation);
    
    const right = new THREE.Vector3(1, 0, 0);
    right.applyEuler(rotation);
    
    const up = new THREE.Vector3(0, 1, 0);
    up.applyEuler(rotation);
    
    let newPos = new THREE.Vector3();
    let newLookAt = new THREE.Vector3();
    
    switch (cameraMode) {
      case "chase":
        newPos = position.clone()
          .add(forward.clone().multiplyScalar(-20))
          .add(new THREE.Vector3(0, 5, 0));
        newLookAt = position.clone().add(forward.clone().multiplyScalar(10));
        break;
        
      case "cockpit":
        newPos = position.clone()
          .add(forward.clone().multiplyScalar(0.5))
          .add(new THREE.Vector3(0, 1, 0));
        newLookAt = position.clone().add(forward.clone().multiplyScalar(50));
        break;
        
      case "external":
        const angle = Date.now() * 0.0002;
        const radius = 30;
        newPos = new THREE.Vector3(
          position.x + Math.sin(angle) * radius,
          position.y + 10,
          position.z + Math.cos(angle) * radius
        );
        newLookAt = position.clone();
        break;
    }
    
    targetPosition.current.lerp(newPos, 0.1);
    targetLookAt.current.lerp(newLookAt, 0.1);
    
    camera.position.copy(targetPosition.current);
    camera.lookAt(targetLookAt.current);
  });
  
  return null;
}
