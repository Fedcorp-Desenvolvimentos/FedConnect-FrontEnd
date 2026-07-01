import React from 'react';
import * as S from '../CadastroEmpresaStyles';

const DocumentosForm = ({ data, errors, onChange }) => {
  return (
    <>
      <S.FormGrid>
        <S.FormGroup>
          <S.FormLabel>
            Alvará de Funcionamento
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="alvara"
            value={data.alvara || ''}
            onChange={onChange}
            placeholder="Número do alvará"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Data de Emissão do Alvará
          </S.FormLabel>
          <S.FormInput
            type="date"
            name="alvara_data_emissao"
            value={data.alvara_data_emissao || ''}
            onChange={onChange}
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Licença Ambiental
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="licenca_ambiental"
            value={data.licenca_ambiental || ''}
            onChange={onChange}
            placeholder="Número da licença"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Certidão Negativa
          </S.FormLabel>
          <S.FormSelect
            name="certidao_negativa"
            value={data.certidao_negativa || ''}
            onChange={onChange}
          >
            <option value="">Selecione</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </S.FormSelect>
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Data de Validade da Certidão
          </S.FormLabel>
          <S.FormInput
            type="date"
            name="certidao_validade"
            value={data.certidao_validade || ''}
            onChange={onChange}
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            Inscrição Municipal
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="inscricao_municipal"
            value={data.inscricao_municipal || ''}
            onChange={onChange}
            placeholder="Inscrição municipal"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            CNAE Principal
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="cnae"
            value={data.cnae || ''}
            onChange={onChange}
            placeholder="Código CNAE"
          />
        </S.FormGroup>

        <S.FormGroup>
          <S.FormLabel>
            NIRE
          </S.FormLabel>
          <S.FormInput
            type="text"
            name="nire"
            value={data.nire || ''}
            onChange={onChange}
            placeholder="Número de Identificação do Registro de Empresa"
          />
        </S.FormGroup>
      </S.FormGrid>

      <S.Section>
        <S.SectionTitle>Arquivos Anexados</S.SectionTitle>
        <S.FormGroup>
          <S.FormInput
            type="file"
            name="documentos"
            onChange={onChange}
            multiple
          />
          <S.HelpText>
            Anexe documentos como CNPJ, alvará, licenças, etc. (múltiplos arquivos)
          </S.HelpText>
        </S.FormGroup>
      </S.Section>
    </>
  );
};

export default DocumentosForm;