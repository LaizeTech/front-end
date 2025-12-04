import React, { useState, useEffect } from 'react';
import { X, Package, Loader } from 'lucide-react';
import './DetalhesSaidaModal.css';

const DetalhesSaidaModal = ({ isOpen, onClose, saidaId }) => {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && saidaId) {
      fetchItensSaida();
    }
  }, [isOpen, saidaId]);

  const fetchItensSaida = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Buscando itens da saída ID: ${saidaId}`);
      const response = await fetch(`http://localhost:8080/saidas/${saidaId}/itens`);
      
      console.log('Status da resposta:', response.status);
      
      if (response.status === 204) {
        console.log('Nenhum item encontrado (status 204)');
        setItens([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar itens: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Dados recebidos:', data);
      setItens(data);
    } catch (err) {
      console.error('Erro ao buscar itens da saída:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatCaracteristica = (item) => {
    if (!item.nome_caracteristica && !item.nome_tipo_caracteristica) {
      return 'Sem variação';
    }
    
    const parts = [];
    if (item.nome_tipo_caracteristica) {
      parts.push(item.nome_tipo_caracteristica);
    }
    if (item.nome_caracteristica) {
      parts.push(item.nome_caracteristica);
    }
    return parts.join(': ');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="detalhes-saida-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title">
            <Package size={24} />
            <h2>Detalhes da Saída #{saidaId}</h2>
          </div>
          <button className="close-button" onClick={onClose} aria-label="Fechar">
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {loading && (
            <div className="loading-state">
              <Loader className="spinner" size={40} />
              <p>Carregando itens...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p className="error-message">Erro: {error}</p>
              <button onClick={fetchItensSaida} className="retry-button">
                Tentar novamente
              </button>
            </div>
          )}

          {!loading && !error && itens.length === 0 && (
            <div className="empty-state">
              <Package size={48} />
              <p>Nenhum produto registrado nesta saída</p>
              <span className="empty-hint">
                Esta saída ainda não possui itens associados na tabela Itens_Saida.
              </span>
            </div>
          )}

          {!loading && !error && itens.length > 0 && (
            <div className="itens-container">
              <div className="itens-header">
                <h3>Produtos ({itens.length})</h3>
              </div>
              
              <div className="itens-list">
                {itens.map((item, index) => (
                  <div key={index} className="item-card">
                    <div className="item-info">
                      <div className="item-main">
                        <h4 className="item-name">{item.nome_produto}</h4>
                        <span className="item-quantity">
                          Qtd: <strong>{item.quantidade}</strong>
                        </span>
                      </div>
                      
                      <div className="item-details">
                        <div className="detail-row">
                          <span className="detail-label">Variação:</span>
                          <span className="detail-value">{formatCaracteristica(item)}</span>
                        </div>
                        
                        <div className="detail-row">
                          <span className="detail-label">Plataforma:</span>
                          <span className="detail-value platform-badge">
                            {item.nome_plataforma}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="itens-footer">
                <div className="total-info">
                  <span className="total-label">Total de itens:</span>
                  <span className="total-value">
                    {itens.reduce((sum, item) => sum + item.quantidade, 0)} unidades
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="button-secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesSaidaModal;
