import React from 'react';
import * as S from '../CadastroEmpresaStyles';

const EmpresaForm = ({ data, errors, onChange }) => {
  return (
    <>
      <S.FormGrid>
        <S.FormGroup>
          <S.FormLabel>
            Razão Social <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="razao_social"
            value={data.razao_social || ''}
            onChange={onChange}
            $error={errors.razao_social}
            placeholder="Digite a razão social da empresa"
          />
          {errors.razao_social && (
            <S.ErrorMessage>{errors.razao_social}</S.ErrorMessage>
          )}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Nome Fantasia <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="nome_fantasia"
            value={data.nome_fantasia || ''}
            onChange={onChange}
            $error={errors.nome_fantasia}
            placeholder="Digite o nome fantasia"
          />
          {errors.nome_fantasia && (
            <S.ErrorMessage>{errors.nome_fantasia}</S.ErrorMessage>
          )}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            CNPJ <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="cnpj"
            value={data.cnpj || ''}
            onChange={onChange}
            $error={errors.cnpj}
            placeholder="00.000.000/0000-00"
          />
          {errors.cnpj && (
            <S.ErrorMessage>{errors.cnpj}</S.ErrorMessage>
          )}
          <S.HelpText>Digite apenas números</S.HelpText>
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Inscrição Estadual
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="inscricao_estadual"
            value={data.inscricao_estadual || ''}
            onChange={onChange}
            placeholder="Digite a inscrição estadual"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Tipo de Empresa <span className="required">*</span>
          </S.FormLabel>
          <S.FormSelect
            name="tipo_empresa"
            value={data.tipo_empresa || ''}
            onChange={onChange}
            $error={errors.tipo_empresa}
          >
            <option value="">Selecione o tipo</option>
            <option value="matriz">Matriz</option>
            <option value="filial">Filial</option>
            <option value="representante">Representante</option>
          </S.FormSelect>
          {errors.tipo_empresa && (
            <S.ErrorMessage>{errors.tipo_empresa}</S.ErrorMessage>
          )}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Atividade Principal
          </S.FormLabel>
          <S.FormSelect
            name="atividade"
            value={data.atividade || ''}
            onChange={onChange}
          >
            <option value="">Selecione a atividade</option>
            <option value="corretora">Corretora de Seguros</option>
            <option value="administradora">Administradora</option>
            <option value="seguradora">Seguradora</option>
            <option value="correspondente">Correspondente Bancário</option>
            <option value="outros">Outros</option>
          </S.FormSelect>
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Data de Fundação
          </S.FormLabel>
          <S.FormInput
            type="date"
            name="data_fundacao"
            value={data.data_fundacao || ''}
            onChange={onChange}
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Status <span className="required">*</span>
          </S.FormLabel>
          <S.FormSelect
            name="status"
            value={data.status || 'ativo'}
            onChange={onChange}
            $error={errors.status}
          >
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="pendente">Pendente</option>
          </S.FormSelect>
          {errors.status && (
            <S.ErrorMessage>{errors.status}</S.ErrorMessage>
          )}
        </S.FormGroup>
      </S.FormGrid>

      <S.Section>
        <S.SectionTitle>Observações</S.SectionTitle>
        <S.FormGroup>
          <S.FormTextarea
            name="observacoes"
            value={data.observacoes || ''}
            onChange={onChange}
            placeholder="Observações adicionais sobre a empresa..."
          />
        </S.FormGroup>
      </S.Section>
    </>
  );
};

export default EmpresaForm;