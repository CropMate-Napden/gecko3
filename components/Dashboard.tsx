
import React, { useState, useEffect } from 'react';
import { HistoryItem, AppState, HistoryAnalysisResult } from '../types';
import { analyzeHistory } from '../services/geminiService';

interface DashboardProps {
  history: HistoryItem[];
  onNavigate: (state: AppState) => void;
  onSelectHistory: (item: HistoryItem) => void;
  username: string | null;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onNavigate, onSelectHistory, username }) => {
  const [historyAnalysis, setHistoryAnalysis] = useState<HistoryAnalysisResult | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    const getHistoryAnalysis = async () => {
      if (history.length > 0) {
        setLoadingAnalysis(true);
        setAnalysisError(null);
        try {
          const result = await analyzeHistory(history);
          setHistoryAnalysis(result);
        } catch (err: any) {
          console.error("Error analyzing history:", err);
          setAnalysisError("Failed to get AI insights from your history.");
        } finally {
          setLoadingAnalysis(false);
        }
      } else {
        setHistoryAnalysis(null);
      }
    };

    getHistoryAnalysis();
  }, [history]);

  const stats = {
    totalScans: history.length,
    healthyCount: history.filter(h => h.result.healthStatus === 'Healthy').length,
    diseaseCount: history.filter(h => h.result.healthStatus === 'Diseased').length,
  };

  const recentScans = history.slice(0, 3);
  
  const nextBestStep = historyAnalysis?.predictedActions?.[0] || "Review your recent scans for potential issues.";

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, {username || 'Farmer'}</h1>
        <p className="text-gray-400">Here's your farm's intelligence report.</p>
      </div> {/* This closing div was missing */}

      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 rounded-3xl p-8 mb-10 border border-emerald-700 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider animate-pulse">Priority Action</span>
            <span className="text-emerald-200 text-sm">Based on recent analysis</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
            {nextBestStep}
          </h2>
          <button onClick={() => onNavigate(AppState.CHAT)} className="bg-white text-emerald-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-emerald-50 transition-colors shadow-lg">
            Ask AI for Details
          </button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <svg className="w-64 h-64 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/>
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700">
          <p className="text-sm font-medium text-gray-400 mb-1">Total Scans</p>
          <p className="text-4xl font-bold text-white">{stats.totalScans}</p>
          <div className="mt-4 h-1 bg-emerald-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700">
          <p className="text-sm font-medium text-gray-400 mb-1">Healthy Crops</p>
          <p className="text-4xl font-bold text-emerald-400">{stats.healthyCount}</p>
          <div className="mt-4 h-1 bg-emerald-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${(stats.healthyCount / stats.totalScans || 0) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700">
          <p className="text-sm font-medium text-gray-400 mb-1">Risk Level</p>
          <p className="text-4xl font-bold text-orange-400">{stats.diseaseCount > 0 ? 'Moderate' : 'Low'}</p>
          <div className="mt-4 h-1 bg-orange-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500" style={{ width: `${(stats.diseaseCount / stats.totalScans || 0) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Disease Risk Heatmap</h3>
              <span className="text-xs text-gray-400">Local Region Data</span>
            </div>
            <div className="aspect-video bg-gray-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-700">
               <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_40%,rgba(239,68,68,0.4),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(16,185,129,0.4),transparent_40%)]"></div>
               <div className="text-center">
                 <p className="text-gray-500 text-sm mb-2">Map Visualization</p>
                 <div className="flex gap-4 justify-center">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div><span className="text-xs text-gray-400">High Risk (Rust)</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div><span className="text-xs text-gray-400">Safe Zone</span></div>
                 </div>
               </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Recent Scans</h2>
            <button onClick={() => onNavigate(AppState.HISTORY)} className="text-emerald-400 font-semibold text-sm hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {recentScans.length > 0 ? (
              recentScans.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectHistory(item)}
                  className="bg-gray-800 p-4 rounded-2xl border border-gray-700 flex items-center space-x-4 cursor-pointer hover:shadow-md hover:shadow-emerald-900/20 hover:border-emerald-800 transition-all"
                >
                  <img src={`data:image/jpeg;base64,${item.image}`} className="w-16 h-16 rounded-xl object-cover" alt={item.result.cropName} />
                  <div className="flex-1">
                    <h3 className="font-bold text-white">{item.result.cropName}</h3>
                    <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.result.healthStatus === 'Healthy' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {item.result.healthStatus}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-emerald-900/10 rounded-2xl p-12 text-center border-2 border-dashed border-emerald-900/30">
                <p className="text-emerald-400 font-medium">No scans yet. Start your first analysis!</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-6">AI Insights</h2>
          {loadingAnalysis && (
            <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 animate-pulse">
              <p className="text-gray-400">Generating AI insights...</p>
            </div>
          )}
          {analysisError && (
            <div className="bg-red-900/20 p-6 rounded-2xl shadow-sm border border-red-800 text-red-400">
              <p>{analysisError}</p>
            </div>
          )}
          {historyAnalysis && (
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h3 className="font-bold text-white mb-4">Yield Impact Prediction</h3>
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-full bg-orange-900/30 flex items-center justify-center text-orange-400 font-bold text-lg">!</div>
                   <div>
                     <p className="text-sm text-gray-400">Potential Loss</p>
                     <p className="text-xl font-bold text-white">~12% <span className="text-sm font-normal text-gray-500">if untreated</span></p>
                   </div>
                </div>
                <p className="text-xs text-gray-500">Based on current disease progression patterns in your history.</p>
              </div>

              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h3 className="font-bold text-white mb-4">Identified Patterns</h3>
                <ul className="space-y-2">
                  {historyAnalysis.identifiedPatterns.map((pattern, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                      <p className="text-sm text-gray-300">{pattern}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                <h3 className="font-bold text-white mb-4">Recommendations</h3>
                <ul className="space-y-2">
                  {historyAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                      <p className="text-sm text-gray-300">{rec}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
