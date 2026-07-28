import { useId } from "react";

/**
 * Ilustrações institucionais em SVG.
 *
 * O plano original era substituí-las por fotografia. Isso já aconteceu no hero
 * da home, que hoje usa `public/imagens/hero-instituicao.webp` — o passo a passo
 * e as regras jurídicas para foto de criança estão em `public/imagens/README.md`.
 */

/**
 * Cena principal da home — proporção 4:3.
 *
 * NÃO ESTÁ EM USO: o hero foi substituído por fotografia. Mantida como
 * alternativa caso se queira voltar ao vetor (ela acompanha tema claro/escuro e
 * não custa requisição de rede). Se ficar claro que não se volta, remova.
 */
export function CenaInstituicao({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const ceu = `${uid}-ceu`;

  return (
    <svg
      viewBox="0 0 480 360"
      className={className}
      role="img"
      aria-label="Ilustração de uma escola certificada, com crianças e responsáveis em frente ao prédio e um selo de certificação em destaque."
    >
      <defs>
        <linearGradient id={ceu} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="var(--brand-teal)" stopOpacity="0.14" />
          <stop offset="1" stopColor="var(--brand-blue)" stopOpacity="0.06" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <rect x="0" y="0" width="480" height="360" rx="14" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${uid}-clip)`}>
        <rect x="0" y="0" width="480" height="360" fill={`url(#${ceu})`} />

        {/* Arcos de fundo — eco do anel do emblema. */}
        <circle
          cx="390"
          cy="70"
          r="120"
          fill="none"
          stroke="var(--brand-teal)"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
        <circle
          cx="390"
          cy="70"
          r="86"
          fill="none"
          stroke="var(--brand-green)"
          strokeOpacity="0.16"
          strokeWidth="2"
        />

        {/* Chão. */}
        <rect x="0" y="300" width="480" height="60" fill="var(--brand-navy)" fillOpacity="0.07" />
        <line
          x1="0"
          y1="300"
          x2="480"
          y2="300"
          stroke="var(--brand-navy)"
          strokeOpacity="0.18"
          strokeWidth="2"
        />

        {/* Árvore. */}
        <g>
          <rect
            x="404"
            y="246"
            width="10"
            height="54"
            rx="3"
            fill="var(--brand-navy)"
            fillOpacity="0.55"
          />
          <circle cx="409" cy="228" r="34" fill="var(--brand-green)" fillOpacity="0.85" />
          <circle cx="386" cy="244" r="22" fill="var(--brand-green)" fillOpacity="0.7" />
          <circle cx="432" cy="244" r="20" fill="var(--brand-green)" fillOpacity="0.75" />
        </g>

        {/* Prédio da instituição. */}
        <g>
          <path d="M 96 152 L 210 108 L 324 152 Z" fill="var(--brand-navy)" />
          <rect
            x="112"
            y="152"
            width="196"
            height="148"
            fill="var(--color-card)"
            stroke="var(--brand-navy)"
            strokeWidth="3"
          />
          {/* Mastro. */}
          <line
            x1="210"
            y1="108"
            x2="210"
            y2="76"
            stroke="var(--brand-navy)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path d="M 210 79 L 240 87 L 210 95 Z" fill="var(--brand-amber)" />

          {/* Janelas. */}
          {[0, 1, 2].map((c) =>
            [0, 1].map((r) => (
              <rect
                key={`${c}-${r}`}
                x={132 + c * 62}
                y={172 + r * 54}
                width="38"
                height="34"
                rx="3"
                fill="var(--brand-blue)"
                fillOpacity={r === 0 ? 0.28 : 0.18}
                stroke="var(--brand-navy)"
                strokeWidth="2"
              />
            )),
          )}
          {/* Porta. */}
          <path
            d="M 192 300 v -44 a 18 18 0 0 1 36 0 v 44 Z"
            fill="var(--brand-teal)"
            fillOpacity="0.9"
          />
          <circle cx="220" cy="280" r="3" fill="var(--color-card)" />
          {/* Rampa de acessibilidade — o projeto certifica acessibilidade,
              então ela precisa aparecer na cena. */}
          <path
            d="M 228 300 L 286 300 L 286 292 L 244 292 Z"
            fill="var(--brand-navy)"
            fillOpacity="0.35"
          />
        </g>

        {/* Pessoas em frente ao prédio: um responsável e duas crianças. */}
        <g>
          {/* Responsável. */}
          <circle cx="72" cy="238" r="13" fill="var(--brand-navy)" />
          <path
            d="M 58 300 L 60 268 Q 61 253 72 253 Q 83 253 84 268 L 86 300 Z"
            fill="var(--brand-navy)"
          />
          {/* Criança 1. */}
          <circle cx="100" cy="262" r="10" fill="var(--brand-teal)" />
          <path
            d="M 89 300 L 91 279 Q 92 269 100 269 Q 108 269 109 279 L 111 300 Z"
            fill="var(--brand-teal)"
          />
          {/* Criança 2 — cadeira de rodas. */}
          <g>
            <circle cx="344" cy="264" r="10" fill="var(--brand-amber)" />
            <path
              d="M 334 292 L 336 280 Q 337 271 344 271 Q 351 271 352 280 L 353 292 Z"
              fill="var(--brand-amber)"
            />
            <circle
              cx="343"
              cy="294"
              r="12"
              fill="none"
              stroke="var(--brand-navy)"
              strokeWidth="3.5"
            />
            <circle
              cx="358"
              cy="298"
              r="5"
              fill="none"
              stroke="var(--brand-navy)"
              strokeWidth="3"
            />
          </g>
        </g>

        {/* Selo de certificação em destaque. */}
        <g transform="translate(356 96)">
          <circle cx="0" cy="0" r="46" fill="var(--color-card)" />
          <circle cx="0" cy="0" r="46" fill="var(--seal-ouro)" fillOpacity="0.16" />
          <circle
            cx="0"
            cy="0"
            r="38"
            fill="none"
            stroke="var(--seal-ouro)"
            strokeWidth="3"
            strokeDasharray="4 5"
          />
          <path
            d="M 0 -24 L 5.6 -9.8 L 20.8 -8.6 L 9.2 1.4 L 12.8 16.2 L 0 8.2 L -12.8 16.2 L -9.2 1.4 L -20.8 -8.6 L -5.6 -9.8 Z"
            fill="var(--seal-ouro)"
          />
          <text
            x="0"
            y="30"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill="var(--brand-navy)"
            letterSpacing="0.5"
          >
            CERTIFICADA
          </text>
        </g>
      </g>
    </svg>
  );
}

/**
 * Trama geométrica discreta para fundos de seção.
 * Puramente decorativa — por isso `aria-hidden`.
 */
export function TramaInstitucional({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg className={className} aria-hidden focusable="false">
      <defs>
        <pattern id={uid} width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${uid})`} />
    </svg>
  );
}
