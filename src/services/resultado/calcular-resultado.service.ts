import Formulario from "../../schemas/formulario.schema";
import Resposta from "../../schemas/resposta.schema";
import Questao from "../../schemas/questao.schema";
import { Types } from "mongoose";
import { CalcularResultadoInput } from "./resultado.types";
import { Resultado } from "../../models/resultado.model";

type TiposErros = 'NotFoundFormulario' | 'NotFoundResposta' | 'NotValidFormularioId' | 'MenorNumeroRespostas' | 'MaiorNumeroRespostas' | 'ErroInterno' 

export const calcularResultado = async ({
    formularioId,
    email,
    resultado: resultadosEsperados
}: CalcularResultadoInput): Promise<Resultado | TiposErros> => {
    try {
        if (!Types.ObjectId.isValid(formularioId)) {
            return 'NotValidFormularioId';
        }

        const formulario = await Formulario.findById(formularioId).populate('questoes').exec();
        if (!formulario) {
            return 'NotFoundFormulario';
        }

        const respostas = await Resposta.find({ email, questao: { $in: formulario.questoes } }).exec();
        if (respostas.length === 0) {
            return 'NotFoundResposta';
        }

        if (respostas.length !== formulario.questoes.length) {
            if (respostas.length > formulario.questoes.length) {
                return 'MaiorNumeroRespostas'
            }

            return 'MenorNumeroRespostas';
        }

        let valorFinal: number = 0;

        for (const resposta of respostas) {
            const questao = await Questao.findById(resposta.questao).exec();
            if (questao && questao.alternativas) {
                const respostaIndex = questao.alternativas.indexOf(resposta.resposta);
                if (respostaIndex !== -1) {
                    valorFinal += respostaIndex;
                }
            }
        }
        
        const resultadoMaisProximo = resultadosEsperados.reduce((prev, curr) => {
            const prevValor = Number(prev.valor);
            const currValor = Number(curr.valor);
            const finalValor = Number(valorFinal);
            
            return (Math.abs(currValor - finalValor) < Math.abs(prevValor - finalValor) ? curr : prev);
        });

        return {
            valor: resultadoMaisProximo.valor,
            resultado: resultadoMaisProximo.resultado || "Sem resultado definido"
        };
    } catch (error) {
        console.error("Erro ao calcular o resultado:", error);
        return 'ErroInterno';
    }
};
