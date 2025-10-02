// Funções utilitárias para gerenciar dados do sessionStorage

// Recuperar dados completos do usuário
export const getUser = () => {
  const userData = sessionStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

// Recuperar ID do usuário
export const getUserId = () => {
  return sessionStorage.getItem('userId');
};

// Recuperar nome do usuário
export const getUserName = () => {
  return sessionStorage.getItem('userName');
};

// Recuperar email do usuário
export const getUserEmail = () => {
  return sessionStorage.getItem('userEmail');
};

// Verificar se usuário tem acesso financeiro
export const hasFinancialAccess = () => {
  return sessionStorage.getItem('acessoFinanceiro') === 'true';
};

// Verificar se usuário está ativo
export const isUserActive = () => {
  return sessionStorage.getItem('statusAtivo') === 'true';
};

// Recuperar dados completos da empresa
export const getCompany = () => {
  const companyData = sessionStorage.getItem('empresa');
  return companyData ? JSON.parse(companyData) : null;
};

// Recuperar ID da empresa
export const getCompanyId = () => {
  return sessionStorage.getItem('empresaId');
};

// Recuperar nome da empresa
export const getCompanyName = () => {
  return sessionStorage.getItem('empresaNome');
};

// Recuperar CNPJ da empresa
export const getCompanyCnpj = () => {
  return sessionStorage.getItem('empresaCnpj');
};

// Verificar se usuário está logado
export const isLoggedIn = () => {
  return sessionStorage.getItem('user') !== null;
};

// Fazer logout (limpar sessionStorage)
export const logout = () => {
  sessionStorage.clear();
};

// Verificar se a sessão ainda é válida (você pode expandir esta função)
export const isSessionValid = () => {
  return isLoggedIn() && isUserActive();
};