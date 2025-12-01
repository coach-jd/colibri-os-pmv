"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type CategoryId = "C1" | "C2" | "C3" | "C4" | "C5" | "C6" | "C7";

type TimelineEventType = "microaccion" | "evidencia" | "hito";

interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  category: CategoryId | null; // null para hitos generales (ej: evolución NFT)
  level: string; // "Torpor", "N1", etc.
  title: string;
  description: string;
  dateLabel: string; // visible
  isoDate: string; // para ordenar
  completed: boolean;
  isIpOnStory: boolean; // mock: true si “registrado” en Story
}

/**
 * Clave usada por /r-lab/evidencias para guardar registros locales.
 * Aquí la leemos y convertimos esos registros al formato del Timeline.
 */
const STORAGE_KEY = "colibri_timeline_custom_events_v1";

// 🧪 Mock de eventos de Ana (puedes ajustar textos cuando quieras)
const mockEvents: TimelineEvent[] = [
  {
    id: "ev-008",
    type: "hito",
    category: null,
    level: "Torpor",
    title: "Ana recibe su NFT Colibrí en estado Torpor",
    description:
      "Inicio del viaje educativo Colibrí LATAM. Ana acepta el compromiso de completar las 21 microacciones + 7 evidencias para alcanzar Semilla de Luz (N1).",
    dateLabel: "09 Feb 2026",
    isoDate: "2026-02-09",
    completed: true,
    isIpOnStory: false,
  },
  {
    id: "ev-007",
    type: "microaccion",
    category: "C1",
    level: "Torpor",
    title: "Microacción C1.1 — Declaración de Propósito Personal",
    description:
      "Ana redacta su declaración de propósito personal conectando su historia, sus dones y el impacto que quiere generar como emprendedora Colibrí.",
    dateLabel: "10 Feb 2026",
    isoDate: "2026-02-10",
    completed: true,
    isIpOnStory: false,
  },
  {
    id: "ev-006",
    type: "microaccion",
    category: "C1",
    level: "Torpor",
    title: "Microacción C1.2 — Identidad Colibrí (Narrativa Underdog)",
    description:
      "Ana define su narrativa underdog: de dónde viene, qué desafíos ha enfrentado y por qué su historia la prepara para liderar su proyecto.",
    dateLabel: "12 Feb 2026",
    isoDate: "2026-02-12",
    completed: true,
    isIpOnStory: false,
  },
  {
    id: "ev-005",
    type: "microaccion",
    category: "C1",
    level: "Torpor",
    title: "Microacción C1.3 — Mapa de Fortalezas y Limitaciones",
    description:
      "Ana completa su FODA personal identificando fortalezas, debilidades, oportunidades y amenazas clave para su viaje emprendedor.",
    dateLabel: "14 Feb 2026",
    isoDate: "2026-02-14",
    completed: true,
    isIpOnStory: false,
  },
  {
    id: "ev-004",
    type: "evidencia",
    category: "C1",
    level: "Torpor",
    title: "Evidencia C1-N1 — Documento Integrado de Propósito",
    description:
      "Ana integra sus tres microacciones en un documento formal (IP educativa) que resume su propósito, narrativa underdog y FODA personal.",
    dateLabel: "16 Feb 2026",
    isoDate: "2026-02-16",
    completed: true,
    isIpOnStory: true, // mock: como si se hubiera registrado en Story Protocol
  },
  {
    id: "ev-003",
    type: "microaccion",
    category: "C2",
    level: "Torpor",
    title: "Microacción C2.1 — Mapa de Actores Clave del Equipo",
    description:
      "Ana identifica los roles críticos para su proyecto (cofundadores, advisors, aliados) y los clasifica según su nivel de compromiso actual.",
    dateLabel: "18 Feb 2026",
    isoDate: "2026-02-18",
    completed: true,
    isIpOnStory: false,
  },
  {
    id: "ev-002",
    type: "microaccion",
    category: "C2",
    level: "Torpor",
    title: "Microacción C2.2 — Acuerdos de Confianza y Colaboración",
    description:
      "Diseña un borrador de acuerdos de colaboración y principios de trabajo para su equipo núcleo.",
    dateLabel: "20 Feb 2026",
    isoDate: "2026-02-20",
    completed: false,
    isIpOnStory: false,
  },
  {
    id: "ev-001",
    type: "evidencia",
    category: "C2",
    level: "Torpor",
    title: "Evidencia C2-N1 — One-pager del Equipo Colibrí",
    description:
      "Documento que presenta a los miembros clave, sus roles, fortalezas y el acuerdo de colaboración inicial. (Pendiente de completar).",
    dateLabel: "Por completar",
    isoDate: "2026-02-28",
    completed: false,
    isIpOnStory: false,
  },
];

