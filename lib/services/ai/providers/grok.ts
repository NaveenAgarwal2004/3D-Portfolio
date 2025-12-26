import axios from 'axios';

export class GrokProvider {
  private apiKey: string;
  private apiUrl = 'https://api.x.ai/v1';
  private model = 'grok-beta';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async generate(prompt: string, context?: string[]): Promise<string> {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are the Sentient Crystal AI assistant for the Midnight Observatory portfolio.',
        },
        {
          role: 'user',
          content: context
            ? `${prompt}\n\nContext:\n${context.join('\n')}`
            : prompt,
        },
      ];
      
      const response = await axios.post(
        `${this.apiUrl}/chat/completions`,
        {
          model: this.model,
          messages,
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new Error('RATE_LIMIT_EXCEEDED');
      }
      throw error;
    }
  }
  
  getName(): string {
    return 'grok';
  }
}