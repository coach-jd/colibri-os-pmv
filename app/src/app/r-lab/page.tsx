"use client";

/**
 * Colibrí Reputation Lab · Panel de Vuelo del Emprendedor
 *
 * Esta página representa el panel principal que ve una persona emprendedora
 * cuando entra a Colibrí OS. Aquí:
 *
 * - Se muestra el estado actual del NFT Colibrí (dinámico: Torpor o N1).
 * - Se visualiza el Índice Colibrí (IC) calculado en base a:
 *      · microacciones registradas
 *      · evidencias registradas
 *   (datos leídos desde localStorage, simulando la futura base de datos).
 * - Se listan las 7 categorías troncales con su estado de avance.
 *
 * Modelo para este PMV:
 * - 21 microacciones (3 por cada C1–C7)
 * - 7 evidencias (1 por categoría)
 * - Fórmula IC (simple para demo):
 *      microacciones: 50% del IC
 *      evidencias:    50% del IC
 * - Regla de evolución:
 *      si microacciones >= 21 y evidencias >= 7 → NFT pasa de Torpor a N1.
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import IcRing from "@/components/IcRing";
import NftFrame from "@/components/NftFrame";
import CategoryCard from "@/components/CategoryCard";

// Clave compartida con /r-lab/evidencias
const STORAGE_KEY = "colibri_timeline_custom_events_v1";

type CategoryId = "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7";

type EntryType = "microaccion" | "evidencia";

interface EvidenceEntry {
  id: string;
  type: EntryType;
  category: CategoryId;
  title: string;
  description: string;
  isIpOnStory: boolean;
  createdAtIso: string;
}

// Tipo simple para las categorías troncales
type CategoriaTroncal = {
  id: number;
  clave: CategoryId;
  nombre: string;
  descripcionCorta: string;
  colorClase: string; // clases Tailwind como "border-c1"
  progresoMicroacciones: string;
  progresoEvidencia: string;
};

// Datos de ejemplo para el emprendedor y configuración del IC
const emprendedorDemo = {
  nombre: "Ana López",
  pais: "Chile",
  vertical: "EdTech · IP Nativa",
  proyecto: "Colibrí OS · Infraestructura educativa IP-native",
};

const MAX_MICROACCIONES = 21;
const MAX_EVIDENCIAS = 7;

// Categorías base (el texto de progreso se actualizará dinámicamente)
const categoriasBase: CategoriaTroncal[] = [
  {
    id: 1,
    clave: "C1",
    nombre: "Propósito & ADN Colibrí",
    descripcionCorta:
      "Alinea biografía, motivación y equipo alrededor de un propósito claro.",
    colorClase: "border-c1",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 2,
    clave: "C2",
    nombre: "Equipo & Alianzas",
    descripcionCorta:
      "Define roles, acuerdos y aliados clave para sostener el proyecto.",
    colorClase: "border-c2",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 3,
    clave: "C3",
    nombre: "Problema & Cliente",
    descripcionCorta:
      "Comprende el problema, el contexto y la mirada de las personas usuarias.",
    colorClase: "border-c3",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 4,
    clave: "C4",
    nombre: "Modelo & Solución",
    descripcionCorta:
      "Diseña la propuesta de valor, el modelo de impacto y la solución inicial.",
    colorClase: "border-c4",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 5,
    clave: "C5",
    nombre: "Finanzas & Viabilidad",
    descripcionCorta:
      "Explora costos, fuentes de ingreso y escenarios de sostenibilidad.",
    colorClase: "border-c5",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 6,
    clave: "C6",
    nombre: "Contexto & Factores Exógenos",
    descripcionCorta:
      "Analiza el ecosistema, riesgos, regulaciones y variables externas.",
    colorClase: "border-c6",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
  {
    id: 7,
    clave: "C7",
    nombre: "Métricas & Tracción",
    descripcionCorta:
      "Define qué vas a medir, cómo y con qué evidencias mostrarás tracción.",
    colorClase: "border-c7",
    progresoMicroacciones: "0/3 microacciones",
    progresoEvidencia: "0/1 evidencia",
  },
];

export default function ReputationLabPage() {
  const [entries, setEntries] = useState<EvidenceEntry[]>([]);

  // 1. Leer registros locales desde la pantalla de Evidencias
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as EvidenceEntry[];
      setEntries(parsed);
    } catch (err) {
      console.error("Error leyendo evidencias desde localStorage", err);
    }
  }, []);

  // 2. Derivados: conteos globales
  const {
    microaccionesCompletadas,
    evidenciasCompletadas,
    icValue,
    nftEstado,
    nftProximoNivel,
  } = useMemo(() => {
    const micro = entries.filter((e) => e.type === "microaccion").length;
    const evid = entries.filter((e) => e.type === "evidencia").length;

    const microClamped = Math.min(micro, MAX_MICROACCIONES);
    const evidClamped = Math.min(evid, MAX_EVIDENCIAS);

    // IC simple: 50% microacciones, 50% evidencias
    const microRatio =
      MAX_MICROACCIONES === 0 ? 0 : microClamped / MAX_MICROACCIONES;
    const evidRatio = MAX_EVIDENCIAS === 0 ? 0 : evidClamped / MAX_EVIDENCIAS;
    const ic = Math.round(((microRatio + evidRatio) / 2) * 100);

    // Regla de evolución Torpor → N1
    const haEvolucionado = micro >= MAX_MICROACCIONES && evid >= MAX_EVIDENCIAS;

    return {
      microaccionesCompletadas: micro,
      evidenciasCompletadas: evid,
      icValue: ic,
      nftEstado: haEvolucionado ? "Semilla de Luz (N1)" : "Torpor",
      nftProximoNivel: haEvolucionado ? "Ala Dorada (N2)" : "Semilla de Luz (N1)",
    };
  }, [entries]);

  // 3. Progreso por categoría (para las cards)
  const categoriasConProgreso: CategoriaTroncal[] = useMemo(() => {
    const porCategoria: Record<CategoryId, { micro: number; evid: number }> = {
      C1: { micro: 0, evid: 0 },
      C2: { micro: 0, evid: 0 },
      C3: { micro: 0, evid: 0 },
      C4: { micro: 0, evid: 0 },
      C5: { micro: 0, evid: 0 },
      C6: { micro: 0, evid: 0 },
      C7: { micro: 0, evid: 0 },
    };

    entries.forEach((e) => {
      const bucket = porCategoria[e.category];
      if (!bucket) return;
      if (e.type === "microaccion") bucket.micro += 1;
      if (e.type === "evidencia") bucket.evid += 1;
    });

    return categoriasBase.map((cat) => {
      const bucket = porCategoria[cat.clave];
      return {
        ...cat,
        progresoMicroacciones: `${Math.min(bucket.micro, 3)}/3 microacciones`,
        progresoEvidencia: `${Math.min(bucket.evid, 1)}/1 evidencia`,
      };
    });
  }, [entries]);

  const totalRegistros = entries.length;

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
                Aquí observas el estado actual de tu NFT Colibrí y tu progreso a
                través de las 7 categorías troncales. Este panel se alimenta de
                las microacciones y evidencias que registres en{" "}
                <Link
                  href="/r-lab/evidencias"
                  className="font-semibold text-sky-300 underline-offset-4 hover:underline"
                >
                  Evidencias &amp; IP
                </Link>
                , simulando la futura base de datos conectada a Story Protocol.
              </p>
            </div>
          </div>

          {/* Bloque con resumen de la persona emprendedora */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-600/70 bg-slate-900/70 px-4 py-3 text-xs shadow-glass">
              {/* Avatar placeholder */}
              <div className="h-10 w-10 rounded-full border border-emerald-400/70 bg-gradient-to-tr from-emerald-400/40 to-cyan-500/40" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Emprendedora Colibrí · Demo
                </p>
                <p className="text-xs font-medium text-slate-50">
                  {emprendedorDemo.nombre}
                  <span className="text-slate-400">
                    {" "}
                    · {emprendedorDemo.pais}
                  </span>
                </p>
                <p className="text-[11px] text-slate-300">
                  {emprendedorDemo.vertical}
                </p>
              </div>
            </div>

            {/* CTA hacia el timeline */}
            <Link
              href="/r-lab/timeline"
              className="inline-flex items-center rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-1.5 text-[11px] font-medium text-sky-100 shadow-sm hover:bg-sky-500/20 hover:shadow-sky-500/40"
            >
              Ver timeline de microacciones →
            </Link>

            <p className="text-[10px] text-slate-400">
              Registros locales:{" "}
              <span className="font-semibold text-slate-100">
                {totalRegistros}
              </span>
            </p>
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
                    NFT Colibrí · Estado {nftEstado}
                  </h2>
                  <p className="mt-1 text-xs text-slate-300">
                    Este NFT representa tu viaje educativo. En estado{" "}
                    <span className="font-semibold text-slate-100">
                      {nftEstado}
                    </span>{" "}
                    tu misión es completar las 21 microacciones y 7 evidencias
                    del nivel base Colibrí.
                  </p>
                </div>

                {/* "Chip" de estado del NFT */}
                <div className="inline-flex flex-col items-end gap-1 text-right">
                  <span className="rounded-full border border-slate-600/70 bg-slate-900/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-200">
                    Estado · {nftEstado}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Próximo nivel:{" "}
                    <span className="font-semibold text-cyan-300">
                      {nftProximoNivel}
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
                    Para consolidar{" "}
                    <span className="font-semibold text-cyan-300">
                      Semilla de Luz (N1)
                    </span>{" "}
                    deberás completar las 3 microacciones y la evidencia de
                    cada categoría troncal. Este panel se actualiza en función
                    de lo que registres como avance.
                  </p>
                  <ul className="text-[11px] text-slate-400">
                    <li>
                      Microacciones completadas:{" "}
                      <span className="font-semibold text-slate-200">
                        {microaccionesCompletadas} / {MAX_MICROACCIONES}
                      </span>
                    </li>
                    <li>
                      Evidencias registradas:{" "}
                      <span className="font-semibold text-slate-200">
                        {evidenciasCompletadas} / {MAX_EVIDENCIAS}
                      </span>
                    </li>
                  </ul>

                  {/* CTA secundario hacia el timeline */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    <Link
                      href="/r-lab/timeline"
                      className="inline-flex items-center rounded-full border border-sky-500/60 bg-sky-500/10 px-2.5 py-1 text-[10px] font-medium text-sky-100 hover:bg-sky-500/20"
                    >
                      Ver detalle en el Timeline →
                    </Link>
                    <Link
                      href="/r-lab/evidencias"
                      className="inline-flex items-center rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-100 hover:bg-emerald-500/20"
                    >
                      Registrar nueva evidencia →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta de Índice Colibrí (IC) usando componente IcRing */}
            <div className="rounded-3xl border border-slate-700/70 bg-slate-950/60 p-4">
              <IcRing value={icValue} max={100} />
              <p className="mt-2 text-[11px] text-slate-400">
                El IC se calcula combinando el porcentaje de microacciones y
                evidencias completadas en este nivel. Es una simulación local
                para este PMV; en producción se alimentará desde la base de
                datos y los IP Assets registrados en Story Protocol.
              </p>
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
                  {/* Pestañas navegables */}
                  <Link
                    href="/r-lab"
                    className="rounded-full bg-slate-900/80 px-2 py-0.5 font-medium text-slate-100"
                  >
                    Ficha del proyecto
                  </Link>
                  <Link
                    href="/r-lab/timeline"
                    className="rounded-full bg-slate-900/40 px-2 py-0.5 hover:bg-sky-500/20 hover:text-sky-100"
                  >
                    Timeline
                  </Link>
                  <Link
                    href="/r-lab/evidencias"
                    className="rounded-full bg-slate-900/40 px-2 py-0.5 hover:bg-emerald-500/20 hover:text-emerald-100"
                  >
                    Evidencias &amp; IP
                  </Link>
                  <Link
                    href="/r-lab/mecenazgo"
                    className="rounded-full bg-slate-900/40 px-2 py-0.5 hover:bg-fuchsia-500/20 hover:text-fuchsia-100"
                  >
                    Mecenazgo
                  </Link>
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
                      Nivel base · {nftEstado}
                    </p>
                    <p className="mt-1 text-xs text-emerald-100/90">
                      Este panel resume tu avance en la Matriz N1 (21
                      microacciones + 7 evidencias). Los datos provienen del
                      registro que realizas en la sección Evidencias &amp; IP.
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
                  {evidenciasCompletadas}/{MAX_EVIDENCIAS} evidencias ·{" "}
                  {microaccionesCompletadas}/{MAX_MICROACCIONES} microacciones
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                {categoriasConProgreso.map((cat) => (
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
