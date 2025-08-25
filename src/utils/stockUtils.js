// src/utils/stockUtils.js
import { logAction, logException } from './logUtils.js';
import { checkPermission, sanitizeInput, validateQuantity } from './securityUtils.js';

let stock = []; // Estoque interno

export function addProduct(user, product) {
  try {
    checkPermission(user, 'ADD_PRODUCT');

    const name = sanitizeInput(product.name);
    validateQuantity(product.quantity);

    const existing = stock.find(p => p.name === name);
    if (existing) {
      existing.quantity += product.quantity;
      logAction('Produto atualizado', { user: user.name, product: existing });
    } else {
      stock.push({ name, quantity: product.quantity });
      logAction('Produto adicionado', { user: user.name, product: { name, quantity: product.quantity } });
    }
  } catch (err) {
    logException('Falha ao adicionar produto', { error: err.message });
  }
}

export function removeProduct(user, productName, quantity) {
  try {
    checkPermission(user, 'REMOVE_PRODUCT');

    const name = sanitizeInput(productName);
    validateQuantity(quantity);

    const product = stock.find(p => p.name === name);
    if (!product) throw new Error('Produto não encontrado');

    if (product.quantity < quantity) throw new Error('Quantidade insuficiente');

    product.quantity -= quantity;
    logAction('Produto removido', { user: user.name, product: { name, quantity } });

    if (product.quantity === 0) {
      stock = stock.filter(p => p.name !== name);
      logAction('Produto esgotado e removido do estoque', { user: user.name, product: { name } });
    }
  } catch (err) {
    logException('Falha ao remover produto', { error: err.message });
  }
}

export function viewStock() {
  return [...stock];
}
