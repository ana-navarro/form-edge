import { Types } from "mongoose";
import { ServiceResponse } from "../../models/service-response.model";
import Resposta from "../../schemas/resposta.schema";

export const listarResposta = async (questaoId: string): Promise<ServiceResponse> => {
    try {
        const questaoObjectId = new Types.ObjectId(questaoId);

        const questoes = (await Resposta.find()).filter((resposta) => resposta.questao.toString() === questaoObjectId.toString());
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
