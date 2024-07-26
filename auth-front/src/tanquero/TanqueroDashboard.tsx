import { useAuth } from '../auth/AuthProvider';
import TanqueroLayout from '../layout/TanqueroLayout';
import { Outlet } from 'react-router-dom';


export default function TanqueroDashboard() {
    const auth = useAuth();
    const user = auth.getUser();
    return (
        <TanqueroLayout>
            <h1>Tanquero</h1>
            <div>
                <strong>Bienvenido @</strong> {user?.userName}
                <button type="submit">Nuevo Registro</button>
                <button type="submit">Historial</button>
            </div>
            <Outlet />
        </TanqueroLayout>
    );
}
