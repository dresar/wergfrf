import { api } from './api';

export const generateAIContent = async (prompt: string, systemPrompt: string = "You are a helpful admin assistant.", task: string = "chat") => {
  try {
    const response = await api.ai.generate({
      prompt: `${systemPrompt}\n\nUser: ${prompt}`,
      // provider: 'apprentice', // Removed to let backend use configured provider
      task: task
    });

    return response.content || response;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

export const generateProductDescription = async (productName: string, features: string[]) => {
  const prompt = `Generate a compelling SEO-friendly product description for "${productName}" with these features: ${features.join(', ')}. Include 5 SEO tags at the end.`;
  return generateAIContent(prompt, "You are an expert copywriter and SEO specialist.", "write");
};

export const chatWithAssistant = async (message: string, contextData: string) => {
  // Pass contextData (Page Info) to the AI
  const systemContext = contextData ? `[Current Page Context]\n${contextData}\n\n` : "";
  const fullMessage = `${systemContext}${message}`;
  
  return generateAIContent(fullMessage, "", "assistant");
};
