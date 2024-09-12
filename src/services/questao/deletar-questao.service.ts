import { ServiceResponse } from '../../models/service-response.model';
import Questao from '../../schemas/questao.schema';
import { Types } from 'mongoose';

export const deletarQuestao = async (id: string): Promise<ServiceResponse> => {
    try {
        if (!Types.ObjectId.isValid(id)) {
            return {
                error: 'ID inválido',
                status: 400,
            };
        }

        const questao = await Questao.findByIdAndDelete(id);
        if (!questao) {
            return {
                error: 'Questão não encontrada',
                status: 404,
            };
        }

        return {
            data: { message: 'Questão deletada com sucesso' },
            status: 200,
        };
    } catch (err) {
        return {
            error: err,
            status: 500,
        };
    }
};