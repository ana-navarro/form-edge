export interface CalcularResultadoInput {
    formularioId: string;
    email: string;
    resultado: {
        valor: Number;
        resultado: string;
    }[];
}

export interface GerarResultadoInput {
    formularioId: string;
    mediaResultado: number;
    email: string;
    resultado: {
        valor: Number;
        resultado: string;
    }[];
    respostas: {
        questao: string
        resposta: string;
    }[];
}
