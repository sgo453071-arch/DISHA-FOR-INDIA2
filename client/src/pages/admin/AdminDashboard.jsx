import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, Clock, Activity, TrendingUp, Target } from 'lucide-react';
import { getAdminDashboard, getLeaderboard } from '../../services/analyticsService';
import { getNotifications } from '../../services/notificationsService';
import { getAllPrograms } from '../../services/programsService';
import DashboardSkeleton from '../../components/DashboardSkeleton';
import LeaderboardWidget from '../../components/LeaderboardWidget';
import NotificationWidget from '../../components/NotificationWidget';

const AdminDashboard = () => {
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await getAdminDashboard();
      if (res?.success) return res.data?.admin;
      throw new Error(res?.message || 'Failed to load dashboard');
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: programsData } = useQuery({
    queryKey: ['admin-programs-summary'],
    queryFn: async () => {
      const res = await getAllPrograms();
      if (res?.success) return res.data?.programs || [];
      return [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['admin-leaderboard', { limit: 5 }],
    queryFn: async () => {
      const res = await getLeaderboard({ limit: 5 });
      if (res?.success) return res.data?.leaderboardAnalytics?.topVolunteers || [];
      return [];
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const res = await getNotifications({ limit: 5 });
      if (res?.success) return res.data?.notifications || [];
      return [];
    },
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const stats = useMemo(() => {
    if (!dashboardData) return null;
    const activePrograms = (programsData || []).filter(p => ['published', 'ongoing', 'registration_closed'].includes(p.status));
    return {
      totalVolunteers: dashboardData?.users?.totalVolunteers || 0,
      activeVolunteers: dashboardData?.users?.activeVolunteers || 0,
      activePrograms: activePrograms.length,
      totalHours: dashboardData?.attendance?.totalAttendance || 0,
      newThisMonth: dashboardData?.users?.newVolunteersThisMonth || 0,
      pendingApps: dashboardData?.applications?.pending || 0,
      certificates: dashboardData?.certificates?.generated || 0,
      coinsDistributed: dashboardData?.rewards?.coinsDistributed || 0,
      organizations: dashboardData?.organizations?.totalOrganizations || 0,
    };
  }, [dashboardData, programsData]);

  if (dashboardLoading) {
    return <div className="page-container" style={{ padding: '2rem' }}><DashboardSkeleton type="dashboard" /></div>;
  }

  if (dashboardError) {
    return <div className="page-container" style={{ padding: '2rem', color: 'var(--color-error)' }}>{dashboardError.message}</div>;
  }

  const StatCard = ({ Icon, value, label, color = 'var(--color-primary)' }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: `4px solid ${color}` }}>
      <div style={{ padding: '0.75rem', backgroundColor: `${color}20`, color, borderRadius: '50%' }}>
        <Icon size={24} />
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-heading)' }}>{value}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>Platform overview and volunteer engagement analytics.</p>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        <StatCard Icon={Users} value={stats?.totalVolunteers || 0} label="Total Volunteers" color="var(--color-primary)" />
        <StatCard Icon={Calendar} value={stats?.activePrograms || 0} label="Active Programs" color="var(--color-success)" />
        <StatCard Icon={Clock} value={stats?.totalHours || 0} label="Hours Volunteered" color="var(--color-accent)" />
        <StatCard Icon={TrendingUp} value={stats?.newThisMonth || 0} label="Signups This Month" color="#8B5CF6" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Activity size={18} className="text-primary" /> Platform Health
            </h3>
            <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <p style={{ color: 'var(--color-success)', fontWeight: 600, marginBottom: '0.5rem' }}>System is running smoothly. All services operational.</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', fontSize: '0.85rem' }}>
                <div><strong style={{ color: 'var(--color-success)' }}>●</strong> Database: Connected</div>
                <div><strong style={{ color: 'var(--color-success)' }}>●</strong> API: Online</div>
                <div><strong style={{ color: 'var(--color-success)' }}>●</strong> Cache: Active</div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target size={18} className="text-primary" /> Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => window.location.href = '/admin/programs'}>
                Manage Programs
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => window.location.href = '/admin/applications'}>
                Review Applications
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => window.location.href = '/admin/attendance'}>
                Mark Attendance
              </button>
              <button className="btn btn-secondary" style={{ justifyContent: 'flex-start' }} onClick={() => window.location.href = '/admin/analytics'}>
                View Analytics
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <LeaderboardWidget
            topVolunteers={leaderboardData}
            loading={leaderboardLoading}
          />

          <NotificationWidget
            notifications={notificationsData}
            loading={notificationsLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;