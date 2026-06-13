"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Palette, Sun, Moon, Monitor, CheckCircle2, Navigation, Shield, Trash2, Download, HardDrive, Bell, Volume2, Vibrate } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  
  const [isSaved, setIsSaved] = useState(false);
  const [activeTracking, setActiveTracking] = useState(true);
  const [autoPurge, setAutoPurge] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState("metric");
  
  // New Offline Storage States
  const [offlineMode, setOfflineMode] = useState(false);
  const [cacheRegion, setCacheRegion] = useState("nit_campus");
  
  // Alert States
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [haptics, setHaptics] = useState(true);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="px-10 pb-10 max-w-4xl flex flex-col gap-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 transition-colors">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 dark:text-white">
          <Palette className="text-emerald-500" size={24} /> Appearance
        </h2>
        
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Interface Theme</label>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Customize the visual appearance of the Command Center.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => setTheme("light")} className={`flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 transition-all ${theme === "light" ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm" : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
              <Sun size={28} />
              <span className="text-sm font-bold">Light</span>
            </button>
            <button onClick={() => setTheme("dark")} className={`flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 transition-all ${theme === "dark" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm" : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
              <Moon size={28} />
              <span className="text-sm font-bold">Dark</span>
            </button>
            <button onClick={() => setTheme("system")} className={`flex flex-col items-center justify-center gap-3 p-5 rounded-xl border-2 transition-all ${theme === "system" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm" : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
              <Monitor size={28} />
              <span className="text-sm font-bold">System Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* TELEMETRY */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 transition-colors">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 dark:text-white">
          <Navigation className="text-emerald-500" size={24} /> Telemetry Preferences
        </h2>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Background Tracking</label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Allow WayFinder to ping your GPS when minimized.</p>
            </div>
            <button onClick={() => setActiveTracking(!activeTracking)} className={`w-12 h-6 rounded-full flex items-center transition-colors p-1 ${activeTracking ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${activeTracking ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Distance Units</label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select your preferred measurement standard for routing.</p>
            </div>
            <select 
              value={distanceUnit}
              onChange={(e) => setDistanceUnit(e.target.value)}
              className="border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white"
            >
              <option value="metric">Metric (Meters / Kilometers)</option>
              <option value="imperial">Imperial (Feet / Miles)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ALERTS & NOTIFICATIONS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8 transition-colors">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 dark:text-white">
          <Bell className="text-emerald-500" size={24} /> Alerts & Feedback
        </h2>
        
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500 dark:text-slate-400"><Volume2 size={20}/></div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Audio Waypoints</label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Play sounds when a new navigational node is reached.</p>
              </div>
            </div>
            <button onClick={() => setAudioAlerts(!audioAlerts)} className={`w-12 h-6 rounded-full flex items-center transition-colors p-1 ${audioAlerts ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${audioAlerts ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg text-slate-500 dark:text-slate-400"><Vibrate size={20}/></div>
              <div>
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Haptic Feedback</label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Vibrate device upon successful payload extraction.</p>
              </div>
            </div>
            <button onClick={() => setHaptics(!haptics)} className={`w-12 h-6 rounded-full flex items-center transition-colors p-1 ${haptics ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${haptics ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>
      </div>

      <button onClick={handleSave} className={`font-bold py-4 rounded-xl transition shadow-md w-full flex items-center justify-center gap-2 ${isSaved ? 'bg-emerald-500 text-white' : 'bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white'}`}>
        {isSaved ? <><CheckCircle2 size={20} /> Configurations Updated</> : "Save & Apply Settings"}
      </button>

    </div>
  );
}