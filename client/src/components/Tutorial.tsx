import { useFlight } from "@/lib/stores/useFlight";

export function Tutorial() {
  const showTutorial = useFlight((state) => state.showTutorial);
  const toggleTutorial = useFlight((state) => state.toggleTutorial);
  const phase = useFlight((state) => state.phase);
  
  if (!showTutorial || phase !== "flying") return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
      <div className="bg-black/90 text-white p-8 rounded-lg max-w-2xl pointer-events-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">FLIGHT CONTROLS</h2>
          <button
            onClick={toggleTutorial}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm"
          >
            Close (Esc)
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-3 text-lg text-blue-400">FLIGHT CONTROL</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Pitch Up:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">W / ↑</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Pitch Down:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">S / ↓</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Roll Left:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">A / ←</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Roll Right:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">D / →</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Yaw Left:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">Q</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Yaw Right:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">E</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-3 text-lg text-green-400">POWER & CAMERA</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Throttle Up:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">Shift</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Throttle Down:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">Ctrl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Chase View:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Cockpit View:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">External View:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Toggle Tutorial:</span>
                <span className="font-mono bg-gray-800 px-2 py-1 rounded">Esc</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-600 rounded">
          <h3 className="font-bold mb-2 text-yellow-400">⚠️ FLIGHT TIPS</h3>
          <ul className="text-sm space-y-1 text-gray-200">
            <li>• Maintain altitude above 2m to avoid ground collision</li>
            <li>• Watch your fuel gauge - running out will disable your engine</li>
            <li>• Use throttle to control speed and altitude</li>
            <li>• Roll and pitch together for smooth turns</li>
            <li>• Higher speeds generate more lift but consume more fuel</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
