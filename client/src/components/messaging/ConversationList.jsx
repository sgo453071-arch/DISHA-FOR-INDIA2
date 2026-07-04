import React, { useState, useEffect } from 'react';
import { Search, Plus, Inbox, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationCard from './ConversationCard';
import { useQuery } from '@tanstack/react-query';

const ConversationList = ({ conversations, activeId, onSelect, unreadCounts = {}, onCreateConversation, isLoading }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredConversations = conversations?.filter((conv) => {
    const other = conv.participants?.find((p) => p._id !== conv._id) || conv.participants?.[0];
    const matchesSearch = other?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || conv.type === filterType;
    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff', borderRadius: 16, border: '1px solid var(--color-border)' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Messages</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCreateConversation}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#D35400',
              color: 'white',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            aria-label="New Conversation"
          >
            <Plus size={18} />
          </motion.button>
        </div>

        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem 0.6rem 2.25rem',
              borderRadius: 10,
              border: '1px solid var(--color-border)',
              fontSize: '0.85rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            aria-label="Search conversations"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'private', 'support'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: filterType === type ? '#D35400' : '#F3F4F6',
                color: filterType === type ? 'white' : '#4A5568',
                transition: 'all 0.2s',
              }}
              aria-pressed={filterType === type}
            >
              {type === 'all' ? 'All' : type === 'private' ? 'Private' : 'Support'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.75rem' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
            <Loader2 size={24} className="spinner" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <Inbox size={32} style={{ margin: '0 auto 0.75rem', color: '#D1D5DB' }} />
            <p style={{ fontSize: '0.85rem', color: 'var(--color-body)', margin: 0 }}>No conversations found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredConversations.map((conv) => (
              <motion.div
                key={conv._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <ConversationCard
                  conversation={conv}
                  isActive={conv._id === activeId}
                  onClick={() => onSelect(conv)}
                  unreadCount={unreadCounts[conv._id] || 0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
