import React, {useState, useEffect} from "react";
import axios from "axios";
import { Coluna } from "./Coluna";
import {DndContext} from '@dnd-kit/core'//é o uso da biblioteca de clicar e arrastar
import { restrictToFirstScrollableAncestor } from "@dnd-kit/modifiers"; // mantém o card dentro do quadro, 
// mas permite mover entre colunas


export function Quadro(){
    const [tarefas, setTarefas] = useState([]);

    //o effect é um hook que permite a renderização de alguma coisa na tela
    //ele é o fofoqueiro do react, conta para todo mundo o que o state está armazenando
    //effect é composto de parametros. script(algoritimos) e depois as dependencias
    useEffect(() =>{
        //construo uma variavel com o endereço da API
        const apiURL = 'http://127.0.0.1:8000/api/tarefas/';
        //axios permite a chamada de endereço
        axios.get(apiURL)
            // se a resposta der bom
            .then(response => {setTarefas(response.data)
            })
            // se a resposta der algum problema
            .catch(error => {
                console.error("Deu erro!", error)
            });
    },[])

     // função de ouvir o evento
    function handleDragEnd(event) {
        const { active, over } = event;

        // se soltar fora de uma coluna, não faz nada
        if (!over) return;

        // crio uma lista com as colunas válidas
        const colunasValidas = ["A fazer", "Fazendo", "Pronto"];

        // se a coluna que estou soltando não for válida, não faz nada
        if (!colunasValidas.includes(over.id)) return;

        if (over && active) {
            const tarefaId = active.id;
            const novaColuna = over.id;
            
            setTarefas((prev) =>
                prev.map((t) =>
                    t.id === tarefaId ? { ...t, status: novaColuna } : t
                )
            );

            axios
                .patch(`http://127.0.0.1:8000/api/tarefas/${tarefaId}/`, {
                    status: novaColuna,
                })
                .catch(err => console.error("Erro ao atualizar o status: ", err));
        }
    }

    //estou armazenando em variaveis o resultado de uma função callbackq que procura tarefas
    //com certo status
    const tarefasAfazer = tarefas.filter(tarefa => tarefa.status === 'A fazer');
    const tarefasFazendo = tarefas.filter(tarefa => tarefa.status === 'Fazendo');
    const tarefasPronto = tarefas.filter(tarefa => tarefa.status === 'Pronto');

    return(

        //modifiers={[restrictToFirstScrollableAncestor]} -> deixa que o card fique apenas dentro do quadro
        <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToFirstScrollableAncestor]}>
            <main className="container" aria-label="Quadro das tarefas">
                <h1>Minhas Tarefas</h1>

                <section className="colunas" aria-label="Status das tarefas">
                    <Coluna id='A fazer' titulo="A fazer" tarefas={tarefasAfazer} />
                    <Coluna id='Fazendo' titulo="Fazendo" tarefas={tarefasFazendo} />
                    <Coluna id='Pronto' titulo="Pronto" tarefas={tarefasPronto} />
                </section>
            </main>

        </DndContext>
    );
}