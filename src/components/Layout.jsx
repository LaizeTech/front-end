import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuthCheck from '../utils/useAuthCheck';
import './Layout.css';

const Layout = () => {
  // Monitorar sessão de autenticação
  useAuthCheck();

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

