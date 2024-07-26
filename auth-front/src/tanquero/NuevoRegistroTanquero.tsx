import React, { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import TanqueroLayout from '../layout/TanqueroLayout';
import { API_URL } from '../auth/constants';

const opcionesCompartimento = ['C1', 'C2', 'C3'];
const opcionesCentroAcopio = ['Zamora', 'Zumbi', 'Encuentros'];

export default function NuevoRegistroTanquero() {
    const auth = useAuth();
    const [fecha, setFecha] = useState('');
    const [numero, setNumero] = useState('');
    const [centroAcopio, setCentroAcopio] = useState(opcionesCentroAcopio[0]);
    const [cantidadRecibo, setCantidadRecibo] = useState('');
    const [cantidadRegla, setCantidadRegla] = useState('');
    const [diferencia, setDiferencia] = useState('');
    const [totalLitros, setTotalLitros] = useState('');
    const [compartimento, setCompartimento] = useState(opcionesCompartimento[0]);
    const [muestraTipo, setMuestraTipo] = useState('');
    const [color, setColor] = useState(false);
    const [olor, setOlor] = useState(false);
    const [sabor, setSabor] = useState(false);
    const [alcohol, setAlcohol] = useState(false);
    const [acidez, setAcidez] = useState('');
    const [densidad, setDensidad] = useState('');
    const [temperatura, setTemperatura] = useState('');
    const [mastitis, setMastitis] = useState({ mastitisA: false, mastitisB: false });
    const [otros, setOtros] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [mensaje, setMensaje] = useState('');

    const handleCantidadReciboChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCantidadRecibo(value);
        calculateDiferenciaAndTotalLitros(cantidadRegla, value);
    };

    const handleCantidadReglaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCantidadRegla(value);
        calculateDiferenciaAndTotalLitros(value, cantidadRecibo);
    };

    const calculateDiferenciaAndTotalLitros = (cantidadRegla: string, cantidadRecibo: string) => {
        const regla = parseFloat(cantidadRegla) || 0;
        const recibo = parseFloat(cantidadRecibo) || 0;
        setDiferencia((regla - recibo).toString());
        setTotalLitros(cantidadRegla);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/tanquero`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fecha,
                    numero,
                    centroAcopio,
                    cantidadRecibo,
                    cantidadRegla,
                    diferencia,
                    totalLitros,
                    compartimento,
                    muestraTipo,
                    pruebasRealizadas: [
                        {
                            compartimento,
                            color,
                            olor,
                            sabor,
                            alcohol,
                            acidez,
                            densidad,
                            temperatura,
                            mastitisA: mastitis.mastitisA,
                            mastitisB: mastitis.mastitisB,
                            otros,
                        }
                    ],
                    observaciones,
                }),
            });

            if (response.ok) {
                // Enviar correo electrónico
                const emailResponse = await fetch(`${API_URL}/send-email`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        to: 'jefe.planta@ejemplo.com', // Cambia la dirección según sea necesario
                        subject: 'Nuevo Registro de Tanquero',
                        text: `Se ha creado un nuevo registro con los siguientes detalles:\n\n${JSON.stringify({
                            fecha,
                            numero,
                            centroAcopio,
                            cantidadRecibo,
                            cantidadRegla,
                            diferencia,
                            totalLitros,
                            compartimento,
                            muestraTipo,
                            pruebasRealizadas: [
                                {
                                    compartimento,
                                    color,
                                    olor,
                                    sabor,
                                    alcohol,
                                    acidez,
                                    densidad,
                                    temperatura,
                                    mastitisA: mastitis.mastitisA,
                                    mastitisB: mastitis.mastitisB,
                                    otros,
                                }
                            ],
                            observaciones,
                        }, null, 2)}`
                    }),
                });

                if (emailResponse.ok) {
                    setMensaje('Registro guardado correctamente y correo enviado.');
                } else {
                    setMensaje('Registro guardado, y el correo.');
                }

                // Limpiar los campos después de guardar
                setFecha('');
                setNumero('');
                setCentroAcopio(opcionesCentroAcopio[0]);
                setCantidadRecibo('');
                setCantidadRegla('');
                setDiferencia('');
                setTotalLitros('');
                setCompartimento(opcionesCompartimento[0]);
                setMuestraTipo('');
                setColor(false);
                setOlor(false);
                setSabor(false);
                setAlcohol(false);
                setAcidez('');
                setDensidad('');
                setTemperatura('');
                setMastitis({ mastitisA: false, mastitisB: false });
                setOtros('');
                setObservaciones('');
            } else {
                setMensaje('Error al guardar el registro');
                console.error('Error al guardar el registro');
            }
        } catch (error) {
            setMensaje('Error durante el envío');
            console.error('Error durante el envío:', error);
        }
    }

    return (
        <TanqueroLayout>
            <div className="container mt-4">
                <h1 className="text-center mb-4">Nuevo Registro</h1>
                {mensaje && <div className="alert alert-info">{mensaje}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="fecha" className="form-label">Fecha:</label>
                            <input
                                type="date"
                                className="form-control form-control-lg"
                                id="fecha"
                                name="fecha"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="numero" className="form-label">Nro:</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                id="numero"
                                name="numero"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="centro_acopio" className="form-label">Centro Acopio:</label>
                            <select
                                className="form-select"
                                id="centro_acopio"
                                name="centro_acopio"
                                value={centroAcopio}
                                onChange={(e) => setCentroAcopio(e.target.value)}
                            >
                                {opcionesCentroAcopio.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="cantidad_recibo" className="form-label">Cantidad en litros por recibo:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cantidad_recibo"
                                name="cantidad_recibo"
                                value={cantidadRecibo}
                                onChange={handleCantidadReciboChange}
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="cantidad_regla" className="form-label">Cantidad en litros por regla:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="cantidad_regla"
                                name="cantidad_regla"
                                value={cantidadRegla}
                                onChange={handleCantidadReglaChange}
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="diferencia" className="form-label">Diferencia:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="diferencia"
                                name="diferencia"
                                value={diferencia}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="total_litros" className="form-label">Total Litros:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="total_litros"
                                name="total_litros"
                                value={totalLitros}
                                readOnly
                            />
                        </div>
                        <div className="col-md-6">
                            <label htmlFor="compartimento" className="form-label">Compartimento:</label>
                            <select
                                className="form-select"
                                id="compartimento"
                                name="compartimento"
                                value={compartimento}
                                onChange={(e) => setCompartimento(e.target.value)}
                            >
                                {opcionesCompartimento.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label htmlFor="muestra_tipo" className="form-label">Tipo de Muestra:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="muestra_tipo"
                                name="muestra_tipo"
                                value={muestraTipo}
                                onChange={(e) => setMuestraTipo(e.target.value)}
                            />
                        </div>
                    </div>
                    <h2 className="mb-3">Pruebas Realizadas</h2>
                    <div className="table-responsive">
                        <table className="table table-bordered text-center">
                            <thead>
                                <tr>
                                    <th>Prueba</th>
                                    <th>Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Color</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={color}
                                            onChange={(e) => setColor(e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Olor</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={olor}
                                            onChange={(e) => setOlor(e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Sabor</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={sabor}
                                            onChange={(e) => setSabor(e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Alcohol</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={alcohol}
                                            onChange={(e) => setAlcohol(e.target.checked)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Acidez</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={acidez}
                                            onChange={(e) => setAcidez(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Densidad</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={densidad}
                                            onChange={(e) => setDensidad(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Temperatura</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={temperatura}
                                            onChange={(e) => setTemperatura(e.target.value)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Mastitis A</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={mastitis.mastitisA}
                                            onChange={(e) =>
                                                setMastitis((prevState) => ({
                                                    ...prevState,
                                                    mastitisA: e.target.checked,
                                                }))
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Mastitis B</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={mastitis.mastitisB}
                                            onChange={(e) =>
                                                setMastitis((prevState) => ({
                                                    ...prevState,
                                                    mastitisB: e.target.checked,
                                                }))
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>Otros</td>
                                    <td>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={otros}
                                            onChange={(e) => setOtros(e.target.value)}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="observaciones" className="form-label">Observaciones:</label>
                        <textarea
                            className="form-control"
                            id="observaciones"
                            name="observaciones"
                            rows="3"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-lg w-100">
                        Guardar
                    </button>
                </form>
            </div>
        </TanqueroLayout>
    );
}
