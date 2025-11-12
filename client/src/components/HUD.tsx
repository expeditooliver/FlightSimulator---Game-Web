import { useFlight } from "@/lib/stores/useFlight";
import { useEffect, useState } from "react";

export function HUD() {
  const aircraft = useFlight((state) => state.aircraft);
  const cameraMode = useFlight((state) => state.cameraMode);
  const setCameraMode = useFlight((state) => state.setCameraMode);
  const phase = useFlight((state) => state.phase);
  const [altitude, setAltitude] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [heading, setHeading] = useState(0);
  
  useEffect(() => {
    setAltitude(Math.round(aircraft.position.y));
    setSpeed(Math.round(aircraft.velocity.length() * 3.6));
    
    const headingDegrees = ((aircraft.rotation.y * 180 / Math.PI) + 360) % 360;
    setHeading(Math.round(headingDegrees));
  }, [aircraft]);
  
  if (phase !== "flying") return null;
  
  const fuelPercentage = (aircraft.fuel / aircraft.maxFuel) * 100;
  const throttlePercentage = aircraft.throttle * 100;
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute top-4 left-4 bg-black/70 text-white p-4 rounded-lg font-mono text-sm pointer-events-auto">
        <div className="space-y-2">
          <div className="flex justify-between gap-8">
            <span>ALTITUDE:</span>
            <span className="font-bold">{altitude}m</span>
          </div>
          <div className="flex justify-between gap-8">
            <span>SPEED:</span>
            <span className="font-bold">{speed} km/h</span>
          </div>
          <div className="flex justify-between gap-8">
            <span>HEADING:</span>
            <span className="font-bold">{heading}°</span>
          </div>
          <div className="flex justify-between gap-8">
            <span>THROTTLE:</span>
            <span className="font-bold">{throttlePercentage.toFixed(0)}%</span>
          </div>
          
          <div className="pt-2 border-t border-gray-500">
            <div className="text-xs mb-1">FUEL</div>
            <div className="w-full bg-gray-700 h-4 rounded overflow-hidden">
              <div
                className={`h-full transition-all ${
                  fuelPercentage > 30 ? "bg-green-500" :
                  fuelPercentage > 10 ? "bg-yellow-500" :
                  "bg-red-500 animate-pulse"
                }`}
                style={{ width: `${fuelPercentage}%` }}
              />
            </div>
            <div className="text-xs mt-1 text-right">{fuelPercentage.toFixed(1)}%</div>
          </div>
        </div>
      </div>
      
      <div className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-lg font-mono text-xs pointer-events-auto">
        <div className="font-bold mb-2">CAMERA VIEW</div>
        <div className="space-y-1">
          <button
            onClick={() => setCameraMode("chase")}
            className={`block w-full text-left px-2 py-1 rounded ${
              cameraMode === "chase" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Chase (1)
          </button>
          <button
            onClick={() => setCameraMode("cockpit")}
            className={`block w-full text-left px-2 py-1 rounded ${
              cameraMode === "cockpit" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            Cockpit (2)
          </button>
          <button
            onClick={() => setCameraMode("external")}
            className={`block w-full text-left px-2 py-1 rounded ${
              cameraMode === "external" ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            External (3)
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <Crosshair />
      </div>
      
      {aircraft.fuel === 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600/90 text-white p-6 rounded-lg text-center pointer-events-auto">
          <div className="text-2xl font-bold mb-2">OUT OF FUEL!</div>
          <div className="text-sm">Engine offline - Glide to safety</div>
        </div>
      )}
    </div>
  );
}

function Crosshair() {
  return (
    <svg width="40" height="40" className="opacity-70">
      <circle cx="20" cy="20" r="15" fill="none" stroke="white" strokeWidth="2" />
      <line x1="20" y1="5" x2="20" y2="12" stroke="white" strokeWidth="2" />
      <line x1="20" y1="28" x2="20" y2="35" stroke="white" strokeWidth="2" />
      <line x1="5" y1="20" x2="12" y2="20" stroke="white" strokeWidth="2" />
      <line x1="28" y1="20" x2="35" y2="20" stroke="white" strokeWidth="2" />
    </svg>
  );
}
