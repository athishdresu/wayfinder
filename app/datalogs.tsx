"use client";
import { useState } from "react";
import { Database, Trash2, Download, History, X, MapPin, Clock } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function DataLogs({ logs, setRecentScans }: any) {
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const downloadCSV = () => {
    if (!logs || logs.length === 0) {
      alert("No data available to export.");
      return;
    }
    
    const headers = ["ID", "Date", "Time", "Coordinates", "Full Intelligence Report"];
    const csvRows = [headers.join(",")];
    
    logs.forEach((log: any) => {
      const cleanText = `"${(log.fullText || log.summary).replace(/"/g, '""')}"`;
      csvRows.push(`${log.id},${log.date || "N/A"},${log.time},"${log.coords}",${cleanText}`);
    });
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `WayFinder_Full_Database_${new Date().getTime()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setRecentScans(logs.filter((l: any) => l.id !== id));
  };

  return (
    <div className="px-10 pb-10 max-w-5xl relative">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-300">
        
        {/* UPDATED: Mobile Responsive Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 dark:bg-slate-800/50">
          <h2 className="text-lg font-semibold flex items-center gap-2 dark:text-white shrink-0">
            <Database size={20} className="text-emerald-500" /> Telemetry Database
          </h2>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <button onClick={() => setRecentScans([])} className="text-sm font-semibold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition whitespace-nowrap">
              Clear Database
            </button>
            <button onClick={downloadCSV} className="bg-slate-900 dark:bg-emerald-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-500 transition flex items-center gap-2 shadow-sm whitespace-nowrap">
              <Download size={14} /> Export All to CSV
            </button>
          </div>
        </div>
        
        <div className="p-0">
          {!logs || logs.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
              <History size={48} className="opacity-20" />
              <p>No historical data found in the database.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <th className="p-4 font-semibold">Date & Time</th>
                    <th className="p-4 font-semibold">Coordinates</th>
                    <th className="p-4 font-semibold w-1/2">Intelligence Summary</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800/50">
                  {logs.map((log: any) => (
                    <tr 
                      key={log.id} 
                      onClick={() => setSelectedLog(log)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                    >
                      <td className="p-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                        <div className="flex flex-col">
                          <span>{log.date || "Today"}</span>
                          <span className="text-xs text-slate-400">{log.time}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap font-mono text-xs">{log.coords}</td>
                      <td className="p-4"><p className="line-clamp-2 leading-relaxed">{log.summary}</p></td>
                      <td className="p-4 text-right">
                        <button onClick={(e) => handleDelete(e, log.id)} className="text-slate-400 hover:text-red-500 transition p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
              <h2 className="text-xl font-bold dark:text-white">Intelligence Report</h2>
              <button onClick={() => setSelectedLog(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6 overflow-y-auto">
              <div className="flex gap-6 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <Clock size={16} className="text-emerald-500" />
                  <span className="font-semibold">{selectedLog.date} at {selectedLog.time}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin size={16} className="text-blue-500" />
                  <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{selectedLog.coords}</span>
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed [&>p>strong]:text-slate-900 dark:[&>p>strong]:text-white">
                <ReactMarkdown>{selectedLog.fullText || selectedLog.summary}</ReactMarkdown>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}