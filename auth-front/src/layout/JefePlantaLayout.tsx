import React, { useState } from "react";
import { Icon } from '@iconify/react';
import { Link } from "react-router-dom";
import logoImage from "../imagenes/ecolac-logo.jpg";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";

export default function JefePlantaLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  async function handleSignout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/signout`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.getRefreshToken()}`,
        },
      });

      if (response.ok) {
        auth.signOut();
      }
    } catch (error) {
      console.error('Error during signout:', error);
    }
  }
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <Icon icon="bi:justify-left" />
      </button>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <img src={logoImage} alt="Logo" className="logo" />
        <div className="menu-section">
          <h3>Registros</h3>
          <ul>
            <li>
              <Link to="/MateriaPrima">
                Materia Prima
              </Link>
            </li>
            <li>
              <Link to="/pruebas">
                Pruebas
              </Link>
            </li>
            <li>
              <Link to="/produccion">
                Producción
              </Link>
            </li>
            <li>
              <Link to="/almacenamiento">
                Almacenamiento
              </Link>
            </li>
            <li>
              <Link to="/ventas">
                Ventas
              </Link>
            </li>
          </ul>
        </div>
        <div className="menu-section">
          <h3>Trazabilidad</h3>
          <ul>
            <li>
              <Link to="/codigo-de-barras">
                Código de barras
              </Link>
            </li>
            <li>
              <Link to="/reclamos">
                Reclamos
              </Link>
            </li>
          </ul>
        </div>
        <div className="menu-section">
          <h3>Trazabilidad</h3>
          <ul>
            <li>
              <Link to="/informes">
                Informes
              </Link>
            </li>
          </ul>
        </div>
        <div className="logout-section">
          <a href="#" onClick={handleSignout}>
            <Icon icon="material-symbols:logout" />
            Cerrar sesión
          </a>
        </div>
      </div>
      <div className={`content ${sidebarOpen ? 'shifted' : ''}`}>
        {children}
      </div>
    </>
  );
}