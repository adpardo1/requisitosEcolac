import React, { useState, useEffect } from 'react';
import JefePlantaLayout from '../layout/JefePlantaLayout';
import { useAuth } from '../auth/AuthProvider';
import { API_URL } from '../auth/constants';
import { Tanquero, PruebasRealizadas } from '../types/types'; // Asegúrate de importar correctamente los tipos necesarios

export default function MateriaPrima() {
    const auth = useAuth();
    const [registros, setRegistros] = useState<Tanquero[]>([]); // Estado para almacenar los registros
    const [reservaValue, setReservaValue] = useState<string>(''); // Estado para almacenar el valor de la reserva

    // Función para cargar los registros desde la API
    const fetchRegistros = async () => {
        try {
            const response = await fetch(`${API_URL}/tanquero`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const data = await response.json();
                setRegistros(data); // Actualiza el estado con los registros obtenidos
            } else {
                console.error('Error al obtener registros:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
        }
    };
    useEffect(() => {
        fetchRegistros();
    }, []); // Solo se ejecuta una vez al montar el componente

    // Función para aprobar un registro específico y asignar valor de reserva
    const aprobarRegistro = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/tanquero/${id}/aprobar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reserva: reservaValue }) // Incluye el valor de reserva en la solicitud PUT
            });

            if (response.ok) {
                console.log('Registro aprobado correctamente');
                // Actualizar el estado local para reflejar el cambio
                const updatedRegistros = registros.map(registro => {
                    if (registro._id === id) {
                        return { ...registro, estado: 'aprobado', reserva: reservaValue }; // Actualiza el valor de reserva
                    }
                    return registro;
                });
                setRegistros(updatedRegistros);
            } else {
                console.error('Error al aprobar el registro:', response.statusText);
            }
        } catch (error) {
            console.error('Error durante la solicitud:', error);
        }
    };

    // Función para actualizar el valor de reserva cuando se selecciona otro valor
    const handleReservaChange = (valor: string) => {
        setReservaValue(valor);
    };

    return (
        <JefePlantaLayout>
            <div className="container mt-4">
                <h1>Jefe Planta Materia Prima</h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Número</th>
                            <th>Centro Acopio</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map(registro => (
                            <tr key={registro._id}>
                                <td>{new Date(registro.fecha).toLocaleDateString()}</td>
                                <td>{registro.numero}</td>
                                <td>{registro.centroAcopio}</td>
                                <td>{registro.estado}</td>
                                <td>
                                    {registro.estado === 'nuevo' && (
                                        <>
                                            <button
                                                className="btn btn-success mr-2"
                                                onClick={() => aprobarRegistro(registro._id)}
                                            >
                                                Aprobar
                                            </button>
                                            <select
                                                className="form-control"
                                                value={registro.reserva || ''}
                                                onChange={(e) => handleReservaChange(e.target.value)}
                                            >
                                                <option value="">Seleccionar...</option>
                                                <option value="1">Tanque 1</option>
                                                <option value="2">Tanque 2</option>
                                                <option value="3">Tanque 3</option>
                                            </select>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </JefePlantaLayout>
    );
}