import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Calendar, MapPin } from 'lucide-react';
import { getAllPrograms, deleteProgram } from '../../services/programsService';
import SkeletonLoader from '../../components/volunteer/SkeletonLoader';
import StatusBadge from '../../components/volunteer/StatusBadge';
import ProgramModal from '../../components/admin/ProgramModal';
import toast from 'react-hot-toast';

const AdminPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProgram, setEditProgram] = useState(null);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const res = await getAllPrograms();
      if (res.success && res.data) {
        setPrograms(res.data.programs || []);
      }
    } catch (err) {
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    try {
      const res = await deleteProgram(id);
      if (res.success) {
        toast.success('Program deleted successfully');
        setPrograms((prev) => prev.filter((p) => p.id !== id && p._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting program');
    }
  };

  const handleCreate = () => {
    setEditProgram(null);
    setIsModalOpen(true);
  };

  const handleEdit = (prog) => {
    setEditProgram(prog);
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    setIsModalOpen(false);
    fetchPrograms();
  };

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: 'var(--color-heading)' }}>Program Management</h1>
          <p style={{ color: 'var(--color-body)', margin: 0 }}>Create, update, and manage volunteering opportunities.</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Program
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>All Programs</h3>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
            <input type="text" placeholder="Search programs..." className="form-control" style={{ paddingLeft: '2.25rem', width: '250px' }} />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '2rem' }}><SkeletonLoader count={3} /></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Title</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Location</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Status</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-body)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {programs.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-body)' }}>No programs found.</td></tr>
                ) : (
                  programs.map((prog) => (
                    <tr key={prog.id || prog._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-heading)' }}>{prog.title}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem' }}>{prog.category}</td>
                      <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={14} className="text-body" /> {prog.location?.city || 'Virtual'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <StatusBadge status={prog.status} />
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="btn btn-secondary" style={{ padding: '0.4rem' }} onClick={() => handleEdit(prog)} aria-label="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button className="btn btn-secondary" style={{ padding: '0.4rem', color: 'var(--color-error)' }} onClick={() => handleDelete(prog.id || prog._id)} aria-label="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProgramModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleModalSuccess}
        editData={editProgram}
      />
    </div>
  );
};

export default AdminPrograms;
