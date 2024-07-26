const mongoose = require("mongoose");
const TanqueroSchema = new mongoose.Schema({
    fecha: { type: Date, required: true },
    numero: { type: String, required: true },
    centroAcopio: { type: String, required: true },
    cantidadRecibo: { type: Number, required: true },
    cantidadRegla: { type: Number, required: true },
    diferencia: { type: Number, required: true },
    totalLitros: { type: Number, required: true },
    compartimento: { type: String, enum: ['C1', 'C2', 'C3'], required: true },
    muestraTipo: { type: String, required: true },
    estado: { type: String, enum: ['nuevo', 'aprobado'], default: 'nuevo', required: true },
    pruebasRealizadas: [{
        compartimento: { type: String, enum: ['C1', 'C2', 'C3'], required: true },
        color: { type: Boolean, default: false },
        olor: { type: Boolean, default: false },
        sabor: { type: Boolean, default: false },
        alcohol: { type: Boolean, default: false },
        acidez: { type: String },
        densidad: { type: String },
        temperatura: { type: String },
        mastitisA: { type: Boolean, default: false },
        mastitisB: { type: Boolean, default: false },
        otros: { type: String }
    }],
    observaciones: { type: String },
    reserva: { type: String, default: null }
});

module.exports = mongoose.model("Tanquero", TanqueroSchema);