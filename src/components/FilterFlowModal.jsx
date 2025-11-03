import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './FilterFlowModal.css';

const FilterFlowModal = ({ isOpen, onClose, onFilter, onAddCategory }) => {
  // Gerencia qual "fase" do modal está ativa: 'filter' ou 'addCategory'
  const [currentView, setCurrentView] = useState('filter');
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const API_URL = "http://localhost:8080";

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categorias`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar categorias: ${response.status}`);
      }
      const data = await response.json();
      // Assumindo que o backend retorna um array de objetos { idCategoria: number, nomeCategoria: string } - Usando camelCase para Kotlin/Spring Boot
      setCategories(data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  // Resetar o estado ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      setCurrentView('filter');
      setCategoryName('');
      setSelectedCategories([]);
    }
  }, [isOpen]);

  // --- Lógica do Filtro (View: 'filter') ---

  const handleCategoryChange = (category) => {
    // category é o objeto { id_categoria, nome_categoria }
    setSelectedCategories(prev => {
      if (prev.includes(category.idCategoria)) {
        return prev.filter(id => id !== category.idCategoria);
      } else {
        return [...prev, category.idCategoria];
      }
    });
  };

  const handleFilter = () => {
    // onFilter espera um array de IDs de categorias
    onFilter(selectedCategories);
    onClose();
  };

  const switchToAddCategory = () => {
    setCurrentView('addCategory');
  };

  // --- Lógica da Adição de Categoria (View: 'addCategory') ---

  const handleAdd = async () => {
    if (categoryName.trim()) {
      try {
        const response = await fetch(`${API_URL}/categorias`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Assumindo que o backend espera um objeto com o nome da categoria
          body: JSON.stringify({ nomeCategoria: categoryName.trim() }),
        });

        if (!response.ok) {
          throw new Error(`Erro ao cadastrar categoria: ${response.status}`);
        }

        // Se o cadastro for bem-sucedido, recarrega a lista de categorias
        await fetchCategories();
        
        // Notifica o componente pai (Estoque.jsx) sobre o sucesso
        onAddCategory(categoryName.trim()); 

        setCategoryName('');
        setCurrentView('filter'); // Volta para a tela de filtro após adicionar
      } catch (error) {
        console.error("Erro ao adicionar categoria:", error);
        // Opcional: Adicionar feedback de erro para o usuário
      }
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
          {categories.map((category) => (
            <label key={category.idCategoria} className="category-item">
              <input
                type="checkbox"
                className="category-checkbox"
                checked={selectedCategories.includes(category.idCategoria)}
                onChange={() => handleCategoryChange(category)}
              />
              <span className="category-name">{category.nomeCategoria}</span>
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