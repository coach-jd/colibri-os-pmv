// src/app/r-lab/page.tsx

/**
 * Colibrí Reputation Lab · Panel de Vuelo del Emprendedor
 *
 * Esta página representa el panel principal que ve una persona emprendedora
 * cuando entra a Colibrí OS. Aquí:
 *
 * - Se muestra el estado actual del NFT Colibrí (en este PMV: TORPOR).
 * - Se visualiza el Índice Colibrí (IC) como resumen de progreso.
 * - Se listan las 7 categorías troncales con su estado de avance.
 * - Se prepara el espacio para pestañas tipo:
 *   "Ficha del proyecto", "Timeline", "Evidencias & IP", "Mecenazgo", etc.
 *
 * IMPORTANTE (Modelo Educativo):
 * - El NFT Colibrí nace en estado TORPOR (estado inicial).
 * - El emprendedor debe completar 21 microacciones + 7 evidencias
 *   (3 microacciones + 1 evidencia por cada categoría C1–C7).
 * - Cuando completa ese conjunto, el NFT evoluciona a "Semilla de Luz (N1)".
 *
 * En esta primera versión del PMV:
 * - Los datos están "mockeados" (hardcoded).
 * - Más adelante conectaremos esto con:
 *   - Base de datos (Prisma + PostgreSQL).
 *   - Registro de IP en Story Protocol.
 *   - NFT dinámico onchain.
 */

import Link from "next/link";
import IcRing from "@/components/IcRing";
import NftFrame from "@/components/NftFrame";
import CategoryCard from "@/components/CategoryCard";

// Tipo simple para las categorías troncales
type CategoriaTroncal = {
  id: number;
  clave: string;
  nombre: string;
  descripcionCorta: string;
  colorClase: string; // usamos clases Tailwind como "border-c1"
  progresoMicroacciones: string; // ej: "0/3 microacciones"
  progresoEvidencia: string; // ej: "0/1 evidencia"
};

// Datos de ejemplo para el emprendedor y las categorías
const emprendedorDemo = {
  nombre: "Ana López",
  pais: "Chile",
  vertical: "EdTech · IP Nativa",
  proyecto: "Colibrí OS · Infraestructura educativa IP-native",
  estadoNft: "Torpor (estado inicial)",
  icActual: 0,
  icMax: 100,
};

const categorias: CategoriaTroncal[] = [
  {
    id: 1,
    clave: "C1",
    nombre: "Propósito & Equipo",
    descripcionCorta:
      "Alinea biografía, motivación y equipo alrededor de un propósito claro.",
    colorClase: "border-c1",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 2,
    clave: "C2",
    nombre: "Problema & Contexto",
    descripcionCorta:
      "Define el problema, el contexto y la urgencia desde la mirada del usuario.",
    colorClase: "border-c2",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 3,
    clave: "C3",
    nombre: "Modelo & Propuesta de Valor",
    descripcionCorta:
      "Esboza la solución, la propuesta de valor y el modelo de impacto/negocio.",
    colorClase: "border-c3",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 4,
    clave: "C4",
    nombre: "Finanzas & Sostenibilidad",
    descripcionCorta:
      "Explora costos, fuentes de ingreso y sostenibilidad económica.",
    colorClase: "border-c4",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 5,
    clave: "C5",
    nombre: "Timing & Estrategia",
    descripcionCorta:
      "Conecta el momento adecuado con la estrategia de entrada al mercado.",
    colorClase: "border-c5",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 6,
    clave: "C6",
    nombre: "Entorno & Factores Exógenos",
    descripcionCorta:
      "Lee el ecosistema, aliados, riesgos y factores fuera de tu control.",
    colorClase: "border-c6",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 7,
    clave: "C7",
    nombre: "Métricas & Tracción",
    descripcionCorta:
      "Define qué vas a medir, cómo y con qué evidencias demostrarás tracción.",
    colorClase: "border-c7",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
];

export default function ReputationLabPage() {
  return (
    <main className="flex flex-1 items-start justify-center py-6 md:py-10">
      {/* Panel principal con efecto glassmorphism */}
      <section className="colibri-panel w-full max-w-6xl rounded-3xl px-4 py-5 md:px-8 md:py-7">
        {/* ENCABEZADO DEL PANEL */}
        <header className="mb-6 flex flex-col gap-4 border-b border-slate-700/60 pb-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            {/* Breadcrumb simple para volver al onboarding */}
            <div className="text-[11px] uppercase tracking-[0.24em] text-slate-400">
              <Link
                href="/"
                className="text-slate-400 underline-offset-4 hover:text-slate-100 hover:underline"
              >
                Colibrí OS
              </Link>{" "}
              · <span className="text-slate-300">Reputation Lab</span>
            </div>

            <div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-50 md:text-2xl">
                Panel de Vuelo · Emprendedor Colibrí
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-300 md:text-[15px]">
                Aquí observas el estado actual de tu NFT Colibrí y tu progreso
                a través de las 7 categorías troncales. Este panel representa el
                inicio del viaje: tu NFT se encuentra en{" "}
                <span className="font-semibold text-slate-100">
                  estado Torpor
                </span>
                , preparándose para evolucionar a{" "}
                <span className="font-semibold text-cyan-300">
                  Semilla de Luz (N1)
                </span>
                .
              </p>
            </div>
          </div>

          {/* Bloque con resumen de la persona emprendedora */}
          <div className="flex items-center gap-3 rounded-2xl border border-slate-600/70 bg-slate-900/70 px-4 py-3 text-xs shadow-glass">
            {/* Avatar placeholder */}
            <div className="h-10 w-10 rounded-full border border-emerald-400/70 bg-gradient-to-tr from-emerald-400/40 to-cyan-500/40" />
            <div className="space-y-0.5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Emprendedora Colibrí · Demo
              </p>
              <p className="text-xs font-medium text-slate-50">
                {emprendedorDemo.nombre}
                <span className="text-slate-400"> · {emprendedorDemo.pais}</span>
              </p>
              <p className="text-[11px] text-slate-300">
                {emprendedorDemo.vertical}
              </p>
            </div>
          </div>
        </header>

        {/* CUERPO · DISEÑO EN 2 COLUMNAS */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.6fr)]">
          {/* COLUMNA IZQUIERDA · Tu Colibrí hoy */}
          <div className="space-y-4">
            {/* Tarjeta principal: NFT + resumen de estado */}
            <div className="rounded-3xl border border-slate-700/70 bg-slate-950/60 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Tu Colibrí hoy
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-slate-50">
                    NFT Colibrí · Estado Torpor
                  </h2>
                  <p className="mt-1 text-xs text-slate-300">
                    Este NFT representa tu viaje educativo. En estado{" "}
                    <span className="font-semibold text-slate-100">
                      Torpor
                    </span>{" "}
                    estás declarando el compromiso de iniciar tu proceso formativo
                    Colibrí (nivel base N1).
                  </p>
                </div>

                {/* "Chip" de estado del NFT */}
                <div className="inline-flex flex-col items-end gap-1 text-right">
                  <span className="rounded-full border border-slate-600/70 bg-slate-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                    Estado · Torpor
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Próximo nivel:{" "}
                    <span className="font-semibold text-cyan-300">
                      Semilla de Luz (N1)
                    </span>
                  </span>
                </div>
              </div>

              {/* Zona inferior: frame del NFT + microresumen */}
              <div className="mt-4 flex gap-4">
                {/* Frame del NFT Colibrí (componente reutilizable) */}
                <NftFrame />

                <div className="flex-1 space-y-2 text-xs">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      Trayectoria educativa · Torpor → N1
                    </span>
                    <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">
                      21 microacciones + 7 evidencias
                    </span>
                  </div>
                  <p className="text-slate-300">
                    Para evolucionar a{" "}
                    <span className="font-semibold text-cyan-300">
                      Semilla de Luz (N1)
                    </span>{" "}
                    deberás completar las 3 microacciones y la evidencia de
                    cada categoría troncal.
                  </p>
                  <ul className="text-[11px] text-slate-400">
                    <li>
                      Microacciones completadas:{" "}
                      <span className="font-semibold text-slate-200">
                        0 / 21
                      </span>
                    </li>
                    <li>
                      Evidencias registradas:{" "}
                      <span className="font-semibold text-slate-200">
                        0 / 7
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tarjeta de Índice Colibrí (IC) usando componente IcRing */}
            <div className="rounded-3xl border border-slate-700/70 bg-slate-950/60 p-4">
              <IcRing value={emprendedorDemo.icActual} max={emprendedorDemo.icMax} />
            </div>
          </div>

          {/* COLUMNA DERECHA · Categorías troncales + pestañas futuras */}
          <div className="space-y-4">
            {/* Bloque de pestañas principales (estructura base) */}
            <div className="rounded-3xl border border-slate-700/70 bg-slate-950/60 p-3 md:p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Vista consolidada
                </p>
                <div className="flex flex-wrap gap-1 text-[10px] text-slate-400">
                  <span className="rounded-full bg-slate-900/80 px-2 py-0.5">
                    Ficha del proyecto
                  </span>
                  <span className="rounded-full bg-slate-900/40 px-2 py-0.5">
                    Timeline
                  </span>
                  <span className="rounded-full bg-slate-900/40 px-2 py-0.5">
                    Evidencias & IP
                  </span>
                  <span className="rounded-full bg-slate-900/40 px-2 py-0.5">
                    Mecenazgo
                  </span>
                </div>
              </div>

              {/* Contenido base de "Ficha del proyecto" (PMV simplificado) */}
              <div className="space-y-3 text-xs md:text-sm">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Proyecto asociado
                  </p>
                  <p className="mt-1 font-medium text-slate-100">
                    {emprendedorDemo.proyecto}
                  </p>
                  <p className="mt-1 text-slate-300">
                    En la versión completa este bloque se alimentará de un
                    registro de IP educativa (Story Protocol) vinculado al NFT
                    Colibrí como
                    <span className="font-semibold text-slate-100">
                      {" "}
                      IP Asset fundacional
                    </span>
                    .
                  </p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                      Estado educativo
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-50">
                      Preparando nivel base N1
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/90">
                      Aún no has registrado microacciones. Este panel está listo
                      para acompañarte cuando comiences tu recorrido en la
                      Matriz N1 (21 microacciones + 7 evidencias).
                    </p>
                  </div>

                  <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/5 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                      Story Protocol (visión)
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-50">
                      Registro de IP educativa
                    </p>
                    <p className="mt-1 text-xs text-cyan-100/90">
                      Más adelante, cada evidencia generará un activo de
                      Propiedad Intelectual (IP Asset) con licenciamiento
                      programable (PIL) y regalías IPFi asociadas al NFT.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de categorías troncales usando CategoryCard */}
            <div className="rounded-3xl border border-slate-700/70 bg-slate-950/60 p-3 md:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Categorías troncales · Nivel base
                </p>
                <p className="text-[11px] text-slate-400">
                  0/7 evidencias registradas · 0/21 microacciones
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {categorias.map((cat) => (
                  <CategoryCard
                    key={cat.id}
                    clave={cat.clave}
                    nombre={cat.nombre}
                    descripcion={cat.descripcionCorta}
                    progresoMicroacciones={cat.progresoMicroacciones}
                    progresoEvidencia={cat.progresoEvidencia}
                    colorClase={cat.colorClase}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
