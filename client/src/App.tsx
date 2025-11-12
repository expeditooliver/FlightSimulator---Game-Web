import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import "@fontsource/inter";
import { useFlight } from "./lib/stores/useFlight";
import { Aircraft } from "./components/Aircraft";
import { Environment } from "./components/Environment";
import { FlightCamera } from "./components/FlightCamera";
import { HUD } from "./components/HUD";
import { MainMenu } from "./components/MainMenu";
import { Tutorial } from "./components/Tutorial";

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

const keyMap = [
  { name: Controls.pitchUp, keys: ["KeyW", "ArrowUp"] },
  { name: Controls.pitchDown, keys: ["KeyS", "ArrowDown"] },
  { name: Controls.rollLeft, keys: ["KeyA", "ArrowLeft"] },
  { name: Controls.rollRight, keys: ["KeyD", "ArrowRight"] },
  { name: Controls.yawLeft, keys: ["KeyQ"] },
  { name: Controls.yawRight, keys: ["KeyE"] },
  { name: Controls.throttleUp, keys: ["ShiftLeft", "ShiftRight"] },
  { name: Controls.throttleDown, keys: ["ControlLeft", "ControlRight"] },
];

function FlightSimulator() {
  const phase = useFlight((state) => state.phase);
  const setCameraMode = useFlight((state) => state.setCameraMode);
  const toggleTutorial = useFlight((state) => state.toggleTutorial);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        toggleTutorial();
      } else if (e.key === "1") {
        setCameraMode("chase");
      } else if (e.key === "2") {
        setCameraMode("cockpit");
      } else if (e.key === "3") {
        setCameraMode("external");
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCameraMode, toggleTutorial]);
  
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden" }}>
      {phase === "menu" && <MainMenu />}
      
      {phase === "flying" && (
        <>
          <Canvas
            shadows
            camera={{
              position: [0, 10, 20],
              fov: 60,
              near: 0.1,
              far: 2000,
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
            }}
          >
            <Suspense fallback={null}>
              <Environment />
              <Aircraft />
              <FlightCamera />
            </Suspense>
          </Canvas>
          
          <HUD />
          <Tutorial />
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <KeyboardControls map={keyMap}>
      <FlightSimulator />
    </KeyboardControls>
  );
}

export default App;
