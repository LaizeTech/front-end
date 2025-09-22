import React, { useState, useEffect } from 'react';
import { Camera, X, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import './Configuracoes.css';

const Configuracoes = () => {
  let id = 1; // Simulação de ID de usuário logado
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Estado para armazenar os dados originais
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Estado para controlar visibilidade das senhas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      message: 'Conta Atualizada! As configurações da conta foram alteradas',
      icon: CheckCircle
    },
    {
      id: 2,
      type: 'warning',
      message: 'Alerta O valor inserido não corresponde ao formato esperado',
      icon: AlertTriangle
    },
    {
      id: 3,
      type: 'error',
      message: 'Erro! Não foi possível salvar as configurações da conta',
      icon: X
    }
  ]);

  // Função para verificar se um campo foi alterado
  const isFieldChanged = (fieldName) => {
    switch (fieldName) {
      case 'name':
        return profileData.name !== originalData.name;
      case 'email':
        return profileData.email !== originalData.email;
      case 'password':
        return profileData.password && profileData.password !== originalData.password;
      default:
        return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      
      // Se a senha voltar ao valor original, limpa a confirmação
      if (name === 'password' && value === originalData.password) {
        newData.confirmPassword = '';
      }
      
      return newData;
    });
  };

  // Funções para alternar visibilidade das senhas
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const buscarDadosUsuario = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/usuarios/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      const userData = {
        name: data.nome || '',
        email: data.email || '',
        password: data.senha || ''
      };
      
      // Atualiza os dados do perfil
      setProfileData({
        ...userData,
        confirmPassword: ''
      });
      
      // Armazena os dados originais
      setOriginalData(userData);
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // useEffect para carregar os dados quando o componente montar
  useEffect(() => {
    buscarDadosUsuario(id);
  }, [id]);

  // Função para verificar quais campos foram alterados
  const getChangedFields = () => {
    const changes = {};
    
    if (profileData.name !== originalData.name) {
      changes.nome = profileData.name;
    }
    if (profileData.email !== originalData.email) {
      changes.email = profileData.email;
    }
    if (profileData.password && profileData.password !== originalData.password) {
      changes.senha = profileData.password;
    }
    
    return changes;
  };

  // Função para atualizar apenas a senha
  const atualizarSenha = async () => {
    const url = `http://localhost:8080/usuarios/${id}/alterar-senha`;
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senha: profileData.password
        })
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      console.log('Senha atualizada com sucesso usando PATCH:', { senha: profileData.password });
      return { success: true, method: 'PATCH', fields: ['senha'] };
      
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, error };
    }
  };

  // Função para atualizar apenas o email
  const atualizarEmail = async () => {
    const url = `http://localhost:8080/usuarios/${id}/alterar-email`;
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: profileData.email
        })
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      console.log('Email atualizado com sucesso usando PATCH:', { email: profileData.email });
      return { success: true, method: 'PATCH', fields: ['email'] };
      
    } catch (error) {
      console.error('Error updating email:', error);
      return { success: false, error };
    }
  };

  // Função para atualizar todos os dados do usuário
  const atualizarUsuario = async () => {
    const url = `http://localhost:8080/usuarios/${id}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: profileData.name,
          email: profileData.email,
          senha: profileData.password
        })
      });
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      console.log('Usuário atualizado completamente com sucesso usando PUT:', {
        nome: profileData.name,
        email: profileData.email,
        senha: profileData.password
      });
      return { success: true, method: 'PUT', fields: ['nome', 'email', 'senha'] };
      
    } catch (error) {
      console.error('Error updating user completely:', error);
      return { success: false, error };
    }
  };

  // Função para determinar qual função de atualização chamar
  const determinarTipoAtualizacao = () => {
    const changes = getChangedFields();
    const changedFields = Object.keys(changes);
    
    // Determina quais campos foram alterados
    const nomeChanged = changedFields.includes('nome');
    const emailChanged = changedFields.includes('email');
    const senhaChanged = changedFields.includes('senha');
    
    // Retorna a função apropriada baseada nos campos alterados
    if (nomeChanged && emailChanged && senhaChanged) {
      return { func: atualizarUsuario, description: 'Atualizando todos os dados (PUT)' };
    } else if (emailChanged && senhaChanged) {
      return { func: atualizarUsuario, description: 'Atualizando usuário completo (PUT)' };
    } else if (nomeChanged) {
      return { func: atualizarUsuario, description: 'Atualizando usuário completo (PUT)' };
    } else if (senhaChanged) {
      return { func: atualizarSenha, description: 'Atualizando apenas senha (PATCH)' };
    } else if (emailChanged) {
      return { func: atualizarEmail, description: 'Atualizando apenas email (PATCH)' };
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verifica se a senha foi alterada (diferente da original)
    const senhaFoiAlterada = profileData.password && profileData.password !== originalData.password;
    
    // Se a senha foi alterada, precisa ter no mínimo 8 caracteres
    if (senhaFoiAlterada && profileData.password.length < 8) {
      console.error('A senha deve ter no mínimo 8 caracteres');
      alert('A senha deve ter no mínimo 8 caracteres.');
      return;
    }
    
    // Se a senha foi alterada, precisa confirmar a senha
    if (senhaFoiAlterada && profileData.password !== profileData.confirmPassword) {
      console.error('As senhas não coincidem');
      alert('As senhas não coincidem. Por favor, verifique e tente novamente.');
      return;
    }
    
    // Obtém os campos alterados
    const changes = getChangedFields();
    
    if (Object.keys(changes).length === 0) {
      console.log('Nenhuma alteração detectada');
      alert('Nenhuma alteração foi detectada.');
      return;
    }
    
    console.log('Campos alterados:', changes);
    
    // Determina qual função de atualização usar
    const updateStrategy = determinarTipoAtualizacao();
    
    if (!updateStrategy) {
      // console.error('Erro: não foi possível determinar o tipo de atualização');
      return;
    }
    
    console.log(updateStrategy.description);
    
    // Executa a atualização apropriada
    const result = await updateStrategy.func();
    
    if (result.success) {
      console.log(`Perfil atualizado com sucesso!`)
      
      // Atualiza os dados originais após sucesso
      setOriginalData({
        name: profileData.name,
        email: profileData.email,
        password: profileData.password
      });
      
      // Limpa o campo de confirmação de senha
      setProfileData(prev => ({
        ...prev,
        confirmPassword: ''
      }));
      
      } else {
      console.error('Erro ao atualizar perfil:', result.error);
      alert('Erro ao atualizar perfil. Tente novamente.');
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <div className="configuracoes">
      <div className="page-header">
        <h1 className="page-title">Configurações de conta</h1>
      </div>

      <div className="config-content">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="section-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Edit Profile
            </button>
            <button 
              className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
          </div>

          {activeTab === 'profile' && (
            <div className="profile-content">
              {/* Photo Upload Section */}
              {/* <div className="photo-section">
                <h3 className="section-subtitle">Editar foto</h3>
                <div className="photo-upload">
                  <div className="photo-placeholder">
                    <Camera size={24} className="camera-icon" />
                  </div>
                  <div className="upload-actions">
                    <button className="upload-btn">Subir foto</button>
                    <button className="remove-btn">remover</button>
                  </div>
                </div>
                <div className="photo-requirements">
                  <p className="requirement-title">Requisitos:</p>
                  <ul className="requirements-list">
                    <li>1. Min. 400 x 400px</li>
                    <li>2. Max. 2MB</li>
                  </ul>
                </div>
              </div> */}

              {/* Profile Form */}
              <div className="form-section">
                <h3 className="section-subtitle">Detalhes</h3>
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Nome {isFieldChanged('name') && <span style={{color: '#e91e63'}}>●</span>}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        placeholder="Insira seu nome aqui"
                        className={`form-input ${isFieldChanged('name') ? 'changed' : ''}`}
                        title={originalData.name ? `Valor original: ${originalData.name}` : ''}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email {isFieldChanged('email') && <span style={{color: '#e91e63'}}>●</span>}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      placeholder="exemplo@outlook.com"
                      className={`form-input ${isFieldChanged('email') ? 'changed' : ''}`}
                      title={originalData.email ? `Valor original: ${originalData.email}` : ''}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="password" className="form-label">
                        Nova senha {isFieldChanged('password') && <span style={{color: '#e91e63'}}>●</span>}
                      </label>
                      <div className="password-input-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={profileData.password}
                          onChange={handleInputChange}
                          placeholder="Insira sua nova senha"
                          className={`form-input ${isFieldChanged('password') ? 'changed' : ''}`}
                          title={originalData.password ? 'Senha atual definida (oculta por segurança)' : ''}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={togglePasswordVisibility}
                          title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirmar senha 
                        {isFieldChanged('password') && <span style={{color: '#e91e63'}}> *</span>}
                        {!isFieldChanged('password') && <span style={{color: '#666', fontSize: '0.8em'}}> (opcional)</span>}
                      </label>
                      <div className="password-input-wrapper">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={profileData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder={isFieldChanged('password') ? "Confirme sua nova senha" : "Obrigatório caso alterar"}
                          className="form-input"
                          disabled={!isFieldChanged('password')}
                        />
                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={toggleConfirmPasswordVisibility}
                          title={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="save-btn">
                    Salvar
                  </button>
                  
                  {/* Resumo das alterações */}
                  {Object.keys(getChangedFields()).length > 0 && (
                    <div className="changes-summary">
                      <h4>Alterações detectadas:</h4>
                      <ul>
                        {Object.entries(getChangedFields()).map(([key, value]) => (
                          <li key={key}>
                            <strong>{key === 'nome' ? 'Nome' : key === 'email' ? 'Email' : 'Senha'}:</strong> 
                            {key === 'senha' ? ' ••••••••' : ` ${value}`}
                          </li>
                        ))}
                      </ul>
                      <p className="update-method">
                        {(() => {
                          // const strategy =
                          determinarTipoAtualizacao();
                          // return strategy ? `� ${strategy.description}` : '❌ Erro na determinação da estratégia';
                        })()}
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="notifications-content">
              <h3 className="section-subtitle">Notificações do Sistema</h3>
              <div className="notifications-list">
                {notifications.map((notification) => {
                  const IconComponent = notification.icon;
                  return (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${getNotificationClass(notification.type)}`}
                    >
                      <div className="notification-content">
                        <IconComponent size={20} className="notification-icon" />
                        <span className="notification-message">{notification.message}</span>
                      </div>
                      <button 
                        className="notification-close"
                        onClick={() => removeNotification(notification.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;

