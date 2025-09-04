import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChevronDown, Plus } from 'lucide-react';
import './MetricasMensais.css';

const MetricasMensais = () => {
  const topProductsData = [
    { name: 'Produto 1', value: 60, color: '#ff6b35' },
    { name: 'Produto 2', value: 70, color: '#f4c2a1' },
    { name: 'Produto 3', value: 56, color: '#8e8e93' },
    { name: 'Produto 4', value: 40, color: '#a8dadc' },
    { name: 'Produto 5', value: 22, color: '#f1c0a8' },
  ];

  const revenueData = [
    { month: 'Janeiro', value: 45000 },
    { month: 'Fevereiro', value: 38000 },
    { month: 'Março', value: 52000 },
    { month: 'Abril', value: 48000 },
    { month: 'Maio', value: 58000 },
  ];

  const inactiveProducts = [
    { name: 'Batom', category: 'Batom' },
    { name: 'Batom', category: 'Batom' },
  ];

  return (
    <div className="metricas-mensais">
      <div className="page-header">
        <h1 className="page-title">Métricas mensais</h1>
        <button className="add-platform-btn">
          <Plus size={16} />
          Nova plataforma
        </button>
      </div>

      <div className="platform-selector">
        <div className="selector-container">
          <button className="platform-dropdown">
            <span>Selecione a plataforma desejada</span>
            <ChevronDown size={16} />
          </button>
        </div>
      </div>

      <div className="metrics-content">
        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-item">
            <span className="stat-label">Entradas no mês atual:</span>
            <span className="stat-value highlight">Maio</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Quantidade de produtos:</span>
            <span className="stat-value">140</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Valor investido:</span>
            <span className="stat-value">R$849,96</span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="revenue-card">
          <div className="revenue-label">Receita Mensal</div>
          <div className="revenue-amount">R$849,96</div>
        </div>

        {/* Inactive Products */}
        <div className="inactive-section">
          <div className="section-header">
            <span className="section-title">Produtos inativos nos últimos 60 dias:</span>
            <span className="see-more">Ver mais</span>
          </div>
          <div className="inactive-list">
            {inactiveProducts.map((product, index) => (
              <div key={index} className="inactive-item">
                <span className="product-category">{product.category}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          {/* Top 5 Products Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Top 5 Produtos mais vendidos</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topProductsData} layout="horizontal">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Bar dataKey="value" fill="#e91e63" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="chart-card">
            <h3 className="chart-title">Receita Mensal</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#e91e63" 
                    strokeWidth={3}
                    dot={{ fill: '#e91e63', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricasMensais;
