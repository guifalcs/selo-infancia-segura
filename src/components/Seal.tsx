import { useId } from "react";
import type { Nivel } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * Selo de certificação (Bronze / Prata / Ouro).
 *
 * Desenhado como roseta: um disco entalhado com estrelas, que é a forma
 * historicamente associada a selo de aprovação e conformidade. O número de
 * estrelas acompanha o nível, dando leitura imediata mesmo sem ler o rótulo.
 */

const config: Record<Nivel, { estrelas: number; cor: string; contorno: string }> = {
  Bronze: { estrelas: 1, cor: "var(--seal-bronze)", contorno: "var(--seal-bronze)" },
  Prata: { estrelas: 2, cor: "var(--seal-prata)", contorno: "var(--seal-prata)" },
  Ouro: { estrelas: 3, cor: "var(--seal-ouro)", contorno: "var(--seal-ouro)" },
};

/** Roseta: círculo com 24 entalhes na borda. */
function rosetaPath(cx: number, cy: number, rOut: number, rIn: number, dentes = 24) {
  const pts: string[] = [];
  for (let i = 0; i < dentes * 2; i++) {
    const r = i % 2 === 0 ? rOut : rIn;
    const a = (Math.PI * i) / dentes - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(2)} ${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

function estrela(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = (Math.PI * i) / 5 - Math.PI / 2;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(2)} ${(cy + rr * Math.sin(a)).toFixed(2)}`);
  }
  return `M ${pts.join(" L ")} Z`;
}

export function Seal({ nivel, className }: { nivel: Nivel; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const { estrelas, cor } = config[nivel];
  const posicoes = estrelas === 1 ? [50] : estrelas === 2 ? [40, 60] : [30, 50, 70];

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={`Selo ${nivel}`}>
      <defs>
        <linearGradient id={uid} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor={cor} stopOpacity="0.95" />
          <stop offset="1" stopColor={cor} stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path d={rosetaPath(50, 50, 47, 42)} fill={`url(#${uid})`} />
      <circle
        cx="50"
        cy="50"
        r="37"
        fill="none"
        stroke="var(--color-card)"
        strokeWidth="2"
        strokeOpacity="0.75"
      />
      <g fill="var(--color-card)">
        {posicoes.map((x) => (
          <path key={x} d={estrela(x, 40, estrelas === 3 ? 8.5 : 10)} />
        ))}
      </g>
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fill="var(--color-card)"
        fontSize="14"
        fontWeight="700"
        letterSpacing="1"
        style={{ textTransform: "uppercase" }}
      >
        {nivel}
      </text>
      <text
        x="50"
        y="80"
        textAnchor="middle"
        fill="var(--color-card)"
        fontSize="7.5"
        letterSpacing="0.6"
        opacity="0.9"
      >
        SIS
      </text>
    </svg>
  );
}

/** Versão em linha, para listas e cards onde não cabe a roseta inteira. */
export function SealChip({ nivel, className }: { nivel: Nivel; className?: string }) {
  const { estrelas } = config[nivel];
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
      <svg viewBox="0 0 100 100" className="size-3.5" aria-hidden>
        <path d={rosetaPath(50, 50, 47, 40)} fill="currentColor" />
        <path d={estrela(50, 50, 26)} fill="var(--color-card)" />
      </svg>
      Selo {nivel}
      <span className="sr-only">, {estrelas} de 3 estrelas</span>
    </span>
  );
}
