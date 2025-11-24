import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { getUserId, hasFinancialAccess, isUserActive, getCompanyId } from './utils/sessionUtils';
import './Configuracoes.css';

const Configuracoes = () => {
  const userId = getUserId(); // Pegar ID do usuário do sessionStorage
  const acessoFinanceiro = hasFinancialAccess();
  const statusAtivo = isUserActive();
  const idEmpresa = getCompanyId();
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

  // Estado para mensagens de feedback
  const [message, setMessage] = useState({ text: '', type: '', show: false });

  // Função para mostrar mensagem
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type, show: true });
    setTimeout(() => {
      setMessage({ text: '', type: '', show: false });
    }, 5000);
  };

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
    if (userId) {
      buscarDadosUsuario(userId);
    }
  }, [userId]);

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
    const url = `http://localhost:8080/usuarios/${userId}/alterar-senha`;
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          novaSenha: profileData.password,
          confirmacaoSenha: profileData.confirmPassword
        })
      });
      
      console.log('Resposta da API (alterar senha):', response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Erro na resposta:', errorText);
        throw new Error('Network response was not ok');
      }
      
      const responseText = await response.text();
      console.log('Dados da resposta (alterar senha):', responseText);
      
      console.log('Senha atualizada com sucesso usando PATCH:', { senha: profileData.password });
      return { success: true, method: 'PATCH', fields: ['senha'] };
      
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, error };
    }
  };

  // Função para atualizar apenas o email
  const atualizarEmail = async () => {
    const url = `http://localhost:8080/usuarios/${userId}/alterar-email`;
    
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          novoEmail: profileData.email
        })
      });
      
      console.log('Resposta da API (alterar email):', response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Erro na resposta:', errorText);
        throw new Error('Network response was not ok');
      }
      
      const responseText = await response.text();
      console.log('Dados da resposta (alterar email):', responseText);
      
      console.log('Email atualizado com sucesso usando PATCH:', { email: profileData.email });
      return { success: true, method: 'PATCH', fields: ['email'] };
      
    } catch (error) {
      console.error('Error updating email:', error);
      return { success: false, error };
    }
  };

  // Função para atualizar email e senha
  const atualizarEmailSenha = async () => {
    const url_email = `http://localhost:8080/usuarios/${userId}/alterar-email`;
    const url_senha = `http://localhost:8080/usuarios/${userId}/alterar-senha`;

    try {
      // Primeiro fetch - atualizar email
      const emailResponse = await fetch(url_email, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          novoEmail: profileData.email
        })
      });
      
      if (!emailResponse.ok) {
        const errorText = await emailResponse.text();
        console.log('Erro ao atualizar email:', errorText);
        throw new Error('Erro ao atualizar email');
      }
      
      const emailResponseText = await emailResponse.text();
      console.log('Email atualizado com sucesso:', emailResponseText);

      // Segundo fetch - atualizar senha
      const senhaResponse = await fetch(url_senha, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          novaSenha: profileData.password,
          confirmacaoSenha: profileData.confirmPassword
        })
      });
      
      if (!senhaResponse.ok) {
        const errorText = await senhaResponse.text();
        console.log('Erro ao atualizar senha:', errorText);
        throw new Error('Erro ao atualizar senha');
      }
      
      const senhaResponseText = await senhaResponse.text();
      console.log('Senha atualizada com sucesso:', senhaResponseText);
      
      console.log('Email e senha atualizados com sucesso usando PATCH:', { 
        email: profileData.email, 
        senha: profileData.password 
      });
      return { success: true, method: 'PATCH', fields: ['email', 'senha'] };
      
    } catch (error) {
      console.error('Error updating email and password:', error);
      return { success: false, error };
    }
  };

  // Função para atualizar todos os dados do usuário
  const atualizarUsuario = async () => {
    const url = `http://localhost:8080/usuarios/${userId}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: profileData.name,
          email: profileData.email,
          senha: profileData.password,
          acessoFinanceiro: acessoFinanceiro,
          statusAtivo: statusAtivo,
          idEmpresa: idEmpresa,
        })
      });
      
      console.log('Resposta da API (atualizar usuário):', response);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Erro na resposta:', errorText);
        throw new Error('Network response was not ok');
      }
      
      const responseText = await response.text();
      console.log('Dados da resposta (atualizar usuário):', responseText);
      
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
      return { func: atualizarEmailSenha, description: 'Atualizando email e senha (PATCH)' };
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
    
    // Validação do nome
    if (profileData.name && profileData.name.trim().length < 2) {
      showMessage('O nome deve ter pelo menos 2 caracteres.', 'error');
      return;
    }

    // Verifica se o nome foi alterado e se todos os campos estão preenchidos
    if (isFieldChanged('name')) {
      if (!profileData.email || !profileData.password) {
        showMessage('Para alterar o nome, é necessário preencher todos os campos (nome, email e senha).', 'error');
        return;
      }
    }
    
    // Se a senha foi alterada, precisa ter no mínimo 8 caracteres
    if (senhaFoiAlterada && profileData.password.length < 8) {
      console.error('A senha deve ter no mínimo 8 caracteres');
      showMessage('A senha deve ter no mínimo 8 caracteres.', 'error');
      return;
    }
    
    // Se a senha foi alterada, precisa confirmar a senha
    if (senhaFoiAlterada && profileData.password !== profileData.confirmPassword) {
      console.error('As senhas não coincidem');
      showMessage('As senhas não coincidem. Por favor, verifique e tente novamente.', 'error');
      return;
    }
    
    // Obtém os campos alterados
    const changes = getChangedFields();
    
    if (Object.keys(changes).length === 0) {
      console.log('Nenhuma alteração detectada');
      showMessage('Nenhuma alteração foi detectada.', 'warning');
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
      
      // Feedback de sucesso baseado no que foi alterado
      const changedFields = Object.keys(changes);
      let successMessage = 'Perfil atualizado com sucesso!';
      
      if (changedFields.length === 1) {
        if (changedFields.includes('senha')) {
          successMessage = 'Senha alterada com sucesso!';
        } else if (changedFields.includes('email')) {
          successMessage = 'Email alterado com sucesso!';
        } else if (changedFields.includes('nome')) {
          successMessage = 'Nome alterado com sucesso!';
        }
      } else {
        successMessage = `${changedFields.length} campos atualizados com sucesso!`;
      }
      
      showMessage(successMessage, 'success');
      
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
      
      // Mensagem de erro mais específica
      const changedFields = Object.keys(changes);
      let errorMessage = 'Erro ao atualizar perfil. Tente novamente.';
      
      if (changedFields.length === 1) {
        if (changedFields.includes('nome')) {
          errorMessage = 'Erro ao alterar o nome. Verifique se o nome é válido e tente novamente.';
        } else if (changedFields.includes('email')) {
          errorMessage = 'Erro ao alterar o email. Verifique se o email é válido e não está em uso.';
        } else if (changedFields.includes('senha')) {
          errorMessage = 'Erro ao alterar a senha. Verifique se a senha atende aos requisitos.';
        }
      } else {
        errorMessage = 'Erro ao atualizar os dados. Verifique as informações e tente novamente.';
      }
      
      showMessage(errorMessage, 'error');
    }
  };

  // Verificar se há usuário logado
  if (!userId) {
    return (
      <div className="configuracoes">
        <div className="page-header">
          <h1 className="page-title">Configurações de conta</h1>
        </div>
        <div className="error-container">
          <p>Erro: Usuário não encontrado. Faça login novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="configuracoes">
      <div className="page-header">
        <h1 className="page-title">Configurações de conta</h1>
      </div>

      {/* Mensagem de feedback */}
      {message.show && (
        <div className={`message-container ${message.type}`}>
          <div className="message-content">
            <span className="message-text">{message.text}</span>
            <button 
              className="message-close"
              onClick={() => setMessage({ text: '', type: '', show: false })}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="config-content">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-content">
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
                        {showPassword ? <EyeOff style={{ width: 'clamp(14px, 1.6vw, 18px)', height: 'clamp(14px, 1.6vw, 18px)' }} /> : <Eye style={{ width: 'clamp(14px, 1.6vw, 18px)', height: 'clamp(14px, 1.6vw, 18px)' }} />}
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
                        {showConfirmPassword ? <EyeOff style={{ width: 'clamp(14px, 1.6vw, 18px)', height: 'clamp(14px, 1.6vw, 18px)' }} /> : <Eye style={{ width: 'clamp(14px, 1.6vw, 18px)', height: 'clamp(14px, 1.6vw, 18px)' }} />}
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
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;