import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './login';
import Dashboard from './dashboard';
import Estoque from './estoque';
import Configuracoes from './configuracoes';
import Funcionarios from './funcionarios';
import MetricasMensais from './MetricasMensais';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/metricas-mensais" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="estoque" element={<Estoque />} />
            <Route path="configuracoes" element={<Configuracoes />} />
            <Route path="funcionarios" element={<Funcionarios />} />
            <Route path="metricas-mensais" element={<MetricasMensais />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
