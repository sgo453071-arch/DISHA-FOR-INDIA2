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
        // Socket connected
      });

      socketRef.current.on('disconnect', () => {
        // Socket disconnected
      });

      socketRef.current.on('connect_error', (_error) => {
        // Connection error
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

  const sendMessage = useCallback((conversationId, message) => {
    if (socketRef.current) {
      socketRef.current.emit('send-message', { conversationId, message });
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

  const onNewMessage = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('new-message', callback);
    }
  }, []);

  const onTyping = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('typing', callback);
    }
  }, []);

  const onStopTyping = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('stop-typing', callback);
    }
  }, []);

  const onMessageRead = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('message-read', callback);
    }
  }, []);

  const onUserOnline = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('user-online', callback);
    }
  }, []);

  const onUserOffline = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('user-offline', callback);
    }
  }, []);

  const offNewMessage = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.off('new-message', callback);
    }
  }, []);

  const offTyping = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.off('typing', callback);
    }
  }, []);

  const offStopTyping = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.off('stop-typing', callback);
    }
  }, []);

  const offMessageRead = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.off('message-read', callback);
    }
  }, []);

  const offUserOnline = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.off('user-online', callback);
    }
  }, []);

  const offUserOffline = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.off('user-offline', callback);
    }
  }, []);

  const onMessageDelivered = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('message-delivered', callback);
    }
  }, []);

  const offMessageDelivered = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.off('message-delivered', callback);
    }
  }, []);

  const markMessageAsDelivered = useCallback((conversationId, messageId) => {
    if (socketRef.current) {
      socketRef.current.emit('message-delivered', { conversationId, messageId });
    }
  }, []);

  return {
    socket: socketRef.current,
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTypingEvent,
    sendStopTypingEvent,
    markMessageAsRead,
    markMessageAsDelivered,
    onNewMessage,
    onTyping,
    onStopTyping,
    onMessageRead,
    onMessageDelivered,
    onUserOnline,
    onUserOffline,
    offNewMessage,
    offTyping,
    offStopTyping,
    offMessageRead,
    offMessageDelivered,
    offUserOnline,
    offUserOffline,
  };
};

export default useSocket;
