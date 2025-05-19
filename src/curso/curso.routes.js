import { Router } from "express";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarRoles } from "../middlewares/validar-roles.js";
import { createCurso, getCursos, updateCurso, deleteCurso } from "./curso.controller.js";

const router = Router();

router.get("/", getCursos);

router.post("/", [validarJWT, validarRoles], createCurso);

router.put("/:id", [validarJWT, validarRoles], updateCurso);

router.delete("/:id", [validarJWT, validarRoles], deleteCurso);

export default router;
