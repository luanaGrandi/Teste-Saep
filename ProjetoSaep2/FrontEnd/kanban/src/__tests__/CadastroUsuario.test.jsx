import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import { describe, expect } from 'vitest';
import { CadUsuario } from '../paginas/CadUsuario';
//render: renderiza minha tela
//screen: eu vejo os elementos que estão sendo exibidos
//fireEvent: simula o usuario pode fazer em tela
//waitFor: espera o resultado do evento

describe("cadastro de usuario", ()=>{
    it("A tela é exibida", ()=>{
        render(<CadUsuario/>);

        const nomeInput = screen.getByLabelText(/nome/i);
        const emailInput = screen.getByLabelText(/E-mail/i);
        const botao = screen.getByRole("button", {name:/Cadastrar/i});

        expect(nomeInput).toBeTruthy();
        expect(emailInput).toBeTruthy();
        expect(botao).toBeTruthy();
    });
})