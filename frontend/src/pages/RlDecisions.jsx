import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { rlAPI } from '../services/api';
import { BrainCircuit, Battery, Zap, Clock, Sparkles, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function RlDecisions() {
  const [rlInput, setRlInput] = useState({
    solarGeneration: 4.2,
    loadDemand: 3.8,
    batterySOC: 65,
    electricityPrice: 0.32,
    time: 18
  });

  const [decision, setDecision] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFetchDecision = async () => {
    setLoading(true);
    try {
      const res = await rlAPI.getDecision(rlInput);
      setDecision(res.data);
    } catch (err) {
      alert('Failed to obtain RL agent decision');
    } finally {
      setLoading(false);
    }
  };

  const d = decision || {
    timestamp: new Date(),
    agent1: {
      name: 'Energy Supply Agent',
      action: 'battery_discharge',
      batteryRateKw: 1.5,
      reasoning: 'Peak tariff rate ($0.32/kWh) detected during Hour 18. Discharging battery to eliminate grid import.'
    },
    agent2: {
      name: 'Appliance Scheduling Agent',
      action: 'shift_appliance',
      shiftedAppliances: ['EV Charger', 'Washing Machine'],
      recommendedOperatingWindow: '01:00 AM - 05:00 AM',
      reasoning: 'High household demand during peak tariff window. Deferring flexible heavy loads to off-peak night hours.'
    },
    estimatedCost: 0,
    source: 'Dual-Agent Reinforcement Learning Engine'
  };

  return (
    <div>
      <Navbar title="Dual-Agent Reinforcement Learning Decisions" />

      {/* Header Banner explaining Dual-Agent System */}
      <div className="glass-card" style={styles.banner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BrainCircuit size={32} color="#38bdf8" />
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff' }}>Dual-Agent RL Architecture</h2>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              Decoupled multi-agent reinforcement learning. Agent 1 manages Energy Supply (Solar, Battery, Grid), while Agent 2 manages Demand & Appliance Load Shifting.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Input Trigger Form */}
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px' }}>Simulate Environment State Input</h3>

        <div style={styles.inputGrid}>
          <div>
            <label style={styles.label}>Solar Generation (kW)</label>
            <input
              type="number"
              step="0.1"
              value={rlInput.solarGeneration}
              onChange={e => setRlInput({ ...rlInput, solarGeneration: parseFloat(e.target.value) })}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Household Load (kW)</label>
            <input
              type="number"
              step="0.1"
              value={rlInput.loadDemand}
              onChange={e => setRlInput({ ...rlInput, loadDemand: parseFloat(e.target.value) })}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Battery SOC (%)</label>
            <input
              type="number"
              value={rlInput.batterySOC}
              onChange={e => setRlInput({ ...rlInput, batterySOC: parseInt(e.target.value) })}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Electricity Price ($/kWh)</label>
            <input
              type="number"
              step="0.01"
              value={rlInput.electricityPrice}
              onChange={e => setRlInput({ ...rlInput, electricityPrice: parseFloat(e.target.value) })}
              style={styles.input}
            />
          </div>

          <div>
            <label style={styles.label}>Hour of Day (0-23)</label>
            <input
              type="number"
              min="0" max="23"
              value={rlInput.time}
              onChange={e => setRlInput({ ...rlInput, time: parseInt(e.target.value) })}
              style={styles.input}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button onClick={handleFetchDecision} className="btn btn-primary" style={{ width: '100%', height: '42px' }}>
              <Send size={16} /> Evaluate RL Policy
            </button>
          </div>
        </div>
      </div>

      {/* Dual Agent Decision Cards */}
      <div style={styles.agentCardsGrid}>
        {/* Agent 1 Card */}
        <div className="glass-card" style={styles.agentCard('#38bdf8')}>
          <div style={styles.agentHeader}>
            <div style={styles.iconCircle('#38bdf8')}>
              <Battery size={24} color="#ffffff" />
            </div>
            <div>
              <span className="badge badge-primary">AGENT 1</span>
              <h3 style={{ margin: '2px 0 0 0', color: '#ffffff' }}>Energy Supply Agent</h3>
            </div>
          </div>

          <div style={styles.actionHighlight('#38bdf8')}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>OPTIMAL SUPPLY ACTION</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', marginTop: '2px' }}>
              {d.agent1.action.replace('_', ' ')}
            </div>
          </div>

          <div style={styles.reasonBox}>
            <strong style={{ color: '#f8fafc', fontSize: '0.85rem' }}>Decision Reasoning:</strong>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '6px 0 0 0' }}>
              {d.agent1.reasoning}
            </p>
          </div>
        </div>

        {/* Agent 2 Card */}
        <div className="glass-card" style={styles.agentCard('#10b981')}>
          <div style={styles.agentHeader}>
            <div style={styles.iconCircle('#10b981')}>
              <Clock size={24} color="#ffffff" />
            </div>
            <div>
              <span className="badge badge-success">AGENT 2</span>
              <h3 style={{ margin: '2px 0 0 0', color: '#ffffff' }}>Appliance Scheduling Agent</h3>
            </div>
          </div>

          <div style={styles.actionHighlight('#10b981')}>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>OPTIMAL DEMAND ACTION</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginTop: '2px' }}>
              {d.agent2.action.replace('_', ' ')}
            </div>
            {d.agent2.recommendedOperatingWindow && (
              <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '4px' }}>
                Window: <strong>{d.agent2.recommendedOperatingWindow}</strong>
              </div>
            )}
          </div>

          <div style={styles.reasonBox}>
            <strong style={{ color: '#f8fafc', fontSize: '0.85rem' }}>Decision Reasoning:</strong>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '6px 0 0 0' }}>
              {d.agent2.reasoning}
            </p>
          </div>
        </div>
      </div>

      {/* Decision Metadata Footer */}
      <div style={styles.metaRow}>
        <span>Decision Source: <strong style={{ color: '#38bdf8' }}>{d.source}</strong></span>
        <span>Estimated Grid Cost: <strong style={{ color: '#10b981' }}>${d.estimatedCost}</strong></span>
      </div>
    </div>
  );
}

const styles = {
  banner: {
    marginBottom: '24px',
    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
    border: '1px solid rgba(56, 189, 248, 0.2)'
  },
  inputGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px'
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
  agentCardsGrid: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
  },
  agentCard: (color) => ({
    flex: 1,
    minWidth: '300px',
    borderTop: `4px solid ${color}`
  }),
  agentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px'
  },
  iconCircle: (color) => ({
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  actionHighlight: (color) => ({
    background: 'rgba(15, 23, 42, 0.6)',
    padding: '16px',
    borderRadius: '12px',
    border: `1px solid ${color}30`,
    marginBottom: '16px'
  }),
  reasonBox: {
    background: 'rgba(15, 23, 42, 0.4)',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)'
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px 20px',
    marginTop: '24px',
    background: 'rgba(15, 23, 42, 0.8)',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    fontSize: '0.9rem',
    color: '#cbd5e1'
  }
};
