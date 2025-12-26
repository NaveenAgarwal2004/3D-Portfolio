import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiProvider {
  private client: GoogleGenerativeAI;
  private model = 'gemini-2.0-flash-exp';
  
  constructor(apiKey: string) {
    this.client = new GoogleGenerativeAI(apiKey);
  }
  
  async generate(prompt: string, context?: string[]): Promise<string> {
    try {
      const model = this.client.getGenerativeModel({ model: this.model });
      
      const fullPrompt = context
        ? `${prompt}\n\nContext:\n${context.join('\n')}`
        : prompt;
      
      const result = await model.generateContent(fullPrompt);
      return result.response.text();
    } catch (error: any) {
      if (error.message?.includes('429') || error.message?.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      throw error;
    }
  }
  
  getName(): string {
    return 'gemini';
  }
}