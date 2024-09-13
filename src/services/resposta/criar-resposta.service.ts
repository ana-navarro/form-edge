import { ServiceResponse } from '../../models/service-response.model';
import Resposta from '../../schemas/resposta.schema';
import { CriarRespostaInput } from './resposta.types';

export const criarResposta = async (
    dados: CriarRespostaInput
): Promise<ServiceResponse> => {
    try {
        const d = await Resposta.create(dados);

        return {
            data: { id: d._id },
            status: 201,
        };
    } catch (err) {
        return {
            error: err,
            status: 500,
        };
    }
};