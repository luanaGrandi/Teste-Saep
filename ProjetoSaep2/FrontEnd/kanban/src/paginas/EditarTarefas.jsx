import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';

//schema de validação de ediçaõ de tarefas

const schemaEditarTarefas = z.object({
    prioridade: z.enum(['Baixa', 'Média', 'Alta'], {
        erroMap: ()=>({message: "Escolha uma prioridade"})
    }),
    status: z.enum(['A fazer', 'Fazendo', 'Pronto'], {
        erroMap: ()=>({message: "Escolha o estado da tarefa"})
    }), 
})

export function EditarTarefa(){
    const { id } = useParams(); //pega o id passado na rota
    const [tarefa, setTarefa] = useState(null);
    const navigate = useNavigate();

    const{
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({resolver: zodResolver(schemaEditarTarefas)});

    useEffect(()=>{
        axios
            .get(`http://127.0.0.1:8000/api/tarefas/${id}/`)
                .then((res) =>{
                    console.log(res)
                    setTarefa(res.data);
                    reset({
                        prioridade: res.data.prioridade,
                        status: res.data.status,
                    });
                })
                .catch((err)=> console.error("Erro ao buscar tarefa", err))
    }, [id, reset]);

    async function salvarEdicao(data) {
        try{
            await axios.patch(`http://127.0.0.1:8000/api/tarefas/${id}/`, data);
            console.log("os dados foram: ", data)
            alert("Tarefa editada com sucesso")
            navigate('/')
            
        }catch(err){
            console.error("Deu ruim", err)
            alert("Houve um erro ao editar a tarefa")
        }
        
    }


return (
    <section>
        {tarefa ? (
            <form className="formularios" onSubmit={handleSubmit(salvarEdicao)}>
                <h2>Editar Tarefas</h2>

                <label>Descrição:</label>
                <textarea value={tarefa.descricao} placeholder="descrição da tarefa" readOnly className="readonly" aria-readonly="true" />

                <label>Setor: </label>
                <input type="text" value={tarefa.nomeSetor} placeholder="nome do setor" readOnly className="readonly" aria-readonly="true" />

                <label>Prioridade:</label>
                <select {...register('prioridade')} aria-required="true" aria-invalid={errors.prioridade ? "true" : "false"}>
                    <option value="">Selecionar: </option>
                    <option value="Baixa">Baixa</option>
                    <option value="Média">Média</option>
                    <option value="Alta">Alta</option>
                </select>
                {errors.prioridade && <p role="alert">{errors.prioridade.message}</p>}

                <label>Status:</label>
                <select {...register('status')} aria-required="true" aria-invalid={errors.status ? "true" : "false"}>
                    <option value="A fazer">A fazer</option>
                    <option value="Fazendo">Fazendo</option>
                    <option value="Pronto">Pronto</option>
                </select>
                {errors.status && <p role="alert">{errors.status.message}</p>}

                <button type="submit">Editar</button>
            </form>
        ) : (
            <p>Carregando tarefa...</p>
        )}
    </section>

)
}