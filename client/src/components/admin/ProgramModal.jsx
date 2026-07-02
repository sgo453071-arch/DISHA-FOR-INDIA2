import React, { useState } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createProgram, updateProgram } from '../../services/programsService';

const ProgramModal = ({ isOpen, onClose, onSuccess, editData }) => {
  const isEditing = !!editData;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    description: editData?.description || '',
    category: editData?.category || 'Education',
    mode: editData?.mode || 'Offline',
    startDate: editData?.startDate ? new Date(editData.startDate).toISOString().split('T')[0] : '',
    endDate: editData?.endDate ? new Date(editData.endDate).toISOString().split('T')[0] : '',
    registrationDeadline: editData?.registrationDeadline ? new Date(editData.registrationDeadline).toISOString().split('T')[0] : '',
    city: editData?.city || editData?.location?.city || '',
    state: editData?.state || editData?.location?.state || '',
    address: editData?.address || editData?.location?.address || '',
    maxVolunteers: editData?.maxVolunteers || 50,
    status: editData?.status || 'DRAFT',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      mode: formData.mode,
      startDate: formData.startDate,
      endDate: formData.endDate,
      registrationDeadline: formData.registrationDeadline,
      city: formData.city,
      state: formData.state,
      address: formData.address,
      maxVolunteers: Number(formData.maxVolunteers),
    };

    if (isEditing) {
      payload.status = formData.status;
    }

    try {
      if (isEditing) {
        await updateProgram(editData.id || editData._id, payload);
        toast.success('Program updated successfully');
      } else {
        await createProgram(payload);
        toast.success('Program created successfully');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'scale-up 0.2s ease-out'
      }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg)' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{isEditing ? 'Edit Program' : 'Create New Program'}</h2>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem', border: 'none' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
          <form id="program-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            {/* Title */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Program Title *</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="form-control" placeholder="e.g. Weekend Beach Cleanup" />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Description *</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} className="form-control" rows={4} placeholder="Describe the program..." />
            </div>

            {/* Category & Mode */}
            <div>
              <label className="form-label">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-control">
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
                <option value="Health">Health</option>
                <option value="Community">Community</option>
                <option value="Animal Welfare">Animal Welfare</option>
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="form-label">Mode *</label>
              <select name="mode" value={formData.mode} onChange={handleChange} className="form-control">
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Dates */}
            <div>
              <label className="form-label">Start Date *</label>
              <input required type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-control" />
            </div>
            <div>
              <label className="form-label">End Date *</label>
              <input required type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="form-control" />
            </div>
            <div>
              <label className="form-label">Registration Deadline *</label>
              <input required type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} className="form-control" />
            </div>
            <div>
              <label className="form-label">Max Volunteers *</label>
              <input required type="number" min="1" name="maxVolunteers" value={formData.maxVolunteers} onChange={handleChange} className="form-control" />
            </div>

            {/* Location (Only if offline/hybrid) */}
            {formData.mode !== 'Online' && (
              <>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Location Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" placeholder="123 Main St" />
                </div>
                <div>
                  <label className="form-label">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" placeholder="Mumbai" />
                </div>
                <div>
                  <label className="form-label">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" placeholder="Maharashtra" />
                </div>
              </>
            )}

            {/* Status (Only on Edit) */}
            {isEditing && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Publish Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="form-control" style={{ maxWidth: '200px' }}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            )}

          </form>
        </div>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: 'var(--color-bg)' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button type="submit" form="program-form" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Program')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramModal;
