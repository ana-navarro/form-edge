import { Types } from "mongoose";
import { ServiceResponse } from "../../models/service-response.model";
import Resposta from "../../schemas/resposta.schema";

export const deletarResposta = async (id: string): Promise<ServiceResponse> => {
    try {
        if (!Types.ObjectId.isValid(id)) {
            return {
                error: 'ID inválido',
                status: 400,
            };
        }

        const questao = await Resposta.findByIdAndDelete(id);
        if (!questao) {
            return {
                error: 'Resposta não encontrada',
                status: 404,
            };
        }

        return {
            data: { message: 'Resposta deletada com sucesso' },
            status: 200,
        };
    } catch (err) {
        return {
            error: err,
            status: 500,
        };
    }
};