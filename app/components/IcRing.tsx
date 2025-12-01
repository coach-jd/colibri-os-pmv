// src/components/IcRing.tsx

/**
 * Componente IcRing
 * Representa visualmente el Índice Colibrí (IC).
 * - Recibe: value (actual), max (máximo)
 * - Devuelve: un anillo estático con % calculado.
 *
 * Próximas mejoras:
 * - Animación radial.
 * - Conexión a datos reales desde DB.
 * - Sincronización con la evolución del NFT (Torpor → N1).
 */

export default function IcRing({ value, max }: { value: number; max: number }) {
  const porcentaje = Math.round((value / max) * 100);

  return (
    <div className="flex items-center gap-4">
      {/* Anillo circular */}
      <div className="relative h-24 w-24">
        <div className="h-full w-full rounded-full border border-slate-600 bg-slate-900/70" />
        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-slate-950">
          <span className="text-xl font-semibold text-cyan-300">
            {porcentaje}
            <span className="text-xs text-slate-400">%</span>
          </span>
        </div>
      </div>

      {/* Texto descriptivo */}
      <div className="space-y-1 text-xs md:text-sm">
        <p className="font-semibold text-slate-100">Índice Colibrí (IC)</p>
        <p className="text-slate-300">
          Este índice resume tu progreso educativo. En estado{" "}
          <span className="font-semibold text-slate-100">Torpor</span>,
          aún no has iniciado las microacciones del nivel base.
        </p>
      </div>
    </div>
  );
}
