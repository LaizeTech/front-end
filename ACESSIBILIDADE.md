# Guia de Acessibilidade - LaizeTech

## Visão Geral

Este projeto implementa funcionalidades de acessibilidade abrangentes para garantir que todos os usuários possam utilizar o sistema LaizeTech de forma eficaz, independentemente de suas necessidades específicas.

## Funcionalidades Implementadas

### 1. Controles de Tamanho de Texto
- **Quatro níveis de tamanho**: Pequeno, Normal, Grande, Extra Grande
- **Ajuste dinâmico**: Os usuários podem aumentar ou diminuir o tamanho do texto em tempo real
- **Persistência**: As configurações são salvas no localStorage e mantidas entre sessões

### 2. Controle de Peso da Fonte
- **Alternância entre normal e negrito**: Botão para tornar todo o texto em negrito
- **Melhora a legibilidade**: Especialmente útil para usuários com dificuldades visuais

### 3. Alto Contraste
- **Modo de alto contraste**: Aumenta o contraste entre texto e fundo
- **Cores otimizadas**: Utiliza combinações de cores que atendem aos padrões WCAG

### 4. Movimento Reduzido
- **Desabilita animações**: Para usuários sensíveis a movimento
- **Melhora a experiência**: Reduz distrações e possíveis desconfortos

## Como Usar

### Acessando os Controles
1. Procure pelo botão "♿ Acessibilidade" no canto inferior direito da tela
2. Clique no botão para abrir o painel de controles
3. Ajuste as configurações conforme suas necessidades

### Controles Disponíveis

#### Tamanho do Texto
- **A-**: Diminui o tamanho do texto
- **A+**: Aumenta o tamanho do texto
- **Indicador**: Mostra o tamanho atual (Pequeno, Normal, Grande, Extra Grande)

#### Peso do Texto
- **B**: Alterna entre texto normal e negrito
- **Estado visual**: O botão fica destacado quando o negrito está ativo

#### Alto Contraste
- **◐**: Ativa/desativa o modo de alto contraste
- **Efeito global**: Aplica-se a toda a interface

#### Restaurar Padrão
- **Botão "Restaurar Padrão"**: Volta todas as configurações ao estado inicial

## Implementação Técnica

### Estrutura dos Componentes

```
src/
├── contexts/
│   └── AccessibilityContext.jsx    # Contexto global de acessibilidade
├── components/
│   ├── AccessibilityControls.jsx   # Controles de acessibilidade
│   ├── AccessibilityControls.css   # Estilos dos controles
│   └── AccessibilityWrapper.jsx    # Wrapper para aplicar configurações
├── accessibility.css               # CSS global de acessibilidade
└── App.jsx                        # Provider integrado
```

### Contexto de Acessibilidade
O `AccessibilityContext` gerencia:
- Estado das configurações de acessibilidade
- Persistência no localStorage
- Aplicação das configurações ao DOM
- Funções para modificar configurações

### CSS Global
O arquivo `accessibility.css` contém:
- Variáveis CSS para configurações dinâmicas
- Classes para diferentes tamanhos de fonte
- Estilos para alto contraste
- Ajustes responsivos
- Melhorias específicas para componentes do projeto

## Padrões de Acessibilidade Seguidos

### WCAG 2.1 Guidelines
- **Nível AA**: Contraste de cores adequado
- **Navegação por teclado**: Todos os controles são acessíveis via teclado
- **Rótulos ARIA**: Elementos possuem rótulos descritivos
- **Estados visuais**: Indicação clara de estados ativos/inativos

### Boas Práticas
- **Foco visível**: Outline claro em elementos focados
- **Tamanhos mínimos**: Botões com pelo menos 44px de altura
- **Texto alternativo**: Ícones possuem descrições
- **Feedback visual**: Mudanças de estado são visualmente indicadas

## Personalização

### Adicionando Novos Controles
Para adicionar novos controles de acessibilidade:

1. **Atualize o contexto**:
```jsx
// Em AccessibilityContext.jsx
const DEFAULT_SETTINGS = {
  // ... configurações existentes
  novaConfiguracao: false
};
```

2. **Adicione a função de controle**:
```jsx
const toggleNovaConfiguracao = () => {
  setSettings(prev => ({
    ...prev,
    novaConfiguracao: !prev.novaConfiguracao
  }));
};
```

3. **Atualize o componente de controles**:
```jsx
// Em AccessibilityControls.jsx
<button
  className={`control-button toggle-button ${novaConfiguracao ? 'active' : ''}`}
  onClick={toggleNovaConfiguracao}
>
  Novo Controle
</button>
```

### Customizando Estilos
Para personalizar os estilos de acessibilidade:

1. **Modifique as variáveis CSS**:
```css
:root {
  --accessibility-font-size: 1rem;
  --accessibility-font-weight: normal;
  /* Adicione novas variáveis */
}
```

2. **Adicione novas classes**:
```css
.nova-configuracao * {
  /* Seus estilos aqui */
}
```

## Testes de Acessibilidade

### Testes Manuais
1. **Navegação por teclado**: Tab através de todos os controles
2. **Leitores de tela**: Teste com NVDA, JAWS ou VoiceOver
3. **Diferentes tamanhos**: Verifique em vários tamanhos de fonte
4. **Alto contraste**: Teste a legibilidade em modo de alto contraste

### Ferramentas Recomendadas
- **axe DevTools**: Extensão do navegador para auditoria
- **WAVE**: Ferramenta de avaliação de acessibilidade web
- **Lighthouse**: Auditoria de acessibilidade integrada ao Chrome

## Suporte e Manutenção

### Problemas Conhecidos
- Alguns gráficos podem não escalar perfeitamente com fontes grandes
- Elementos de terceiros podem não seguir as configurações

### Melhorias Futuras
- Suporte a temas de cores personalizados
- Controles de espaçamento entre linhas
- Modo de leitura simplificada
- Integração com tecnologias assistivas

## Contribuição

Para contribuir com melhorias de acessibilidade:

1. Teste com usuários reais que possuem necessidades específicas
2. Siga as diretrizes WCAG 2.1
3. Documente todas as mudanças
4. Teste em múltiplos navegadores e dispositivos

## Recursos Adicionais

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
