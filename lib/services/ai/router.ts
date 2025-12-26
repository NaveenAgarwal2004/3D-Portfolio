import { GeminiProvider } from './providers/gemini';
import { GrokProvider } from './providers/grok';
import { RateLimiter } from './rateLimiter';

type AIProvider = GeminiProvider | GrokProvider;

interface AIResponse {
  response: string;
  provider: string;
  fallbackUsed: boolean;
}

export class AIRouter {
  private providers: AIProvider[] = [];
  private rateLimiter: RateLimiter;
  
  constructor() {
    this.rateLimiter = new RateLimiter();
    
    if (process.env.GEMINI_API_KEY) {
      this.providers.push(new GeminiProvider(process.env.GEMINI_API_KEY));
    }
    
    if (process.env.GROK_API_KEY) {
      this.providers.push(new GrokProvider(process.env.GROK_API_KEY));
    }
    
    if (this.providers.length === 0) {
      console.warn('⚠️ No AI providers configured. AI Crystal will return mock responses.');
    } else {
      console.log(`✅ AI Router initialized with: ${this.providers.map(p => p.getName()).join(', ')}`);
    }
  }
  
  async generate(prompt: string, context?: string[]): Promise<AIResponse> {
    // Mock response if no providers
    if (this.providers.length === 0) {
      return {
        response: 'I am the Sentient Crystal, currently in simulation mode. Configure your AI providers to enable full capabilities.',
        provider: 'mock',
        fallbackUsed: false,
      };
    }
    
    let lastError: Error | null = null;
    
    for (const provider of this.providers) {
      const providerName = provider.getName();
      
      if (!this.rateLimiter.canMakeRequest(providerName)) {
        const reset = this.rateLimiter.getTimeUntilReset(providerName);
        console.log(`⏰ ${providerName} rate limited. Reset in ${Math.ceil(reset.minute / 1000)}s`);
        continue;
      }
      
      try {
        console.log(`🤖 Attempting generation with ${providerName}...`);
        
        const response = await provider.generate(prompt, context);
        this.rateLimiter.recordRequest(providerName);
        
        return {
          response,
          provider: providerName,
          fallbackUsed: this.providers.indexOf(provider) > 0,
        };
      } catch (error: any) {
        lastError = error;
        
        if (error.message === 'RATE_LIMIT_EXCEEDED') {
          console.log(`⚠️ ${providerName} hit rate limit, trying next...`);
          continue;
        }
        
        console.error(`❌ ${providerName} error:`, error.message);
        continue;
      }
    }
    
    throw new Error(`All AI providers failed. Last error: ${lastError?.message || 'Unknown'}`);
  }
  
  getAvailableProviders(): string[] {
    return this.providers.map(p => p.getName());
  }
  
  getProviderStatus(): Record<string, boolean> {
    const status: Record<string, boolean> = {};
    for (const provider of this.providers) {
      const name = provider.getName();
      status[name] = this.rateLimiter.canMakeRequest(name);
    }
    return status;
  }
}

export const aiRouter = new AIRouter();