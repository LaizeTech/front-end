import React, { useState, useEffect, useRef } from 'react';
import { Edit2, Trash2, MoreHorizontal, UserCheck } from 'lucide-react';
import './EmployeeCard.css';

const EmployeeCard = ({ employee, onEditClick, onDeleteClick, onActivateClick }) => {
  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);

  const handleEditClick = () => {
    if (onEditClick) {
      onEditClick(employee);
    }
    setShowActions(false);
  };

  const handleDeleteClick = () => {
    if (onDeleteClick) {
      onDeleteClick(employee);
    }
    setShowActions(false);
  };

  const handleActivateClick = () => {
    if (onActivateClick) {
      onActivateClick(employee);
    }
    setShowActions(false);
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  return (
    <div className="employee-card">
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
        <div className="actions-container" ref={actionsRef}>
          <button 
            className="action-btn more-btn" 
            onClick={() => setShowActions(!showActions)}
          >
            <MoreHorizontal size={16} />
          </button>
          
          {showActions && (
            <div className="actions-dropdown">
              <button className="dropdown-action edit-action" onClick={handleEditClick}>
                <Edit2 size={14} />
                Editar
              </button>
              {employee.isActive ? (
                <button className="dropdown-action delete-action" onClick={handleDeleteClick}>
                  <Trash2 size={14} />
                  Desativar
                </button>
              ) : (
                <button className="dropdown-action activate-action" onClick={handleActivateClick}>
                  <UserCheck size={14} />
                  Ativar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;