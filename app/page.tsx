"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, History, Settings, User, Menu, X, PanelLeftClose } from "lucide-react";
import Dashboard from "./dashboard";
import DataLogs from "./datalogs";
import SettingsPage from "./settings";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    
    const savedLogs = localStorage.getItem("wayfinder_logs");
    if (savedLogs) {
      try {
        setRecentScans(JSON.parse(savedLogs));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("wayfinder_logs", JSON.stringify(recentScans));
    }
  }, [recentScans, isLoaded]);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden transition-colors duration-300">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div 
        className={`
          fixed md:relative z-40 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out
          ${isSidebarOpen 
            ? "w-64 translate-x-0 p-6 shadow-2xl md:shadow-none" 
            : "w-64 -translate-x-full p-6 md:w-0 md:translate-x-0 md:p-0 md:border-none overflow-hidden"
          }
        `}
      >
        <div className="w-52 flex flex-col h-full">
            <div className="flex items-center justify-between mb-10 mt-2 md:mt-0 tracking-tight">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                  <div className="absolute inset-0 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white font-extrabold text-lg">W</span>
                  </div>
                  <div className="absolute -right-2 top-1 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-emerald-500 drop-shadow-md"></div>
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white ml-3 transition-colors whitespace-nowrap">WayFinder</span>
              </div>
              
              <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-col gap-2 flex-1">
              <SidebarButton 
                active={activeTab === "dashboard"} 
                onClick={() => { setActiveTab("dashboard"); if(window.innerWidth < 768) setIsSidebarOpen(false); }} 
                icon={<LayoutDashboard size={20}/>} 
                label="Dashboard" 
              />
              <SidebarButton 
                active={activeTab === "logs"} 
                onClick={() => { setActiveTab("logs"); if(window.innerWidth < 768) setIsSidebarOpen(false); }} 
                icon={<History size={20}/>} 
                label="Data Logs" 
              />
              <SidebarButton 
                active={activeTab === "settings"} 
                onClick={() => { setActiveTab("settings"); if(window.innerWidth < 768) setIsSidebarOpen(false); }} 
                icon={<Settings size={20}/>} 
                label="Settings" 
              />
            </nav>

            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="hidden md:flex items-center gap-2 text-slate-400 hover:text-slate-700 dark:hover:text-white mt-auto py-2 transition-colors group"
            >
              <PanelLeftClose size={18} className="group-hover:-translate-x-1 transition-transform" /> 
              <span className="font-semibold text-sm">Collapse</span>
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col h-full w-full relative">
        
        <div className="p-4 md:p-10 pb-0 flex justify-between items-start shrink-0">
            <div className="flex items-center gap-4">
              
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`
                  z-20 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-sm focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-all
                  ${isSidebarOpen ? "hidden md:hidden" : "flex"}
                `}
              >
                <Menu size={20} className="text-slate-600 dark:text-slate-400" />
              </button>
              
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1 tracking-tight dark:text-white transition-colors">
                  {activeTab === "dashboard" && "Welcome To WayFinder"}
                  {activeTab === "logs" && "System Data Logs"}
                  {activeTab === "settings" && "System Settings"}
                </h1>
                <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 transition-colors">
                  {activeTab === "dashboard" && "System diagnostics and live routing intelligence."}
                  {activeTab === "logs" && "Review and export historical scan telemetry."}
                  {activeTab === "settings" && "Configure AI engine and backend architecture."}
                </p>
              </div>
            </div>

            {activeTab === "dashboard" && (
              <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-900 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full font-semibold shadow-sm hover:shadow-md transition cursor-pointer dark:text-white shrink-0 ml-4">
                Athish M <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full transition-colors"><User size={16} className="text-slate-600 dark:text-slate-400" /></div>
              </div>
            )}
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
      {icon} <span className="whitespace-nowrap">{label}</span>
    </div>
  );
}