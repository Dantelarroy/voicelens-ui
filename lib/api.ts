import { FileUploadResponse, ChatResponse, ReportResponse, FileType } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An unknown error occurred' }));
    throw new ApiError(response.status, error.detail || 'Request failed');
  }
  return response.json();
}

export async function uploadFile(file: File, type: FileType): Promise<FileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  return handleResponse<FileUploadResponse>(response);
}

export async function queryContent(question: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  return handleResponse<ChatResponse>(response);
}

export async function generateReport(): Promise<ReportResponse> {
  const response = await fetch(`${API_BASE_URL}/report`, {
    method: 'GET',
  });

  return handleResponse<ReportResponse>(response);
}

export async function regenerateReport(): Promise<ReportResponse> {
  const response = await fetch(`${API_BASE_URL}/regenerate-report`, {
    method: 'POST',
  });

  return handleResponse<ReportResponse>(response);
} 