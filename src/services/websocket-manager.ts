import { Injectable } from '@furystack/inject';
import { ObservableValue } from '@sensenet/client-utils';

declare global {
  interface WebSocket {
    observables: {
      onOpen: ObservableValue<{ socket: WebSocket; ev: Event }>;
      onClose: ObservableValue<{ socket: WebSocket; ev: CloseEvent }>;
      onMessage: ObservableValue<{ socket: WebSocket; ev: MessageEvent }>;
      onError: ObservableValue<{ socket: WebSocket; ev: Event }>;
      readyState: ObservableValue<number>;
    };
  }
}

@Injectable({ lifetime: 'singleton' })
export class WebSocketManager {
  private sockets = new Map<string, WebSocket>();

  private createSocket(url: string) {
    const ws = new WebSocket(url);
    ws.observables = {
      onOpen: new ObservableValue<{ socket: WebSocket; ev: Event }>(),
      onClose: new ObservableValue<{ socket: WebSocket; ev: CloseEvent }>(),
      onMessage: new ObservableValue<{ socket: WebSocket; ev: MessageEvent }>(),
      onError: new ObservableValue<{ socket: WebSocket; ev: Event }>(),
      readyState: new ObservableValue<number>(ws.readyState)
    };

    ws.onopen = function(this, ev) {
      ws.observables.onOpen.setValue({ socket: this, ev });
      ws.observables.readyState.setValue(ws.readyState);
    };
    ws.onclose = function(this, ev) {
      ws.observables.onClose.setValue({ socket: this, ev });
      ws.observables.readyState.setValue(ws.readyState);
    };
    ws.onmessage = function(this, ev) {
      ws.observables.onMessage.setValue({ socket: this, ev });
      ws.observables.readyState.setValue(ws.readyState);
    };
    ws.onerror = function(this, ev) {
      ws.observables.onError.setValue({ socket: this, ev });
      ws.observables.readyState.setValue(ws.readyState);
    };
    return ws;
  }

  public reconnect(url: string) {
    const ws = this.createSocket(url);
    this.sockets.set(url, ws);
    return ws;
  }

  public getSocket(url: string) {
    const existing = this.sockets.get(url);
    if (!existing) {
      const ws = this.createSocket(url);
      this.sockets.set(url, ws);
      return ws;
    }
    return existing;
  }
}
