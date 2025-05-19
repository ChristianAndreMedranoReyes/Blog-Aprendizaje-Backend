import { response } from 'express';
import Publicacion from './publicacion.model.js';
import Curso from '../curso/curso.model.js';
import Comentario from '../comentario/comentario.model.js'; 
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export const createPublicacion = async (req, res = response) => {
    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(400).json({
                succes: false,
                msg: "Token is required",
            });
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const { titulo, contenido, curso } = req.body;

        // Debugging logs
        console.log("Body recibido:", req.body);
        console.log("Curso ID recibido:", curso);

        if (!mongoose.Types.ObjectId.isValid(curso)) {
            return res.status(400).json({
                succes: false,
                msg: "Invalid curso ID format",
            });
        }

        const cursoFound = await Curso.findById(curso);
        console.log("Curso encontrada:", cursoFound);

        if (!cursoFound) {
            return res.status(400).json({
                succes: false,
                msg: "Curso not found",
            });
        }

        const newPublicacion = new Publicacion({
            titulo,
            contenido,
            curso: cursoFound._id,
            author: uid,
        });

        await newPublicacion.save();
        res.status(201).json({
            succes: true,
            msg: "Publicacion creada correctamente",
            newPublicacion,
        });
    } catch (error) {
        console.error("Error al crear la publicación:", error);
        return res.status(500).json({
            succes: false,
            msg: "Error, publicacion could not be created",
            error: error.message,
        });
    }
};


export const getPublicaciones = async (req, res = response) => {
    try {
        const publicaciones = await Publicacion.find({ status: true })
            .populate("author", "name")
            .populate("curso", "name");

        res.status(200).json({
            success: true,
            publicaciones,
        });
    } catch (error) {
        console.error("Error en getPublicaciones:", error);
        res.status(500).json({ success: false, msg: "Error al obtener publicaciones" });
    }
}

export const updatePublicacion = async (req, res = response) => {
    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(400).json({ msg: "No hay token en la petición" });
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const { id } = req.params;
        const { titulo, contenido, curso } = req.body;

        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({
                succes: false,
                msg: "Publicacion not found",
            });
        }

        if (publicacion.author.toString() !== uid) {
            return res.status(401).json({
                succes: false,
                msg: "Unauthorized",
            });
        }

        let cursoFound = await Curso.findById(curso);
        if (!cursoFound) {
            return res.status(400).json({
                succes: false,
                msg: "Curso not found",
            });
        }

        const updatedPublicacion = await Publicacion.findByIdAndUpdate(
            id,
            { titulo, contenido, curso: cursoFound._id },
            { new: true }
        ).populate("author", "name")
        .populate("curso", "name");

        res.status(200).json({
            succes: true,
            msg: "Publicacion updated successfully",
            publicacion: {
                _id: updatedPost._id,
                title: updatedPost.title,
                curso: updatedPost.curso.name,
                content: updatedPost.content,
                author: updatedPost.author.name,
                createdAt: updatedPost.createdAt,
                updatedAt: updatedPost.updatedAt
            }
        });
    } catch (error) {
        console.error("Error al actualizar la publicación:", error);
        return res.status(500).json({
            success: false,
            msg: "Error, publicacion could not be updated",
            error: error.message,
        });
    }
};

export const deletePublicacion = async (req, res = response) => {
    try {
        const token = req.header("x-token");
        if (!token) {
            return res.status(400).json({ msg: "No hay token en la petición" });
        }

        const { uid } = jwt.verify(token, process.env.SECRET_KEY);
        const { id } = req.params;

        const publicacion = await Publicacion.findById(id);
        if (!publicacion) {
            return res.status(404).json({
                succes: false,
                msg: "Publicacion not found",
            });
        }

        if (publicacion.author.toString() !== uid) {
            return res.status(401).json({
                succes: false,
                msg: "Unauthorized",
            });
        }

        if (publicacion.status === false) {
            return res.status(400).json({
                succes: false,
                msg: "Publicacion already deleted",
            });
        }

        res.status(200).json({
            succes: true,
            msg: "Publicacion deleted successfully",
            publicacion,
        });

    } catch (error) {
        console.error("Error al eliminar la publicación:", error);
        return res.status(500).json({
            succes: false,
            msg: "Error, publicacion could not be deleted",
            error: error.message,
        });
    }
}
export const getPublicacionById = async (req, res) => {
  try {
    const { id } = req.params;

    const publicacion = await Publicacion.findById(id)
      .populate("curso", "name")
      .populate("author", "name")
      .lean(); // más rápido para leer

    if (!publicacion) {
      return res.status(404).json({
        success: false,
        msg: "Publicación no encontrada",
      });
    }

    // Buscar los comentarios relacionados a esta publicación
    const comentarios = await Comentario.find({ publicacion: id, status: true })
      .populate("parentComentario", "_id")
      .sort({ createdAt: 1 }) // orden opcional
      .lean();

    // Adjuntar los comentarios a la publicación
    publicacion.comentarios = comentarios;

    res.status(200).json({
      success: true,
      publicacion,
    });
  } catch (error) {
    console.error("Error al obtener la publicación:", error);
    res.status(500).json({
      success: false,
      msg: "Error interno al obtener publicación",
      error: error.message,
    });
  }
};

