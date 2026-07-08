import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, Clock, Award, TrendingUp, Gift, Building2, Download, RefreshCw, BarChart3 } from 'lucide-react';
import StatCard from '../../components/volunteer/StatCard';
import ForecastCard from '../../components/forecast/ForecastCard';
import ForecastTrendChart from '../../components/forecast/ForecastTrendChart';
import { getForecastDashboard, getVolunteerForecast, getProgramForecast, getAttendanceForecast, getRewardForecast } from '../../services/forecastService';
import { exportToCSV } from '../../utils/exportUtils';

const DATE_RANGES = [
  { label: 'All Time', value: '' },
  { label: 'This Year', value: 'this_year' },
  { label: 'Last 6 Months', value: 'last_6_months' },
  { label: 'Last 3 Months', value: 'last_3_months' },
  { label: 'Last Month', value: 'last_month' },
];

const AdminForecast = () => {
  const [dateRange, setDateRange] = useState('this_year');
  const [activeSection, setActiveSection] = useState('overview');

  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useQuery({
    queryKey: ['forecast-dashboard', dateRange],
    queryFn: async () => {
      const res = await getForecastDashboard();
      if (res?.success) return res.data;
      throw new Error(res?.message || 'Failed to load forecast dashboard');
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: volunteerData, isLoading: volunteerLoading } = useQuery({
    queryKey: ['forecast-volunteers', dateRange],
    queryFn: async () => {
      const res = await getVolunteerForecast();
      if (res?.success) return res.data;
      throw new Error(res?.message || 'Failed to load volunteer forecast');
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: activeSection === 'volunteers',
  });

  const { data: programData, isLoading: programLoading } = useQuery({
    queryKey: ['forecast-programs', dateRange],
    queryFn: async () => {
      const res = await getProgramForecast();
      if (res?.success) return res.data;
      throw new Error(res?.message || 'Failed to load program forecast');
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: activeSection === 'programs',
  });

  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ['forecast-attendance', dateRange],
    queryFn: async () => {
      const res = await getAttendanceForecast();
      if (res?.success) return res.data;
      throw new Error(res?.message || 'Failed to load attendance forecast');
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: activeSection === 'attendance',
  });

  const { data: rewardData, isLoading: rewardLoading } = useQuery({
    queryKey: ['forecast-rewards', dateRange],
    queryFn: async () => {
      const res = await getRewardForecast();
      if (res?.success) return res.data;
      throw new Error(res?.message || 'Failed to load reward forecast');
    },
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: activeSection === 'rewards',
  });

  const loading = dashboardLoading || (activeSection !== 'overview' && ((activeSection === 'volunteers' && volunteerLoading) || (activeSection === 'programs' && programLoading) || (activeSection === 'attendance' && attendanceLoading) || (activeSection === 'rewards' && rewardLoading)));
  const error = dashboardError;

  const handleExport = () => {
    if (!dashboardData) return;
    const exportData = formatForExport(dashboardData);
    exportToCSV(exportData, 'forecast-dashboard');
  };

  const formatForExport = (data) => {
    const rows = [];
    if (data?.overview) {
      rows.push({ Section: 'Overview', Metric: 'Total Volunteers', Value: data.overview.totalVolunteers || 0 });
      rows.push({ Section: 'Overview', Metric: 'Active Volunteers', Value: data.overview.activeVolunteers || 0 });
      rows.push({ Section: 'Overview', Metric: 'Total Programs', Value: data.overview.totalPrograms || 0 });
      rows.push({ Section: 'Overview', Metric: 'Total Applications', Value: data.overview.totalApplications || 0 });
      rows.push({ Section: 'Overview', Metric: 'Total Attendance', Value: data.overview.totalAttendance || 0 });
      rows.push({ Section: 'Overview', Metric: 'Total Certificates', Value: data.overview.totalCertificates || 0 });
      rows.push({ Section: 'Overview', Metric: 'Total Organizations', Value: data.overview.totalOrgs || 0 });
    }

    const forecasts = data?.forecasts || {};
    Object.entries(forecasts).forEach(([key, forecast]) => {
      rows.push({
        Section: 'Forecasts',
        Metric: key.charAt(0).toUpperCase() + key.slice(1) + ' Growth',
        CurrentValue: forecast?.currentValue ?? 0,
        ForecastValue: forecast?.forecastValue ?? 0,
        Growth: `${forecast?.growth ?? 0}%`,
        Trend: forecast?.trend ?? 'stable',
        Confidence: forecast?.confidence ?? 'medium',
      });
    });

    return rows;
  };

  const overviewStats = useMemo(() => {
    if (!dashboardData) return null;
    return {
      totalVolunteers: dashboardData?.overview?.totalVolunteers || 0,
      activeVolunteers: dashboardData?.overview?.activeVolunteers || 0,
      totalPrograms: dashboardData?.overview?.totalPrograms || 0,
      totalApplications: dashboardData?.overview?.totalApplications || 0,
      totalAttendance: dashboardData?.overview?.totalAttendance || 0,
      totalCertificates: dashboardData?.overview?.totalCertificates || 0,
      totalOrgs: dashboardData?.overview?.totalOrgs || 0,
    };
  }, [dashboardData]);

  const volunteerForecast = dashboardData?.forecasts?.volunteers;
  const programForecast = dashboardData?.forecasts?.programs;
  const attendanceForecast = dashboardData?.forecasts?.attendance;
  const rewardForecast = dashboardData?.forecasts?.rewards;

  if (loading && !dashboardData) {
    return (
      <div className="page-container" style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ height: '32px', width: '300px', borderRadius: '6px', background: 'var(--color-border)', animation: 'pulse 1.5s infinite' }} />
          <div style={{ height: '16px', width: '200px', borderRadius: '4px', background: 'var(--color-border)', marginTop: '0.75rem', animation: 'pulse 1.5s infinite' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-card)', border: '1px solid var(--color-border)', animation: 'pulse 1.5s infinite' }}>
              <div style={{ height: '14px', width: '60%', borderRadius: '4px', background: 'var(--color-border)', marginBottom: '1rem' }} />
              <div style={{ height: '32px', width: '40%', borderRadius: '4px', background: 'var(--color-border)', marginBottom: '0.5rem' }} />
              <div style={{ height: '12px', width: '80%', borderRadius: '4px', background: 'var(--color-border)' }} />
            </div>
          ))}
        </div>
        <div style={{ height: '300px', borderRadius: 'var(--radius-lg)', background: 'var(--color-card)', border: '1px solid var(--color-border)', animation: 'pulse 1.5s infinite' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ padding: '2rem' }}>
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', margin: '3rem auto' }}>
          <BarChart3 size={48} style={{ color: 'var(--color-error)', marginBottom: '1rem', opacity: 0.5 }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--color-heading)' }}>Unable to load forecasts</h2>
          <p style={{ color: 'var(--color-body)', marginBottom: '1.5rem' }}>{error?.message || 'Something went wrong while fetching forecast data.'}</p>
          <button onClick={() => refetchDashboard()} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>Predictive Forecasts</h1>
          <p style={{ color: 'var(--color-body)', margin: 0 }}>Platform growth forecasts powered by historical analytics and statistical modeling.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="form-input"
              style={{ paddingRight: '2.5rem', cursor: 'pointer' }}
              aria-label="Select date range for forecasts"
            >
              {DATE_RANGES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-body)' }}>▼</span>
          </div>
          <button onClick={handleExport} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={!dashboardData}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { id: 'overview', label: 'Overview', Icon: BarChart3 },
          { id: 'volunteers', label: 'Volunteers', Icon: Users },
          { id: 'programs', label: 'Programs', Icon: Calendar },
          { id: 'attendance', label: 'Attendance', Icon: Clock },
          { id: 'rewards', label: 'Rewards', Icon: Gift },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={activeSection === tab.id ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <tab.Icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeSection === 'overview' && overviewStats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
            <StatCard icon={<Users size={24} />} value={overviewStats.totalVolunteers} label="Total Volunteers" color="primary" />
            <StatCard icon={<Users size={24} />} value={overviewStats.activeVolunteers} label="Active Volunteers" color="secondary" />
            <StatCard icon={<Calendar size={24} />} value={overviewStats.totalPrograms} label="Total Programs" color="accent" />
            <StatCard icon={<Clock size={24} />} value={overviewStats.totalAttendance} label="Total Attendance" color="primary" />
          </div>

          <div className="grid grid-cols-3" style={{ gap: '1rem' }}>
            <StatCard icon={<Award size={24} />} value={overviewStats.totalCertificates} label="Certificates Issued" color="warning" />
            <StatCard icon={<TrendingUp size={24} />} value={overviewStats.totalApplications} label="Applications" color="purple" />
            <StatCard icon={<Building2 size={24} />} value={overviewStats.totalOrgs} label="Organizations" color="success" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
            <ForecastCard
              title="Volunteer Growth"
              {...volunteerForecast}
              icon={Users}
              color="var(--color-primary)"
            />
            <ForecastCard
              title="Program Demand"
              {...programForecast}
              icon={Calendar}
              color="var(--color-success)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
            <ForecastCard
              title="Attendance Trends"
              {...attendanceForecast}
              icon={Clock}
              color="var(--color-accent)"
            />
            <ForecastCard
              title="Reward Redemption"
              {...rewardForecast}
              icon={Gift}
              color="var(--color-warning)"
            />
          </div>
        </div>
      )}

      {activeSection === 'volunteers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ForecastCard
            title="Volunteer Growth Forecast"
            {...volunteerData}
            icon={Users}
            color="var(--color-primary)"
          />
          {volunteerData?.historicalData && (
            <ForecastTrendChart
              title="Volunteer Growth Trend"
              historicalData={volunteerData.historicalData}
              predictions={volunteerData.predictions?.map(p => typeof p.value === 'number' ? p.value : 0)}
              dataKey="total"
              color="var(--color-primary)"
            />
          )}
        </div>
      )}

      {activeSection === 'programs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ForecastCard
            title="Program Demand Forecast"
            {...programData}
            icon={Calendar}
            color="var(--color-success)"
          />
          {programData?.historicalData && (
            <ForecastTrendChart
              title="Program Demand Trend"
              historicalData={programData.historicalData}
              predictions={programData.predictions?.map(p => typeof p.value === 'number' ? p.value : 0)}
              dataKey="count"
              color="var(--color-success)"
            />
          )}
        </div>
      )}

      {activeSection === 'attendance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ForecastCard
            title="Attendance Trends Forecast"
            {...attendanceData}
            icon={Clock}
            color="var(--color-accent)"
          />
          {attendanceData?.historicalData && (
            <ForecastTrendChart
              title="Attendance Trend"
              historicalData={attendanceData.historicalData}
              predictions={attendanceData.predictions?.map(p => typeof p.value === 'number' ? p.value : 0)}
              dataKey="count"
              color="var(--color-accent)"
            />
          )}
        </div>
      )}

      {activeSection === 'rewards' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
            <ForecastCard
              title="Reward Redemption Forecast"
              {...rewardData?.redemption}
              icon={Gift}
              color="var(--color-warning)"
            />
            <ForecastCard
              title="Coin Distribution Forecast"
              {...rewardData?.coinDistribution}
              icon={Award}
              color="var(--color-primary)"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <ForecastCard
              title="Active Volunteers"
              {...rewardData?.activeVolunteers}
              icon={Users}
              color="var(--color-success)"
            />
            <ForecastCard
              title="NGO Participation"
              {...rewardData?.ngoParticipation}
              icon={Building2}
              color="var(--color-secondary)"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminForecast;
