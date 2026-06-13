"use client";

import { useState } from "react";
import { LayoutDashboard, History, Settings, Globe, User, Compass } from "lucide-react";
import Dashboard from "./dashboard";
import DataLogs from "./datalogs";
import SettingsPage from "./settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [recentScans, setRecentScans] = useState([]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      
      <div className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col shrink-0 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-10 tracking-tight">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-extrabold text-lg">W</span>
            </div>
            <div className="absolute -right-2 top-1 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-emerald-500 drop-shadow-md"></div>
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white ml-3 transition-colors">WayFinder</span>
        </div>

        <nav className="flex flex-col gap-2">
          <SidebarButton active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <SidebarButton active={activeTab === "logs"} onClick={() => setActiveTab("logs")} icon={<History size={20}/>} label="Data Logs" />
          <SidebarButton active={activeTab === "settings"} onClick={() => setActiveTab("settings")} icon={<Settings size={20}/>} label="Settings" />
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-10 pb-0">
          <div className="flex justify-between items-center mb-8 max-w-5xl">
            <div>
              <h1 className="text-3xl font-bold mb-1 tracking-tight dark:text-white transition-colors">
                {activeTab === "dashboard" && "Welcome To WayFinder"}
                {activeTab === "logs" && "System Data Logs"}
                {activeTab === "settings" && "System Settings"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 transition-colors">
                {activeTab === "dashboard" && "System diagnostics and live routing intelligence."}
                {activeTab === "logs" && "Review and export historical scan telemetry."}
                {activeTab === "settings" && "Configure AI engine and backend architecture."}
              </p>
            </div>
            
            {activeTab === "dashboard" && (
              <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full font-semibold shadow-sm hover:shadow-md transition cursor-pointer dark:text-white">
                Athish M <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full transition-colors"><User size={16} className="text-slate-600 dark:text-slate-400" /></div>
              </div>
            )}
          </div>
        </div>
        
        {activeTab === "dashboard" && <Dashboard recentScans={recentScans} setRecentScans={setRecentScans} />}
        {activeTab === "logs" && <DataLogs logs={recentScans} setRecentScans={setRecentScans} />}
        {activeTab === "settings" && <SettingsPage />}
      </div>
    </div>
  );
}

function SidebarButton({ active, onClick, icon, label }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 font-semibold rounded-lg cursor-pointer transition-all duration-200 ${active ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
      {icon} {label}
    </div>
  );
}