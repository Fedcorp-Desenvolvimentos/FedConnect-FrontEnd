// src/pages/Financeiro/Santander/SantanderModal.jsx
import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { S } from './SantanderWorkspaceModalStyles';

const SantanderModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  mode = 'create', 
  initialData = null,
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    type: 'BILLING',
    description: '',
    covenants: [{ code: '' }],
    webhookURL: '',
    bankSlipBillingWebhookActive: true,
    pixBillingWebhookActive: true,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && mode === 'edit' && initialData) {
      setFormData({
        type: initialData.type || 'BILLING',
        description: initialData.description || '',
        covenants: initialData.covenants || [{ code: '' }],
        webhookURL: initialData.webhookURL || '',
        bankSlipBillingWebhookActive: initialData.bankSlipBillingWebhookActive !== undefined 
          ? initialData.bankSlipBillingWebhookActive 
          : true,
        pixBillingWebhookActive: initialData.pixBillingWebhookActive !== undefined
          ? initialData.pixBillingWebhookActive
          : true,
      });
    } else if (isOpen && mode === 'create') {
      setFormData({
        type: 'BILLING',
        description: '',
        covenants: [{ code: '' }],
        webhookURL: '',
        bankSlipBillingWebhookActive: true,
        pixBillingWebhookActive: true,
      });
    }
    setErrors({});
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCovenantChange = (index, value) => {
    const newCovenants = [...formData.covenants];
    newCovenants[index] = { code: value };
    setFormData(prev => ({ ...prev, covenants: newCovenants }));
  };

  const handleAddCovenant = () => {
    setFormData(prev => ({
      ...prev,
      covenants: [...prev.covenants, { code: '' }]
    }));
  };

  const handleRemoveCovenant = (index) => {
    if (formData.covenants.length <= 1) return;
    const newCovenants = formData.covenants.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, covenants: newCovenants }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (formData.covenants.some(c => !c.code.trim())) {
      newErrors.covenants = 'Todos os códigos de convênio são obrigatórios';
    }
    
    if (formData.webhookURL && !formData.webhookURL.startsWith('https://')) {
      newErrors.webhookURL = 'Webhook URL deve começar com https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    const submitData = {
      ...formData,
      covenants: formData.covenants.filter(c => c.code.trim()),
    };
    
    if (mode === 'edit' && initialData) {
      onSubmit(initialData.id, submitData);
    } else {
      onSubmit(submitData);
    }
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Title>
            {mode === 'create' ? 'Novo Workspace' : 'Editar Workspace'}
          </S.Title>
          <S.CloseButton onClick={onClose}>
            <FiX size={20} />
          </S.CloseButton>
        </S.Header>

        <S.Body>
          <form onSubmit={handleSubmit}>
            <S.FieldGroup>
              <S.Label>
                Tipo *
                <S.Select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option value="BILLING">BILLING</option>
                  <option value="PAYMENT">PAYMENT</option>
                </S.Select>
              </S.Label>

              <S.Label>
                Descrição *
                <S.Input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Ex: Workspace de Cobrança"
                  $error={!!errors.description}
                />
                {errors.description && (
                  <S.ErrorText>{errors.description}</S.ErrorText>
                )}
              </S.Label>

              <S.Label>
                Convênios *
                {formData.covenants.map((covenant, index) => (
                  <S.CovenantRow key={index} $error={!!errors.covenants}>
                    <S.Input
                      type="text"
                      value={covenant.code}
                      onChange={(e) => handleCovenantChange(index, e.target.value)}
                      placeholder="Código do convênio"
                      $error={!!errors.covenants}
                    />
                    <S.CovenantActions>
                      {formData.covenants.length > 1 && (
                        <S.RemoveCovenantButton
                          type="button"
                          onClick={() => handleRemoveCovenant(index)}
                        >
                          <FiX size={16} />
                        </S.RemoveCovenantButton>
                      )}
                      {index === formData.covenants.length - 1 && (
                        <S.AddCovenantButton
                          type="button"
                          onClick={handleAddCovenant}
                        >
                          +
                        </S.AddCovenantButton>
                      )}
                    </S.CovenantActions>
                  </S.CovenantRow>
                ))}
                {errors.covenants && (
                  <S.ErrorText>{errors.covenants}</S.ErrorText>
                )}
              </S.Label>

              <S.Label>
                Webhook URL
                <S.Input
                  type="url"
                  value={formData.webhookURL}
                  onChange={(e) => handleChange('webhookURL', e.target.value)}
                  placeholder="https://fedcorp-pay.com.br/api/santander/empresa/webhook/"
                  $error={!!errors.webhookURL}
                />
                {errors.webhookURL && (
                  <S.ErrorText>{errors.webhookURL}</S.ErrorText>
                )}
              </S.Label>

              <S.CheckboxGroup>
                <S.CheckboxLabel>
                  <S.Checkbox
                    type="checkbox"
                    checked={formData.bankSlipBillingWebhookActive}
                    onChange={(e) => handleChange('bankSlipBillingWebhookActive', e.target.checked)}
                  />
                  Webhook de Boleto Ativo
                </S.CheckboxLabel>
                <S.CheckboxLabel>
                  <S.Checkbox
                    type="checkbox"
                    checked={formData.pixBillingWebhookActive}
                    onChange={(e) => handleChange('pixBillingWebhookActive', e.target.checked)}
                  />
                  Webhook de PIX Ativo
                </S.CheckboxLabel>
              </S.CheckboxGroup>
            </S.FieldGroup>

            <S.Footer>
              <S.CancelButton type="button" onClick={onClose}>
                Cancelar
              </S.CancelButton>
              <S.SubmitButton type="submit" disabled={loading}>
                {loading ? (
                  <>Carregando...</>
                ) : (
                  <>
                    <FiCheck />
                    {mode === 'create' ? 'Criar' : 'Atualizar'}
                  </>
                )}
              </S.SubmitButton>
            </S.Footer>
          </form>
        </S.Body>
      </S.Modal>
    </S.Overlay>
  );
};

export default SantanderModal;