// src/components/CategoryCard.tsx

/**
 * Card de Categoría Troncal
 * Recibe:
 * - clave       (C1, C2...)
 * - nombre      (Propósito & Equipo...)
 * - descripcion
 * - progresoMicroacciones ("0/3 microacciones")
 * - progresoEvidencia ("0/1 evidencia")
 * - colorClase ("border-c1")
 */

type Props = {
  clave: string;
  nombre: string;
  descripcion: string;
  progresoMicroacciones: string;
  progresoEvidencia: string;
  colorClase: string;
};

export default function CategoryCard({
  clave,
  nombre,
  descripcion,
  progresoMicroacciones,
  progresoEvidencia,
  colorClase,
}: Props) {
  return (
    <div
      className={`group flex flex-col justify-between rounded-2xl border bg-slate-900/70 p-3 transition hover:-translate-y-[1px] hover:border-slate-300/70 ${colorClase}`}
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
          {clave} · {nombre}
        </p>
        <p className="mt-1 text-xs text-slate-200">{descripcion}</p>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <div className="space-y-0.5">
          <p>{progresoMicroacciones}</p>
          <p>{progresoEvidencia}</p>
        </div>
        <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300">
          Empezar ruta →
        </span>
      </div>
    </div>
  );
}
