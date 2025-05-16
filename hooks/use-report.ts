import { useState } from 'react';
import { generateReport, regenerateReport } from '@/lib/api';

export function useReport() {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await generateReport();

      if (response.error) {
        throw new Error(response.error);
      }

      setReport(response.report);
      return response.report;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate report';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const regenerate = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await regenerateReport();

      if (response.error) {
        throw new Error(response.error);
      }

      setReport(response.report);
      return response.report;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to regenerate report';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearReport = () => {
    setReport(null);
    setError(null);
  };

  return {
    report,
    isLoading,
    error,
    generate,
    regenerate,
    clearReport,
  };
} 