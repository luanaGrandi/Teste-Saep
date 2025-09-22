import { Router, Route, Routes } from 'react-router-dom';
import { Inicial } from '../paginas/inicial';
import { Quadro } from '../componentes/Quadro';
import { CadUsuario } from '../paginas/CadUsuario';
import { CadTarefas } from '../paginas/CadTarefas';
import { EditarTarefa } from '../paginas/EditarTarefas';

export function Rotas(){
    return(
        <Routes>
            <Route path='/' element={<Inicial/>}>
                <Route index element  = {<Quadro/>}/>
                <Route path= 'cadUsuario' element={<CadUsuario/>}/>
                <Route path= 'cadTarefas' element={<CadTarefas/>}/>
                <Route path= 'editarTarefas/:id' element={<EditarTarefa/>}/>
            </Route>
        </Routes>
    )
}