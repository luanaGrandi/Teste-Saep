import React, { useEffect, useState } from "react"; // React fornece hooks como useEffect e useState
import { useForm } from 'react-hook-form'; // hook (use) aqui permite a validação de formularios
import { z } from 'zod'; // zod é uma descrição de como eu validar, quais seriam as regras
import { zodResolver } from '@hookform/resolvers/zod'; // é o que liga o hook form com o zod
import axios from 'axios'; // é o hook que faz a comunicação com a internet(http)

//validação de formulário -- estou usando as regras do zod, que pode ser consultada na web
const schemaCadTarefas = z.object({
    descricao: z.string()
        .min(10, 'Insira ao menos 10 caracteres')
        .max(100, 'Insira até 100 caracteres'),
    nomeSetor: z.string()
        .min(4, 'Insira ao menos 4 caracteres')
        .max(100, 'Insira até 100 caracteres')
        .regex(/^[^0-9]*$/, 'Informe o nome sem caracteres numericos'),
    usuario: z.string().trim().min(1, "esolha um usuario"),
    dataCadastro: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Informe a data no formato YYYY-MM-DD'), 
    prioridade: z.enum(['Baixa', 'Média', 'Alta']).default('Baixa'), 
    status: z.enum(['A fazer', 'Fazendo', 'Pronto']).default('A fazer'), 
});

export function CadTarefas() {

   
    const [usuarios, setUsuarios] = useState([]); // guarda os usuarios buscados do backend

    const {
        register, // registra para mim o que o usuário faz
        handleSubmit, // no momento em que ele der um submit (botão)
        formState: { errors }, // no formulário, se der ruim guarda os erros na variável errors
        reset, // limpa os campos do formulário
        setValue // permite alterar valores do formulário manualmente
    } = useForm({
        resolver: zodResolver(schemaCadTarefas),
        defaultValues:{
            status: 'A fazer',
        },
    });

    // Função para manipular o nome do setor
    const handleSetorChange = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, ''); // ele permite apenas letras e espaco
        valor = valor.replace(/\s{2,}/g, ' '); // serve para remover espacos duplos
        setValue('nomeSetor', valor); // atualiza o valor do input no form
    }


    const handleDescricaoChange = (e) => {
        let valor = e.target.value;
        valor = valor.replace(/\s{2,}/g, ' '); // serve para remover espacos duplos
        setValue('descricao', valor); // atualiza o valor do input no form
    }

    // Buscar usuários do backend
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/usuario/")
            .then(res => setUsuarios(res.data))
            .catch(err => console.log(err));
    }, []);


    async function obterdados(data) {
        console.log('dados informados pelo user:', data)
        // para a grande parte das interações com outra plataforma é necessário usar o try
        try {
            await axios.post("http://127.0.0.1:8000/api/tarefas/", data);
            alert('tarefas cadastradas com sucesso');
            reset(); // limpo o formulário depois do cadastro

        // guarda os erros caso exista algum
        } catch (error) {
            alert("Não deu certo o seu cadastro!!")
            console.log("erros", error)
        }
    }

    return (
        <form className="formularios" onSubmit={handleSubmit(obterdados)}>
            <h2>Cadastro de Tarefas</h2>

            <label>Descrição:</label>
            <textarea placeholder="Descreva aqui" {...register("descricao")} onChange={handleDescricaoChange} aria-required="true" aria-invalid={errors.descricao ? "true" : "false"} />
            {errors.descricao && <p className="errors" role="alert">{errors.descricao.message}</p>}

            <label>Nome do Setor:</label>
            <input type="text" placeholder="nome do setor" {...register("nomeSetor")} onChange={handleSetorChange} aria-required="true" aria-invalid={errors.nomeSetor ? "true" : "false"} />
            {errors.nomeSetor && <p className="errors" role="alert">{errors.nomeSetor.message}</p>}

            <label>Usuário:</label>
            <select {...register("usuario")} aria-required="true" aria-invalid={errors.usuario ? "true" : "false"}>
                <option value="">Selecione um usuário</option>
                {usuarios.map(u => (
                    <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
            </select>
            {errors.usuario && <p className="errors" role="alert">{errors.usuario.message}</p>}

            <label>Data de Cadastro:</label>
            <input type="date" placeholder="data de cadastro" {...register("dataCadastro")} aria-required="true" aria-invalid={errors.dataCadastro ? "true" : "false"} />
            {errors.dataCadastro && <p className="errors" role="alert">{errors.dataCadastro.message}</p>}

            <label>Prioridade:</label>
            <select {...register("prioridade")} aria-required="true" aria-invalid={errors.prioridade ? "true" : "false"}>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
            </select>
            {errors.prioridade && <p className="errors" role="alert">{errors.prioridade.message}</p>}

            <label>Status:</label>
            <select {...register("status")} readOnly aria-required="true" aria-invalid={errors.status ? "true" : "false"}>
                <option value="A fazer">A fazer</option>
                {/* <option value="Fazendo">Fazendo</option>
                <option value="Pronto">Pronto</option> */}
            </select>
            {errors.status && <p className="errors" role="alert">{errors.status.message}</p>}

            <button type="submit">Cadastrar</button>
        </form>

    )
}

