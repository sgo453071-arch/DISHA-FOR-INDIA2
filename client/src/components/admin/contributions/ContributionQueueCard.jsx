import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Tag, FolderOpen } from 'lucide-react';
import ContributionStatusBadge from '../../contributions/ContributionStatusBadge';

const ContributionQueueCard = ({ contribution, onClick }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const volunteerName = contribution.submittedBy?.name || 'Unknown Volunteer';
  const volunteerInitials = (volunteerName || '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="card"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        cursor: 'pointer',
      }}
      onClick={() => onClick?.(contribution)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-heading)', marginBottom: '0.5rem', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {contribution.title}
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <ContributionStatusBadge status={contribution.status} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, background: 'var(--color-bg)', color: 'var(--color-body)', border: '1px solid var(--color-border)' }}>
              <FolderOpen size={12} /> {contribution.category?.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'var(--color-bg)', borderRadius: 'var(--radius-md)' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
          {volunteerInitials}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{volunteerName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-body)' }}>Submitted {formatDate(contribution.createdAt)}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {(contribution.tags || []).slice(0, 3).map((tag) => (
          <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.5rem', borderRadius: '9999px', background: 'rgba(5, 150, 105, 0.08)', color: 'var(--color-secondary)', fontSize: '0.75rem', fontWeight: 600 }}>
            <Tag size={10} /> {tag}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8rem', color: 'var(--color-body)' }}>
        <span>{contribution.currentVersion?.versionNumber || contribution.versions?.length || 1} version{(contribution.currentVersion?.versionNumber || contribution.versions?.length || 1) !== 1 ? 's' : ''}</span>
        <span>{contribution.hoursWorked || 0} hrs</span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onClick?.(contribution); }}
          style={{ padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--color-primary)', color: '#fff', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600 }}
        >
          <Eye size={14} /> Review
        </button>
      </div>
    </motion.div>
  );
};

export default ContributionQueueCard;
