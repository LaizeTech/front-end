import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ImagePlaceholder from './components/Imageplaceholder';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/usuarios/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          senha: password,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        alert(errorMessage);
        return;
      }

      const data = await response.json();

      localStorage.setItem("user", JSON.stringify(data));

      navigate("/");
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <ImagePlaceholder width="100%" height="100%" className="login-image" />
      </div>
      
      <div className="login-right">
        <div className="login-form-container">
          <h1 className="login-title">Login</h1>
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Insira seu e-mail"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Insira sua senha"
                className="form-input"
                required
              />
            </div>

            <div className="form-options">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-checkbox"
                />
                <label htmlFor="remember" className="checkbox-label">
                  Lembrar senha
                </label>
              </div>
              
              <a href="#" className="forgot-password">
                Esqueceu sua senha?
              </a>
            </div>

            <button type="submit" className="login-button">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;