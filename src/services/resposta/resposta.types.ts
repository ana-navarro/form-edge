export interface CriarRespostaInput {
    email: string;
    questao: string;
    resposta: string;
}

export interface EditarRespostaInput {
    respostaId: string;
    resposta: string;
}
