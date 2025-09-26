import { describe, it, expect } from "vitest";

//describe = como eu descrevo esse teste
describe("matematica basica", ()=>{
    //qual cenario de teste que estou executando
    it("soma 2 + 2", ()=>{
        //o que eu espero de receber como resposta
        expect(2 + 2).toBe(4)
    });
});