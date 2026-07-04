import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Search, Pin, X, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { getMessages, sendMessage, pinMessage, unpinMessage, deleteMessage, updateMessage, markMessageAsRead } from '../../services/messagesService';
import { getConversation } from '../../services/conversationsService';
import EmptyState from '../volunteer/EmptyState';

const MessageWindow = ({ conversationId, onBack, currentUserId }) => {
  const [page, setPage] = useState(1);
  const [editingMessage, setEditingMessage] = useState(null);
  const [showPinned, setShowPinned] = useState(false);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: conversationData } = useQuery({
    queryKey: ['conversation', conversationId],
    queryFn: async () => {
      const res = await getConversation(conversationId);
      return res.data;
    },
    enabled: !!conversationId,
  });

  const { data: messagesData, isLoading } = useQuery({
    queryKey: ['messages', conversationId, page],
    queryFn: async () => {
      const res = await getMessages(conversationId, { page, limit: 50 });
      return res.data;
    },
    enabled: !!conversationId,
  });

  const messages = messagesData?.messages || [];
  const otherUser = conversationData?.participants?.find((p) => p._id !== currentUserId);

  const sendMutation = useMutation({
    mutationFn: (data) => sendMessage(conversationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId]);
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
    mutationFn: (messageId) => (conversationId, messageId) => 
      Math.random() > 0.5 ? pinMessage(conversationId, messageId) : unpinMessage(conversationId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', conversationId]);
    },
  });

  const handleSend = useCallback((data) => {
    if (editingMessage) {
      editMutation.mutate({ messageId: editingMessage._id, content: data.content });
    } else {
      sendMutation.mutate(data);
    }
  }, [editingMessage, sendMutation, editMutation]);

  const handleEdit = (message) => {
    setEditingMessage(message);
  };

  const handleDelete = (messageId) => {
    if (window.confirm('Delete this message?')) {
      deleteMutation.mutate(messageId);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const shouldShowEmpty = !isLoading && (!messages || messages.length === 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#FDFBF7', borderRadius: 16, border: '1px solid var(--color-border)' }}>
      {conversationData && (
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
            }}
          >
            {otherUser?.name?.[0]?.toUpperCase() || '?'}
          </div>

          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{otherUser?.name || 'Conversation'}</h4>
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
          >
            <Pin size={16} />
          </motion.button>
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', position: 'relative' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 32, height: 32, border: '3px solid #D35400', borderTopColor: 'transparent', borderRadius: '50%' }} />
          </div>
        ) : shouldShowEmpty ? (
          <EmptyState
            type="search"
            title="No messages yet"
            description="Start the conversation by sending a message below."
            action={
              <span style={{ fontSize: '0.8rem', color: 'var(--color-body)' }}>
                Type a message in the input below to get started.
              </span>
            }
          />
        ) : (
          <AnimatePresence>
            {messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                message={msg}
                isOwn={msg.senderId?._id === currentUserId}
                onPin={(id) => pinMutation.mutate(id)}
                onUnpin={(id) => unpinMessage(conversationId, id)}
                onDelete={handleDelete}
                onEdit={handleEdit}
                isPinned={msg.isPinned}
              />
            ))}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        )}
      </div>

      <TypingIndicator users={[]} />

      <MessageInput
        onSend={handleSend}
        disabled={sendMutation.isPending || editMutation.isPending}
        placeholder={editingMessage ? 'Edit message...' : 'Type a message...'}
      />
    </div>
  );
};

export default MessageWindow;
