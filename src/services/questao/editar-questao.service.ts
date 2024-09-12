import { ServiceResponse } from '../../models/service-response.model';
import Questao from '../../schemas/questao.schema';
import { Types } from 'mongoose';

export const editarQuestao = async (
    id: string, 
    enunciado?: string, 
    numAlternativas?: number, 
    alternativas?: string[]
): Promise<ServiceResponse> => {
    try {
        if (!Types.ObjectId.isValid(id)) {
            return {
                error: 'ID inválido',
                status: 400,
            };
        }

        const questao = await Questao.findByIdAndUpdate(
            id,
            { enunciado, numAlternativas, alternativas },
            { new: true, runValidators: true }
        );

        if (!questao) {
            return {
                error: 'Questão não encontrada',
                status: 404,
            };
        }

        return {
            data: questao,
            status: 200,
        };
    } catch (err) {
        return {
            error: err,
            status: 500,
        };
    }
};