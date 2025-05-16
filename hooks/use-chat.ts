import { useState } from 'react';
import { queryContent } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (question: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Add user message
      const userMessage: Message = {
        role: 'user',
        content: question,
      };
      setMessages(prev => [...prev, userMessage]);

      // Get response from API
      const response = await queryContent(question);

      if (response.error) {
        throw new Error(response.error);
      }

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.answer,
      };
      setMessages(prev => [...prev, assistantMessage]);

      return response.answer;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
} 