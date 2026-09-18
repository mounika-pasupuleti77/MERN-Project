import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import EnergyFlow from '../components/EnergyFlow';
import { dashboardAPI, applianceAPI } from '../services/api';
import { Zap, Sun, BatteryCharging, ArrowUpRight, DollarSign, Activity, AlertCircle, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [dashData, setDashData] = useState(null);
  const [activeApps, setActiveApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, appRes] = await Promise.all([
        dashboardAPI.getDashboardData(),
        applianceAPI.getAppliances()
      ]);
      setDashData(dashRes.data);
      setActiveApps(appRes.data.filter(app => app.status === 'ON'));
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to fetch live energy telemetry from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Auto refresh every 10s
    return () => clearInterval(interval);
  }, []);

  if (loading && !dashData) {
    return (
      <div>
        <Navbar title="Dashboard" />
        <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
          <RefreshCw size={32} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '12px' }}>Connecting to Virtual IoT Energy Backend...</p>
        </div>
      </div>
    );
  }

  const d = dashData || {
    totalConsumption: 3.5,
    solarGeneration: 4.2,
    gridImport: 0,
    gridExport: 0.7,
    batterySOC: 72,
    batteryStatus: 'idle',
    currentPrice: 0.16,
    priceCategory: 'Medium',
    todayCost: 4.25
  };

  return (
    <div>
      <Navbar title="Dashboard" />

      {error && (
        <div style={styles.errorBox}>
          <AlertCircle size={20} color="#ef4444" />
          <span>{error}</span>
          <button onClick={loadData} className="btn btn-outline" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Summary Stat Cards Grid */}
      <div style={styles.cardGrid}>
        <StatCard
          title="Energy Consumption"
          value={d.totalConsumption}
          unit="kW"
          subtitle="Real-Time Household Demand"
          icon={Zap}
          color="#38bdf8"
        />

        <StatCard
          title="Solar Generation"
          value={d.solarGeneration}
          unit="kW"
          subtitle="Peak Output Efficiency"
          icon={Sun}
          color="#f59e0b"
          badgeText="PV Solar Active"
          badgeType="warning"
        />

        <StatCard
          title="Battery State (SOC)"
          value={`${d.batterySOC}%`}
          subtitle={`Status: ${d.batteryStatus || 'idle'}`}
          icon={BatteryCharging}
          color="#10b981"
          badgeText={`${d.batterySOC}% Capacity`}
          badgeType="success"
        />

        <StatCard
          title="Grid Import / Export"
          value={d.gridImport > 0 ? `${d.gridImport} kW` : `${d.gridExport} kW`}
          subtitle={d.gridImport > 0 ? 'Importing from Grid' : 'Exporting Solar Surplus'}
          icon={ArrowUpRight}
          color="#a855f7"
          badgeText={d.gridImport > 0 ? 'Grid Import' : 'Grid Export'}
          badgeType={d.gridImport > 0 ? 'danger' : 'success'}
        />

        <StatCard
          title="Electricity Price"
          value={`$${d.currentPrice}`}
          unit="/ kWh"
          subtitle="Dynamic Tariff"
          icon={DollarSign}
          color="#ec4899"
          badgeText={d.priceCategory || 'Medium'}
          badgeType={d.priceCategory === 'High' ? 'danger' : d.priceCategory === 'Low' ? 'success' : 'warning'}
        />

        <StatCard
          title="Today's Estimated Cost"
          value={`$${d.todayCost}`}
          subtitle="Cumulative Daily Tariff"
          icon={Activity}
          color="#0284c7"
        />
      </div>

      {/* Energy Flow Visualization & Active Appliances */}
      <div style={styles.middleSection}>
        <div style={{ flex: 1.5 }}>
          <EnergyFlow
            solarGen={d.solarGeneration}
            loadDemand={d.totalConsumption}
            batterySOC={d.batterySOC}
            batteryStatus={d.batteryStatus}
            gridImport={d.gridImport}
            gridExport={d.gridExport}
          />
        </div>

        <div style={{ flex: 1 }} className="glass-card">
          <h3 style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Active Appliances</span>
            <span className="badge badge-success">{activeApps.length} Running</span>
          </h3>

          {activeApps.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No heavy appliances currently active.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeApps.map(app => (
                <div key={app._id} style={styles.appRow}>
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '0.92rem' }}>{app.name}</strong>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{app.type || 'Standard'} • {app.powerRating} kW</div>
                  </div>
                  <span className="badge badge-success">ON</span>
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
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '28px'
  },
  middleSection: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  },
  appRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)'
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#f87171',
    padding: '12px 18px',
    borderRadius: '10px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};
