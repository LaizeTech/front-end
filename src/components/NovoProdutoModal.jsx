import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import './NovoProdutoModal.css';

  const NovoProdutoModal = ({ isOpen, onClose, onAdd }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    tempPlatform: { name: '', quantity: 0 },
    platforms: [],
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
    const newPlatform = { name: '', quantity: 0 };
    setFormData(prev => ({
      ...prev,
      platforms: [...prev.platforms, newPlatform],
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
    const { name, category, price } = formData;
    
    if (!name.trim() || !category.trim() || !price.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios antes de continuar.");
      return;
    }

    setCurrentStep(2);
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const cadastrarProduto = async (produtoData, imagemFile) => {
    const formData = new FormData();

    // Adiciona o objeto do produto como JSON
    formData.append(
      "produto",
      new Blob([JSON.stringify(produtoData)], { type: "application/json" })
    );

    // Adiciona o arquivo de imagem, se existir
    if (imagemFile) {
      formData.append("imagem", imagemFile);
    }

    try {
      const response = await fetch("http://localhost:8080/produtos/cadastro", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro ao cadastrar produto");

      const data = await response.json();
      console.log("Produto cadastrado:", data);
      alert("✅ Produto cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("❌ Erro ao cadastrar produto");
    }
  };

  const handleSubmit = () => {
    const produtoData = {
      nomeProduto: formData.name,
      categoria: formData.category,
      preco: formData.price,
      plataformas: formData.platforms,
      caracteristicas: formData.characteristics,
    };

    // Extrai a imagem em base64 e transforma em arquivo (caso precise)
    let imagemFile = null;
    if (formData.image) {
      const arr = formData.image.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      imagemFile = new File([u8arr], "imagem-produto.png", { type: mime });
    }

    cadastrarProduto(produtoData, imagemFile);
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

  const handlePriceChange = (value) => {
    const numericValue = value.replace(/\D/g, ""); // remove tudo que não é número
    const formattedValue = (Number(numericValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setFormData(prev => ({
      ...prev,
      price: formattedValue,
    }));
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
                    <option value="1">Maquiagem</option>
                    <option value="2">Skincare</option>
                  </select>
                </div>

                <div className="novo-produto-form-group">
                  <label className="novo-produto-form-label">Preço</label>
                  <input
                    type="text"
                    className="novo-produto-form-input"
                    placeholder="R$ 0,00"
                    value={formData.price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                  />
                </div>
              </div>

              <div className="novo-produto-platform-section">
                <label className="novo-produto-form-label">Selecione a plataforma de venda</label>
                <select
                  className="novo-produto-platform-select"
                  value={formData.tempPlatform?.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tempPlatform: {
                        ...prev.tempPlatform,
                        name: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="">Escolha a plataforma</option>
                  <option value="Shopee">Shopee</option>
                  <option value="NuvemShop">NuvemShop</option>
                </select>

                <label className="novo-produto-form-label">
                  Quantidade de produtos na plataforma
                </label>
                <input
                  type="number"
                  className="novo-produto-quantity-input" 
                  placeholder='0'
                  value={formData.tempPlatform?.quantity || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tempPlatform: {
                        ...prev.tempPlatform,
                        quantity: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />

                <button
                  className="novo-produto-add-platform-btn"
                  onClick={() => {
                    if (
                      !formData.tempPlatform?.name ||
                      formData.tempPlatform.quantity <= 0
                    ) {
                      alert("Selecione a plataforma e informe uma quantidade válida.");
                      return;
                    }

                    // Verifica se a plataforma já existe na lista
                    const exists = formData.platforms.some(
                      (p) => p.name === formData.tempPlatform.name
                    );

                    if (exists) {
                      alert("Essa plataforma já foi adicionada.");
                      return;
                    }

                    setFormData((prev) => ({
                      ...prev,
                      platforms: [...prev.platforms, prev.tempPlatform],
                      tempPlatform: { name: "", quantity: 0 }, // limpa os inputs
                    }));
                  }}
                >
                  Adicionar quantidade por plataforma
                </button>

                <div className="novo-produto-platform-summary">
                  <div className="novo-produto-platform-header">
                    <span>Plataforma</span>
                    <span>Qtd. de Produtos</span>
                  </div>

                  {formData.platforms.length === 0 ? (
                    <div className="novo-produto-platform-row">
                      <span>Nenhuma plataforma adicionada</span>
                      <span>-</span>
                    </div>
                  ) : (
                    formData.platforms.map((platform, index) => (
                      <div key={index} className="novo-produto-platform-row">
                        <span>{platform.name}</span>
                        <span>{platform.quantity}</span>
                      </div>
                    ))
                  )}
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
                  value={formData.tempCharacteristic?.platform || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tempCharacteristic: {
                        ...prev.tempCharacteristic,
                        platform: e.target.value,
                      },
                    }))
                  }
                >
                  <option value="">Escolha a plataforma</option>
                  {formData.platforms.map((p, i) => (
                    <option key={i} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <label className="novo-produto-form-label">Característica</label>
                <input
                  type="text"
                  className="novo-produto-form-input"
                  placeholder="Característica do produto (ex: cor, tamanho)"
                  value={formData.tempCharacteristic?.name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tempCharacteristic: {
                        ...prev.tempCharacteristic,
                        name: e.target.value,
                      },
                    }))
                  }
                />

                <label className="novo-produto-form-label">
                  Quantidade de itens por característica
                </label>
                <input
                  type="number"
                  className="novo-produto-quantity-input"
                  placeholder="0"
                  value={formData.tempCharacteristic?.quantity || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tempCharacteristic: {
                        ...prev.tempCharacteristic,
                        quantity: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                />

                <button
                  className="novo-produto-add-characteristic-btn"
                  onClick={() => {
                    const { tempCharacteristic, platforms, characteristics } = formData;
                    if (
                      !tempCharacteristic?.platform ||
                      !tempCharacteristic?.name ||
                      tempCharacteristic.quantity <= 0
                    ) {
                      alert("Preencha todos os campos antes de adicionar.");
                      return;
                    }

                    // Pega a plataforma correspondente
                    const platformData = platforms.find(
                      (p) => p.name === tempCharacteristic.platform
                    );

                    // Soma total já cadastrada para essa plataforma
                    const usedQuantity = characteristics
                      .filter((c) => c.platform === tempCharacteristic.platform)
                      .reduce((acc, c) => acc + c.quantity, 0);

                    // Valida se ainda cabe
                    if (usedQuantity + tempCharacteristic.quantity > platformData.quantity) {
                      alert(
                        `A soma das características (${usedQuantity + tempCharacteristic.quantity}) ultrapassa a quantidade total (${platformData.quantity}) da plataforma ${platformData.name}.`
                      );
                      return;
                    }

                    setFormData((prev) => ({
                      ...prev,
                      characteristics: [...prev.characteristics, tempCharacteristic],
                      tempCharacteristic: { platform: "", name: "", quantity: 0 },
                    }));
                  }}
                >
                  Adicionar quantidade por característica
                </button>
              </div>

              <div className="novo-produto-image-section">
                <div className="novo-produto-image-preview">
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="novo-produto-preview-image"
                    />
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
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                <div className="novo-produto-characteristics-summary">
                  <div className="novo-produto-characteristics-header">
                    <span>Plataforma</span>
                    <span>Qtd. de Produtos</span>
                  </div>

                  {formData.platforms.map((p, i) => {
                    const platformChars = formData.characteristics.filter(
                      (c) => c.platform === p.name
                    );
                    const totalUsed = platformChars.reduce((acc, c) => acc + c.quantity, 0);

                    return (
                      <div key={i} className="novo-produto-characteristics-content">
                        <div className="novo-produto-characteristics-item platform-summary">
                          <span>{p.name}</span>
                          <span>
                            {totalUsed}/{p.quantity}
                          </span>
                        </div>

                        {platformChars.length > 0 ? (
                          platformChars.map((c, idx) => (
                            <div key={idx} className="novo-produto-characteristics-item">
                              <span>{c.name}</span>
                              <span>{c.quantity}</span>
                            </div>
                          ))
                        ) : (
                          <div className="novo-produto-characteristics-item empty">
                            <span>Nenhuma característica</span>
                            <span>-</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
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