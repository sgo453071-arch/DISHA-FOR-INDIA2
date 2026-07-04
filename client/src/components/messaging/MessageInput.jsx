import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

const MessageInput = ({ onSend, placeholder = 'Type a message...', disabled = false, onTyping, onStopTyping }) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleSend = () => {
    if (!content.trim() && attachments.length === 0) return;
    onSend({ content: content.trim(), attachments });
    setContent('');
    setAttachments([]);
    if (onStopTyping) onStopTyping();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e) => {
    setContent(e.target.value);
    if (onTyping) {
      onTyping();
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        if (onStopTyping) onStopTyping();
      }, 2000);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        borderTop: '1px solid var(--color-border)',
        backgroundColor: '#fff',
        borderRadius: '0 0 16px 16px',
      }}
    >
      <button
        type="button"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F3F4F6',
          color: '#4A5568',
          flexShrink: 0,
        }}
        aria-label="Attach file"
      >
        <Paperclip size={18} />
      </button>

      <div style={{ flex: 1, position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            borderRadius: 12,
            border: '1px solid var(--color-border)',
            fontSize: '0.9rem',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
            maxHeight: 120,
            fontFamily: 'inherit',
          }}
          aria-label="Message input"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        disabled={disabled || (!content.trim() && attachments.length === 0)}
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: 'none',
          cursor: disabled || (!content.trim() && attachments.length === 0) ? 'not-allowed' : 'pointer',
          backgroundColor: '#D35400',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          opacity: disabled || (!content.trim() && attachments.length === 0) ? 0.5 : 1,
        }}
        aria-label="Send message"
      >
        <Send size={18} />
      </motion.button>
    </div>
  );
};

export default MessageInput;
