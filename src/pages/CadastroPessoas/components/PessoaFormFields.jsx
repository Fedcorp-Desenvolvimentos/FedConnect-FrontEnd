// src/pages/CadastroPessoas/components/PessoaFormFields.js

import React from 'react';
import { FaSearch, FaGlobe } from 'react-icons/fa';
import * as S from '../CadastroPessoasStyles';
import CedenteSelect from './CedenteSelect';
import { CATEGORIAS_DISPONIVEIS } from '../hooks/usePessoaForm';

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO'
];

const BANCOS = [
  '001 - Banco do Brasil',
  '033 - Santander',
  '104 - Caixa Econômica Federal',
  '237 - Bradesco',
  '341 - Itaú',
  '077 - Inter',
  '260 - Nubank',
  'NU PAGAMENTOS',
  'SICOOB',
  'SICREDI',
];

const SECTION_VISIBILITY = {
  identificacao: ['identificacao'],
  endereco: ['endereco'],
  bancario: ['bancario'],
  contato: ['contato'],
  configuracoes: ['configuracoes'],
  agenciamento: ['agenciamento', 'prestador'],
};

const isSectionVisible = (activeTab, sectionName) => {
  const visibleSections = SECTION_VISIBILITY[activeTab] || [];
  return visibleSections.includes(sectionName);
};

