import React, { createContext, useContext, useState, useEffect } from 'react';

// Criar o contexto de acessibilidade
const AccessibilityContext = createContext();

// Hook personalizado para usar o contexto
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de um AccessibilityProvider');
  }
  return context;
};

// Configurações padrão de acessibilidade
const DEFAULT_SETTINGS = {
  fontSize: 'normal', // 'small', 'normal', 'large', 'extra-large'
  fontWeight: 'normal', // 'normal', 'bold'
  highContrast: false,
  reducedMotion: false
};

// Mapeamento de tamanhos de fonte
const FONT_SIZE_MAP = {
  small: '0.875rem',
  normal: '1rem',
  large: '1.125rem',
  'extra-large': '1.25rem'
};

// Provider do contexto de acessibilidade
export const AccessibilityProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Tentar carregar configurações do localStorage
    try {
      const saved = localStorage.getItem('accessibility-settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Salvar configurações no localStorage sempre que mudarem
  useEffect(() => {
    try {
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    } catch (error) {
      console.warn('Não foi possível salvar configurações de acessibilidade:', error);
    }
  }, [settings]);

  // Aplicar configurações ao documento
  useEffect(() => {
    const root = document.documentElement;
    
    // Aplicar tamanho da fonte
    root.style.setProperty('--accessibility-font-size', FONT_SIZE_MAP[settings.fontSize]);
    
    // Aplicar peso da fonte
    root.style.setProperty('--accessibility-font-weight', settings.fontWeight);
    
    // Aplicar classes CSS para outras configurações
    root.classList.toggle('accessibility-high-contrast', settings.highContrast);
    root.classList.toggle('accessibility-reduced-motion', settings.reducedMotion);
    
    // Aplicar classe para tamanho da fonte
    root.classList.remove('font-small', 'font-normal', 'font-large', 'font-extra-large');
    root.classList.add(`font-${settings.fontSize}`);
    
    // Aplicar classe para peso da fonte
    root.classList.toggle('font-bold', settings.fontWeight === 'bold');
    
  }, [settings]);

  // Função para aumentar tamanho da fonte
  const increaseFontSize = () => {
    const sizes = ['small', 'normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    const nextIndex = Math.min(currentIndex + 1, sizes.length - 1);
    
    setSettings(prev => ({
      ...prev,
      fontSize: sizes[nextIndex]
    }));
  };

  // Função para diminuir tamanho da fonte
  const decreaseFontSize = () => {
    const sizes = ['small', 'normal', 'large', 'extra-large'];
    const currentIndex = sizes.indexOf(settings.fontSize);
    const nextIndex = Math.max(currentIndex - 1, 0);
    
    setSettings(prev => ({
      ...prev,
      fontSize: sizes[nextIndex]
    }));
  };

  // Função para alternar peso da fonte
  const toggleFontWeight = () => {
    setSettings(prev => ({
      ...prev,
      fontWeight: prev.fontWeight === 'normal' ? 'bold' : 'normal'
    }));
  };

  // Função para alternar alto contraste
  const toggleHighContrast = () => {
    setSettings(prev => ({
      ...prev,
      highContrast: !prev.highContrast
    }));
  };

  // Função para alternar movimento reduzido
  const toggleReducedMotion = () => {
    setSettings(prev => ({
      ...prev,
      reducedMotion: !prev.reducedMotion
    }));
  };

  // Função para resetar configurações
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Função para obter o rótulo do tamanho da fonte atual
  const getFontSizeLabel = () => {
    const labels = {
      small: 'Pequeno',
      normal: 'Normal',
      large: 'Grande',
      'extra-large': 'Extra Grande'
    };
    return labels[settings.fontSize];
  };

  const value = {
    settings,
    increaseFontSize,
    decreaseFontSize,
    toggleFontWeight,
    toggleHighContrast,
    toggleReducedMotion,
    resetSettings,
    getFontSizeLabel,
    // Verificações de estado
    canIncreaseFontSize: settings.fontSize !== 'extra-large',
    canDecreaseFontSize: settings.fontSize !== 'small',
    isFontBold: settings.fontWeight === 'bold',
    isHighContrast: settings.highContrast,
    isReducedMotion: settings.reducedMotion
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
