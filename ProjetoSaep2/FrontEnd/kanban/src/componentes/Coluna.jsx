import { Tarefa } from "./Tarefa";
import { useDroppable } from "@dnd-kit/core"; //é o uso da biblioteca de clicar e arrastar (drag & drop)

export function Coluna({ id, titulo, tarefas = [] }) {
  const { setNodeRef } = useDroppable({ id }); // Hook do dnd-kit que marca este elemento como area de solutura

  return (
    <section className="coluna" ref={setNodeRef} aria-label={titulo}>
      <h2 className="titulo">{titulo}</h2>

      {tarefas.map((tarefa) => { //percorre todas as tarefas desta coluna
        console.log("Renderizando", tarefa);
        return <Tarefa key={tarefa.id} tarefa={tarefa} />;
      })}
    </section>
  );
}
