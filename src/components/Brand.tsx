import { cn } from "@/lib/utils";

/**
 * Identidade visual do SIS — Selo Infância Segura.
 *
 * Usa o arquivo raster oficial (`public/marca/logo-sis.webp`), que já traz o brasão,
 * o anel de avaliação, os selos, o wordmark "SIS" e o slogan desenhados na
 * própria arte — por isso os componentes abaixo não recriam texto ao lado.
 */

const LOGO_SRC = "/marca/logo-sis.webp";
const LOGO_ALT = "SIS: Selo Infância Segura";

/** Assinatura oficial — usada no masthead e no rodapé. */
export function BrandLockup({ className }: { className?: string }) {
  return (
    <img src={LOGO_SRC} alt={LOGO_ALT} className={cn("h-14 w-auto object-contain", className)} />
  );
}

/** Aplicação em destaque — mesma logo, maior, para heros e material de pitch. */
export function BrandStacked({ className }: { className?: string }) {
  return (
    <img src={LOGO_SRC} alt={LOGO_ALT} className={cn("h-56 w-auto object-contain", className)} />
  );
}
