import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, Award, TrendingUp, Target, Activity, Medal, Gift, Building2 } from 'lucide-react';
import { getAdminDashboard, getVolunteerAnalytics, getProgramAnalytics, getApplicationAnalytics, getAttendanceAnalytics, getCertificateAnalytics, getRewardAnalytics, getLeaderboardAnalytics, getOrganizationAnalytics } from '../../services/analyticsService';
import SkeletonLoader from '../../components/volunteer/SkeletonLoader';

const DATE_RANGES = [
  { value: '', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'last_3_months', label: 'Last 3 Months' },
  { value: 'last_6_months', label: 'Last 6 Months' },
  { value: 'last_year', label: 'Last Year' },
];

const AdminAnalytics = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('this_month');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    if (activeTab !== 'dashboard') {
      fetchAnalytics();
    }
  }, [activeTab, dateRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboard();
      if (res?.success) {
        setDashboardStats(res.data?.admin);
      } else {
        setError(res?.message || 'Failed to load dashboard statistics');
      }
    } catch (err) {
      setError(err?.message || 'Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      let res;
      switch (activeTab) {
        case 'volunteers':
          res = await getVolunteerAnalytics(dateRange || null);
          break;
        case 'programs':
          res = await getProgramAnalytics(dateRange || null);
          break;
        case 'applications':
          res = await getApplicationAnalytics(dateRange || null);
          break;
        case 'attendance':
          res = await getAttendanceAnalytics(dateRange || null);
          break;
        case 'certificates':
          res = await getCertificateAnalytics(dateRange || null);
          break;
        case 'rewards':
          res = await getRewardAnalytics(dateRange || null);
          break;
        case 'leaderboard':
          res = await getLeaderboardAnalytics(10);
          break;
        case 'organizations':
          res = await getOrganizationAnalytics(dateRange || null);
          break;
        default:
          return;
      }
      if (res?.success) {
        setAnalytics(res.data);
      } else {
        setError(res?.message || 'Failed to load analytics data');
      }
    } catch (err) {
      setError(err?.message || 'Failed to load analytics data');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  if (loading) return <div className="page-container" style={{ padding: '2rem' }}><SkeletonLoader type="dashboard" /></div>;
  if (error) return <div className="page-container" style={{ padding: '2rem', color: 'var(--color-error)' }}>{error}</div>;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', Icon: Activity },
    { id: 'volunteers', label: 'Volunteers', Icon: Users },
    { id: 'programs', label: 'Programs', Icon: Calendar },
    { id: 'applications', label: 'Applications', Icon: Target },
    { id: 'attendance', label: 'Attendance', Icon: Clock },
    { id: 'certificates', label: 'Certificates', Icon: Award },
    { id: 'rewards', label: 'Rewards', Icon: Gift },
    { id: 'leaderboard', label: 'Leaderboard', Icon: Medal },
    { id: 'organizations', label: 'Organizations', Icon: Building2 },
  ];

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>Platform Analytics</h1>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>Comprehensive analytics and reporting for Disha for India platform.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <tab.Icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard View */}
      {activeTab === 'dashboard' && dashboardStats && (
        <DashboardView stats={dashboardStats} />
      )}

      {/* Analytics Views */}
      {activeTab !== 'dashboard' && (
        <div>
          {/* Date Range Filter (except leaderboard) */}
          {activeTab !== 'leaderboard' && (
            <div style={{ marginBottom: '1rem' }}>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="form-input"
                style={{ maxWidth: '200px' }}
              >
                {DATE_RANGES.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          )}

          {analyticsLoading ? (
            <SkeletonLoader type="dashboard" />
          ) : analytics ? (
            <AnalyticsView type={activeTab} data={analytics} />
          ) : null}
        </div>
      )}
    </div>
  );
};

const DashboardView = ({ stats }) => {
  const StatCard = ({ Icon, value, label, color }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ padding: '0.75rem', backgroundColor: `${color}20`, color, borderRadius: '50%' }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-heading)' }}>{value}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>{label}</div>
      </div>
    </div>
  );

  return (
    <div>
      {/* User Stats */}
      <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
        <StatCard Icon={Users} value={stats?.users?.totalVolunteers || 0} label="Total Volunteers" color="var(--color-primary)" />
        <StatCard Icon={Users} value={stats?.users?.activeVolunteers || 0} label="Active Volunteers" color="var(--color-success)" />
        <StatCard Icon={Calendar} value={stats?.programs?.activePrograms || 0} label="Active Programs" color="var(--color-accent)" />
        <StatCard Icon={Clock} value={stats?.attendance?.totalAttendance || 0} label="Total Attendance" color="var(--color-info)" />
      </div>

      {/* Application Stats */}
      <div className="grid grid-cols-3" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
        <StatCard Icon={Target} value={stats?.applications?.pending || 0} label="Pending Applications" color="#8B5CF6" />
        <StatCard Icon={Award} value={stats?.certificates?.generated || 0} label="Certificates Issued" color="var(--color-warning)" />
        <StatCard Icon={Gift} value={stats?.rewards?.badgesAwarded || 0} label="Badges Awarded" color="#EC4899" />
      </div>

      {/* Organization Stats */}
      <div className="grid grid-cols-3" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
        <StatCard Icon={Building2} value={stats?.organizations?.totalOrganizations || 0} label="Organizations" color="#10B981" />
        <StatCard Icon={Building2} value={stats?.organizations?.verifiedOrganizations || 0} label="Verified Orgs" color="var(--color-success)" />
        <StatCard Icon={TrendingUp} value={`${stats?.attendance?.attendanceRate || 0}%`} label="Attendance Rate" color="var(--color-primary)" />
      </div>
    </div>
  );
};

