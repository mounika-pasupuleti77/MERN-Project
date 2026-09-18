import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { batteryAPI } from '../services/api';
import { BatteryCharging, Zap, ArrowDownCircle, ArrowUpCircle, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Battery() {
  const [battery, setBattery] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchBattery = async () => {
    try {
      setLoading(true);
      const res = await batteryAPI.getStatus();
      setBattery(res.data);
    } catch (err) {
      setError('Failed to connect to battery manager.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBattery();
  }, []);

  const handleCharge = async () => {
    setMessage(null);
    setError(null);
    try {
      const res = await batteryAPI.charge(1.0); // Charge 1 kWh
      setBattery(res.data.battery);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Charge failed due to SOC limits.');
    }
  };

  const handleDischarge = async () => {
    setMessage(null);
    setError(null);
    try {
      const res = await batteryAPI.discharge(1.0); // Discharge 1 kWh
      setBattery(res.data.battery);
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Discharge failed due to SOC limits.');
    }
  };

  const b = battery || { capacity: 10, currentSOC: 72, minSOC: 15, maxSOC: 95, status: 'idle', chargeRate: 3.3, dischargeRate: 3.3 };
  const storedKWh = ((b.currentSOC / 100) * b.capacity).toFixed(1);

  return (
    <div>
      <Navbar title="Battery Energy Storage System (BESS)" />

      {message && (
        <div style={{ ...styles.alertBox, background: 'rgba(16, 185, 129, 0.12)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
          <ShieldCheck size={20} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div style={{ ...styles.alertBox, background: 'rgba(239, 68, 68, 0.12)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#f87171' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Battery State Showcase */}
      <div style={styles.mainLayout}>
        {/* Left: Circular SOC Visual Gauge */}
        <div className="glass-card" style={styles.gaugeCard}>
          <h3>State of Charge (SOC)</h3>
          
          <div style={styles.circularGauge}>
            <svg width="220" height="220" viewBox="0 0 220 220">
              <circle cx="110" cy="110" r="90" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18" />
              <circle
                cx="110"
                cy="110"
                r="90"
                fill="none"
                stroke="#10b981"
                strokeWidth="18"
                strokeDasharray={2 * Math.PI * 90}
                strokeDashoffset={2 * Math.PI * 90 * (1 - b.currentSOC / 100)}
                strokeLinecap="round"
                transform="rotate(-90 110 110)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div style={styles.gaugeText}>
              <span style={styles.socNumber}>{b.currentSOC}%</span>
              <span style={styles.socSub}>{storedKWh} / {b.capacity} kWh</span>
            </div>
          </div>

          <div style={styles.statusBadgeRow}>
            <span className={`badge ${b.status === 'charging' ? 'badge-success' : b.status === 'discharging' ? 'badge-warning' : 'badge-primary'}`}>
              Status: {b.status.toUpperCase()}
            </span>
          </div>

          {/* Interactive Manual Test Controls */}
          <div style={styles.controlButtons}>
            <button onClick={handleCharge} className="btn btn-success" style={{ flex: 1 }}>
              <ArrowDownCircle size={18} /> Charge (+1 kWh)
            </button>
            <button onClick={handleDischarge} className="btn btn-primary" style={{ flex: 1 }}>
              <ArrowUpCircle size={18} /> Discharge (-1 kWh)
            </button>
          </div>
        </div>

        {/* Right: Technical Specs & Protection Limits */}
        <div style={styles.specsColumn}>
          <div className="glass-card">
            <h3 style={{ marginBottom: '16px' }}>Operating Specifications</h3>
            
            <div style={styles.specRow}>
              <span>Total Capacity:</span>
              <strong>{b.capacity} kWh (Lithium-Ion)</strong>
            </div>
            <div style={styles.specRow}>
              <span>Max Charge Rate:</span>
              <strong>{b.chargeRate} kW</strong>
            </div>
            <div style={styles.specRow}>
              <span>Max Discharge Rate:</span>
              <strong>{b.dischargeRate} kW</strong>
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck color="#10b981" size={20} />
              <span>SOC Safety Boundary Protections</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Minimum SOC Limit:</span>
                  <strong style={{ color: '#f87171' }}>{b.minSOC}%</strong>
                </div>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${b.minSOC}%`, background: '#ef4444' }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Maximum SOC Limit:</span>
                  <strong style={{ color: '#34d399' }}>{b.maxSOC}%</strong>
                </div>
                <div style={styles.barTrack}>
                  <div style={{ ...styles.barFill, width: `${b.maxSOC}%`, background: '#10b981' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  alertBox: {
    padding: '12px 18px',
    borderRadius: '10px',
    border: '1px solid',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '0.9rem'
  },
  mainLayout: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
  },
  gaugeCard: {
    flex: '1.2',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px'
  },
  circularGauge: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10px 0'
  },
  gaugeText: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  socNumber: { fontSize: '2.8rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 },
  socSub: { fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' },
  statusBadgeRow: { marginBottom: '8px' },
  controlButtons: {
    display: 'flex',
    gap: '12px',
    width: '100%'
  },
  specsColumn: {
    flex: '1',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  specRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid var(--border-color)',
    fontSize: '0.9rem',
    color: '#cbd5e1'
  },
  barTrack: {
    height: '8px',
    background: '#0f172a',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  barFill: {
    height: '100%',
    borderRadius: '4px'
  }
};
