import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useFlight } from "@/lib/stores/useFlight";
import { useKeyboardControls } from "@react-three/drei";

enum Controls {
  pitchUp = "pitchUp",
  pitchDown = "pitchDown",
  rollLeft = "rollLeft",
  rollRight = "rollRight",
  yawLeft = "yawLeft",
  yawRight = "yawRight",
  throttleUp = "throttleUp",
  throttleDown = "throttleDown",
}

export function Aircraft() {
  const meshRef = useRef<THREE.Group>(null);
  const aircraft = useFlight((state) => state.aircraft);
  const updateAircraft = useFlight((state) => state.updateAircraft);
  const consumeFuel = useFlight((state) => state.consumeFuel);
  const phase = useFlight((state) => state.phase);
  const [, get] = useKeyboardControls<Controls>();
  
  const velocityRef = useRef(new THREE.Vector3(0, 0, 20));
  const angularVelocityRef = useRef(new THREE.Vector3(0, 0, 0));
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(aircraft.position);
      meshRef.current.rotation.copy(aircraft.rotation);
    }
  }, []);
  
  useFrame((state, delta) => {
    if (!meshRef.current || phase !== "flying") return;
    
    const controls = get();
    const mesh = meshRef.current;
    
    const maxThrottle = 1.0;
    const minThrottle = 0.0;
    let throttle = aircraft.throttle;
    
    if (controls.throttleUp) {
      throttle = Math.min(maxThrottle, throttle + delta * 0.5);
    }
    if (controls.throttleDown) {
      throttle = Math.max(minThrottle, throttle - delta * 0.5);
    }
    
    const fuelConsumptionRate = throttle * delta * 0.5;
    if (aircraft.fuel > 0) {
      consumeFuel(fuelConsumptionRate);
    } else {
      throttle = 0;
    }
    
    const thrust = throttle * 80;
    const gravity = -9.8;
    
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyEuler(mesh.rotation);
    
    const right = new THREE.Vector3(1, 0, 0);
    right.applyEuler(mesh.rotation);
    
    const up = new THREE.Vector3(0, 1, 0);
    up.applyEuler(mesh.rotation);
    
    const speed = velocityRef.current.length();
    const liftCoefficient = 0.3;
    const lift = speed * speed * liftCoefficient * Math.cos(mesh.rotation.x);
    
    const dragCoefficient = 0.02;
    const drag = speed * speed * dragCoefficient;
    
    const thrustForce = forward.multiplyScalar(thrust);
    const liftForce = new THREE.Vector3(0, lift, 0);
    const gravityForce = new THREE.Vector3(0, gravity * 10, 0);
    const dragForce = velocityRef.current.clone().normalize().multiplyScalar(-drag);
    
    const totalForce = new THREE.Vector3()
      .add(thrustForce)
      .add(liftForce)
      .add(gravityForce)
      .add(dragForce);
    
    const mass = 10;
    const acceleration = totalForce.divideScalar(mass);
    velocityRef.current.add(acceleration.multiplyScalar(delta));
    
    const pitchSpeed = 1.5;
    const rollSpeed = 2.0;
    const yawSpeed = 0.8;
    
    const targetAngularVel = new THREE.Vector3(0, 0, 0);
    
    if (controls.pitchUp) {
      targetAngularVel.x = -pitchSpeed;
    }
    if (controls.pitchDown) {
      targetAngularVel.x = pitchSpeed;
    }
    if (controls.rollLeft) {
      targetAngularVel.z = rollSpeed;
    }
    if (controls.rollRight) {
      targetAngularVel.z = -rollSpeed;
    }
    if (controls.yawLeft) {
      targetAngularVel.y = yawSpeed;
    }
    if (controls.yawRight) {
      targetAngularVel.y = -yawSpeed;
    }
    
    const angularDamping = 0.9;
    angularVelocityRef.current.lerp(targetAngularVel, 0.1);
    angularVelocityRef.current.multiplyScalar(angularDamping);
    
    mesh.rotation.x += angularVelocityRef.current.x * delta;
    mesh.rotation.y += angularVelocityRef.current.y * delta;
    mesh.rotation.z += angularVelocityRef.current.z * delta;
    
    mesh.rotation.x = THREE.MathUtils.clamp(mesh.rotation.x, -Math.PI / 2, Math.PI / 2);
    mesh.rotation.z = THREE.MathUtils.clamp(mesh.rotation.z, -Math.PI / 3, Math.PI / 3);
    
    mesh.position.add(velocityRef.current.clone().multiplyScalar(delta));
    
    if (mesh.position.y < 2) {
      mesh.position.y = 2;
      velocityRef.current.y = Math.max(0, velocityRef.current.y);
      
      if (speed < 10) {
        velocityRef.current.multiplyScalar(0.5);
      }
    }
    
    updateAircraft({
      position: mesh.position.clone(),
      velocity: velocityRef.current.clone(),
      rotation: mesh.rotation.clone(),
      angularVelocity: angularVelocityRef.current.clone(),
      throttle: throttle,
    });
  });
  
  return (
    <group ref={meshRef}>
      <mesh castShadow>
        <boxGeometry args={[2, 0.5, 4]} />
        <meshStandardMaterial color="#3498db" />
      </mesh>
      
      <mesh position={[0, 0.5, -1]} castShadow>
        <boxGeometry args={[0.5, 0.8, 1]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      
      <mesh position={[-3, 0, 0]} rotation={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[6, 0.1, 1.5]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
      <mesh position={[3, 0, 0]} rotation={[0, 0, -0.1]} castShadow>
        <boxGeometry args={[6, 0.1, 1.5]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
      
      <mesh position={[0, 0.3, -2]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.1, 1]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
      
      <mesh position={[0, 0.8, -2]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 0.8]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </group>
  );
}
