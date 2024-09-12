import { Router } from "express";
import { criarUsuarioController } from "../controllers/usuario/criar-usuario.controller";
import { authMiddleware } from "./middlewares/auth.middleware";
import { deletarUsuarioController } from "../controllers/usuario/deletar-usuario.controller";
import { editarUsuarioVisualizacao } from "../controllers/usuario/editar-usuario-para-visuzalizacao.controller";
import { editarUsuarioAdmin } from "../controllers/usuario/editar-usuario-para-admin.controller";

const router = Router();

router.post('/adicioanr', authMiddleware, criarUsuarioController);
router.delete('/deletar', authMiddleware, deletarUsuarioController);
router.put('/update-VISUALIZACAO', authMiddleware, editarUsuarioVisualizacao);
router.put('/update-ADMIN', authMiddleware, editarUsuarioAdmin);

export default router;