const PessoaFormFields = ({
  data,
  errors,
  disabled,
  onChange,
  onBuscarCep,
  activeTab = 'identificacao',
  produtos = [],
  gerentes = []
}) => {
  const renderSection = (section, children) => {
    if (!isSectionVisible(activeTab, section)) return null;
    return children;
  };

  return (
    <>
      {/* ==================== IDENTIFICAÇÃO ==================== */}
      {renderSection('identificacao', (
        <S.Section disabled={disabled}>
          <S.SectionTitle>Identificação</S.SectionTitle>

          <S.FormRow>
            <S.FormGroup $flex="0 1 140px">
              <S.FormLabel>Código</S.FormLabel>
              <S.FormInput type="text" name="codigo" value={data.codigo} disabled readOnly />
            </S.FormGroup>

            <S.FormGroup $flex="0 1 200px">
              <S.FormLabel>Dt. Cadastro</S.FormLabel>
              <S.FormInput
                type="date"
                name="data_cadastro"
                value={data.data_cadastro}
                onChange={onChange}
                disabled={true}
              />
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="3 1 320px">
              <S.FormLabel>
                Nome / Razão Social <span className="required">*</span>
              </S.FormLabel>
              <S.FormInput
                type="text"
                name="nome"
                value={data.nome}
                onChange={onChange}
                disabled={disabled}
                $error={errors.nome}
                placeholder="Nome ou Razão Social"
              />
              {errors.nome && <S.ErrorMessage>{errors.nome}</S.ErrorMessage>}
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="0 1 160px">
              <S.FormLabel>Tipo</S.FormLabel>
              <S.FormSelect name="tipo" value={data.tipo} onChange={onChange} disabled={disabled}>
                <option value="juridica">Jurídica</option>
                <option value="fisica">Física</option>
              </S.FormSelect>
            </S.FormGroup>

            <S.FormGroup $flex="1 1 220px">
              <S.FormLabel>
                {data.tipo === 'juridica' ? 'CNPJ' : 'CPF'} <span className="required">*</span>
              </S.FormLabel>
              <S.FormInput
                type="text"
                name="cpf_cnpj"
                value={data.cpf_cnpj}
                onChange={onChange}
                disabled={disabled}
                $error={errors.cpf_cnpj}
                placeholder={data.tipo === 'juridica' ? '00.000.000/0000-00' : '000.000.000-00'}
              />
              {errors.cpf_cnpj && <S.ErrorMessage>{errors.cpf_cnpj}</S.ErrorMessage>}
            </S.FormGroup>

            <S.FormGroup $flex="0 1 180px">
              <S.FormLabel>Sexo</S.FormLabel>
              <S.FormSelect name="sexo" value={data.sexo} onChange={onChange} disabled={disabled}>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="nao_informado">Não informado</option>
              </S.FormSelect>
            </S.FormGroup>
          </S.FormRow>

          {/* ✅ CATEGORIA AGORA É UM SELECT (dropdown) */}
          <S.FormRow>
            <S.FormGroup $flex="1 1 320px">
              <S.FormLabel>
                Categoria <span className="required">*</span>
              </S.FormLabel>
              <S.FormSelect
                name="categoria"
                value={data.categoria || ''}
                onChange={onChange}
                disabled={disabled}
                $error={errors.categoria}
              >
                <option value="">Selecione uma categoria</option>
                {CATEGORIAS_DISPONIVEIS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </S.FormSelect>
              {errors.categoria && <S.ErrorMessage>{errors.categoria}</S.ErrorMessage>}
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="1 1 320px">
              <S.FormLabel>Gerente Comercial</S.FormLabel>
              <S.FormSelect
                name="gerente_comercial"
                value={data.gerente_comercial || ''}
                onChange={onChange}
                disabled={disabled}
              >
                <option value="">Selecione o gerente</option>
                {gerentes.map(gerente => (
                  <option key={gerente.codigo} value={gerente.codigo}>{gerente.nome}</option>
                ))}
              </S.FormSelect>
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="1 1 320px">
              <S.FormLabel>Favorecido 1</S.FormLabel>
              <S.FormInput
                type="text"
                name="favorecido1"
                value={data.favorecido1 || ''}
                onChange={onChange}
                disabled={disabled}
                placeholder="Nome do favorecido 1"
              />
            </S.FormGroup>

            <S.FormGroup $flex="1 1 320px">
              <S.FormLabel>Favorecido 2</S.FormLabel>
              <S.FormInput
                type="text"
                name="favorecido2"
                value={data.favorecido2 || ''}
                onChange={onChange}
                disabled={disabled}
                placeholder="Nome do favorecido 2"
              />
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="0 1 250px">
              <S.FormLabel>Comissão 1 (%)</S.FormLabel>
              <S.FormInput
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="comissao1"
                value={data.comissao1 || ''}
                onChange={onChange}
                disabled={disabled}
                placeholder="0,00"
              />
            </S.FormGroup>

            <S.FormGroup $flex="0 1 250px">
              <S.FormLabel>Comissão 2 (%)</S.FormLabel>
              <S.FormInput
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="comissao2"
                value={data.comissao2 || ''}
                onChange={onChange}
                disabled={disabled}
                placeholder="0,00"
              />
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="0 1 250px">
              <S.FormLabel>Produto</S.FormLabel>
              <S.FormSelect name="produto" value={data.produto} onChange={onChange} disabled={disabled}>
                <option value="">Selecione o produto</option>
                {produtos.map(produto => (
                  <option key={produto.codigo} value={produto.codigo}>{produto.nome}</option>
                ))}
              </S.FormSelect>
            </S.FormGroup>
          </S.FormRow>
        </S.Section>
      ))}

      {/* ==================== ENDEREÇO ==================== */}
      {renderSection('endereco', (
        <S.Section disabled={disabled}>
          <S.SectionTitle>Endereço</S.SectionTitle>

          <S.FormRow>
            <S.FormGroup $flex="0 1 180px">
              <S.FormLabel>CEP</S.FormLabel>
              <S.InputWithButton>
                <S.FormInput
                  type="text"
                  name="cep"
                  value={data.cep}
                  onChange={onChange}
                  disabled={disabled}
                  placeholder="00000-000"
                />
                <S.IconSquareButton
                  type="button"
                  title="Buscar endereço pelo CEP"
                  onClick={onBuscarCep}
                  disabled={disabled}
                >
                  <FaSearch />
                </S.IconSquareButton>
              </S.InputWithButton>
            </S.FormGroup>

            <S.FormGroup $flex="0 1 110px">
              <S.FormLabel>UF</S.FormLabel>
              <S.FormSelect name="uf" value={data.uf} onChange={onChange} disabled={disabled}>
                <option value="">-</option>
                {ESTADOS.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </S.FormSelect>
            </S.FormGroup>

            <S.FormGroup $flex="1 1 220px">
              <S.FormLabel>Cidade</S.FormLabel>
              <S.FormInput
                type="text"
                name="cidade"
                value={data.cidade}
                onChange={onChange}
                disabled={disabled}
              />
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="1 1 200px">
              <S.FormLabel>Bairro</S.FormLabel>
              <S.FormInput
                type="text"
                name="bairro"
                value={data.bairro}
                onChange={onChange}
                disabled={disabled}
              />
            </S.FormGroup>

            <S.FormGroup $flex="1 1 100%">
              <S.FormLabel>Logradouro</S.FormLabel>
              <S.FormInput
                type="text"
                name="logradouro"
                value={data.logradouro || data.endereco}
                onChange={onChange}
                disabled={disabled}
                placeholder="Rua, número, complemento"
              />
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="0 1 220px">
              <S.FormLabel>DDD / Telefone</S.FormLabel>
              <S.PhoneGroup>
                <S.FormInput
                  type="text"
                  name="telefone1_ddd"
                  value={data.telefone1_ddd}
                  onChange={onChange}
                  disabled={disabled}
                  placeholder="00"
                />
                <S.FormInput
                  type="text"
                  name="telefone1_numero"
                  value={data.telefone1_numero}
                  onChange={onChange}
                  disabled={disabled}
                  placeholder="0000-0000"
                />
              </S.PhoneGroup>
            </S.FormGroup>

            <S.FormGroup $flex="0 1 220px">
              <S.FormLabel>DDD / Celular</S.FormLabel>
              <S.PhoneGroup>
                <S.FormInput
                  type="text"
                  name="telefone2_ddd"
                  value={data.telefone2_ddd}
                  onChange={onChange}
                  disabled={disabled}
                  placeholder="00"
                />
                <S.FormInput
                  type="text"
                  name="telefone2_numero"
                  value={data.telefone2_numero}
                  onChange={onChange}
                  disabled={disabled}
                  placeholder="00000-0000"
                />
              </S.PhoneGroup>
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="1 1 100%">
              <S.FormLabel>Complemento</S.FormLabel>
              <S.FormInput
                type="text"
                name="complemento"
                value={data.complemento}
                onChange={onChange}
                disabled={disabled}
                placeholder="Complemento (opcional)"
              />
            </S.FormGroup>
          </S.FormRow>
        </S.Section>
      ))}

      {/* ==================== DADOS BANCÁRIOS ==================== */}
      {renderSection('bancario', (
        <S.Section disabled={disabled}>
          <S.SectionTitle>Dados Bancários</S.SectionTitle>

          <S.FormRow>
            <S.FormGroup $flex="2 1 260px">
              <S.FormLabel>Banco</S.FormLabel>
              <S.FormSelect name="banco" value={data.banco} onChange={onChange} disabled={disabled}>
                <option value="">Selecione o banco</option>
                {BANCOS.map(banco => (
                  <option key={banco} value={banco}>{banco}</option>
                ))}
              </S.FormSelect>
            </S.FormGroup>

            <S.FormGroup $flex="0 1 150px">
              <S.FormLabel>Agência</S.FormLabel>
              <S.FormInput
                type="text"
                name="agencia"
                value={data.agencia}
                onChange={onChange}
                disabled={disabled}
              />
            </S.FormGroup>

            <S.FormGroup $flex="0 1 170px">
              <S.FormLabel>Conta</S.FormLabel>
              <S.FormInput
                type="text"
                name="conta"
                value={data.conta}
                onChange={onChange}
                disabled={disabled}
              />
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="1 1 100%">
              <S.FormLabel>Favorecido</S.FormLabel>
              <S.FormInput
                type="text"
                name="favorecido"
                value={data.favorecido}
                onChange={onChange}
                disabled={disabled}
              />
            </S.FormGroup>
          </S.FormRow>

          {/* Chave Pix */}
          <S.FormRow>
            <S.FormGroup $flex="1 1 280px">
              <S.FormLabel>Chave Pix</S.FormLabel>
              <S.FormInput
                type="text"
                name="chave_pix"
                value={data.chave_pix}
                onChange={onChange}
                disabled={disabled}
                placeholder="CPF, E-mail, Telefone ou chave aleatória"
              />
            </S.FormGroup>
          </S.FormRow>
        </S.Section>
      ))}

      {/* ==================== CONTATO ==================== */}
      {renderSection('contato', (
        <S.Section disabled={disabled}>
          <S.SectionTitle>Contato</S.SectionTitle>

          <S.FormRow>
            <S.FormGroup $flex="1 1 280px">
              <S.FormLabel>E-mail</S.FormLabel>
              <S.FormInput
                type="email"
                name="email"
                value={data.email}
                onChange={onChange}
                disabled={disabled}
                $error={errors.email}
                placeholder="contato@empresa.com.br"
              />
              {errors.email && <S.ErrorMessage>{errors.email}</S.ErrorMessage>}
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="1 1 100%">
              <S.FormLabel>Pessoa de Contato</S.FormLabel>
              <S.FormInput
                type="text"
                name="contato"
                value={data.contato}
                onChange={onChange}
                disabled={disabled}
              />
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="1 1 100%">
              <S.FormLabel>Observações</S.FormLabel>
              <S.FormTextarea
                name="observacoes"
                value={data.observacoes}
                onChange={onChange}
                disabled={disabled}
              />
            </S.FormGroup>
          </S.FormRow>
        </S.Section>
      ))}

      {/* ==================== CONFIGURAÇÕES ==================== */}
      {renderSection('configuracoes', (
        <S.Section disabled={disabled}>
          <S.SectionTitle>Configurações</S.SectionTitle>

          <S.FormRow>
            <S.FormGroup $flex="0 1 200px">
              <S.FormLabel>Melhor Dia Pgto.</S.FormLabel>
              <S.FormInput
                type="number"
                min="1"
                max="31"
                name="melhor_dia_pagamento"
                value={data.melhor_dia_pagamento}
                onChange={onChange}
                disabled={disabled}
                placeholder="Dia"
              />
            </S.FormGroup>

            <S.FormGroup $flex="0 1 200px">
              <S.FormLabel>&nbsp;</S.FormLabel>
              <S.CheckboxWrapper disabled={disabled}>
                <input
                  type="checkbox"
                  name="emite_nota_fiscal"
                  checked={data.emite_nota_fiscal}
                  onChange={onChange}
                  disabled={disabled}
                />
                Emite Nota Fiscal
              </S.CheckboxWrapper>
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="1 1 260px">
              <CedenteSelect
                value={data.cedente}
                onChange={onChange}
                disabled={disabled}
                error={errors.cedente}
                onCedenteSelecionado={(cedente) => {
                  // Opcional: preencher outros campos automaticamente
                }}
              />
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="1 1 100%">
              <S.CheckboxWrapper disabled={disabled}>
                <input
                  type="checkbox"
                  name="possui_portal"
                  checked={data.possui_portal}
                  onChange={onChange}
                  disabled={disabled}
                />
                Possui Portal
              </S.CheckboxWrapper>
            </S.FormGroup>
          </S.FormRow>

          <S.FormRow>
            <S.FormGroup $flex="1 1 100%">
              <S.FormLabel>URL do Portal</S.FormLabel>
              <S.InputWithButton>
                <S.FormInput
                  type="url"
                  name="portal"
                  value={data.portal}
                  onChange={onChange}
                  disabled={disabled || !data.possui_portal}
                  placeholder="https://portal.empresa.com.br"
                />
                <S.IconSquareButton
                  type="button"
                  title="Abrir portal"
                  disabled={disabled || !data.possui_portal || !data.portal}
                  onClick={() => data.portal && window.open(data.portal, '_blank', 'noopener')}
                >
                  <FaGlobe />
                </S.IconSquareButton>
              </S.InputWithButton>
            </S.FormGroup>
          </S.FormRow>
        </S.Section>
      ))}

      {/* ==================== AGENCIAMENTO ==================== */}
      {renderSection('agenciamento', (
        <>
          <S.Section disabled={disabled}>
            <S.SectionInlineHeader>
              <S.CheckboxWrapper disabled={disabled}>
                <input
                  type="checkbox"
                  name="agenciador"
                  checked={data.agenciador}
                  onChange={onChange}
                  disabled={disabled}
                />
                Agenciador
              </S.CheckboxWrapper>

              <S.CheckboxWrapper disabled={disabled}>
                <input
                  type="checkbox"
                  name="optante_simples"
                  checked={data.optante_simples}
                  onChange={onChange}
                  disabled={disabled}
                />
                Optante do Simples
              </S.CheckboxWrapper>
            </S.SectionInlineHeader>

            <S.FormRow>
              <S.FormGroup $flex="0 1 200px">
                <S.FormLabel>% Agenciamento</S.FormLabel>
                <S.FormInput
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  name="percentual_agenciamento"
                  value={data.percentual_agenciamento}
                  onChange={onChange}
                  disabled={disabled || !data.agenciador}
                  placeholder="0,00"
                />
              </S.FormGroup>

              <S.FormGroup $flex="0 1 200px">
                <S.FormLabel>Impostos (%)</S.FormLabel>
                <S.FormInput
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  name="impostos"
                  value={data.impostos}
                  onChange={onChange}
                  disabled={disabled || !data.agenciador}
                  placeholder="0,00"
                />
              </S.FormGroup>
            </S.FormRow>
          </S.Section>

          {/* Prestador de Serviços */}
          <S.Section disabled={disabled}>
            <S.SectionInlineHeader>
              <S.CheckboxWrapper disabled={disabled}>
                <input
                  type="checkbox"
                  name="prestador_servicos"
                  checked={data.prestador_servicos}
                  onChange={onChange}
                  disabled={disabled}
                />
                Prestador de Serviços
              </S.CheckboxWrapper>
            </S.SectionInlineHeader>

            <S.FormRow>
              <S.FormGroup $flex="1 1 240px">
                <S.FormLabel>Credenciado</S.FormLabel>
                <S.FormSelect
                  name="credenciado"
                  value={data.credenciado}
                  onChange={onChange}
                  disabled={disabled || !data.prestador_servicos}
                >
                  <option value="">Selecione</option>
                  <option value="credenciado_1">Credenciado 1</option>
                  <option value="credenciado_2">Credenciado 2</option>
                </S.FormSelect>
              </S.FormGroup>

              <S.FormGroup $flex="0 1 200px">
                <S.FormLabel>Código</S.FormLabel>
                <S.FormInput
                  type="text"
                  name="codigo_credenciado"
                  value={data.codigo_credenciado}
                  onChange={onChange}
                  disabled={disabled || !data.prestador_servicos}
                />
              </S.FormGroup>
            </S.FormRow>
          </S.Section>
        </>
      ))}
    </>
  );
};

export default PessoaFormFields;