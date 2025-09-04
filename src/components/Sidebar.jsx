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
    { path: '/', icon: Home, label: 'Início' },
    { path: '/estoque', icon: Package, label: 'Estoque' },
    { path: '/dashboard', icon: BarChart3, label: 'OverView' },
    { path: '/metricas-mensais', icon: BarChart3, label: 'Métricas Mensais' },
    { path: '/metricas-anuais', icon: BarChart3, label: 'Métricas Anuais' },
    { path: '/funcionarios', icon: Users, label: 'Funcionários' },
    { path: '/entradas', icon: ArrowUpCircle, label: 'Entradas' },
    { path: '/saidas', icon: ArrowDownCircle, label: 'Saídas' },
    { path: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">L</span>
        </div>
        <h2 className="company-name">Laizetech</h2>
      </div>

      <div className="search-container">
        <div className="search-box">
          <Search className="search-icon" size={16} />
          <input 
            type="text" 
            placeholder="Search for..." 
            className="search-input"
          />
        </div>
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
        <div className="user-section">
          <div className="user-avatar">
            <User size={16} />
          </div>
          <span className="user-text">Conta</span>
        </div>
        <button className="logout-btn">
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

