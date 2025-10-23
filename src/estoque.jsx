import React, { useState } from 'react';
import { Plus, Filter, Search, Edit, X, Trash2 } from 'lucide-react';
import NovoProdutoModal from './components/NovoProdutoModal';
import AdicaoProdutoModal from './components/AdicaoProdutoModal';
import './estoque.css';
import EditProductModal from './components/EditProductModal';
import FilterFlowModal from './components/FilterFlowModal';

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNovoProdutoModalOpen, setIsNovoProdutoModalOpen] = useState(false);
  const [isAdicionarProdutoModalOpen, setIsAdicionarProdutoModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Nome Produto',
      quantity: 5,
      status: 'Disponível em estoque',
      statusColor: 'red',
      store: 'NuvemShop - Loja Física',
      category: 'eletronicos',
      price: 'R$ 99,90',
      platforms: [
        { name: 'Shopee', quantity: 5 },
        { name: 'NuvemShop', quantity: 3 }
      ],
      image: null
    },
    {
      id: 2,
      name: 'Nome Produto',
      quantity: 3,
      status: 'Disponível em estoque',
      statusColor: 'blue',
      store: 'NuvemShop - Loja Física',
      category: 'roupas',
      price: 'R$ 149,90',
      platforms: [
        { name: 'Shopee', quantity: 3 }
      ],
      image: null
    },
    {
      id: 3,
      name: 'Nome Produto',
      quantity: 8,
      status: 'Disponível em estoque',
      statusColor: 'red',
      store: 'NuvemShop - Loja Física',
      category: 'casa',
      price: 'R$ 79,90',
      platforms: [
        { name: 'Shopee', quantity: 8 }
      ],
      image: null
    },
    {
      id: 4,
      name: 'Nome Produto',
      quantity: 12,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física',
      category: 'esportes',
      price: 'R$ 199,90',
      platforms: [
        { name: 'Shopee', quantity: 12 }
      ],
      image: null
    },
    {
      id: 5,
      name: 'Nome Produto',
      quantity: 5,
      status: 'Disponível em estoque',
      statusColor: 'blue',
      store: 'NuvemShop - Loja Física',
      category: 'livros',
      price: 'R$ 39,90',
      platforms: [
        { name: 'Shopee', quantity: 5 }
      ],
      image: null
    },
    {
      id: 6,
      name: 'Nome Produto',
      quantity: 15,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física',
      category: 'eletronicos',
      price: 'R$ 299,90',
      platforms: [
        { name: 'Shopee', quantity: 15 }
      ],
      image: null
    },
    {
      id: 7,
      name: 'Nome Produto',
      quantity: 8,
      status: 'Disponível em estoque',
      statusColor: 'blue',
      store: 'NuvemShop - Loja Física',
      category: 'roupas',
      price: 'R$ 89,90',
      platforms: [
        { name: 'Shopee', quantity: 8 }
      ],
      image: null
    },
    {
      id: 8,
      name: 'Nome Produto',
      quantity: 20,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física',
      category: 'casa',
      price: 'R$ 159,90',
      platforms: [
        { name: 'Shopee', quantity: 20 }
      ],
      image: null
    },
    {
      id: 9,
      name: 'Nome Produto',
      quantity: 3,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física',
      category: 'esportes',
      price: 'R$ 249,90',
      platforms: [
        { name: 'Shopee', quantity: 3 }
      ],
      image: null
    },
    {
      id: 10,
      name: 'Nome Produto',
      quantity: 7,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física',
      category: 'livros',
      price: 'R$ 59,90',
      platforms: [
        { name: 'Shopee', quantity: 7 }
      ],
      image: null
    },
    {
      id: 11,
      name: 'Nome Produto',
      quantity: 25,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física',
      category: 'eletronicos',
      price: 'R$ 399,90',
      platforms: [
        { name: 'Shopee', quantity: 25 }
      ],
      image: null
    },
    {
      id: 12,
      name: 'Nome Produto',
      quantity: 10,
      status: 'Disponível em estoque',
      statusColor: 'green',
      store: 'NuvemShop - Loja Física',
      category: 'casa',
      price: 'R$ 119,90',
      platforms: [
        { name: 'Shopee', quantity: 10 }
      ],
      image: null
    }
  ]);

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleAddProduct = () => {
    setIsNovoProdutoModalOpen(true);
  };

  const handleAdicionarMaisProduto = (product = null) => {
    setSelectedProduct(product);
    setIsAdicionarProdutoModalOpen(true);
  };

  const handleFilterProducts = () => {
    setIsFilterModalOpen(true);
  };

  const handleSaveProduct = (updatedProduct) => {
    setProducts(prevProducts => 
      prevProducts.map(product => 
        product.id === selectedProduct.id 
          ? { ...product, ...updatedProduct }
          : product
      )
    );
    console.log('Produto salvo:', updatedProduct);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(prevProducts => 
      prevProducts.filter(product => product.id !== productId)
    );
    console.log('Produto excluído:', productId);
  };

  const handleAddNewProduct = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
    console.log('Novo produto adicionado:', newProduct);
  };

  const handleAddMaisProduct = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
    console.log('Mais produto adicionado:', newProduct);
  };

  const handleFilterByCategories = (categories) => {
    console.log('Filtrar por categorias:', categories);
    // Implementar lógica de filtro aqui
  };
  
  const handleAddNewCategory = (categoryName) => {
    console.log('Nova categoria adicionada:', categoryName);
    // Implementar lógica para adicionar nova categoria
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };
  
  const closeNovoProdutoModal = () => {
    setIsNovoProdutoModalOpen(false);
  };
  
  const closeAdicionarProdutoModal = () => {
    setIsAdicionarProdutoModalOpen(false);
    setSelectedProduct(null);
  };
  
  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  // Ordena os produtos: vermelho primeiro, depois amarelo, depois verde
  const colorOrder = { red: 0, yellow: 1, green: 2 };
  const sortedProducts = [...products].sort((a, b) => {
    return (colorOrder[a.statusColor] ?? 99) - (colorOrder[b.statusColor] ?? 99);
  });

  return (
    <div className="estoque">
      <div className="estoque-header">
        <h1 className="page-title">Gestão de Estoque</h1>
        
        <div className="header-actions">
          <button className="add-product-btn" onClick={handleAddProduct}>
            <Plus size={16} />
            Novo Produto
          </button>
          <button className="filter-btn" onClick={handleFilterProducts}>
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
            placeholder="Pesquisar produto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="products-grid">
        {sortedProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {/* Placeholder for product image */}
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

                <div className="product-actions">
                  <button 
                    className="add-product-link"
                    onClick={() => handleAdicionarMaisProduto(product)}
                  >
                    <Plus size={14} />
                    Adicionar produto
                  </button>
                  <button 
                    className="edit-product-link"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit size={14} />
                    Editar Produto
                  </button>

                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        product={selectedProduct}
        onSave={handleSaveProduct}
        onDelete={handleDeleteProduct}
      />

      <NovoProdutoModal
        isOpen={isNovoProdutoModalOpen}
        onClose={closeNovoProdutoModal}
        onAdd={handleAddNewProduct}
      />

      <AdicaoProdutoModal
        isOpen={isAdicionarProdutoModalOpen}
        onClose={closeAdicionarProdutoModal}
        onAdd={handleAddMaisProduct}
        selectedProduct={selectedProduct}
      />

      <FilterFlowModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        onFilter={handleFilterByCategories}
        onAddCategory={handleAddNewCategory}
      />
    </div>
  );
};

export default Estoque;