import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//fazendo o uso do Drag
import { useDraggable } from "@dnd-kit/core";// usando a biblioteca de arrastar

export function Tarefa({ tarefa, onAtualizarStatus }) {

    const [status, setStatus] = useState(tarefa.status || "");
    const navigate = useNavigate();

    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: tarefa.id,
    });

    const style = transform
        //pega os pontos cartesianos X e Y para dar a sensação de arrasto para o usuario
        ? {transform: `translate(${transform.x}px, ${transform.y}px)`} // corrigido translate
        : undefined;

    // sincroniza status caso tarefa.status seja alterado externamente
    useEffect(() => {
        setStatus(tarefa.status || "");
    }, [tarefa.status]);

    //fazendo a exclusão de uma tarefa
    //async é pq eu não sei exatamente o tempo de resposta
    // as funções dev ter nome que remeta a sua funcionalidade
    async function excluirTarefa(id) {
        if(confirm("Tem certeza mesmo que quer excluir? ")){
            try{
                await axios.delete(`http://127.0.0.1:8000/api/tarefas/${id}/`);
                alert("Tarefa excluída com sucesso");
                window.location.reload(); //refrash
            }catch(error){
                console.error("erro ao excluir a tarefa", error);
                alert("erro ao excluir");
            }
        }
        
    }

    async function alterarStatus(e) {
        e.preventDefault();
        try{
            // usa função do pai se existir
            if(onAtualizarStatus){
                await onAtualizarStatus(tarefa.id, status);
            } else {
                // fallback: apenas patch na API
                await axios.patch(`http://127.0.0.1:8000/api/tarefas/${tarefa.id}/`, {
                    status: status, 
                });
            }
            alert("Tarefa alterada com sucesso!!!");
            window.location.reload(); //refrash
        }catch(error){
            console.error("erro ao alterar status da tarefa", error);
            alert("Houve um erro na alteração de status");
        }
        
    }

    return(
        <article className="conteiner" ref={setNodeRef} style={style}{...listeners}{...attributes}>
            <h3 id={`tarefa-${tarefa.id}`}>{tarefa.descricao}</h3> 

            {/* lista de detalhes da tarefa */}
           <dl className="lista">
            <div className="detalhes-tarefa">
                <dt>Setor:</dt>
                <dd>{tarefa.nomeSetor}</dd>

                <dt>Prioridade:</dt>
                <dd>{tarefa.prioridade}</dd>
            </div>

            <div className="detalhes-usuario">
                <dt>Usuário:</dt>
                <dd>{tarefa.usuario?.nome || "Usuário não definido"}</dd>
            </div>
            </dl>

            {/* Botão de editar as tarefas */}
            <button onClick={()=> navigate(`/editarTarefas/${tarefa.id}`)} onPointerDown={(e) => e.stopPropagation()} // evita conflito com drag
            > Editar </button>
            
            {/* botao de excluir */}
            <button onClick={()=> excluirTarefa(tarefa.id)} onPointerDown={(e) => e.stopPropagation()} // evita conflito com drag
            > Excluir </button>

           <form>
            {/* mostrar o status da tarefa */}
                <label htmlFor={`status-${tarefa.id}`}>Status: </label>
                <select id={`status-${tarefa.id}`} name="status" value={status} onChange={(e)=> setStatus(e.target.value)} aria-haspopup="listbox"
                    aria-expanded="false"
                    aria-label={`Status da tarefa: ${status || "não definido"}. Abra para alterar.`}
                >
                    <option value="">selecione</option>
                    <option value="A fazer">A fazer</option>
                    <option value="Fazendo">Fazendo</option>
                    <option value="Pronto">Pronto</option>
                </select>
        
                {/* botao para alterar o status da atividade */}
                <button type="button" onClick={alterarStatus} onPointerDown={(e) => e.stopPropagation()}>
                    Alterar status
                </button>
            </form>

        </article>
    )
}
