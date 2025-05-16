export type FileType = 'audio' | 'text';

export interface FileUploadResponse {
  success: boolean;
  message: string;
  transcription?: string;
  vectorstoreId?: string;
  theme?: string;
}

export interface ProcessingStatus {
  isProcessing: boolean;
  step?: 'transcribing' | 'chunking' | 'embedding' | 'theme_detection';
  message?: string;
  error?: string;
}

export interface ChatResponse {
  answer: string;
  error?: string;
}

export interface ReportResponse {
  report: string;
  error?: string;
}

export interface Theme {
  name: string;
  confidence: number;
}

export interface ProcessedFile {
  id: string;
  name: string;
  type: FileType;
  theme?: Theme;
  timestamp: number;
} 