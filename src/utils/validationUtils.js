// src/utils/validationUtils.js

// Validar SKU (ex.: ABC-1234)
export function isValidSKU(sku) {
  const regex = /^[A-Z0-9]{3,}-[0-9]{3,}$/;
  return regex.test(sku);
}

// Verifica se é número positivo
export function isPositiveNumber(valor) {
  return typeof valor === 'number' && valor >= 0;
}

// Verifica se string não é vazia
export function isNonEmptyString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

// Validar e-mail simples
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validar CNPJ (apenas formato básico, sem cálculo de dígito)
export function isValidCNPJ(cnpj) {
  const regex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return regex.test(cnpj);
}
// Validar CPF (apenas formato básico, sem cálculo de dígito)
export function isValidCPF(cpf) {
  const regex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return regex.test(cpf);
}
// Validar telefone (ex.: (11) 91234-5678)
export function isValidPhone(phone) {
  const regex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
  return regex.test(phone);
}
// Validar data (formato YYYY-MM-DD)
export function isValidDate(dateStr) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !isNaN(date);
}
// Validar URL simples
export function isValidURL(url) {
  try {
    new URL(url);
    return true;d
  } catch {
    return false;
  }
}

// Validar código postal (CEP) brasileiro (ex.: 12345-678)
export function isValidCEP(cep) {
  const regex = /^\d{5}-\d{3}$/;
  return regex.test(cep);
}
