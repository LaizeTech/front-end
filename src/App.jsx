import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import FinancialAccessRoute from './components/FinancialAccessRoute';
import Login from './login';
import Dashboard from './dashboard';
import Estoque from './estoque';
import Configuracoes from './configuracoes';
import Entradas from './entradas';
import Saidas from './saidas';
import Funcionarios from './Funcionarios';
import MetricasMensais from './MetricasMensais';
import MetricasAnuais from './MetricasAnuais'
import './App.css';

// Exemplo de uso do fetch com a variável de ambiente
import { useEffect } from 'react';

function App() {
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
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={
              <FinancialAccessRoute>
                <Dashboard />
              </FinancialAccessRoute>
            } />
            <Route path="dashboard" element={
              <FinancialAccessRoute>
                <Dashboard />
              </FinancialAccessRoute>
            } />
            <Route path="metricas-mensais" element={
              <FinancialAccessRoute>
                <MetricasMensais />
              </FinancialAccessRoute>
            } />
            <Route path="metricas-anuais" element={
              <FinancialAccessRoute>
                <MetricasAnuais />
              </FinancialAccessRoute>
            } />
            <Route path="funcionarios" element={
              <FinancialAccessRoute>
                <Funcionarios />
              </FinancialAccessRoute>
            } />
            {/* Rotas que não requerem acesso financeiro */}
            <Route path="estoque" element={<Estoque />} />
            <Route path="entradas" element={<Entradas />} />
            <Route path="saidas" element={<Saidas />} />
            <Route path="configuracoes" element={<Configuracoes />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
