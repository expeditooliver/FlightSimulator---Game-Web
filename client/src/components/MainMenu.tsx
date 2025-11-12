import { useFlight } from "@/lib/stores/useFlight";

export function MainMenu() {
  const startGame = useFlight((state) => state.startGame);
  
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-400 to-sky-600 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4 drop-shadow-lg">
          FLIGHT SIMULATOR
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Take to the skies and master the art of flight
        </p>
        
        <button
          onClick={startGame}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl px-12 py-4 rounded-lg transition-colors shadow-lg"
        >
          START FLIGHT
        </button>
        
        <div className="mt-12 max-w-md mx-auto bg-black/30 p-6 rounded-lg text-sm">
          <h2 className="font-bold mb-3 text-lg">FEATURES</h2>
          <ul className="space-y-2 text-left">
            <li>✈️ Realistic flight physics</li>
            <li>🎮 Multiple camera views</li>
            <li>⛽ Fuel management system</li>
            <li>🌍 Open world environment</li>
            <li>📊 Comprehensive HUD display</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
