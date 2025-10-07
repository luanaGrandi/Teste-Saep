import axios from 'axios'; //é o hook que faz a comunicação com a internet(http)
//são bibliotecas que permite a validação de interação com o usuario...NUNCA DUVIDE DA CAPACIDADE DO USUARIO
// react é comum ver o zod
import { useForm } from 'react-hook-form'; // hook (use) aqui permite a validação de formularios
import { z } from 'zod';// zod é uma descrição de como eu validar, quais serias as regras
import { zodResolver } from '@hookform/resolvers/zod';// é o que liga o hook form com o zod

//validação de formulário -- estou usando as regras do zod, que pode ser consultada na web
const schemaCadUsuario = z.object({
    nome: z.string()
        .min(1, 'Insira ao menos 1 caractere')
        .max(30, 'Insira até 30 caracteres')
        .regex(
        /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/,
        "Digite nome completo (nome e sobrenome), sem números ou símbolos, sem espaços no início/fim"),
    email: z.string()
        .min(1, 'Insira seu email')
        .max(30, 'Insira um endereço de email com até 30 carateres')
        .email("Formato de email inválido")
        
})


export function CadUsuario() {

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
        resolver: zodResolver(schemaCadUsuario)
    });

     // Tratamento para o campo nome (apenas para prevenir entrada inválida antes do submit)
    const handleNomeChange = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ ]+/g, ""); // só letras e espaço
        valor = valor.replace(/\s{2,}/g, " "); // evita espaços duplos
        if (valor.length > 30) valor = valor.slice(0, 30); // máximo 30 chars
         setValue("nome", valor, { shouldValidate: true }); 
    };

    // Tratamento para o campo email
    const handleEmailChange = (e) => {
        let valor = e.target.value.trim();
        if (valor.length > 50) valor = valor.slice(0, 50); // máximo 50 chars
        setValue("email", valor, { shouldValidate: true });
    };

    async function obterdados(data) {
        console.log('dados informados pelo user:', data)
        //para a grande parte das interações com outra plataforma é necessário usar o try
        try {
            await axios.post("http://127.0.0.1:8000/api/usuario/", data);
            alert('Usuário cadastrado com sucesso');
            reset();//limpo o formulario depois do cadastro

        //guarda os erros caso exista algum
        } catch (error) {
            alert("Não deu certo o seu cadastro!!")
            console.log("erros", error)
        }
    }

     return (
        <form className="formularios" role="form" onSubmit={handleSubmit(obterdados)}>
            <h2>Cadastro do Usuário</h2>

            <label htmlFor='nome'>Nome:</label>
            <input type='text' id='nome' placeholder='Jose da Silva' {...register("nome")} onChange={handleNomeChange} aria-required="true" aria-invalid={errors.nome ? "true" : "false"} />
            {errors.nome && <p className='errors' role="alert">{errors.nome.message}</p>}

            <label htmlFor='email'>E-mail</label>
            <input type='email' id='email' placeholder='email@email.com' {...register("email")} onChange={handleEmailChange} aria-required="true" aria-invalid={errors.email ? "true" : "false"} />
            {errors.email && <p className='errors' role="alert">{errors.email.message}</p>}

            <button type='submit'>Cadastrar</button>
        </form>
    )
}
