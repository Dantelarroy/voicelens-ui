import { FileUploadResponse, ChatResponse, ReportResponse, FileType } from '@/types';

// Cambiamos la configuración de la URL base para soportar ngrok
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-ngrok-url.ngrok.io';

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
  console.log('Uploading file:', { name: file.name, type, size: file.size });
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);

  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    console.log('Upload response status:', response.status);
    const data = await handleResponse<FileUploadResponse>(response);
    console.log('Upload response data:', data);
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function queryContent(question: string): Promise<ChatResponse> {
  console.log('Querying content:', question);
  
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    console.log('Query response status:', response.status);
    const data = await handleResponse<ChatResponse>(response);
    console.log('Query response data:', data);
    return data;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

export async function generateReport(): Promise<ReportResponse> {
  console.log('Generating report');
  
  try {
    const response = await fetch(`${API_BASE_URL}/report`, {
      method: 'GET',
    });

    console.log('Report response status:', response.status);
    const data = await handleResponse<ReportResponse>(response);
    console.log('Report response data:', data);
    return data;
  } catch (error) {
    console.error('Report error:', error);
    throw error;
  }
}

export async function regenerateReport(): Promise<ReportResponse> {
  console.log('Regenerating report');
  
  try {
    const response = await fetch(`${API_BASE_URL}/regenerate-report`, {
      method: 'POST',
    });

    console.log('Regenerate report response status:', response.status);
    const data = await handleResponse<ReportResponse>(response);
    console.log('Regenerate report response data:', data);
    return data;
  } catch (error) {
    console.error('Regenerate report error:', error);
    throw error;
  }
} 