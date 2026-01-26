import { useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export const useAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async (topic: string, tone: string = 'professional', type: string = 'blog') => {
    setIsGenerating(true);
    try {
      const response = await api.post('/ai/write/', { topic, tone, type });
      return response.data.content;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to generate content');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeMessage = async (message: string, sender: string) => {
    setIsGenerating(true);
    try {
      const response = await api.post('/ai/analyze-message/', { message, sender });
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to analyze message');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const askCopilot = async (query: string, context: string = '') => {
    setIsGenerating(true);
    try {
      const response = await api.post('/ai/chat/', { query, context });
      return response.data.response;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Copilot failed to respond');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeSEO = async (content: string, keyword: string = '') => {
    setIsGenerating(true);
    try {
      const response = await api.post('/ai/seo/', { content, keyword });
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'SEO optimization failed');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateContent,
    analyzeMessage,
    askCopilot,
    optimizeSEO,
  };
};
