
export interface AnalysisResult {
  cropName: string;
  healthStatus: 'Healthy' | 'Diseased' | 'Unknown';
  confidence: number;
  diseaseName?: string;
  symptoms?: string[];
  cause?: string;
  recommendations: string[];
  preventativeMeasures: string[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  image: string;
  result: AnalysisResult;
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
