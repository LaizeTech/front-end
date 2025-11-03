import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import './EditProductModal.css';

const API_URL = "http://localhost:8080/produtos";
const PLATFORM_API_URL = "http://localhost:8080/plataformas";
const CATEGORY_API_URL = "http://localhost:8080/categorias";

const EditProductModal = ({ isOpen, onClose, product, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    category: product?.category || '',
    image: product?.image || null,
    imageFile: null
  });
  
  const [currentPlatforms, setCurrentPlatforms] = useState([]); // Plataformas já relacionadas ao produto
  const [newPlatformData, setNewPlatformData] = useState({ fkPlataforma: '', quantidadeInicial: 0 }); // Para o botão "+ Adicionar Plataforma"
  const [categorias, setCategorias] = useState([]);
  const [plataformasDisponiveis, setPlataformasDisponiveis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantitiesToAdd, setQuantitiesToAdd] = useState({});

  // Efeito para carregar dados iniciais (categorias e plataformas)
  useEffect(() => {
    carregarCategorias();
    carregarPlataformas();
  }, []);

  // Efeito para carregar dados do produto selecionado
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        // Garante que o valor inicial da categoria seja uma string do ID
        category: String(product.category || ''), 
        image: product.image || null,
        imageFile: null
      });
      // A lista de plataformas atual é carregada separadamente
      setCurrentPlatforms(product.platforms || []);
      // Resetar o estado de quantidades a adicionar
      setQuantitiesToAdd({});
    }
  }, [product]);

  const carregarCategorias = async () => {
    try {
      const response = await fetch(CATEGORY_API_URL);
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const carregarPlataformas = async () => {
    try {
      const response = await fetch(PLATFORM_API_URL);
      if (response.ok) {
        const data = await response.json();
        
        // VERIFICAÇÃO ADICIONAL: Se o array estiver vazio, loga um aviso
        if (data.length === 0) {
            console.warn(`[Plataformas] O endpoint ${PLATFORM_API_URL} retornou um array vazio. Verifique se há plataformas cadastradas no banco.`);
        }

        // VERIFICAÇÃO ADICIONAL: Se o primeiro item não tiver as propriedades esperadas
        if (data.length > 0 && (!data[0].idPlataforma && !data[0].id) || (!data[0].nomePlataforma && !data[0].nome)) {
            console.error(`[Plataformas] O formato dos dados retornados está incorreto. Esperado { idPlataforma, nomePlataforma } ou { id, nome }. Recebido:`, data[0]);
        }

        setPlataformasDisponiveis(data);
      } else {
        // LOG DE ERRO DETALHADO
        const errorText = await response.text();
        console.error(`[Plataformas] Erro ao carregar plataformas: Status ${response.status}. Resposta do servidor:`, errorText);
      }
    } catch (error) {
      console.error('[Plataformas] Erro de rede ao carregar plataformas:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: e.target.result,
          imageFile: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleQuantityToAddChange = (fkPlataforma, value) => {
    const quantity = Math.max(0, parseInt(value) || 0);
    setQuantitiesToAdd(prev => ({
      ...prev,
      [fkPlataforma]: quantity
    }));
  };

  // ------------------------------------------------------------------
  // Ações Granulares de Estoque
  // ------------------------------------------------------------------

  // Ação 1: Adicionar Quantidade (PATCH /adicionar-quantidade)
  const handleAddQuantity = async (fkPlataforma) => {
    const quantidadeAdicional = quantitiesToAdd[fkPlataforma] || 0;
    if (quantidadeAdicional <= 0) return;

    setLoading(true);
    try {
      const payload = {
        fkProduto: product.id,
        plataformas: [{ fkPlataforma, quantidadeAdicional }]
      };

      const response = await fetch(`${API_URL}/adicionar-quantidade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao adicionar quantidade.");

      alert('Quantidade adicionada com sucesso!');
      
      // Atualizar a quantidade localmente
      const updatedPlatforms = currentPlatforms.map(p => 
        p.fkPlataforma === fkPlataforma 
          ? { ...p, quantity: (p.quantity || p.quantidadeProdutoPlataforma || 0) + quantidadeAdicional } 
          : p
      );
      setCurrentPlatforms(updatedPlatforms);
      
      // Limpar o input de quantidade
      setQuantitiesToAdd(prev => ({ ...prev, [fkPlataforma]: 0 }));
      
      if (onUpdate) onUpdate(); // Recarrega os dados completos no pai
    } catch (error) {
      console.error("Erro no fetch:", error);
      alert(`Falha ao adicionar quantidade: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Ação 2: Remover Relação (DELETE /{idProduto}/plataformas/{idPlataforma})
  const handleRemovePlatform = async (fkPlataforma) => {
    if (!window.confirm("Tem certeza que deseja remover este produto desta plataforma?")) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${product.id}/plataformas/${fkPlataforma}`, {
        method: 'DELETE',
      });

      if (response.status !== 204) throw new Error("Erro ao remover plataforma.");

      alert('Relação com a plataforma removida com sucesso!');
      // Remove a plataforma localmente
      setCurrentPlatforms(prev => prev.filter(p => p.fkPlataforma !== fkPlataforma));
      if (onUpdate) onUpdate(); // Recarrega os dados completos no pai
    } catch (error) {
      console.error("Erro no fetch:", error);
      alert(`Falha ao remover plataforma: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Ação 3: Adicionar Nova Plataforma (+ Adicionar Plataforma)
  const handleAddNewPlatform = async () => {
    const { fkPlataforma, quantidadeInicial } = newPlatformData;

    if (!fkPlataforma || quantidadeInicial <= 0) {
      alert("Selecione a plataforma e informe uma quantidade inicial válida.");
      return;
    }
    
    // CORREÇÃO: Usar o ID correto para verificar se a plataforma já está relacionada
    const platformId = parseInt(fkPlataforma);
    if (currentPlatforms.some(p => p.fkPlataforma === platformId)) {
      alert("Este produto já está associado a esta plataforma.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        fkPlataforma: platformId,
        quantidadeInicial: parseInt(quantidadeInicial)
      };

      const response = await fetch(`${API_URL}/${product.id}/plataformas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status !== 201) throw new Error("Erro ao adicionar nova plataforma.");

      alert('Nova plataforma adicionada com sucesso!');
      setNewPlatformData({ fkPlataforma: '', quantidadeInicial: 0 }); // Limpa o formulário
      if (onUpdate) onUpdate(); // Recarrega os dados completos no pai
    } catch (error) {
      console.error("Erro no fetch:", error);
      alert(`Falha ao adicionar plataforma: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // Ação Principal: Salvar Dados Básicos e Imagem (PUT /{id}/atualizar)
  // ------------------------------------------------------------------
  const handleSave = async () => {
    // Validações
    if (!formData.name.trim() || !formData.category) {
      alert("Por favor, preencha o nome do produto e selecione uma categoria.");
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      // Prepara o objeto do produto (ProdutoEdicaoDTO) - Apenas dados básicos
      const produtoData = {
        nomeProduto: formData.name,
        idCategoria: parseInt(formData.category),
        plataformas: [] 
      };

      // Adiciona o objeto do produto como JSON
      formDataToSend.append(
        "produto",
        new Blob([JSON.stringify(produtoData)], { type: "application/json" })
      );

      // Adiciona o arquivo de imagem, se existir
      if (formData.imageFile) {
        formDataToSend.append("imagem", formData.imageFile);
      }

      const response = await fetch(`${API_URL}/${product.id}/atualizar`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Erro ao atualizar dados básicos do produto.");

      alert("✅ Dados básicos e imagem atualizados com sucesso!");
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  };

  // Ação 4: Excluir Produto (PATCH /{id}/inativar)
  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja INATIVAR este produto? Ele será removido do estoque ativo.")) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/${product.id}/inativar`, {
        method: 'PATCH',
      });

      if (response.status !== 204) throw new Error("Erro ao inativar produto.");

      alert(`Produto ${product.name} inativado com sucesso!`);
      if (onDelete) onDelete(product.id); // Chama o callback do componente pai
      onClose();
    } catch (error) {
      console.error("Erro no fetch de inativação:", error);
      alert(`Falha ao inativar produto: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Editar Produto</h2>
          <button className="close-button" onClick={onClose} disabled={loading}>
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
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                disabled={loading}
              >
                <option value="">Escolha a categoria</option>
                {categorias.map((cat) => (
                  <option key={cat.idCategoria} value={cat.idCategoria}>
                    {cat.nomeCategoria}
                  </option>
                ))}
              </select>
            </div>

            <div className="platforms-section">
              <label className="form-label">Plataformas</label>
              <div className="platforms-table">
                <div className="table-header">
                  <span>Plataforma</span>
                  <span>Qtd. Atual</span>
                  <span>Adicionar Qtd.</span>
                  <span>Remover</span> 
                </div>
                
                {currentPlatforms.map((platform) => {
                  const fkPlataforma = platform.fkPlataforma;
                  const quantityToAdd = quantitiesToAdd[fkPlataforma] || 0;
                  const currentQuantity = platform.quantity || platform.quantidadeProdutoPlataforma || 0;
                  
                  return (
                    <div key={fkPlataforma} className="table-row">
                      {/* Plataforma (Apenas leitura) */}
                      <span className="platform-name-display">{platform.nomePlataforma}</span>
                      
                      {/* Quantidade Atual (CORRIGIDO) */}
                      <span className="platform-quantity-display">{currentQuantity}</span>
                      
                      {/* Adicionar Quantidade (Input + Botão) */}
                      <div className="add-quantity-group">
                        <input
                          type="number"
                          min="0"
                          className="quantity-input"
                          placeholder="0"
                          value={quantityToAdd}
                          onChange={(e) => handleQuantityToAddChange(fkPlataforma, e.target.value)}
                          disabled={loading}
                        />
                        <button
                          className="add-quantity-btn"
                          onClick={() => handleAddQuantity(fkPlataforma)}
                          disabled={loading || quantityToAdd <= 0}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      {/* Remover Relação (Botão X - CORRIGIDO) */}
                      <div className="remove-platform-cell">
                        <button
                          className="remove-platform-btn"
                          onClick={() => handleRemovePlatform(fkPlataforma)}
                          disabled={loading}
                        >
                          <X size={16} color="#dc3545" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Formulário para Adicionar Nova Plataforma */}
              <div className="add-new-platform-form">
                <select
                  className="platform-input"
                  value={newPlatformData.fkPlataforma}
                  onChange={(e) => setNewPlatformData(prev => ({ ...prev, fkPlataforma: e.target.value }))}
                  disabled={loading}
                >
                  <option value="">Selecione a plataforma</option>
                  {plataformasDisponiveis.map((plat) => {
                    // CORREÇÃO: Usar 'id' e 'nome' como fallback para Entidade
                    const id = plat.idPlataforma || plat.id;
                    const nome = plat.nomePlataforma || plat.nome;

                    if (!id || !nome) {
                        console.error("Objeto de plataforma inválido:", plat);
                        return null;
                    }

                    return (
                      <option 
                        key={id} 
                        value={id}
                        // Desabilita plataformas já adicionadas
                        disabled={currentPlatforms.some(p => p.fkPlataforma === id)}
                      >
                        {nome}
                      </option>
                    );
                  })}
                </select>
                <input
                  type="number"
                  min="0"
                  className="quantity-input"
                  placeholder="Qtd. Inicial"
                  value={newPlatformData.quantidadeInicial}
                  onChange={(e) => setNewPlatformData(prev => ({ ...prev, quantidadeInicial: parseInt(e.target.value) || 0 }))}
                  disabled={loading}
                />
                <button 
                  className="add-platform-btn" 
                  onClick={handleAddNewPlatform}
                  disabled={loading || !newPlatformData.fkPlataforma || newPlatformData.quantidadeInicial <= 0}
                >
                  <Plus size={16} />
                  Adicionar Plataforma
                </button>
              </div>
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
                {formData.image ? 'Alterar Imagem' : 'Adicionar Imagem'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  disabled={loading}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="delete-button" onClick={handleDelete} disabled={loading}>
            <Trash2 size={16} />
            Excluir Produto
          </button>
          <button className="save-button" onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Dados Básicos e Imagem'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;