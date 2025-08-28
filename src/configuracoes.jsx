import React, { useState } from 'react';
import { Camera, X, AlertTriangle, CheckCircle } from 'lucide-react';
import './Configuracoes.css';

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    cpf: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
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
              <div className="photo-section">
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
              </div>

              {/* Profile Form */}
              <div className="form-section">
                <h3 className="section-subtitle">Detalhes</h3>
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Nome</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleInputChange}
                        placeholder="Insira seu nome aqui"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cpf" className="form-label">CPF</label>
                      <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        value={profileData.cpf}
                        onChange={handleInputChange}
                        placeholder="xxx.xxx.xx"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      placeholder="exemplo@outlook.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="password" className="form-label">Nova senha</label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={profileData.password}
                        onChange={handleInputChange}
                        placeholder="Insira sua nova senha"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword" className="form-label">Confirmar senha</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirme sua nova senha"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <button type="submit" className="save-btn">
                    Salvar
                  </button>
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

