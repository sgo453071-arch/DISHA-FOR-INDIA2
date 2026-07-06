import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Award, Clock, Briefcase, Sparkles, AlertCircle, ArrowUpRight, ChevronRight } from 'lucide-react';
import { getVolunteerDashboard, getMyRank, getLeaderboard } from '../services/analyticsService';
import { getNotifications } from '../services/notificationsService';
import { getMyLevel, getMyBadges, getMyRewards } from '../services/gamificationService';
import { useAuth } from '../context/AuthContext';
import { getMyPrograms } from '../services/programsService';
import DashboardSkeleton from '../components/DashboardSkeleton';
import LeaderboardWidget from '../components/LeaderboardWidget';
import NotificationWidget from '../components/NotificationWidget';
import RecentAnnouncementsWidget from '../components/announcements/RecentAnnouncementsWidget';
import RecentActivityWidget from '../components/collaboration/RecentActivityWidget';
import { safeSlice } from '../utils/safeSlice';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['volunteer-dashboard'],
    queryFn: async () => {
      const res = await getVolunteerDashboard();
      if (res.success) return res.data?.volunteer || null;
      throw new Error(res.message || 'Failed to load dashboard');
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: rankData } = useQuery({
    queryKey: ['my-rank'],
    queryFn: async () => {
      const res = await getMyRank();
      if (res.success) return res.data?.rank || null;
      return null;
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ['leaderboard', { limit: 5 }],
    queryFn: async () => {
      const res = await getLeaderboard({ limit: 5 });
      if (res.success) return res.data?.leaderboardAnalytics?.topVolunteers || [];
      return [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await getNotifications({ limit: 5 });
      if (res.success) return res.data?.notifications || [];
      return [];
    },
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: gamificationData } = useQuery({
    queryKey: ['gamification'],
    queryFn: async () => {
      const [levelRes, badgesRes, pointsRes] = await Promise.all([
        getMyLevel(),
        getMyBadges(),
        getMyRewards(),
      ]);
      return {
        points: pointsRes.success ? pointsRes.data?.totalPoints || 0 : 0,
        level: levelRes.success ? levelRes.data?.currentLevel?.name || 'Beginner' : 'Beginner',
        badges: badgesRes.success ? badgesRes.data?.badges || [] : [],
      };
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: programsData } = useQuery({
    queryKey: ['my-programs'],
    queryFn: async () => {
      const res = await getMyPrograms();
      if (res.success) return res.data?.programs || [];
      return [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: recentActivityData, isLoading: recentActivityLoading } = useQuery({
    queryKey: ['collaboration-recent-activity'],
    queryFn: async () => {
      const res = await getUserRecentActivity();
      if (res.success) return res.data?.activities || [];
      return [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const displayName = user?.name || 'Volunteer';
  const firstName = displayName.split(' ')[0];
  const points = gamificationData?.points || 0;
  const level = gamificationData?.level || 'Beginner';
  const profileCompletion = user?.profileCompletion ?? 65;

  const stats = useMemo(() => {
    if (!dashboardData) return null;
    return {
      totalHours: dashboardData.totalHours,
      programsJoined: dashboardData.totalProgramsJoined,
      activePrograms: dashboardData.activePrograms,
      completedPrograms: dashboardData.completedPrograms,
      pendingApplications: dashboardData.pendingApplications,
      coins: dashboardData.currentCoins,
      rank: dashboardData.rank,
      certificates: dashboardData.certificatesEarned,
      rewards: dashboardData.rewards,
    };
  }, [dashboardData]);

  const statCards = [
    { label: 'XP Points', value: points, icon: <Sparkles size={20} />, color: '#D35400', bg: '#FFF3ED', note: 'Earned' },
    { label: 'Hours Served', value: stats?.totalHours ?? 0, icon: <Clock size={20} />, color: '#059669', bg: '#D1FAE5', note: 'Lifetime', onClick: () => navigate('/attendance/hours') },
    { label: 'Programs', value: stats?.programsJoined ?? 0, icon: <Briefcase size={20} />, color: '#7C3AED', bg: '#EDE9FE', note: `${stats?.activePrograms ?? 0} Active`, onClick: () => navigate('/my-programs') },
    { label: 'Certificates', value: stats?.certificates ?? 0, icon: <Award size={20} />, color: '#D97706', bg: '#FEF3C7', note: 'Verified', onClick: () => navigate('/certificates') },
  ];

  const joinedPrograms = programsData || [];
  const activePrograms = joinedPrograms.filter(p => p.status === 'ongoing' || p.status === 'active');
  const pendingApps = (joinedPrograms || []).filter(a => a.status === 'pending' || a.status === 'under_review');

  if (dashboardLoading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F7F4', fontFamily: 'var(--font-primary)' }}>
        <main style={{ flex: 1, padding: '2rem' }}>
          <DashboardSkeleton type="dashboard" />
        </main>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div style={{ padding: '2rem', color: 'var(--color-error)' }}>
        Failed to load dashboard. Please try again later.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F7F4', fontFamily: 'var(--font-primary)', paddingTop: '64px' }}>
      <main style={{ flex: 1, padding: '2rem 2rem 3rem', maxWidth: '100%', overflowX: 'hidden' }}>
        <div style={{ background: 'linear-gradient(135deg, #D35400, #E67E22)', borderRadius: 20, padding: '2rem 2.5rem', marginBottom: '2rem', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 30px rgba(211,84,0,0.25)' }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'white', fontWeight: 800, marginBottom: '0.5rem' }}>
              Hello, {firstName}! 👋
            </h2>
            <p style={{ opacity: 0.9, maxWidth: 560, fontSize: '0.95rem', lineHeight: 1.65, marginBottom: '1.5rem' }}>
              Welcome back to your dashboard. You are at the <strong style={{ color: '#FEF3C7' }}>{level}</strong> level. Keep up the amazing work!
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link to="/programs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.575rem 1.125rem', borderRadius: 8, background: 'white', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                Explore Programs
              </Link>
            </div>
          </div>
          <div style={{ position: 'absolute', right: '-20px', bottom: '-30px', opacity: 0.1, transform: 'rotate(-15deg)' }}>
            <Sparkles size={200} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {statCards.map((card, i) => (
            <div
              key={i}
              onClick={card.onClick}
              style={{ background: 'white', borderRadius: 16, padding: '1.25rem 1.5rem', border: '1px solid #F0EDE8', display: 'flex', alignItems: 'center', gap: '1rem', cursor: card.onClick ? 'pointer' : 'default', transition: 'all 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: card.bg, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-body)', fontWeight: 600, marginBottom: '0.2rem' }}>{card.label}</div>
                <div style={{ fontSize: '1.6rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-heading)', lineHeight: 1, marginBottom: '0.15rem' }}>{card.value}</div>
                <div style={{ fontSize: '0.7rem', color: card.color, fontWeight: 700 }}>{card.note}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-heading)', fontWeight: 700, margin: 0 }}>Current Activity</h3>
                <Link to="/applications" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
                  View All <ChevronRight size={14} />
                </Link>
              </div>

              {!joinedPrograms?.length && !pendingApps?.length ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-body)', background: '#FDFBF7', borderRadius: 12 }}>
                  <Briefcase size={32} style={{ margin: '0 auto 0.75rem', color: '#D1D5DB' }} />
                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>No active programs or pending applications.</p>
                  <Link to="/programs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 8, background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
                    Find a Program
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {safeSlice(activePrograms, 0, 2).map(prog => (
                    <div key={prog.id || prog._id} style={{ padding: '1rem 1.125rem', border: '1px solid #D1FAE5', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F0FDF4' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-heading)', fontWeight: 700, marginBottom: '0.3rem', margin: 0 }}>{prog.title || prog.programTitle}</h4>
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', fontWeight: 600 }}>
                          Active
                        </span>
                      </div>
                      <Link to="/attendance" style={{ padding: '0.45rem 0.875rem', borderRadius: 8, background: 'var(--color-primary)', color: 'white', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none' }}>
                        Mark Attendance
                      </Link>
                    </div>
                  ))}
                  {safeSlice(pendingApps, 0, 2).map(app => (
                    <div key={app.id || app._id} style={{ padding: '1rem 1.125rem', border: '1px solid #F0EDE8', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-heading)', fontWeight: 700, margin: 0, marginBottom: '0.3rem' }}>{app.title || app.programTitle}</h4>
                        <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', fontWeight: 600 }}>
                          Under Review
                        </span>
                      </div>
                      <Link to={`/applications/${app.id || app._id}`} style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                        Details <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {profileCompletion < 100 && (
              <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '2px solid #FEF3C7', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <AlertCircle style={{ color: '#D97706' }} size={20} />
                    <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-heading)' }}>Complete Your Profile</h4>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#D97706' }}>{profileCompletion}%</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-body)', marginBottom: '1rem', lineHeight: 1.6 }}>
                  Fill in your skills and interests to unlock program registrations and level up.
                </p>
                <div style={{ height: 6, background: '#FEF3C7', borderRadius: 99, overflow: 'hidden', marginBottom: '1.125rem' }}>
                  <div style={{ width: `${profileCompletion}%`, height: '100%', background: '#D97706', borderRadius: 99, transition: 'width 0.5s ease' }} />
                </div>
                <Link to="/profile/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.5rem 1rem', borderRadius: 8, border: '1.5px solid #D97706', color: '#D97706', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}>
                  Complete Setup <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <LeaderboardWidget
              topVolunteers={leaderboardData}
              loading={false}
              currentRank={rankData}
            />

            <NotificationWidget
              notifications={notificationsData}
              loading={notificationsLoading}
              emptyMessage="No notifications at the moment."
            />

            <RecentActivityWidget
              activities={recentActivityData}
              loading={recentActivityLoading}
            />

            <RecentAnnouncementsWidget limit={4} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;