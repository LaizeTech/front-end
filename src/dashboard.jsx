import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, Users, DollarSign, Bot } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const salesData = [
    { name: 'Shoope', value: 40 },
    { name: 'Nuvem Shop', value: 40 },
    { name: 'Loja Física', value: 40 },
  ];

  const categoryData = [
    { name: 'Batom vermelho', quantity: 5, status: 'low' },
    { name: 'Gloss', quantity: 3, status: 'low' },
    { name: 'Delineador', quantity: 5, status: 'low' },
  ];

  const recentProducts = [
    { name: 'Batom vermelho', quantity: 5 },
    { name: 'Gloss', quantity: 3 },
    { name: 'Delineador', quantity: 5 },
  ];

  const activeEmployees = 12;

  const [renda, setrenda] = useState([]); // estado para armazenar renda

  // Função usando then/catch
  function buscarThenCatch() {
    console.log("Utilizando Fetch com .then() e .catch()!");

    fetch("http://localhost:8080/saidas/renda-bruta-7dias")
      .then(function (resposta) {
        console.log("then resposta:", resposta);
        return resposta.json(); // converte a resposta em JSON
      })
      .then(function (dados) {
        console.log("then dados", dados);
        setrenda(dados); // salva no estado
      })
      .catch(function (erro) {
        console.warn("erro: ", erro);
      });
  }

  // Chama a função ao carregar o componente
  useEffect(() => {
    buscarThenCatch();
  }, []);

  return (
    <div className="dashboard">
      {/* Chatbot Button */}
      <button className="chatbot-button" title="Abrir Chat">
        <Bot size={28} />
      </button>

      <div className="dashboard-header">
        <h1 className="page-title">Overview</h1>
      </div>

      <div className="dashboard-grid">
        {/* Revenue Card */}  
        <div className="dashboard-card revenue-card">
          <div className="card-header">
            <h3>Semana e mês atual</h3>
            <span className="revenue-period">Receita total dos últimos 7 dias</span>
          </div>
          <div className="revenue-amount">
            {renda ? `R$ ${renda.renda_bruta_7dias}` : 'Carregando...'}
          </div>
        </div>

        {/* Category Section */}
        <div className="dashboard-card category-card">
          <div className="card-header">
            <h3>Category</h3>
            <span className="card-subtitle">Produtos com estoque baixo</span>
          </div>
          <div className="category-list">
            {categoryData.slice(0, 2).map((item, index) => (
              <div key={index} className="category-item">
                <div className="category-info">
                  <div className="category-icon low-stock"></div>
                  <div className="category-details">
                    <span className="category-name">{item.name}</span>
                    <span className="category-quantity">Quantidade: {item.quantity}</span>
                    <span className="category-store">NuvemShop - Shoope</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Chart */}
        <div className="dashboard-card sales-card">
          <div className="card-header">
            <h3>Vendas do mês</h3>
          </div>
          <div className="sales-list">
            {salesData.map((item, index) => (
              <div key={index} className="sales-item">
                <span className="sales-name">{item.name}</span>
                <span className="sales-value">Qnt: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card activity-card">
          <div className="card-header">
            <h3>Entradas - últimos 3 dias</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon entry"></div>
              <div className="activity-details">
                <span className="activity-count">40 +</span>
                <span className="activity-description">Quantidade de produtos que entraram</span>
              </div>
            </div>
          </div>
          
          <div className="card-header">
            <h3>Saídas - últimos 3 dias</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon exit"></div>
              <div className="activity-details">
                <span className="activity-count">15 -</span>
                <span className="activity-description">Quantidade de produtos que saíram</span>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Products */}
        <div className="dashboard-card products-card">
          <div className="card-header">
            <h3>Category</h3>
            <span className="card-subtitle">Últimos 5 produtos adicionados/ atualizados</span>
          </div>
          <div className="products-list">
            {recentProducts.slice(0, 2).map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-icon"></div>
                <div className="product-details">
                  <span className="product-name">{product.name}</span>
                  <span className="product-quantity">Quantidade: {product.quantity}</span>
                  <span className="product-store">NuvemShop - Loja Física</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Employees */}
        <div className="dashboard-card employees-card">
          <div className="card-header">
            <h3>Funcionários ativos</h3>
          </div>
          <div className="employees-count">{activeEmployees}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
