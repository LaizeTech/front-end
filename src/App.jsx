import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
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

function App() {
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
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="metricas-mensais" element={<MetricasMensais />} />
            <Route path="metricas-anuais" element={<MetricasAnuais />} />
            <Route path="estoque" element={<Estoque />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="funcionarios" element={<Funcionarios />} />
            <Route path="entradas" element={<Entradas />} />
            <Route path="saidas" element={<Saidas />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
