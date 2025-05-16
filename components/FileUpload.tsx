import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFileUpload } from '@/hooks/use-file-upload';
import { FileType } from '@/types';

export function FileUpload() {
  const { status, uploadFile } = useFileUpload();
  const [fileType, setFileType] = useState<FileType>('audio');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    if (acceptedFiles.length > 0) {
      try {
        console.log('Attempting to upload file:', {
          name: acceptedFiles[0].name,
          type: fileType,
          size: acceptedFiles[0].size
        });
        await uploadFile(acceptedFiles[0], fileType);
        console.log('File upload completed successfully');
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  }, [fileType, uploadFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: fileType === 'audio' 
      ? { 'audio/*': ['.wav', '.mp3', '.m4a', '.ogg'] }
      : { 'text/plain': ['.txt'] },
    maxFiles: 1,
  });

  console.log('FileUpload component state:', {
    fileType,
    status,
    isDragActive
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-4">
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => {
              console.log('Switching to audio type');
              setFileType('audio');
            }}
            className={`px-4 py-2 rounded-lg ${
              fileType === 'audio'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Audio
          </button>
          <button
            onClick={() => {
              console.log('Switching to text type');
              setFileType('text');
            }}
            className={`px-4 py-2 rounded-lg ${
              fileType === 'text'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Texto
          </button>
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-purple-600 bg-purple-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {status.isProcessing ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-2 bg-purple-200 rounded"></div>
            </div>
            <p className="text-gray-600">{status.message}</p>
          </div>
        ) : (
          <div>
            <p className="text-lg mb-2">
              {isDragActive
                ? 'Suelta el archivo aquí'
                : `Arrastra o selecciona un archivo ${
                    fileType === 'audio' ? 'de audio' : 'de texto'
                  }`}
            </p>
            <p className="text-sm text-gray-500">
              {fileType === 'audio'
                ? 'Formatos soportados: .wav, .mp3, .m4a, .ogg'
                : 'Formato soportado: .txt'}
            </p>
          </div>
        )}
      </div>

      {status.error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
          {status.error}
        </div>
      )}
    </div>
  );
} 