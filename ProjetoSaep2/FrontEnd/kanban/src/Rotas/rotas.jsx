import { Router, Route, Routes } from 'react-router-dom';
import { Inicial } from '../paginas/inicial';
import { Quadro } from '../componentes/Quadro';
import { CadUsuario } from '../paginas/CadUsuario';
import { CadTarefas } from '../paginas/CadTarefas';

export function Rotas(){
    return(
        <Routes>
            <Route path='/' element={<Inicial/>}>
                <Route index element  = {<Quadro/>}/>
                <Route path= 'cadUsuario' element={<CadUsuario/>}/>
                <Route path= 'cadTarefas' element={<CadTarefas/>}/>
            </Route>
        </Routes>
    )
}