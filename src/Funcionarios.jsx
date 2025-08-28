import React, { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import './Funcionarios.css';

const Funcionarios = () => {
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const employees = [
    {
      id: 1,
      name: 'Letícia Andrade',
      role: 'Vendedora',
      status: 'ATIVO',
      statusColor: 'green'
    },
    {
      id: 2,
      name: 'Eduardo Venturi',
      role: 'Vendedor',
      status: 'DESATIVO',
      statusColor: 'red'
    },
    {
      id: 3,
      name: 'Eduardo Venturi',
      role: 'Vendedor',
      status: 'ATIVO',
      statusColor: 'green'
    },
    {
      id: 4,
      name: 'Eduardo Venturi',
      role: 'Vendedor',
      status: 'ATIVO',
      statusColor: 'green'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="funcionarios">
      <div className="page-header">
        <h1 className="page-title">Gestão de funcionários</h1>
      </div>

      <div className="funcionarios-content">
        {/* Registration Form */}
        <div className="form-section">
          <h2 className="section-title">Cadastro de funcionário</h2>
          
          <form onSubmit={handleSubmit} className="employee-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Nome</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Insira seu nome aqui"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf" className="form-label">CPF</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="xxx.xxx.xx"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="exemplo@outlook.com"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Nova senha</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Insira sua nova senha"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmar senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirme sua nova senha"
                className="form-input"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Cadastrar
            </button>
          </form>
        </div>

        {/* Employees List */}
        <div className="employees-section">
          <h2 className="section-title">Funcionários cadastrados</h2>
          
          <div className="employees-list">
            {employees.map((employee) => (
              <div key={employee.id} className="employee-card">
                <div className="employee-avatar">
                  <div className="avatar-circle">
                    {employee.name.charAt(0)}
                  </div>
                </div>
                
                <div className="employee-info">
                  <h3 className="employee-name">{employee.name}</h3>
                  <p className="employee-role">{employee.role}</p>
                </div>
                
                <div className="employee-status">
                  <span className={`status-badge ${employee.statusColor}`}>
                    {employee.status}
                  </span>
                </div>
                
                <div className="employee-actions">
                  <button className="action-btn">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

<script>



</script>

export default Funcionarios;

