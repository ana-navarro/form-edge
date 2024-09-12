import { ServiceResponse } from '../../models/service-response.model';
import Questao from '../../schemas/questao.schema';

export const listarQuestoes = async (): Promise<ServiceResponse> => {
    try {
        const questoes = await Questao.find();
        return {
            data: questoes,
            status: 200,
        };
    } catch (err) {
        return {
            error: err,
            status: 500,
        };
    }
};