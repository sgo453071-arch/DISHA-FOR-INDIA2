import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeft, Pin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { getMessages, sendMessage, pinMessage, unpinMessage, deleteMessage, updateMessage } from '../../services/messagesService';
import { getConversation } from '../../services/conversationsService';
import { MessagingSkeletons, ErrorState } from './MessagingSkeletons';
import useSocket from '../../hooks/useSocket';

const MessageWindow = ({ conversationId, onBack, currentUserId }) => {
  const [page, setPage] = useState(1);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showPinned, setShowPinned] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const topRef = useRef(null);
  const queryClient = useQueryClient();

  const {
    joinConversation,
    leaveConversation,
    sendMessage: socketSendMessage,
    sendTypingEvent,
    sendStopTypingEvent,
    onNewMessage,
    onTyping,
    onStopTyping,
    onMessageRead,
    offNewMessage,
    offTyping,
    offStopTyping,
    offMessageRead,
    onMessageDelivered,
    offMessageDelivered,
    markMessageAsDelivered,
  } = useSocket();

  const { data: conversationData, isLoading: conversationLoading, isError: conversationError, refetch: refetchConversation } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const res = await getConversation(conversationId);
      return res.data;
    },
    enabled: !!conversationId,
  });

  const { data: messagesData, isLoading: messagesLoading, isError: messagesError, refetch: refetchMessages, hasNextPage, isFetchingNextPage } = useQuery({
    queryKey: ['messages', conversationId, page],
    queryFn: async () => {
      const res = await getMessages(conversationId, { page, limit: 50 });
      return res.data;
    },
    enabled: !!conversationId,
    keepPreviousData: true,
  });

  const messages = messagesData?.messages || [];
  const otherUser = conversationData?.participants?.find((p) => p._id !== currentUserId);

  const sendMutation = useMutation({
    mutationFn: (data) => sendMessage(conversationId, data),
    onMutate: async (data) => {
      await queryClient.cancelQueries(['messages', conversationId]);
      const previousMessages = queryClient.getQueryData(['messages', conversationId, page]);
      const tempId = `temp-${Date.now()}`;
      
      const optimisticMessage = {
        _id: tempId,
        content: data.content,
        attachments: data.attachments || [],
        senderId: { _id: currentUserId },
        createdAt: new Date().toISOString(),
        status: 'sending',
      };

      queryClient.setQueryData(['messages', conversationId, page], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            messages: [...(oldData.data.messages || []), optimisticMessage],
          },
        };
      });

      return { previousMessages, tempId };
    },
    onError: (err, data, context) => {
      queryClient.setQueryData(['messages', conversationId, page], (oldData) => {
        if (!oldData) return oldData;
        const messages = oldData.data.messages.map((m) =>
          m._id === context.tempId ? { ...m, status: 'failed' } : m
        );
        return { ...oldData, data: { ...oldData.data, messages } };
      });
    },
    onSuccess: (res, variables, context) => {
      const realMessage = res?.data?.message || res?.message;
      if (!realMessage) {
        queryClient.invalidateQueries(['messages', conversationId]);
        return;
      }
      
      queryClient.setQueryData(['messages', conversationId, page], (oldData) => {
        if (!oldData) return oldData;
        let messages = oldData.data.messages.map((m) =>
          m._id === context.tempId ? realMessage : m
        );
        
        // Remove duplicate if socket arrived before onSuccess
        const realExistsCount = messages.filter(m => m._id === realMessage._id).length;
        if (realExistsCount > 1) {
          // Remove the one that might be at the end, keep unique
          messages = messages.filter((m, index, self) => 
            index === self.findIndex((t) => (
              t._id === m._id
            ))
          );
        }
        
        return { ...oldData, data: { ...oldData.data, messages } };
      });
      queryClient.invalidateQueries(['conversations']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (messageId) => deleteMessage(conversationId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId]);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ messageId, content }) => updateMessage(conversationId, messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId]);
      setEditingMessage(null);
    },
  });

  const pinMutation = useMutation({
    mutationFn: ({ messageId, shouldPin }) => (shouldPin ? pinMessage(conversationId, messageId) : unpinMessage(conversationId, messageId)),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId]);
    },
  });

  useEffect(() => {
    joinConversation(conversationId);
    return () => {
      leaveConversation(conversationId);
    };
  }, [conversationId, joinConversation, leaveConversation]);

  useEffect(() => {
    const handleNewMessage = (data) => {
      if (data.conversationId === conversationId) {
        queryClient.setQueryData(['messages', conversationId, page], (oldData) => {
          if (!oldData) return oldData;
          const exists = oldData.data?.messages?.some((m) => m._id === data.message._id);
          if (exists) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              messages: [...(oldData.data.messages || []), data.message],
            },
          };
        });
        
        // Auto-deliver if not our own message
        if (data.message.senderId !== currentUserId && data.message.senderId?._id !== currentUserId) {
          markMessageAsDelivered(conversationId, data.message._id);
        }
      }
    };

    const handleTyping = (data) => {
      if (data.conversationId === conversationId && data.userId !== currentUserId) {
        setTypingUsers((prev) => {
          if (prev.some((u) => u.userId === data.userId)) return prev;
          return [...prev, { userId: data.userId, name: data.name || 'Someone' }];
        });
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
        }, 3000);
      }
    };

    const handleStopTyping = (data) => {
      if (data.conversationId === conversationId) {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
      }
    };

    const handleMessageRead = (data) => {
      if (data.conversationId !== conversationId) return;
      queryClient.setQueryData(['messages', conversationId, page], (oldData) => {
        if (!oldData?.data?.messages) return oldData;
        const updated = oldData.data.messages.map((m) =>
          m._id === data.messageId || m.status === 'delivered' || m.status === 'sent'
            ? { ...m, status: 'read', isRead: true, readBy: [...(m.readBy || []), { userId: data.userId, readAt: new Date() }] }
            : m
        );
        return { ...oldData, data: { ...oldData.data, messages: updated } };
      });
    };

    const handleMessageDelivered = (data) => {
      if (data.conversationId !== conversationId) return;
      queryClient.setQueryData(['messages', conversationId, page], (oldData) => {
        if (!oldData?.data?.messages) return oldData;
        const updated = oldData.data.messages.map((m) =>
          (m._id === data.messageId || (new Date(m.createdAt) <= new Date() && m.status === 'sent')) && m.status !== 'read'
            ? { ...m, status: 'delivered' }
            : m
        );
        return { ...oldData, data: { ...oldData.data, messages: updated } };
      });
    };

    onNewMessage(handleNewMessage);
    onTyping(handleTyping);
    onStopTyping(handleStopTyping);
    onMessageRead(handleMessageRead);
    onMessageDelivered(handleMessageDelivered);

    return () => {
      offNewMessage(handleNewMessage);
      offTyping(handleTyping);
      offStopTyping(handleStopTyping);
      offMessageRead(handleMessageRead);
      offMessageDelivered(handleMessageDelivered);
    };
  }, [conversationId, currentUserId, page, queryClient, onNewMessage, onTyping, onStopTyping, onMessageRead, onMessageDelivered, offNewMessage, offTyping, offStopTyping, offMessageRead, offMessageDelivered, markMessageAsDelivered]);

  // Auto-mark messages as read when they become visible/loaded
  useEffect(() => {
    if (messages && messages.length > 0) {
      const unreadMessages = messages.filter(
        (m) =>
          (m.senderId !== currentUserId && m.senderId?._id !== currentUserId) &&
          !m.readBy?.some((r) => r.userId === currentUserId) &&
          m.status !== 'read' && 
          m._id && !m._id.startsWith('temp-')
      );

      if (unreadMessages.length > 0) {
        const lastUnread = unreadMessages[unreadMessages.length - 1];
        markMessageAsRead(conversationId, lastUnread._id);
        
        // Optimistically mark as read in local state
        queryClient.setQueryData(['messages', conversationId, page], (oldData) => {
          if (!oldData?.data?.messages) return oldData;
          const updated = oldData.data.messages.map((m) =>
            unreadMessages.some(u => u._id === m._id) || (new Date(m.createdAt) <= new Date(lastUnread.createdAt))
              ? { ...m, status: 'read', isRead: true, readBy: [...(m.readBy || []), { userId: currentUserId, readAt: new Date() }] }
              : m
          );
          return { ...oldData, data: { ...oldData.data, messages: updated } };
        });
      }
    }
  }, [messages, currentUserId, conversationId, markMessageAsRead, queryClient, page]);

  const handleSend = useCallback((data) => {
    if (editingMessage) {
      editMutation.mutate({ messageId: editingMessage._id, content: data.content });
    } else {
      sendMutation.mutate(data);
    }
  }, [editingMessage, sendMutation, editMutation, conversationId]);

  const handleEdit = useCallback((message) => {
    setEditingMessage(message);
  }, []);

  const handleDelete = useCallback((messageId) => {
    if (window.confirm('Delete this message?')) {
      deleteMutation.mutate(messageId);
    }
  }, [deleteMutation]);

  const handlePinToggle = useCallback((messageId, isPinned) => {
    pinMutation.mutate({ messageId, shouldPin: !isPinned });
  }, [pinMutation]);

  const handleTypingStart = useCallback(() => {
    sendTypingEvent(conversationId);
  }, [sendTypingEvent, conversationId]);

  const handleTypingStop = useCallback(() => {
    sendStopTypingEvent(conversationId);
  }, [sendStopTypingEvent, conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isFetchingNextPage]);

  const handleScroll = useCallback(() => {
    if (topRef.current && topRef.current.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
      const prevHeight = topRef.current.scrollHeight;
      setPage((p) => p + 1);
      setTimeout(() => {
        if (topRef.current) {
          topRef.current.scrollTop = topRef.current.scrollHeight - prevHeight;
        }
      }, 100);
    }
  }, [hasNextPage, isFetchingNextPage]);

  const shouldShowEmpty = !messagesLoading && (!messages || messages.length === 0);
  const isDisabled = sendMutation.isPending || editMutation.isPending;

  const header = conversationData && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)', background: '#fff', borderRadius: '16px 16px 0 0' }}>
      {onBack && (
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568' }} aria-label="Back to conversations">
          <ArrowLeft size={20} />
        </button>
      )}

      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#D35400',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '1rem',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {otherUser?.name?.[0]?.toUpperCase() || '?'}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{otherUser?.name || 'Conversation'}</h4>
        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-body)' }}>
          {conversationData.type === 'support' ? 'Support' : 'Private Chat'}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowPinned(!showPinned)}
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          backgroundColor: showPinned ? '#D35400' : '#F3F4F6',
          color: showPinned ? 'white' : '#4A5568',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Show pinned messages"
        aria-pressed={showPinned}
      >
        <Pin size={16} />
      </motion.button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FDFBF7', borderRadius: 16, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      {header}

      <div
        ref={topRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: 'auto', padding: '1rem', position: 'relative', display: 'flex', flexDirection: 'column' }}
        role="list"
        aria-label="Messages"
        aria-busy={messagesLoading}
      >
        {isFetchingNextPage && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem' }} aria-label="Loading more messages">
            <MessagingSkeletons type="message" count={2} />
          </div>
        )}

        {conversationLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }} aria-label="Loading conversation">
            <MessagingSkeletons type="message" count={4} />
          </div>
        ) : conversationError ? (
          <ErrorState message="Failed to load conversation" onRetry={refetchConversation} />
        ) : messagesLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem' }} aria-label="Loading messages">
            <MessagingSkeletons type="message" count={6} />
          </div>
        ) : messagesError ? (
          <ErrorState message="Failed to load messages" onRetry={refetchMessages} />
        ) : shouldShowEmpty ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '3rem 1.5rem' }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-heading)' }}>No messages yet</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-body)', maxWidth: 280, lineHeight: 1.6 }}>
                Start the conversation by sending a message below.
              </p>
            </motion.div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => {
              const showDateDivider = index === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[index - 1].createdAt).toDateString();
              return (
                <React.Fragment key={msg._id}>
                  {showDateDivider && (
                    <div style={{ textAlign: 'center', margin: '1rem 0', position: 'relative' }}>
                      <span style={{ background: '#FDFBF7', padding: '0.25rem 0.75rem', fontSize: '0.7rem', color: '#9CA3AF', position: 'relative', zIndex: 1, borderRadius: 12, border: '1px solid var(--color-border)' }}>
                        {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  )}
                  <MessageBubble
                    key={msg._id}
                    message={msg}
                    isOwn={msg.senderId?._id === currentUserId}
                    onPin={(id) => handlePinToggle(id, false)}
                    onUnpin={(id) => handlePinToggle(id, true)}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    isPinned={msg.isPinned}
                    onRetry={() => sendMutation.mutate({ content: msg.content, attachments: msg.attachments || [] })}
                  />
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <TypingIndicator users={typingUsers} />

      <MessageInput
        onSend={handleSend}
        disabled={isDisabled}
        placeholder={editingMessage ? 'Edit message...' : 'Type a message...'}
        onCancelEdit={() => setEditingMessage(null)}
        isEditing={!!editingMessage}
        onTypingStart={handleTypingStart}
        onTypingStop={handleTypingStop}
      />
    </div>
  );
};

export default MessageWindow;
