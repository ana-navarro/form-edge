import { ServiceResponse } from '../../models/service-response.model';
import { Types } from 'mongoose';
import { EditarRespostaInput } from './resposta.types';
import Resposta from '../../schemas/resposta.schema';

export const editarResposta = async (
    dados: EditarRespostaInput
): Promise<ServiceResponse> => {
    try {
        if (!Types.ObjectId.isValid(dados.respostaId)) {
            return {
                error: 'ID inválido',
                status: 400,
            };
        }

        const resposta = await Resposta.findByIdAndUpdate(
            dados.respostaId,
            {resposta: dados.resposta},
            { new: true, runValidators: true }
        );

        if (!resposta) {
            return {
                error: 'Resposta não encontrada',
                status: 404,
            };
        }

        return {
            data: resposta,
            status: 200,
        };
    } catch (err) {
        return {
            error: err,
            status: 500,
        };
    }
};