// Helpers de UI

const categoryMeta: Record<
  CategoryId,
  { label: string; colorClass: string; softClass: string }
> = {
  C1: {
    label: "C1 — Propósito & ADN Colibrí",
    colorClass: "bg-emerald-500 text-white",
    softClass: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40",
  },
  C2: {
    label: "C2 — Equipo & Alianzas",
    colorClass: "bg-sky-500 text-white",
    softClass: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/40",
  },
  C3: {
    label: "C3 — Problema & Cliente",
    colorClass: "bg-amber-500 text-white",
    softClass: "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/40",
  },
  C4: {
    label: "C4 — Modelo & Solución",
    colorClass: "bg-fuchsia-500 text-white",
    softClass: "bg-fuchsia-500/10 text-fuchsia-300 ring-1 ring-fuchsia-500/40",
  },
  C5: {
    label: "C5 — Finanzas & Viabilidad",
    colorClass: "bg-rose-500 text-white",
    softClass: "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/40",
  },
  C6: {
    label: "C6 — Contexto & Factores Exógenos",
    colorClass: "bg-lime-500 text-white",
    softClass: "bg-lime-500/10 text-lime-300 ring-1 ring-lime-500/40",
  },
  C7: {
    label: "C7 — Métricas & Tracción",
    colorClass: "bg-cyan-500 text-white",
    softClass: "bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-500/40",
  },
};

function getTypeLabel(type: TimelineEventType) {
  switch (type) {
    case "microaccion":
      return "Microacción";
    case "evidencia":
      return "Evidencia";
    case "hito":
      return "Hito";
  }
}

function getTypeBadgeClasses(type: TimelineEventType) {
  switch (type) {
    case "microaccion":
      return "bg-indigo-500/10 text-indigo-300 ring-1 ring-indigo-500/40";
    case "evidencia":
      return "bg-pink-500/10 text-pink-300 ring-1 ring-pink-500/40";
    case "hito":
      return "bg-slate-500/20 text-slate-200 ring-1 ring-slate-500/40";
  }
}

/**
 * Mapea cada registro almacenado por /r-lab/evidencias
 * (que viene en formato libre) al formato TimelineEvent.
 */
function mapLocalEntryToTimelineEvent(raw: any): TimelineEvent | null {
  if (!raw || !raw.id || !raw.type || !raw.category || !raw.title) return null;

  const iso = raw.createdAtIso ?? new Date().toISOString();
  const dateLabel = new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const type: TimelineEventType =
    raw.type === "microaccion" || raw.type === "evidencia"
      ? raw.type
      : "hito";

  return {
    id: String(raw.id),
    type,
    category: raw.category as CategoryId,
    level: "Torpor", // por ahora todo en nivel base; luego podremos variar
    title: String(raw.title),
    description: String(raw.description ?? ""),
    dateLabel,
    isoDate: iso,
    completed: true,
    isIpOnStory: !!raw.isIpOnStory,
  };
}

