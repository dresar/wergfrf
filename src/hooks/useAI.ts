import { useState } from 'react';
import { aiAPI } from '@/services/api';
import { toast } from 'sonner';

export const useAI = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateContent = async (topic: string, tone: string = 'professional', type: string = 'blog') => {
    setIsGenerating(true);
    try {
      const content = await aiAPI.write({ topic, tone, type });
      return content.content;
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate content');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const analyzeMessage = async (message: string, sender: string) => {
    setIsGenerating(true);
    try {
      const data = await aiAPI.analyzeMessage({ message, sender });
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Failed to analyze message');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const askCopilot = async (query: string, context: string = '') => {
    setIsGenerating(true);
    try {
      const response = await aiAPI.chat({ query, context });
      return response.response;
    } catch (error: any) {
      toast.error(error.message || 'Copilot failed to respond');
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizeSEO = async (content: string, keyword: string = '') => {
    setIsGenerating(true);
    try {
      const data = await aiAPI.seo({ content, keyword });
      return data;
    } catch (error: any) {
      toast.error(error.message || 'SEO optimization failed');
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
