
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
    <div className="max-w-4xl mx-auto px-4 pb-20 pt-6">
      <div className="mb-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-square bg-gray-100">
            <img 
              src={`data:image/jpeg;base64,${image}`} 
              alt="Analyzed crop" 
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={onReset}
            className="mt-4 w-full py-3 border-2 border-emerald-600 text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors"
          >
            Scan New Plant
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-bold text-gray-900">{result.cropName}</h2>
            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${
              isHealthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {result.healthStatus}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-500 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Confidence: {(result.confidence * 100).toFixed(1)}%</span>
          </div>

          {!isHealthy && (
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-8 rounded-r-xl">
              <h3 className="text-lg font-bold text-orange-800 mb-1">Diagnosis: {result.diseaseName}</h3>
              <p className="text-orange-700 text-sm leading-relaxed">{result.cause}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mr-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </span>
                Recommendations
              </h4>
              <ul className="space-y-3">
                {result.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600">
                    <span className="text-emerald-500 mr-2 mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-2 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                </span>
                Preventative Measures
              </h4>
              <ul className="space-y-3">
                {result.preventativeMeasures.map((measure, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600">
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    {measure}
                  </li>
                ))}
              </ul>
            </section>
          </div>
          
          {!isHealthy && result.symptoms && result.symptoms.length > 0 && (
            <div className="mt-8 bg-gray-50 rounded-2xl p-6">
              <h4 className="font-bold text-gray-900 mb-3">Detected Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {result.symptoms.map((symptom, i) => (
                  <span key={i} className="bg-white px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-600 font-medium">
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
