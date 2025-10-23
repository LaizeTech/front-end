import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLoggedIn, isSessionValid } from '../utils/sessionUtils';

export const useAuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      // Não fazer verificação se já estiver na página de login
      if (location.pathname === '/login') return;

      // Verificar se o usuário está logado e se a sessão é válida
      if (!isLoggedIn() || !isSessionValid()) {
        // Se não estiver logado ou sessão inválida, redirecionar para login
        navigate('/login', { replace: true, state: { from: location } });
      }
    };

    // Verificar imediatamente
    checkAuth();

    // Verificar periodicamente (a cada 30 segundos)
    const interval = setInterval(checkAuth, 30000);

    // Cleanup do interval
    return () => clearInterval(interval);
  }, [navigate, location]);
};

export default useAuthCheck;