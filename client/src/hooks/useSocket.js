import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!user && !loading) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    if (!socketRef.current) {
      const token = localStorage.getItem('authToken');
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      socketRef.current.on('connect', () => {
        console.log('[SOCKET] Connected');
      });

      socketRef.current.on('disconnect', () => {
        console.log('[SOCKET] Disconnected');
      });

      socketRef.current.on('typing', (data) => {
        console.log('[SOCKET] Typing:', data);
      });

      socketRef.current.on('stop-typing', (data) => {
        console.log('[SOCKET] Stop typing:', data);
      });

      socketRef.current.on('message-read', (data) => {
        console.log('[SOCKET] Message read:', data);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('[SOCKET] Connection error:', error);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, loading]);

  const joinConversation = useCallback((conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('join-room', conversationId);
    }
  }, []);

  const leaveConversation = useCallback((conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('leave-room', conversationId);
    }
  }, []);

  const sendTypingEvent = useCallback((conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { conversationId });
    }
  }, []);

  const sendStopTypingEvent = useCallback((conversationId) => {
    if (socketRef.current) {
      socketRef.current.emit('stop-typing', { conversationId });
    }
  }, []);

  const markMessageAsRead = useCallback((conversationId, messageId) => {
    if (socketRef.current) {
      socketRef.current.emit('message-read', { conversationId, messageId });
    }
  }, []);

  return {
    socket: socketRef.current,
    joinConversation,
    leaveConversation,
    sendTypingEvent,
    sendStopTypingEvent,
    markMessageAsRead,
  };
};
