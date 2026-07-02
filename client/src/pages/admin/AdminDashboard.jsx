import React, { useState, useEffect } from 'react';
import { Users, Calendar, Clock, Activity, TrendingUp, Target } from 'lucide-react';
import { getDashboardStatistics } from '../../services/adminService';
import { getAllPrograms } from '../../services/programsService';
import SkeletonLoader from '../../components/volunteer/SkeletonLoader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activePrograms, setActivePrograms] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [statsRes, programsRes] = await Promise.all([
          getDashboardStatistics(),
          getAllPrograms()
        ]);
        
        if (statsRes.success) {
          setStats(statsRes.data);
        } else {
          setError('Failed to load dashboard statistics.');
        }

        if (programsRes.success && programsRes.data?.programs) {
          const active = programsRes.data.programs.filter(p => p.status === 'PUBLISHED' || p.status === 'ONGOING').length;
          setActivePrograms(active);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
        setError('Error connecting to the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="page-container" style={{ padding: '2rem' }}><SkeletonLoader type="dashboard" /></div>;
  if (error) return <div className="page-container" style={{ padding: '2rem', color: 'var(--color-error)' }}>{error}</div>;
  if (!stats) return null;

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--color-body)', margin: 0 }}>Overview of the Disha for India platform activities and volunteer engagement.</p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-4" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        {/* Total Volunteers */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--color-primary)' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', borderRadius: '50%' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-heading)' }}>
              {stats.totalVolunteers || 0}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Total Volunteers</div>
          </div>
        </div>

        {/* Active Programs */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--color-success)' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '50%' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-heading)' }}>
              {activePrograms}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Active Programs</div>
          </div>
        </div>

        {/* Total Hours */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid var(--color-accent)' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', borderRadius: '50%' }}>
            <Clock size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-heading)' }}>
              {stats.totalHoursLogged || '--'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Hours Volunteered</div>
          </div>
        </div>

        {/* New Signups (Placeholder for visual completeness, assuming backend might not send this directly yet) */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '4px solid #8B5CF6' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', borderRadius: '50%' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-heading)' }}>
              {stats.newThisMonth || 0}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Signups This Month</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
        {/* Recent Activity / Placeholder Area */}
        <div className="card">
          <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={18} className="text-primary" /> Platform Health
          </h3>
          <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-md)', textAlign: 'center', color: 'var(--color-body)' }}>
            <p>System is running smoothly. All services operational.</p>
            {/* Future charting could go here */}
          </div>
        </div>
        
        {/* Quick Actions */}
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
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
