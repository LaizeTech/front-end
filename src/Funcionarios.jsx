import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getCompanyId } from './utils/sessionUtils';
import EmployeeCard from './components/EmployeeCard';
import EditEmployeeModal from './components/EditEmployeeModal';
import './Funcionarios.css';

const Funcionarios = () => {
  const id_empresa = getCompanyId(); // Pegar ID da empresa do sessionStorage

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
  const [message, setMessage] = useState({ text: '', type: '' }); // success, error, warning

  // Função para buscar funcionários
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const response = await fetch(`${API_URL}/usuarios/buscar-funcionarios/${id_empresa}`, {
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
        statusColor: employee.statusAtivo ? 'green' : 'red',
        isActive: employee.statusAtivo
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
    if (id_empresa) {
      fetchEmployees();
    }
  }, [id_empresa]);

  // Função para mostrar mensagens
  const showMessage = (text, type = 'info') => {
    setMessage({ text, type });
    // Auto-ocultar mensagem após 5 segundos
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

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
    
    // Validações de campos obrigatórios
    if (!formData.name.trim()) {
      showMessage('Por favor, preencha o nome do funcionário', 'error');
      return;
    }
    
    if (!formData.email.trim()) {
      showMessage('Por favor, preencha o email do funcionário', 'error');
      return;
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showMessage('Por favor, insira um email válido com @', 'error');
      return;
    }
    
    if (!formData.password) {
      showMessage('Por favor, preencha a senha', 'error');
      return;
    }
    
    // Validação de senhas
    if (formData.password !== formData.confirmPassword) {
      showMessage('As senhas não coincidem!', 'error');
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
      showMessage('Funcionário cadastrado com sucesso!', 'success');
      
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
      showMessage('Erro ao cadastrar funcionário. Tente novamente.', 'error');
    }
  };

  const handleEditEmployee = (employee) => {
    console.log('Funcionário selecionado para edição:', employee);
    setSelectedEmployee(employee);
    setEditModalOpen(true);
  };

  // Função para alterar status do funcionário
  const changeEmployeeStatus = async (employeeId) => {
    try {
      const response = await fetch(`http://localhost:8080/usuarios/mudar-status/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      // Sempre retornar como texto já que o endpoint só retorna texto
      return await response.text();
    } catch (error) {
      console.error('Erro ao alterar status do funcionário:', error);
      throw error;
    }
  };

  const handleDeleteEmployee = (employee) => {
    if (window.confirm(`Tem certeza que deseja desativar o funcionário ${employee.name}?`)) {
      handleChangeStatus(employee);
    }
  };

  const handleActivateEmployee = (employee) => {
    if (window.confirm(`Tem certeza que deseja ativar o funcionário ${employee.name}?`)) {
      handleChangeStatus(employee);
    }
  };

  const handleChangeStatus = async (employee) => {
    try {
      await changeEmployeeStatus(employee.id);
      
      const newStatus = employee.status === 'ATIVO' ? 'desativado' : 'ativado';
      showMessage(`Funcionário ${newStatus} com sucesso!`, 'success');
      
      // Recarregar lista de funcionários
      await fetchEmployees();
    } catch (error) {
      showMessage('Erro ao alterar status do funcionário. Tente novamente.', 'error');
    }
  };

  const handleSaveEmployee = async (updatedEmployee) => {
    try {
      console.log('Funcionário atualizado:', updatedEmployee);
      
      // Recarregar lista de funcionários após atualização bem-sucedida
      await fetchEmployees();
      
      showMessage('Funcionário atualizado com sucesso!', 'success');
      
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      showMessage('Erro ao atualizar funcionário. Tente novamente.', 'error');
      throw error;
    }
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedEmployee(null);
  };

  // Verificar se há empresa válida
  if (!id_empresa) {
    return (
      <div className="funcionarios">
        <div className="page-header">
          <h1 className="page-title">Gestão de funcionários</h1>
        </div>
        <div className="error-message">
          <p>Erro: Empresa não encontrada. Faça login novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="funcionarios">
      <div className="page-header">
        <h1 className="page-title">Gestão de funcionários</h1>
      </div>

      {/* Mensagem de feedback */}
      {message.text && (
        <div className={`message-alert ${message.type}`}>
          <p>{message.text}</p>
          <button 
            className="message-close" 
            onClick={() => setMessage({ text: '', type: '' })}
          >
            ×
          </button>
        </div>
      )}

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
                type="text"
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
                  {showPassword ? <EyeOff style={{ width: 'clamp(16px, 1.8vw, 22px)', height: 'clamp(16px, 1.8vw, 22px)' }} /> : <Eye style={{ width: 'clamp(16px, 1.8vw, 22px)', height: 'clamp(16px, 1.8vw, 22px)' }} />}
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
                  {showConfirmPassword ? <EyeOff style={{ width: 'clamp(16px, 1.8vw, 22px)', height: 'clamp(16px, 1.8vw, 22px)' }} /> : <Eye style={{ width: 'clamp(16px, 1.8vw, 22px)', height: 'clamp(16px, 1.8vw, 22px)' }} />}
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
                  onActivateClick={handleActivateEmployee}
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

