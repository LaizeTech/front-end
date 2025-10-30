import React, { useState, useEffect } from 'react';
import { Plus, Filter, Search, Edit, X, Trash2 } from 'lucide-react';
import NovoProdutoModal from './components/NovoProdutoModal';
import AdicaoProdutoModal from './components/AdicaoProdutoModal';
import './estoque.css';
import EditProductModal from './components/EditProductModal';
import FilterFlowModal from './components/FilterFlowModal';

const Estoque = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isNovoProdutoModalOpen, setIsNovoProdutoModalOpen] = useState(false);
    const [isAdicionarProdutoModalOpen, setIsAdicionarProdutoModalOpen] = useState(false);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const API_URL = "http://localhost:8080/produtos";

    const getStatusColor = (quantidade) => {
        if (quantidade < 5) return 'red';
        if (quantidade < 15) return 'yellow';
        return 'green';
    };

    const getStatusText = (quantidade) => {
        const color = getStatusColor(quantidade);
        if (color === 'red') return 'DISPONÍVEL EM ESTOQUE';
        if (color === 'yellow') return 'DISPONÍVEL EM ESTOQUE';
        return 'DISPONÍVEL EM ESTOQUE';
    };

    const fetchProdutos = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (response.status === 204) {
                setProdutos([]);
                return;
            }
            if (!response.ok) {
                throw new Error(`Erro ao buscar produtos: ${response.status}`);
            }
            const data = await response.json();
            
            const mappedData = data.map(p => {
                
                return {
                    id: p.idProduto,
                    name: p.nomeProduto,
                    quantity: p.quantidadeProduto,
                    status: getStatusText(p.quantidadeProduto),
                    statusColor: getStatusColor(p.quantidadeProduto),
                    store: p.categoria?.nomeCategoria || 'N/A',
                    platforms: p.plataformas || [], 
                };
            });
            setProdutos(mappedData);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdutos();
    }, []);

    const handleRecarregarProdutos = () => {
        fetchProdutos();
    };

    const filteredProducts = produtos.filter(produto =>
        produto.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleAddProduct = () => {
        setIsNovoProdutoModalOpen(true);
    };

    const handleAdicionarMaisProduto = (product) => {
        setSelectedProduct(product);
        setIsAdicionarProdutoModalOpen(true);
    };

    const handleFilterProducts = () => {
        setIsFilterModalOpen(true);
    };

    const handleSaveProduct = (updatedProduct) => {
        console.log('Produto salvo:', updatedProduct);
        handleRecarregarProdutos();
    };

    const handleDeleteProduct = (productId) => {
        console.log('Produto excluído:', productId);
        handleRecarregarProdutos();
    };

    const handleAddNewProduct = (newProduct) => {
        handleRecarregarProdutos();
    };

    const handleAddMaisProduct = () => {
        handleRecarregarProdutos();
    };

    const handleFilterByCategories = (categories) => {
        console.log('Filtrar por categorias:', categories);
    };

    const handleAddNewCategory = (categoryName) => {
        console.log('Nova categoria adicionada:', categoryName);
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

    const colorOrder = { red: 0, yellow: 1, green: 2 };
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        return (colorOrder[a.statusColor] ?? 99) - (colorOrder[b.statusColor] ?? 99);
    });

    if (loading) {
        return <div className="estoque-loading">Carregando estoque...</div>;
    }

    return (
        <div className="estoque">
            <div className="estoque-header">
                <h1 className="page-title">Gestão de Estoque</h1>
                <div className="header-actions">
                    <button className="add-product-btn" onClick={handleAddProduct}>
                        <Plus size={16} /> Novo Produto
                    </button>
                    <button className="filter-btn" onClick={handleFilterProducts}>
                        <Filter size={16} /> Filtrar Itens
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
                {sortedProducts.length === 0 ? (
                    <div className="empty-state-card">
                        <p>{searchTerm ? "Nenhum produto encontrado com o termo de busca." : "Nenhum produto cadastrado."}</p>
                        <button className="add-product-btn" onClick={handleAddProduct} >
                            <Plus size={16} /> Cadastrar Primeiro Produto
                        </button>
                    </div>
                ) : (
                    sortedProducts.map((product) => (
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
                                        <button className="add-product-link" onClick={() => handleAdicionarMaisProduto(product)} >
                                            <Plus size={14} /> Adicionar produto
                                        </button>
                                        <button className="edit-product-link" onClick={() => handleEditProduct(product)} >
                                            <Edit size={14} /> Editar Produto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <EditProductModal isOpen={isEditModalOpen} onClose={closeEditModal} product={selectedProduct} onSave={handleSaveProduct} onDelete={handleDeleteProduct} />
            <NovoProdutoModal isOpen={isNovoProdutoModalOpen} onClose={closeNovoProdutoModal} onAdd={handleAddNewProduct} />
            <AdicaoProdutoModal
                isOpen={isAdicionarProdutoModalOpen}
                onClose={closeAdicionarProdutoModal}
                onAdd={handleAddMaisProduct}
                selectedProduct={selectedProduct}
            />
            <FilterFlowModal isOpen={isFilterModalOpen} onClose={closeFilterModal} onFilter={handleFilterByCategories} onAddCategory={handleAddNewCategory} />
        </div>
    );
};

export default Estoque;