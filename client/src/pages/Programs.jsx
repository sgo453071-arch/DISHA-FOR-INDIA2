import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Search, MapPin, Calendar, Users, Filter, BookOpen, Leaf, Heart, Globe, Shield, Zap, Grid3X3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPrograms } from '../services/programsService';
import useSocket from '../hooks/useSocket';

const CATEGORY_META = {
  Education:       { icon: BookOpen,   color: '#3b82f6' },
  Environment:     { icon: Leaf,       color: '#22c55e' },
  Health:          { icon: Heart,      color: '#ef4444' },
  Community:       { icon: Users,      color: '#a855f7' },
  'Animal Welfare':{ icon: Shield,     color: '#f59e0b' },
  'Disaster Relief':{ icon: Zap,       color: '#f97316' },
  Other:           { icon: Globe,      color: '#6b7280' },
};

const STATUS_LABEL = {
  published:           { label: 'Open',      color: '#22c55e' },
  registration_closed: { label: 'Reg. Closed', color: '#f97316' },
  ongoing:             { label: 'Ongoing',   color: '#3b82f6' },
};

const ProgramCard = ({ program }) => {
  const {
    title, shortDescription, description, category, city, state,
    mode, startDate, endDate, maxVolunteers, status, _id
  } = program;

  const location = [city, state].filter(Boolean).join(', ');
  const meta = CATEGORY_META[category] || CATEGORY_META.Other;
  const IconComp = meta.icon;
  const statusInfo = STATUS_LABEL[status] || { label: status, color: '#6b7280' };
  const displayDesc = shortDescription || description || 'No description available.';

  return (
    <div className="card" style={{
      display: 'flex', flexDirection: 'column', gap: 0,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      overflow: 'hidden', padding: 0,
    }}
    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-xl)'; }}
    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
    >
      <div style={{ height: '4px', backgroundColor: meta.color, width: '100%' }} />

      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.3rem 0.75rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600,
            backgroundColor: `${meta.color}18`, color: meta.color,
          }}>
            <IconComp size={13} />
            {category || 'General'}
          </span>
          <span style={{
            fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.6rem',
            borderRadius: '999px', backgroundColor: `${statusInfo.color}18`, color: statusInfo.color,
          }}>
            {statusInfo.label}
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-body)', textTransform: 'capitalize' }}>
            {mode} program
          </span>
        </div>

        <h4 style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.4, color: 'var(--color-heading)' }}>
          {title || 'Untitled Program'}
        </h4>

        <p style={{ fontSize: '0.875rem', color: 'var(--color-body)', margin: 0, lineHeight: 1.6, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {displayDesc}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
          {location && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-body)' }}>
              <MapPin size={13} />
              {location}
            </span>
          )}
          {startDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-body)' }}>
              <Calendar size={13} />
              Starts {new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              {endDate && ` · Ends ${new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
            </span>
          )}
          {maxVolunteers && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--color-body)' }}>
              <Users size={13} />
              Up to {maxVolunteers.toLocaleString()} volunteers
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)' }}>
        <Link
          to={`/programs/${_id}`}
          className="btn btn-primary"
          style={{ width: '100%', textAlign: 'center', display: 'block' }}
        >
          View & Apply
        </Link>
      </div>
    </div>
  );
};

const Programs = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMode, setSelectedMode] = useState('all');
  const { on, isConnected } = useSocket();

  const fetchPrograms = useCallback(async () => {
    try {
      const res = await getPrograms();
      const list = res.programs || [];
      setPrograms(list);
    } catch (err) {
      console.error('Failed to fetch programs', err);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  useEffect(() => {
    const handleProgramCreated = (data) => {
      const program = data?.program;
      if (!program || program.status !== 'published') return;
      setPrograms((prev) => {
        if (prev.some((p) => p._id === program._id)) return prev;
        return [program, ...prev];
      });
    };

    const handleProgramPublished = (data) => {
      const program = data?.program;
      if (!program) return;
      setPrograms((prev) => {
        if (prev.some((p) => p._id === program._id)) {
          return prev.map((p) => p._id === program._id ? program : p);
        }
        return [program, ...prev];
      });
    };

    const handleProgramUpdated = (data) => {
      const program = data?.program;
      if (!program) return;
      setPrograms((prev) => prev.map((p) => (p._id === program._id ? program : p)));
    };

    const handleReconnect = () => {
      fetchPrograms();
    };

    const unsubCreated = on('program-created', handleProgramCreated);
    const unsubPublished = on('program-published', handleProgramPublished);
    const unsubUpdated = on('program-updated', handleProgramUpdated);
    const unsubReconnect = on('reconnect', handleReconnect);

    return () => {
      unsubCreated();
      unsubPublished();
      unsubUpdated();
      unsubReconnect();
    };
  }, [on, fetchPrograms]);

  const categories = useMemo(() => ['All', ...Object.keys(CATEGORY_META)], []);

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const matchSearch = !search ||
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase()) ||
        p.city?.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchMode = selectedMode === 'all' || p.mode === selectedMode;
      return matchSearch && matchCat && matchMode;
    });
  }, [programs, search, selectedCategory, selectedMode]);

  return (
    <div style={{ padding: '0.5rem 0 3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-heading)' }}>
          Browse Opportunities
        </h1>
        <p style={{ color: 'var(--color-body)', fontSize: '1rem' }}>
          Discover social campaigns, teaching initiatives, and ecological programs you can join.
          {isConnected && (
            <span style={{ fontSize: '0.8rem', color: '#22c55e', marginLeft: '0.5rem' }}>
              ● Live
            </span>
          )}
        </p>
      </div>

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
        padding: '1.25rem', backgroundColor: 'var(--color-card)',
        borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
      }}>
        <div style={{ position: 'relative', flex: '1 1 220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-body)' }} />
          <input
            type="text"
            placeholder="Search programs, cities, categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.25rem' }}
          />
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} style={{ color: 'var(--color-body)' }} />
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="form-control"
            style={{ minWidth: '140px' }}
          >
            <option value="all">All Modes</option>
            <option value="offline">Offline</option>
            <option value="online">Online</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
        {categories.map((cat) => {
          const meta = CATEGORY_META[cat];
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500,
                cursor: 'pointer', border: 'none', transition: 'all 0.15s ease',
                backgroundColor: isActive ? (meta?.color || 'var(--color-primary)') : 'var(--color-card)',
                color: isActive ? '#fff' : 'var(--color-body)',
                boxShadow: isActive ? `0 0 0 2px ${meta?.color || 'var(--color-primary)'}40` : 'none',
                borderWidth: '1px', borderStyle: 'solid',
                borderColor: isActive ? 'transparent' : 'var(--color-border)',
              }}
            >
              {cat === 'All' ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Grid3X3 size={13} /> All
                </span>
              ) : cat}
            </button>
          );
        })}
      </div>

      {!loading && (
        <p style={{ color: 'var(--color-body)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          Showing <strong>{filtered.length}</strong> of <strong>{programs.length}</strong> programs
        </p>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="card" style={{ height: '320px', animation: 'pulse 1.5s ease-in-out infinite', backgroundColor: 'var(--color-border)' }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: 'var(--color-heading)', marginBottom: '0.5rem' }}>No programs found</h3>
          <p style={{ color: 'var(--color-body)' }}>
            {programs.length === 0
              ? 'No programs are currently published. Check back soon!'
              : 'Try adjusting your search or filters.'}
          </p>
          {(search || selectedCategory !== 'All' || selectedMode !== 'all') && (
            <button
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
              onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedMode('all'); }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((program) => (
            <ProgramCard key={program._id} program={program} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Programs;
