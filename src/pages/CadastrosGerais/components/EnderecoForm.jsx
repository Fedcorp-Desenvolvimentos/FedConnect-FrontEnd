import React from 'react';
import * as S from '../CadastroEmpresaStyles';

const EnderecoForm = ({ data, errors, onChange }) => {
  return (
    <>
      <S.FormGrid>
        <S.FormGroup>
          <S.FormLabel>
            CEP <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="cep"
            value={data.cep || ''}
            onChange={onChange}
            $error={errors.cep}
            placeholder="00000-000"
          />
          {errors.cep && <S.ErrorMessage>{errors.cep}</S.ErrorMessage>}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Logradouro <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="logradouro"
            value={data.logradouro || ''}
            onChange={onChange}
            $error={errors.logradouro}
            placeholder="Rua, Avenida, etc."
          />
          {errors.logradouro && (
            <S.ErrorMessage>{errors.logradouro}</S.ErrorMessage>
          )}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Número <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="numero"
            value={data.numero || ''}
            onChange={onChange}
            $error={errors.numero}
            placeholder="Número"
          />
          {errors.numero && <S.ErrorMessage>{errors.numero}</S.ErrorMessage>}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Complemento
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="complemento"
            value={data.complemento || ''}
            onChange={onChange}
            placeholder="Complemento (opcional)"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Bairro <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="bairro"
            value={data.bairro || ''}
            onChange={onChange}
            $error={errors.bairro}
            placeholder="Bairro"
          />
          {errors.bairro && <S.ErrorMessage>{errors.bairro}</S.ErrorMessage>}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Cidade <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="cidade"
            value={data.cidade || ''}
            onChange={onChange}
            $error={errors.cidade}
            placeholder="Cidade"
          />
          {errors.cidade && <S.ErrorMessage>{errors.cidade}</S.ErrorMessage>}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Estado <span className="required">*</span>
          </S.FormLabel>
          <S.FormSelect
            name="estado"
            value={data.estado || ''}
            onChange={onChange}
            $error={errors.estado}
          >
            <option value="">Selecione o estado</option>
            <option value="AC">Acre</option>
            <option value="AL">Alagoas</option>
            <option value="AP">Amapá</option>
            <option value="AM">Amazonas</option>
            <option value="BA">Bahia</option>
            <option value="CE">Ceará</option>
            <option value="DF">Distrito Federal</option>
            <option value="ES">Espírito Santo</option>
            <option value="GO">Goiás</option>
            <option value="MA">Maranhão</option>
            <option value="MT">Mato Grosso</option>
            <option value="MS">Mato Grosso do Sul</option>
            <option value="MG">Minas Gerais</option>
            <option value="PA">Pará</option>
            <option value="PB">Paraíba</option>
            <option value="PR">Paraná</option>
            <option value="PE">Pernambuco</option>
            <option value="PI">Piauí</option>
            <option value="RJ">Rio de Janeiro</option>
            <option value="RN">Rio Grande do Norte</option>
            <option value="RS">Rio Grande do Sul</option>
            <option value="RO">Rondônia</option>
            <option value="RR">Roraima</option>
            <option value="SC">Santa Catarina</option>
            <option value="SP">São Paulo</option>
            <option value="SE">Sergipe</option>
            <option value="TO">Tocantins</option>
          </S.FormSelect>
          {errors.estado && <S.ErrorMessage>{errors.estado}</S.ErrorMessage>}
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            País <span className="required">*</span>
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="pais"
            value={data.pais || 'Brasil'}
            onChange={onChange}
            $error={errors.pais}
            placeholder="País"
          />
          {errors.pais && <S.ErrorMessage>{errors.pais}</S.ErrorMessage>}
        </S.FormGroup>
      </S.FormGrid>
    </>
  );
};

export default EnderecoForm;