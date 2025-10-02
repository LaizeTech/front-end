import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import './EditEmployeeModal.css';

const EditEmployeeModal = ({ employee, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    status: 'ATIVO'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingEmployeeData, setLoadingEmployeeData] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [originalEmployeeData, setOriginalEmployeeData] = useState(null);

  // Função para atualizar funcionário na API
  const updateEmployee = async (employeeId, employeeData) => {
    try {
      const response = await fetch(`http://localhost:8080/usuarios/${employeeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData)
      });

      if (!response.ok) {
        // Tentar ler a mensagem de erro do backend
        let errorMessage = `Erro HTTP: ${response.status}`;
        try {
          const errorData = await response.text();
          errorMessage += ` - ${errorData}`;
        } catch (e) {
          // Se não conseguir ler a resposta, usar mensagem padrão
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Função para buscar dados completos do funcionário
  const fetchEmployeeDetails = async (employeeId) => {
    try {
      setLoadingEmployeeData(true);
      const response = await fetch(`http://localhost:8080/usuarios/${employeeId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const employeeData = await response.json();
      
      // Armazenar dados originais para o PUT
      setOriginalEmployeeData(employeeData);
      
      // Preencher formulário com dados completos da API
      setFormData({
        name: employeeData.nome || '',
        email: employeeData.email || '',
        password: '', // Deixar vazio conforme solicitado
        confirmPassword: '',
        role: employee.role || 'Funcionário', // Manter valor do card já que não vem da API
        status: employeeData.statusAtivo ? 'ATIVO' : 'DESATIVO'
      });
    } catch (error) {
      // Se falhar, usar dados básicos disponíveis e criar estrutura original básica
      const basicEmployeeData = {
        nome: employee.name || '',
        email: employee.email || '',
        statusAtivo: employee.status === 'ATIVO',
        acessoFinanceiro: false, // Valor padrão
        idEmpresa: 1 // TODO: Pegar do session storage
      };
      setOriginalEmployeeData(basicEmployeeData);
      
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        password: '',
        confirmPassword: '',
        role: employee.role || 'Funcionário',
        status: employee.status || 'ATIVO'
      });
    } finally {
      setLoadingEmployeeData(false);
    }
  };

  // Preencher o formulário quando o modal abrir com um funcionário
  useEffect(() => {
    if (employee && isOpen) {
      if (employee.id) {
        // Buscar dados completos se temos o ID
        fetchEmployeeDetails(employee.id);
      } else {
        // Usar dados básicos se não temos ID
        const basicEmployeeData = {
          nome: employee.name || '',
          email: employee.email || '',
          statusAtivo: employee.status === 'ATIVO',
          acessoFinanceiro: false, // Valor padrão
          idEmpresa: 1 // TODO: Pegar do session storage
        };
        setOriginalEmployeeData(basicEmployeeData);
        
        setFormData({
          name: employee.name || '',
          email: employee.email || '',
          password: '',
          confirmPassword: '',
          role: employee.role || 'Funcionário',
          status: employee.status || 'ATIVO'
        });
      }
    }
  }, [employee, isOpen]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar se temos o ID do funcionário
    if (!employee || !employee.id) {
      showMessage('Erro: ID do funcionário não encontrado!', 'error');
      return;
    }
    
    // Validações
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
      showMessage('Por favor, insira um email válido', 'error');
      return;
    }
    
    // Validação de senha obrigatória
    if (!formData.password.trim()) {
      showMessage('Por favor, preencha a nova senha', 'error');
      return;
    }
    
    if (!formData.confirmPassword.trim()) {
      showMessage('Por favor, confirme a nova senha', 'error');
      return;
    }
    
    // Validação de senhas coincidem
    if (formData.password !== formData.confirmPassword) {
      showMessage('As senhas não coincidem!', 'error');
      return;
    }

    // Preparar dados para envio no formato da API com todos os campos do DTO
    const updatedData = {
      nome: formData.name.trim(),
      email: formData.email.trim(),
      acessoFinanceiro: originalEmployeeData?.acessoFinanceiro !== undefined ? originalEmployeeData.acessoFinanceiro : false,
      statusAtivo: originalEmployeeData?.statusAtivo !== undefined ? originalEmployeeData.statusAtivo : true,
      idEmpresa: originalEmployeeData?.idEmpresa || 1 // TODO: Pegar do session storage
    };

    // Incluir senha (agora obrigatória)
    updatedData.senha = formData.password.trim();

    try {
      setSubmitting(true);
      
      const result = await updateEmployee(employee.id, updatedData);
      
      showMessage('Funcionário atualizado com sucesso!', 'success');
      
      // Aguardar um pouco para mostrar a mensagem antes de fechar
      setTimeout(() => {
        handleClose();
        // Chamar callback para atualizar a lista no componente pai
        if (onSave) {
          onSave({
            ...employee, // Manter dados originais
            nome: updatedData.nome,
            email: updatedData.email,
            name: updatedData.nome // Para compatibilidade com o formato do card
          });
        }
      }, 1500);
      
    } catch (error) {
      // Mostrar mensagem de erro mais específica
      let errorMessage = 'Erro ao atualizar funcionário. ';
      if (error.message.includes('400')) {
        errorMessage += 'Dados inválidos - verifique os campos preenchidos.';
      } else if (error.message.includes('404')) {
        errorMessage += 'Funcionário não encontrado.';
      } else if (error.message.includes('500')) {
        errorMessage += 'Erro interno do servidor.';
      } else {
        errorMessage += 'Tente novamente.';
      }
      
      showMessage(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      status: 'ATIVO'
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setMessage({ text: '', type: '' });
    setSubmitting(false);
    setOriginalEmployeeData(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Editar funcionário</h2>
          <button className="close-btn" onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {loadingEmployeeData ? (
          <div className="modal-loading">
            <p>Carregando dados do funcionário...</p>
          </div>
        ) : (
          <>
            {/* Mensagem de feedback */}
            {message.text && (
              <div className={`modal-message ${message.type}`}>
                <p>{message.text}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="edit-name" className="form-label">Nome</label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Insira o nome aqui"
                className="form-input"
                required
              />
            </div>

          <div className="form-group">
            <label htmlFor="edit-email" className="form-label">Email</label>
            <input
              type="email"
              id="edit-email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="exemplo@outlook.com"
              className="form-input"
              required
            />
          </div>



          <div className="form-group">
            <label htmlFor="edit-password" className="form-label">Nova senha</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="edit-password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Digite a nova senha"
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
            <label htmlFor="edit-confirmPassword" className="form-label">Confirmar senha</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="edit-confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirme a nova senha"
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

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={handleClose} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="save-btn" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditEmployeeModal;