import { Schema, model } from "mongoose";

const comentarioSchema = Schema({
  comentario: {
    type: String,
    required: [true, "Comment is required"],
    maxLength: [200, "Max is 200 characters"]
  },
  nombre: {
    type: String,
    required: true
  },
  publicacion: {
    type: Schema.Types.ObjectId,
    ref: 'Publicacion',
    required: true
  },
  parentComentario: {
    type: Schema.Types.ObjectId,
    ref: 'Comentario',
    default: null
  },
  status: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
  versionKey: false
});

export default model('Comentario', comentarioSchema);
