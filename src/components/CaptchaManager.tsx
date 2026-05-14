
import { useEffect, useState, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';

interface CaptchaTask {
  id: string;
  userId: string;
  captchaId: string;
  type: string;
  image: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CaptchaManagerProps {
  userId: string;
  onTaskCreated?: (task: CaptchaTask) => void;
  onTaskUpdated?: (task: CaptchaTask) => void;
  onTaskCompleted?: (task: CaptchaTask) => void;
}

export const CaptchaManager = ({
  userId,
  onTaskCreated,
  onTaskUpdated,
  onTaskCompleted
}: CaptchaManagerProps) => {
  const { socket, isConnected } = useWebSocket({
    url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    options: {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    }
  });

  const [activeTasks, setActiveTasks] = useState<CaptchaTask[]>([]);
  const [loading, setLoading] = useState(false);

  // Join user room when component mounts
  useEffect(() => {
    if (socket && isConnected && userId) {
      socket.emit('join-captcha-room', userId);
    }
  }, [socket, isConnected, userId]);

  // Handle WebSocket events
  useEffect(() => {
    if (!socket) return;

    // Handle task creation
    const handleTaskCreated = (task: CaptchaTask) => {
      setActiveTasks(prev => [task, ...prev]);
      onTaskCreated?.(task);
    };

    // Handle task status updates
    const handleTaskUpdated = (task: CaptchaTask) => {
      setActiveTasks(prev =>
        prev.map(t => t.id === task.id ? task : t)
      );
      onTaskUpdated?.(task);
    };

    // Handle task completion
    const handleTaskCompleted = (task: CaptchaTask) => {
      setActiveTasks(prev =>
        prev.map(t => t.id === task.id ? task : t)
      );
      onTaskCompleted?.(task);
    };

    // Listen for events
    socket.on('captcha-task-created', handleTaskCreated);
    socket.on('captcha-status-update', handleTaskUpdated);
    socket.on('captcha-completed', handleTaskCompleted);

    return () => {
      socket.off('captcha-task-created', handleTaskCreated);
      socket.off('captcha-status-update', handleTaskUpdated);
      socket.off('captcha-completed', handleTaskCompleted);
    };
  }, [socket, onTaskCreated, onTaskUpdated, onTaskCompleted]);

  const createCaptcha = useCallback(async (type: string, imageData: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/captcha/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          image: imageData,
          ...(userId && { userId })
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create captcha');
      }

      const data = await response.json();
      return data.task;
    } catch (error) {
      console.error('Error creating captcha:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const submitCaptcha = useCallback(async (captchaId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/captcha/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          captchaId,
          ...(userId && { userId })
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit captcha');
      }

      const data = await response.json();
      return data.task;
    } catch (error) {
      console.error('Error submitting captcha:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const getMyTasks = useCallback(async () => {
    if (!userId) return [];

    setLoading(true);
    try {
      const response = await fetch('/api/captcha/my-tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setActiveTasks(data.tasks);
      return data.tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  return {
    activeTasks,
    isConnected,
    loading,
    createCaptcha,
    submitCaptcha,
    getMyTasks
  };
};