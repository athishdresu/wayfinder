"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, UploadCloud, Video, X, Eye, Compass, Aperture, Radio, Edit2, Check, Database, Clock, Download, Navigation, Trash2, MapPin, Route, Milestone, Car, Bike, Bus, Footprints } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function Dashboard({ recentScans, setRecentScans }: any) {
  const [location, setLocation] = useState({ lat: "10.8988", lng: "76.9015" });
  const [gpsStatus, setGpsStatus] = useState("Locating GPS...");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  
  const [latency, setLatency] = useState(24);
  const [opticalStatus, setOpticalStatus] = useState("Standby");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLat, setTempLat] = useState("");
  const [tempLng, setTempLng] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const [customOrigin, setCustomOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [travelMode, setTravelMode] = useState("d");
  const [isRouting, setIsRouting] = useState(false);
  
  const [mapEmbedUrl, setMapEmbedUrl] = useState(`https://maps.google.com/maps?q=${location.lat},${location.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const pingInterval = setInterval(() => setLatency(Math.floor(Math.random() * 24) + 18), 3000);
    return () => clearInterval(pingInterval);
  }, []);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude.toString();
          const newLng = position.coords.longitude.toString();
          setLocation({ lat: newLat, lng: newLng });
          setGpsStatus("High Accuracy Locked");
          if (!destination) {
            setMapEmbedUrl(`https://maps.google.com/maps?q=${newLat},${newLng}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
          }
        },
        (error) => setGpsStatus("Location Access Denied")
      );
    }
  }, []);

  useEffect(() => {
    if (isCameraActive) setOpticalStatus("Active Feed Tracking");
    else if (file) setOpticalStatus("Payload Extracted");
    else setOpticalStatus("Standby / Calibrated");
  }, [isCameraActive, file]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } } });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setIsCameraActive(true);
      setFile(null);
      setPreviewUrl(null);
    } catch { alert("Camera access denied."); setIsCameraActive(false); }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            setFile(new File([blob], "camera_capture.jpg", { type: "image/jpeg" }));
            setPreviewUrl(URL.createObjectURL(blob));
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
      stopCamera();
    }
  };

  const clearSelection = () => { setFile(null); setPreviewUrl(null); setAiResult(null); };
  
  const saveManualLocation = () => { 
    if (tempLat && tempLng) { 
      setLocation({ lat: tempLat, lng: tempLng }); 
      setGpsStatus("Manual Override Active");
      if (!destination) {
        setMapEmbedUrl(`https://maps.google.com/maps?q=${tempLat},${tempLng}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
      }
    } 
    setIsEditingLocation(false); 
  };
  
  const deleteLog = (idToRemove: number) => { setRecentScans((prev: any) => prev.filter((log: any) => log.id !== idToRemove)); };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append("campus_image", file);
    formData.append("latitude", location.lat);
    formData.append("longitude", location.lng);
    
    try {
      const response = await fetch("/api/analyze", { method: "POST", body: formData });
      const data = await response.json();
      if (data.success) {
        setAiResult(data.ai_text);
        
        const now = new Date();
        setRecentScans((prev: any) => [{ 
          id: Date.now(), 
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          coords: `${parseFloat(location.lat).toFixed(4)}, ${parseFloat(location.lng).toFixed(4)}`, 
          summary: data.ai_text.substring(0, 80) + "...",
          fullText: data.ai_text 
        }, ...(prev || [])]);
        
      } else alert("Error: " + data.error);
    } catch { alert("Backend connection failed."); } finally { setIsAnalyzing(false); }
  };

  const calculateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if(!destination) return;
    setIsRouting(true);
    const startPoint = customOrigin.trim() !== "" ? customOrigin : `${location.lat},${location.lng}`;
    const realGoogleRouteUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(startPoint)}&daddr=${encodeURIComponent(destination)}&dirflg=${travelMode}&output=embed`;
    
    setTimeout(() => {
      setMapEmbedUrl(realGoogleRouteUrl);
      setIsRouting(false);
    }, 600);
  };

  const downloadCSV = () => {
    if (!recentScans || recentScans.length === 0) {
      alert("No data available to export.");
      return;
    }
    
    const headers = ["ID", "Date", "Time", "Coordinates", "Intelligence Summary"];
    const csvRows = [headers.join(",")];
    
    recentScans.forEach((log: any) => {
      const cleanSummary = `"${log.summary.replace(/"/g, '""')}"`;
      csvRows.push(`${log.id},${log.date},${log.time},"${log.coords}",${cleanSummary}`);
    });
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `WayFinder_Telemetry_${new Date().getTime()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="px-10 pb-10">
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-5xl">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">GPS Telemetry</p>
              {!isEditingLocation && (
                <button onClick={() => { setTempLat(location.lat); setTempLng(location.lng); setIsEditingLocation(true); }} className="text-emerald-500 hover:text-emerald-600 transition">
                  <Edit2 size={14} />
                </button>
              )}
            </div>
            {isEditingLocation ? (
              <div className="flex flex-col gap-2 mt-2">
                <div className="flex gap-2">
                  <input type="text" value={tempLat} onChange={(e) => setTempLat(e.target.value)} className="w-full text-sm border dark:border-slate-700 dark:bg-slate-800 rounded px-2 py-1 dark:text-white" placeholder="Lat" />
                  <input type="text" value={tempLng} onChange={(e) => setTempLng(e.target.value)} className="w-full text-sm border dark:border-slate-700 dark:bg-slate-800 rounded px-2 py-1 dark:text-white" placeholder="Lng" />
                </div>
                <button onClick={saveManualLocation} className="bg-emerald-500 text-white text-xs font-bold py-1 rounded flex items-center justify-center gap-1"><Check size={12} /> Save</button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{gpsStatus}</h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">{parseFloat(location.lat).toFixed(6)}, {parseFloat(location.lng).toFixed(6)}</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Optical Sensors</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{opticalStatus}</h3>
            <p className="text-xs text-slate-400 mt-1">{isCameraActive ? "Awaiting capture command" : "System ready for input"}</p>
          </div>
          <Aperture className={`text-blue-500 transition-all duration-1000 ${isCameraActive ? 'animate-spin' : ''}`} size={28} />
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">Network Uplink</p>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{latency}ms Latency</h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Secure link active
            </p>
          </div>
          <Radio className="text-purple-500" size={28} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl">
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Start Analysing...</h2>
            {!aiResult ? (
              <form onSubmit={handleAnalyze} className="flex flex-col gap-4">
                {!isCameraActive && !previewUrl && (
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={startCamera} className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500 transition group">
                      <Video size={36} className="text-slate-400 group-hover:text-emerald-500 mb-2" />
                      <span className="font-medium text-sm text-slate-600 dark:text-slate-300 group-hover:text-emerald-500">Live Camera</span>
                    </button>
                    <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-500 transition cursor-pointer group">
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                      <UploadCloud size={36} className="text-slate-400 group-hover:text-emerald-500 mb-2" />
                      <span className="font-medium text-sm text-slate-600 dark:text-slate-300 group-hover:text-emerald-500">Upload File</span>
                    </label>
                  </div>
                )}

                <div className={`relative rounded-xl overflow-hidden bg-black aspect-video items-center justify-center border border-slate-800 ${isCameraActive ? 'flex' : 'hidden'}`}>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover"></video>
                  <canvas ref={canvasRef} className="hidden"></canvas>
                  <div className="absolute bottom-4 flex gap-4">
                    <button type="button" onClick={stopCamera} className="bg-white/20 backdrop-blur text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/30 transition">Cancel</button>
                    <button type="button" onClick={capturePhoto} className="bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-emerald-600 transition flex items-center gap-2"><Camera size={16} /> Capture</button>
                  </div>
                </div>

                {previewUrl && (
                  <div className="relative border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <img src={previewUrl} className="max-h-64 rounded-lg shadow-sm" />
                    <button type="button" onClick={clearSelection} className="absolute top-4 right-4 bg-white dark:bg-slate-700 p-1.5 rounded-full shadow hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 transition"><X size={18}/></button>
                  </div>
                )}
                
                <button type="submit" disabled={isAnalyzing || !file} className="bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm mt-2">
                  {isAnalyzing ? "Processing Matrix Data..." : "Run AI Analysis"}
                </button>
              </form>
            ) : (
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 dark:text-white"><Eye className="text-emerald-500" /> WayFinder Analysis Output</h2>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 p-5 rounded-xl mb-4 text-sm text-emerald-900 dark:text-emerald-100 leading-relaxed [&>p>strong]:font-bold [&>p>strong]:text-emerald-950 dark:[&>p>strong]:text-white [&>p]:mb-2"><ReactMarkdown>{aiResult}</ReactMarkdown></div>
                <button type="button" onClick={clearSelection} className="w-full border border-slate-300 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-600 dark:text-slate-300 font-semibold py-2.5 px-6 rounded-xl transition text-sm">Clear Terminal Framework</button>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col transition-colors">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white"><Route size={20} className="text-emerald-500" />Live Map</h2>
              <span className="px-2 py-1 text-xs font-bold rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Maps API</span>
            </div>
            
            <div className="flex flex-col gap-6">
              <form onSubmit={calculateRoute} className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <button type="button" onClick={() => setTravelMode('d')} className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-colors border ${travelMode === 'd' ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}><Car size={20}/></button>
                  <button type="button" onClick={() => setTravelMode('b')} className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-colors border ${travelMode === 'b' ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}><Bike size={20}/></button>
                  <button type="button" onClick={() => setTravelMode('r')} className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-colors border ${travelMode === 'r' ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}><Bus size={20}/></button>
                  <button type="button" onClick={() => setTravelMode('w')} className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-colors border ${travelMode === 'w' ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}><Footprints size={20}/></button>
                </div>
                <div className="flex flex-col gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-emerald-500" />
                    <input type="text" placeholder="Current Location (GPS Default)" value={customOrigin} onChange={(e) => setCustomOrigin(e.target.value)} className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500 transition" />
                  </div>
                  <div className="flex items-center gap-3">
                    <Milestone size={18} className="text-blue-500" />
                    <input type="text" placeholder="Where do you want to go?" value={destination} onChange={(e) => setDestination(e.target.value)} className="flex-1 bg-transparent border-b border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-2 py-1.5 text-sm focus:outline-none focus:border-emerald-500 transition" />
                  </div>
                </div>
                <button type="submit" disabled={isRouting || !destination} className="bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-500 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-md">
                  {isRouting ? "Linking to Satellite..." : "Generate Optimal Route"}
                </button>
              </form>
              <div className="w-full h-96 bg-slate-200 dark:bg-slate-800 rounded-xl relative overflow-hidden border border-slate-300 dark:border-slate-700 shadow-inner">
                <iframe width="100%" height="100%" frameBorder="0" scrolling="no" src={mapEmbedUrl} className="absolute inset-0 w-full dark:invert dark:hue-rotate-180 dark:contrast-75 dark:opacity-90 transition-all duration-300" style={{ height: "calc(100% + 55px)" }}></iframe>
              </div>
            </div>
          </div>

        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col h-full transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-base font-semibold flex items-center gap-2 dark:text-white"><Clock size={18} className="text-slate-500" /> Active Operations Ledger</h2>
            
            <button onClick={downloadCSV} className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
              <Download size={12} /> CSV
            </button>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[520px]">
            {recentScans && recentScans.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2">
                <Database size={32} className="opacity-30" />
                <p className="text-xs">No entries recorded in current session.</p>
              </div>
            ) : (
              <div className="space-y-4 pr-2">
                {recentScans && recentScans.map((log: any) => (
                  <div key={log.id} className="p-3.5 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-xl flex flex-col gap-1.5 group transition hover:border-slate-300 dark:hover:border-slate-700">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                          <Navigation size={10} /> {log.date} at {log.time}
                        </span>
                        <span className="text-[10px] font-mono bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-semibold w-fit">{log.coords}</span>
                      </div>
                      <button onClick={() => deleteLog(log.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-500 transition opacity-0 group-hover:opacity-100 p-1" title="Delete Record"><Trash2 size={14} /></button>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-normal mt-1">{log.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}