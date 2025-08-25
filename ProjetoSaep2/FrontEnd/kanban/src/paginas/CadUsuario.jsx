import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers';

//validação de formulario
const schemaCadUsuario = z.object({
    nome: z.string()
        .min(1,'Insira ao menos 1 caractere')
        .max(100,' Insira até 30 caracteres'),
    email: z.string()
        .min(1, 'Insira seu email')
        .max(100, 'Insira um endereço de email até 100 caracteres')
        .email("Formato de email invalido")
})

export function CadUsuario(){
    return(
        <form>
            <h2>Cadastro do Usuário</h2>

            <label>Nome:</label>
            <input type="text" placeholder='Nome do usuario' required/>

            <label>Email:</label>
            <input type="email" placeholder='email@email.com' required/>

            <button type='submit'>Cadastrar</button>

        </form>
    )
}