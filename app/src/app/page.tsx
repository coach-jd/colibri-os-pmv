// src/app/page.tsx

/**
 * Página principal (landing mínima) del PMV.
 *
 * Objetivo:
 * - Reemplazar la pantalla de "Hello Next" por una vista que
 *   represente el onboarding de Colibrí OS.
 * - Permitir que el usuario elija su rol:
 *   Emprendedor · Mecenas · Jurado
 *
 * Más adelante:
 * - Cada botón redirigirá a su respectivo Panel:
 *   /r-lab, /r-lab-mecenas, /r-market
 */
export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center">
      {/* Panel principal con efecto glassmorphism */}
      <section className="colibri-panel w-full max-w-4xl rounded-3xl px-6 py-6 md:px-10 md:py-8">
        {/* Encabezado del Panel de Vuelo */}
        <header className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
              Movimiento Colibrí LATAM
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
              Colibrí OS · Panel de Vuelo
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300 md:text-base">
              Esta es la versión PMV del ecosistema Colibrí OS. Aquí simulamos
              cómo un NFT Colibrí evoluciona gracias a microacciones y evidencias
              educativas registradas como Propiedad Intelectual.
            </p>
          </div>

          {/* Chip que representa el estado del NFT de demostración */}
          <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-600/60 bg-slate-900/60 px-4 py-3 text-xs shadow-glass">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-cyan-400 to-fuchsia-500 p-[2px]">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950">
                <span className="text-[10px] font-semibold text-cyan-300">
                  N0
                </span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                NFT Colibrí · Demo
              </p>
              <p className="text-xs text-slate-200">
                Estado actual: <span className="font-semibold text-cyan-300">Torpor</span>
              </p>
            </div>
          </div>
        </header>

        {/* Cuerpo: explicación breve + selección de rol */}
        <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-start">
          {/* Columna izquierda: explicación narrativa */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              ¿Cómo quieres entrar al panel?
            </h2>
            <p className="text-sm leading-relaxed text-slate-200 md:text-[15px]">
              Colibrí OS convierte tu aprendizaje emprendedor en una narrativa
              verificable. Cada pequeña acción se traduce en evidencia, y cada
              evidencia impulsa la evolución de tu NFT Colibrí y tu Índice Colibrí (IC).
            </p>
            <p className="text-sm leading-relaxed text-slate-300">
              En esta versión PMV puedes explorar el sistema desde tres perspectivas:
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <span className="font-semibold text-c1">Emprendedor/a:</span>{" "}
                observa tu propio Panel de Vuelo y cómo evoluciona tu NFT.
              </li>
              <li>
                <span className="font-semibold text-c6">Mecenas / Aliado Semilla:</span>{" "}
                mira el impacto de tus becas y tu portafolio de Colibrís apoyados.
              </li>
              <li>
                <span className="font-semibold text-c7">Jurado / Evaluador:</span>{" "}
                compara startups en el Reputation Market usando las 7 categorías troncales.
              </li>
            </ul>
          </div>

          {/* Columna derecha: tarjetas de selección de rol */}
          <div className="space-y-3">
            {/* 
              Nota: por ahora estos botones no navegan.
              En la siguiente fase los conectaremos con:
              - /r-lab
              - /r-lab-mecenas
              - /r-market
            */}
            <button
              type="button"
              className="group flex w-full flex-col items-start rounded-2xl border border-emerald-500/40 bg-slate-900/70 px-4 py-3 text-left transition hover:-translate-y-[1px] hover:border-emerald-400 hover:bg-slate-900/90"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/90">
                Rol · Emprendedor/a
              </span>
              <span className="mt-1 text-sm font-medium text-slate-50">
                Explorar mi Panel de Vuelo
              </span>
              <span className="mt-1 text-xs text-slate-300">
                Verás tu NFT Colibrí, tu Índice Colibrí (IC) y las evidencias
                que impulsan tu evolución educativa.
              </span>
            </button>

            <button
              type="button"
              className="group flex w-full flex-col items-start rounded-2xl border border-cyan-400/40 bg-slate-900/70 px-4 py-3 text-left transition hover:-translate-y-[1px] hover:border-cyan-300 hover:bg-slate-900/90"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/90">
                Rol · Mecenas / Aliado Semilla
              </span>
              <span className="mt-1 text-sm font-medium text-slate-50">
                Ver portafolio de Colibrís apoyados
              </span>
              <span className="mt-1 text-xs text-slate-300">
                Verás cuántas becas has activado, en qué nivel están tus Colibrís
                y qué impacto educativo has generado.
              </span>
            </button>

            <button
              type="button"
              className="group flex w-full flex-col items-start rounded-2xl border border-violet-400/40 bg-slate-900/70 px-4 py-3 text-left transition hover:-translate-y-[1px] hover:border-violet-300 hover:bg-slate-900/90"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300/90">
                Rol · Jurado / Evaluador
              </span>
              <span className="mt-1 text-sm font-medium text-slate-50">
                Acceder al Reputation Market
              </span>
              <span className="mt-1 text-xs text-slate-300">
                Podrás comparar startups a través de las 7 categorías Colibrí,
                viendo datos en lugar de relatos difusos.
              </span>
            </button>
          </div>
        </div>

        {/* Pie de panel con lema del movimiento */}
        <footer className="mt-6 border-t border-slate-700/60 pt-4 text-xs text-slate-400 md:mt-8">
          Haz tu parte. <span className="text-slate-200">Hazlo visible.</span>{" "}
          <span className="text-cyan-300">Hazlo en red.</span>
        </footer>
      </section>
    </main>
  );
}
