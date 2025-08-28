import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './login';
<<<<<<< Updated upstream
=======
import Dashboard from './dashboard';
import Estoque from './estoque';
import Configuracoes from './configuracoes';
>>>>>>> Stashed changes
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
<<<<<<< Updated upstream
            <Route index element={<Navigate to="/login" replace />} />
=======
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="estoque" element={<Estoque />} />
            <Route path="configuracoes" element={<Configuracoes />} />
>>>>>>> Stashed changes
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
