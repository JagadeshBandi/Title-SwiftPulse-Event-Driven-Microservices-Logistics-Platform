class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 1000;
    this.listeners = new Map();
    this.isConnecting = false;
    this.url = process.env.REACT_APP_WS_URL || 'ws://localhost:8080/ws';
  }

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.emit('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.emit('message', data);
            this.emit(data.type, data.payload);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;
          this.emit('disconnected');
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          this.emit('error', error);
          reject(error);
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  attemptReconnect() {
    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect().catch(error => {
        console.error('Reconnection failed:', error);
      });
    }, this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ type, payload, timestamp: Date.now() });
      this.ws.send(message);
    } else {
      console.warn('WebSocket not connected. Message not sent:', { type, payload });
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in WebSocket event callback:', error);
        }
      });
    }
  }

  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  getConnectionState() {
    if (!this.ws) return 'DISCONNECTED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'CONNECTED';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'DISCONNECTED';
      default:
        return 'UNKNOWN';
    }
  }
}

// Real-time data simulator for demo purposes
export class RealTimeDataService {
  constructor() {
    this.subscribers = new Map();
    this.intervals = new Map();
    this.isRunning = false;
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event).push(callback);
    
    if (!this.isRunning) {
      this.start();
    }
  }

  unsubscribe(event, callback) {
    if (this.subscribers.has(event)) {
      const callbacks = this.subscribers.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      if (callbacks.length === 0) {
        this.subscribers.delete(event);
      }
    }
  }

  start() {
    this.isRunning = true;
    
    // Simulate real-time order updates
    this.intervals.set('orders', setInterval(() => {
      this.emit('order_update', this.generateOrderUpdate());
    }, 5000));

    // Simulate real-time tracking updates
    this.intervals.set('tracking', setInterval(() => {
      this.emit('tracking_update', this.generateTrackingUpdate());
    }, 3000));

    // Simulate real-time metrics
    this.intervals.set('metrics', setInterval(() => {
      this.emit('metrics_update', this.generateMetricsUpdate());
    }, 2000));

    // Simulate real-time driver updates
    this.intervals.set('drivers', setInterval(() => {
      this.emit('driver_update', this.generateDriverUpdate());
    }, 4000));
  }

  stop() {
    this.isRunning = false;
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
  }

  emit(event, data) {
    if (this.subscribers.has(event)) {
      this.subscribers.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in real-time event callback:', error);
        }
      });
    }
  }

  generateOrderUpdate() {
    const statuses = ['PENDING', 'CONFIRMED', 'IN_TRANSIT', 'DELIVERED'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    
    return {
      type: 'ORDER_UPDATE',
      payload: {
        orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        location: cities[Math.floor(Math.random() * cities.length)],
        timestamp: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + Math.random() * 86400000).toISOString(),
      }
    };
  }

  generateTrackingUpdate() {
    const trackingNumbers = ['TRK123456', 'TRK789012', 'TRK345678', 'TRK901234'];
    const statuses = ['Package picked up', 'In transit', 'Out for delivery', 'Delivered'];
    
    return {
      type: 'TRACKING_UPDATE',
      payload: {
        trackingNumber: trackingNumbers[Math.floor(Math.random() * trackingNumbers.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        location: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        },
        timestamp: new Date().toISOString(),
        estimatedArrival: new Date(Date.now() + Math.random() * 3600000).toISOString(),
      }
    };
  }

  generateMetricsUpdate() {
    return {
      type: 'METRICS_UPDATE',
      payload: {
        activeOrders: Math.floor(Math.random() * 100) + 50,
        completedOrders: Math.floor(Math.random() * 50) + 20,
        averageDeliveryTime: Math.floor(Math.random() * 30) + 15,
        driverUtilization: Math.floor(Math.random() * 30) + 70,
        customerSatisfaction: (Math.random() * 0.5 + 4.5).toFixed(1),
        revenue: Math.floor(Math.random() * 10000) + 5000,
        timestamp: new Date().toISOString(),
      }
    };
  }

  generateDriverUpdate() {
    const drivers = ['John Smith', 'Sarah Johnson', 'Mike Wilson', 'Emily Davis'];
    const statuses = ['ACTIVE', 'ON_BREAK', 'OFFLINE'];
    
    return {
      type: 'DRIVER_UPDATE',
      payload: {
        driverId: `DRV-${Math.floor(Math.random() * 100)}`,
        name: drivers[Math.floor(Math.random() * drivers.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        location: {
          lat: 40.7128 + (Math.random() - 0.5) * 0.1,
          lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        },
        currentOrder: Math.random() > 0.5 ? `ORD-${Math.floor(Math.random() * 10000)}` : null,
        deliveriesToday: Math.floor(Math.random() * 20) + 5,
        timestamp: new Date().toISOString(),
      }
    };
  }
}

// Export singleton instances
export const wsService = new WebSocketService();
export const realTimeService = new RealTimeDataService();

// React hook for real-time data
export const useRealTimeData = (event, callback) => {
  React.useEffect(() => {
    realTimeService.subscribe(event, callback);
    
    return () => {
      realTimeService.unsubscribe(event, callback);
    };
  }, [event, callback]);
};

// React hook for WebSocket connection
export const useWebSocket = () => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [connectionState, setConnectionState] = React.useState('DISCONNECTED');

  React.useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setConnectionState('CONNECTED');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setConnectionState('DISCONNECTED');
    };

    const handleError = () => {
      setIsConnected(false);
      setConnectionState('ERROR');
    };

    wsService.on('connected', handleConnect);
    wsService.on('disconnected', handleDisconnect);
    wsService.on('error', handleError);

    // Initialize connection
    wsService.connect().catch(console.error);

    return () => {
      wsService.off('connected', handleConnect);
      wsService.off('disconnected', handleDisconnect);
      wsService.off('error', handleError);
    };
  }, []);

  return {
    isConnected,
    connectionState,
    send: wsService.send.bind(wsService),
    on: wsService.on.bind(wsService),
    off: wsService.off.bind(wsService),
    connect: wsService.connect.bind(wsService),
    disconnect: wsService.disconnect.bind(wsService),
  };
};
