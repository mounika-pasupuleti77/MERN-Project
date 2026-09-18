import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { applianceAPI } from '../services/api';
import { Tv, Plus, Trash2, Power, Clock, Zap, AlertCircle } from 'lucide-react';

export default function Appliances() {
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApp, setNewApp] = useState({
    name: '',
    type: 'heavy',
    powerRating: 1.5,
    duration: 2,
    priority: 3,
    preferredStartTime: '10:00',
    preferredEndTime: '16:00'
  });

  const loadAppliances = async () => {
    try {
      setLoading(true);
      const res = await applianceAPI.getAppliances();
      setAppliances(res.data);
    } catch (err) {
      setError('Failed to load appliances');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppliances();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
    // Optimistic UI update
    setAppliances(prev => prev.map(a => a._id === id ? { ...a, status: nextStatus } : a));

    try {
      await applianceAPI.toggleStatus(id, nextStatus);
    } catch (err) {
      // Rollback on error
      setAppliances(prev => prev.map(a => a._id === id ? { ...a, status: currentStatus } : a));
      alert('Failed to update appliance status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this appliance?')) return;
    try {
      await applianceAPI.deleteAppliance(id);
      setAppliances(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      alert('Failed to delete appliance');
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await applianceAPI.createAppliance(newApp);
      setAppliances(prev => [...prev, res.data]);
      setShowAddModal(false);
      setNewApp({ name: '', type: 'heavy', powerRating: 1.5, duration: 2, priority: 3, preferredStartTime: '10:00', preferredEndTime: '16:00' });
    } catch (err) {
      alert('Failed to add new appliance');
    }
  };

  return (
    <div>
      <Navbar title="Smart Appliances" />

      <div style={styles.topBar}>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Manage household smart loads. Toggle appliances ON/OFF or add flexible loads for AI scheduling.
        </p>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
          <Plus size={18} /> Add Appliance
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Loading appliances...</div>
      ) : (
        <div style={styles.grid}>
          {appliances.map(app => {
            const isOn = app.status === 'ON';
            return (
              <div key={app._id} className="glass-card card-hover" style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={styles.iconBox(isOn)}>
                      <Tv size={22} color={isOn ? '#10b981' : '#94a3b8'} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#f8fafc' }}>{app.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                        {app.type || 'Standard'} Load
                      </span>
                    </div>
                  </div>

                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={isOn}
                      onChange={() => handleToggle(app._id, app.status)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div style={styles.detailsGrid}>
                  <div style={styles.detailItem}>
                    <Zap size={14} color="#38bdf8" />
                    <span>Power: <strong>{app.powerRating} kW</strong></span>
                  </div>

                  <div style={styles.detailItem}>
                    <Clock size={14} color="#f59e0b" />
                    <span>Window: <strong>{app.preferredStartTime || '00:00'} - {app.preferredEndTime || '23:59'}</strong></span>
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <span className={`badge ${isOn ? 'badge-success' : 'badge-danger'}`}>
                    {isOn ? '🟢 ON' : '⚪ OFF'}
                  </span>
                  <button onClick={() => handleDelete(app._id)} style={styles.deleteBtn} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Appliance Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div className="glass-card" style={styles.modalContent}>
            <h3 style={{ marginBottom: '16px' }}>Add New Smart Appliance</h3>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={styles.label}>Appliance Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Air Conditioner"
                  value={newApp.name}
                  onChange={e => setNewApp({ ...newApp, name: e.target.value })}
                  style={styles.input}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Power Rating (kW)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newApp.powerRating}
                    onChange={e => setNewApp({ ...newApp, powerRating: parseFloat(e.target.value) })}
                    style={styles.input}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Type</label>
                  <select
                    value={newApp.type}
                    onChange={e => setNewApp({ ...newApp, type: e.target.value })}
                    style={styles.input}
                  >
                    <option value="heavy">Heavy Load</option>
                    <option value="flexible">Flexible</option>
                    <option value="critical">Critical</option>
                    <option value="standard">Standard</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Preferred Start</label>
                  <input
                    type="text"
                    placeholder="10:00"
                    value={newApp.preferredStartTime}
                    onChange={e => setNewApp({ ...newApp, preferredStartTime: e.target.value })}
                    style={styles.input}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Preferred End</label>
                  <input
                    type="text"
                    placeholder="16:00"
                    value={newApp.preferredEndTime}
                    onChange={e => setNewApp({ ...newApp, preferredEndTime: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Appliance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '16px'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconBox: (isOn) => ({
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: isOn ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  detailsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: 'rgba(15, 23, 42, 0.5)',
    padding: '12px',
    borderRadius: '8px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.82rem',
    color: '#cbd5e1'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '8px',
    borderTop: '1px solid var(--border-color)'
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '4px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200
  },
  modalContent: {
    width: '100%',
    maxWidth: '480px',
    background: '#1e293b'
  },
  label: { fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px', display: 'block' },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    background: '#0f172a',
    border: '1px solid var(--border-color)',
    color: '#ffffff',
    fontSize: '0.9rem'
  }
};
