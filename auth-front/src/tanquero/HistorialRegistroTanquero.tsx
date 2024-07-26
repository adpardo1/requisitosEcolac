import React, { useState, useEffect } from 'react';
import TanqueroLayout from '../layout/TanqueroLayout';
import { useAuth } from '../auth/AuthProvider';
import { API_URL } from '../auth/constants';
import { Tanquero } from '../types/types'; // Asegúrate de importar correctamente el tipo Tanquero

export default function HistorialRegistroTanquero() {
    const auth = useAuth();
    const [registros, setRegistros] = useState<Tanquero[]>([]); // Estado para almacenar los registros

    useEffect(() => {
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
                    // Filtrar registros por estado 'nuevo'
                    const nuevosRegistros = data.filter((registro: Tanquero) => registro.estado === 'nuevo');
                    setRegistros(nuevosRegistros); // Actualiza el estado con los registros filtrados
                } else {
                    console.error('Error al obtener registros:', response.statusText);
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };

        fetchRegistros();
    }, []); // Dependencia para ejecutar efecto solo una vez al montar el componente

    return (
        <TanqueroLayout>
            <div className="container mt-4">
                <h1>Historial de registros de tanquero</h1>
                <div className="row">
                    <div className="col">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Número</th>
                                    <th>Centro Acopio</th>
                                    <th>Cantidad Recibo</th>
                                    <th>Cantidad Regla</th>
                                    <th>Diferencia</th>
                                    <th>Total Litros</th>
                                    <th>Compartimento</th>
                                    <th>Tipo de Muestra</th>
                                    <th>Color</th>
                                    <th>Olor</th>
                                    <th>Sabor</th>
                                    <th>Alcohol</th>
                                    <th>Acidez</th>
                                    <th>Densidad</th>
                                    <th>Temperatura</th>
                                    <th>Mastitis A</th>
                                    <th>Mastitis B</th>
                                    <th>Otros</th>
                                    <th>Observaciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registros.map((registro) => (
                                    <tr key={registro._id}>
                                        <td>{new Date(registro.fecha).toLocaleDateString()}</td>
                                        <td>{registro.numero}</td>
                                        <td>{registro.centroAcopio}</td>
                                        <td>{registro.cantidadRecibo}</td>
                                        <td>{registro.cantidadRegla}</td>
                                        <td>{registro.diferencia}</td>
                                        <td>{registro.totalLitros}</td>
                                        <td>{registro.compartimento}</td>
                                        <td>{registro.muestraTipo}</td>
                                        <td>{registro.pruebasRealizadas[0]?.color ? 'Sí' : 'No'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.olor ? 'Sí' : 'No'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.sabor ? 'Sí' : 'No'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.alcohol ? 'Sí' : 'No'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.acidez}</td>
                                        <td>{registro.pruebasRealizadas[0]?.densidad}</td>
                                        <td>{registro.pruebasRealizadas[0]?.temperatura}</td>
                                        <td>{registro.pruebasRealizadas[0]?.mastitisA ? 'Sí' : 'No'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.mastitisB ? 'Sí' : 'No'}</td>
                                        <td>{registro.pruebasRealizadas[0]?.otros}</td>
                                        <td>{registro.observaciones}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </TanqueroLayout>
    );
}
