import { BarraNavegacao } from "../componentes/BarraNavegacao";
import { Cabecalho } from "../componentes/Cabecalho";
import { Outlet } from "react-router-dom";

export function Inicial(){
    return(
        <>
            <BarraNavegacao/>
            <Cabecalho/>
            <Outlet/>
        </>
    )
}