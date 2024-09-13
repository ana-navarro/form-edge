import { Router } from "express";
import { authMiddleware } from "./middlewares/auth.middleware";
import { criarFormularioController } from "../controllers/formulario/criar-formulario.controller";
import { editarFormularioController } from "../controllers/formulario/editar-formulario.controller";
import { finalizarFormularioController } from "../controllers/formulario/finalizar-formulario.controller";

const router = Router();

router.post('/criar', authMiddleware, criarFormularioController);
router.post('/editar/:id', authMiddleware, editarFormularioController);
router.post('/finalizar', authMiddleware, finalizarFormularioController);

export default router;
