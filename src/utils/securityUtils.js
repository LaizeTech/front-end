// src/utils/securityUtils.js
import { logAction, logException } from './logUtils.js';

export function checkPermission(user, action) {
  if (!user?.roles || !user.roles.includes(action)) {
    logAction(`Tentativa de acesso negada`, { user: user?.name || 'Desconhecido', action });
    throw new Error('Permissão negada');
  }
  return true;
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>$'"`]/g, '');
}

export function validateQuantity(qtd) {
  if (typeof qtd !== 'number' || qtd < 0) {
    logException('Quantidade inválida', { qtd });
    throw new Error('Quantidade inválida');
  }
  return true;
}
