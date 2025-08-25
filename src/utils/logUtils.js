// src/utils/logUtils.js
export function logAction(message, details = {}) {
  console.log(`[ACTION] ${new Date().toISOString()} - ${message}`, details);
}

export function logException(message, details = {}) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, details);
}

export function viewLogs(logsArray) {
  console.table(logsArray);
}
export function clearLogs() {
  console.clear();
}
