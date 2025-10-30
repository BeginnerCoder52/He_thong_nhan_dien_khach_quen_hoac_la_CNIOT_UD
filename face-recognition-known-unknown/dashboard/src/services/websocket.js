class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = [];
  }

  connect() {
    this.ws = new WebSocket('ws://localhost:8080/ws');
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.listeners.forEach(listener => listener(data));
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 3 seconds
      setTimeout(() => this.connect(), 3000);
    };
  }

  onMessage(callback) {
    this.listeners.push(callback);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export const wsService = new WebSocketService();