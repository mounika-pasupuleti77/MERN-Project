import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { solarAPI } from '../services/api';
import { Sun, Cloud, CloudSun, TrendingUp, Cpu } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function Solar() {
  const [weather, setWeather] = useState('Sunny');
  const [currentSolar, setCurrentSolar] = useState(null);
  const [solarHistory, setSolarHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSolarData = async () => {
    try {
      setLoading(true);
      const [currRes, histRes] = await Promise.all([
        solarAPI.getCurrent(weather),
        solarAPI.getHistory()
      ]);
      setCurrentSolar(currRes.data);
      
      const formattedHist = histRes.data.map(item => ({
        time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        generation: item.generation,
        forecast: item.forecastGeneration
      }));
      setSolarHistory(formattedHist);
    } catch (err) {
      console.error('Failed to load solar telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSolarData();
  }, [weather]);

  const s = currentSolar || { generation: 4.8, forecastGeneration: 5.2, weatherCondition: weather };

  return (
    <div>
      <Navbar title="Solar Photovoltaic Energy" />

      {/* Weather Selector & Indicator */}
      <div style={styles.headerBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={18} color="#38bdf8" />
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Telemetry Source: <strong style={{ color: '#f8fafc' }}>Virtual IoT Simulator</strong>
          </span>
        </div>

        <div style={styles.weatherPicker}>
          <span style={{ fontSize: '0.82rem', color: '#94a3b8', marginRight: '6px' }}>Simulate Weather:</span>
          {['Sunny', 'Cloudy', 'Variable'].map((w) => (
            <button
              key={w}
              onClick={() => setWeather(w)}
              className={`btn ${weather === w ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              {w === 'Sunny' && <Sun size={14} />}
              {w === 'Cloudy' && <Cloud size={14} />}
              {w === 'Variable' && <CloudSun size={14} />}
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Solar Metrics Cards */}
      <div style={styles.cardGrid}>
        <StatCard
          title="Current Generation"
          value={s.generation}
          unit="kW"
          subtitle={`Condition: ${weather}`}
          icon={Sun}
          color="#f59e0b"
          badgeText="Active Output"
          badgeType="warning"
        />

        <StatCard
          title="Forecast Generation (+2h)"
          value={s.forecastGeneration}
          unit="kW"
          subtitle="AI Solar Irradiance Model"
          icon={TrendingUp}
          color="#10b981"
        />

        <StatCard
          title="Solar System Utilization"
          value="82%"
          subtitle="6.0 kW Max Array Capacity"
          icon={Sun}
          color="#38bdf8"
          badgeText="Optimal"
          badgeType="success"
        />
      </div>

      {/* Solar Curve Graph */}
      <div className="glass-card" style={{ marginTop: '24px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Time vs Solar Generation (24-Hour Profile)</span>
          <span className="badge badge-warning">Simulated Telemetry Curve</span>
        </h3>

        <div style={{ height: '340px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={solarHistory}>
              <defs>
                <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" unit=" kW" />
              <Tooltip 
                contentStyle={{ background: '#1e293b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="generation" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#solarGrad)" name="Actual Output (kW)" />
              <Area type="monotone" dataKey="forecast" stroke="#38bdf8" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Forecast (kW)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const styles = {
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '12px'
  },
  weatherPicker: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px'
  }
};
