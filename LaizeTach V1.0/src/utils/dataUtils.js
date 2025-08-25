//função para formatar para yyyy-MM-dd (MySQL)
function formatDateToMySQL(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

//função para formatar para yyyy-MM-dd HH:mm:ss
function formatDateTimeToMySQL(date) {
    const datePart = formatDateToMySQL(date);
    const timePart = String(date.getHours()).padStart(2, '0') + ':' +
                    String(date.getMinutes()).padStart(2, '0') + ':' +
                    String(date.getSeconds()).padStart(2, '0');
    return `${datePart} ${timePart}`;
}

//função para converter 2025-08-24 em Date
function convertToDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}

//função para verificar se a venda é de hoje
function isToday(date) {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
}

//função para calcular prazo médio de estoque
function daysBetween(date1, date2) {
    const timeDiff = Math.abs(date2 - date1);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

//função para obter relatório o início do mês
function getStartOfMonth(date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    return start;
}

//função para obter relatório o fim do mês
function getEndOfMonth(date) {
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return end;
}

//funções para obter dashboards de vendas por dia
function groupByDay(sales) {
    return sales.reduce((acc, sale) => {
        const date = formatDateToMySQL(new Date(sale.date));
        acc[date] = (acc[date] || 0) + sale.amount;
        return acc;
    }, {});
}

//funções para obter dashboards de vendas por mês
function groupByMonth(sales) {
    return sales.reduce((acc, sale) => {
        const month = formatDateToMySQL(new Date(sale.date)).slice(0, 7);
        acc[month] = (acc[month] || 0) + sale.amount;
        return acc;
    }, {});
}

//função para verificar validade de produtos
function isExpired(date) {
    const today = new Date();
    return date < today;
}

//função para verificar se o produto está próximo da data de validade
function isNearExpiration(date, days) {
    const today = new Date();
    const timeDiff = date - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysDiff <= days;
}

//função para obter o tempo relativo - mensagens tipo “há 3 dias”
function getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    const intervals = [
        { label: "ano", seconds: 31536000 },
        { label: "mês", seconds: 2592000 },
        { label: "semana", seconds: 604800 },
        { label: "dia", seconds: 86400 },
        { label: "hora", seconds: 3600 },
        { label: "minuto", seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds);
        if (count > 0) {
            return `há ${count} ${interval.label}${count > 1 ? "s" : ""}`;
        }
    }

    return "agora";
}