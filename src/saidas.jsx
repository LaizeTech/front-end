import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import './saidas.css';

const Saidas = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const exits = [
    {
      id: 1,
      productName: 'Nome do produto',
      quantity: 15,
      platform: 'Shoope',
      date: '22/06/2025',
      status: 'ATIVO',
      statusColor: 'green',
      price: 'R$ 15,00',
      supplier: 'Arrow'
    },
    {
      id: 2,
      productName: 'Nome do produto',
      quantity: 24,
      platform: 'NuvemShop',
      date: '22/06/2025',
      status: 'ATIVO',
      statusColor: 'green',
      price: 'R$ 15,00',
      supplier: 'Future'
    },
    {
      id: 3,
      productName: 'Nome do produto',
      quantity: 33,
      platform: 'NuvemShop',
      date: '22/06/2025',
      status: 'DESATIVO',
      statusColor: 'red',
      price: 'R$ 15,00',
      supplier: 'Future'
    },
    {
      id: 4,
      productName: 'Nome do produto',
      quantity: 10,
      platform: 'NuvemShop',
      date: '22/06/2025',
      status: 'ATIVO',
      statusColor: 'green',
      price: 'R$ 15,00',
      supplier: 'Arrow'
    },
    {
      id: 5,
      productName: 'Nome do produto',
      quantity: 5,
      platform: 'Shoope',
      date: '22/06/2025',
      status: 'DESATIVO',
      statusColor: 'red',
      price: 'R$ 15,00',
      supplier: 'Future'
    },
    {
      id: 6,
      productName: 'Nome do produto',
      quantity: 15,
      platform: 'Shoope',
      date: '22/06/2025',
      status: 'DESATIVO',
      statusColor: 'red',
      price: 'R$ 15,00',
      supplier: 'Arrow'
    },
    {
      id: 7,
      productName: 'Nome do produto',
      quantity: 15,
      platform: 'NuvemShop',
      date: '22/06/2025',
      status: 'DESATIVO',
      statusColor: 'red',
      price: 'R$ 15,00',
      supplier: 'Arrow'
    },
    {
      id: 8,
      productName: 'Nome do produto',
      quantity: 50,
      platform: 'Shoope',
      date: '22/06/2025',
      status: 'DESATIVO',
      statusColor: 'red',
      price: 'R$ 15,00',
      supplier: 'Arrow'
    },
    {
      id: 9,
      productName: 'Nome do produto',
      quantity: 12,
      platform: 'Shoope',
      date: '23/06/2025',
      status: 'ATIVO',
      statusColor: 'green',
      price: 'R$ 15,00',
      supplier: 'Future'
    },
    {
      id: 10,
      productName: 'Nome do produto',
      quantity: 15,
      platform: 'Shoope',
      date: '22/06/2025',
      status: 'ATIVO',
      statusColor: 'green',
      price: 'R$ 15,00',
      supplier: 'Future'
    },
    {
      id: 11,
      productName: 'Nome do produto',
      quantity: 8,
      platform: 'Shoope',
      date: '22/06/2025',
      status: 'ATIVO',
      statusColor: 'green',
      price: 'R$ 15,00',
      supplier: 'Arrow'
    },
    {
      id: 12,
      productName: 'Nome do produto',
      quantity: 80,
      platform: 'NuvemShop',
      date: '22/06/2025',
      status: 'ATIVO',
      statusColor: 'green',
      price: 'R$ 15,00',
      supplier: 'Arrow'
    },
    {
      id: 13,
      productName: 'Nome do produto',
      quantity: 20,
      platform: 'NuvemShop',
      date: '22/06/2025',
      status: 'DESATIVO',
      statusColor: 'red',
      price: 'R$ 15,00',
      supplier: 'Future'
    }
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(exits.map(exit => exit.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Shoope':
        return 'orange';
      case 'NuvemShop':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <div className="saidas">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Saídas do Estoque</h1>
        </div>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="exits-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedItems.length === exits.length}
                    className="table-checkbox"
                  />
                </th>
                <th className="sortable-header">
                  Nome do produto
                  <ChevronDown size={16} className="sort-icon" />
                </th>
                <th>Quantidade</th>
                <th>Plataforma</th>
                <th>Data</th>
                <th>Status do produto</th>
                <th>Preço</th>
                <th>Fornecedor</th>
              </tr>
            </thead>
            <tbody>
              {exits.map((exit) => (
                <tr key={exit.id} className="table-row">
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(exit.id)}
                      onChange={() => handleSelectItem(exit.id)}
                      className="table-checkbox"
                    />
                  </td>
                  <td className="product-name">{exit.productName}</td>
                  <td className="quantity">{exit.quantity}</td>
                  <td>
                    <span className={`platform-badge ${getPlatformColor(exit.platform)}`}>
                      {exit.platform}
                    </span>
                  </td>
                  <td className="date">{exit.date}</td>
                  <td>
                    <span className={`status-badge ${exit.statusColor}`}>
                      {exit.status}
                    </span>
                  </td>
                  <td className="price">{exit.price}</td>
                  <td className="supplier">{exit.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Saidas;

