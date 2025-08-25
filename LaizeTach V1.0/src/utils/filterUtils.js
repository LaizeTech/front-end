//função para filtrar produtos por categoria
function filterByCategory(products, categoryId) {
    return products.filter(product => product.categoryId === categoryId);
}

//função para filtrar produtos por status
function filterByStatus(products, status) {
    return products.filter(product => product.status === status);
}

//função para filtrar vendas por plataforma
function filterByPlatform(sales, platformId) {
    return sales.filter(sale => sale.platformId === platformId);
}

//função para filtrar vendas por período
function filterByDateRange(sales, startDate, endDate) {
    return sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= startDate && saleDate <= endDate;
    });
}

//função para buscar produtos por nome
function searchByName(products, searchTerm) {
    return products.filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
}

//função para filtrar produtos com estoque baixo
function filterLowStock(products, threshold) {
    return products.filter(product => product.stock < threshold);
}

//função para filtrar vendas com status PENDENTE
function filterPendingSales(sales) {
    return sales.filter(sale => sale.status === "PENDENTE");
}