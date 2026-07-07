import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const { user, loading } = useAuth();
  const socketRef = useRef(null);
  const statusRef = useRef(connectionStatus);
  const userId = user?.id;

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setConnectionStatus('disconnected');
      statusRef.current = 'disconnected';
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setConnectionStatus('disconnected');
      statusRef.current = 'disconnected';
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    const handleConnect = () => {
      setConnectionStatus('connected');
      statusRef.current = 'connected';
    };

    const handleDisconnect = () => {
      setConnectionStatus('disconnected');
      statusRef.current = 'disconnected';
    };

    const handleConnectError = () => {
      setConnectionStatus('error');
      statusRef.current = 'error';
    };

    const handleReconnect = () => {
      setConnectionStatus('connected');
      statusRef.current = 'connected';
    };

    newSocket.on('connect', handleConnect);
    newSocket.on('disconnect', handleDisconnect);
    newSocket.on('connect_error', handleConnectError);
    newSocket.on('reconnect', handleReconnect);

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.off('connect', handleConnect);
      newSocket.off('disconnect', handleDisconnect);
      newSocket.off('connect_error', handleConnectError);
      newSocket.off('reconnect', handleReconnect);
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
      setConnectionStatus('disconnected');
      statusRef.current = 'disconnected';
    };
  }, [userId, loading]);

  const on = useCallback((event, callback) => {
    const s = socketRef.current;
    if (s) {
      s.on(event, callback);
      return () => s.off(event, callback);
    }
    return () => {};
  }, []);

  const once = useCallback((event, callback) => {
    const s = socketRef.current;
    if (s) {
      s.once(event, callback);
      return () => s.off(event, callback);
    }
    return () => {};
  }, []);

  const emit = useCallback((event, data) => {
    const s = socketRef.current;
    if (s && statusRef.current === 'connected') {
      s.emit(event, data);
    }
  }, []);

  const joinConversation = useCallback((conversationId) => {
    const s = socketRef.current;
    if (s && conversationId) {
      s.emit('join-room', conversationId);
    }
  }, []);

  const leaveConversation = useCallback((conversationId) => {
    const s = socketRef.current;
    if (s && conversationId) {
      s.emit('leave-room', conversationId);
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connectionStatus, on, once, emit, joinConversation, leaveConversation }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
};

export default SocketContext;
