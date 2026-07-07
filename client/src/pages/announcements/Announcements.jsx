import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, AlertCircle, RefreshCw } from 'lucide-react';
import { getAnnouncements } from '../../services/announcementsService';
import { useAuth } from '../../context/AuthContext';
import AnnouncementCard from '../../components/announcements/AnnouncementCard';
import AnnouncementBanner from '../../components/announcements/AnnouncementBanner';
import AnnouncementFilters from '../../components/announcements/AnnouncementFilters';
import AnnouncementSkeleton from '../../components/announcements/AnnouncementSkeleton';
import AnnouncementEmptyState from '../../components/announcements/AnnouncementEmptyState';
import AnnouncementPagination from '../../components/announcements/AnnouncementPagination';

const PAGE_SIZE = 9;

const Announcements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [error, setError] = useState(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const params = useMemo(() => {
    const p = { page, limit: PAGE_SIZE, sortBy: 'createdAt', order: 'desc' };
    if (search) p.search = search;
    if (type) p.type = type;
    if (priority) p.priority = priority;
    if (targetAudience) p.targetAudience = targetAudience;
    return p;
  }, [page, search, type, priority, targetAudience]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['announcements', params],
    queryFn: async () => {
      setError(null);
      const res = await getAnnouncements(params);
      if (res.success) {
        return { announcements: res.data?.announcements || [], total: res.data?.pagination?.total || 0, page: res.data?.pagination?.page || 1, totalPages: res.data?.pagination?.totalPages || 1 };
      }
      throw new Error(res.message || 'Failed to load announcements');
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    enabled: !!user,
  });

  const announcements = data?.announcements || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const topAnnouncement = useMemo(() => {
    if (bannerDismissed || announcements.length === 0) return null;
    return announcements.find((a) => a.priority === 'critical' || a.status === 'published') || announcements[0];
  }, [announcements, bannerDismissed]);

  const listAnnouncements = useMemo(() => {
    if (!topAnnouncement || bannerDismissed) return announcements;
    return announcements.filter((a) => (a._id || a.announcementId) !== (topAnnouncement._id || topAnnouncement.announcementId));
  }, [announcements, topAnnouncement, bannerDismissed]);

  return (
    <div style={{ padding: 'clamp(1rem, 3vw, 2rem)', maxWidth: 1240, margin: '0 auto', minHeight: '100vh' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', marginBottom: '0.5rem' }}>
          ← Dashboard
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
          <Info size={26} style={{ color: 'var(--color-primary)', flexShrink: 0 }} aria-hidden="true" />
          <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 800, color: 'var(--color-heading)', margin: 0 }}>Announcements</h1>
        </div>
        <p style={{ color: 'var(--color-body)', margin: 0, fontSize: '0.95rem' }}>Stay informed with the latest updates, events, and important notices.</p>
      </div>

      <AnnouncementFilters search={search} onSearchChange={setSearch} type={type} onTypeChange={setType} priority={priority} onPriorityChange={setPriority} targetAudience={targetAudience} onTargetAudienceChange={setTargetAudience} showAdminFilters={false} onClear={() => { setSearch(''); setType(''); setPriority(''); setTargetAudience(''); }} />

      <AnimatePresence>
        {!bannerDismissed && topAnnouncement && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <AnnouncementBanner announcement={topAnnouncement} onClose={() => setBannerDismissed(true)} />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '1rem 1.25rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-md)', color: 'var(--color-error)', marginBottom: '1.5rem' }} role="alert">
          <AlertCircle size={18} aria-hidden="true" /> {error}
        </motion.div>
      )}

      {isFetching && !isLoading && (
        <div style={{ marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--color-body)', display: 'flex', alignItems: 'center', gap: '0.4rem' }} aria-live="polite">
          <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} aria-hidden="true" /> Refreshing...
        </div>
      )}

      {isLoading ? (
        <AnnouncementSkeleton count={PAGE_SIZE} />
      ) : announcements.length === 0 && !error ? (
        <AnnouncementEmptyState title="No announcements found" description="Try adjusting your filters or check back later for updates." />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {listAnnouncements.map((announcement) => (
              <AnnouncementCard key={announcement._id || announcement.announcementId} announcement={announcement} onClick={() => navigate(`/announcements/${announcement._id || announcement.announcementId}`)} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--color-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
              <AnnouncementPagination currentPage={page} totalPages={totalPages} totalItems={total} itemsPerPage={PAGE_SIZE} onPageChange={(newPage) => { setPage(newPage); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Announcements;
