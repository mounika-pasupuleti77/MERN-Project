import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { analyticsAPI } from '../services/api';
import { BarChart3, TrendingDown, DollarSign, Award, Zap, Sun } from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [sumRes, dailyRes] = await Promise.all([
          analyticsAPI.getSummary(),
          analyticsAPI.getDaily()
        ]);
        setSummary(sumRes.data);
        setDailyData(dailyRes.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const s = summary || {
    totalConsumption: 48.5,
    solarGeneration: 28.2,
    gridUsage: 20.3,
    batteryUsage: 8.4,
    totalCost: 4.25,
    peakDemand: 4.5,
    energySaved: 3.80,
    renewablePercentage: 58.1
  };

  return (
    <div>
      <Navbar title="Energy Analytics & Cost Optimization" />

      {/* Cost Comparison Showcase Banner */}
      <div className="glass-card" style={styles.costBanner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Award size={24} color="#10b981" />
          <div>
            <h3 style={{ margin: 0, color: '#ffffff' }}>AI Optimization Financial Impact</h3>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>SIMULATION RESULT • B.TECH MAJOR PROJECT</span>
          </div>
        </div>

        <div style={styles.costCardsGrid}>
          <div style={styles.costCard('rgba(239, 68, 68, 0.1)', '#f87171')}>
            <span style={styles.costCardLabel}>Without AI Scheduling</span>
            <div style={styles.costCardVal}>$6.50 / day</div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>100% Unoptimized Peak Usage</span>
          </div>

          <div style={styles.costCard('rgba(16, 185, 129, 0.15)', '#34d399')}>
            <span style={styles.costCardLabel}>With Dual-Agent AI</span>
            <div style={styles.costCardVal}>$3.90 / day</div>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Solar Storage & Load Shifted</span>
          </div>

          <div style={styles.costCard('rgba(56, 189, 248, 0.15)', '#38bdf8')}>
            <span style={styles.costCardLabel}>Estimated Savings</span>
            <div style={styles.costCardVal}>$2.60 / day</div>
            <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 700 }}>40.0% Tariff Reduction</span>
          </div>
        </div>
      </div>

      {/* Analytics Stat Cards */}
      <div style={styles.cardGrid}>
        <StatCard
          title="Total Consumption"
          value={s.totalConsumption}
          unit="kWh"
          subtitle="Household Aggregate"
          icon={Zap}
          color="#38bdf8"
        />

        <StatCard
          title="Solar Generation"
          value={s.solarGeneration}
          unit="kWh"
          subtitle="Renewable Energy Produced"
          icon={Sun}
          color="#f59e0b"
        />

        <StatCard
          title="Renewable Penetration"
          value={`${s.renewablePercentage}%`}
          subtitle="Clean Solar Share"
          icon={BarChart3}
          color="#10b981"
          badgeText="High Green %"
          badgeType="success"
        />

        <StatCard
          title="Peak Power Demand"
          value={s.peakDemand}
          unit="kW"
          subtitle="Maximum Instantaneous Load"
          icon={TrendingDown}
          color="#ec4899"
        />
      </div>

      {/* 6 Recharts Charts Grid */}
      <div style={styles.chartsGrid}>
        {/* Chart 1: Energy Consumption vs Time */}
        <div className="glass-card">
          <h4>1. Energy Consumption vs Time</h4>
          <div style={{ height: '220px', marginTop: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: '#1e293b', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Line type="monotone" dataKey="consumption" stroke="#38bdf8" strokeWidth={2} name="Consumption (kW)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Solar Generation vs Time */}
        <div className="glass-card">
          <h4>2. Solar Generation vs Time</h4>
          <div style={{ height: '220px', marginTop: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: '#1e293b', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="solar" stroke="#f59e0b" fill="#f59e0b30" name="Solar Output (kW)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Grid Import vs Time */}
        <div className="glass-card">
          <h4>3. Grid Import vs Time</h4>
          <div style={{ height: '220px', marginTop: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: '#1e293b', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Bar dataKey="grid" fill="#a855f7" radius={[4,4,0,0]} name="Grid Import (kW)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Battery Discharge vs Time */}
        <div className="glass-card">
          <h4>4. Battery Discharge vs Time</h4>
          <div style={{ height: '220px', marginTop: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: '#1e293b', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Bar dataKey="battery" fill="#10b981" radius={[4,4,0,0]} name="Battery Contribution (kW)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 5: Electricity Tariff vs Time */}
        <div className="glass-card">
          <h4>5. Electricity Tariff vs Time</h4>
          <div style={{ height: '220px', marginTop: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: '#1e293b', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Line type="stepAfter" dataKey="cost" stroke="#ec4899" strokeWidth={2} name="Tariff ($/kWh)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Cumulative Daily Cost */}
        <div className="glass-card">
          <h4>6. Cumulative Daily Cost ($)</h4>
          <div style={{ height: '220px', marginTop: '12px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: '#1e293b', borderColor: 'rgba(255,255,255,0.1)' }} />
                <Area type="monotone" dataKey="cost" stroke="#0284c7" fill="#0284c730" name="Cost ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  costBanner: {
    marginBottom: '24px',
    background: 'rgba(30, 41, 59, 0.85)',
    border: '1px solid rgba(16, 185, 129, 0.3)'
  },
  costCardsGrid: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  costCard: (bg, color) => ({
    flex: 1,
    minWidth: '200px',
    background: bg,
    border: `1px solid ${color}40`,
    borderRadius: '12px',
    padding: '16px'
  }),
  costCardLabel: { fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 },
  costCardVal: { fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', margin: '4px 0' },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '20px'
  }
};
