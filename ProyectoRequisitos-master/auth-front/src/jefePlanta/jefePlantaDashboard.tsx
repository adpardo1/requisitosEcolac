import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import JefePlantaLayout from '../layout/JefePlantaLayout';
import { API_URL } from '../auth/constants';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Tanquero } from '../types/types';
import lista from "../imagenes/icono lISTA.png";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Definir un tipo para las capacidades de los tanques
interface Capacidades {
    '1': number;   // TANQUE 4000L
    '2': number;   // TANQUE 7000L
    '3': number;   // TANQUE 1000L
}

// Capacidades de los tanques en litros
const CAPACIDADES: Capacidades = {
    '1': 4000,   // TANQUE 4000L
    '2': 7000,   // TANQUE 7000L
    '3': 1000   // TANQUE 1000L
};

export default function JefePlantaDashboard() {
    const auth = useAuth();
    const [registros, setRegistros] = useState<Tanquero[]>([]); // Estado para almacenar los registros

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
                const data: Tanquero[] = await response.json();
                setRegistros(data); // Actualiza el estado con los registros obtenidos

                // Verificar si hay valores en registros
                console.log('Registros cargados:', data);
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

    // Función para procesar los datos según la reserva y ajustar a la capacidad del tanque
    const processData = (reserva: keyof Capacidades) => {
        return registros
            .filter(item => item.reserva === reserva.toString()) // Filtra los registros por reserva
            .map((item, index) => {
                const capacidad = CAPACIDADES[reserva]; // Obtén la capacidad del tanque correspondiente
                const scaledValue = item.totalLitros / capacidad; // Escala el totalLitros respecto a la capacidad
                return {
                    name: item.centroAcopio,
                    value: scaledValue * 100, // Multiplica por 100 para obtener porcentaje
                    fill: COLORS[index % COLORS.length]
                };
            });
    };

    return (
        <JefePlantaLayout>
            <div className="container text-center">
                <h1 className="my-4">Cantidad Insumos</h1>
                <div className="row justify-content-center">
                    <div className="col-md-4 d-flex flex-column align-items-center">
                        <h5>TANQUE 4000L</h5>
                        <PieChart width={250} height={250}>
                            <Pie
                                data={processData('1')} // Datos para TANQUE 4000L
                                cx={125}
                                cy={125}
                                innerRadius={80}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {processData('1').map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                    <div className="col-md-4 d-flex flex-column align-items-center">
                        <h5>TANQUE 7000L</h5>
                        <PieChart width={250} height={250}>
                            <Pie
                                data={processData('2')} // Datos para TANQUE 7000L
                                cx={125}
                                cy={125}
                                innerRadius={80}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {processData('2').map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                    <div className="col-md-4 d-flex flex-column align-items-center">
                        <h5>TANQUE 1000L</h5>
                        <PieChart width={250} height={250}>
                            <Pie
                                data={processData('3')} // Datos para TANQUE 1000L
                                cx={125}
                                cy={125}
                                innerRadius={80}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {processData('3').map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </div>
                </div>
                <button className="btn btn-primary mt-4">Iniciar Planificación</button>
            </div>
        </JefePlantaLayout>
    );
}
