import { Types } from "mongoose";
import { ServiceResponse } from "../../models/service-response.model";
import Resposta from "../../schemas/resposta.schema";

export const consultarResposta = async (id: string): Promise<ServiceResponse> => {
    try {
        if (!Types.ObjectId.isValid(id)) {
            return {
                error: 'ID inválido',
                status: 400,
            };
        }

        const questao = await Resposta.findById(id);
        if (!questao) {
            return {
                error: 'Resposta não encontrada',
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