import '../styles/RecuperarSenha.css';
import { IoIosLock } from 'react-icons/io';
import PageTemplate from '../components/PageTemplate/PageTemplate';

const RecuperarSenha = () => {
    return (
        <PageTemplate
        title="Recuperar Senha"
        subtitle="Recupere sua senha"
        icon={<IoIosLock />}
        className="recuperar-senha-page"
        >
            <div className="recuperar-senha-content">
                <p>Em breve, esta página estará disponível para recuperação de senha.</p>
            </div>
        </PageTemplate>
    );
}

export default RecuperarSenha;