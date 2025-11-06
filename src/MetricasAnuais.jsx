import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip 
} from 'recharts';
import { ChevronDown, Plus } from 'lucide-react';
import './MetricasAnuais.css';

const API_URL = 'http://localhost:8080/produtos';

const PIE_COLORS = ['#ff6b35', '#e91e63', '#f8a5c2', '#4caf50', '#2196f3'];

const MetricasAnuais = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [platformData, setPlatformData] = useState([]);
  const [top5ProductData, setTop5ProductData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Efeito para buscar os anos disponíveis
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
          // Define o ano selecionado para o último ano disponível, se o ano atual não estiver na lista
          if (!years.includes(selectedYear)) {
            setSelectedYear(years[years.length - 1]);
          }
        } else {
          // Se não houver anos disponíveis, usa o ano atual como padrão
          setAvailableYears([new Date().getFullYear()]);
        }
      } catch (error) {
        console.error("Erro ao buscar anos disponíveis:", error);
        setAvailableYears([new Date().getFullYear()]);
      }
    };

    fetchAvailableYears();
  }, []);

  // Efeito para fechar o dropdown ao clicar fora
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

  // Efeito principal para buscar os dados de métricas com base no ano selecionado
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {

        // 1. RECEITA TOTAL ANUAL - Não passa 'plataforma' para buscar o total GERAL
        const revenueRes = await fetch(`${API_URL}/vendas/total?ano=${selectedYear}`);
        if (!revenueRes.ok) {
          throw new Error('Erro ao buscar receita total');
        }
        const revenueData = await revenueRes.json();
        setTotalRevenue(revenueData || 0);

        // 2. VENDAS POR PLATAFORMA - Já estava correto (busca GERAL por ano)
        const platformRes = await fetch(`${API_URL}/vendas/por-plataforma?ano=${selectedYear}`);
        if (!platformRes.ok) {
          throw new Error('Erro ao buscar vendas por plataforma');
        }
        const platformRawData = await platformRes.json();
        
        const mappedPlatformData = Array.isArray(platformRawData) && platformRawData.length > 0
          ? platformRawData.map((item) => ({
              name: item[0], // Nome da plataforma
              value: item[1] // Quantidade vendida
            }))
          : [];
        setPlatformData(mappedPlatformData);

        // 3. TOP 5 PRODUTOS - Não passa 'plataforma' para buscar o top 5 GERAL
        const top5Res = await fetch(`${API_URL}/top5?ano=${selectedYear}`);
        if (!top5Res.ok) {
          throw new Error('Erro ao buscar top 5 produtos');
        }
        const top5RawData = await top5Res.json();
        
        const mappedTop5Data = Array.isArray(top5RawData) && top5RawData.length > 0
          ? top5RawData.map((item) => ({
              name: item[0], // Nome do produto
              value: item[1] // Quantidade vendida
            }))
          : [];
        setTop5ProductData(mappedTop5Data);

        // 4. RECEITA MENSAL - Não passa 'plataforma' para buscar a receita GERAL
        // O backend foi ajustado para retornar a abreviação do mês (ex: "Jan")
        const monthlyRes = await fetch(`${API_URL}/receita/mensal?ano=${selectedYear}`);
        if (!monthlyRes.ok) {
          throw new Error('Erro ao buscar receita mensal');
        }
        const monthlyRawData = await monthlyRes.json();
        
        const mappedMonthlyData = Array.isArray(monthlyRawData) && monthlyRawData.length > 0
          ? monthlyRawData.map((item) => ({
              month: item[0], // Usa o nome abreviado do mês retornado pelo SQL
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
        <button className="add-platform-btn">
          <Plus size={16} />
          Nova plataforma
        </button>
      </div>

      <div className="year-selector">
        <div className="year-dropdown-container">
          <button 
            className="year-dropdown"
            onClick={() => setShowYearDropdown(!showYearDropdown)}
          >
            <span>Selecione o ano</span>
            <ChevronDown size={16} />
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
            // Força a recarga redefinindo o ano para o mesmo valor
            onClick={() => setSelectedYear(selectedYear)} 
          >
          Tentar novamente
          </button>
        </div>
      )}
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
                    {/* DataKey agora é 'month', que virá formatado do backend (Jan, Fev, etc.) */}
                    <XAxis dataKey="month" /> 
                    <YAxis tickFormatter={(value) => `R$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} `} />
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