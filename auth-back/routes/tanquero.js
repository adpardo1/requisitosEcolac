const express = require('express');
const { jsonResponse } = require('../lib/jsonResponse');
const sendEmail = require('../routes/sendEmail'); // Asegúrate de la ruta correcta
const router = express.Router();
const Tanquero = require('../schema/tanquero');

router.post('/', async (req, res) => {
    try {
        const {
            fecha,
            numero,
            centroAcopio,
            cantidadRecibo,
            cantidadRegla,
            diferencia,
            totalLitros,
            compartimento,
            muestraTipo,
            pruebasRealizadas,
            observaciones,
            reserva
        } = req.body;

        const newRegistro = new Tanquero({
            fecha,
            numero,
            centroAcopio,
            cantidadRecibo,
            cantidadRegla,
            diferencia,
            totalLitros,
            compartimento,
            muestraTipo,
            pruebasRealizadas,
            observaciones,
            reserva
        });

        await newRegistro.save();

        // Enviar correo electrónico al 'Jefe Planta'
        const subject = 'Nuevo Registro de Tanquero';
        const text = `Se ha creado un nuevo registro con los siguientes detalles:\n\n${JSON.stringify({
            fecha,
            numero,
            centroAcopio,
            cantidadRecibo,
            cantidadRegla,
            diferencia,
            totalLitros,
            compartimento,
            muestraTipo,
            pruebasRealizadas,
            observaciones,
            reserva
        }, null, 2)}`;

        await sendEmail('real.emilio14@hotmail.com', subject, text); // Cambia la dirección de correo electrónico por la correcta

        res.json(jsonResponse(true, 'Registro guardado correctamente'));
    } catch (error) {
        console.error('Error al guardar el registro:', error);
        res.status(500).json(jsonResponse(false, 'Error al guardar el registro'));
    }
});

router.get('/', async (req, res) => {
    try {
        const registros = await Tanquero.find();
        res.status(200).json(registros);
    } catch (error) {
        console.error("Error al obtener registros:", error.message);
        res.status(500).json({ error: "Error interno al obtener registros" });
    }
});

router.put('/:id/aprobar', async (req, res) => {
    const { id } = req.params;
    const { reserva } = req.body;

    try {
        const registroActualizado = await Tanquero.findByIdAndUpdate(id, {
            estado: 'aprobado',
            reserva
        }, { new: true });

        if (!registroActualizado) {
            return res.status(404).json(jsonResponse(false, 'Registro no encontrado'));
        }
        res.status(200).json(jsonResponse(true, 'Registro aprobado correctamente', registroActualizado));
    } catch (error) {
        console.error('Error al aprobar el registro:', error);
        res.status(500).json(jsonResponse(false, 'Error al aprobar el registro'));
    }
});

module.exports = router;
