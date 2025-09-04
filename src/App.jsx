import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './login';
import Dashboard from './dashboard';
import Estoque from './estoque';
import Configuracoes from './configuracoes';
import Funcionarios from './Funcionarios';
import MetricasMensais from './MetricasMensais';
import MetricasAnuais from './MetricasAnuais';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard">
              <Route index element={<Dashboard />} />
              <Route path="metricas-mensais" element={<MetricasMensais />} />
              <Route path="metricas-anuais" element={<MetricasAnuais />} />
            </Route>
            <Route path="estoque" element={<Estoque />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="funcionarios" element={<Funcionarios />} />
            <Route path="entradas" element={<Navigate to="/estoque?tab=entradas" replace />} />
            <Route path="saidas" element={<Navigate to="/estoque?tab=saidas" replace />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