export default function TimelinePage() {
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | "ALL">(
    "ALL"
  );
  const [typeFilter, setTypeFilter] = useState<TimelineEventType | "ALL">(
    "ALL"
  );
  const [localEvents, setLocalEvents] = useState<TimelineEvent[]>([]);

  // Cargar eventos guardados en /r-lab/evidencias (localStorage)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as any[];
      const mapped = parsed
        .map(mapLocalEntryToTimelineEvent)
        .filter((e): e is TimelineEvent => e !== null);

      setLocalEvents(mapped);
    } catch (err) {
      console.error("Error leyendo eventos locales del timeline", err);
    }
  }, []);

  // Unimos los eventos mock con los locales
  const allEvents = useMemo(
    () => [...mockEvents, ...localEvents],
    [localEvents]
  );

  const sortedAndFilteredEvents = useMemo(() => {
    return [...allEvents]
      .sort(
        (a, b) => new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
      )
      .filter((event) => {
        if (categoryFilter !== "ALL") {
          if (event.category !== categoryFilter) return false;
        }
        if (typeFilter !== "ALL") {
          if (event.type !== typeFilter) return false;
        }
        return true;
      });
  }, [allEvents, categoryFilter, typeFilter]);

  const totalMicroacciones = allEvents.filter(
    (e) => e.type === "microaccion"
  ).length;
  const completadasMicroacciones = allEvents.filter(
    (e) => e.type === "microaccion" && e.completed
  ).length;

  const totalEvidencias = allEvents.filter((e) => e.type === "evidencia").length;
  const completadasEvidencias = allEvents.filter(
    (e) => e.type === "evidencia" && e.completed
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-10">
        {/* Breadcrumb + header */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              Panel de Vuelo · Ana López
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
              Timeline de Microacciones & Evidencias
            </h1>
            <p className="max-w-2xl text-sm text-slate-400">
              Aquí ves la secuencia de pequeñas acciones que Ana ha realizado
              para avanzar desde el estado{" "}
              <span className="font-semibold">Torpor</span> hacia{" "}
              <span className="font-semibold">Semilla de Luz (N1)</span>. Cada
              microacción y evidencia puede convertirse en IP educativa
              registrable en Story Protocol.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <Link
              href="/r-lab"
              className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200 shadow-sm hover:border-sky-500/70 hover:text-sky-200 hover:shadow-sky-500/30"
            >
              ← Volver al Panel R-Lab
            </Link>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300 ring-1 ring-emerald-500/40">
              Estado NFT: Torpor · Camino a N1
            </span>
          </div>
        </div>

        {/* Resumen superior */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/60">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Microacciones
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-50">
                {completadasMicroacciones}
              </span>
              <span className="text-sm text-slate-500">
                / {totalMicroacciones} completadas
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Recuerda: al completar las{" "}
              <span className="font-semibold">21 microacciones</span> y{" "}
              <span className="font-semibold">7 evidencias</span> tu NFT
              evoluciona a{" "}
              <span className="font-semibold">Semilla de Luz (N1)</span>.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/60">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Evidencias
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-slate-50">
                {completadasEvidencias}
              </span>
              <span className="text-sm text-slate-500">
                / {totalEvidencias} completadas
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Las evidencias son las piezas de IP educativa que podrán
              registrarse en Story Protocol y alimentar tu Colibrí NFT.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-gradient-to-br from-sky-500/10 via-fuchsia-500/10 to-emerald-500/10 p-4 shadow-lg shadow-slate-950/60">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
              Siguiente hito
            </div>
            <p className="mt-2 text-sm text-slate-100">
              Completar las evidencias de todas las categorías C1–C7 para
              desbloquear la evolución del NFT a{" "}
              <span className="font-semibold text-emerald-200">
                Semilla de Luz (N1)
              </span>
              .
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Este timeline será la base para conectar las evidencias con IP
              Assets registrados en Story Protocol (Fases 6–7).
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-lg shadow-slate-950/60 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Filtros del timeline
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Explora las microacciones y evidencias por categoría troncal o
              tipo de actividad.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro por tipo */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Tipo
              </span>
              <div className="flex gap-1 rounded-full bg-slate-950/60 p-1">
                {(["ALL", "microaccion", "evidencia", "hito"] as const).map(
                  (value) => (
                    <button
                      key={value}
                      onClick={() =>
                        setTypeFilter(
                          value === "ALL"
                            ? "ALL"
                            : (value as TimelineEventType)
                        )
                      }
                      className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                        (typeFilter === "ALL" && value === "ALL") ||
                        typeFilter === value
                          ? "bg-sky-500 text-white"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {value === "ALL"
                        ? "Todo"
                        : value === "microaccion"
                        ? "Microacciones"
                        : value === "evidencia"
                        ? "Evidencias"
                        : "Hitos"}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Filtro por categoría */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Categoría
              </span>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setCategoryFilter("ALL")}
                  className={`rounded-full border px-3 py-1 text-[11px] transition ${
                    categoryFilter === "ALL"
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-slate-700/80 text-slate-400 hover:border-sky-500/70 hover:text-sky-200"
                  }`}
                >
                  Todas
                </button>
                {(Object.keys(categoryMeta) as CategoryId[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`rounded-full border px-3 py-1 text-[11px] transition ${
                      categoryFilter === cat
                        ? categoryMeta[cat].colorClass + " border-transparent"
                        : "border-slate-700/80 text-slate-300 hover:border-sky-500/70 hover:text-sky-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Línea vertical */}
          <div className="pointer-events-none absolute left-[18px] top-0 h-full w-px bg-gradient-to-b from-slate-600/60 via-slate-700/40 to-slate-900" />

          <div className="space-y-4">
            {sortedAndFilteredEvents.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-700/80 bg-slate-900/60 p-6 text-center text-sm text-slate-400">
                No hay eventos que coincidan con los filtros actuales.
              </div>
            )}

            {sortedAndFilteredEvents.map((event) => {
              const categoryInfo =
                event.category !== null
                  ? categoryMeta[event.category]
                  : null;

              return (
                <div key={event.id} className="relative pl-10">
                  {/* Nodo de la línea de tiempo */}
                  <div className="absolute left-[10px] top-4 h-4 w-4 rounded-full border-2 border-slate-900 bg-slate-950">
                    <div
                      className={`h-full w-full rounded-full ${
                        event.type === "hito"
                          ? "bg-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.35)]"
                          : event.completed
                          ? "bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.35)]"
                          : "bg-slate-500 shadow-[0_0_0_4px_rgba(148,163,184,0.25)]"
                      }`}
                    />
                  </div>

                  <article className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/60 transition hover:border-sky-500/70 hover:shadow-sky-500/20">
                    {/* Primera fila: título + badges */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${getTypeBadgeClasses(
                              event.type
                            )}`}
                          >
                            {getTypeLabel(event.type)}
                          </span>
                          {categoryInfo && (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${categoryInfo.softClass}`}
                            >
                              {categoryInfo.label}
                            </span>
                          )}
                          <span className="inline-flex items-center rounded-full bg-slate-800/80 px-2.5 py-1 text-[11px] font-medium text-slate-200">
                            Nivel: {event.level}
                          </span>
                        </div>
                        <h2 className="mt-2 text-sm font-semibold text-slate-50">
                          {event.title}
                        </h2>
                      </div>

                      <div className="flex flex-col items-end gap-1 text-right">
                        <span className="text-xs font-medium text-slate-300">
                          {event.dateLabel}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-medium ${
                            event.completed
                              ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40"
                              : "bg-slate-800/80 text-slate-300 ring-1 ring-slate-600/70"
                          }`}
                        >
                          {event.completed ? "Completado" : "En progreso"}
                        </span>
                        {event.isIpOnStory && (
                          <span className="inline-flex items-center rounded-full bg-purple-500/15 px-2 py-1 text-[11px] font-medium text-purple-200 ring-1 ring-purple-500/40">
                            IP registrada en Story Protocol (mock)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="mt-3 text-sm text-slate-300">
                      {event.description}
                    </p>

                    {/* Footer del card */}
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                      <div className="flex flex-wrap items-center gap-2">
                        {event.type === "microaccion" && (
                          <span>
                            🎯 Pequeña acción que suma al Índice Colibrí (IC).
                          </span>
                        )}
                        {event.type === "evidencia" && (
                          <span>
                            📚 Evidencia formalizable como IP educativa (PDF,
                            doc, canvas digital…).
                          </span>
                        )}
                        {event.type === "hito" && (
                          <span>
                            ✨ Marca narrativa importante en el viaje de Ana.
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        ID interno: {event.id}
                      </div>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
