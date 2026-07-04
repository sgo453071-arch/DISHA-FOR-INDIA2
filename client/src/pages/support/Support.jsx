import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Ticket, Search, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserTickets, getAllTickets, resolveTicket, closeTicket, assignTicket, createSupportTicket } from '../../services/supportTicketsService';
import EmptyState from '../../components/volunteer/EmptyState';

const Support = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user?.role?.toUpperCase());

  const { data, isLoading } = useQuery({
    queryKey: ['support-tickets', filter],
    queryFn: async () => {
      const res = isAdmin
        ? await getAllTickets({ page: 1, limit: 50, status: filter === 'all' ? null : filter })
        : await getUserTickets({ page: 1, limit: 50, status: filter === 'all' ? null : filter });
      return res.data || {};
    },
  });

  const tickets = data?.tickets || [];

  const resolveMutation = useMutation({
    mutationFn: ({ ticketId, resolution }) => resolveTicket(ticketId, resolution),
    onSuccess: () => {
      queryClient.invalidateQueries(['support-tickets']);
    },
  });

  const closeMutation = useMutation({
    mutationFn: (ticketId) => closeTicket(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries(['support-tickets']);
    },
  });

  const filteredTickets = tickets?.filter((ticket) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ticket.subject?.toLowerCase().includes(query) ||
      ticket.description?.toLowerCase().includes(query) ||
      ticket.ticketId?.toLowerCase().includes(query)
    );
  }) || [];

  const handleResolve = (ticket) => {
    const resolution = window.prompt('Enter resolution details:');
    if (resolution !== null && resolution.trim() !== '') {
      resolveMutation.mutate({ ticketId: ticket._id, resolution });
    }
  };

  const handleClose = (ticket) => {
    if (window.confirm('Are you sure you want to close this ticket?')) {
      closeMutation.mutate(ticket._id);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Ticket size={28} color="#D35400" />
            Support Tickets
          </h1>
          <p style={{ margin: 0, color: 'var(--color-body)', fontSize: '0.9rem' }}>
            Manage and track your support requests
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          Create Ticket
        </motion.button>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 250 }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            type="text"
            placeholder="Search tickets..."
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
            aria-label="Search tickets"
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: filter === status ? '#D35400' : '#F3F4F6',
                color: filter === status ? 'white' : '#4A5568',
                transition: 'all 0.2s',
              }}
              aria-pressed={filter === status}
            >
              {status === 'all' ? 'All' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 40, height: 40, border: '4px solid #D35400', borderTopColor: 'transparent', borderRadius: '50%' }} />
        </div>
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          type="applications"
          title="No tickets found"
          description="You don't have any support tickets yet or try adjusting your filters."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <AnimatePresence>
            {filteredTickets.map((ticket) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                whileHover={{ scale: 1.005 }}
                style={{
                  background: 'white',
                  borderRadius: 12,
                  padding: '1rem 1.25rem',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{ticket.subject}</h4>
                      <span className={`badge badge-${ticket.priority === 'critical' ? 'red' : ticket.priority === 'high' ? 'orange' : 'blue'}`}>
                        {ticket.priority}
                      </span>
                      <span className={`badge badge-${ticket.status === 'open' ? 'blue' : ticket.status === 'resolved' ? 'green' : 'orange'}`}>
                        {ticket.status}
                      </span>
                    </div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--color-body)' }}>
                      {ticket.description?.substring(0, 120)}{ticket.description?.length > 120 ? '...' : ''}
                    </p>
                    <span style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>ID: {ticket.ticketId}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {showCreateModal && (
        <CreateTicketModal
          onClose={() => setShowCreateModal(false)}
          isSubmitting={false}
        />
      )}
    </div>
  );
};

const CreateTicketModal = ({ onClose, isSubmitting }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const mutation = useMutation({
    mutationFn: (data) => createSupportTicket(data),
    onSuccess: () => {
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ subject, description, category });
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
        aria-labelledby="create-ticket-title"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 id="create-ticket-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Create Support Ticket</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4A5568' }} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-control"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              required
              maxLength={255}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="general">General</option>
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your issue in detail..."
              rows={5}
              required
              maxLength={2000}
            />
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
              {isSubmitting ? 'Creating...' : 'Create Ticket'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Support;
