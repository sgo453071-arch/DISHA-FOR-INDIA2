import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getMyLevel, getMyBadges, getMyRewards } from '../services/gamificationService';
import { getMyCertificates } from '../services/certificateService';
import {
  Award,
  Clock,
  Briefcase,
  Award as CertIcon,
  Sparkles,
  AlertCircle,
  ArrowUpRight,
  PlayCircle,
  ShieldCheck,
  FileText,
  Trophy,
  LayoutDashboard,
  Heart,
  Bell,
  Settings,
  LogOut,
  Star,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useVolunteer } from '../context/VolunteerContext';
import SkeletonLoader from '../components/volunteer/SkeletonLoader';
import StatusBadge from '../components/volunteer/StatusBadge';
import { safeSlice } from '../utils/safeSlice';

// Sidebar link data
const sidebarLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
  { label: 'My Programs', path: '/my-programs', icon: <Briefcase size={18} /> },
  { label: 'Volunteer Hours', path: '/attendance/hours', icon: <Clock size={18} /> },
  { label: 'Certificates', path: '/certificates', icon: <CertIcon size={18} /> },
  { label: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={18} /> },
  { label: 'Applications', path: '/applications', icon: <FileText size={18} /> },
  { label: 'Attendance', path: '/attendance', icon: <ShieldCheck size={18} /> },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const {
    volunteerHours,
    fetchVolunteerHours,
    applications,
    fetchApplications,
    joinedPrograms,
    fetchJoinedPrograms,
    checkInStatus,
    fetchAttendanceDashboard,
    applicationsLoading
  } = useVolunteer();

  const [gamification, setGamification] = useState({
    points: 0,
    level: 'Beginner',
    badges: [],
    certsCount: 0,
    loading: true
  });

  useEffect(() => {
    fetchVolunteerHours();
    fetchApplications();
    fetchJoinedPrograms();
    fetchAttendanceDashboard();

    const fetchGamification = async () => {
      try {
        const [levelRes, badgesRes, pointsRes, certsRes] = await Promise.all([
          getMyLevel(),
          getMyBadges(),
          getMyRewards(),
          getMyCertificates()
        ]);

        setGamification({
          points: pointsRes.success ? pointsRes.data?.totalPoints || 0 : 0,
          level: levelRes.success ? levelRes.data?.currentLevel?.name || 'Beginner' : 'Beginner',
          badges: badgesRes.success ? badgesRes.data?.badges || [] : [],
          certsCount: certsRes.success ? certsRes.data?.certificates?.length || 0 : 0,
          loading: false
        });
      } catch (err) {
        console.error('Error fetching gamification stats:', err);
        setGamification(prev => ({ ...prev, loading: false }));
      }
    };
    fetchGamification();
  }, [fetchVolunteerHours, fetchApplications, fetchJoinedPrograms, fetchAttendanceDashboard]);

  const displayName = user?.name || 'Volunteer';
  const firstName = displayName.split(' ')[0];
  const points = gamification.points;
  const level = gamification.level;
  const profileCompletion = user?.profileCompletion ?? 65;
  const hours = volunteerHours?.lifetime || user?.hoursCompleted || 0;
  const activePrograms = joinedPrograms.filter(p => p.status === 'active');
  const programsCount = joinedPrograms.length || user?.programsJoined || 0;
  const certsCount = gamification.certsCount;
  const pendingApps = applications.filter(a => a.status === 'pending' || a.status === 'under_review');

  const statCards = [
    { label: 'XP Points', value: points, icon: <Sparkles size={20} />, color: '#D35400', bg: '#FFF3ED', note: 'Earned' },
    { label: 'Hours Served', value: hours, icon: <Clock size={20} />, color: '#059669', bg: '#D1FAE5', note: 'Lifetime', onClick: () => navigate('/attendance/hours') },
    { label: 'Programs', value: programsCount, icon: <Briefcase size={20} />, color: '#7C3AED', bg: '#EDE9FE', note: `${activePrograms.length} Active`, onClick: () => navigate('/my-programs') },
    { label: 'Certificates', value: certsCount, icon: <Award size={20} />, color: '#D97706', bg: '#FEF3C7', note: 'Verified', onClick: () => navigate('/certificates') },
  ];

  const currentPath = '/dashboard';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F7F4', fontFamily: 'var(--font-primary)', paddingTop: '64px' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 240, flexShrink: 0, background: '#111827', display: 'flex', flexDirection: 'column', position: 'fixed', top: 64, bottom: 0, left: 0, overflowY: 'auto', zIndex: 50 }}>

        {/* User Profile Mini */}
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #1F2937' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{displayName}</div>
              <div style={{ fontSize: '0.7rem', color: '#F97316', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Star size={10} fill="#F97316" /> {level}
              </div>
            </div>
          </div>
          {/* XP Progress Bar */}
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 600 }}>XP Progress</span>
              <span style={{ fontSize: '0.65rem', color: '#F97316', fontWeight: 700 }}>{points} pts</span>
            </div>
            <div style={{ height: 4, background: '#1F2937', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min((points / 200) * 100, 100)}%`, background: 'var(--color-primary)', borderRadius: 99, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {sidebarLinks.map((link) => {
            const isActive = link.path === currentPath;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  padding: '0.625rem 0.875rem', borderRadius: 8,
                  fontSize: '0.85rem', fontWeight: 600,
                  color: isActive ? 'white' : '#9CA3AF',
                  background: isActive ? 'rgba(211,84,0,0.2)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  borderLeft: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'white'; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; } }}
              >
                {link.icon} {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid #1F2937', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <Link to="/profile/setup" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, color: '#9CA3AF', textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'white'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#9CA3AF'; e.currentTarget.style.background = 'transparent'; }}
          >
            <Settings size={18} /> Settings
          </Link>
          <button
            onClick={async () => { await logout(); navigate('/'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, marginLeft: 240, padding: '2rem 2rem 3rem', maxWidth: '100%', overflowX: 'hidden' }}>

        {/* Welcome Banner */}
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
              {activePrograms.length > 0 && !checkInStatus.checkedIn && (
                <button
                  onClick={() => navigate('/attendance/check-in')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.575rem 1.125rem', borderRadius: 8, background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(8px)' }}
                >
                  <PlayCircle size={16} /> Quick Check-In
                </button>
              )}
              {checkInStatus.checkedIn && (
                <button
                  onClick={() => navigate('/attendance/checkout')}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.575rem 1.125rem', borderRadius: 8, background: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 700, fontSize: '0.875rem', border: '1px solid rgba(255,255,255,0.35)', cursor: 'pointer' }}
                >
                  End Session
                </button>
              )}
            </div>
          </div>
          {/* Decorative sparkle */}
          <div style={{ position: 'absolute', right: '-20px', bottom: '-30px', opacity: 0.1, transform: 'rotate(-15deg)' }}>
            <Sparkles size={200} />
          </div>
        </div>

        {/* Stat Cards */}
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

        {/* Two-column layout: Activity + Level Perks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>

          {/* Left: Current Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #F0EDE8', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--color-heading)', fontWeight: 700, margin: 0 }}>Current Activity</h3>
                <Link to="/applications" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  View All <ChevronRight size={14} />
                </Link>
              </div>

              {applicationsLoading ? (
                <SkeletonLoader type="list" count={2} />
              ) : pendingApps.length > 0 || activePrograms.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                  {safeSlice(activePrograms, 0, 2).map(prog => (
                    <div key={prog.id} style={{ padding: '1rem 1.125rem', border: '1px solid #D1FAE5', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F0FDF4' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-heading)', fontWeight: 700, marginBottom: '0.3rem', margin: 0 }}>{prog.programTitle}</h4>
                        <StatusBadge status={prog.status} />
                      </div>
                      <Link to="/attendance" style={{ padding: '0.45rem 0.875rem', borderRadius: 8, background: 'var(--color-primary)', color: 'white', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', transition: 'background 0.2s' }}>
                        Mark Attendance
                      </Link>
                    </div>
                  ))}
                  {safeSlice(pendingApps, 0, 2).map(app => (
                    <div key={app.id} style={{ padding: '1rem 1.125rem', border: '1px solid #F0EDE8', borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                      <div>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--color-heading)', fontWeight: 700, margin: 0, marginBottom: '0.3rem' }}>{app.programTitle}</h4>
                        <StatusBadge status={app.status} />
                      </div>
                      <Link to={`/applications/${app.id}`} style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
                        Details <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-body)', background: '#FDFBF7', borderRadius: 12 }}>
                  <Briefcase size={32} style={{ margin: '0 auto 0.75rem', color: '#D1D5DB' }} />
                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>No active programs or pending applications.</p>
                  <Link to="/programs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 8, background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none' }}>
                    Find a Program
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Completion Card */}
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
                <Link to="/profile/setup" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.5rem 1rem', borderRadius: 8, border: '1.5px solid #D97706', color: '#D97706', fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s' }}>
                  Complete Setup <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>

          {/* Right: Level Perks + Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Level Perks */}
            <div style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', borderRadius: 16, padding: '1.5rem', border: '1px solid #FDE68A' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.875rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={18} color="white" />
                </div>
                <h4 style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: '#78350F' }}>Level Perks</h4>
              </div>
              <p style={{ fontSize: '0.83rem', color: '#92400E', marginBottom: '1rem', lineHeight: 1.65 }}>
                You are a <strong>{level}</strong> volunteer. Earn{' '}
                <strong style={{ color: '#D97706' }}>{Math.max(200 - points, 50)} pts</strong> more to reach the next level!
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {['Verified profile badge', 'Access to offline local drives', 'Custom certificate downloads (Contributor+)'].map((perk, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', fontSize: '0.8rem', color: i === 2 ? '#B45309' : '#78350F', opacity: i === 2 ? 0.6 : 1 }}>
                    <span style={{ color: '#F59E0B', flexShrink: 0 }}>✦</span> {perk}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Navigation */}
            <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', border: '1px solid #F0EDE8' }}>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-heading)', margin: '0 0 1rem 0' }}>Quick Navigation</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {[
                  { icon: <FileText size={15} />, label: 'Track Applications', path: '/applications' },
                  { icon: <Clock size={15} />, label: 'Log Attendance', path: '/attendance' },
                  { icon: <Trophy size={15} />, label: 'Leaderboard Standings', path: '/leaderboard' },
                  { icon: <Award size={15} />, label: 'My Certificates', path: '/certificates' },
                ].map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.75rem', borderRadius: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)', textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#FDFBF7'; e.currentTarget.style.color = 'var(--color-primary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-body)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {item.icon} {item.label}
                    </div>
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
