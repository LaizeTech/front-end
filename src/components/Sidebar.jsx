import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { logout } from '../utils/sessionUtils';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Verificar o acesso financeiro do usuário
  const acessoFinanceiro = sessionStorage.getItem('acessoFinanceiro') === 'true';

  // Todos os itens do menu
  const allMenuItems = [
    { 
      path: '/dashboard', 
      icon: Home, 
      label: 'Início',
      keywords: ['dashboard', 'home', 'resumo', 'visão geral', 'principal', 'estatísticas', 'gráficos', 'indicadores'],
      requiresFinancialAccess: true
    },
    { 
      path: '/estoque', 
      icon: Package, 
      label: 'Estoque',
      keywords: ['estoque', 'produtos', 'inventário', 'mercadorias', 'itens', 'quantidade', 'disponível', 'armazém'],
      requiresFinancialAccess: false
    },
    { 
      path: '/metricas-mensais', 
      icon: BarChart3, 
      label: 'Métricas Mensais',
      keywords: ['métricas', 'mensais', 'relatórios', 'análise', 'desempenho', 'vendas', 'faturamento', 'mês'],
      requiresFinancialAccess: true
    },
    { 
      path: '/metricas-anuais', 
      icon: BarChart3, 
      label: 'Métricas Anuais',
      keywords: ['métricas', 'anuais', 'relatórios', 'análise', 'desempenho', 'vendas', 'faturamento', 'ano', 'anual'],
      requiresFinancialAccess: true
    },
    { 
      path: '/funcionarios', 
      icon: Users, 
      label: 'Funcionários',
      keywords: ['funcionários', 'colaboradores', 'equipe', 'pessoal', 'usuários', 'perfil', 'cadastro', 'rh'],
      requiresFinancialAccess: true
    },
    { 
      path: '/entradas', 
      icon: ArrowUpCircle, 
      label: 'Entradas',
      keywords: ['entradas', 'recebimento', 'compras', 'aquisições', 'fornecedores', 'chegada', 'input'],
      requiresFinancialAccess: false
    },
    { 
      path: '/saidas', 
      icon: ArrowDownCircle, 
      label: 'Saídas',
      keywords: ['saídas', 'vendas', 'expedição', 'despacho', 'entrega', 'clientes', 'output', 'baixa'],
      requiresFinancialAccess: false
    },
  ];

  // Filtrar itens do menu baseado no acesso financeiro
  const menuItems = allMenuItems.filter(item => {
    // Se tiver acesso financeiro, mostra tudo
    if (acessoFinanceiro) return true;
    // Se não tiver, mostra apenas os que não requerem acesso financeiro
    return !item.requiresFinancialAccess;
  });

  // Filtrar itens do menu baseado no termo de pesquisa (label + keywords)
  const filteredMenuItems = menuItems.filter(item => {
    const searchTermLower = searchTerm.toLowerCase();
    const labelMatch = item.label.toLowerCase().includes(searchTermLower);
    const keywordMatch = item.keywords.some(keyword => 
      keyword.toLowerCase().includes(searchTermLower)
    );
    return labelMatch || keywordMatch;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Função para encontrar a palavra-chave correspondente
  const getMatchingKeyword = (item, searchTerm) => {
    if (!searchTerm) return null;
    const searchTermLower = searchTerm.toLowerCase();
    
    // Se o label já contém o termo, não precisa mostrar keyword
    if (item.label.toLowerCase().includes(searchTermLower)) return null;
    
    // Encontrar a keyword que corresponde
    const matchingKeyword = item.keywords.find(keyword => 
      keyword.toLowerCase().includes(searchTermLower)
    );
    
    return matchingKeyword;
  };

  // Função para fazer logout
  const handleLogout = () => {
    logout(); // Limpa o sessionStorage
    navigate('/login', { replace: true }); // Redireciona para login
  };

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
            placeholder="Pesquisar seções ou conteúdo..." 
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const matchingKeyword = getMatchingKeyword(item, searchTerm);
              
              return (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={20} className="nav-icon" />
                    <div className="nav-text">
                      <span className="nav-label">{item.label}</span>
                      {matchingKeyword && searchTerm && (
                        <span className="nav-keyword">
                          Encontrado: "{matchingKeyword}"
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })
          ) : searchTerm && (
            <li className="nav-item no-results">
              <div className="nav-link">
                <span className="nav-label">Nenhum resultado encontrado</span>
              </div>
            </li>
          )}
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
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

