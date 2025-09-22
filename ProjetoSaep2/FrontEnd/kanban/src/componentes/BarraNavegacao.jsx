import { NavLink } from "react-router-dom";

export function BarraNavegacao() {
    return (
        <nav className="barra" aria-label="Navegação principal">
            <ul>
                <li>
                    {/* link para a pagina de cadastro do usuario */}
                    <NavLink to="/cadUsuario">
                        Cadastro de usuário
                    </NavLink>
                </li>
                <li>
                    {/* link para a pagina de cadastro de tarefa */}
                    <NavLink to="/cadTarefas">
                        Cadastro de tarefas
                    </NavLink>
                </li>
                <li>
                    {/* link para a pagina de gerenciamento de tarefas */}
                    <NavLink to="/">
                        Gerenciamento de tarefas
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
