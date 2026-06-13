import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/modules/rootReducer';
import { fetchAdminAnalyticsRequest } from '@/modules/admin/actions';

const SOCKET_URL = `${window.location.protocol}//${window.location.hostname}:8000`;

export function useAdminAnalyticsSocket(days: number = 30) {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?._id) return;
    if (!['admin', 'superadmin'].includes(user.role)) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      query: { userId: user._id, role: user.role },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on('connect', () => {
      console.log('[AdminAnalyticsSocket] Connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[AdminAnalyticsSocket] Disconnected:', reason);
    });

    socket.on('admin:analytics-update', () => {
      dispatch(fetchAdminAnalyticsRequest(days));
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch, user?._id, user?.role, days]);
}
