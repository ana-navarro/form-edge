import { ServiceResponse } from "../../models/service-response.model";
import Resultado from "../../schemas/resultado.schema";
import { calcularResultado } from "./calcular-resultado.service";
import { GerarResultadoInput } from "./resultado.types";

export const gerarResultadoComBaseNasRespostas = async (dados: GerarResultadoInput): Promise<ServiceResponse> => {
    const resultadoFinal = await calcularResultado({
        formularioId: dados.formularioId,
        email: dados.email,
        resultado: dados.resultado,
    });

    if (resultadoFinal === 'NotFoundFormulario') {
        return {
            error: 'Nao foi possivel encontrar o formulario',
            status: 404,
        }
    }

    if (resultadoFinal === 'NotFoundResposta') {
        return {
            error: 'Nao foi possivel encontrar as respostas',
            status: 404,
        }
    }

    if (resultadoFinal === 'NotValidFormularioId') {
        return {
            error: 'Formulario Id nao esta no formato certo',
            status: 403,
        }
    }

    if (resultadoFinal === 'MenorNumeroRespostas') {
        return {
            error: 'O usuario ainda nao pode ter um resultado final',
            status: 400,
        }
    }

    if (resultadoFinal === 'MaiorNumeroRespostas') {
        return {
            error: 'O numero de respostas esta diferente do numero de questoes',
            status: 400,
        }
    }

    if (resultadoFinal === 'ErroInterno') {
        return {
            error: 'Erro Interno ao gerar calculo',
            status: 500,
        }
    }

    try {
        await Resultado.create({
            email: dados.email,
            formulario: dados.formularioId,
            respostas: dados.respostas,
            mediaResultado: dados.mediaResultado,
            resultado: resultadoFinal,
        });
    
        return {
            data: resultadoFinal,
            status: 200,
        };
    } catch (error) {
        return {
            error: error,
            status: 500,
        };
    }
};