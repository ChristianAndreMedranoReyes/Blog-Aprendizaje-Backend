import { response } from "express";
import Curso from "./curso.model.js";

export const createCurso = async (req, res = response) => {
  try {
    const { name, description } = req.body;

    const cursoExistente = await Curso.findOne({ name });
    if (cursoExistente) {
      return res.status(400).json({ msg: "Curso ya existe" });
    }

    const curso = new Curso({ name, description });
    await curso.save();

    res.status(201).json({ msg: "Curso creado correctamente", curso });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear curso", error: error.message });
  }
};

export const getCursos = async (req, res = response) => {
  try {
    const cursos = await Curso.find({ status: true });
    res.status(200).json({ cursos });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener cursos" });
  }
};

export const updateCurso = async (req, res = response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const curso = await Curso.findByIdAndUpdate(id, { name, description }, { new: true });

    res.status(200).json({ msg: "Curso actualizado", curso });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar curso" });
  }
};

export const deleteCurso = async (req, res = response) => {
  try {
    const { id } = req.params;

    await Curso.findByIdAndUpdate(id, { status: false });

    res.status(200).json({ msg: "Curso eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar curso" });
  }
};
