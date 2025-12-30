
import React from 'react';
import { HistoryItem, AppState } from '../types';

interface DashboardProps {
  history: HistoryItem[];
  onNavigate: (state: AppState) => void;
  onSelectHistory: (item: HistoryItem) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ history, onNavigate, onSelectHistory }) => {
  const stats = {
    totalScans: history.length,
    healthyCount: history.filter(h => h.result.healthStatus === 'Healthy').length,
    diseaseCount: history.filter(h => h.result.healthStatus === 'Diseased').length,
  };

  const recentScans = history.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 w-full">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back, Farmer</h1>
        <p className="text-gray-500">Here's an overview of your crop diagnostic activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Total Scans</p>
          <p className="text-4xl font-bold text-gray-900">{stats.totalScans}</p>
          <div className="mt-4 h-1 bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Healthy Crops</p>
          <p className="text-4xl font-bold text-emerald-600">{stats.healthyCount}</p>
          <div className="mt-4 h-1 bg-emerald-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${(stats.healthyCount / stats.totalScans || 0) * 100}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-1">Diseases Detected</p>
          <p className="text-4xl font-bold text-orange-600">{stats.diseaseCount}</p>
          <div className="mt-4 h-1 bg-orange-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500" style={{ width: `${(stats.diseaseCount / stats.totalScans || 0) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Scans</h2>
            <button onClick={() => onNavigate(AppState.HISTORY)} className="text-emerald-600 font-semibold text-sm hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentScans.length > 0 ? (
              recentScans.map((item) => (
                <div 
                  key={item.id} 
                  onClick={() => onSelectHistory(item)}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center space-x-4 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <img src={`data:image/jpeg;base64,${item.image}`} className="w-16 h-16 rounded-xl object-cover" alt={item.result.cropName} />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{item.result.cropName}</h3>
                    <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.result.healthStatus === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {item.result.healthStatus}
                  </span>
                </div>
              ))
            ) : (
              <div className="bg-emerald-50 rounded-2xl p-12 text-center border-2 border-dashed border-emerald-100">
                <p className="text-emerald-600 font-medium">No scans yet. Start your first analysis!</p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Agro Insights</h2>
          <div className="bg-emerald-900 rounded-2xl p-6 text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-2">Sustainable Farming</h3>
              <p className="text-emerald-100 text-sm leading-relaxed mb-4">
                Did you know that crop rotation can reduce soil-borne diseases by up to 60%?
              </p>
              <button onClick={() => onNavigate(AppState.RESOURCES)} className="bg-white text-emerald-900 px-4 py-2 rounded-lg text-xs font-bold">Learn More</button>
            </div>
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-emerald-800 rounded-full opacity-50"></div>
          </div>
          
          <div className="mt-6 bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Recommended Actions</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></div>
                <p className="text-sm text-gray-600">Check soil moisture levels for the Maize crops.</p>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5"></div>
                <p className="text-sm text-gray-600">Apply organic fungicide to affected Potato plants.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
