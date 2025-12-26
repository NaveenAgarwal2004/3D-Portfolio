interface RateLimitConfig {
  requestsPerMinute: number;
  requestsPerDay: number;
}

interface RateLimitState {
  minuteCount: number;
  dayCount: number;
  minuteResetTime: number;
  dayResetTime: number;
}

export class RateLimiter {
  private state: Map<string, RateLimitState> = new Map();
  private config: Map<string, RateLimitConfig> = new Map();
  
  constructor() {
    this.config.set('gemini', {
      requestsPerMinute: 10,
      requestsPerDay: 1500,
    });
    
    this.config.set('grok', {
      requestsPerMinute: 60,
      requestsPerDay: 10000,
    });
  }
  
  canMakeRequest(provider: string): boolean {
    const config = this.config.get(provider);
    if (!config) return true;
    
    const now = Date.now();
    let state = this.state.get(provider);
    
    if (!state) {
      state = {
        minuteCount: 0,
        dayCount: 0,
        minuteResetTime: now + 60_000,
        dayResetTime: now + 86_400_000,
      };
      this.state.set(provider, state);
    }
    
    if (now >= state.minuteResetTime) {
      state.minuteCount = 0;
      state.minuteResetTime = now + 60_000;
    }
    
    if (now >= state.dayResetTime) {
      state.dayCount = 0;
      state.dayResetTime = now + 86_400_000;
    }
    
    if (state.minuteCount >= config.requestsPerMinute) {
      return false;
    }
    
    if (state.dayCount >= config.requestsPerDay) {
      return false;
    }
    
    return true;
  }
  
  recordRequest(provider: string): void {
    const state = this.state.get(provider);
    if (state) {
      state.minuteCount++;
      state.dayCount++;
    }
  }
  
  getTimeUntilReset(provider: string): { minute: number; day: number } {
    const state = this.state.get(provider);
    if (!state) return { minute: 0, day: 0 };
    
    const now = Date.now();
    return {
      minute: Math.max(0, state.minuteResetTime - now),
      day: Math.max(0, state.dayResetTime - now),
    };
  }
}