import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import ImagePlaceholder from './components/Imageplaceholder';
import './estoque.css';

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const products = [
    {
      id: 1,
      name: 'Nome Produto',
      quantity: 5,
      status: 'Disponível em estoque',
      statusColor: 'red',
      store: 'NuvemShop - Loja Física'
    },
    {
      id: 2,
      name: 'Nome Produto',
      quantity: 3,
      status: 'Disponível em estoque',
      statusColor: 'blue',
      store: 'NuvemShop - Loja Física'
    },
    {
      id: 3,
      name: 'Nome Produto',
      quantity: 8,
      status: 'Disponível em estoque',
      statusColor: 'red',
      store: 'NuvemShop - Loja Física'
    },
    {
      id: 4,
      name: 'Nome Produto',
      quantity: 12,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física'
    },
    {
      id: 5,
      name: 'Nome Produto',
      quantity: 5,
      status: 'Disponível em estoque',
      statusColor: 'blue',
      store: 'NuvemShop - Loja Física'
    },
    {
      id: 6,
      name: 'Nome Produto',
      quantity: 15,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física'
    },
    {
      id: 7,
      name: 'Nome Produto',
      quantity: 8,
      status: 'Disponível em estoque',
      statusColor: 'blue',
      store: 'NuvemShop - Loja Física'
    },
    {
      id: 8,
      name: 'Nome Produto',
      quantity: 20,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física'
    },
    {
      id: 9,
      name: 'Nome Produto',
      quantity: 3,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física'
    },
    {
      id: 10,
      name: 'Nome Produto',
      quantity: 7,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física'
    },
    {
      id: 11,
      name: 'Nome Produto',
      quantity: 25,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física'
    },
    {
      id: 12,
      name: 'Nome Produto',
      quantity: 10,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física'
    }
  ];

  return (
    <div className="estoque">
      <div className="estoque-header">
        <h1 className="page-title">Gestão de Estoque</h1>
        
        <div className="header-actions">
          <button className="add-product-btn">
            <Plus size={16} />
            Adicionar Produto
          </button>
          <button className="filter-btn">
            <Filter size={16} />
            Filtrar Itens
          </button>
        </div>
      </div>

      <div className="search-container">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Pesquisar produtos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <ImagePlaceholder width="100%" height="150px" />
            </div>
            
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              
              <div className="product-details">
                <div className="quantity-info">
                  <span className="quantity-label">Quantidade em estoque:</span>
                  <span className={`quantity-badge ${product.statusColor}`}>
                    {product.quantity}
                  </span>
                </div>
                
                <div className="status-info">
                  <span className={`status-badge ${product.statusColor}`}>
                    {product.status}
                  </span>
                </div>
                
                <div className="store-info">
                  <span className="store-name">{product.store}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Estoque;

