import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, X } from 'lucide-react';
import './FinancialAccessRoute.css';

const FinancialAccessRoute = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const acessoFinanceiro = sessionStorage.getItem('acessoFinanceiro') === 'true';

  useEffect(() => {
    if (!acessoFinanceiro) {
      setShowModal(true);
    }
  }, [acessoFinanceiro]);

  const handleClose = () => {
    setShowModal(false);
    // Redireciona para a página de estoque
    navigate('/estoque', { replace: true });
  };

  // Se não tem acesso financeiro, mostra o modal e bloqueia
  if (!acessoFinanceiro && showModal) {
    return (
      <div className="access-denied-overlay">
        <div className="access-denied-modal">
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
          <div className="modal-icon">
            <AlertCircle size={64} />
          </div>
          <h2 className="modal-title">Acesso Negado</h2>
          <p className="modal-message">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="modal-submessage">
            Esta seção requer acesso financeiro. Entre em contato com seu administrador para obter permissões.
          </p>
          <button className="modal-redirect-btn" onClick={handleClose}>
            Ir para Estoque
          </button>
        </div>
      </div>
    );
  }

  // Se tem acesso, renderiza normalmente
  return children;
};

export default FinancialAccessRoute;
