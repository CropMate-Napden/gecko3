
import React from 'react';
import { HistoryItem } from '../types';

interface HistoryProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelectItem }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full">
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnostic History</h1>
          <p className="text-gray-500">Past prompts and analysis results.</p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No diagnostic history found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group cursor-pointer"
            >
              <div className="relative h-48">
                <img 
                  src={`data:image/jpeg;base64,${item.image}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={item.result.cropName} 
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                  item.result.healthStatus === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.result.healthStatus}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{item.result.cropName}</h3>
                  <span className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {item.result.healthStatus === 'Diseased' ? item.result.diseaseName : 'No disease detected.'}
                </p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-emerald-600 text-sm font-bold">
                  View Full Report
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
