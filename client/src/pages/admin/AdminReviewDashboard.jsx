import React, { useState, useEffect, useCallback } from 'react';
import { Shield } from 'lucide-react';
import { useAdminContributions } from '../../hooks/useAdminContributions';
import ContributionQueue from '../../components/admin/contributions/ContributionQueue';
import AdminContributionDetail from '../../components/admin/contributions/AdminContributionDetail';
import ReviewPanel from '../../components/admin/contributions/ReviewPanel';

const AdminReviewDashboard = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [screenSize, setScreenSize] = useState('md');

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      if (width >= 1200) setScreenSize('xl');
      else if (width >= 768) setScreenSize('md');
      else setScreenSize('sm');
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const { data, isLoading, error } = useAdminContributions({
    page: 1,
    limit: 12,
  });

  const contributions = data?.contributions || [];
  const contribution = contributions.find((c) => c._id === selectedId);

  const handleSelect = useCallback((contrib) => {
    setSelectedId(contrib._id);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedId(null);
  }, []);

  if (error) {
    return (
      <div className="page-container" style={{ padding: '2rem', color: 'var(--color-error)' }}>
        {error.message || 'Failed to load contributions'}
      </div>
    );
  }

  const isDesktop = screenSize === 'xl';
  const isTablet = screenSize === 'md';
  const isMobile = screenSize === 'sm';

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Shield size={20} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0' }}>Contribution Review</h1>
          <p style={{ color: 'var(--color-body)', margin: 0 }}>Review and manage volunteer contributions.</p>
        </div>
      </div>

      {!selectedId && (
        <ContributionQueue
          contributions={contributions}
          loading={isLoading}
          onSelect={handleSelect}
        />
      )}

      {!selectedId && (isTablet || isMobile) && (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--color-body)', background: 'var(--color-card)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)', marginTop: '1.5rem' }}>
          Select a contribution from the queue to review.
        </div>
      )}

      {isDesktop && selectedId && (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr 360px', gap: '1.5rem', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '1rem', maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto' }}>
            <ContributionQueue
              contributions={contributions}
              loading={isLoading}
              onSelect={handleSelect}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <AdminContributionDetail
              contributionId={selectedId}
              onBack={handleBack}
              hideReviewPanel
            />
          </div>
          <div style={{ position: 'sticky', top: '1rem', maxHeight: 'calc(100vh - 2rem)', overflowY: 'auto' }}>
            {contribution && (
              <ReviewPanel contribution={contribution} onClose={handleBack} />
            )}
          </div>
        </div>
      )}

      {(isTablet || isMobile) && selectedId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <button onClick={handleBack} className="btn btn-secondary" style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            &larr; Back to Queue
          </button>
          <AdminContributionDetail
            contributionId={selectedId}
            onBack={handleBack}
          />
        </div>
      )}
    </div>
  );
};

export default AdminReviewDashboard;
