import React, { useEffect, useCallback } from 'react';
import { createContext, useState } from 'react';
import { useInjector } from '../hooks/use-injector';
import { WebSocketManager } from '../services/websocket-manager';
import { ServoService } from '../services/servo-service';

const ws_storage_key = 'ROVER_LAST_SOCKET_URL';

export interface WebSocketContextProps {
  socket: WebSocket;
  setUrl: (url: string) => void;
  safeSend: (data: string) => void;
  readyState: number;
}

export const WebSocketContext = createContext<WebSocketContextProps>(
  {} as WebSocketContextProps
);

export const WebSocketProvider: React.FunctionComponent = props => {
  const injector = useInjector();
  const sm = injector.getInstance(WebSocketManager);
  const servoService = injector.getInstance(ServoService);

  const [defaultUrl] = useState(
    localStorage.getItem(ws_storage_key) || 'ws://192.168.0.94:81'
  );

  const [socket, setSocket] = useState(sm.getSocket(defaultUrl));
  const [readyState, setReadyState] = useState(socket.readyState);

  const safeSend = useCallback(
    (data: string) => {
      if (socket.readyState === WebSocket.OPEN)
        try {
          socket.send(data);
        } catch (error) {
          /** ignore */
        }
    },
    [socket]
  );

  useEffect(() => {
    const observables = [
      socket.observables.readyState.subscribe(rs => setReadyState(rs)),
      socket.observables.onMessage.subscribe(message => {
        try {
          const o = JSON.parse(message.ev.data);
          if (o.event === 'servoChange') {
            (o.details as Array<{
              channel: number;
              degrees: number;
              pulse: number;
            }>).forEach(e => {
              servoService.getServoForChannel(e.channel);
              servoService.patch(
                e.channel,
                {
                  plainValue: e.degrees,
                  percentage: 0
                },
                socket,
                true
              );
            });
          }
          console.log('Message received', o);
        } catch (error) {
          // ignore
        }
      })
    ];

    return () => {
      observables.map(o => o.dispose());
    };
  }, [socket, servoService]);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        readyState,
        safeSend,
        setUrl: url => {
          setSocket(sm.getSocket(url));
          localStorage.setItem(ws_storage_key, url);
        }
      }}
    >
      {props.children}
    </WebSocketContext.Provider>
  );
};
