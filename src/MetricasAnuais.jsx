import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip 
} from 'recharts';
import { ChevronDown, Plus } from 'lucide-react';
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

  // Hook para buscar os anos disponíveis quando o componente montar
  useEffect(() => {
    const fetchAvailableYears = async () => {
      try {
        const response = await fetch(`${API_URL}/anos-disponiveis`);
        if (response.ok) {
          const years = await response.json();
          setAvailableYears(years);
        }
      } catch (error) {
        console.error("Erro ao buscar anos disponíveis:", error);
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
      try {
        // 1. Buscar Receita Total (para o Card)
        const revenueRes = await fetch(`${API_URL}/vendas/total?plataforma=${plataformaId}&ano=${selectedYear}`);
        if (revenueRes.ok) {
          const revenueData = await revenueRes.json();
          setTotalRevenue(revenueData);
        }

        // 2. Buscar Vendas por Plataforma (Gráfico de Pizza)
        const platformRes = await fetch(`${API_URL}/vendas/por-plataforma?ano=${selectedYear}`);
        if (platformRes.ok) {
          const data = await platformRes.json();
          // Mapear a resposta [["Shopee", 100], ...] para [{ name: "Shopee", value: 100 }, ...]
          const mappedData = data.map((item) => ({
            name: item[0],
            value: item[1]
          }));
          setPlatformData(mappedData);
        }

        // 3. Buscar Top 5 Produtos (Gráfico de Barras Horizontal)
        const top5Res = await fetch(`${API_URL}/top5?plataforma=${plataformaId}&ano=${selectedYear}`);
        if (top5Res.ok) {
          const data = await top5Res.json();
          // Mapear [["Produto A", 50], ...] para [{ name: "Produto A", value: 50 }, ...]
          const mappedData = data.map((item) => ({
            name: item[0],
            value: item[1]
          }));
          setTop5ProductData(mappedData);
        }

        // 4. Buscar Receita Mensal (Gráfico de Barras Vertical)
        const monthlyRes = await fetch(`${API_URL}/receita/mensal?plataforma=${plataformaId}&ano=${selectedYear}`);
        if (monthlyRes.ok) {
          const data = await monthlyRes.json();
          // Mapear [["2025-10", 15000], ...] para [{ month: "2025-10", value: 15000 }, ...]
          const mappedData = data.map((item) => ({
            month: item[0], // Formato "YYYY-MM"
            value: item[1]
          }));
          setMonthlyRevenueData(mappedData);
        }

      } catch (error) {
        console.error("Erro ao buscar dados da API:", error);
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
              {availableYears.map((year) => (
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
              ))}
            </div>
          )}
        </div>
        <div className="year-display">
          <span className="year-label">Ano</span>
          <span className="year-value">{selectedYear}</span>
        </div>
      </div>

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
          </div>
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
        </div>

        <div className="chart-card monthly-chart">
          <h3 className="chart-title">Top 5 produtos mais vendidos - {selectedYear}</h3>
          <div className="ranking-list">
            {top5ProductData.map((product, index) => (
              <div key={index} className="ranking-item">
                <div className="ranking-position">{index + 1}</div>
                <div className="ranking-info">
                  <span className="ranking-name">{product.name}</span>
                  <span className="ranking-value">{product.value} vendas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="chart-card gross-value-chart">
          <h3 className="chart-title">Receita Mensal {selectedYear}</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                {/* Eixo X agora usa "month" */}
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
                <Tooltip formatter={(value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
                <Bar dataKey="value" fill="#e91e63" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricasAnuais;