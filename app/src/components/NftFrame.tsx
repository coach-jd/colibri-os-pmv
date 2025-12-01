// src/components/NftFrame.tsx

/**
 * Componente NftFrame
 * Muestra un placeholder del NFT Colibrí.
 *
 * Próximas versiones:
 * - SVG dinámico según ADN del NFT.
 * - Lectura de IPFS/Story Protocol.
 * - Animaciones según nivel (Torpor → N1 → N2 → ...).
 */

export default function NftFrame() {
  return (
    <div className="flex h-28 w-24 items-center justify-center rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-[10px] text-slate-400">
      NFT Colibrí
      <br />
      (placeholder)
    </div>
  );
}
