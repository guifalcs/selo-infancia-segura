import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Identidade visual do SIS — Selo Infância Segura.
 *
 * O emblema é uma vetorização da logo do projeto. Foi refeito em SVG (e não
 * embutido como PNG) por três motivos práticos:
 *   - fica nítido em qualquer tamanho, do favicon de 16px ao banner impresso;
 *   - herda as cores do design system, então acompanha tema claro/escuro;
 *   - pesa ~4 KB em vez de centenas, sem requisição extra.
 *
 * TODO(logo): se o grupo preferir usar o arquivo raster original da logo,
 * basta colocá-lo em `public/marca/` e trocar <BrandEmblem /> por uma <img>.
 * Os PNGs exportados a partir deste SVG (com e sem fundo) estão em
 * `public/marca/` — veja `public/marca/README.md`.
 *
 * Leitura do símbolo, para quem for apresentar o projeto:
 *   escudo     -> proteção            estrela  -> excelência / nível do selo
 *   crianças   -> o público atendido  check    -> conformidade verificada
 *   anel       -> ciclo de avaliação contínua (validade de 12 meses)
 *   cadeado    -> segurança e anonimato da denúncia
 *   pessoas    -> famílias e comunidade
 *   documento  -> registro auditável em blockchain
 */

/** Conteúdo do escudo: estrela, crianças e check. Compartilhado pelas variantes. */
function ShieldScene() {
  return (
    <>
      {/* Escudo. */}
      <path
        d="M 100 38 L 146 56 L 146 100 C 146 129 126 147 100 156 C 74 147 54 129 54 100 L 54 56 Z"
        fill="var(--color-card)"
        stroke="var(--brand-navy-deep)"
        strokeWidth="6.5"
        strokeLinejoin="round"
      />

      {/* Check de conformidade — atrás das crianças, funcionando como "chão".
          As pontas ficam visíveis dos dois lados; o meio passa por trás. */}
      <path
        d="M 73 120 L 89 139 L 130 96"
        fill="none"
        stroke="var(--brand-green)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Estrela de excelência. */}
      <path
        d="M 100 53 L 103.8 62.2 L 113.7 63 L 106.2 69.5 L 108.5 79.1 L 100 73.9 L 91.5 79.1 L 93.8 69.5 L 86.3 63 L 96.2 62.2 Z"
        fill="var(--brand-star)"
      />

      {/* Criança à esquerda (navy) — braço erguido em cumprimento. */}
      <g fill="var(--brand-navy)">
        <ellipse cx="74.8" cy="96" rx="4.6" ry="6.2" />
        <circle cx="82.5" cy="92" r="8.4" />
        <path d="M 75.5 125 L 77 108 Q 78 101 83 101 Q 88 101 89 108 L 90.5 125 Z" />
        <path d="M 87 106 L 95.5 84 L 99.6 85.7 L 91 107.7 Z" />
      </g>

      {/* Criança à direita (teal). */}
      <g fill="var(--brand-teal)">
        <circle cx="117.5" cy="92" r="8.4" />
        <path d="M 109.5 125 L 111 108 Q 112 101 117 101 Q 122 101 123 108 L 124.5 125 Z" />
        <path d="M 113 106 L 104.5 84 L 108.6 82.3 L 117 104.3 Z" />
      </g>
    </>
  );
}

