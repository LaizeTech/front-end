//função para exportar lista de produtos/vendas
function exportToCSV(data, fileName) {
    const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//função para exportar relatórios financeiros ou de estoque
function exportToXLSX(data, fileName) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, fileName);
}

//função para exportar relatórios financeiros ou de estoque
function exportToPDF(data, fileName) {
    const doc = new jsPDF();
    doc.text("Relatório", 10, 10);
    doc.autoTable({ html: '#my-table' });
    doc.save(fileName);
}

//função genérica para baixar arquivos
function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//função para exportar relatório específico de estoque
function exportStockReport(products) {
    const data = products.map(product => ({
        Nome: product.name,
        Categoria: product.category,
        Preço: product.price,
        Estoque: product.stock
    }));
    exportToXLSX(data, "relatorio_estoque.xlsx");
}

//função para exportar relatório de vendas por período
function exportSalesReport(sales, period) {
    const data = sales.map(sale => ({
        Data: new Date(sale.date).toLocaleDateString(),
        Produto: sale.product,
        Quantidade: sale.quantity,
        Total: sale.total
    }));
    exportToXLSX(data, `relatorio_vendas_${period}.xlsx`);
}