const AnalyticsView = ({ type, data }) => {
  const analytics = data[`${type}Analytics`];
  if (!analytics) return null;

  const StatCard = ({ Icon, value, label, color }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ padding: '0.75rem', backgroundColor: `${color}20`, color, borderRadius: '50%' }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-heading)' }}>{value}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>{label}</div>
      </div>
    </div>
  );

  switch (type) {
    case 'volunteers':
      return (
        <div>
          <div className="grid grid-cols-3" style={{ marginBottom: '1rem', gap: '1rem' }}>
            <StatCard Icon={Users} value={analytics.totalVolunteers} label="Total" color="var(--color-primary)" />
            <StatCard Icon={Users} value={analytics.activeVolunteers} label="Active" color="var(--color-success)" />
            <StatCard Icon={Users} value={analytics.inactiveVolunteers} label="Inactive" color="var(--color-error)" />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Growth Rate</h4>
            <p>{analytics.growthRate?.rate}% ({analytics.growthRate?.direction})</p>
          </div>
        </div>
      );
    case 'programs':
      return (
        <div className="grid grid-cols-4" style={{ marginBottom: '1rem', gap: '1rem' }}>
          <StatCard Icon={Calendar} value={analytics.totalPrograms} label="Total" color="var(--color-primary)" />
          <StatCard Icon={Calendar} value={analytics.activePrograms} label="Active" color="var(--color-success)" />
          <StatCard Icon={Calendar} value={analytics.completedPrograms} label="Completed" color="var(--color-info)" />
          <StatCard Icon={Calendar} value={analytics.cancelledPrograms} label="Cancelled" color="var(--color-error)" />
        </div>
      );
    case 'applications':
      return (
        <div className="grid grid-cols-4" style={{ marginBottom: '1rem', gap: '1rem' }}>
          <StatCard Icon={Target} value={analytics.totalApplications} label="Total" color="var(--color-primary)" />
          <StatCard Icon={Target} value={`${analytics.approvalRate}%`} label="Approval Rate" color="var(--color-success)" />
          <StatCard Icon={Target} value={`${analytics.rejectionRate}%`} label="Rejection Rate" color="var(--color-error)" />
          <StatCard Icon={Target} value={`${analytics.pendingRate}%`} label="Pending Rate" color="var(--color-warning)" />
        </div>
      );
    case 'attendance':
      return (
        <div className="grid grid-cols-2" style={{ marginBottom: '1rem', gap: '1rem' }}>
          <StatCard Icon={Clock} value={analytics.totalHours} label="Total Hours" color="var(--color-primary)" />
          <StatCard Icon={Clock} value={`${analytics.attendanceRate}%`} label="Attendance Rate" color="var(--color-success)" />
        </div>
      );
    case 'certificates':
      return <StatCard Icon={Award} value={analytics.certificatesGenerated} label="Certificates Generated" color="var(--color-primary)" />;
    case 'rewards':
      return (
        <div className="grid grid-cols-3" style={{ marginBottom: '1rem', gap: '1rem' }}>
          <StatCard Icon={Gift} value={analytics.coinsDistributed} label="Coins Distributed" color="var(--color-primary)" />
          <StatCard Icon={Medal} value={analytics.badgesAwarded} label="Badges Awarded" color="var(--color-warning)" />
          <StatCard Icon={Award} value={analytics.achievementsAwarded} label="Achievements" color="var(--color-success)" />
        </div>
      );
    case 'leaderboard':
      return (
        <div>
          <h3 style={{ marginBottom: '1rem' }}>Top Volunteers by Hours</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {analytics.topVolunteers?.slice(0, 5).map((vol, i) => (
              <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>{i + 1}. {vol.name}</span>
                <span>{vol.totalHours} hours</span>
              </div>
            ))}
          </div>
        </div>
      );
    case 'organizations':
      return (
        <div className="grid grid-cols-3" style={{ marginBottom: '1rem', gap: '1rem' }}>
          <StatCard Icon={Building2} value={analytics.organizationsCreated} label="Created" color="var(--color-primary)" />
          <StatCard Icon={Building2} value={analytics.verifiedOrganizations} label="Verified" color="var(--color-success)" />
          <StatCard Icon={Building2} value={analytics.activeOrganizations} label="Active" color="var(--color-info)" />
        </div>
      );
    default:
      return <pre>{JSON.stringify(analytics, null, 2)}</pre>;
  }
};

export default AdminAnalytics;