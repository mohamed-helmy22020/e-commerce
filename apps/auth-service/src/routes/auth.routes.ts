import { Router } from "express";
import { validateBody } from "shared";
import * as authController from "../controllers/auth.controller";
import { loginSchema, registerSchema } from "../schemas/auth.schemas";
const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.get("/me", authController.getMe);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/refresh-token", authController.refreshHandler);
router.post("/logout", authController.logoutHandler);

export default router;
