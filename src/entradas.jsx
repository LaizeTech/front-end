import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './entradas.css';

const Entradas = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const entries = [
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
      setSelectedItems(entries.map(entry => entry.id));
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
    <div className="entradas">
      <div className="page-header">
        <h1 className="page-title">Entradas do Estoque</h1>
      </div>

      <div className="table-container">
        <div className="table-wrapper">
          <table className="entries-table">
            <thead>
              <tr>
                <th className="checkbox-column">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedItems.length === entries.length}
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
              {entries.map((entry) => (
                <tr key={entry.id} className="table-row">
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(entry.id)}
                      onChange={() => handleSelectItem(entry.id)}
                      className="table-checkbox"
                    />
                  </td>
                  <td className="product-name">{entry.productName}</td>
                  <td className="quantity">{entry.quantity}</td>
                  <td>
                    <span className={`platform-badge ${getPlatformColor(entry.platform)}`}>
                      {entry.platform}
                    </span>
                  </td>
                  <td className="date">{entry.date}</td>
                  <td>
                    <span className={`status-badge ${entry.statusColor}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="price">{entry.price}</td>
                  <td className="supplier">{entry.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Entradas;

