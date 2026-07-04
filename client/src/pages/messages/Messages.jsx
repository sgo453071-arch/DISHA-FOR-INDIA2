import React, { useState } from 'react';
import { MessageSquare, Plus, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import ConversationList from '../../components/messaging/ConversationList';
import MessageWindow from '../../components/messaging/MessageWindow';
import { getConversations, createConversation } from '../../services/conversationsService';
import EmptyState from '../../components/volunteer/EmptyState';

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const res = await getConversations({ page: 1, limit: 50 });
      return res.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (res) => {
      const conversation = res.data?.conversation;
      if (conversation) {
        queryClient.invalidateQueries(['conversations']);
        setActiveConversation(conversation);
      }
      setShowCreateModal(false);
    },
  });

  const conversations = data?.conversations || [];

  const handleCreateConversation = () => {
    setShowCreateModal(true);
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation._id);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageSquare size={28} color="#D35400" />
          Messages
        </h1>
        <p style={{ margin: 0, color: 'var(--color-body)', fontSize: '0.9rem' }}>
          Chat with volunteers, organizations, and support team
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', height: 'calc(100vh - 200px)' }}>
        <ConversationList
          conversations={conversations}
          activeId={activeConversation}
          onSelect={handleSelectConversation}
          onCreateConversation={handleCreateConversation}
          isLoading={isLoading}
        />

        <div>
          {activeConversation ? (
            <MessageWindow
              conversationId={activeConversation}
              onBack={() => setActiveConversation(null)}
              currentUserId={user?._id}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#fff', borderRadius: 16, border: '1px solid var(--color-border)' }}>
              <EmptyState
                type="search"
                title="Select a conversation"
                description="Choose a conversation from the list or start a new one to begin messaging."
              />
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <NewConversationModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(data) => createMutation.mutate(data)}
          isSubmitting={createMutation.isPending}
        />
      )}
    </div>
  );
};

const NewConversationModal = ({ onClose, onCreate, isSubmitting }) => {
  const [participantIds, setParticipantIds] = useState('');
  const [type, setType] = useState('private');

  const handleSubmit = (e) => {
    e.preventDefault();
    const ids = participantIds.split(',').map((id) => id.trim()).filter(Boolean);
    onCreate({ participantIds: ids, type });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15,23,42,0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 16,
          padding: '2rem',
          width: '100%',
          maxWidth: 480,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-conversation-title"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 id="new-conversation-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>New Conversation</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568' }} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Participant IDs (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={participantIds}
              onChange={(e) => setParticipantIds(e.target.value)}
              placeholder="Enter user IDs separated by commas"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="form-control"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="private">Private</option>
              <option value="support">Support</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isSubmitting}>
              Cancel
            </button>
            <motion.button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={18} />
              {isSubmitting ? 'Creating...' : 'Create Conversation'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Messages;
