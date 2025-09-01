import { Link } from "react-router-dom"
export function BarraNavegacao (){
    return(
        <nav className="barra">
            <ul>
                <Link to= '/cadUsuario'><li>Cadastro de usuario</li></Link>
                <Link to= '/cadTarefas'><li>Cadastro de tarefas</li></Link>
                <Link to= '/'><li>Gerenciamento de tarefas</li></Link>
            </ul>
        </nav>
    )
}