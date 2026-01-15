
import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisViewProps {
  result: AnalysisResult;
  image: string;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ result, image, onReset }) => {
  const isHealthy = result.healthStatus === 'Healthy';

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-6">
      <div className="mb-8 flex flex-col md:flex-row gap-8">
        {/* Left Column: Image & Actions */}
        <div className="w-full md:w-1/3">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-700 aspect-square bg-gray-800 relative group">
            <img 
              src={`data:image/jpeg;base64,${image}`} 
              alt="Analyzed crop" 
              className="w-full h-full object-cover"
            />
            {/* AR Overlay Simulation */}
            {!isHealthy && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="border-2 border-red-500 rounded-lg p-2 bg-black/50 backdrop-blur-sm">
                  <p className="text-red-400 text-xs font-bold uppercase">Issue Detected</p>
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={onReset}
            className="mt-6 w-full py-4 border-2 border-emerald-600 text-emerald-400 font-bold rounded-2xl hover:bg-emerald-900/20 transition-all active:scale-95"
          >
            Scan New Plant
          </button>
        </div>

        {/* Right Column: Detailed Analysis */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-4xl font-extrabold text-white mb-1">{result.cropName}</h2>
              <div className="flex items-center space-x-2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">AI Confidence: {(result.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>
            <span className={`px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-wider shadow-lg ${
              isHealthy ? 'bg-green-900 text-green-400 border border-green-700' : 'bg-red-900 text-red-400 border border-red-700'
            }`}>
              {result.healthStatus}
            </span>
          </div>

          {/* Next Best Step (Priority Action) */}
          {result.nextBestStep && (
            <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-700/50 p-5 rounded-2xl mb-6 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Priority Action</h3>
              </div>
              <p className="text-white font-bold text-lg">{result.nextBestStep}</p>
            </div>
          )}

          {/* Diagnosis & Evidence */}
          {!isHealthy && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
                <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Diagnosis</h3>
                <p className="text-white font-bold text-lg mb-1">{result.diseaseName}</p>
                <p className="text-gray-400 text-sm">{result.cause}</p>
              </div>
              <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700">
                <h3 className="text-gray-400 text-xs font-bold uppercase mb-2">Visual Evidence</h3>
                <p className="text-gray-300 text-sm leading-relaxed italic">"{result.visualEvidence || "Symptoms detected on leaves."}"</p>
              </div>
            </div>
          )}

          {/* Yield Impact */}
          {!isHealthy && result.yieldImpact && (
             <div className="bg-orange-900/20 border border-orange-800 p-5 rounded-2xl mb-8 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-900/50 flex items-center justify-center text-orange-500 font-bold text-xl">!</div>
                <div>
                  <h3 className="text-orange-400 text-sm font-bold uppercase">Yield Impact Prediction</h3>
                  <p className="text-white font-medium">{result.yieldImpact}</p>
                </div>
             </div>
          )}

          {/* Treatment Options with Pricing */}
          {!isHealthy && result.treatmentOptions && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Treatment Options</h3>
              <div className="space-y-3">
                {result.treatmentOptions.map((option, i) => (
                  <div key={i} className="bg-gray-800 p-5 rounded-2xl border border-gray-700 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          option.type === 'Organic' ? 'bg-green-900 text-green-400' : 
                          option.type === 'Chemical' ? 'bg-purple-900 text-purple-400' : 'bg-blue-900 text-blue-400'
                        }`}>{option.type}</span>
                        <h4 className="text-white font-bold">{option.name}</h4>
                      </div>
                      <p className="text-gray-400 text-sm">{option.instructions}</p>
                    </div>
                    {option.estimatedPrice && (
                      <div className="text-right min-w-[100px]">
                        <p className="text-xs text-gray-500 uppercase font-bold">Est. Price</p>
                        <p className="text-emerald-400 font-bold text-lg">{option.estimatedPrice}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!isHealthy && result.symptoms && result.symptoms.length > 0 && (
            <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h4 className="font-bold text-white mb-3">Detected Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {result.symptoms.map((symptom, i) => (
                  <span key={i} className="bg-gray-700 px-3 py-1 rounded-full border border-gray-600 text-xs text-gray-300 font-medium">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
