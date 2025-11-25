import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingUp, Package, Users, DollarSign, Bot } from 'lucide-react';
import './Dashboard.css';

// Exemplo de uso do fetch com a variável de ambiente
import { useEffect } from 'react';

const Dashboard = () => {
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_BASE_URL;
    fetch(`${API_URL}/usuario/login`)
      .then(response => response.json())
      .then(data => {
        // Apenas exemplo: console.log
        console.log('Login API response:', data);
      })
      .catch(error => {
        console.error('Erro ao chamar login:', error);
      });
  }, []);
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

  const [activeEmployees, setActiveEmployees] = useState(0);
  const [alertaProdutos, setAlertaProdutos] = useState([]); // estado para armazenar alertas de produtos
  const [vendasPorPlataforma, setVendasPorPlataforma] = useState([]); // estado para armazenar vendas por plataforma
  const [ultimasCompras, setUltimasCompras] = useState([]); // estado para armazenar últimas compras
  const [entradasUltimos3Dias, setEntradasUltimos3Dias] = useState(0); // estado para armazenar entradas dos últimos 3 dias
  const [saidasUltimos3Dias, setSaidasUltimos3Dias] = useState(0); // estado para armazenar saídas dos últimos 3 dias

  const [renda, setrenda] = useState([]); // estado para armazenar renda

  // Função usando then/catch
  function buscarThenCatch() {
    console.log("Utilizando Fetch com .then() e .catch()!");

    fetch("http://localhost:8080/saidas/renda-bruta-7dias")
      .then(function (resposta) {
        console.log("then resposta:", resposta);
        if (resposta.status === 204) {
          // Sem conteúdo, define como 0
          return { renda_bruta_7dias: 0 };
        }
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

  // Função para buscar funcionários ativos
  function buscarFuncionariosAtivos() {
    console.log("Buscando funcionários ativos...");

    fetch("http://localhost:8080/usuarios/contar-ativos", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
      .then(function (resposta) {
        console.log("resposta funcionários:", resposta);
        console.log("status:", resposta.status);
        if (resposta.status === 204) {
          return { usuarios_ativos: 0 };
        }
        if (!resposta.ok) {
          throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        return resposta.json();
      })
      .then(function (dados) {
        console.log("dados funcionários", dados);
        setActiveEmployees(dados.usuarios_ativos || 0);
      })
      .catch(function (erro) {
        console.error("erro ao buscar funcionários: ", erro);
        console.error("Tipo do erro:", erro.name);
        console.error("Mensagem:", erro.message);
        setActiveEmployees(0);
      });
  }

  // Função para buscar alertas de produtos
  function buscarAlertasProdutos() {
    console.log("Buscando alertas de produtos...");

    fetch("http://localhost:8080/alertas/produto-alerta", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
      .then(function (resposta) {
        console.log("resposta alertas:", resposta);
        console.log("status:", resposta.status);
        if (resposta.status === 204) {
          return "sem_alertas";
        }
        if (!resposta.ok) {
          throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        return resposta.json();
      })
      .then(function (dados) {
        console.log("dados alertas", dados);
        if (dados === "sem_alertas") {
          setAlertaProdutos("sem_alertas");
        } else {
          setAlertaProdutos(dados || []);
        }
      })
      .catch(function (erro) {
        console.error("erro ao buscar alertas: ", erro);
        console.error("Tipo do erro:", erro.name);
        console.error("Mensagem:", erro.message);
        setAlertaProdutos([]);
      });
  }

  // Função para buscar vendas por plataforma
  function buscarVendasPorPlataforma() {
    console.log("Buscando vendas por plataforma...");

    fetch("http://localhost:8080/saidas/por-plataforma", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
      .then(function (resposta) {
        console.log("resposta vendas:", resposta);
        console.log("status:", resposta.status);
        if (resposta.status === 204) {
          return "sem_vendas";
        }
        if (!resposta.ok) {
          throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        return resposta.json();
      })
      .then(function (dados) {
        console.log("dados vendas", dados);
        if (dados === "sem_vendas") {
          setVendasPorPlataforma("sem_vendas");
        } else {
          setVendasPorPlataforma(dados || []);
        }
      })
      .catch(function (erro) {
        console.error("erro ao buscar vendas: ", erro);
        console.error("Tipo do erro:", erro.name);
        console.error("Mensagem:", erro.message);
        setVendasPorPlataforma([]);
      });
  }

  // Função para buscar últimas compras
  function buscarUltimasCompras() {
    console.log("Buscando últimas compras...");

    fetch("http://localhost:8080/compras/ultimas-compras", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
      .then(function (resposta) {
        console.log("resposta compras:", resposta);
        console.log("status:", resposta.status);
        if (resposta.status === 204) {
          return "sem_compras";
        }
        if (!resposta.ok) {
          throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        return resposta.json();
      })
      .then(function (dados) {
        console.log("dados compras", dados);
        if (dados === "sem_compras") {
          setUltimasCompras("sem_compras");
        } else {
          setUltimasCompras(dados || []);
        }
      })
      .catch(function (erro) {
        console.error("erro ao buscar compras: ", erro);
        console.error("Tipo do erro:", erro.name);
        console.error("Mensagem:", erro.message);
        setUltimasCompras([]);
      });
  }

  // Função para buscar entradas dos últimos 3 dias
  function buscarEntradasUltimos3Dias() {
    console.log("Buscando entradas dos últimos 3 dias...");

    fetch("http://localhost:8080/compras/contagem-ultimos-3-dias", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
      .then(function (resposta) {
        console.log("resposta entradas:", resposta);
        console.log("status:", resposta.status);
        if (resposta.status === 204) {
          return { quantidade_entradas_ultimos_3_dias: 0 };
        }
        if (!resposta.ok) {
          throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        return resposta.json();
      })
      .then(function (dados) {
        console.log("dados entradas", dados);
        setEntradasUltimos3Dias(dados.quantidade_entradas_ultimos_3_dias || 0);
      })
      .catch(function (erro) {
        console.error("erro ao buscar entradas: ", erro);
        console.error("Tipo do erro:", erro.name);
        console.error("Mensagem:", erro.message);
        setEntradasUltimos3Dias(0);
      });
  }

  // Função para buscar saídas dos últimos 3 dias
  function buscarSaidasUltimos3Dias() {
    console.log("Buscando saídas dos últimos 3 dias...");

    fetch("http://localhost:8080/saidas/quantidade-ultimos-3-dias", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors'
    })
      .then(function (resposta) {
        console.log("resposta saídas:", resposta);
        console.log("status:", resposta.status);
        if (resposta.status === 204) {
          return { quantidade_saidas_ultimos_3_dias: 0 };
        }
        if (!resposta.ok) {
          throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        return resposta.json();
      })
      .then(function (dados) {
        console.log("dados saídas", dados);
        setSaidasUltimos3Dias(dados.quantidade_saidas_ultimos_3_dias || 0);
      })
      .catch(function (erro) {
        console.error("erro ao buscar saídas: ", erro);
        console.error("Tipo do erro:", erro.name);
        console.error("Mensagem:", erro.message);
        setSaidasUltimos3Dias(0);
      });
  }

  // Chama as funções ao carregar o componente
  useEffect(() => {
    buscarThenCatch();
    buscarFuncionariosAtivos();
    buscarAlertasProdutos();
    buscarVendasPorPlataforma();
    buscarUltimasCompras();
    buscarEntradasUltimos3Dias();
    buscarSaidasUltimos3Dias();
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
            <h3>Alerta Quantidade</h3>
            <span className="card-subtitle">
              {alertaProdutos === "sem_alertas"
                ? "Não existe produtos com alertas de quantidade"
                : Array.isArray(alertaProdutos)
                  ? `Produtos com estoque baixo (${alertaProdutos.length} produtos)`
                  : "Carregando..."}
            </span>
          </div>
          <div className="category-list scrollable-list">
            {alertaProdutos === "sem_alertas" ? (
              <div className="category-item">
                <div className="category-info">
                  <div className="category-details">
                    <span className="category-name">Não existe produtos com alertas de quantidade</span>
                  </div>
                </div>
              </div>
            ) : Array.isArray(alertaProdutos) ? (
              alertaProdutos.map((item, index) => (
                <div key={index} className={`category-item ${
                  item.nivel_alerta === 'Alerta Vermelho' ? 'alert-red' :
                  item.nivel_alerta === 'Alerta Amarelo' ? 'alert-yellow' :
                  item.nivel_alerta === 'Alerta Violeta' ? 'alert-purple' :
                  'alert-red'
                }`}>
                  <div className="category-info">
                    <div className={`category-icon ${
                      item.nivel_alerta === 'Alerta Vermelho' ? 'alert-red' :
                      item.nivel_alerta === 'Alerta Amarelo' ? 'alert-yellow' :
                      item.nivel_alerta === 'Alerta Violeta' ? 'alert-purple' :
                      'low-stock'
                    }`}></div>
                    <div className="category-details">
                      <span className="category-name">{item.nome_produto}</span>
                      <span className="category-quantity">Quantidade: {item.quantidade_produto}</span>
                      <span className="category-store">{item.nivel_alerta}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="category-item">
                <div className="category-info">
                  <div className="category-details">
                    <span className="category-name">Carregando produtos...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sales Chart */}
        <div className="dashboard-card sales-card">
          <div className="card-header">
            <h3>Vendas do mês</h3>
            <span className="card-subtitle">
              {vendasPorPlataforma === "sem_vendas"
                ? "Não houve vendas no mês"
                : Array.isArray(vendasPorPlataforma)
                  ? `Vendas por plataforma (${vendasPorPlataforma.length} plataformas)`
                  : "Carregando..."}
            </span>
          </div>
          <div className="sales-list">
            {vendasPorPlataforma === "sem_vendas" ? (
              <div className="sales-item">
                <span className="sales-name">Não houve vendas no mês</span>
                <span className="sales-value">0</span>
              </div>
            ) : Array.isArray(vendasPorPlataforma) ? (
              vendasPorPlataforma.map((item, index) => (
                <div key={index} className="sales-item">
                  <span className="sales-name">{item.plataforma}</span>
                  <span className="sales-value">Quantidade: {item.quantidade_venda}</span>
                </div>
              ))
            ) : (
              <div className="sales-item">
                <span className="sales-name">Carregando vendas...</span>
                <span className="sales-value">-</span>
              </div>
            )}
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
                <span className="activity-count">{entradasUltimos3Dias} +</span>
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
                <span className="activity-count">{saidasUltimos3Dias} -</span>
                <span className="activity-description">Quantidade de produtos que saíram</span>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Products */}
        <div className="dashboard-card products-card">
          <div className="card-header">
            <h3>Recentes Entradas</h3>
            <span className="card-subtitle">
              {ultimasCompras === "sem_compras"
                ? "Não houve compras recentes"
                : Array.isArray(ultimasCompras)
                  ? `Últimas compras realizadas (${ultimasCompras.length} produtos)`
                  : "Carregando..."}
            </span>
          </div>
          <div className="products-list scrollable-list">
            {ultimasCompras === "sem_compras" ? (
              <div className="product-item">
                <div className="product-details">
                  <span className="product-name">Não houve compras recentes</span>
                </div>
              </div>
            ) : Array.isArray(ultimasCompras) ? (
              ultimasCompras.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-icon"></div>
                  <div className="product-details">
                    <span className="product-name">{product.nome_produto}</span>
                    <span className="product-quantity">Quantidade: {product.quantidade_produto}</span>
                    <span className="product-store">Preço: R$ {product.preco_compra.toFixed(2)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="product-item">
                <div className="product-details">
                  <span className="product-name">Carregando compras...</span>
                </div>
              </div>
            )}
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