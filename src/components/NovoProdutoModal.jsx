import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import './NovoProdutoModal.css';

const NovoProdutoModal = ({ isOpen, onClose, onAdd }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    platforms: [
      { name: 'Shopee', quantity: 0 }
    ],
    characteristics: [
      { name: '', quantity: 0 }
    ],
    image: null
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

  const addPlatform = () => {
    setFormData(prev => ({
      ...prev,
      platforms: [...prev.platforms, { name: '', quantity: 0 }]
    }));
  };

  const handleCharacteristicChange = (index, field, value) => {
    const updatedCharacteristics = [...formData.characteristics];
    updatedCharacteristics[index][field] = value;
    setFormData(prev => ({
      ...prev,
      characteristics: updatedCharacteristics
    }));
  };

  const addCharacteristic = () => {
    setFormData(prev => ({
      ...prev,
      characteristics: [...prev.characteristics, { name: '', quantity: 0 }]
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

  const handleNext = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = () => {
    const newProduct = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: formData.price,
      quantity: formData.platforms.reduce((total, platform) => total + platform.quantity, 0),
      status: 'Disponível em estoque',
      statusColor: formData.platforms.reduce((total, platform) => total + platform.quantity, 0) > 10 ? 'green' : 
                   formData.platforms.reduce((total, platform) => total + platform.quantity, 0) > 5 ? 'blue' : 'red',
      store: 'NuvemShop - Loja Física',
      platforms: formData.platforms,
      characteristics: formData.characteristics,
      image: formData.image
    };
    
    onAdd(newProduct);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      platforms: [
        { name: 'Shopee', quantity: 0 }
      ],
      characteristics: [
        { name: '', quantity: 0 }
      ],
      image: null
    });
    setCurrentStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="novo-produto-modal-overlay">
      <div className="novo-produto-modal-container">
        <div className="novo-produto-modal-header">
          <h2 className="novo-produto-modal-title">
            {currentStep === 1 ? 'Novo Produto' : 'Novo Produto - Características'}
          </h2>
          <button className="novo-produto-close-button" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <div className="novo-produto-modal-content">
          {currentStep === 1 ? (
            // Primeira parte do modal
            <>
              <div className="novo-produto-form-section">
                <div className="novo-produto-form-group">
                  <label className="novo-produto-form-label">Nome do Produto</label>
                  <input
                    type="text"
                    className="novo-produto-form-input"
                    placeholder="Insira o nome do produto"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>

                <div className="novo-produto-form-group">
                  <label className="novo-produto-form-label">Categoria</label>
                  <select
                    className="novo-produto-form-select"
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

                <div className="novo-produto-form-group">
                  <label className="novo-produto-form-label">Preço</label>
                  <input
                    type="text"
                    className="novo-produto-form-input"
                    placeholder="R$0,00"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                </div>
              </div>

              <div className="novo-produto-platform-section">
                <label className="novo-produto-form-label">Selecione a plataforma de venda</label>
                <select
                  className="novo-produto-platform-select"
                  value={formData.platforms[0]?.name || ''}
                  onChange={(e) => {
                    const updatedPlatforms = [...formData.platforms];
                    updatedPlatforms[0].name = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      platforms: updatedPlatforms
                    }));
                  }}
                >
                  <option value="">Escolha a categoria</option>
                  <option value="Shopee">Shopee</option>
                  <option value="NuvemShop">NuvemShop</option>
                  <option value="Mercado Livre">Mercado Livre</option>
                  <option value="Amazon">Amazon</option>
                </select>

                <label className="novo-produto-form-label">Quantidade de produtos na plataforma</label>
                <input
                  type="number"
                  className="novo-produto-quantity-input"
                  value={formData.platforms[0]?.quantity || 0}
                  onChange={(e) => handlePlatformQuantityChange(0, parseInt(e.target.value) || 0)}
                />

                <button className="novo-produto-add-platform-btn" onClick={addPlatform}>
                  Adicionar quantidade por plataforma
                </button>

                <div className="novo-produto-platform-summary">
                  <div className="novo-produto-platform-header">
                    <span>Plataforma</span>
                    <span>Qtd. de Produtos</span>
                  </div>
                  {formData.platforms.map((platform, index) => (
                    <div key={index} className="novo-produto-platform-row">
                      <span>{platform.name || 'Shopee'}</span>
                      <span>{platform.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            // Segunda parte do modal
            <>
              <div className="novo-produto-characteristics-section">
                <label className="novo-produto-form-label">Selecione a plataforma de venda</label>
                <select
                  className="novo-produto-platform-select"
                  value=""
                  onChange={() => {}}
                >
                  <option value="">Escolha a categoria</option>
                  <option value="Shopee">Shopee</option>
                  <option value="NuvemShop">NuvemShop</option>
                  <option value="Mercado Livre">Mercado Livre</option>
                  <option value="Amazon">Amazon</option>
                </select>

                <label className="novo-produto-form-label">Característica</label>
                <input
                  type="text"
                  className="novo-produto-form-input"
                  placeholder="Característica do produto"
                  value={formData.characteristics[0]?.name || ''}
                  onChange={(e) => handleCharacteristicChange(0, 'name', e.target.value)}
                />

                <label className="novo-produto-form-label">Quantidade de itens pro característica</label>
                <input
                  type="number"
                  className="novo-produto-quantity-input"
                  value={formData.characteristics[0]?.quantity || 0}
                  onChange={(e) => handleCharacteristicChange(0, 'quantity', parseInt(e.target.value) || 0)}
                />

                <button className="novo-produto-add-characteristic-btn" onClick={addCharacteristic}>
                  Adicionar quantidade por característica
                </button>
              </div>

              <div className="novo-produto-image-section">
                <div className="novo-produto-image-preview">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="novo-produto-preview-image" />
                  ) : (
                    <div className="novo-produto-image-placeholder">
                      <X size={40} color="#ccc" />
                    </div>
                  )}
                </div>
                
                <div className="novo-produto-image-upload">
                  <label className="novo-produto-upload-button">
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

                <div className="novo-produto-characteristics-summary">
                  <div className="novo-produto-characteristics-header">
                    <span>Plataforma</span>
                    <span>Qtd. de Produtos</span>
                  </div>
                  <div className="novo-produto-characteristics-content">
                    <div className="novo-produto-characteristics-item">
                      <span>Característica</span>
                      <span>Quantidade</span>
                    </div>
                    {formData.characteristics.map((characteristic, index) => (
                      <div key={index} className="novo-produto-characteristics-item">
                        <span>{characteristic.name || 'Vermelho'}</span>
                        <span>{characteristic.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="novo-produto-modal-footer">
          {currentStep === 1 ? (
            <button className="novo-produto-next-button" onClick={handleNext}>
              Próximo
            </button>
          ) : (
            <>
              <button className="novo-produto-back-button" onClick={handleBack}>
                Voltar
              </button>
              <button className="novo-produto-submit-button" onClick={handleSubmit}>
                Cadastrar produto
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NovoProdutoModal;