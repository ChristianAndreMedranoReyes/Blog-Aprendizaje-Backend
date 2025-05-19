"use strict";

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import argon2 from "argon2";
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import Curso from '../src/curso/curso.model.js';
import User from '../src/users/user.model.js';
import authRoutes from '../src/auth/auth.routes.js';
import userRoutes from '../src/users/user.routes.js';
import publicacionRoutes from '../src/publicacion/publicacion.routes.js';
import comentarioRoutes from '../src/comentario/comentario.routes.js';
import cursoRoutes from '../src/curso/curso.routes.js';

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
};

const routes = (app) => {
    app.use("/blogaprendizaje/v1/auth", authRoutes);
    app.use("/blogaprendizaje/v1/user", userRoutes);
    app.use("/blogaprendizaje/v1/curso", cursoRoutes);
    app.use("/blogaprendizaje/v1/publicacion", publicacionRoutes);
    app.use("/blogaprendizaje/v1/comentario", comentarioRoutes);
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log("Conexion a la base de datos exitosa");
    } catch (error) {
        console.error('Error conectado a la base de datos', error);
        process.exit(1);
    }
};

const createDefaultCurso = async () => {
    try {
        const existingCurso = await Curso.findOne({ name: "Default" });
        if (!existingCurso) {
            const defaultCurso = new Curso({
                name: "Default",
                description: "Curso default",
                isDefault: true
            });
            await defaultCurso.save();
            console.log(" ▬▬▬▬ Curso por defecto creado ▬▬▬▬");
        } else {
            console.log(" ▬▬▬▬ El curso por defecto ya existe ▬▬▬▬");
        }
    } catch (error) {
        console.error(" ▬▬▬▬► Error al crear el curso por defecto:", error);
    }
};

const initializeAdminUser = async () => {
    try {
        const aEmail = "cmedrano@gmail.com";
        const aPassword = "cvQ5pGTg";

        const adminExists = await User.findOne({ email: aEmail });
        if (!adminExists) {
            const encryptedPassword = await argon2.hash(aPassword);
            const aUser = new User({
                name: "Christian Medrano",
                username: "Chr1s",
                email: aEmail,
                password: encryptedPassword,
                role: "ADMIN_ROLE",
            });
            await aUser.save();
            console.log(" ▬▬▬▬ Usuario ADMIN creado correctamente ▬▬▬▬");
        } else {
            console.log(" ▬▬▬▬ Ya existe un usuario ADMIN ▬▬▬▬");
        }
    } catch (err) {
        console.error(" ▬▬▬▬► Error al crear el admin por defecto:", err);
    }
};

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        await conectarDB();
        routes(app);
        await createDefaultCurso();
        await initializeAdminUser();
        app.listen(port);
        console.log(`Server running on port ${port}`);
    } catch (err) {
        console.log(`Server init failed ${err}`);
    }
};
const app = express();
app.use(express.json());
