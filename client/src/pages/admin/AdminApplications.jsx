import { Users, FileCheck, Search, Filter, Shield } from "lucide-react";

import {
  getAdminApplicationStats,
  getAdminApplications,
  bulkUpdateApplications
} from "../../services/applicationsService";
import toast from 'react-hot-toast';

import StatusBadge from "../../components/volunteer/StatusBadge";
import Pagination from "../../components/volunteer/Pagination";
import SkeletonLoader from "../../components/volunteer/SkeletonLoader";

const AdminApplications = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const statsRes = await getAdminApplicationStats();
        const appsRes = await getAdminApplications();
        if (statsRes.success) setStats(statsRes.data);
        if (appsRes.success) setApplications(appsRes.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await bulkUpdateApplications([id], status);
      if (res.success) {
        toast.success(`Application ${status.toLowerCase()} successfully`);
        setApplications(apps => apps.map(app => (app.id === id || app._id === id) ? { ...app, status } : app));
        
        // Refresh stats
        const statsRes = await getAdminApplicationStats();
        if (statsRes.success) setStats(statsRes.data);
      }
    } catch (err) {
      toast.error('Failed to update application status');
    }
  };

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Shield size={20} className="text-primary" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Panel</span>
          </div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Application Management</h1>
          <p style={{ color: 'var(--color-body)', marginTop: '0.5rem' }}>Review and manage volunteer applications across all programs.</p>
        </div>
      </div>

      {loading ? <SkeletonLoader type="dashboard" /> : (
        <>
          {stats && (
            <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--color-accent)', borderRadius: '50%' }}><FileCheck size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.pending}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Pending Review</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--color-primary)', borderRadius: '50%' }}><Users size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.today}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>New Today</div></div>
              </div>
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--color-success)', borderRadius: '50%' }}><Users size={24} /></div>
                <div><div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats.newVolunteers}</div><div style={{ fontSize: '0.85rem', color: 'var(--color-body)' }}>Total Volunteers</div></div>
              </div>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Recent Applications</h3>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
                  <input type="text" placeholder="Search applicants..." className="form-control" style={{ paddingLeft: '2.25rem', width: '250px' }} />
                </div>
                <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Filter size={16} /> Filter
                </button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Applicant</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Program</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Date Applied</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Status</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-body)' }}>No applications found.</td></tr>
                  ) : (
                    applications.map((app) => {
                      const applicantName = app.user?.name || app.applicantName || 'Unknown User';
                      const applicantEmail = app.user?.email || app.applicantEmail || 'No email';
                      const initials = applicantName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                      
                      return (
                        <tr key={app.id || app._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                                {initials}
                              </div>
                              <div>
                                <div style={{ fontWeight: 600, color: 'var(--color-heading)' }}>{applicantName}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--color-body)' }}>{applicantEmail}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{app.program?.title || app.programTitle || 'Unknown Program'}</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--color-body)' }}>
                            {new Date(app.createdAt || app.appliedDate).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <StatusBadge status={app.status} />
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
                                onClick={() => handleStatusUpdate(app.id || app._id, 'APPROVED')}
                                disabled={app.status === 'APPROVED'}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderColor: 'var(--color-error)', color: 'var(--color-error)' }}
                                onClick={() => handleStatusUpdate(app.id || app._id, 'REJECTED')}
                                disabled={app.status === 'REJECTED'}
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ padding: '1rem 1.5rem' }}>
              <Pagination currentPage={1} totalPages={3} totalItems={24} onPageChange={() => {}} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminApplications;
