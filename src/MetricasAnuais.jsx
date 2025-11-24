import React, { useState, useEffect } from 'react';

import { 
  PieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip 
} from 'recharts';
import { ChevronDown, Plus } from 'lucide-react';
import NovaPlataformaModal from './components/NovaPlataformaModal';
import './MetricasAnuais.css';

// URL base da sua API Spring Boot (ajuste a porta se necessário)
const API_URL = 'http://localhost:8080/produtos';

// Cores para o gráfico de pizza, já que o backend não as fornece
const PIE_COLORS = ['#ff6b35', '#e91e63', '#f8a5c2', '#4caf50', '#2196f3'];

const MetricasAnuais = () => {
  
  // Estados para armazenar os dados vindos da API
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [platformData, setPlatformData] = useState([]);
  const [top5ProductData, setTop5ProductData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  
  // Estados para controle de ano
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

    // Estado para modal de nova plataforma
    const [showNovaPlataformaModal, setShowNovaPlataformaModal] = useState(false);

  // Hook para buscar os anos disponíveis quando o componente montar
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await fetch(`${API_URL}/anos-disponiveis`);
        if (!response.ok) {
          throw new Error('Erro ao buscar anos disponíveis');
        }
        const years = await response.json();
        
        if (years && years.length > 0) {
          setAvailableYears(years);
          // Se o ano atual não estiver na lista, seleciona o ano mais recente
          if (!years.includes(selectedYear)) {
            setSelectedYear(years[years.length - 1]);
          }
        } else {
          // Se não houver anos, usa o ano atual
          setAvailableYears([new Date().getFullYear()]);
        }
      } catch (error) {
        console.error("Erro ao buscar anos disponíveis:", error);
        // Em caso de erro, usa o ano atual
        setAvailableYears([new Date().getFullYear()]);
      }
    };

    fetchAvailableYears();
  }, []);

  // Hook para fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showYearDropdown && !event.target.closest('.year-dropdown-container')) {
        setShowYearDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showYearDropdown]);

  // Hook para buscar os dados quando o ano selecionado mudar
  useEffect(() => {
    // ID da plataforma (hardcoded como 1 para este exemplo)
    const plataformaId = 1;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // 1. Buscar Receita Total (para o Card)
        const revenueRes = await fetch(`${API_URL}/vendas/total?plataforma=${plataformaId}&ano=${selectedYear}`);
        if (!revenueRes.ok) {
          throw new Error('Erro ao buscar receita total');
        }
        const revenueData = await revenueRes.json();
        setTotalRevenue(revenueData || 0);

        // 2. Buscar Vendas por Plataforma (Gráfico de Pizza)
        const platformRes = await fetch(`${API_URL}/vendas/por-plataforma?ano=${selectedYear}`);
        if (!platformRes.ok) {
          throw new Error('Erro ao buscar vendas por plataforma');
        }
        const platformRawData = await platformRes.json();
        
        // Mapear a resposta [["Shopee", 100], ...] para [{ name: "Shopee", value: 100 }, ...]
        const mappedPlatformData = Array.isArray(platformRawData) && platformRawData.length > 0
          ? platformRawData.map((item) => ({
              name: item[0],
              value: item[1]
            }))
          : [];
        setPlatformData(mappedPlatformData);

        // 3. Buscar Top 5 Produtos (Gráfico de Barras Horizontal)
        const top5Res = await fetch(`${API_URL}/top5?plataforma=${plataformaId}&ano=${selectedYear}`);
        if (!top5Res.ok) {
          throw new Error('Erro ao buscar top 5 produtos');
        }
        const top5RawData = await top5Res.json();
        
        // Mapear [["Produto A", 50], ...] para [{ name: "Produto A", value: 50 }, ...]
        const mappedTop5Data = Array.isArray(top5RawData) && top5RawData.length > 0
          ? top5RawData.map((item) => ({
              name: item[0],
              value: item[1]
            }))
          : [];
        setTop5ProductData(mappedTop5Data);

        // 4. Buscar Receita Mensal (Gráfico de Barras Vertical)
        const monthlyRes = await fetch(`${API_URL}/receita/mensal?plataforma=${plataformaId}&ano=${selectedYear}`);
        if (!monthlyRes.ok) {
          throw new Error('Erro ao buscar receita mensal');
        }
        const monthlyRawData = await monthlyRes.json();
        
        // Mapear [["2025-10", 15000], ...] para [{ month: "2025-10", value: 15000 }, ...]
        const mappedMonthlyData = Array.isArray(monthlyRawData) && monthlyRawData.length > 0
          ? monthlyRawData.map((item) => ({
              month: item[0], // Formato "YYYY-MM"
              value: item[1]
            }))
          : [];
        setMonthlyRevenueData(mappedMonthlyData);

      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
        setError(error.message || "Erro ao carregar os dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedYear) {
      fetchData();
    }
  }, [selectedYear]); // Recarrega os dados quando o ano mudar

  return (
    <div className="metricas-anuais">
      <div className="page-header">
        <div className="header-left">
          <h1 className="page-title">Métricas anuais</h1>
          <p className="page-subtitle">Análise anual geral</p>
        </div>
        <button className="add-platform-btn" onClick={() => setShowNovaPlataformaModal(true)}>
          <Plus style={{ width: 'clamp(14px, 1.4vw, 18px)', height: 'clamp(14px, 1.4vw, 18px)' }} />
          Nova plataforma
        </button>
      </div>
      <NovaPlataformaModal
        isOpen={showNovaPlataformaModal}
        onClose={() => setShowNovaPlataformaModal(false)}
        onSave={(novaPlataforma) => {
          // Atualizar a lista de plataformas após adicionar uma nova
          // TODO: Implementar a lógica de atualização da lista de plataformas
          setShowNovaPlataformaModal(false);
        }}
      />

      <div className="year-selector">
        <div className="year-dropdown-container">
          <button 
            className="year-dropdown"
            onClick={() => setShowYearDropdown(!showYearDropdown)}
          >
            <span>Selecione o ano</span>
            <ChevronDown style={{ width: 'clamp(14px, 1.4vw, 18px)', height: 'clamp(14px, 1.4vw, 18px)' }} />
          </button>
          {showYearDropdown && (
            <div className="year-dropdown-menu">
              {availableYears.length > 0 ? (
                availableYears.map((year) => (
                  <button
                    key={year}
                    className={`year-option ${year === selectedYear ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedYear(year);
                      setShowYearDropdown(false);
                    }}
                  >
                    {year}
                  </button>
                ))
              ) : (
                <div className="no-data-message">Ainda não há anos disponíveis para análise 📅</div>
              )}
            </div>
          )}
        </div>
        <div className="year-display">
          <span className="year-label">Ano</span>
          <span className="year-value">{selectedYear}</span>
        </div>
      </div>

      {/* Mensagem de loading */}
      {isLoading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-title">Aguarde um momento...</p>
          <p className="loading-subtitle">Estamos buscando suas métricas anuais 📊</p>
        </div>
      )}

      {/* Mensagem de erro */}
      {error && !isLoading && (
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-title">Ops! Algo deu errado</p>
          <p className="error-message">Não conseguimos carregar os dados no momento. Por favor, verifique sua conexão e tente novamente.</p>
          <button 
            className="retry-button"
            onClick={() => setSelectedYear(selectedYear)}
          >
          Tentar novamente
          </button>
        </div>
      )}

      {/* Conteúdo principal - apenas exibir se não estiver carregando e não houver erro */}
      {!isLoading && !error && (
        <div className="annual-content">
          <div className="revenue-card">
            <div className="revenue-label">Receita Anual {selectedYear}</div>
            <div className="revenue-amount">
              {totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </div>
          </div>

          <div className="chart-card platform-chart">
            <h3 className="chart-title">Quantidade de produtos vendidos por plataforma - {selectedYear}</h3>
            <div className="chart-container">
              {platformData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${value}`}
                      >
                        {platformData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="platform-legend">
                    {platformData.map((item, index) => (
                      <div key={index} className="legend-item">
                        <div
                          className="legend-color"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        ></div>
                        <span className="legend-text">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="no-data-message">
                  <div className="no-data-icon">📊</div>
                  <p>Ainda não temos dados de vendas por plataforma para {selectedYear}</p>
                  <span className="no-data-hint">Comece a registrar suas vendas para ver os gráficos aqui!</span>
                </div>
              )}
            </div>
          </div>

          <div className="chart-card monthly-chart">
            <h3 className="chart-title">Top 5 produtos mais vendidos - {selectedYear}</h3>
            <div className="ranking-list">
              {top5ProductData.length > 0 ? (
                top5ProductData.map((product, index) => (
                  <div key={index} className="ranking-item">
                    <div className="ranking-position">{index + 1}</div>
                    <div className="ranking-info">
                      <span className="ranking-name">{product.name}</span>
                      <span className="ranking-value">{product.value} vendas</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data-message">
                  <div className="no-data-icon">🏆</div>
                  <p>Nenhum produto vendido ainda em {selectedYear}</p>
                  <span className="no-data-hint">Suas primeiras vendas aparecerão aqui em breve!</span>
                </div>
              )}
            </div>
          </div>

          <div className="chart-card gross-value-chart">
            <h3 className="chart-title">Receita Mensal {selectedYear}</h3>
            <div className="chart-container">
              {monthlyRevenueData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
                    <Tooltip formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                    <Bar dataKey="value" fill="#e91e63" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-message">
                  <div className="no-data-icon">💰</div>
                  <p>Nenhuma receita registrada para {selectedYear}</p>
                  <span className="no-data-hint">Quando você realizar vendas, o gráfico mensal aparecerá aqui!</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricasAnuais;