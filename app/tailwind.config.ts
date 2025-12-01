import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/(routes)/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Paleta base Colibrí (puedes ajustar los hex según tu Manual de Marca)
        colibri: {
          fondo: "#050816",
          glass: "rgba(15, 23, 42, 0.75)",
          borde: "rgba(148, 163, 184, 0.35)",
          texto: "#E5E7EB",
          acento: "#22D3EE", // turquesa
          aura: "#A855F7",   // violeta
          alerta: "#F97316", // naranja
        },
        // 🎯 Colores por categoría troncal (provisorios; luego los alineamos 1:1)
        c1: "#22C55E", // Propósito & Equipo
        c2: "#F97316", // Problema
        c3: "#3B82F6", // Modelo
        c4: "#EAB308", // Finanzas
        c5: "#06B6D4", // Timing
        c6: "#EC4899", // Entorno / Factores
        c7: "#8B5CF6", // Métricas & Tracción
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glass: "0 18px 45px rgba(15, 23, 42, 0.75)",
      },
      backdropBlur: {
        glass: "18px",
      },
    },
  },
  plugins: [],
};

export default config;
