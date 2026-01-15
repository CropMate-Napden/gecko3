
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import CameraView from './components/CameraView';
import AnalysisView from './components/AnalysisView';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Resources from './components/Resources';
import Chat from './components/Chat';
import Auth from './components/Auth';
import { analyzeCropImage } from './services/geminiService';
import { AnalysisResult, AppState, HistoryItem } from './types';
import { supabase } from './services/supabaseService';
import { Session } from '@supabase/supabase-js';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const getProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data?.username || null;
  }, []);

  useEffect(() => {
    const handleAuthStateChange = async (session: Session | null) => {
      setSession(session);
      if (session?.user?.id) {
        const userUsername = await getProfile(session.user.id);
        setUsername(userUsername);
      } else {
        setUsername(null);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      handleAuthStateChange(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthStateChange(session);
    });

    return () => subscription.unsubscribe();
  }, [getProfile]);

  const fetchHistoryFromSupabase = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching history:', error);
      return [];
    }
    return data.map(item => ({
      id: item.id,
      timestamp: new Date(item.timestamp).getTime(),
      image: item.image,
      result: item.analysis_result as AnalysisResult,
    }));
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      fetchHistoryFromSupabase(session.user.id).then(setHistory);
    } else {
      setHistory([]);
    }
  }, [session, fetchHistoryFromSupabase]);

  const saveToHistory = async (image: string, result: AnalysisResult) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      image,
      result
    };

    if (session?.user?.id) {
      const { data, error } = await supabase
        .from('history')
        .insert({
          user_id: session.user.id,
          image: newItem.image,
          analysis_result: newItem.result,
        })
        .select();

      if (error) {
        console.error('Error saving history to Supabase:', error);
      } else if (data && data.length > 0) {
        const savedItem = {
          id: data[0].id,
          timestamp: new Date(data[0].timestamp).getTime(),
          image: data[0].image,
          result: data[0].analysis_result as AnalysisResult,
        };
        setHistory(prevHistory => [savedItem, ...prevHistory]);
      }
    } else {
      const updatedHistory = [newItem, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('agrovision_history', JSON.stringify(updatedHistory));
    }
  };

  const handleCapture = useCallback(async (base64: string) => {
    setCapturedImage(base64);
    setState(AppState.ANALYZING);
    setError(null);

    try {
      const result = await analyzeCropImage(base64);
      setAnalysis(result);
      setState(AppState.RESULT);
      await saveToHistory(base64, result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze image. Please try again.");
      setState(AppState.ERROR);
    }
  }, [session, history]);

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      setSession(null);
      setUsername(null);
      setHistory([]);
      setState(AppState.IDLE);
    }
  };

  const renderContent = () => {
    if (!session) {
      return <Auth />;
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial="initial"
          animate="in"
          exit="out"
          variants={pageVariants}
          transition={pageTransition}
          className="w-full h-full flex items-center justify-center"
        >
          {(() => {
            switch (state) {
              case AppState.IDLE:
                return (
                  <div className="max-w-4xl w-full text-center py-12 px-6">
                    <div className="inline-block mb-4 px-4 py-1.5 bg-emerald-900/30 border border-emerald-800 rounded-full text-emerald-400 text-sm font-semibold tracking-wide uppercase shadow-sm">
                      AI-Powered Agriculture
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                      Your Personal <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Crop Assistant</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                      Identify plant diseases instantly with AI. Take a photo or upload an image to receive detailed health reports and agronomist-grade recommendations.
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                      <button
                        onClick={() => setState(AppState.CAPTURING)}
                        className="group w-full md:w-auto flex items-center justify-center space-x-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-emerald-900/20 hover:-translate-y-1 hover:shadow-2xl active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Take Live Photo</span>
                      </button>

                      <label className="group w-full md:w-auto flex items-center justify-center space-x-3 bg-gray-800 border-2 border-gray-700 text-emerald-400 hover:bg-gray-700 hover:border-gray-600 px-8 py-5 rounded-2xl font-bold text-lg cursor-pointer transition-all shadow-lg shadow-gray-900/20 hover:-translate-y-1 active:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Upload Image</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                      </label>
                    </div>

                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                      {[
                        { title: "Crop ID", desc: "Recognize hundreds of crop varieties instantly.", icon: "🌱", color: "bg-green-900/30 text-green-300" },
                        { title: "Pest Detection", desc: "Early warning signs for common infestations.", icon: "🐛", color: "bg-orange-900/30 text-orange-300" },
                        { title: "Expert Care", desc: "Personalized nutrient and irrigation advice.", icon: "💧", color: "bg-blue-900/30 text-blue-300" }
                      ].map((feature, i) => (
                        <div key={i} className="group bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-700 hover:shadow-xl hover:shadow-emerald-900/20 hover:border-emerald-800 transition-all duration-300 hover:-translate-y-1">
                          <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform group-hover:scale-110`}>{feature.icon}</div>
                          <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                          <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              case AppState.DASHBOARD:
                return <Dashboard history={history} onNavigate={setState} onSelectHistory={showHistoryDetail} username={username} />;
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
                  <div className="text-center">
                    <div className="relative w-64 h-64 mx-auto mb-10">
                      <div className="absolute inset-0 border-4 border-emerald-800 rounded-3xl"></div>
                      <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 rounded-full animate-[scan_2s_infinite] shadow-[0_0_20px_rgba(16,185,129,0.5)]"></div>
                      {capturedImage && (
                        <img
                          src={`data:image/jpeg;base64,${capturedImage}`}
                          className="w-full h-full object-cover rounded-3xl grayscale opacity-50 blur-sm"
                          alt="Scanning"
                        />
                      )}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3">Analyzing Samples...</h2>
                    <p className="text-gray-300 text-lg">Consulting agricultural database & expert pathology models.</p>
                  </div>
                );
              case AppState.RESULT:
                return analysis && capturedImage ? <AnalysisView result={analysis} image={capturedImage} onReset={reset} /> : null;
              case AppState.ERROR:
                return (
                  <div className="max-w-md w-full bg-gray-800 p-10 rounded-3xl shadow-2xl border border-red-800 text-center">
                    <div className="w-20 h-20 bg-red-900/30 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Analysis Failed</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">{error}</p>
                    <button
                      onClick={reset}
                      className="w-full py-4 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl active:scale-95"
                    >
                      Try Again
                    </button>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 font-sans text-gray-200 selection:bg-emerald-900 selection:text-emerald-100 transition-colors duration-300">
      {session && <Header currentTab={state} onNavigate={setState} onLogout={handleLogout} />}

      <main className="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-7xl mx-auto pt-24">
        {renderContent()}
      </main>

      <footer className="py-8 border-t border-gray-800 bg-gray-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2024 CropMate AI. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Powered by <span className="font-semibold text-emerald-400">Gemini AI</span> • Built for Modern Agriculture
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default App;
