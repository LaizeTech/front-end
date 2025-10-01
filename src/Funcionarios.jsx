import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import EmployeeCard from './components/EmployeeCard';
import EditEmployeeModal from './components/EditEmployeeModal';
import './Funcionarios.css';

const Funcionarios = () => {
  const id_empresa = 1; //tenho que colocar session storage

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar funcionários
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8080/usuarios/buscar-funcionarios/${id_empresa}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      // Mapear os dados da API para o formato esperado pelos componentes
      const mappedEmployees = data.map(employee => ({
        id: employee.idUsuario,
        name: employee.nome,
        email: '', // não vem da API, será preenchido apenas no modal de edição
        role: 'Funcionário', // valor padrão já que não vem da API
        status: employee.statusAtivo ? 'ATIVO' : 'DESATIVO',
        statusColor: employee.statusAtivo ? 'green' : 'red'
      }));

      setEmployees(mappedEmployees);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      setError('Erro ao carregar funcionários. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar funcionários quando o componente montar
  useEffect(() => {
    fetchEmployees();
  }, [id_empresa]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createUser = async (userData) => {
    try {
      const response = await fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    // Preparar dados no formato solicitado
    const userData = {
      nome: formData.name,
      email: formData.email,
      senha: formData.password,
      acessoFinanceiro: false, // hard coded
      statusAtivo: 1, // hard coded
      idEmpresa: id_empresa // hard coded
    };

    try {
      const result = await createUser(userData);
      console.log('Usuário criado com sucesso:', result);
      alert('Funcionário cadastrado com sucesso!');
      
      // Limpar formulário após sucesso
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Reset password visibility
      setShowPassword(false);
      setShowConfirmPassword(false);

      // Recarregar lista de funcionários
      await fetchEmployees();
    } catch (error) {
      alert('Erro ao cadastrar funcionário. Tente novamente.');
    }
  };

  const handleEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  const handleDeleteEmployee = (employee) => {
    if (window.confirm(`Tem certeza que deseja excluir o funcionário ${employee.name}?`)) {
      console.log('Excluir funcionário:', employee);
      // Aqui você pode implementar a lógica de exclusão
      // Por exemplo: chamar API de delete
    }
  };

  const handleSaveEmployee = async (updatedEmployee) => {
    try {
      // Aqui você implementaria a chamada para a API de atualização
      console.log('Salvar funcionário atualizado:', updatedEmployee);
      
      // Exemplo de como seria a chamada para API:
      // const response = await updateEmployee(updatedEmployee);
      
      alert('Funcionário atualizado com sucesso!');
      // Aqui você atualizaria a lista de funcionários
      
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      alert('Erro ao atualizar funcionário. Tente novamente.');
      throw error;
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedEmployee(null);
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
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Insira sua nova senha"
                  className="form-input password-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirmar senha</label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirme sua nova senha"
                  className="form-input password-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Cadastrar
            </button>
          </form>
        </div>

        {/* Employees List */}
        <div className="employees-section">
          <div className="section-header">
            <h2 className="section-title">Funcionários cadastrados</h2>
            <button 
              onClick={fetchEmployees} 
              className="refresh-btn"
              disabled={loading}
            >
              {loading ? 'Carregando...' : 'Atualizar'}
            </button>
          </div>
          
          <div className="employees-list">
            {loading ? (
              <div className="loading-message">
                <p>Carregando funcionários...</p>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={fetchEmployees} className="retry-btn">
                  Tentar novamente
                </button>
              </div>
            ) : employees.length === 0 ? (
              <div className="empty-message">
                <p>Nenhum funcionário cadastrado ainda.</p>
              </div>
            ) : (
              employees.map((employee) => (
                <EmployeeCard 
                  key={employee.id} 
                  employee={employee} 
                  onEditClick={handleEditEmployee}
                  onDeleteClick={handleDeleteEmployee}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      <EditEmployeeModal
        employee={selectedEmployee}
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveEmployee}
      />
    </div>
  );
};

export default Funcionarios;

