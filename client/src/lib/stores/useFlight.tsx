import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import * as THREE from "three";

export type GamePhase = "menu" | "flying" | "paused";
export type CameraMode = "chase" | "cockpit" | "external";

export interface AircraftState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: THREE.Euler;
  angularVelocity: THREE.Vector3;
  throttle: number;
  fuel: number;
  maxFuel: number;
}

interface FlightState {
  phase: GamePhase;
  cameraMode: CameraMode;
  aircraft: AircraftState;
  showTutorial: boolean;
  
  setPhase: (phase: GamePhase) => void;
  setCameraMode: (mode: CameraMode) => void;
  updateAircraft: (updates: Partial<AircraftState>) => void;
  consumeFuel: (amount: number) => void;
  resetAircraft: () => void;
  toggleTutorial: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
}

const initialAircraftState: AircraftState = {
  position: new THREE.Vector3(0, 50, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  rotation: new THREE.Euler(0, 0, 0),
  angularVelocity: new THREE.Vector3(0, 0, 0),
  throttle: 0.3,
  fuel: 100,
  maxFuel: 100,
};

export const useFlight = create<FlightState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    cameraMode: "chase",
    aircraft: { ...initialAircraftState },
    showTutorial: true,
    
    setPhase: (phase) => set({ phase }),
    
    setCameraMode: (mode) => {
      console.log(`Camera mode changed to: ${mode}`);
      set({ cameraMode: mode });
    },
    
    updateAircraft: (updates) =>
      set((state) => ({
        aircraft: { ...state.aircraft, ...updates },
      })),
    
    consumeFuel: (amount) =>
      set((state) => ({
        aircraft: {
          ...state.aircraft,
          fuel: Math.max(0, state.aircraft.fuel - amount),
        },
      })),
    
    resetAircraft: () =>
      set({
        aircraft: {
          position: new THREE.Vector3(0, 50, 0),
          velocity: new THREE.Vector3(0, 0, 0),
          rotation: new THREE.Euler(0, 0, 0),
          angularVelocity: new THREE.Vector3(0, 0, 0),
          throttle: 0.3,
          fuel: 100,
          maxFuel: 100,
        },
      }),
    
    toggleTutorial: () =>
      set((state) => ({ showTutorial: !state.showTutorial })),
    
    startGame: () => {
      console.log("Starting flight simulator");
      set({ phase: "flying", showTutorial: true });
    },
    
    pauseGame: () => set({ phase: "paused" }),
    
    resumeGame: () => set({ phase: "flying" }),
  }))
);
