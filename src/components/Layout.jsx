import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import AccessibilityControls from './AccessibilityControls';
import useAuthCheck from '../utils/useAuthCheck';
import './Layout.css';

const Layout = () => {
  // Monitorar sessão de autenticação
  useAuthCheck();

  return (
    <div className="layout">
      <Sidebar />
      <AccessibilityControls position="fixed" />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

