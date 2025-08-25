//função para formatar valores monetários
function formatCurrency(value) {
    return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

//função para formatar porcentagens
function formatPercentage(value) {
    return `${value.toFixed(2)}%`;
}

//função para formatar números
function formatNumber(value, decimals) {
    return value.toLocaleString("pt-BR", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

//função para formatar datas no padrão brasileiro
function formatDateBR(date) {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

//função para formatar datas e horas no padrão brasileiro
function formatDateTimeBR(date) {
    const dateOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    const formattedDate = new Intl.DateTimeFormat('pt-BR', dateOptions).format(date);
    const formattedTime = new Intl.DateTimeFormat('pt-BR', timeOptions).format(date);
    return `${formattedDate} ${formattedTime}`;
}

//função para encurtar textos longos de produtos
function truncateText(text, length) {
    if (text.length > length) {
        return text.substring(0, length) + "...";
    }
    return text;
}

//função para formatar status
function formatStatus(status) {
    const statusMap = {
        "PENDENTE": "Pendente",
        "FINALIZADA": "Finalizada"
    };
    return statusMap[status] || status;
}

//função para formatar níveis de estoque
function formatStockLevel(qty, thresholds) {
    if (qty < thresholds.low) {
        return "verde";
    } else if (qty < thresholds.high) {
        return "amarelo";
    }
    return "vermelho";
}