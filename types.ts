
export interface AnalysisResult {
  cropName: string;
  healthStatus: 'Healthy' | 'Diseased' | 'Unknown';
  confidence: number;
  diseaseName?: string;
  symptoms?: string[];
  cause?: string;
  
  // New Advanced Fields
  visualEvidence?: string; // Text description of WHERE the issue is (e.g., "Yellowing on lower leaves")
  yieldImpact?: string; // e.g., "15% potential loss if untreated"
  treatmentOptions?: {
    name: string;
    type: 'Organic' | 'Chemical' | 'Cultural';
    estimatedPrice?: string; // e.g., "$15 - $20 per liter"
    instructions: string;
  }[];
  nextBestStep?: string; // Single actionable priority, e.g., "Spray Neem Oil immediately"
  
  recommendations: string[]; // Keeping for backward compatibility
  preventativeMeasures: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string;
  result: AnalysisResult;
  // Future: Add location data here
  location?: { lat: number; lng: number };
}

export interface HistoryAnalysisResult {
  overallSummary: string;
  identifiedPatterns: string[];
  recommendations: string[];
  predictedActions: string[];
}

export enum AppState {
  IDLE = 'idle',
  DASHBOARD = 'dashboard',
  HISTORY = 'history',
  RESOURCES = 'resources',
  CHAT = 'chat',
  CAPTURING = 'capturing',
  ANALYZING = 'analyzing',
  RESULT = 'result',
  ERROR = 'error'
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text?: string; inlineData?: { mimeType: string; data: string } }[];
}
