import { Schema, model } from "mongoose";

const publicacionSchema = new Schema({
    titulo: { 
        type: String, 
        required: true 
    },
    curso: { 
        type: Schema.Types.ObjectId, 
        ref: "Curso",
        required: true
    },
    contenido: { 
        type: String, 
        required: true 
    },
    author: { 
        type: Schema.Types.ObjectId, 
        ref: "User",  
        required: true 
    },
    status: { 
        type: Boolean, 
        default: true, 
    },
},
{
    timestamps: true, 
    versionKey: false 
});

export default model('Publicacion', publicacionSchema);