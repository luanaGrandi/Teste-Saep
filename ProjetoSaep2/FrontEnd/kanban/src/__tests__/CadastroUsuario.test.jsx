import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CadUsuario } from "../paginas/CadUsuario";
import axios from "axios";
import '@testing-library/jest-dom';



// mock do axios para não chamar a API real
vi.mock("axios");
// Mock global do alert
global.alert = vi.fn();

describe("Cadastro de Usuario", () => {

  beforeEach(() => {
    axios.post.mockReset(); // limpa mocks antes de cada teste
  });

  //RENDERIZAR OS CAMPOS DO FORMS
  it("deve renderizar todos os campos do formulário", () => {
    render(<CadUsuario />);
    expect(screen.getByLabelText(/Nome/i)).toBeTruthy();
    expect(screen.getByLabelText(/E-mail/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Cadastrar/i })).toBeTruthy();
  });

  //CAMPOS VAZIOS
  it("deve mostrar erros quando campos estiverem vazios", async () => {
    render(<CadUsuario />);
    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Insira ao menos 1 caractere")).toBeTruthy();
      expect(screen.getByText("Insira seu email")).toBeTruthy();
    });
  });

  //SE EU PREENCHER PENAS UM CAMPO SÓ - NOME
  it("deve mostrar erro se preencher apenas o nome", async () => {
    render(<CadUsuario />);

    const nomeInput = screen.getByLabelText(/Nome/i);
    fireEvent.input(nomeInput, { target: { value: "Maria Grandi" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Insira seu email")).toBeTruthy();
    });
  })

    //SE EU PREENCHER PENAS UM CAMPO SÓ - EMAIL
   it("deve mostrar erro se preencher apenas o email", async () => {
    render(<CadUsuario />);

    const emailInput = screen.getByLabelText(/E-mail/i);
    fireEvent.input(emailInput, { target: { value: "maria@email.com" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText("Insira ao menos 1 caractere")).toBeTruthy();
    });
  });


  //ESPAÇOS DUPLICADOS - NOME
  it("deve remover espaços duplicados no campo Nome", async () => {
    render(<CadUsuario />);
    const nomeInput = screen.getByLabelText(/Nome/i);

    fireEvent.change(nomeInput, { target: { value: "Maria  Grandi" } });

    await waitFor(() => {
      // espera que o valor final tenha apenas um espaço
      expect(nomeInput.value).toBe("Maria Grandi");
    });
  });

  //REMOVER ESPAÇOS - EMAIL
  it("deve remover espaços no início/fim do email e limitar tamanho", async () => {
    render(<CadUsuario />);
    const emailInput = screen.getByLabelText(/E-mail/i);

    fireEvent.change(emailInput, { target: { value: "  maria.grandi@email.com  " } });

    await waitFor(() => {
      expect(emailInput.value).toBe("maria.grandi@email.com");
    });
    // teste de limite de caracteres
    fireEvent.change(emailInput, { target: { value: "a".repeat(60) + "@email.com" } });

    await waitFor(() => {
      expect(emailInput.value.length).toBe(50); // limitado a 50 chars
    });
  });

  //ERRO PARA EMAIL INVALIDO
  it("deve mostrar erro para email com formato inválido", async () => {
    render(<CadUsuario />);

    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/E-mail/i);

    fireEvent.input(nomeInput, { target: { value: "Maria Grandi" } });
    fireEvent.input(emailInput, { target: { value: "email-invalido" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Formato de email inválido/i)).toBeTruthy();
    });
  });

  //MOSTRAR ERRO SE O NOME FOR CURTO OU INCOMPLETO
  it('deve mostrar erro se o nome for muito curto ou incompleto', async () => {
    render(<CadUsuario />);

    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/E-mail/i);

    fireEvent.input(nomeInput, { target: { value: 'Jo' } });
    fireEvent.input(emailInput, { target: { value: 'maria@email.com' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Digite nome completo/i)).toBeInTheDocument();
    });
  });

  // MENSAGEM DE SUCESSO APOS CADASTRO
  it('deve mostrar mensagem de sucesso após cadastro realizado', async () => {
    render(<CadUsuario />);

    axios.post.mockResolvedValueOnce({ data: {} });

    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/E-mail/i);

    fireEvent.input(nomeInput, { target: { value: 'Maria Grandi' } });
    fireEvent.input(emailInput, { target: { value: 'maria@email.com' } });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Usuário cadastrado com sucesso');
    });
  });

//DEVE MOSTRAR MENSAGEM DE ERRO APOS FALHA A API
it("deve mostrar mensagem de erro se a API retornar falha", async () => {
    render(<CadUsuario />);

    axios.post.mockRejectedValueOnce(new Error("Erro na API"));

    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/E-mail/i);

    fireEvent.input(nomeInput, { target: { value: "Maria Grandi" } });
    fireEvent.input(emailInput, { target: { value: "maria@email.com" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      // verifica se o alert foi chamado com a mensagem esperada
      expect(window.alert).toHaveBeenCalledWith("Não deu certo o seu cadastro!!");
    });
  });

  //ERRO SE O NOME NAO FOR COMPLETO E CARACTERES INVALIDOS
  it("exibe erro se nome não for completo ou contiver caracteres inválidos", async () => {
    render(<CadUsuario />);

    fireEvent.input(screen.getByLabelText(/Nome/i), { target: { value: "Maria" } });
    fireEvent.input(screen.getByLabelText(/E-mail/i), { target: { value: "maria@email.com" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    expect(await screen.findByText(/Digite nome completo/i)).toBeInTheDocument();
  });




  //RESETAR AS INFORMAÇOES APÓS A SUBMISSAO DOS DADOS
  it("deve resetar os campos após submissão", async () => {
    render(<CadUsuario />);
    axios.post.mockResolvedValueOnce({ data: {} });

    const nomeInput = screen.getByLabelText(/Nome/i);
    const emailInput = screen.getByLabelText(/E-mail/i);

    fireEvent.input(nomeInput, { target: { value: "Maria Grandi" } });
    fireEvent.input(emailInput, { target: { value: "maria@email.com" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(nomeInput.value).toBe("");
      expect(emailInput.value).toBe("");
    });
  });

});
