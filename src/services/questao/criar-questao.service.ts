import { ServiceResponse } from '../../models/service-response.model';
import Questao from '../../schemas/questao.schema';

export const criarQuestao = async (
    enunciado: string, 
    numAlternativas: number, 
    alternativas: string[]
): Promise<ServiceResponse> => {
    try {
        const q = await Questao.create({
            enunciado,
            numAlternativas,
            alternativas,
        });

        return {
            data: { id: q._id },
            status: 201,
        };
    } catch (err) {
        return {
            error: err,
            status: 500,
        };
    }
};