'use client'

import { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { useChat } from '@/hooks/use-chat';
import { useReport } from '@/hooks/use-report';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'report' | 'chat'>('report');
  const { messages, isLoading: isChatLoading, error: chatError, sendMessage } = useChat();
  const { report, isLoading: isReportLoading, error: reportError, generate: generateReport } = useReport();

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-purple-600">Voicelens</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FileUpload />

        <div className="mt-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('report')}
                className={`${
                  activeTab === 'report'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Informe
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`${
                  activeTab === 'chat'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Chat
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'report' ? (
              <div className="space-y-4">
                <button
                  onClick={generateReport}
                  disabled={isReportLoading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {isReportLoading ? 'Generando...' : 'Generar Informe'}
                </button>
                {reportError && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {reportError}
                  </div>
                )}
                {report && (
                  <div className="p-6 bg-white rounded-lg shadow">
                    <pre className="whitespace-pre-wrap">{report}</pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-purple-50 ml-auto'
                          : 'bg-white mr-auto'
                      } max-w-[80%]`}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
                {chatError && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                    {chatError}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Escribe tu pregunta..."
                    className="flex-1 p-2 border rounded-lg"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        sendMessage(input.value);
                        input.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input');
                      if (input && input.value) {
                        sendMessage(input.value);
                        input.value = '';
                      }
                    }}
                    disabled={isChatLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {isChatLoading ? 'Enviando...' : 'Enviar'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
