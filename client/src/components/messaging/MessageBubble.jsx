import React from 'react';
import { Check, CheckCheck, Pin, PinOff, Edit3, Trash2, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message, isOwn, onPin, onUnpin, onDelete, onEdit, isPinned }) => {
  const [showActions, setShowActions] = React.useState(false);

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      style={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '0.5rem',
        marginBottom: '0.75rem',
        position: 'relative',
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      role="listitem"
      aria-label={`Message from ${message.senderId?.name || 'Unknown'}`}
    >
      {isPinned && (
        <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
          <Pin size={12} color="#D35400" />
        </div>
      )}

      <div
        style={{
          maxWidth: '70%',
          padding: '0.75rem 1rem',
          borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
          backgroundColor: isOwn ? '#D35400' : '#F3F4F6',
          color: isOwn ? 'white' : '#1F2937',
          position: 'relative',
          wordBreak: 'break-word',
        }}
      >
        {!isOwn && (
          <div style={{ fontSize: '0.7rem', fontWeight: 700, marginBottom: '0.25rem', color: '#D35400' }}>
            {message.senderId?.name || 'Unknown'}
          </div>
        )}

        {message.content && <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>{message.content}</p>}

        {message.attachments?.length > 0 && (
          <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {message.attachments.map((att, idx) => (
              <a
                key={idx}
                href={att.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8rem',
                  color: isOwn ? '#FEF3C7' : '#D35400',
                  textDecoration: 'underline',
                }}
              >
                {att.type === 'image' ? '🖼️' : '📎'} {att.name}
              </a>
            ))}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginTop: '0.25rem',
            justifyContent: isOwn ? 'flex-end' : 'flex-start',
            opacity: 0.7,
          }}
        >
          <span style={{ fontSize: '0.65rem' }}>{formatTime(message.createdAt)}</span>
          {message.isEdited && <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>(edited)</span>}
          {isOwn && <span style={{ fontSize: '0.65rem' }}>{message.status === 'read' ? <CheckCheck size={12} /> : <Check size={12} />}</span>}
        </div>
      </div>

      {showActions && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            display: 'flex',
            gap: '0.25rem',
            backgroundColor: 'white',
            borderRadius: 8,
            padding: '0.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            position: 'absolute',
            top: -32,
            ...(isOwn ? { right: 0 } : { left: 0 }),
          }}
        >
          <button
            onClick={() => (message.isPinned ? onUnpin(message._id) : onPin(message._id))}
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'transparent',
              color: '#4A5568',
            }}
            aria-label={message.isPinned ? 'Unpin message' : 'Pin message'}
          >
            {message.isPinned ? <PinOff size={14} /> : <Pin size={14} />}
          </button>
          {isOwn && (
            <>
              <button
                onClick={() => onEdit(message)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  color: '#4A5568',
                }}
                aria-label="Edit message"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => onDelete(message._id)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  color: '#E74C3C',
                }}
                aria-label="Delete message"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default MessageBubble;
