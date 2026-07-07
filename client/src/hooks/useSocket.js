import { useCallback } from 'react';
import { useSocketContext } from '../context/SocketContext';

export const useSocket = () => {
  const { socket, connectionStatus, joinConversation, leaveConversation, emit, on } = useSocketContext();

  const sendTypingEvent = useCallback((conversationId) => {
    emit('typing', { conversationId });
  }, [emit]);

  const sendStopTypingEvent = useCallback((conversationId) => {
    emit('stop-typing', { conversationId });
  }, [emit]);

  const markMessageAsRead = useCallback((conversationId, messageId) => {
    emit('message-read', { conversationId, messageId });
  }, [emit]);

  const markMessageAsDelivered = useCallback((conversationId, messageId) => {
    emit('message-delivered', { conversationId, messageId });
  }, [emit]);

  const onNewMessage = useCallback((callback) => {
    return on('new-message', callback);
  }, [on]);

  const onTyping = useCallback((callback) => {
    return on('typing', callback);
  }, [on]);

  const onStopTyping = useCallback((callback) => {
    return on('stop-typing', callback);
  }, [on]);

  const onMessageRead = useCallback((callback) => {
    return on('message-read', callback);
  }, [on]);

  const onMessageDelivered = useCallback((callback) => {
    return on('message-delivered', callback);
  }, [on]);

  const onUserOnline = useCallback((callback) => {
    return on('user-online', callback);
  }, [on]);

  const onUserOffline = useCallback((callback) => {
    return on('user-offline', callback);
  }, [on]);

  const offNewMessage = useCallback((callback) => {
    if (socket) socket.off('new-message', callback);
  }, [socket]);

  const offTyping = useCallback((callback) => {
    if (socket) socket.off('typing', callback);
  }, [socket]);

  const offStopTyping = useCallback((callback) => {
    if (socket) socket.off('stop-typing', callback);
  }, [socket]);

  const offMessageRead = useCallback((callback) => {
    if (socket) socket.off('message-read', callback);
  }, [socket]);

  const offMessageDelivered = useCallback((callback) => {
    if (socket) socket.off('message-delivered', callback);
  }, [socket]);

  const offUserOnline = useCallback((callback) => {
    if (socket) socket.off('user-online', callback);
  }, [socket]);

  const offUserOffline = useCallback((callback) => {
    if (socket) socket.off('user-offline', callback);
  }, [socket]);

  return {
    socket,
    connectionStatus,
    isConnected: connectionStatus === 'connected',
    joinConversation,
    leaveConversation,
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
