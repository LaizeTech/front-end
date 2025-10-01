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

  // Preencher o formulário quando o modal abrir com um funcionário
  useEffect(() => {
    if (employee && isOpen) {
      setFormData({
        name: employee.name || '',
        email: employee.email || '',
        password: '',
        confirmPassword: '',
        role: employee.role || '',
        status: employee.status || 'ATIVO'
      });
    }
  }, [employee, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    // Preparar dados para envio
    const updatedData = {
      id: employee.id,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status
    };

    // Se a senha foi preenchida, incluí-la
    if (formData.password) {
      updatedData.password = formData.password;
    }

    try {
      await onSave(updatedData);
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar funcionário:', error);
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
            <label htmlFor="edit-role" className="form-label">Cargo</label>
            <select
              id="edit-role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="">Selecione um cargo</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Vendedora">Vendedora</option>
              <option value="Gerente">Gerente</option>
              <option value="Supervisor">Supervisor</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-status" className="form-label">Status</label>
            <select
              id="edit-status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="form-input"
              required
            >
              <option value="ATIVO">ATIVO</option>
              <option value="DESATIVO">DESATIVO</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="edit-password" className="form-label">Nova senha (opcional)</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="edit-password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Deixe em branco para manter a senha atual"
                className="form-input password-input"
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
            <label htmlFor="edit-confirmPassword" className="form-label">Confirmar nova senha</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="edit-confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirme a nova senha"
                className="form-input password-input"
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
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="save-btn">
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;