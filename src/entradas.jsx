import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import './entradas.css';

const Entradas = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistoricoCompras();
  }, []);

  const fetchHistoricoCompras = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/compras/historico-compras');
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Mapear os dados do backend para o formato do frontend
      const mappedEntries = data.map((item, index) => ({
        id: item.idCompraProduto,
        nomeProduto: item.nomeProduto,
        quantidadeProduto: item.quantidadeProduto,
        nomeCategoria: item.nomeCategoria,
        dtCompra: formatDate(item.dtCompra),
        precoCompra: formatPrice(item.precoCompra),
        fornecedor: item.fornecedor
      }));
      
      setEntries(mappedEntries);
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

  return (
    <div className="entradas">
      <div className="page-header">
        <h1 className="page-title">Histórico de Compras</h1>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="entries-table">
            <thead>
              <tr>
                <th>
                  Nome do produto
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
                  
                  <td className="product-name">{entry.nomeProduto}</td>
                  <td className="quantity">{entry.quantidadeProduto}</td>
                  <td>
                    <span className={`category-badge blue`}>
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
