import { CivicEvent } from '@/types';

type EventHandler = (event: CivicEvent) => void;

class CivicPulseWebSocket {
  private ws: WebSocket | null = null;
  private handlers: EventHandler[] = [];
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private url: string;
  private isConnected = false;

  constructor(url: string = 'ws://localhost:8000/ws/pulse') {
    this.url = url;
  }

  connect() {
    try {
      this.ws = new WebSocket(this.url);
      this.ws.onopen = () => {
        this.isConnected = true;
        console.log('[CivicPulse WS] Connected');
      };
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handlers.forEach((h) => h(data));
        } catch (e) {
          console.error('[CivicPulse WS] Parse error:', e);
        }
      };
      this.ws.onclose = () => {
        this.isConnected = false;
        this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
      };
      this.ws.onerror = () => {
        this.ws?.close();
      };
    } catch (e) {
      console.error('[CivicPulse WS] Connection failed:', e);
      this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
    }
  }

  onMessage(handler: EventHandler) {
    this.handlers.push(handler);
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler);
    };
  }

  disconnect() {
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.ws?.close();
    this.isConnected = false;
  }

  getConnectionState() {
    return this.isConnected;
  }
}

export const civicPulseWS = new CivicPulseWebSocket();
export default civicPulseWS;
