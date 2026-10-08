import { Router } from "express";
import { validateBody } from "shared";
import * as authController from "../controllers/auth.controller";
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
} from "../schemas/auth.schemas";
const router = Router();

router.post("/register", validateBody(registerSchema), authController.register);
router.post("/login", validateBody(loginSchema), authController.login);
router.get("/me", authController.getMe);
router.get("/verify-email/:token", authController.verifyEmail);
router.post("/refresh-token", authController.refreshHandler);
router.post("/logout", authController.logoutHandler);
router.post(
    "/forgot-password",
    validateBody(forgotPasswordSchema),
    authController.forgotPasswordHandler,
);
router.post(
    "/reset-password",
    validateBody(resetPasswordSchema),
    authController.resetPasswordHandler,
);

export default router;
