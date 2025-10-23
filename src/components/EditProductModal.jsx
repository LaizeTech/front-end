import React, { useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import './EditProductModal.css';

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

  // Atualiza o estado local quando o prop 'product' muda (e.g., ao abrir para um novo produto)
  React.useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || '',
        price: product.price || '',
        platforms: product.platforms || [{ name: 'Shopee', quantity: 0 }],
        image: product.image || null
      });
    }
  }, [product]);

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

  const handlePlatformNameChange = (index, name) => {
    const updatedPlatforms = [...formData.platforms];
    updatedPlatforms[index].name = name;
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
                      onChange={(e) => handlePlatformNameChange(index, e.target.value)}
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

export default EditProductModal;