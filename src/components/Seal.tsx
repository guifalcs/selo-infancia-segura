import type { Nivel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** Selo de certificação (Bronze / Prata / Ouro). */

const seloImg: Record<Nivel, string> = {
  Bronze: "/selos/nivel/bronze.webp",
  Prata: "/selos/nivel/prata.webp",
  Ouro: "/selos/nivel/ouro.webp",
};

export function Seal({ nivel, className }: { nivel: Nivel; className?: string }) {
  return (
    <img src={seloImg[nivel]} alt={`Selo ${nivel}`} className={cn("object-contain", className)} />
  );
}

/** Versão em linha, para listas e cards onde não cabe o selo inteiro. */
export function SealChip({ nivel, className }: { nivel: Nivel; className?: string }) {
  const tom: Record<Nivel, string> = {
    Bronze: "border-seal-bronze/40 bg-seal-bronze/10 text-seal-bronze",
    Prata: "border-seal-prata/45 bg-seal-prata/10 text-seal-prata",
    Ouro: "border-seal-ouro/45 bg-seal-ouro/10 text-seal-ouro",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        tom[nivel],
        className,
      )}
    >
      <img src={seloImg[nivel]} alt="" className="size-3.5 object-contain" aria-hidden />
      Selo {nivel}
    </span>
  );
}
