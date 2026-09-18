import React from 'react';
import { Sun, Home, Battery, Zap, ArrowRight, ArrowDown } from 'lucide-react';

export default function EnergyFlow({ 
  solarGen = 4.2, 
  loadDemand = 3.5, 
  batterySOC = 72, 
  batteryStatus = 'idle',
  gridImport = 0, 
  gridExport = 0.7 
}) {
  const isCharging = batteryStatus === 'charging';
  const isDischarging = batteryStatus === 'discharging';

  return (
    <div className="glass-card" style={styles.container}>
      <div style={styles.header}>
        <h3>Real-Time Energy Flow</h3>
        <span className="badge badge-primary">Simulated IoT Telemetry</span>
      </div>

      <div style={styles.flowGrid}>
        {/* Top: Solar */}
        <div style={styles.solarNode}>
          <div style={styles.nodeCircle('linear-gradient(135deg, #f59e0b, #fbbf24)')}>
            <Sun size={28} color="#ffffff" />
          </div>
          <span style={styles.nodeLabel}>Solar Array</span>
          <span style={styles.nodeValue}>{solarGen} kW</span>
        </div>

        {/* Middle Row: Home & Battery */}
        <div style={styles.middleRow}>
          {/* Battery */}
          <div style={styles.batteryNode}>
            <div style={styles.nodeCircle('linear-gradient(135deg, #10b981, #34d399)')}>
              <Battery size={26} color="#ffffff" />
            </div>
            <span style={styles.nodeLabel}>Battery Storage</span>
            <span style={styles.nodeValue}>{batterySOC}% ({batteryStatus})</span>
          </div>

          {/* Center: Home */}
          <div style={styles.homeNode}>
            <div style={styles.nodeCircle('linear-gradient(135deg, #0284c7, #38bdf8)')}>
              <Home size={30} color="#ffffff" />
            </div>
            <span style={styles.nodeLabel}>Smart Home</span>
            <span style={styles.nodeValue}>{loadDemand} kW Load</span>
          </div>

          {/* Grid */}
          <div style={styles.gridNode}>
            <div style={styles.nodeCircle('linear-gradient(135deg, #a855f7, #c084fc)')}>
              <Zap size={26} color="#ffffff" />
            </div>
            <span style={styles.nodeLabel}>Utility Grid</span>
            <span style={styles.nodeValue}>
              {gridImport > 0 ? `Import: ${gridImport} kW` : `Export: ${gridExport} kW`}
            </span>
          </div>
        </div>

        {/* Energy Flow Statistics Breakdown */}
        <div style={styles.flowMetrics}>
          <div style={styles.metricPill}>
            <span style={{ color: '#fbbf24' }}>☀ Solar → 🏠 Home:</span>
            <strong>{Math.min(solarGen, loadDemand).toFixed(1)} kW</strong>
          </div>
          <div style={styles.metricPill}>
            <span style={{ color: '#34d399' }}>☀ Solar → 🔋 Battery:</span>
            <strong>{isCharging ? '1.5 kW' : '0 kW'}</strong>
          </div>
          <div style={styles.metricPill}>
            <span style={{ color: '#38bdf8' }}>🔋 Battery → 🏠 Home:</span>
            <strong>{isDischarging ? '1.5 kW' : '0 kW'}</strong>
          </div>
          <div style={styles.metricPill}>
            <span style={{ color: '#c084fc' }}>⚡ Grid → 🏠 Home:</span>
            <strong>{gridImport} kW</strong>
          </div>
          <div style={styles.metricPill}>
            <span style={{ color: '#f87171' }}>🏠 Home → ⚡ Grid:</span>
            <strong>{gridExport} kW</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  flowGrid: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '16px 0'
  },
  solarNode: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px'
  },
  middleRow: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center'
  },
  batteryNode: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  homeNode: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  gridNode: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' },
  nodeCircle: (bg) => ({
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
  }),
  nodeLabel: { fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 },
  nodeValue: { fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 },
  flowMetrics: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '12px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-color)',
    width: '100%'
  },
  metricPill: {
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '8px 14px',
    borderRadius: '10px',
    fontSize: '0.82rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid var(--border-color)'
  }
};
