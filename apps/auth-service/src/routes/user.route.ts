import { Router } from "express";
import { validateBody } from "shared";
import * as userController from "../controllers/user.controller";
import { updateUserSchema } from "../schemas/auth.schemas";

const router = Router();
router.get("/me", userController.getMe);
router.post("/me", validateBody(updateUserSchema), userController.updateUser);

export default router;
