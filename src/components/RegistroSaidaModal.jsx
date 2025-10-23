import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import './RegistroSaidaModal.css';

const RegistroSaidaModal = ({ isOpen, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);

  // Buscar produtos do estoque
  useEffect(() => {
    if (isOpen) {
      fetchProdutos();
    }
  }, [isOpen]);

  // Filtrar produtos baseado na pesquisa
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setProdutosFiltrados(produtos);
    } else {
      const filtered = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProdutosFiltrados(filtered);
    }
  }, [searchTerm, produtos]);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/compras/historico-compras');
      
      if (response.status === 204) {
        setProdutos([]);
        setProdutosFiltrados([]);
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        
        // Agrupar produtos por nome e somar quantidades
        const produtosAgrupados = {};
        
        data.forEach(item => {
          const chave = item.nomeProduto;
          if (produtosAgrupados[chave]) {
            produtosAgrupados[chave].quantidadeEstoque += item.quantidadeProduto || 0;
          } else {
            produtosAgrupados[chave] = {
              id: item.idCompraProduto, // Usar o ID da compra como referência
              nome: item.nomeProduto,
              categoria: item.nomeCategoria,
              quantidadeEstoque: item.quantidadeProduto || 0,
              precoCompra: item.precoCompra || 0,
              fornecedor: item.fornecedor
            };
          }
        });
        
        // Converter objeto para array e filtrar apenas produtos com estoque > 0
        const produtosComEstoque = Object.values(produtosAgrupados)
          .filter(produto => produto.quantidadeEstoque > 0);
        
        setProdutos(produtosComEstoque);
        setProdutosFiltrados(produtosComEstoque);
      } else {
        console.error('Erro ao buscar histórico de compras:', response.status);
        setProdutos([]);
        setProdutosFiltrados([]);
      }
    } catch (error) {
      console.error('Erro ao buscar produtos do estoque:', error);
      setProdutos([]);
      setProdutosFiltrados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProdutoClick = (produto) => {
    const jaExiste = produtosSelecionados.find(p => p.id === produto.id);
    
    if (!jaExiste) {
      setProdutosSelecionados(prev => [...prev, {
        ...produto,
        quantidadeSaida: 0,
        precoVenda: produto.precoCompra || 0, // Usar preço de compra como base
        estoqueDisponivel: produto.quantidadeEstoque
      }]);
    }
  };

  const handleRemoverProduto = (produtoId) => {
    setProdutosSelecionados(prev => prev.filter(p => p.id !== produtoId));
  };

  const handleQuantidadeChange = (produtoId, quantidade) => {
    setProdutosSelecionados(prev => prev.map(p => {
      if (p.id === produtoId) {
        const novaQuantidade = Math.max(0, parseInt(quantidade) || 0);
        // Limitar pela quantidade disponível em estoque
        const quantidadeFinal = Math.min(novaQuantidade, p.estoqueDisponivel || 0);
        return { ...p, quantidadeSaida: quantidadeFinal };
      }
      return p;
    }));
  };

  const handleRegistrar = () => {
    if (produtosSelecionados.length === 0) {
      alert('Selecione pelo menos um produto');
      return;
    }

    // Filtrar apenas produtos com quantidade > 0
    const produtosValidos = produtosSelecionados.filter(p => p.quantidadeSaida > 0);
    
    if (produtosValidos.length === 0) {
      alert('Defina a quantidade para pelo menos um produto');
      return;
    }

    onSave(produtosValidos);
    handleClose();
  };

  const handleClose = () => {
    setSearchTerm('');
    setProdutosSelecionados([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="registro-saida-modal">
        <div className="modal-header">
          <h2>Registro de saída de produto</h2>
          <button className="close-button" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-grid">
            {/* Card 1 - Lista de produtos do banco */}
            <div className="card produtos-disponiveis">
              <h3 className="card-title">Produtos Disponíveis</h3>
              <div className="search-container">
                <div className="search-input-wrapper">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Pesquisar produto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>

              <div className="produtos-lista">
                {loading ? (
                  <div className="loading-message">Carregando produtos...</div>
                ) : produtosFiltrados.length > 0 ? (
                  produtosFiltrados
                    .filter(produto => !produtosSelecionados.find(p => p.id === produto.id))
                    .map(produto => (
                      <div 
                        key={produto.id} 
                        className="produto-item"
                        onClick={() => handleProdutoClick(produto)}
                      >
                        <div className="produto-info">
                          <span className="produto-label">Nome do produto</span>
                          <span className="produto-nome">{produto.nome}</span>
                          <span className="produto-estoque">Estoque: {produto.quantidadeEstoque} unidades</span>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="no-products-message">
                    {searchTerm ? 'Nenhum produto encontrado' : 'Nenhum produto disponível'}
                  </div>
                )}
              </div>
            </div>
            <div className="card produtos-selecionados">
              <h3 className="card-title">Produtos Selecionados</h3>
              <div className="produtos-selecionados-lista">
                {produtosSelecionados.length > 0 ? (
                  produtosSelecionados.map(produto => (
                    <div key={produto.id} className="produto-selecionado">
                      <div className="produto-header">
                        <div className="produto-info">
                          <span className="produto-label">Nome do produto</span>
                          <span className="produto-nome">{produto.nome}</span>
                        </div>
                        <button 
                          className="remover-produto"
                          onClick={() => handleRemoverProduto(produto.id)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="quantidade-container">
                        <span className="quantidade-label">Qtd por venda</span>
                        <input
                          type="number"
                          min="0"
                          max={produto.estoqueDisponivel}
                          value={produto.quantidadeSaida}
                          onChange={(e) => handleQuantidadeChange(produto.id, e.target.value)}
                          className="quantidade-input"
                          placeholder={`Máx: ${produto.estoqueDisponivel}`}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-message">
                    Nenhum produto selecionado
                  </div>
                )}
              </div>
              
              <button className="registrar-button" onClick={handleRegistrar}>
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroSaidaModal;