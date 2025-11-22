import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Download } from 'lucide-react';
import RegistroSaidaModal from './components/RegistroSaidaModal';
//import './saidas.css';

const Saidas = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [exits, setExits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChoiceModalOpen, setIsChoiceModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExits, setFilteredExits] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const fetchSaidas = async () => {
    try {
      setLoading(true);
      setError(null); // Limpa erros anteriores
      // 1. URL alterada para o novo endpoint que retorna dados detalhados
      const response = await fetch('http://localhost:8080/saidas/detalhes');

      if (response.status === 204) {
        setExits([]); // Se não houver conteúdo, define a lista como vazia
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // 2. Transforma os dados recebidos do backend para o formato que a tabela espera
      const transformedData = data.map(item => ({
        id: item.id_saida,
        platform: item.nome_plataforma || 'N/A',
        type: item.nome_tipo || 'N/A',
        date: formatDate(item.data_venda),
        price: formatPrice(item.preco_venda),
        discount: formatPrice(item.total_desconto),
        status: formatStatusDisplay(item.nome_status),
        statusColor: getStatusColor(item.nome_status)
      }));
      
      setExits(transformedData);
    } catch (err) {
      console.error('Error fetching saidas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSaidas();
  }, []);

  // Filtrar dados baseado no termo de pesquisa
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredExits(exits);
    } else {
      const filtered = exits.filter(exit =>
        exit.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredExits(filtered);
    }
  }, [exits, searchTerm]);

  // --- Funções Auxiliares (Helpers) ---

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      // Formata a data para dia/mês/ano
      return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatStatusDisplay = (status) => {
    if (!status) return 'N/A';
    const statusStr = String(status).trim().toUpperCase();
    switch (statusStr) {
      case 'FINALIZADA':
      case 'FINALIZADO':
      case 'COMPLETED':
        return 'FINALIZADA';
      case 'ATIVO':
      case 'ACTIVE':
      case '1':
      case 'TRUE':
        return 'ATIVO';
      case 'DESATIVO':
      case 'INATIVO':
      case 'INACTIVE':
      case '0':
      case 'FALSE':
        return 'DESATIVO';
      case 'PENDENTE':
      case 'PENDING':
        return 'PENDENTE';
      case 'CANCELADA':
      case 'CANCELADO':
      case 'CANCELLED':
        return 'CANCELADA';
      default:
        return statusStr || 'N/A';
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'gray';
    const statusStr = String(status).trim().toUpperCase();
    switch (statusStr) {
      case 'FINALIZADA':
      case 'FINALIZADO':
      case 'COMPLETED':
        return 'green';
      case 'ATIVO':
      case 'ACTIVE':
      case '1':
      case 'TRUE':
        return 'green';
      case 'DESATIVO':
      case 'INATIVO':
      case 'INACTIVE':
      case '0':
      case 'FALSE':
        return 'red';
      case 'PENDENTE':
      case 'PENDING':
        return 'orange';
      case 'CANCELADA':
      case 'CANCELADO':
      case 'CANCELLED':
        return 'red';
      default: 
        console.log('Status não reconhecido:', status);
        return 'gray';
    }
  };

  const getPlatformColor = (platform) => {
    if (!platform) return 'gray';
    switch (platform.toLowerCase()) {
      case 'shopee':
      case 'shoope': 
        return 'orange';
      case 'nuvemshop':
        return 'blue';
      case 'mercado livre':
      case 'mercadolivre':
        return 'yellow';
      case 'loja física':
      case 'loja fisica':
        return 'purple';
      default: return 'gray';
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(exits.map(exit => exit.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleInserirSaida = () => {
    setIsChoiceModalOpen(true);
  };

  const handleChoiceModalClose = () => {
    setIsChoiceModalOpen(false);
  };

  const handleRegistroManual = () => {
    setIsChoiceModalOpen(false);
    setIsModalOpen(true);
  };

  const handleImportarArquivo = () => {
    setIsChoiceModalOpen(false);
    // Criar input file para upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = handleFileUpload;
    input.click();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('arquivo', file);
        
        const response = await fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Erro no upload: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Arquivo enviado com sucesso:', result);
        alert(`Arquivo "${file.name}" enviado com sucesso!`);
        
        // Recarregar os dados após o upload
        fetchSaidas();
        
      } catch (error) {
        console.error('Erro ao enviar arquivo:', error);
        alert(`Erro ao enviar arquivo "${file.name}": ${error.message}`);
      }
    }
  };

  const handleToggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchTerm('');
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSaida = async (produtosSelecionados) => {
    try {
      // Implementar lógica para salvar as saídas no backend
      console.log('Salvando saídas:', produtosSelecionados);
      
      // Exemplo de como os dados seriam enviados para o backend
      for (const produto of produtosSelecionados) {
        const saidaData = {
          idProduto: produto.id,
          quantidade: produto.quantidadeSaida,
          plataforma: produto.plataforma,
          precoVenda: parseFloat(produto.precoVenda),
          dataVenda: new Date().toISOString()
        };
        
        // Fazer a requisição POST para salvar a saída
        const response = await fetch('http://localhost:8080/saidas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(saidaData)
        });
        
        if (!response.ok) {
          throw new Error(`Erro ao salvar saída do produto ${produto.nome}`);
        }
      }
      
      // Recarregar os dados após salvar
      fetchSaidas();
      alert('Saídas registradas com sucesso!');
      
    } catch (error) {
      console.error('Erro ao salvar saídas:', error);
      alert('Erro ao registrar saídas: ' + error.message);
    }
  };

  const handleExportar = () => {
    // Implementar lógica para exportar dados selecionados
    const selectedExits = exits.filter(exit => selectedItems.includes(exit.id));
    console.log('Exportar dados selecionados:', selectedExits);
    
    // Exemplo simples de exportação para CSV
    const csvContent = [
      ['Plataforma', 'Tipo', 'Data da Venda', 'Preço de Venda', 'Desconto', 'Status'],
      ...selectedExits.map(exit => [
        exit.platform,
        exit.type,
        exit.date,
        exit.price,
        exit.discount,
        exit.status
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `saidas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Renderização do Componente ---

  if (loading) {
    return (
      <div className="saidas">
        <div className="page-header"><h1 className="page-title">Saídas do Estoque</h1></div>
        <div className="loading-container"><p>Carregando dados...</p></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saidas">
        <div className="page-header"><h1 className="page-title">Saídas do Estoque</h1></div>
        <div className="error-container">
          <p>Erro ao carregar dados: {error}</p>
          <button onClick={fetchSaidas} className="retry-button">Tentar novamente</button>
        </div>
      </div>
    );
  }

  return (
    <div className="saidas">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Saídas do Estoque</h1>
          <div className="header-buttons">
            {selectedItems.length > 0 && (
              <button onClick={handleExportar} className="action-button export-button">
                <Download size={16} />
                Exportar
              </button>
            )}
            <button onClick={handleInserirSaida} className="action-button insert-button">
              <Plus size={16} />
              Inserir Saída
            </button>
            <button onClick={fetchSaidas} className="refresh-button" disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </div>

      {selectedItems.length > 0 && (
        <div className="selected-info-bar">
          <span>{selectedItems.length} item(s) selecionado(s)</span>
        </div>
      )}

      {filteredExits.length === 0 && searchTerm && (
        <div className="search-notification">
          <div className="search-notification-content">
            <p>Nenhuma plataforma encontrada para "{searchTerm}"</p>
          </div>
        </div>
      )}

      {exits.length === 0 ? (
        <div className="empty-container">
          <p>Nenhuma saída encontrada.</p>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-wrapper">
            <table className="exits-table">
              <thead>
                <tr>
                  <th className="checkbox-column">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedItems.length > 0 && selectedItems.length === filteredExits.length} />
                  </th>
                  <th className="sortable-header">
                    <div className="header-with-search">
                      <span>Plataforma</span>
                      <ChevronDown 
                        size={16} 
                        className={`search-toggle ${showSearch ? 'active' : ''}`}
                        onClick={handleToggleSearch}
                      />
                    </div>
                    {showSearch && (
                      <div className="search-input-container">
                        <input
                          type="text"
                          placeholder="Pesquisar plataforma..."
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="product-search-input"
                          autoFocus
                        />
                      </div>
                    )}
                  </th>
                  <th>Tipo</th>
                  <th>Data da Venda</th>
                  <th>Preço de Venda</th>
                  <th>Desconto</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredExits.map((exit) => (
                  <tr key={exit.id}>
                    <td className="checkbox-column">
                      <input type="checkbox" checked={selectedItems.includes(exit.id)} onChange={() => handleSelectItem(exit.id)} />
                    </td>
                    <td><span className={`platform-badge ${getPlatformColor(exit.platform)}`}>{exit.platform}</span></td>
                    <td className="type">{exit.type}</td>
                    <td className="date">{exit.date}</td>
                    <td className="price">{exit.price}</td>
                    <td className="discount">{exit.discount}</td>
                    <td><span className={`status-badge ${exit.statusColor}`}>{exit.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <RegistroSaidaModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSaida}
      />

      {/* Modal de Escolha */}
      {isChoiceModalOpen && (
        <div className="modal-overlay">
          <div className="choice-modal">
            <div className="modal-header">
              <h3>Como deseja adicionar a saída?</h3>
              <button className="close-button" onClick={handleChoiceModalClose}>
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>Escolha uma das opções abaixo:</p>
              <div className="choice-buttons">
                <button className="choice-btn manual-btn" onClick={handleRegistroManual}>
                  <div className="btn-icon">📝</div>
                  <div className="btn-text">
                    <strong>Registro Manual</strong>
                    <span>Preencher dados manualmente</span>
                  </div>
                </button>
                <button className="choice-btn import-btn" onClick={handleImportarArquivo}>
                  <div className="btn-icon">📁</div>
                  <div className="btn-text">
                    <strong>Importar Arquivo</strong>
                    <span>CSV ou Excel (.xlsx, .xls)</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Saidas;