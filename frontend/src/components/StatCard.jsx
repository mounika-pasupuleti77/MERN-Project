import React from 'react';

export default function StatCard({ title, value, unit, subtitle, icon: Icon, color = '#38bdf8', badgeText, badgeType = 'primary' }) {
  return (
    <div className="glass-card card-hover" style={styles.card}>
      <div style={styles.topRow}>
        <span style={styles.title}>{title}</span>
        {Icon && (
          <div style={styles.iconBox(color)}>
            <Icon size={20} color={color} />
          </div>
        )}
      </div>

      <div style={styles.valueRow}>
        <span style={styles.value}>{value}</span>
        {unit && <span style={styles.unit}>{unit}</span>}
      </div>

      <div style={styles.bottomRow}>
        {subtitle && <span style={styles.subtitle}>{subtitle}</span>}
        {badgeText && (
          <span className={`badge badge-${badgeType}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '130px'
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '0.85rem',
    color: '#94a3b8',
    fontWeight: 500
  },
  iconBox: (color) => ({
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: `${color}18`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${color}30`
  }),
  valueRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
    margin: '8px 0'
  },
  value: {
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#ffffff',
    lineHeight: 1
  },
  unit: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    fontWeight: 500
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px'
  },
  subtitle: {
    fontSize: '0.78rem',
    color: '#64748b'
  }
};
