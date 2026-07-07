import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { createProgram, updateProgram, changeProgramStatus } from '../../services/programsService';

const MODE_OPTIONS = [
  { value: 'offline', label: 'Offline' },
  { value: 'online', label: 'Online' },
  { value: 'hybrid', label: 'Hybrid' },
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'registration_closed', label: 'Registration Closed' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const CATEGORY_OPTIONS = [
  'Education',
  'Environment',
  'Health',
  'Community',
  'Animal Welfare',
  'Disaster Relief',
  'Other',
];

const ProgramModal = ({ isOpen, onClose, onSuccess, editData }) => {
  const isEditing = !!editData;

  const normalizeMode = (m) => {
    if (!m) return 'offline';
    return m.toLowerCase();
  };
  const normalizeStatus = (s) => {
    if (!s) return 'draft';
    return s.toLowerCase();
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: editData?.title || '',
    shortDescription: editData?.shortDescription || '',
    description: editData?.description || '',
    category: editData?.category || 'Education',
    mode: normalizeMode(editData?.mode),
    startDate: editData?.startDate ? new Date(editData.startDate).toISOString().split('T')[0] : '',
    endDate: editData?.endDate ? new Date(editData.endDate).toISOString().split('T')[0] : '',
    registrationDeadline: editData?.registrationDeadline
      ? new Date(editData.registrationDeadline).toISOString().split('T')[0]
      : '',
    city: editData?.city || editData?.location?.city || '',
    state: editData?.state || editData?.location?.state || '',
    address: editData?.address || editData?.location?.address || '',
    maxVolunteers: editData?.maxVolunteers || 50,
    status: normalizeStatus(editData?.status),
    approvalRequired: editData?.approvalRequired || false,
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      shortDescription: formData.shortDescription.trim() || undefined,
      category: formData.category,
      mode: formData.mode,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      registrationDeadline: formData.registrationDeadline || undefined,
      maxVolunteers: Number(formData.maxVolunteers),
      approvalRequired: formData.approvalRequired,
    };

    if (formData.mode !== 'online') {
      payload.city = formData.city.trim() || undefined;
      payload.state = formData.state.trim() || undefined;
      payload.address = formData.address.trim() || undefined;
    }

    try {
      if (isEditing) {
        const programId = editData._id || editData.id;
        await updateProgram(programId, payload);
        const originalStatus = normalizeStatus(editData?.status);
        if (formData.status !== originalStatus) {
          await changeProgramStatus(programId, formData.status);
        }
        toast.success('Program updated successfully!');
      } else {
        const result = await createProgram(payload);
        toast.success(result.successMessage || 'Program created successfully! It is saved as a draft.');
      }
      onSuccess();
    } catch (err) {
      const msg = err.message || 'Error saving program. Please check all fields.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(6px)' }} />
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '860px',
        maxHeight: '92vh',
        backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'scale-up 0.2s ease-out',
        border: '1px solid var(--color-border)',
      }}>
        {/* Header */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-bg)' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-heading)' }}>
              {isEditing ? 'Edit Program' : 'Create New Program'}
            </h2>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: 'var(--color-body)' }}>
              {isEditing ? 'Update program details below.' : 'Programs are created as Draft. Publish them when ready.'}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.5rem', border: 'none' }} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '1.5rem 2rem', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: 8, backgroundColor: '#FEE2E2', color: '#991B1B', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}
          <form id="program-form" onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>

            {/* Title */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Program Title *</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                placeholder="e.g. Weekend Beach Cleanup"
                minLength={3}
                maxLength={150}
              />
            </div>

            {/* Short Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Short Description <span style={{ color: 'var(--color-body)', fontWeight: 400 }}>(optional, shown in cards)</span></label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="form-control"
                placeholder="A brief one-liner about the program..."
                maxLength={300}
              />
            </div>

            {/* Full Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Full Description *</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows={4}
                placeholder="Describe the program, its goals, what volunteers will do..."
              />
            </div>

            {/* Category & Mode */}
            <div>
              <label className="form-label">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} className="form-control">
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Mode *</label>
              <select name="mode" value={formData.mode} onChange={handleChange} className="form-control">
                {MODE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
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
              <label className="form-label">Registration Deadline</label>
              <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} className="form-control" />
            </div>
            <div>
              <label className="form-label">Max Volunteers *</label>
              <input required type="number" min="1" max="100000" name="maxVolunteers" value={formData.maxVolunteers} onChange={handleChange} className="form-control" />
            </div>

            {/* Location (Only if offline/hybrid) */}
            {formData.mode !== 'online' && (
              <>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Location Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" placeholder="123 Main St, Near XYZ" />
                </div>
                <div>
                  <label className="form-label">City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" placeholder="Mumbai" />
                </div>
                <div>
                  <label className="form-label">State *</label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" placeholder="Maharashtra" />
                </div>
              </>
            )}

            {/* Approval Required */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <input
                type="checkbox"
                id="approvalRequired"
                name="approvalRequired"
                checked={formData.approvalRequired}
                onChange={handleChange}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="approvalRequired" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
                Require admin approval for volunteer applications
              </label>
            </div>

            {/* Status (Edit mode only) */}
            {isEditing && (
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Program Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="form-control" style={{ maxWidth: '260px' }}>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-body)', marginTop: '0.35rem' }}>
                  Status transitions: Draft → Published → Ongoing → Completed
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: 'var(--color-bg)' }}>
          <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button type="submit" form="program-form" className="btn btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {loading ? (
              <>
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                {isEditing ? 'Save Changes' : 'Create Program'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProgramModal;
