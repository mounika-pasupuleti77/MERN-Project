import React from 'react';
import { Activity, Clock } from 'lucide-react';

export default function Navbar({ title = 'Dashboard' }) {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <header style={styles.header}>
      <div>
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h1>
        <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
          Dual-Agent RL Controlled Virtual IoT Environment
        </p>
      </div>

      <div style={styles.statusGroup}>
        <div style={styles.statusBadge}>
          <div className="pulse-dot"></div>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#34d399' }}>
            System Active
          </span>
        </div>

        <div style={styles.timeBadge}>
          <Clock size={14} color="#38bdf8" />
          <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 500 }}>
            {currentTime}
          </span>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '28px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--border-color)'
  },
  statusGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    padding: '6px 14px',
    borderRadius: '20px'
  },
  timeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid var(--border-color)',
    padding: '6px 14px',
    borderRadius: '20px'
  }
};
