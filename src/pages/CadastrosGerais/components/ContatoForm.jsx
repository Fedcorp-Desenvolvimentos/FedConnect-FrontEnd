import React from 'react';
import * as S from '../CadastroEmpresaStyles';

const ContatoForm = ({ data, errors, onChange }) => {
  return (
    <>
      <S.FormGrid>
        <S.FormGroup>
          <S.FormLabel>
            Telefone <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="telefone"
            value={data.telefone || ''}
            onChange={onChange}
            $error={errors.telefone}
            placeholder="(00) 0000-0000"
          />
          {errors.telefone && (
            <S.ErrorMessage>{errors.telefone}</S.ErrorMessage>
          )}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Celular
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="celular"
            value={data.celular || ''}
            onChange={onChange}
            placeholder="(00) 00000-0000"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            E-mail <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="email"
            name="email"
            value={data.email || ''}
            onChange={onChange}
            $error={errors.email}
            placeholder="contato@empresa.com.br"
          />
          {errors.email && <S.ErrorMessage>{errors.email}</S.ErrorMessage>}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Site
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="site"
            value={data.site || ''}
            onChange={onChange}
            placeholder="https://www.empresa.com.br"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Responsável <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="responsavel"
            value={data.responsavel || ''}
            onChange={onChange}
            $error={errors.responsavel}
            placeholder="Nome do responsável"
          />
          {errors.responsavel && (
            <S.ErrorMessage>{errors.responsavel}</S.ErrorMessage>
          )}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Cargo do Responsável
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="cargo_responsavel"
            value={data.cargo_responsavel || ''}
            onChange={onChange}
            placeholder="Cargo do responsável"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Ramo de Atividade
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="ramo_atividade"
            value={data.ramo_atividade || ''}
            onChange={onChange}
            placeholder="Ex: Serviços Financeiros"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Porte da Empresa
          </S.FormLabel>
          <S.FormSelect
            name="porte_empresa"
            value={data.porte_empresa || ''}
            onChange={onChange}
          >
            <option value="">Selecione o porte</option>
            <option value="mei">MEI</option>
            <option value="micro">Microempresa</option>
            <option value="pequena">Pequena Empresa</option>
            <option value="media">Média Empresa</option>
            <option value="grande">Grande Empresa</option>
          </S.FormSelect>
        </S.FormGroup>
      </S.FormGrid>
    </>
  );
};

export default ContatoForm;