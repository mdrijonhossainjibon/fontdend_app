import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/modules/rootReducer';
import {
  fetchDashboardDataRequest,
  fetchExtensionsRequest,
} from '@/modules/dashboard/actions';

const SOCKET_URL = `${window.location.protocol}//${window.location.hostname}:8000`;

export function useDashboardSocket() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      query: { userId: user._id },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('[DashboardSocket] Connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[DashboardSocket] Disconnected:', reason);
    });

    // Full data refresh when any dashboard data changes
    socket.on('dashboard:update', () => {
      dispatch(fetchDashboardDataRequest());
    });

    // Extensions update
    socket.on('dashboard:extensions-update', () => {
      dispatch(fetchExtensionsRequest());
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch, user?._id]);
}
