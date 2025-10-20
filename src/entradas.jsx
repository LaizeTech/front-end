import React, { useState, useEffect } from 'react';
import { ChevronDown, Download } from 'lucide-react';
import './entradas.css';

const Entradas = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    fetchHistoricoCompras();
  }, []);

  const fetchHistoricoCompras = async () => {
    try {
      setLoading(true);
      setNoData(false);
      const response = await fetch('http://localhost:8080/compras/historico-compras');
      
      if (response.status === 204) {
        setEntries([]);
        setNoData(true);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Mapear os dados do backend para o formato do frontend
      const mappedEntries = data.map((item, index) => {
        const categoryColor = getCategoryColor(item.nomeCategoria);
        console.log(`Categoria: "${item.nomeCategoria}" -> Cor: ${categoryColor}`);
        return {
          id: item.idCompraProduto,
          nomeProduto: item.nomeProduto,
          quantidadeProduto: item.quantidadeProduto,
          nomeCategoria: item.nomeCategoria,
          categoryColor: categoryColor,
          dtCompra: formatDate(item.dtCompra),
          precoCompra: formatPrice(item.precoCompra),
          fornecedor: item.fornecedor
        };
      });
      
      setEntries(mappedEntries);
      setNoData(mappedEntries.length === 0);
    } catch (err) {
      console.error('Erro ao buscar histórico de compras:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const getCategoryColor = (category) => {
    if (!category) return 'red'; // Teste: sempre retorna vermelho
    
    console.log('Categoria recebida:', category);
    
    // Para teste, vou retornar cores alternadas baseadas no índice
    const colors = ['blue', 'green', 'orange', 'purple', 'red', 'yellow', 'cyan'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    console.log('Cor escolhida:', randomColor);
    return randomColor;
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(entries.map(entry => entry.id));
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

  const handleExportar = () => {
    // Implementar lógica para exportar dados selecionados
    const selectedEntries = entries.filter(entry => selectedItems.includes(entry.id));
    console.log('Exportar dados selecionados:', selectedEntries);
    
    // Exemplo simples de exportação para CSV
    const csvContent = [
      ['Nome do Produto', 'Quantidade', 'Categoria', 'Data da Compra', 'Preço de Compra', 'Fornecedor'],
      ...selectedEntries.map(entry => [
        entry.nomeProduto,
        entry.quantidadeProduto,
        entry.nomeCategoria,
        entry.dtCompra,
        entry.precoCompra,
        entry.fornecedor
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `entradas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayEntries = entries;

  if (loading) {
    return (
      <div className="entradas">
        <div className="page-header">
          <h1 className="page-title">Histórico de Compras</h1>
        </div>
        <div className="loading-container">
          <p>Carregando histórico de compras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="entradas">
        <div className="page-header">
          <h1 className="page-title">Histórico de Compras</h1>
        </div>
        <div className="error-container">
          <p>Erro ao carregar histórico de compras: {error}</p>
          <button onClick={fetchHistoricoCompras} className="retry-button">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (noData) {
    return (
      <div className="entradas">
        <div className="page-header">
          <h1 className="page-title">Histórico de Compras</h1>
        </div>
        <div className="no-data-container">
          <div className="no-data-content">
            <svg className="no-data-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11H15M12 8V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 className="no-data-title">Nenhuma compra registrada</h2>
            <p className="no-data-message">Não há compras registradas no momento. Quando você realizar uma compra, ela aparecerá aqui.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="entradas">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Histórico de Compras</h1>
          <div className="header-buttons">
            {selectedItems.length > 0 && (
              <button onClick={handleExportar} className="action-button export-button">
                <Download size={16} />
                Exportar
              </button>
            )}
            <button onClick={fetchHistoricoCompras} className="refresh-button" disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="selected-info-bar">
          <span>{selectedItems.length} item(s) selecionado(s)</span>
        </div>
      )}

      <div className="table-container">
        <div className="table-wrapper">
          <table className="entries-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll} 
                    checked={selectedItems.length > 0 && selectedItems.length === entries.length} 
                  />
                </th>
                <th className="sortable-header">
                  Nome do produto <ChevronDown size={16} />
                </th>
                <th>Quantidade</th>
                <th>Categoria</th>
                <th>Data da Compra</th>
                <th>Preço de Compra</th>
                <th>Fornecedor</th>
              </tr>
            </thead>
            <tbody>
              {displayEntries.map((entry) => (
                <tr key={entry.id} >
                  <td className="checkbox-column">
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(entry.id)} 
                      onChange={() => handleSelectItem(entry.id)} 
                    />
                  </td>
                  <td className="product-name">{entry.nomeProduto}</td>
                  <td className="quantity">{entry.quantidadeProduto}</td>
                  <td>
                    <span 
                      className={`category-badge ${entry.categoryColor}`}
                      style={{
                        backgroundColor: entry.categoryColor === 'blue' ? '#007bff' : 
                                        entry.categoryColor === 'green' ? '#28a745' : 
                                        entry.categoryColor === 'orange' ? '#ff9500' : 
                                        entry.categoryColor === 'purple' ? '#6f42c1' : 
                                        entry.categoryColor === 'red' ? '#dc3545' : 
                                        entry.categoryColor === 'yellow' ? '#ffc107' : 
                                        entry.categoryColor === 'cyan' ? '#17a2b8' : '#6c757d'
                      }}
                      title={`Cor: ${entry.categoryColor}`}
                    >
                      {entry.nomeCategoria}
                    </span>
                  </td>
                  <td className="date">{entry.dtCompra}</td>
                  <td className="price">{entry.precoCompra}</td>
                  <td className="supplier">{entry.fornecedor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Entradas;
