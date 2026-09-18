import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Appliances from './pages/Appliances';
import Solar from './pages/Solar';
import Battery from './pages/Battery';
import Schedule from './pages/Schedule';
import RlDecisions from './pages/RlDecisions';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="appliances" element={<Appliances />} />
        <Route path="energy" element={<Dashboard />} />
        <Route path="solar" element={<Solar />} />
        <Route path="battery" element={<Battery />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="rl-decisions" element={<RlDecisions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
