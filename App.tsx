
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import CameraView from './components/CameraView';
import AnalysisView from './components/AnalysisView';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Resources from './components/Resources';
import Chat from './components/Chat';
import { analyzeCropImage } from './services/geminiService';
import { AnalysisResult, AppState, HistoryItem } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from local storage
  useEffect(() => {
    const stored = localStorage.getItem('agrovision_history');
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveToHistory = (image: string, result: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      image,
      result
    };
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem('agrovision_history', JSON.stringify(updatedHistory));
  };

  const handleCapture = useCallback(async (base64: string) => {
    setCapturedImage(base64);
    setState(AppState.ANALYZING);
    setError(null);

    try {
      const result = await analyzeCropImage(base64);
      setAnalysis(result);
      setState(AppState.RESULT);
      saveToHistory(base64, result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze image. Please try again.");
      setState(AppState.ERROR);
    }
  }, [history]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        handleCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setState(AppState.IDLE);
    setCapturedImage(null);
    setAnalysis(null);
    setError(null);
  };

  const showHistoryDetail = (item: HistoryItem) => {
    setCapturedImage(item.image);
    setAnalysis(item.result);
    setState(AppState.RESULT);
  };

  const renderContent = () => {
    switch (state) {
      case AppState.IDLE:
        return (
          <div className="max-w-4xl w-full text-center py-12 px-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
              Precision Crop <span className="text-emerald-600">Diagnostics</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Identify plant diseases instantly with AI. Take a photo or upload an image to receive detailed health reports and agronomist-grade recommendations.
            </p>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <button 
                onClick={() => setState(AppState.CAPTURING)}
                className="group w-full md:w-auto flex items-center justify-center space-x-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-100 hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Take Live Photo</span>
              </button>

              <label className="group w-full md:w-auto flex items-center justify-center space-x-3 bg-white border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-5 rounded-2xl font-bold text-lg cursor-pointer transition-all shadow-lg hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Upload Image</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {[
                { title: "Crop ID", desc: "Recognize hundreds of crop varieties instantly.", icon: "🌱" },
                { title: "Pest Detection", desc: "Early warning signs for common infestations.", icon: "🐛" },
                { title: "Expert Care", desc: "Personalized nutrient and irrigation advice.", icon: "💧" }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case AppState.DASHBOARD:
        return <Dashboard history={history} onNavigate={setState} onSelectHistory={showHistoryDetail} />;
      case AppState.HISTORY:
        return <History history={history} onSelectItem={showHistoryDetail} />;
      case AppState.RESOURCES:
        return <Resources />;
      case AppState.CHAT:
        return <Chat />;
      case AppState.CAPTURING:
        return <CameraView onCapture={handleCapture} onCancel={() => setState(AppState.IDLE)} />;
      case AppState.ANALYZING:
        return (
          <div className="text-center animate-pulse">
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-emerald-200 rounded-3xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 rounded-full animate-[scan_2s_infinite]"></div>
              {capturedImage && (
                <img 
                  src={`data:image/jpeg;base64,${capturedImage}`} 
                  className="w-full h-full object-cover rounded-3xl grayscale opacity-50" 
                  alt="Scanning" 
                />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Samples...</h2>
            <p className="text-gray-500">Consulting agricultural database & expert pathology models.</p>
          </div>
        );
      case AppState.RESULT:
        return analysis && capturedImage ? <AnalysisView result={analysis} image={capturedImage} onReset={reset} /> : null;
      case AppState.ERROR:
        return (
          <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl border border-red-100 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Analysis Failed</h2>
            <p className="text-gray-500 mb-8">{error}</p>
            <button 
              onClick={reset}
              className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Header currentTab={state} onNavigate={setState} />

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {renderContent()}
      </main>

      <footer className="py-8 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-400">
          Powered by Gemini 3 Pro & Flash • Built for Modern Agriculture
        </div>
      </footer>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default App;
