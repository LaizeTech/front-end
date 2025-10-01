import React, { useState } from 'react';
import { Plus, Filter, Search, Edit, X, Trash2 } from 'lucide-react';
import './estoque.css';

const EditProductModal = ({ isOpen, onClose, product, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    price: product?.price || '',
    platforms: product?.platforms || [
      { name: 'Shopee', quantity: 0 }
    ],
    image: product?.image || null
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlatformQuantityChange = (index, quantity) => {
    const updatedPlatforms = [...formData.platforms];
    updatedPlatforms[index].quantity = quantity;
    setFormData(prev => ({
      ...prev,
      platforms: updatedPlatforms
    }));
  };

  const removePlatform = (index) => {
    const updatedPlatforms = formData.platforms.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      platforms: updatedPlatforms
    }));
  };

  const addPlatform = () => {
    setFormData(prev => ({
      ...prev,
      platforms: [...prev.platforms, { name: '', quantity: 0 }]
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    onDelete(product?.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Editar Produto</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Nome do Produto</label>
              <input
                type="text"
                className="form-input"
                placeholder="Insira o nome do produto"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Escolha a categoria</option>
                <option value="eletronicos">Eletrônicos</option>
                <option value="roupas">Roupas</option>
                <option value="casa">Casa e Jardim</option>
                <option value="esportes">Esportes</option>
                <option value="livros">Livros</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preço</label>
              <input
                type="text"
                className="form-input"
                placeholder="R$0,00"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            </div>

            <div className="platforms-section">
              <label className="form-label">Plataformas</label>
              <div className="platforms-table">
                <div className="table-header">
                  <span>Plataforma</span>
                  <span>Quantidade de produtos</span>
                  <span>Excluir plataforma</span>
                </div>
                
                {formData.platforms.map((platform, index) => (
                  <div key={index} className="table-row">
                    <input
                      type="text"
                      className="platform-input"
                      placeholder="Nome da plataforma"
                      value={platform.name}
                      onChange={(e) => {
                        const updatedPlatforms = [...formData.platforms];
                        updatedPlatforms[index].name = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          platforms: updatedPlatforms
                        }));
                      }}
                    />
                    <input
                      type="number"
                      className="quantity-input"
                      value={platform.quantity}
                      onChange={(e) => handlePlatformQuantityChange(index, parseInt(e.target.value) || 0)}
                    />
                    <button
                      className="remove-platform-btn"
                      onClick={() => removePlatform(index)}
                    >
                      <X size={16} color="#dc3545" />
                    </button>
                  </div>
                ))}
              </div>
              
              <button className="add-platform-btn" onClick={addPlatform}>
                <Plus size={16} />
                Adicionar Plataforma
              </button>
            </div>
          </div>

          <div className="image-section">
            <div className="image-preview">
              {formData.image ? (
                <img src={formData.image} alt="Preview" className="preview-image" />
              ) : (
                <div className="image-placeholder">
                  <X size={40} color="#ccc" />
                </div>
              )}
            </div>
            
            <div className="image-upload">
              <label className="upload-button">
                <Plus size={16} />
                Adicionar Imagem
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="delete-button" onClick={handleDelete}>
            <Trash2 size={16} />
            Excluir Produto
          </button>
          <button className="save-button" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

const AddProductModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    platform: 'Shopee',
    quantity: 0
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAdd = () => {
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: formData.price,
      quantity: formData.quantity,
      status: 'Disponível em estoque',
      statusColor: formData.quantity > 10 ? 'green' : formData.quantity > 5 ? 'blue' : 'red',
      store: 'NuvemShop - Loja Física',
      platforms: [
        { name: formData.platform, quantity: formData.quantity }
      ],
      image: null
    };
    
    onAdd(newProduct);
    setFormData({
      name: '',
      category: '',
      price: '',
      platform: 'Shopee',
      quantity: 0
    });
    onClose();
  };

  const handleExcluir = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      platform: 'Shopee',
      quantity: 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-modal-container">
        <div className="add-modal-header">
          <h2 className="add-modal-title">Adicionar mais produto</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="add-modal-content">
          <div className="add-form-section">
            <div className="form-group">
              <label className="form-label">Nome do Produto</label>
              <input
                type="text"
                className="form-input"
                placeholder="Insira o nome do produto"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Escolha a categoria</option>
                <option value="eletronicos">Eletrônicos</option>
                <option value="roupas">Roupas</option>
                <option value="casa">Casa e Jardim</option>
                <option value="esportes">Esportes</option>
                <option value="livros">Livros</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preço</label>
              <input
                type="text"
                className="form-input"
                placeholder="R$0,00"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            </div>
          </div>

          <div className="add-platform-section">
            <div className="platform-header">
              <span>Plataforma</span>
              <span>Quantidade de produtos</span>
            </div>
            <div className="platform-row">
              <select
                className="platform-select"
                value={formData.platform}
                onChange={(e) => handleInputChange('platform', e.target.value)}
              >
                <option value="Shopee">Shopee</option>
                <option value="NuvemShop">NuvemShop</option>
                <option value="Mercado Livre">Mercado Livre</option>
                <option value="Amazon">Amazon</option>
              </select>
              <input
                type="number"
                className="platform-quantity-input"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>

        <div className="add-modal-footer">
          <button className="excluir-button" onClick={handleExcluir}>
            Excluir Produto
          </button>
          <button className="adicionar-button" onClick={handleAdd}>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterCategoryModal = ({ isOpen, onClose, onFilter, onAddCategory }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories] = useState([
    'Gloss',
    'Boca',
    'Skincare',
    'RubyRose',
    'Batom',
    'Rosto',
    'Paletas',
    'Corretivo'
  ]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleFilter = () => {
    onFilter(selectedCategories);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="filter-modal-container">
        <div className="filter-modal-header">
          <h2 className="filter-modal-title">Filtrar categoria:</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="filter-modal-content">
          <button className="add-category-btn" onClick={onAddCategory}>
            Adicionar categoria +
          </button>

          <div className="categories-list">
            {categories.map((category, index) => (
              <label key={index} className="category-item">
                <input
                  type="checkbox"
                  className="category-checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                />
                <span className="category-name">{category}</span>
              </label>
            ))}
          </div>

          <button className="buscar-button" onClick={handleFilter}>
            Buscar
          </button>
        </div>
      </div>
    </div>
  );
};

const AddCategoryModal = ({ isOpen, onClose, onAdd }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleAdd = () => {
    if (categoryName.trim()) {
      onAdd(categoryName.trim());
      setCategoryName('');
      onClose();
    }
  };

  const handleVoltar = () => {
    setCategoryName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="add-category-modal-container">
        <div className="add-category-modal-header">
          <h2 className="add-category-modal-title">Filtrar categoria:</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="add-category-modal-content">
          <label className="add-category-label">Adicionar categoria</label>
          <input
            type="text"
            className="add-category-input"
            placeholder="Categoria"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />

          <div className="add-category-modal-footer">
            <button className="voltar-button" onClick={handleVoltar}>
              Voltar
            </button>
            <button className="adicionar-categoria-button" onClick={handleAdd}>
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
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
    setIsAddModalOpen(true);
  };

  const handleFilterProducts = () => {
    setIsFilterModalOpen(true);
  };

  const handleAddCategory = () => {
    setIsFilterModalOpen(false);
    setIsAddCategoryModalOpen(true);
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

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  const closeAddCategoryModal = () => {
    setIsAddCategoryModalOpen(false);
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
                    onClick={handleAddProduct}
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
                  <span className="characteristics-link">Características</span>
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

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={handleAddNewProduct}
      />

      <FilterCategoryModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        onFilter={handleFilterByCategories}
        onAddCategory={handleAddCategory}
      />

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={closeAddCategoryModal}
        onAdd={handleAddNewCategory}
      />
    </div>
  );
};

export default Estoque;