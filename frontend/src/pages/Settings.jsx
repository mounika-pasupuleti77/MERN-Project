import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Cpu, ShieldCheck, Database, Server } from 'lucide-react';

export default function Settings() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Navbar title="System Settings & Configuration" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* User Account Settings */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} color="#38bdf8" /> User Profile Info
          </h3>

          <div style={styles.grid}>
            <div style={styles.item}>
              <span style={styles.label}>Account Name:</span>
              <strong>{user ? user.name : 'Virtual Demo User'}</strong>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Email Address:</span>
              <strong>{user ? user.email : 'demo@smarthome.ai'}</strong>
            </div>
            <div style={styles.item}>
              <span style={styles.label}>Role:</span>
              <span className="badge badge-success">{user ? user.role : 'System Admin'}</span>
            </div>
          </div>
        </div>

        {/* AI & Environment Backend Parameters */}
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="#f59e0b" /> Reinforcement Learning & Virtual IoT Config
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={styles.row}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Server size={16} color="#38bdf8" />
                <span>Backend REST API URL:</span>
              </div>
              <code style={styles.code}>http://localhost:5000/api</code>
            </div>

            <div style={styles.row}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} color="#a855f7" />
                <span>Python RL Service URL:</span>
              </div>
              <code style={styles.code}>http://localhost:8000/predict</code>
            </div>

            <div style={styles.row}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={16} color="#10b981" />
                <span>Database Connection:</span>
              </div>
              <strong style={{ color: '#34d399' }}>MongoDB (Mongoose Connected)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
  item: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '0.8rem', color: '#94a3b8' },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '0.9rem'
  },
  code: {
    background: '#0f172a',
    padding: '4px 10px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    color: '#38bdf8',
    fontFamily: 'monospace',
    fontSize: '0.85rem'
  }
};
