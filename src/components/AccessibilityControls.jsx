import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import './AccessibilityControls.css';

const AccessibilityControls = ({ position = 'fixed' }) => {
  const {
    increaseFontSize,
    decreaseFontSize,
    toggleFontWeight,
    toggleHighContrast,
    resetSettings,
    getFontSizeLabel,
    canIncreaseFontSize,
    canDecreaseFontSize,
    isFontBold,
    isHighContrast
  } = useAccessibility();

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`accessibility-controls ${position}`} role="toolbar" aria-label="Controles de acessibilidade">
      <button
        className="accessibility-toggle"
        onClick={toggleExpanded}
        aria-expanded={isExpanded}
        aria-controls="accessibility-panel"
        title="Abrir controles de acessibilidade"
      >
        <span className="accessibility-icon">♿</span>
        <span className="accessibility-text">Acessibilidade</span>
      </button>

      <div 
        id="accessibility-panel"
        className={`accessibility-panel ${isExpanded ? 'expanded' : ''}`}
        aria-hidden={!isExpanded}
      >
        <div className="accessibility-header">
          <h3>Configurações de Acessibilidade</h3>
          <button
            className="close-button"
            onClick={toggleExpanded}
            aria-label="Fechar controles de acessibilidade"
          >
            ✕
          </button>
        </div>

        <div className="accessibility-controls-grid">
          {/* Controles de tamanho da fonte */}
          <div className="control-group">
            <label className="control-label">Tamanho do Texto</label>
            <div className="control-buttons">
              <button
                className="control-button"
                onClick={decreaseFontSize}
                disabled={!canDecreaseFontSize}
                title="Diminuir tamanho do texto"
                aria-label="Diminuir tamanho do texto"
              >
                A-
              </button>
              <span className="font-size-indicator" aria-live="polite">
                {getFontSizeLabel()}
              </span>
              <button
                className="control-button"
                onClick={increaseFontSize}
                disabled={!canIncreaseFontSize}
                title="Aumentar tamanho do texto"
                aria-label="Aumentar tamanho do texto"
              >
                A+
              </button>
            </div>
          </div>

          {/* Controle de peso da fonte */}
          <div className="control-group">
            <label className="control-label">Peso do Texto</label>
            <button
              className={`control-button toggle-button ${isFontBold ? 'active' : ''}`}
              onClick={toggleFontWeight}
              title={isFontBold ? 'Desativar texto em negrito' : 'Ativar texto em negrito'}
              aria-label={isFontBold ? 'Desativar texto em negrito' : 'Ativar texto em negrito'}
              aria-pressed={isFontBold}
            >
              <strong>B</strong>
            </button>
          </div>

          {/* Controle de alto contraste */}
          <div className="control-group">
            <label className="control-label">Alto Contraste</label>
            <button
              className={`control-button toggle-button ${isHighContrast ? 'active' : ''}`}
              onClick={toggleHighContrast}
              title={isHighContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
              aria-label={isHighContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
              aria-pressed={isHighContrast}
            >
              ◐
            </button>
          </div>

          {/* Botão de reset */}
          <div className="control-group full-width">
            <button
              className="control-button reset-button"
              onClick={resetSettings}
              title="Restaurar configurações padrão"
              aria-label="Restaurar configurações padrão de acessibilidade"
            >
              Restaurar Padrão
            </button>
          </div>
        </div>

        <div className="accessibility-info">
          <p>Use estes controles para personalizar a apresentação do conteúdo conforme suas necessidades.</p>
        </div>
      </div>
    </div>
  );
};

export default AccessibilityControls;
