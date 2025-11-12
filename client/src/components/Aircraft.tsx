
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Aircraft() {
  const meshRef = useRef<THREE.Group | null>(null);

  // simple state refs
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const throttle = useRef(0); // 0..1
  const pitch = useRef(0);
  const roll = useRef(0);
  const yaw = useRef(0);
  const keys = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const onUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // update controls from keys
    // throttle: w/s or ArrowUp/ArrowDown
    if (keys.current["w"] || keys.current["arrowup"]) throttle.current = Math.min(1, throttle.current + delta * 0.5);
    if (keys.current["s"] || keys.current["arrowdown"]) throttle.current = Math.max(0, throttle.current - delta * 0.5);

    // pitch: i/k or shift+arrowUp/Down (also use j/l for roll)
    const pitchSpeed = 0.8;
    const rollSpeed = 1.2;
    const yawSpeed = 0.6;

    pitch.current = 0;
    roll.current = 0;
    yaw.current = 0;

    if (keys.current["arrowleft"] || keys.current["a"]) roll.current = Math.max(-1, -1);
    if (keys.current["arrowright"] || keys.current["d"]) roll.current = Math.min(1, 1);

    if (keys.current["q"]) yaw.current = -1;
    if (keys.current["e"]) yaw.current = 1;

    if (keys.current["i"]) pitch.current = 1;
    if (keys.current["k"]) pitch.current = -1;

    // apply rotations
    const mesh = meshRef.current;
    // compute rotation deltas
    const rot = new THREE.Euler().copy(mesh.rotation);
    rot.x += -pitch.current * pitchSpeed * delta; // pitch affects x
    rot.z += -roll.current * rollSpeed * delta; // roll affects z
    rot.y += yaw.current * yawSpeed * delta; // yaw affects y

    mesh.rotation.set(rot.x, rot.y, rot.z);

    // forward thrust in local -z direction
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(mesh.rotation);
    // simple drag & lift model
    const thrust = forward.multiplyScalar(10 * throttle.current); // thrust magnitude
    // gravity
    const gravity = new THREE.Vector3(0, -9.81 * delta, 0);

    // update velocity
    velocity.current.add(thrust.clone().multiplyScalar(delta));
    velocity.current.add(gravity);

    // apply damping to simulate drag
    velocity.current.multiplyScalar(Math.max(0, 1 - 0.1 * delta));

    // update position
    mesh.position.add(velocity.current.clone().multiplyScalar(delta));

    // keep above ground (simple ground collision)
    if (mesh.position.y < 0.2) {
      mesh.position.y = 0.2;
      velocity.current.y = Math.max(0, velocity.current.y);
    }
  });

  return (
    <group ref={meshRef} position={[0, 1, 5]}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.5, 0.5, 3]} />
        <meshStandardMaterial color="#2ecc71" />
      </mesh>

      <mesh position={[0, -0.15, -1.5]} castShadow>
        <boxGeometry args={[0.6, 0.05, 1.8]} />
        <meshStandardMaterial color="#27ae60" />
      </mesh>

      {/* left wing */}
      <mesh position={[-1.5, 0, -0.2]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.05, 0.6]} />
        <meshStandardMaterial color="#16a085" />
      </mesh>

      {/* right wing */}
      <mesh position={[1.5, 0, -0.2]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 0.05, 0.6]} />
        <meshStandardMaterial color="#16a085" />
      </mesh>

      {/* tail */}
      <mesh position={[0, 0.4, -2.2]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.6]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>

      {/* vertical stabilizer */}
      <mesh position={[0, 0.8, -2.2]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 0.8]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </group>
  );
}

export default Aircraft;
