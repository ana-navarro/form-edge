import { Router } from "express";
import { authMiddleware } from "./middlewares/auth.middleware";
import { consultarRespostaController } from "../controllers/resposta/consultar-resposta.controller";
import { criarRespostaController } from "../controllers/resposta/criar-resposta.controller";
import { deletarRespostaController } from "../controllers/resposta/deletar-resposta.controller";
import { listarRespostaController } from "../controllers/resposta/listar-resposta.controller";

const router = Router();

router.get('/:formularioId/questao/:questaoId/resposta/:respostaId', authMiddleware, consultarRespostaController);
router.post('/:formularioId/questao/:questaoId/resposta/adicionar', authMiddleware, criarRespostaController);
router.delete('/:formularioId/questao/:questaoId/resposta/:respostaId/delete', authMiddleware, deletarRespostaController);
router.put('/:formularioId/questao/:questaoId/resposta/:respostaId/editar', authMiddleware, deletarRespostaController);
router.get('/:formularioId/questao/:questaoId/resposta', authMiddleware, listarRespostaController);

export default router;