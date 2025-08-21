// utils/logUtils.js

// Função para registrar ações no sistema
function logAction(usuario, acao, detalhes = {}) {
  const log = {
    usuario,
    acao,
    detalhes,
    timestamp: new Date().toISOString()
  };

  console.log(`[LOG]`, log);
  return log;
}

// Gera um relatório simples de alterações no estoque
function generateChangeReport(produto, qtdAntiga, qtdNova) {
  const diferenca = qtdNova - qtdAntiga;

  return {
    produto,
    qtdAntiga,
    qtdNova,
    diferenca,
    alteracao: diferenca > 0 ? "entrada" : "saída",
    timestamp: new Date().toISOString()
  };
}

// Exemplo: salvar log em um array (poderia ser banco depois)
const logs = [];

function saveLog(log) {
  logs.push(log);
}

function getLogs() {
  return logs;
}

module.exports = {
  logAction,
  generateChangeReport,
  saveLog,
  getLogs
};
