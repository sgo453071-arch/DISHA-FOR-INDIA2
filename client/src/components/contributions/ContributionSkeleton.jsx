import React from 'react';

const ContributionSkeleton = ({ count = 6 }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="skeleton" style={{ height: '20px', width: '70%', borderRadius: '4px' }} />
          <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '4px' }} />
          <div className="skeleton" style={{ height: '60px', width: '100%', borderRadius: 'var(--radius-md)' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="skeleton" style={{ height: '24px', width: '80px', borderRadius: '99px' }} />
            <div className="skeleton" style={{ height: '24px', width: '60px', borderRadius: '99px' }} />
          </div>
          <div className="skeleton" style={{ height: '36px', width: '100%', borderRadius: 'var(--radius-md)' }} />
        </div>
      ))}
    </div>
  );
};

export default ContributionSkeleton;
