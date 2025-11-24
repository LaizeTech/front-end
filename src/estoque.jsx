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
    const [activeFilters, setActiveFilters] = useState([]); // NOVO: Armazena os IDs das categorias selecionadas
    const API_URL = "http://localhost:8080"; // URL base da API

    // Função para buscar o caminho da imagem de um produto específico
    const fetchImagePath = async (productId) => {
        try {
            const response = await fetch(`${API_URL}/produtos/${productId}/imagePath`); // Endpoint criado no ProdutoJpaController
            if (!response.ok) {
                throw new Error(`Erro ao buscar caminho da imagem: ${response.status}`);
            }
            const data = await response.json();
            return data.caminhoImagem; // Assumindo que o backend retorna um objeto { caminhoImagem: "..." }
        } catch (error) {
            console.error(`Erro ao buscar caminho da imagem para o produto ${productId}:`, error);
            return null;
        }
    };

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

    // FUNÇÃO MODIFICADA: Agora aceita um array de IDs de categorias para filtrar
    const fetchProdutos = async (categoryIds = activeFilters) => {
        setLoading(true);
        let url = `${API_URL}/produtos`;
        
        if (categoryIds.length > 0) {
            // Converte o array de IDs para uma string separada por vírgulas para o backend
            const categoryQuery = categoryIds.join(',');
            url = `${API_URL}/produtos?categorias=${categoryQuery}`;
        } else {
            // Se não houver filtros ativos, garante que a URL base seja usada
            url = `${API_URL}/produtos`;
        }

        try {
            const response = await fetch(url);
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
                    // Adicionando o caminho da imagem para uso posterior
                    imagePath: p.caminhoImagem || null,
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

    // FUNÇÃO MODIFICADA: Recarrega os produtos mantendo os filtros ativos
    const handleRecarregarProdutos = () => {
        fetchProdutos(activeFilters);
    };

    // NOVO: Função chamada pelo modal para aplicar o filtro
    const handleFilterByCategories = (categoryIds) => {
        setActiveFilters(categoryIds); // Salva os filtros ativos
        fetchProdutos(categoryIds); // Busca os produtos com os filtros
        setIsFilterModalOpen(false); // Fecha o modal após a filtragem
    };

    // NOVO: Função chamada pelo modal após o cadastro de uma nova categoria
    const handleAddNewCategory = (categoryName) => {
        console.log('Nova categoria adicionada:', categoryName);
        // O modal já recarrega a lista de categorias internamente.
        // Aqui, você pode adicionar uma notificação de sucesso se desejar.
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

    const handleAddNewProduct = async (newProduct) => {
        // Mapeia o novo produto para o formato esperado pela lista de produtos
        const mappedProduct = {
            id: newProduct.idProduto,
            name: newProduct.nomeProduto,
            quantity: newProduct.quantidadeProduto,
            status: getStatusText(newProduct.quantidadeProduto),
            statusColor: getStatusColor(newProduct.quantidadeProduto),
            store: newProduct.categoria?.nomeCategoria || 'N/A',
            platforms: newProduct.plataformas || [],
            imagePath: newProduct.caminhoImagem || null,
        };

        // Lógica de Fallback: Se o caminho da imagem não veio no objeto de retorno, busca separadamente
        if (!mappedProduct.imagePath && mappedProduct.id) {
            const fetchedImagePath = await fetchImagePath(mappedProduct.id);
            mappedProduct.imagePath = fetchedImagePath;
        }

        // Adiciona o novo produto ao início da lista (ou onde for mais apropriado)
        setProdutos(prevProdutos => [mappedProduct, ...prevProdutos]);
    };

    const handleAddMaisProduct = () => {
        handleRecarregarProdutos();
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
                                {product.imagePath ? (
                                    <img 
                                        src={`http://localhost:8080/uploads/imagens/${product.imagePath}`} 
                                        alt={product.name} 
                                        className="product-img" 
                                    />
                                ) : (
                                    <div className="image-placeholder">Sem Imagem</div>
                                )}
                            </div>
                            <div className="product-info">
                                <h3 className="estoque-product-name">{product.name}</h3>
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
                                        <span className="store-name">Plataforma de venda:</span>
                                    </div>
                                    <div className="platform-info" style={{ marginTop: '-10px' }}>
                                        <span className="platform-list">
                                            {product.platforms && product.platforms.length > 0
                                                ? product.platforms.map(p => p.nomePlataforma).join(', ')
                                                : 'Nenhuma plataforma'}
                                        </span>
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
            {/* O modal de filtro agora usa as novas funções de callback */}
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