import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  BarChart3, 
  Users, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Settings,
  Search,
  User,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Início' },
    { path: '/estoque', icon: Package, label: 'Estoque' },
    { path: '/metricas-mensais', icon: BarChart3, label: 'Métricas Mensais' },
    { path: '/metricas-anuais', icon: BarChart3, label: 'Métricas Anuais' },
    { path: '/funcionarios', icon: Users, label: 'Funcionários' },
    { path: '/entradas', icon: ArrowUpCircle, label: 'Entradas' },
    { path: '/saidas', icon: ArrowDownCircle, label: 'Saídas' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">L</span>
        </div>
        <h2 className="company-name">Laizetech</h2>
      </div>


      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/configuracoes">
        <div className="user-section">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <Link to="/configuracoes" className="user-text">Conta</Link>
        </div>
        </Link>
        <button className="logout-btn">
          <LogOut size={16}/>
          <Link to="/login" className="logout-btn">Sair</Link>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

