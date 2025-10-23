import React from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

/**
 * Wrapper que aplica as configurações de acessibilidade a componentes filhos
 * Usado para garantir que as configurações sejam aplicadas corretamente
 */
const AccessibilityWrapper = ({ children, className = '' }) => {
  const { settings } = useAccessibility();
  
  // Construir classes CSS baseadas nas configurações
  const accessibilityClasses = [
    `font-${settings.fontSize}`,
    settings.fontWeight === 'bold' ? 'font-bold' : '',
    settings.highContrast ? 'accessibility-high-contrast' : '',
    settings.reducedMotion ? 'accessibility-reduced-motion' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={accessibilityClasses}>
      {children}
    </div>
  );
};

export default AccessibilityWrapper;
