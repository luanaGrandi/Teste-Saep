import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from "vitest";
import { CadTarefas } from "../paginas/CadTarefas";
import axios from "axios";
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

// mock do axios para evitar chamadas reais à API
vi.mock("axios");

describe("Cadastro de Tarefas", () => {

  beforeEach(() => {
    axios.get.mockResolvedValueOnce({
      data: [{ id: 1, nome: "Maria Grandi" }],
    });
  });


  // REMDERIZAR OS CAMPOS DO FORME
  it("deve renderizar todos os campos do formulário", async () => {
    render(<CadTarefas />);

    // aguarda o carregamento do select de usuários
    await waitFor(() => screen.getByLabelText(/Usuário/i));

    expect(screen.getByLabelText(/Descrição/i)).toBeTruthy();
    expect(screen.getByLabelText(/Nome do Setor/i)).toBeTruthy();
    expect(screen.getByLabelText(/Usuário/i)).toBeTruthy();
    expect(screen.getByLabelText(/Data de Cadastro/i)).toBeTruthy();
    expect(screen.getByLabelText(/Prioridade/i)).toBeTruthy();
    expect(screen.getByLabelText(/Status/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Cadastrar/i })).toBeTruthy();
  });

  //ERRO COM OS CAMPOS VAZIOS
  it("deve mostrar erros quando campos estiverem vazios", async () => {
    render(<CadTarefas />);

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Insira ao menos 10 caracteres/i)).toBeTruthy();
      expect(screen.getByText(/Insira ao menos 4 caracteres/i)).toBeTruthy();
      expect(screen.getByText(/Esolha um usuario/i)).toBeTruthy();
      expect(screen.getByText(/Informe a data no formato YYYY-MM-DD/i)).toBeTruthy();
    });
  });

    // REMOVER CAMPOS DUPLOS DA DESCRIÇÃO
    it("deve remover espaços duplos no campo Descrição", async () => {
        render(<CadTarefas />);

    const descricaoInput = screen.getByLabelText(/Descrição/i);

    // Simula o usuário digitando espaços duplos
    fireEvent.change(descricaoInput, {
      target: { value: "Tarefa   com   vários   espaços" },
    });

    // Espera que os espaços duplos sejam reduzidos para simples
    await waitFor(() => {
      expect(descricaoInput.value).toBe("Tarefa com vários espaços");
    });
  });

  //REMOVER ESPAÇOS DUPLOS NO CAMPO NOME SETOR
  it("deve remover espaços duplos no campo Nome do Setor", async () => {
    render(<CadTarefas />);

    const setorInput = screen.getByLabelText(/Nome do Setor/i);

    // Simula o usuário digitando espaços duplos
    fireEvent.change(setorInput, {
      target: { value: "Setor   Administrativo   Central" },
    });

    // Espera que os espaços duplos sejam reduzidos para simples
    await waitFor(() => {
      expect(setorInput.value).toBe("Setor Administrativo Central");
    });
  });

    //REMOVER NUMEROS NO CAMPO DE NOME DO SETOR
    it("deve remover números do campo Nome do Setor automaticamente", async () => {
    render(<CadTarefas />);

    const setorInput = screen.getByLabelText(/Nome do Setor/i);

    fireEvent.change(setorInput, { target: { value: "Setor1234" } });

    // Espera que o valor no input tenha sido filtrado
    await waitFor(() => {
        expect(setorInput.value).toBe("Setor");
    });
    });

    //MENOS DE 10 CARACTERES NA DESCRIÇÃO
    it("deve mostrar erro se a descrição tiver menos de 10 caracteres", async () => {
        render(<CadTarefas />);
        const descricao = screen.getByLabelText(/Descrição/i);
        fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: '123' } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            const erroDescricao = screen.getByText(/Insira ao menos 10 caracteres/i);
            expect(erroDescricao).to.exist;  // .to.exist é do Chai
        });
    });

    //MENOS DE 4 CARACTERES NO CAMPO NOME DO SETOR
    it("deve mostrar erro se o nome do setor tiver menos de 4 caracteres", async () => {
    render(<CadTarefas />);
    const setorInput = screen.getByLabelText(/Nome do Setor/i);
    fireEvent.input(setorInput, { target: { value: "ABC" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
        expect(screen.getByText(/Insira ao menos 4 caracteres/i)).toBeTruthy();
    });
    });

    //SE A DATA ESTIVER FORA DO QUE É PERMITIDO
    it("deve mostrar erro se a data estiver fora do intervalo permitido", async () => {
        render(<CadTarefas />);
        const dataInput = screen.getByLabelText(/Data de Cadastro/i);

        const dataFora = new Date();
        dataFora.setFullYear(dataFora.getFullYear() + 2); // 2 anos à frente
        const dataStr = dataFora.toISOString().split("T")[0];

        fireEvent.change(dataInput, { target: { value: dataStr } });
        fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

        await waitFor(() => {
            expect(screen.getByText(/A data deve ser entre hoje/i)).toBeTruthy();
        });
    });

    //PRIORIDADE EM BAIXA E STATUS EM A FAZER
    it("deve ter prioridade padrão 'Baixa' e status padrão 'A fazer'", async () => {
        render(<CadTarefas />);
        const prioridade = screen.getByLabelText(/Prioridade/i);
        const status = screen.getByLabelText(/Status/i);

        expect(prioridade.value).toBe("Baixa");
        expect(status.value).toBe("A fazer");
    });

    //SE A DESCRIÇÃO NAO FOR PREENCHIDA
    it("deve mostrar erro se a descrição não for preenchida", async () => {
    // Mock do axios para não depender do backend
    axios.get.mockResolvedValue({ data: [{ id: 1, nome: "Usuário Teste" }] });
    render(<CadTarefas />);

    // aguarda os campos serem carregados
    const nomeSetorInput = await screen.findByLabelText(/Nome do Setor/i);
    const usuarioSelect = await screen.findByLabelText(/Usuário/i);
    const dataInput = await screen.findByLabelText(/Data de Cadastro/i);

    fireEvent.change(nomeSetorInput, { target: { value: "TI" } });
    fireEvent.change(usuarioSelect, { target: { value: "1" } });
    fireEvent.change(dataInput, { target: { value: "2025-01-01" } });

    const botao = screen.getByRole("button", { name: /Cadastrar/i });
    fireEvent.click(botao);

    // verifica se aparece mensagem de erro de descrição
    const erroDescricao = await screen.findByText(/Insira ao menos 10 caracteres/i);
    expect(erroDescricao).toBeTruthy();

    });

    //SE O NOME SETOR NAO FOR PREENCHIDO
        it('deve mostrar erro se o nome do setor não for preenchido', async () => {
        render(<CadTarefas />); // renderiza o componente

        // Aguarda o select de Usuário carregar (dependente do axios)
        const usuarioSelect = await screen.findByLabelText(/Usuário/i);

        // Inputs que são renderizados imediatamente podem ser pegos direto
        const descricaoInput = screen.getByLabelText(/Descrição/i);
        const dataInput = screen.getByLabelText(/Data de Cadastro/i);
        const botao = screen.getByRole('button', { name: /Cadastrar/i });

        // Preenche os campos obrigatórios, deixando 'Nome do Setor' vazio
        fireEvent.change(descricaoInput, { target: { value: 'Descrição válida' } });
        fireEvent.change(usuarioSelect, { target: { value: '1' } });
        fireEvent.change(dataInput, { target: { value: '2025-01-01' } });

        fireEvent.click(botao);

        // Verifica se aparece o erro no Nome do Setor
        await waitFor(() => {
            expect(screen.getByText(/Insira ao menos 4 caracteres/i)).toBeTruthy();
        });
    });

        
    //TESTE DE CARACTERES MÁXIMOS DO SETOR
    it("deve mostrar erro se o nome do setor ultrapassar 100 caracteres", async () => {
        render(<CadTarefas />);

        const setorInput = screen.getByLabelText(/Nome do Setor/i);
        const descricaoInput = screen.getByLabelText(/Descrição/i);
        const usuarioSelect = await screen.findByLabelText(/Usuário/i);
        const dataInput = screen.getByLabelText(/Data de Cadastro/i);
        const botao = screen.getByRole("button", { name: /Cadastrar/i });

        fireEvent.change(setorInput, { target: { value: "A".repeat(101) } });
        fireEvent.change(descricaoInput, { target: { value: "Descrição válida" } });
        fireEvent.change(usuarioSelect, { target: { value: "1" } });
        fireEvent.change(dataInput, { target: { value: "2025-01-01" } });

        fireEvent.click(botao);

        await waitFor(() => {
            expect(screen.getByText(/Insira até 100 caracteres/i)).toBeTruthy();
        });
    });

    //TESTE DE CARACTERES MÁXIMOS DA DESCRIÇÃO
    it("deve mostrar erro se a descrição ultrapassar 100 caracteres", async () => {
        render(<CadTarefas />);

        const descricaoInput = screen.getByLabelText(/Descrição/i);
        const nomeSetorInput = screen.getByLabelText(/Nome do Setor/i);
        const usuarioSelect = await screen.findByLabelText(/Usuário/i);
        const dataInput = screen.getByLabelText(/Data de Cadastro/i);
        const botao = screen.getByRole("button", { name: /Cadastrar/i });

        fireEvent.change(descricaoInput, { target: { value: "A".repeat(101) } });
        fireEvent.change(nomeSetorInput, { target: { value: "TI" } });
        fireEvent.change(usuarioSelect, { target: { value: "1" } });
        fireEvent.change(dataInput, { target: { value: "2025-01-01" } });

        fireEvent.click(botao);

        await waitFor(() => {
            expect(screen.getByText(/Insira até 100 caracteres/i)).toBeTruthy();
        });
    });

    
    //TESTE SE A DESCRIÇÃO FOR SÓ ESPAÇOS OU CARACTERES ESPECIAIS
    it("deve mostrar erro se a descrição for preenchida apenas com espaços ou caracteres especiais", async () => {
        render(<CadTarefas />);

        const descricaoInput = screen.getByLabelText(/Descrição/i);
        const nomeSetorInput = screen.getByLabelText(/Nome do Setor/i);
        const usuarioSelect = await screen.findByLabelText(/Usuário/i);
        const dataInput = screen.getByLabelText(/Data de Cadastro/i);
        const botao = screen.getByRole("button", { name: /Cadastrar/i });

        // Apenas espaços
        fireEvent.change(descricaoInput, { target: { value: "       " } });
        fireEvent.change(nomeSetorInput, { target: { value: "TI" } });
        fireEvent.change(usuarioSelect, { target: { value: "1" } });
        fireEvent.change(dataInput, { target: { value: "2025-01-01" } });

        fireEvent.click(botao);

        await waitFor(() => {
            expect(screen.getByText(/Insira ao menos 10 caracteres/i)).toBeTruthy();
        });

        // Apenas caracteres especiais
        fireEvent.change(descricaoInput, { target: { value: "!@#$%^&*()!" } });
        fireEvent.click(botao);

        await waitFor(() => {
            expect(screen.getByText(/Insira ao menos 10 caracteres/i)).toBeTruthy();
        });
    });

    //SE O CAMPO USUÁRIO NÃO FOR PREENCHIDO
    it("deve mostrar erro se o campo Usuário não for preenchido", async () => {
        render(<CadTarefas />);

        const descricaoInput = screen.getByLabelText(/Descrição/i);
        const nomeSetorInput = screen.getByLabelText(/Nome do Setor/i);
        const dataInput = screen.getByLabelText(/Data de Cadastro/i);
        const botao = screen.getByRole("button", { name: /Cadastrar/i });

        fireEvent.change(descricaoInput, { target: { value: "Descrição válida" } });
        fireEvent.change(nomeSetorInput, { target: { value: "TI" } });
        fireEvent.change(dataInput, { target: { value: "2025-01-01" } });

        fireEvent.click(botao);

        await waitFor(() => {
            expect(screen.getByText(/Esolha um usuario/i)).toBeTruthy();
        });
    });

    //ERRO SE O USUARIO NAO EXISTIR
    it("deve mostrar erro se o usuário selecionado não existir", async () => {
        render(<CadTarefas />);
        const descricaoInput = screen.getByLabelText(/Descrição/i);
        const nomeSetorInput = screen.getByLabelText(/Nome do Setor/i);
        const usuarioSelect = await screen.findByLabelText(/Usuário/i);
        const dataInput = screen.getByLabelText(/Data de Cadastro/i);
        const botao = screen.getByRole("button", { name: /Cadastrar/i });

        fireEvent.change(descricaoInput, { target: { value: "Descrição válida" } });
        fireEvent.change(nomeSetorInput, { target: { value: "TI" } });
        fireEvent.change(usuarioSelect, { target: { value: "999" } }); // valor inválido
        fireEvent.change(dataInput, { target: { value: "2025-01-01" } });

        fireEvent.click(botao);

        await waitFor(() => {
            expect(screen.getByText(/Esolha um usuario/i)).toBeTruthy();
        });
    });

    //CARACTERES INVALIDOS NO NOME DO SETOR
    it("deve remover caracteres inválidos do Nome do Setor automaticamente", async () => {
        render(<CadTarefas />);
        const setorInput = screen.getByLabelText(/Nome do Setor/i);

        fireEvent.change(setorInput, { target: { value: "Setor@123#" } });

        await waitFor(() => {
            expect(setorInput.value).toBe("Setor"); // mantém apenas letras e espaços
        });
    });    

    //MENSAGEM DE SUCESSO APÓS CADASTRO
   it("deve mostrar mensagem de sucesso após cadastro bem-sucedido", async () => {
      render(<CadTarefas />);

      axios.post.mockResolvedValueOnce({ data: {} });

      const descricaoInput = screen.getByLabelText(/Descrição/i);
      const nomeSetorInput = screen.getByLabelText(/Nome do Setor/i);
      const usuarioSelect = await screen.findByLabelText(/Usuário/i);
      const dataInput = screen.getByLabelText(/Data de Cadastro/i);

      fireEvent.change(descricaoInput, { target: { value: "Descrição válida da tarefa" } });
      fireEvent.change(nomeSetorInput, { target: { value: "TI Setor" } });
      fireEvent.change(usuarioSelect, { target: { value: "1" } });
      fireEvent.change(dataInput, { target: { value: "2025-10-07" } });  // Corrigido aqui

      const botao = screen.getByRole("button", { name: /Cadastrar/i });

      await act(async () => {
          userEvent.click(botao);
      });

      await waitFor(() => {
          expect(screen.getByText(/Tarefa cadastrada com sucesso/i)).toBeInTheDocument();
      });
  });

    //PERMITIR LETRAS COM ACENTO E ESPÇAOS SIMPLES NO NOME SETOR
    it("deve permitir letras com acento e espaços simples no campo Nome do Setor", async () => {
    render(<CadTarefas />);
    const setorInput = screen.getByPlaceholderText("Nome do Setor");

    fireEvent.change(setorInput, {
      target: { value: "Administração Pública" },
    });

    await waitFor(() => {
      expect(setorInput.value).toBe("Administração Pública");
    });
  });

  it("deve aceitar apenas valores válidos no campo Prioridade", async () => {
    render(<CadTarefas />);
    const prioridadeInput = screen.getByLabelText(/Prioridade/i);

    fireEvent.change(prioridadeInput, { target: { value: "Muito alta" } });

    await waitFor(() => {
      expect(prioridadeInput.value).not.toBe("Muito alta");
      expect(["", "Baixa", "Média", "Alta"]).toContain(prioridadeInput.value);
    });
  });

  
    //RESETAR OS CAMPOS APOS A SUBMISSAO
  it("deve resetar os campos após submissão bem-sucedida", async () => {
    render(<CadTarefas />);

    // mocka o post como sucesso
    axios.post.mockResolvedValueOnce({ data: {} });

    const descricao = screen.getByLabelText(/Descrição/i);
    const nomeSetor = screen.getByLabelText(/Nome do Setor/i);
    const usuario = await screen.findByLabelText(/Usuário/i);
    const data = screen.getByLabelText(/Data de Cadastro/i);

    // Preenche os campos válidos
    fireEvent.input(descricao, { target: { value: "Descrição de tarefa válida" } });
    fireEvent.input(nomeSetor, { target: { value: "Administrativo" } });
    fireEvent.change(usuario, { target: { value: "1" } });

    // define uma data válida (hoje)
    const hoje = new Date().toISOString().split("T")[0];
    fireEvent.change(data, { target: { value: hoje } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(descricao.value).toBe("");
      expect(nomeSetor.value).toBe("");
      expect(usuario.value).toBe("");
      expect(data.value).toBe("");
    });
  });
});
