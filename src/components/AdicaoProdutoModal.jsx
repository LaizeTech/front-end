import React, { useState } from 'react';
import { X } from 'lucide-react';
import './AdicaoProdutoModal.css';

const AdicionarProdutoModal = ({ isOpen, onClose, onAdd, selectedProduct }) => {
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
    if (!formData.name.trim()) {
      alert('Por favor, insira o nome do produto');
      return;
    }

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
    handleClose();
  };

  const handleExcluir = () => {
    handleClose();
  };

  const handleClose = () => {
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
    <div className="adicionar-produto-modal-overlay">
      <div className="adicionar-produto-modal-container">
        <div className="adicionar-produto-modal-header">
          <h2 className="adicionar-produto-modal-title">Adicionar mais produto</h2>
          <button className="adicionar-produto-close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="adicionar-produto-modal-content">
          <div className="adicionar-produto-form-section">
            <div className="adicionar-produto-form-group">
              <label className="adicionar-produto-form-label">Nome do Produto</label>
              <input
                type="text"
                className="adicionar-produto-form-input"
                placeholder="Insira o nome do produto"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div className="adicionar-produto-form-group">
              <label className="adicionar-produto-form-label">Categoria</label>
              <select
                className="adicionar-produto-form-select"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Escolha a categoria</option>
                <option value="eletronicos">Eletrônicos</option>
                <option value="roupas">Roupas</option>
                <option value="casa">Casa e Jardim</option>
                <option value="esportes">Esportes</option>
                <option value="livros">Livros</option>
                <option value="beleza">Beleza</option>
                <option value="cosmeticos">Cosméticos</option>
              </select>
            </div>

            <div className="adicionar-produto-form-group">
              <label className="adicionar-produto-form-label">Preço</label>
              <input
                type="text"
                className="adicionar-produto-form-input"
                placeholder="R$0,00"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
              />
            </div>
          </div>

          <div className="adicionar-produto-platform-section">
            <div className="adicionar-produto-platform-summary">
              <div className="adicionar-produto-platform-header">
                <span>Plataforma</span>
                <span>Quantidade de produtos</span>
              </div>
              <div className="adicionar-produto-platform-row">
                <span>{formData.platform}</span>
                <span>{formData.quantity}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="adicionar-produto-modal-footer">
          <button className="adicionar-produto-excluir-button" onClick={handleExcluir}>
            Excluir Produto
          </button>
          <button className="adicionar-produto-adicionar-button" onClick={handleAdd}>
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdicionarProdutoModal;