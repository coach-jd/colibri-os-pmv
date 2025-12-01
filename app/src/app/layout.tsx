// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colibrí OS · Panel de Vuelo",
  description:
    "PMV del Panel de Vuelo Colibrí OS: Reputation Lab, Mecenas y Reputation Market.",
};

/**
 * Componente raíz de la aplicación.
 * Aquí definimos:
 * - El HTML base.
 * - La clase de fondo global (colibri-bg).
 * - El contenedor principal donde se renderizan las páginas.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="colibri-bg min-h-screen antialiased">
        {/* 
          Contenedor que centra el contenido en pantallas grandes y
          da un padding general en móviles.
        */}
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 md:px-8 md:py-10">
          {children}
        </div>
      </body>
    </html>
  );
}
