import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './AdicaoProdutoModal.css';

// O modal agora recebe uma função onDelete (que será um callback de inativação)
const AdicionarProdutoModal = ({ isOpen, onClose, onAdd, onDelete, selectedProduct }) => {
    // Estado para armazenar a quantidade adicional por plataforma
    const [platformQuantities, setPlatformQuantities] = useState([]);
    const [loading, setLoading] = useState(false);
    const API_URL = "http://localhost:8080/produtos";

    useEffect(() => {
        // Quando o modal abre, inicializa o estado das quantidades adicionais
        if (isOpen && selectedProduct && selectedProduct.platforms) {
            setPlatformQuantities(
                selectedProduct.platforms.map(p => ({
                    fkPlataforma: p.fkPlataforma,
                    quantidadeAdicional: 0,
                    nomePlataforma: p.nomePlataforma // Mantém o nome para exibição
                }))
            );
        }
    }, [isOpen, selectedProduct]);

    const handlePlatformChange = (fkPlataforma, value) => {
        const quantity = Math.max(0, parseInt(value) || 0);

        setPlatformQuantities(prev =>
            prev.map(p =>
                p.fkPlataforma === fkPlataforma
                    ? { ...p, quantidadeAdicional: quantity }
                    : p
            )
        );
    };

    const handleAdd = async () => {
        // Lógica de adicionar quantidade (mantida)
        if (!selectedProduct) return;

        const plataformasParaEnviar = platformQuantities
            .filter(p => p.quantidadeAdicional > 0)
            .map(p => ({
                fkPlataforma: p.fkPlataforma,
                quantidadeAdicional: p.quantidadeAdicional
            }));

        if (plataformasParaEnviar.length === 0) {
            alert('Por favor, adicione a quantidade em pelo menos uma plataforma.');
            return;
        }

        const payload = {
            fkProduto: selectedProduct.id,
            plataformas: plataformasParaEnviar
        };

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/adicionar-quantidade`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao adicionar produto: ${response.status} - ${errorText}`);
            }

            onAdd();
            alert('Quantidade adicionada com sucesso!');
            handleClose();

        } catch (error) {
            console.error("Erro no fetch:", error);
            alert(`Falha ao adicionar quantidade: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // NOVO MÉTODO: Inativação Lógica (Substitui a Exclusão Física)
    const handleExcluir = async () => {
        if (!selectedProduct || !window.confirm(`Tem certeza que deseja INATIVAR o produto ${selectedProduct.name}? Ele será removido do estoque ativo.`)) {
            return;
        }

        setLoading(true);
        try {
            // Chama o novo endpoint PATCH /produtos/{id}/inativar
            const response = await fetch(`${API_URL}/${selectedProduct.id}/inativar`, {
                method: 'PATCH',
            });

            if (response.status === 204) {
                // Sucesso (No Content)
                // Chama a função de callback no Estoque para atualizar a lista
                if (onDelete) {
                    onDelete(selectedProduct.id); 
                }
                alert(`Produto ${selectedProduct.name} inativado com sucesso!`);
                handleClose();
            } else if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ao inativar produto: ${response.status} - ${errorText}`);
            }

        } catch (error) {
            console.error("Erro no fetch de inativação:", error);
            alert(`Falha ao inativar produto: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPlatformQuantities([]); // Resetar o estado
        onClose();
    };

    if (!isOpen || !selectedProduct) return null;

    // Função auxiliar para obter a quantidade adicional atual
    const getQuantityForPlatform = (fkPlataforma) => {
        const platform = platformQuantities.find(p => p.fkPlataforma === fkPlataforma);
        // Retorna string vazia se a quantidade for 0, para que o placeholder apareça
        const qtd = platform ? platform.quantidadeAdicional : 0;
        return qtd === 0 ? '' : qtd;
    };

    return (
        <div className="adicionar-produto-modal-overlay">
            <div className="adicionar-produto-modal-container">
                <div className="adicionar-produto-modal-header">
                    <h2 className="adicionar-produto-modal-title">Adicionar mais produto</h2>
                    <button className="adicionar-produto-close-button" onClick={handleClose} disabled={loading}>
                        <X size={20} />
                    </button>
                </div>

                <div className="adicionar-produto-modal-content">
                    <div className="adicionar-produto-form-section">
                        {/* Nome do Produto (Apenas leitura) */}
                        <div className="adicionar-produto-form-group">
                            <label className="adicionar-produto-form-label">Nome do Produto</label>
                            <input
                                type="text"
                                className="adicionar-produto-form-input"
                                value={selectedProduct.name || ''}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Seção de Plataformas (Carrinho) */}
                    <div className="adicionar-produto-platform-section">
                        <h3 className="adicionar-produto-platform-title">Adicionar Quantidade por Plataforma</h3>
                        <div className="adicionar-produto-platform-summary">
                            <div className="adicionar-produto-platform-header">
                                <span>Plataforma</span>
                                <span>Quantidade Adicional</span>
                            </div>
                            {platformQuantities.map((platform) => (
                                <div key={platform.fkPlataforma} className="adicionar-produto-platform-row">
                                    <span>{platform.nomePlataforma}</span>
                                    <input
                                        type="number"
                                        min="0"
                                        className="adicionar-produto-platform-input"
                                        placeholder="0" // Adicionado placeholder
                                        value={getQuantityForPlatform(platform.fkPlataforma)}
                                        onChange={(e) => handlePlatformChange(platform.fkPlataforma, e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            ))}
                            {platformQuantities.length === 0 && (
                                <div className="adicionar-produto-platform-row">
                                    <span>Nenhuma plataforma de venda encontrada para este produto.</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="adicionar-produto-modal-footer">
                    <button className="adicionar-produto-excluir-button" onClick={handleExcluir} disabled={loading}>
                        Excluir Produto
                    </button>
                    <button className="adicionar-produto-adicionar-button" onClick={handleAdd} disabled={loading}>
                        {loading ? 'Adicionando...' : 'Adicionar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdicionarProdutoModal;