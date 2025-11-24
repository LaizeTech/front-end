import React, { useState } from 'react';
import './NovaPlataformaModal.css';
import { X } from 'lucide-react';

const NovaPlataformaModal = ({ isOpen, onClose, onSave }) => {
    const [nomePlataforma, setNomePlataforma] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nomePlataforma.trim()) {
            setError('O nome da plataforma é obrigatório');
            return;
        }
        try {
            const response = await fetch('http://localhost:8080/plataforma', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nomePlataforma: nomePlataforma, status: true }),
            });
            if (!response.ok) {
                throw new Error('Erro ao criar plataforma');
            }
            const data = await response.json();
            onSave(data);
            onClose();
            setNomePlataforma('');
            setError('');
        } catch (error) {
            setError('Erro ao criar plataforma. Por favor, tente novamente.');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Nova Plataforma</h2>
                    <button className="close-button" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nomePlataforma">Nome da Plataforma</label>
                        <input
                            type="text"
                            id="nomePlataforma"
                            value={nomePlataforma}
                            onChange={(e) => setNomePlataforma(e.target.value)}
                            placeholder="Digite o nome da plataforma"
                        />
                        {error && <div className="error-message">{error}</div>}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="save-button">
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NovaPlataformaModal;