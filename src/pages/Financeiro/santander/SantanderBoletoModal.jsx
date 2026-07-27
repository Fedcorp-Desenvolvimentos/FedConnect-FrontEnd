// src/pages/Financeiro/Santander/Boletos/SantanderBoletoModal.jsx
import React, { useState, useEffect } from 'react';
import { FiX, FiCheck, FiPlus, FiMinus, FiAlertCircle } from 'react-icons/fi';
import { S } from './SantanderBoletoModalStyles';
import { criarBoleto } from '../../../services/fedcorpPayService';
import { useSnackbar } from 'notistack';

const SantanderBoletoModal = ({ isOpen, onClose, companyId, onSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    environment: 'PRODUCAO',
    nsuCode: '',
    nsuDate: '',
    covenantCode: '',
    bankNumber: '',
    clientNumber: '',
    dueDate: '',
    issueDate: '',
    participantCode: '',
    nominalValue: '',
    payer: {
      name: '',
      documentType: 'CNPJ',
      documentNumber: '',
      address: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    },
    beneficiary: {
      name: '',
      documentType: 'CNPJ',
      documentNumber: ''
    },
    documentKind: 'DUPLICATA_MERCANTIL',
    discount: {
      type: 'VALOR_DATA_FIXA',
      discountOne: { value: '', limitDate: '' },
      discountTwo: { value: '', limitDate: '' },
      discountThree: { value: '', limitDate: '' }
    },
    finePercentage: '',
    fineQuantityDays: '',
    interestPercentage: '',
    deductionValue: '',
    protestType: 'SEM_PROTESTO',
    writeOffQuantityDays: '',
    paymentType: 'REGISTRO',
    parcelsQuantity: '',
    valueType: 'PERCENTUAL',
    minValueOrPercentage: '',
    maxValueOrPercentage: '',
    iofPercentage: '',
    sharing: [{ code: '', value: '' }],
    key: {
      type: 'CPF',
      dictKey: ''
    },
    txId: '',
    messages: ['']
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basico');

  useEffect(() => {
    if (isOpen) {
      // Resetar formulário ao abrir
      setFormData({
        environment: 'PRODUCAO',
        nsuCode: '',
        nsuDate: '',
        covenantCode: '',
        bankNumber: '',
        clientNumber: '',
        dueDate: '',
        issueDate: '',
        participantCode: '',
        nominalValue: '',
        payer: {
          name: '',
          documentType: 'CNPJ',
          documentNumber: '',
          address: '',
          neighborhood: '',
          city: '',
          state: '',
          zipCode: ''
        },
        beneficiary: {
          name: '',
          documentType: 'CNPJ',
          documentNumber: ''
        },
        documentKind: 'DUPLICATA_MERCANTIL',
        discount: {
          type: 'VALOR_DATA_FIXA',
          discountOne: { value: '', limitDate: '' },
          discountTwo: { value: '', limitDate: '' },
          discountThree: { value: '', limitDate: '' }
        },
        finePercentage: '',
        fineQuantityDays: '',
        interestPercentage: '',
        deductionValue: '',
        protestType: 'SEM_PROTESTO',
        writeOffQuantityDays: '',
        paymentType: 'REGISTRO',
        parcelsQuantity: '',
        valueType: 'PERCENTUAL',
        minValueOrPercentage: '',
        maxValueOrPercentage: '',
        iofPercentage: '',
        sharing: [{ code: '', value: '' }],
        key: {
          type: 'CPF',
          dictKey: ''
        },
        txId: '',
        messages: ['']
      });
      setErrors({});
      setActiveTab('basico');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (message, options = {}) => {
    enqueueSnackbar(message, {
      variant: options.variant || 'info',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      ...options,
    });
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePayerChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      payer: { ...prev.payer, [field]: value }
    }));
    if (errors[`payer.${field}`]) {
      setErrors(prev => ({ ...prev, [`payer.${field}`]: '' }));
    }
  };

  const handleBeneficiaryChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      beneficiary: { ...prev.beneficiary, [field]: value }
    }));
  };

  const handleDiscountChange = (index, field, value) => {
    const discountKey = index === 0 ? 'discountOne' : index === 1 ? 'discountTwo' : 'discountThree';
    setFormData(prev => ({
      ...prev,
      discount: {
        ...prev.discount,
        [discountKey]: { ...prev.discount[discountKey], [field]: value }
      }
    }));
  };

  const handleSharingChange = (index, field, value) => {
    const newSharing = [...formData.sharing];
    newSharing[index] = { ...newSharing[index], [field]: value };
    setFormData(prev => ({ ...prev, sharing: newSharing }));
  };

  const handleAddSharing = () => {
    setFormData(prev => ({
      ...prev,
      sharing: [...prev.sharing, { code: '', value: '' }]
    }));
  };

  const handleRemoveSharing = (index) => {
    if (formData.sharing.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      sharing: prev.sharing.filter((_, i) => i !== index)
    }));
  };

  const handleMessageChange = (index, value) => {
    const newMessages = [...formData.messages];
    newMessages[index] = value;
    setFormData(prev => ({ ...prev, messages: newMessages }));
  };

  const handleAddMessage = () => {
    setFormData(prev => ({
      ...prev,
      messages: [...prev.messages, '']
    }));
  };

  const handleRemoveMessage = (index) => {
    if (formData.messages.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      messages: prev.messages.filter((_, i) => i !== index)
    }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.covenantCode) {
      newErrors.covenantCode = 'Código do convênio é obrigatório';
    }
    if (!formData.bankNumber) {
      newErrors.bankNumber = 'Nosso número é obrigatório';
    }
    if (!formData.dueDate) {
      newErrors.dueDate = 'Data de vencimento é obrigatória';
    }
    if (!formData.nominalValue) {
      newErrors.nominalValue = 'Valor nominal é obrigatório';
    }
    if (!formData.payer.name) {
      newErrors['payer.name'] = 'Nome do pagador é obrigatório';
    }
    if (!formData.payer.documentNumber) {
      newErrors['payer.documentNumber'] = 'Documento do pagador é obrigatório';
    }
    if (!formData.beneficiary.name) {
      newErrors['beneficiary.name'] = 'Nome do beneficiário é obrigatório';
    }
    if (!formData.beneficiary.documentNumber) {
      newErrors['beneficiary.documentNumber'] = 'Documento do beneficiário é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      
      // Prepara os dados para envio
      const dataToSend = {
        ...formData,
        // Converte valores para números quando necessário
        nominalValue: parseFloat(formData.nominalValue),
        payer: {
          ...formData.payer,
          documentNumber: parseInt(formData.payer.documentNumber.replace(/\D/g, ''))
        },
        beneficiary: {
          ...formData.beneficiary,
          documentNumber: parseInt(formData.beneficiary.documentNumber.replace(/\D/g, ''))
        }
      };

      // Remove campos vazios
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === '' || dataToSend[key] === null) {
          delete dataToSend[key];
        }
      });

      // Limpa sharing vazios
      dataToSend.sharing = dataToSend.sharing.filter(s => s.code && s.value);

      // Limpa messages vazias
      dataToSend.messages = dataToSend.messages.filter(m => m.trim());

      const response = await criarBoleto(companyId, dataToSend);
      
      if (response.success) {
        showToast('Boleto criado com sucesso!', { variant: 'success' });
        onClose();
        if (onSuccess) onSuccess();
      } else {
        showToast('Erro ao criar boleto: ' + (response.detail || 'Erro desconhecido'), { variant: 'error' });
      }
    } catch (error) {
      console.error('Erro ao criar boleto:', error);
      showToast('Erro ao criar boleto: ' + error.message, { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Overlay onClick={onClose}>
      <S.Modal onClick={(e) => e.stopPropagation()}>
        <S.Header>
          <S.Title>
            <FiPlus />
            Criar Novo Boleto
          </S.Title>
          <S.CloseButton onClick={onClose}>
            <FiX size={20} />
          </S.CloseButton>
        </S.Header>

        <S.Body>
          <S.Tabs>
            <S.Tab 
              $active={activeTab === 'basico'} 
              onClick={() => setActiveTab('basico')}
            >
              Básico
            </S.Tab>
            <S.Tab 
              $active={activeTab === 'pagador'} 
              onClick={() => setActiveTab('pagador')}
            >
              Pagador
            </S.Tab>
            <S.Tab 
              $active={activeTab === 'beneficiario'} 
              onClick={() => setActiveTab('beneficiario')}
            >
              Beneficiário
            </S.Tab>
            <S.Tab 
              $active={activeTab === 'configuracoes'} 
              onClick={() => setActiveTab('configuracoes')}
            >
              Configurações
            </S.Tab>
          </S.Tabs>

          <form onSubmit={handleSubmit}>
            <S.TabContent>
              {activeTab === 'basico' && (
                <S.FieldGroup>
                  <S.FieldRow>
                    <S.Label>
                      Ambiente *
                      <S.Select
                        value={formData.environment}
                        onChange={(e) => handleChange('environment', e.target.value)}
                      >
                        <option value="PRODUCAO">Produção</option>
                        <option value="HOMOLOGACAO">Homologação</option>
                      </S.Select>
                    </S.Label>
                    <S.Label>
                      Código do Convênio *
                      <S.Input
                        type="text"
                        value={formData.covenantCode}
                        onChange={(e) => handleChange('covenantCode', e.target.value)}
                        placeholder="Ex: 002972930"
                        $error={!!errors.covenantCode}
                      />
                      {errors.covenantCode && <S.ErrorText>{errors.covenantCode}</S.ErrorText>}
                    </S.Label>
                  </S.FieldRow>

                  <S.FieldRow>
                    <S.Label>
                      Nosso Número *
                      <S.Input
                        type="text"
                        value={formData.bankNumber}
                        onChange={(e) => handleChange('bankNumber', e.target.value)}
                        placeholder="Ex: 000001571571"
                        $error={!!errors.bankNumber}
                      />
                      {errors.bankNumber && <S.ErrorText>{errors.bankNumber}</S.ErrorText>}
                    </S.Label>
                    <S.Label>
                      Seu Número
                      <S.Input
                        type="text"
                        value={formData.clientNumber}
                        onChange={(e) => handleChange('clientNumber', e.target.value)}
                        placeholder="Ex: 173173"
                      />
                    </S.Label>
                  </S.FieldRow>

                  <S.FieldRow>
                    <S.Label>
                      Data Vencimento *
                      <S.Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                        $error={!!errors.dueDate}
                      />
                      {errors.dueDate && <S.ErrorText>{errors.dueDate}</S.ErrorText>}
                    </S.Label>
                    <S.Label>
                      Data Emissão
                      <S.Input
                        type="date"
                        value={formData.issueDate}
                        onChange={(e) => handleChange('issueDate', e.target.value)}
                      />
                    </S.Label>
                  </S.FieldRow>

                  <S.FieldRow>
                    <S.Label>
                      Valor Nominal *
                      <S.Input
                        type="number"
                        step="0.01"
                        value={formData.nominalValue}
                        onChange={(e) => handleChange('nominalValue', e.target.value)}
                        placeholder="0,00"
                        $error={!!errors.nominalValue}
                      />
                      {errors.nominalValue && <S.ErrorText>{errors.nominalValue}</S.ErrorText>}
                    </S.Label>
                    <S.Label>
                      Tipo de Documento
                      <S.Select
                        value={formData.documentKind}
                        onChange={(e) => handleChange('documentKind', e.target.value)}
                      >
                        <option value="DUPLICATA_MERCANTIL">Duplicata Mercantil</option>
                        <option value="DUPLICATA_SERVICO">Duplicata de Serviço</option>
                        <option value="NOTA_PROMISSORIA">Nota Promissória</option>
                      </S.Select>
                    </S.Label>
                  </S.FieldRow>
                </S.FieldGroup>
              )}

              {activeTab === 'pagador' && (
                <S.FieldGroup>
                  <S.FieldRow>
                    <S.Label>
                      Nome *
                      <S.Input
                        type="text"
                        value={formData.payer.name}
                        onChange={(e) => handlePayerChange('name', e.target.value)}
                        placeholder="Nome do pagador"
                        $error={!!errors['payer.name']}
                      />
                      {errors['payer.name'] && <S.ErrorText>{errors['payer.name']}</S.ErrorText>}
                    </S.Label>
                    <S.Label>
                      Tipo Documento
                      <S.Select
                        value={formData.payer.documentType}
                        onChange={(e) => handlePayerChange('documentType', e.target.value)}
                      >
                        <option value="CNPJ">CNPJ</option>
                        <option value="CPF">CPF</option>
                      </S.Select>
                    </S.Label>
                  </S.FieldRow>

                  <S.Label>
                    Documento *
                    <S.Input
                      type="text"
                      value={formData.payer.documentNumber}
                      onChange={(e) => handlePayerChange('documentNumber', e.target.value)}
                      placeholder="Ex: 35315360000167"
                      $error={!!errors['payer.documentNumber']}
                    />
                    {errors['payer.documentNumber'] && <S.ErrorText>{errors['payer.documentNumber']}</S.ErrorText>}
                  </S.Label>

                  <S.Label>
                    Endereço
                    <S.Input
                      type="text"
                      value={formData.payer.address}
                      onChange={(e) => handlePayerChange('address', e.target.value)}
                      placeholder="Ex: Rua Exemplo, 123"
                    />
                  </S.Label>

                  <S.FieldRow>
                    <S.Label>
                      Bairro
                      <S.Input
                        type="text"
                        value={formData.payer.neighborhood}
                        onChange={(e) => handlePayerChange('neighborhood', e.target.value)}
                        placeholder="Bairro"
                      />
                    </S.Label>
                    <S.Label>
                      Cidade
                      <S.Input
                        type="text"
                        value={formData.payer.city}
                        onChange={(e) => handlePayerChange('city', e.target.value)}
                        placeholder="Cidade"
                      />
                    </S.Label>
                  </S.FieldRow>

                  <S.FieldRow>
                    <S.Label>
                      Estado
                      <S.Input
                        type="text"
                        value={formData.payer.state}
                        onChange={(e) => handlePayerChange('state', e.target.value)}
                        placeholder="UF"
                        maxLength={2}
                      />
                    </S.Label>
                    <S.Label>
                      CEP
                      <S.Input
                        type="text"
                        value={formData.payer.zipCode}
                        onChange={(e) => handlePayerChange('zipCode', e.target.value)}
                        placeholder="Ex: 20531-390"
                      />
                    </S.Label>
                  </S.FieldRow>
                </S.FieldGroup>
              )}

              {activeTab === 'beneficiario' && (
                <S.FieldGroup>
                  <S.FieldRow>
                    <S.Label>
                      Nome *
                      <S.Input
                        type="text"
                        value={formData.beneficiary.name}
                        onChange={(e) => handleBeneficiaryChange('name', e.target.value)}
                        placeholder="Nome do beneficiário"
                        $error={!!errors['beneficiary.name']}
                      />
                      {errors['beneficiary.name'] && <S.ErrorText>{errors['beneficiary.name']}</S.ErrorText>}
                    </S.Label>
                    <S.Label>
                      Tipo Documento
                      <S.Select
                        value={formData.beneficiary.documentType}
                        onChange={(e) => handleBeneficiaryChange('documentType', e.target.value)}
                      >
                        <option value="CNPJ">CNPJ</option>
                        <option value="CPF">CPF</option>
                      </S.Select>
                    </S.Label>
                  </S.FieldRow>

                  <S.Label>
                    Documento *
                    <S.Input
                      type="text"
                      value={formData.beneficiary.documentNumber}
                      onChange={(e) => handleBeneficiaryChange('documentNumber', e.target.value)}
                      placeholder="Ex: 35315360000167"
                      $error={!!errors['beneficiary.documentNumber']}
                    />
                    {errors['beneficiary.documentNumber'] && <S.ErrorText>{errors['beneficiary.documentNumber']}</S.ErrorText>}
                  </S.Label>
                </S.FieldGroup>
              )}

              {activeTab === 'configuracoes' && (
                <S.FieldGroup>
                  <S.SectionTitle>Multa e Juros</S.SectionTitle>
                  <S.FieldRow>
                    <S.Label>
                      Multa (%)
                      <S.Input
                        type="number"
                        step="0.01"
                        value={formData.finePercentage}
                        onChange={(e) => handleChange('finePercentage', e.target.value)}
                        placeholder="Ex: 2.00"
                      />
                    </S.Label>
                    <S.Label>
                      Dias para Multa
                      <S.Input
                        type="number"
                        value={formData.fineQuantityDays}
                        onChange={(e) => handleChange('fineQuantityDays', e.target.value)}
                        placeholder="Ex: 5"
                      />
                    </S.Label>
                  </S.FieldRow>

                  <S.Label>
                    Juros (%)
                    <S.Input
                      type="number"
                      step="0.01"
                      value={formData.interestPercentage}
                      onChange={(e) => handleChange('interestPercentage', e.target.value)}
                      placeholder="Ex: 1.00"
                    />
                  </S.Label>

                  <S.SectionTitle>Descontos</S.SectionTitle>
                  {['discountOne', 'discountTwo', 'discountThree'].map((key, index) => (
                    <S.DiscountRow key={key}>
                      <S.Label>
                        Desconto {index + 1}
                        <S.Input
                          type="number"
                          step="0.01"
                          value={formData.discount[key].value}
                          onChange={(e) => handleDiscountChange(index, 'value', e.target.value)}
                          placeholder="Valor"
                        />
                      </S.Label>
                      <S.Label>
                        Data Limite
                        <S.Input
                          type="date"
                          value={formData.discount[key].limitDate}
                          onChange={(e) => handleDiscountChange(index, 'limitDate', e.target.value)}
                        />
                      </S.Label>
                    </S.DiscountRow>
                  ))}

                  <S.SectionTitle>Compartilhamento</S.SectionTitle>
                  {formData.sharing.map((share, index) => (
                    <S.SharingRow key={index}>
                      <S.Label>
                        Código
                        <S.Input
                          type="text"
                          value={share.code}
                          onChange={(e) => handleSharingChange(index, 'code', e.target.value)}
                          placeholder="Ex: 12"
                        />
                      </S.Label>
                      <S.Label>
                        Valor
                        <S.Input
                          type="number"
                          step="0.01"
                          value={share.value}
                          onChange={(e) => handleSharingChange(index, 'value', e.target.value)}
                          placeholder="Ex: 132.50"
                        />
                      </S.Label>
                      <S.SharingActions>
                        {formData.sharing.length > 1 && (
                          <S.RemoveButton type="button" onClick={() => handleRemoveSharing(index)}>
                            <FiMinus size={16} />
                          </S.RemoveButton>
                        )}
                        {index === formData.sharing.length - 1 && (
                          <S.AddButton type="button" onClick={handleAddSharing}>
                            <FiPlus size={16} />
                          </S.AddButton>
                        )}
                      </S.SharingActions>
                    </S.SharingRow>
                  ))}

                  <S.SectionTitle>Mensagens</S.SectionTitle>
                  {formData.messages.map((message, index) => (
                   <S.MessageRow key={index}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => handleMessageChange(index, e.target.value)}
                        placeholder="Mensagem"
                    />
                    <S.SharingActions>
                        {formData.messages.length > 1 && (
                        <S.RemoveButton type="button" onClick={() => handleRemoveMessage(index)}>
                            <FiMinus size={16} />
                        </S.RemoveButton>
                        )}
                        {index === formData.messages.length - 1 && (
                        <S.AddButton type="button" onClick={handleAddMessage}>
                            <FiPlus size={16} />
                        </S.AddButton>
                        )}
                    </S.SharingActions>
                    </S.MessageRow>
                  ))}
                </S.FieldGroup>
              )}
            </S.TabContent>

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
                    Criar Boleto
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

export default SantanderBoletoModal;