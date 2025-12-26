interface AnalyticsEvent {
  type: string;
  data: any;
  timestamp: number;
}

class AnalyticsBatcher {
  private queue: AnalyticsEvent[] = [];
  private batchSize = 10;
  private flushInterval = 10000;
  private timer: NodeJS.Timeout | null = null;
  private sessionId: string;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    
    if (typeof window !== 'undefined') {
      this.startTimer();
      
      window.addEventListener('beforeunload', () => {
        this.flush(true);
      });
      
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.flush();
        }
      });
    }
  }
  
  track(type: string, data: any = {}): void {
    const event: AnalyticsEvent = {
      type,
      data,
      timestamp: Date.now(),
    };
    
    this.queue.push(event);
    
    if (this.queue.length >= this.batchSize) {
      this.flush();
    }
  }
  
  private startTimer(): void {
    this.timer = setInterval(() => {
      if (this.queue.length > 0) {
        this.flush();
      }
    }, this.flushInterval);
  }
  
  private async flush(synchronous: boolean = false): Promise<void> {
    if (this.queue.length === 0) return;
    
    const events = [...this.queue];
    this.queue = [];
    
    const payload = {
      sessionId: this.sessionId,
      events: events.map(e => ({
        eventType: e.type,
        metadata: e.data,
        createdAt: new Date(e.timestamp).toISOString(),
      })),
    };
    
    try {
      if (synchronous && navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/batch',
          JSON.stringify(payload)
        );
      } else {
        await fetch('/api/analytics/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      
      console.log(`📊 Flushed ${events.length} analytics events`);
    } catch (error) {
      console.error('Failed to send analytics', error);
      this.queue.unshift(...events);
    }
  }
  
  private generateSessionId(): string {
    if (typeof window === 'undefined') return 'server';
    
    const existing = sessionStorage.getItem('analytics-session-id');
    if (existing) return existing;
    
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics-session-id', id);
    return id;
  }
  
  destroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.flush(true);
  }
}

export const analytics = new AnalyticsBatcher();