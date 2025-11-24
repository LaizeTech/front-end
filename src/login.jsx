import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ImagePlaceholder from './components/Imageplaceholder';
import { isLoggedIn, isSessionValid } from './utils/sessionUtils';
import './login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn() && isSessionValid()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

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

      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
      
      sessionStorage.setItem("user", JSON.stringify(data));
      sessionStorage.setItem("userId", data.idUsuario);
      sessionStorage.setItem("userName", data.nome);
      sessionStorage.setItem("userEmail", data.email);
      sessionStorage.setItem("acessoFinanceiro", data.acessoFinanceiro);
      sessionStorage.setItem("statusAtivo", data.statusAtivo);
      
      if (data.empresa) {
        sessionStorage.setItem("empresa", JSON.stringify(data.empresa));
        sessionStorage.setItem("empresaId", data.empresa.idEmpresa);
        sessionStorage.setItem("empresaNome", data.empresa.nomeEmpresa);
        sessionStorage.setItem("empresaCnpj", data.empresa.cnpj);
      }
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao conectar com o servidor.");
    }
  };


  return (
  <div className="min-h-screen relative overflow-hidden bg-stone-50 flex items-center justify-center px-4">
      {/* Soft pink corners with fixed radial gradients at corners */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.65) 22%, rgba(255,255,255,0.00) 45%),\
             radial-gradient(farthest-corner at top left, rgba(236,72,153,0.85) 0%, rgba(236,72,153,0.60) 18%, rgba(236,72,153,0.35) 35%, rgba(236,72,153,0.18) 52%, rgba(236,72,153,0.00) 68%),\
             radial-gradient(farthest-corner at bottom right, rgba(236,72,153,0.83) 0%, rgba(236,72,153,0.58) 18%, rgba(236,72,153,0.34) 35%, rgba(236,72,153,0.17) 52%, rgba(236,72,153,0.00) 68%)',
          filter: 'none'
        }}
      />

      {/* Centered form content (no card background) */}
  <div className="relative z-10 w-full max-w-[420px] -mt-6">
  <h1 className="text-9xl font-black extra-bold text-gray-950 mb-12">Login</h1><br></br>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="block text-xl font-semibold text-gray-700 mb-3">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Insira seu e-mail"
              className="h-12 w-full px-6 py-9 rounded-md border-2 border-gray-200 bg-gray-50 text-gray-900 text-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div><br></br>
          <div>
            <label htmlFor="password" className="block text-xl font-semibold text-gray-700 mb-3">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Insira sua senha"
              className="h-12 w-full px-6 py-9 rounded-md border-2 border-gray-200 bg-gray-50 text-gray-900 text-xl placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div><br></br>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-pink-500 w-4 h-4 scale-75 rounded shrink-0"
              />
              <label htmlFor="remember" className="text-[10px] leading-none text-gray-600 select-none">Lembrar senha</label>
            </div>
            
          </div><br></br>
          <button
            type="submit"
            className="h-12 w-full py-9 rounded-md bg-linear-to-r from-pink-600 to-fuchsia-500 text-white text-2xl font-semibold shadow-sm hover:from-pink-700 hover:to-fuchsia-600 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
