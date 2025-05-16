import { useState } from 'react';
import { uploadFile } from '@/lib/api';
import { FileType, ProcessingStatus, ProcessedFile } from '@/types';

export function useFileUpload() {
  const [status, setStatus] = useState<ProcessingStatus>({
    isProcessing: false,
  });
  const [currentFile, setCurrentFile] = useState<ProcessedFile | null>(null);

  const handleFileUpload = async (file: File, type: FileType) => {
    try {
      setStatus({
        isProcessing: true,
        step: 'transcribing',
        message: type === 'audio' ? 'Transcribing audio...' : 'Processing text...',
      });

      const response = await uploadFile(file, type);

      if (!response.success) {
        throw new Error(response.message);
      }

      const processedFile: ProcessedFile = {
        id: response.vectorstoreId || Date.now().toString(),
        name: file.name,
        type,
        theme: response.theme ? {
          name: response.theme,
          confidence: 1,
        } : undefined,
        timestamp: Date.now(),
      };

      setCurrentFile(processedFile);
      setStatus({
        isProcessing: false,
      });

      return processedFile;
    } catch (error) {
      setStatus({
        isProcessing: false,
        error: error instanceof Error ? error.message : 'Failed to process file',
      });
      throw error;
    }
  };

  return {
    status,
    currentFile,
    uploadFile: handleFileUpload,
  };
} 