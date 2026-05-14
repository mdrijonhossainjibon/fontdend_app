import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  url: string;
  options?: {
    autoConnect?: boolean;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
  };
}

interface WebSocketEvents {
  onConnect?: (socket: Socket) => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
}

export const useWebSocket = ({ url, options = {} }: UseWebSocketOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const defaultOptions: Required<UseWebSocketOptions['options']> = {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    ...options
  };

  const connect = useCallback(() => {
    if (socket?.connected) return;

    const newSocket = io(url, {
      transports: ['websocket', 'polling'],
      autoConnect: false,
      reconnection: defaultOptions.reconnection,
      reconnectionAttempts: defaultOptions.reconnectionAttempts,
      reconnectionDelay: defaultOptions.reconnectionDelay
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket connected:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('WebSocket disconnected:', reason);

      if (defaultOptions.reconnection && reason !== 'io server disconnect') {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          if (!newSocket.connected) {
            newSocket.connect();
          }
        }, defaultOptions.reconnectionDelay);
      }
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    newSocket.connect();
    setSocket(newSocket);

    return newSocket;
  }, [url, defaultOptions.reconnection, defaultOptions.reconnectionAttempts, defaultOptions.reconnectionDelay]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, [socket]);

  useEffect(() => {
    if (defaultOptions.autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, defaultOptions.autoConnect]);

  return {
    socket,
    isConnected,
    connect,
    disconnect
  };
};