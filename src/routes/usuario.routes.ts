import { Router } from "express";
import { authMiddleware } from "./middlewares/auth.middleware";
import { deletarUsuarioController } from "../controllers/usuario/deletar-usuario.controller";
import { editarUsuarioVisualizacao } from "../controllers/usuario/editar-usuario-para-visuzalizacao.controller";
import { criarUsuarioRespondenteController } from "../controllers/usuario/criar-usuario-respondente.controller";
import { adicionarFormularioController } from "../controllers/usuario/adicionar-formulario.controller";
import { editarUsuarioEdicao } from "../controllers/usuario/editar-usuario-para-edicao.controller";
import { criarUsuarioController } from "../controllers/usuario/criar-usuario.controller";
import { editarUsuarioRespondente } from "../controllers/usuario/editar-usuario-para-respondente.controller";
import { removerAcessoController } from "../controllers/usuario/remover-acesso.controller";

const router = Router();

router.post('/adicionar', authMiddleware, criarUsuarioController);
router.post('/:formularioId/adicionar-respondente', authMiddleware, criarUsuarioRespondenteController);
router.delete('/deletar', authMiddleware, deletarUsuarioController);
router.put('/update-VISUALIZACAO/:usuarioId/formularios/:formularioId', authMiddleware, editarUsuarioVisualizacao);
router.put('/update-EDICAO/:usuarioId/formularios/:formularioId', authMiddleware, editarUsuarioEdicao);
router.put('/update-RESPONDENTE/:usuarioId/formularios/:formularioId', authMiddleware, editarUsuarioRespondente);
router.post('/adicionar/:usuarioId/formularios/:formularioId', authMiddleware, adicionarFormularioController);
router.put('/remover-acesso/:usuarioId/formularios/:formularioId', authMiddleware, removerAcessoController);


export default router;
