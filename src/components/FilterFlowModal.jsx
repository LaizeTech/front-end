import React, { useState } from 'react';
import { X } from 'lucide-react';
import './FilterFlowModal.css';

const FilterFlowModal = ({ isOpen, onClose, onFilter, onAddCategory }) => {
  // Gerencia qual "fase" do modal está ativa: 'filter' ou 'addCategory'
  const [currentView, setCurrentView] = useState('filter');
  const [categoryName, setCategoryName] = useState('');
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

  // Resetar o estado ao fechar o modal
  React.useEffect(() => {
    if (!isOpen) {
      setCurrentView('filter');
      setCategoryName('');
      setSelectedCategories([]);
    }
  }, [isOpen]);

  // --- Lógica do Filtro (View: 'filter') ---

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

  const switchToAddCategory = () => {
    setCurrentView('addCategory');
  };

  // --- Lógica da Adição de Categoria (View: 'addCategory') ---

  const handleAdd = () => {
    if (categoryName.trim()) {
      onAddCategory(categoryName.trim());
      setCategoryName('');
      setCurrentView('filter'); // Volta para a tela de filtro após adicionar
    }
  };

  const handleVoltar = () => {
    setCategoryName('');
    setCurrentView('filter'); // Volta para a tela de filtro
  };

  if (!isOpen) return null;

  // Renderização do Modal de Filtro
  const renderFilterView = () => (
    <>
      <div className="filter-modal-header">
        <h2 className="filter-modal-title">Filtrar categoria:</h2>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="filter-modal-content">
        <button className="add-category-btn" onClick={switchToAddCategory}>
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
    </>
  );

  // Renderização do Modal de Adição de Categoria
  const renderAddCategoryView = () => (
    <>
      <div className="add-category-modal-header">
        <h2 className="add-category-modal-title">Adicionar categoria:</h2>
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className="add-category-modal-content">
        <label className="add-category-label">Nome da nova categoria</label>
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
    </>
  );

  return (
    <div className="modal-overlay">
      <div className={`flow-modal-container ${currentView === 'filter' ? 'filter-view' : 'add-category-view'}`}>
        {currentView === 'filter' ? renderFilterView() : renderAddCategoryView()}
      </div>
    </div>
  );
};

export default FilterFlowModal;