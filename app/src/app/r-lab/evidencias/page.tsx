"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";

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

const STORAGE_KEY = "colibri_timeline_custom_events_v1";

const categoryMeta: Record<CategoryId, { label: string; hint: string }> = {
  C1: {
    label: "C1 — Propósito & ADN Colibrí",
    hint: "Propósito personal, narrativa underdog, FODA personal…",
  },
  C2: {
    label: "C2 — Equipo & Alianzas",
    hint: "Roles, acuerdos, aliados clave…",
  },
  C3: {
    label: "C3 — Problema & Cliente",
    hint: "Entrevistas, mapas de empatía, definición del problema…",
  },
  C4: {
    label: "C4 — Modelo & Solución",
    hint: "Propuesta de valor, hipótesis de solución, MVP…",
  },
  C5: {
    label: "C5 — Finanzas & Viabilidad",
    hint: "Estructura de costos, fuentes de ingreso, escenario base…",
  },
  C6: {
    label: "C6 — Contexto & Factores Exógenos",
    hint: "Análisis del entorno, riesgos, regulaciones…",
  },
  C7: {
    label: "C7 — Métricas & Tracción",
    hint: "KPIs, primeras métricas, evidencia de uso o interés…",
  },
};

function formatDateShort(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function EvidenciasPage() {
  const [entries, setEntries] = useState<EvidenceEntry[]>([]);
  const [type, setType] = useState<EntryType>("microaccion");
  const [category, setCategory] = useState<CategoryId>("C1");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isIpOnStory, setIsIpOnStory] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Cargar registros previos desde localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as EvidenceEntry[];
      setEntries(
        parsed.sort(
          (a, b) =>
            new Date(b.createdAtIso).getTime() -
            new Date(a.createdAtIso).getTime()
        )
      );
    } catch (err) {
      console.error("Error parsing stored evidences", err);
    }
  }, []);

  // Guardar en localStorage cada vez que cambian los entries
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setStatusMessage("Por favor completa título y descripción.");
      return;
    }

    const now = new Date().toISOString();
    const newEntry: EvidenceEntry = {
      id: `local-${Date.now()}`,
      type,
      category,
      title: title.trim(),
      description: description.trim(),
      isIpOnStory,
      createdAtIso: now,
    };

    setEntries((prev) =>
      [newEntry, ...prev].sort(
        (a, b) =>
          new Date(b.createdAtIso).getTime() -
          new Date(a.createdAtIso).getTime()
      )
    );

    // limpiar formulario
    setTitle("");
    setDescription("");
    setIsIpOnStory(true);
    setStatusMessage(
      type === "microaccion"
        ? "Microacción registrada en tu panel (mock). Ya aparece en el Timeline."
        : "Evidencia registrada en tu panel (mock). Ya aparece en el Timeline."
    );

    // limpiar mensaje después de unos segundos
    setTimeout(() => setStatusMessage(null), 4000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8 lg:py-10">
        {/* Header */}
        <header className="mb-6 flex flex-col gap-4 border-b border-slate-800/80 pb-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              <Link
                href="/"
                className="text-slate-400 underline-offset-4 hover:text-slate-100 hover:underline"
              >
                Colibrí OS
              </Link>{" "}
              ·{" "}
              <Link
                href="/r-lab"
                className="text-slate-400 underline-offset-4 hover:text-slate-100 hover:underline"
              >
                Reputation Lab
              </Link>{" "}
              · <span className="text-slate-300">Evidencias &amp; IP</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                Evidencias &amp; IP educativa
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-300">
                Aquí registras las microacciones y evidencias que dan forma a tu
                Índice Colibrí (IC). Cada registro puede convertirse en{" "}
                <span className="font-semibold text-cyan-300">
                  IP educativa
                </span>{" "}
                que más adelante se vinculará a Story Protocol y a tu NFT
                Colibrí.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <Link
              href="/r-lab"
              className="inline-flex items-center rounded-full border border-slate-700/80 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-200 shadow-sm hover:border-sky-500/70 hover:text-sky-200 hover:shadow-sky-500/30"
            >
              ← Volver al Panel R-Lab
            </Link>
            <Link
              href="/r-lab/timeline"
              className="inline-flex items-center rounded-full border border-sky-500/70 bg-sky-500/10 px-3 py-1 text-[11px] font-medium text-sky-100 shadow-sm hover:bg-sky-500/20 hover:shadow-sky-500/40"
            >
              Ver Timeline actualizado →
            </Link>
          </div>
        </header>

        {/* Layout 2 columnas */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)]">
          {/* Columna izquierda: formulario */}
          <section className="space-y-4">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/70">
              <div className="mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                  Registrar nueva acción
                </p>
                <p className="mt-1 text-xs text-slate-300">
                  Completa este formulario cada vez que avances una microacción
                  o generes una evidencia formal (documento, canvas, video,
                  etc.).
                </p>
              </div>

              {statusMessage && (
                <div className="mb-3 rounded-2xl border border-emerald-500/50 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
                  {statusMessage}
                </div>
              )}

              <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
                {/* Tipo */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Tipo de registro
                  </label>
                  <div className="flex gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setType("microaccion")}
                      className={`flex-1 rounded-2xl border px-3 py-2 font-medium transition ${
                        type === "microaccion"
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-50"
                          : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-indigo-500/70 hover:text-indigo-100"
                      }`}
                    >
                      Microacción
                      <span className="block text-[11px] font-normal text-slate-300">
                        Pequeño paso dentro de una categoría.
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setType("evidencia")}
                      className={`flex-1 rounded-2xl border px-3 py-2 font-medium transition ${
                        type === "evidencia"
                          ? "border-pink-500 bg-pink-500/20 text-pink-50"
                          : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-pink-500/70 hover:text-pink-100"
                      }`}
                    >
                      Evidencia
                      <span className="block text-[11px] font-normal text-slate-300">
                        Producto formal que demuestra tu avance.
                      </span>
                    </button>
                  </div>
                </div>

                {/* Categoría */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Categoría troncal
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryId)}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none ring-0 focus:border-sky-500"
                  >
                    {(Object.keys(categoryMeta) as CategoryId[]).map((c) => (
                      <option key={c} value={c}>
                        {categoryMeta[c].label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400">
                    {categoryMeta[category].hint}
                  </p>
                </div>

                {/* Título */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Título del registro
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={
                      type === "microaccion"
                        ? "Ej: Microacción C1.1 — Declaración de Propósito Personal"
                        : "Ej: Evidencia C1-N1 — Documento Integrado de Propósito"
                    }
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500"
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Descripción breve
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe brevemente qué hiciste, qué aprendiste y qué producto generaste (si aplica)."
                    className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-sky-500"
                  />
                </div>

                {/* IP en Story (mock) */}
                <div className="flex items-start gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2">
                  <input
                    id="ip-mock"
                    type="checkbox"
                    checked={isIpOnStory}
                    onChange={(e) => setIsIpOnStory(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 text-sky-500"
                  />
                  <div className="text-[11px] text-slate-300">
                    <label htmlFor="ip-mock" className="font-semibold">
                      Marcar este registro como “IP educativa registrada”
                      (mock)
                    </label>
                    <p className="mt-0.5 text-slate-400">
                      En futuras fases este check creará un IP Asset real en
                      Story Protocol, vinculado a tu NFT Colibrí mediante un IP
                      Account y licencias PIL.
                    </p>
                  </div>
                </div>

                {/* Botón */}
                <div className="pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400"
                  >
                    Registrar en mi Panel de Vuelo
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Columna derecha: registros recientes */}
          <section className="space-y-4">
            <div className="rounded-3xl border border-slate-800/80 bg-slate-950/70 p-4 shadow-lg shadow-slate-950/70">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                    Registros recientes
                  </p>
                  <p className="mt-1 text-xs text-slate-300">
                    Estos son los últimos registros almacenados localmente. Ya
                    están disponibles en el{" "}
                    <span className="font-semibold text-sky-300">
                      Timeline
                    </span>{" "}
                    del R-Lab (simulación local).
                  </p>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  Total registros:{" "}
                  <span className="font-semibold text-slate-100">
                    {entries.length}
                  </span>
                </div>
              </div>

              {entries.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/80 p-4 text-center text-xs text-slate-400">
                  Aún no has registrado ninguna microacción o evidencia desde
                  esta pantalla. Comienza con el formulario de la izquierda.
                </div>
              ) : (
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <article
                      key={entry.id}
                      className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 text-xs shadow-sm shadow-slate-950/60"
                    >
                      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                              entry.type === "microaccion"
                                ? "bg-indigo-500/15 text-indigo-200"
                                : "bg-pink-500/15 text-pink-200"
                            }`}
                          >
                            {entry.type === "microaccion"
                              ? "Microacción"
                              : "Evidencia"}
                          </span>
                          <span className="rounded-full bg-slate-800/80 px-2.5 py-1 text-[10px] text-slate-200">
                            {categoryMeta[entry.category].label}
                          </span>
                        </div>
                        <div className="text-right text-[10px] text-slate-400">
                          {formatDateShort(entry.createdAtIso)}
                          {entry.isIpOnStory && (
                            <div className="mt-0.5 rounded-full bg-purple-500/15 px-2 py-0.5 text-[10px] font-medium text-purple-200">
                              IP educativa (mock Story Protocol)
                            </div>
                          )}
                        </div>
                      </div>

                      <h2 className="text-[13px] font-semibold text-slate-50">
                        {entry.title}
                      </h2>
                      <p className="mt-1 text-[11px] text-slate-300">
                        {entry.description}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
