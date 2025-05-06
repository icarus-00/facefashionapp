/**
 * WebSocket polyfill for React Native
 * This provides a simple implementation that uses the browser's WebSocket when available
 * and a mock implementation otherwise
 */

// Use the browser's WebSocket if available
const BrowserWebSocket = typeof WebSocket !== 'undefined' ? WebSocket : null;

// Create a simple WebSocket implementation
class CustomWebSocket {
  constructor(url, protocols) {
    if (BrowserWebSocket) {
      // Use the browser's WebSocket if available
      this._ws = new BrowserWebSocket(url, protocols);
      
      // Forward events
      this._ws.onopen = (event) => {
        if (this.onopen) this.onopen(event);
      };
      
      this._ws.onclose = (event) => {
        if (this.onclose) this.onclose(event);
      };
      
      this._ws.onerror = (event) => {
        if (this.onerror) this.onerror(event);
      };
      
      this._ws.onmessage = (event) => {
        if (this.onmessage) this.onmessage(event);
      };
    } else {
      // Create a mock implementation for environments without WebSocket
      console.warn('WebSocket is not available in this environment. Using mock implementation.');
      this._connected = false;
      this._url = url;
      this._protocols = protocols;
      
      // Auto-connect in the next tick
      setTimeout(() => {
        this._connected = true;
        if (this.onopen) this.onopen({ target: this });
      }, 0);
    }
  }
  
  // WebSocket API methods
  send(data) {
    if (BrowserWebSocket && this._ws) {
      this._ws.send(data);
    } else {
      console.warn('WebSocket.send() called on mock implementation');
    }
  }
  
  close(code, reason) {
    if (BrowserWebSocket && this._ws) {
      this._ws.close(code, reason);
    } else {
      this._connected = false;
      if (this.onclose) {
        this.onclose({
          code: code || 1000,
          reason: reason || 'Connection closed',
          wasClean: true,
          target: this
        });
      }
    }
  }
  
  // WebSocket API properties
  get readyState() {
    if (BrowserWebSocket && this._ws) {
      return this._ws.readyState;
    }
    return this._connected ? 1 : 3; // 1 = OPEN, 3 = CLOSED
  }
  
  get bufferedAmount() {
    if (BrowserWebSocket && this._ws) {
      return this._ws.bufferedAmount;
    }
    return 0;
  }
  
  get extensions() {
    if (BrowserWebSocket && this._ws) {
      return this._ws.extensions;
    }
    return '';
  }
  
  get protocol() {
    if (BrowserWebSocket && this._ws) {
      return this._ws.protocol;
    }
    return this._protocols && this._protocols.length > 0 ? this._protocols[0] : '';
  }
  
  get url() {
    if (BrowserWebSocket && this._ws) {
      return this._ws.url;
    }
    return this._url || '';
  }
  
  // WebSocket API constants
  static get CONNECTING() { return 0; }
  static get OPEN() { return 1; }
  static get CLOSING() { return 2; }
  static get CLOSED() { return 3; }
}

// Export our custom WebSocket implementation
module.exports = CustomWebSocket;

// Make it available globally
if (typeof global !== 'undefined') {
  global.WebSocket = CustomWebSocket;
}

if (typeof window !== 'undefined' && !window.WebSocket) {
  window.WebSocket = CustomWebSocket;
}
