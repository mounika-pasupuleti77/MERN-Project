import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Tv, 
  Zap, 
  Sun, 
  BatteryCharging, 
  CalendarClock, 
  BrainCircuit, 
  BarChart3, 
  Settings, 
  LogOut, 
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Appliances', path: '/appliances', icon: Tv },
  { name: 'Energy', path: '/energy', icon: Zap },
  { name: 'Solar', path: '/solar', icon: Sun },
  { name: 'Battery', path: '/battery', icon: BatteryCharging },
  { name: 'Scheduling', path: '/schedule', icon: CalendarClock },
  { name: 'RL Decisions', path: '/rl-decisions', icon: BrainCircuit },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <aside style={styles.sidebar}>
      {/* Brand Header */}
      <div style={styles.brand}>
        <div style={styles.logoIcon}>
          <BrainCircuit size={26} color="#38bdf8" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
            SmartEnergy <span style={{ color: '#38bdf8' }}>AI</span>
          </h2>
          <span style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.05em' }}>
            DUAL-AGENT RL
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.link,
                ...(isActive ? styles.activeLink : {})
              })}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>
            <UserIcon size={18} color="#e2e8f0" />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              {user ? user.name : 'Guest User'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={12} color="#10b981" /> {user ? user.role : 'Virtual Demo'}
            </div>
          </div>
        </div>

        {user && (
          <button onClick={logout} style={styles.logoutBtn} title="Logout">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 'var(--sidebar-width)',
    height: '100vh',
    background: 'rgba(15, 23, 42, 0.95)',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    backdropFilter: 'blur(16px)',
    padding: '20px 16px'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px 24px 12px',
    borderBottom: '1px solid var(--border-color)'
  },
  logoIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'rgba(56, 189, 248, 0.12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(56, 189, 248, 0.3)'
  },
  nav: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '16px',
    overflowY: 'auto'
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 14px',
    borderRadius: '10px',
    color: '#94a3b8',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '0.9rem',
    transition: 'all 0.2s ease'
  },
  activeLink: {
    background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.18), rgba(56, 189, 248, 0.04))',
    color: '#38bdf8',
    fontWeight: 600,
    borderLeft: '3px solid #38bdf8'
  },
  footer: {
    paddingTop: '16px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#334155',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoutBtn: {
    background: 'transparent',
    border: 'none',
    color: '#94a3b8',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '6px',
    transition: 'color 0.2s'
  }
};
