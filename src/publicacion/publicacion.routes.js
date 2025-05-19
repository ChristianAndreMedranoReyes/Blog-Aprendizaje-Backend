import { Router } from 'express';
import { createPublicacion, getPublicaciones, getPublicacionById, updatePublicacion, deletePublicacion } from './publicacion.controller.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

router.get(
    '/',
    getPublicaciones
);

router.get(
    '/:id',
    getPublicacionById
);

    router.post(
    '/',
    validarJWT,
    createPublicacion
);

router.put(
    '/:id',
    validarJWT,
    updatePublicacion
);

router.delete(
    '/:id',
    validarJWT,
    deletePublicacion
);

export default router;
