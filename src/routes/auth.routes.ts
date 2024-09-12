import { Router } from "express";
import { login } from "../controllers/auth/login.controller";
import { logout } from "../controllers/auth/logout.controller";
import { atualizarSenhaUsuario } from "../controllers/auth/atualizar-senha.controller";
import { resetSenhaUsuario } from "../controllers/auth/reset-senha.controller";

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.post('/atualizar-senha', atualizarSenhaUsuario);
router.post('/forgotpassword/:id', resetSenhaUsuario);

export default router;
