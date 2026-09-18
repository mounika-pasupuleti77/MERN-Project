import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { scheduleAPI, applianceAPI } from '../services/api';
import { CalendarClock, Sparkles, Trash2, Plus, ArrowRight } from 'lucide-react';

export default function Schedule() {
  const [schedules, setSchedules] = useState([]);
  const [appliances, setAppliances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState('');
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('21:00');

  const loadData = async () => {
    try {
      setLoading(true);
      const [schedRes, appRes] = await Promise.all([
        scheduleAPI.getSchedules(),
        applianceAPI.getAppliances()
      ]);
      setSchedules(schedRes.data);
      setAppliances(appRes.data);
      if (appRes.data.length > 0) setSelectedAppId(appRes.data[0]._id);
    } catch (err) {
      console.error('Failed to load schedule data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!selectedAppId) return;

    try {
      const res = await scheduleAPI.createSchedule({
        applianceId: selectedAppId,
        scheduledStart: startTime,
        scheduledEnd: endTime,
        source: 'Manual'
      });
      setSchedules(prev => [...prev, res.data]);
    } catch (err) {
      alert('Failed to create schedule');
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      await scheduleAPI.deleteSchedule(id);
      setSchedules(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert('Failed to delete schedule');
    }
  };

  return (
    <div>
      <Navbar title="Smart Appliance Scheduling" />

      {/* AI Recommendation Showcase Highlight Card */}
      <div className="glass-card" style={styles.aiHighlightCard}>
        <div style={styles.aiBadgeHeader}>
          <Sparkles size={20} color="#fbbf24" />
          <h3 style={{ margin: 0, color: '#f8fafc' }}>AI Load Shifting Recommendation</h3>
        </div>

        <div style={styles.comparisonGrid}>
          <div style={styles.planBox('rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.25)')}>
            <span style={{ fontSize: '0.8rem', color: '#f87171', fontWeight: 600 }}>USER PREFERRED SCHEDULE</span>
            <h4 style={{ color: '#ffffff', margin: '4px 0' }}>Washing Machine</h4>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f87171' }}>06:00 PM – 09:00 PM</div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Peak Electricity Tariff ($0.34/kWh)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRight size={28} color="#38bdf8" />
          </div>

          <div style={styles.planBox('rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.25)')}>
            <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>AI OPTIMIZED SCHEDULE</span>
            <h4 style={{ color: '#ffffff', margin: '4px 0' }}>Washing Machine</h4>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>01:00 PM – 02:30 PM</div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>High Solar Generation & Low Tariff ($0.12/kWh)</span>
          </div>
        </div>

        <div style={styles.reasoningFooter}>
          <strong>AI Reasoning:</strong> Shifting load to 1:00 PM utilizes 4.5 kW surplus solar generation, saving ~65% in grid energy costs.
        </div>
      </div>

      <div style={styles.twoColumnLayout}>
        {/* Left: Create Schedule Form */}
        <div className="glass-card" style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '16px' }}>Schedule Appliance</h3>

          <form onSubmit={handleCreateSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={styles.label}>Select Appliance</label>
              <select
                value={selectedAppId}
                onChange={e => setSelectedAppId(e.target.value)}
                style={styles.input}
              >
                {appliances.map(app => (
                  <option key={app._id} value={app._id}>
                    {app.name} ({app.powerRating} kW)
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>Start Time</label>
                <input
                  type="text"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  style={styles.input}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={styles.label}>End Time</label>
                <input
                  type="text"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              <Plus size={18} /> Confirm Schedule
            </button>
          </form>
        </div>

        {/* Right: Scheduled List */}
        <div className="glass-card" style={{ flex: 1.5 }}>
          <h3 style={{ marginBottom: '16px' }}>Current Schedules</h3>

          {schedules.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No scheduled operating windows set.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {schedules.map(item => (
                <div key={item._id} style={styles.scheduleRow}>
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.95rem' }}>
                      {item.applianceName || item.applianceId?.name || 'Appliance'}
                    </strong>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      Operating Window: <strong style={{ color: '#38bdf8' }}>{item.scheduledStart} - {item.scheduledEnd}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`badge ${item.source === 'RL Agent' ? 'badge-primary' : 'badge-warning'}`}>
                      {item.source}
                    </span>
                    <button onClick={() => handleDeleteSchedule(item._id)} style={styles.deleteBtn} title="Cancel">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  aiHighlightCard: {
    marginBottom: '24px',
    border: '1px solid rgba(251, 191, 36, 0.3)',
    background: 'rgba(30, 41, 59, 0.85)'
  },
  aiBadgeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  },
  comparisonGrid: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '16px',
    flexWrap: 'wrap'
  },
  planBox: (bg, border) => ({
    flex: 1,
    minWidth: '220px',
    background: bg,
    border: `1px solid ${border}`,
    borderRadius: '12px',
    padding: '16px'
  }),
  reasoningFooter: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-color)',
    fontSize: '0.85rem',
    color: '#cbd5e1'
  },
  twoColumnLayout: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
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
  },
  scheduleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)'
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer'
  }
};
