import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './saidas.css';

const Saidas = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [exits, setExits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSaidas = async () => {
    try {
      setLoading(true);
      setError(null); // Limpa erros anteriores
      // 1. URL alterada para o novo endpoint que retorna dados detalhados
      const response = await fetch('http://localhost:8080/saidas/detalhes');

      if (response.status === 204) {
        setExits([]); // Se não houver conteúdo, define a lista como vazia
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 2. Transforma os dados recebidos do backend para o formato que a tabela espera
      const transformedData = data.map(item => ({
        id: item.id_saida, // Usando o ID real da saída para a chave
        productName: item.nome_produto,
        quantity: item.quantidade || 0,
        platform: item.plataforma || 'N/A',
        date: formatDate(item.data_venda),
        status: item.status_produto || 'N/A',
        statusColor: getStatusColor(item.status_produto),
        price: formatPrice(item.preco_venda),
        supplier: item.fornecedor || 'N/A'
      }));
      
      setExits(transformedData);
    } catch (err) {
      console.error('Error fetching saidas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSaidas();
  }, []);

  // --- Funções Auxiliares (Helpers) ---

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Formata a data para dia/mês/ano
      return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getStatusColor = (status) => {
    if (!status) return 'gray';
    switch (status.toUpperCase()) {
      case 'ATIVO': return 'green';
      case 'DESATIVO': return 'red';
      default: return 'gray';
    }
  };

  const getPlatformColor = (platform) => {
    if (!platform) return 'gray';
    switch (platform.toLowerCase()) {
      case 'shopee':
      case 'shoope': 
        return 'orange';
      case 'nuvemshop':
      case 'mercado livre':
      case 'mercadolivre':
        return 'blue';
      default: return 'gray';
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(exits.map(exit => exit.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  // --- Renderização do Componente ---

  if (loading) {
    return (
      <div className="saidas">
        <div className="page-header"><h1 className="page-title">Saídas do Estoque</h1></div>
        <div className="loading-container"><p>Carregando dados...</p></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saidas">
        <div className="page-header"><h1 className="page-title">Saídas do Estoque</h1></div>
        <div className="error-container">
          <p>Erro ao carregar dados: {error}</p>
          <button onClick={fetchSaidas} className="retry-button">Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="saidas">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Saídas do Estoque</h1>
          <button onClick={fetchSaidas} className="refresh-button" disabled={loading}>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
      </div>

      {exits.length === 0 ? (
        <div className="empty-container">
          <p>Nenhuma saída encontrada.</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="exits-table">
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length > 0 && selectedItems.length === exits.length} />
                  </th>
                  <th className="sortable-header">Nome do produto <ChevronDown size={16} /></th>
                  <th>Quantidade</th>
                  <th>Plataforma</th>
                  <th>Data</th>
                  <th>Status do produto</th>
                  <th>Preço</th>
                  <th>Fornecedor</th>
                </tr>
              </thead>
              <tbody>
                {exits.map((exit) => (
                  <tr key={exit.id} className="table-row">
                    <td className="checkbox-column">
                      <input type="checkbox" checked={selectedItems.includes(exit.id)} onChange={() => handleSelectItem(exit.id)} />
                    </td>
                    <td className="product-name">{exit.productName}</td>
                    <td className="quantity">{exit.quantity}</td>
                    <td><span className={`platform-badge ${getPlatformColor(exit.platform)}`}>{exit.platform}</span></td>
                    <td className="date">{exit.date}</td>
                    <td><span className={`status-badge ${exit.statusColor}`}>{exit.status}</span></td>
                    <td className="price">{exit.price}</td>
                    <td className="supplier">{exit.supplier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Saidas;