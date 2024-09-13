import { Types } from 'mongoose';
import { ServiceResponse } from '../../models/service-response.model';
import Resultado from '../../schemas/resultado.schema';

export const listarResultados = async (formularioId: string): Promise<ServiceResponse> => {
    try {
        const formularioObjectId = new Types.ObjectId(formularioId);
        
        const resultados = (await Resultado.find()).filter((res) => res.formulario.toString() === formularioObjectId.toString());

        return {
            data: resultados,
            status: 200,
        };
    } catch (err) {
        return {
            error: err,
            status: 500,
        };
    }
};
