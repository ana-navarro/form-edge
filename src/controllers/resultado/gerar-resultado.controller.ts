import { Request, Response } from 'express';
import { gerarResultadoComBaseNasRespostas } from '../../services/resultado/gerar-resultado.service';

export const gerarResultadoController = async (req: Request, res: Response): Promise<void> => {
    const { formularioId, email, respostas, mediaResultado, resultado } = req.body;

    try {
        const response = await gerarResultadoComBaseNasRespostas({
            formularioId,
            email,
            respostas,
            mediaResultado,
            resultado
        });

        if (response.status === 200) {
            res.status(200).json(response.data);
        } else {
            res.status(response.status).json({ error: response.error });
        }
    } catch (error) {
        console.error("Erro ao gerar resultado:", error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};
