import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { ChevronDown, Plus } from 'lucide-react';
import './MetricasAnuais.css';

const MetricasAnuais = () => {
  const platformData = [
    { name: 'Shopee', value: 472, color: '#ff6b35' },
    { name: 'NuvemShop', value: 211, color: '#e91e63' },
    { name: 'Loja Física', value: 105, color: '#e91e63' },
  ];

  const monthlyData = [
    { month: 'Dezembro', value: 55 },
    { month: 'Janeiro', value: 48 },
    { month: 'Fevereiro', value: 42 },
    { month: 'Março', value: 38 },
    { month: 'Abril', value: 35 },
  ];

  const grossValueData = [
    { platform: 'Shopee', value: 85000, color: '#ff6b35' },
    { platform: 'NuvemShop', value: 65000, color: '#e91e63' },
    { platform: 'Loja Física', value: 45000, color: '#f8a5c2' },
  ];

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
        <button className="year-dropdown">
          <span>Selecione o ano</span>
          <ChevronDown size={16} />
        </button>
        <div className="year-display">
          <span className="year-label">Ano</span>
          <span className="year-value">2024</span>
        </div>
      </div>

      <div className="annual-content">
        {/* Revenue Card */}
        <div className="revenue-card">
          <div className="revenue-label">Receita Anual</div>
          <div className="revenue-amount">R$14.000,96</div>
        </div>

        {/* Platform Sales Chart */}
        <div className="chart-card platform-chart">
          <h3 className="chart-title">Quantidade de produtos vendidos por plataforma</h3>
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="platform-legend">
            {platformData.map((item, index) => (
              <div key={index} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="legend-text">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Months Chart */}
        <div className="chart-card monthly-chart">
          <h3 className="chart-title">Top 5 meses com mais saídas</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData} layout="horizontal">
                <XAxis type="number" hide />
                <YAxis dataKey="month" type="category" width={80} />
                <Bar dataKey="value" fill="#e91e63" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gross Value Chart */}
        <div className="chart-card gross-value-chart">
          <h3 className="chart-title">Valor Bruto por Plataforma</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={grossValueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
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