export function BrandEmblem({
  className,
  title = "Selo Infância Segura",
  /**
   * "full" traz o anel de avaliação e os três selos (segurança, comunidade,
   * registro). "compact" mostra só o escudo — use abaixo de ~48px, onde os
   * detalhes do anel viram ruído. É a mesma lógica de logo responsiva que
   * marcas institucionais usam entre aplicação assinada e reduzida.
   */
  variant = "full",
}: {
  className?: string;
  title?: string;
  variant?: "full" | "compact";
}) {
  // Gradientes precisam de id único: o emblema aparece mais de uma vez por página.
  const uid = useId().replace(/:/g, "");
  const arcLeft = `${uid}-arc-l`;
  const arcRight = `${uid}-arc-r`;

  if (variant === "compact") {
    return (
      <svg viewBox="48 32 104 130" className={className} role="img" aria-label={title}>
        <ShieldScene />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id={arcLeft} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="var(--brand-teal)" />
          <stop offset="0.5" stopColor="var(--brand-blue)" />
          <stop offset="1" stopColor="var(--brand-teal)" />
        </linearGradient>
        <linearGradient id={arcRight} x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="var(--brand-green)" />
          <stop offset="0.55" stopColor="var(--brand-green)" />
          <stop offset="1" stopColor="var(--brand-amber)" />
        </linearGradient>
      </defs>

      {/* Anel de avaliação contínua, aberto no topo e na base. */}
      <path
        d="M 92.33 12.34 A 88 88 0 0 0 92.33 187.66"
        fill="none"
        stroke={`url(#${arcLeft})`}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M 107.67 12.34 A 88 88 0 0 1 107.67 187.66"
        fill="none"
        stroke={`url(#${arcRight})`}
        strokeWidth="7"
        strokeLinecap="round"
      />

      <ShieldScene />

      {/* Selo de segurança (cadeado) — 9h. */}
      <g>
        <circle
          cx="12"
          cy="100"
          r="19"
          fill="var(--brand-blue)"
          stroke="var(--color-card)"
          strokeWidth="4"
        />
        <path
          d="M 7.5 98 v -3.5 a 4.5 4.5 0 0 1 9 0 V 98"
          fill="none"
          stroke="var(--color-card)"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <rect x="5.5" y="98" width="13" height="10.5" rx="2.2" fill="var(--color-card)" />
      </g>

      {/* Selo de comunidade (famílias) — 3h. */}
      <g>
        <circle
          cx="188"
          cy="100"
          r="19"
          fill="var(--brand-amber)"
          stroke="var(--color-card)"
          strokeWidth="4"
        />
        <g fill="var(--color-card)">
          <circle cx="188" cy="95.5" r="3.4" />
          <circle cx="180.8" cy="97.5" r="2.7" />
          <circle cx="195.2" cy="97.5" r="2.7" />
          <path d="M 182 108 a 6 6 0 0 1 12 0 Z" />
          <path d="M 176 107.5 a 4.6 4.6 0 0 1 5.6 -4.3 a 8.4 8.4 0 0 0 -2.4 4.3 Z" />
          <path d="M 200 107.5 a 4.6 4.6 0 0 0 -5.6 -4.3 a 8.4 8.4 0 0 1 2.4 4.3 Z" />
        </g>
      </g>

      {/* Selo de registro auditável (documento) — 6h. */}
      <g>
        <circle
          cx="100"
          cy="188"
          r="19"
          fill="var(--brand-teal)"
          stroke="var(--color-card)"
          strokeWidth="4"
        />
        <rect x="93" y="179" width="13" height="16" rx="2" fill="var(--color-card)" />
        <g stroke="var(--brand-teal)" strokeWidth="1.5" strokeLinecap="round">
          <line x1="96" y1="183" x2="103" y2="183" />
          <line x1="96" y1="186.5" x2="103" y2="186.5" />
          <line x1="96" y1="190" x2="100" y2="190" />
        </g>
        <path
          d="M 100.5 191.5 L 103.5 194.5 L 109 188.5"
          fill="none"
          stroke="var(--color-card)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/** Assinatura horizontal — usada no masthead e no rodapé. */
export function BrandLockup({
  className,
  emblemClassName,
  showTagline = false,
}: {
  className?: string;
  emblemClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <BrandEmblem variant="compact" className={cn("h-11 w-9 shrink-0", emblemClassName)} />
      <span className="min-w-0 leading-tight">
        <span className="block font-serif text-base font-bold tracking-tight text-primary">
          SIS
          <span className="ml-1.5 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Selo Infância Segura
          </span>
        </span>
        {showTagline && (
          <span className="block text-[0.68rem] text-muted-foreground">
            Transparência · Segurança · Confiança
          </span>
        )}
      </span>
    </span>
  );
}

/** Assinatura vertical completa — usada em destaques e no material de pitch. */
export function BrandStacked({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center text-center", className)}>
      <BrandEmblem className="size-32" />
      {/* Sans em peso máximo: é o desenho do "SIS" na logo original. */}
      <p className="mt-4 text-5xl font-black leading-none tracking-tight">
        <span className="text-brand-navy">S</span>
        <span className="text-brand-teal">I</span>
        <span className="text-brand-green">S</span>
      </p>
      <p className="mt-1 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        <span aria-hidden className="h-px w-6 bg-brand-navy" />
        Selo Infância Segura
        <span aria-hidden className="h-px w-6 bg-brand-green" />
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Transparência<span className="text-brand-blue">.</span> Segurança
        <span className="text-brand-teal">.</span> Confiança
        <span className="text-brand-amber">.</span>
      </p>
    </div>
  );
}
