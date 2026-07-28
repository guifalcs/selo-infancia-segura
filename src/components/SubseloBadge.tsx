import { cn } from "@/lib/utils";
import { subseloPorNome } from "@/lib/mock-data";

/**
 * Medalhão de um subselo temático.
 *
 * A arte é um WebP recortado em círculo com fundo transparente, então assenta
 * igual sobre fundo claro e escuro — sem halo branco nem sombra fantasma.
 *
 * Sobre acessibilidade: quando o nome do subselo já aparece como texto ao lado
 * do medalhão (o caso comum), passe `decorativa` para que o leitor de tela não
 * anuncie a mesma informação duas vezes.
 */
export function SubseloBadge({
  nome,
  size = 64,
  decorativa = false,
  className,
}: {
  nome: string;
  size?: number;
  /** Marca a imagem como decorativa — use quando o nome já estiver visível. */
  decorativa?: boolean;
  className?: string;
}) {
  const subselo = subseloPorNome.get(nome);

  // Nome sem arte cadastrada: mostrar o texto é melhor que o subselo desaparecer
  // da ficha da instituição sem deixar rastro.
  if (!subselo) {
    return (
      <span className="inline-flex items-center rounded-full border border-brand-teal/30 bg-card px-3.5 py-1.5 text-sm font-medium text-brand-teal">
        {nome}
      </span>
    );
  }

  return (
    <img
      src={subselo.arte}
      alt={decorativa ? "" : `Subselo ${nome}`}
      aria-hidden={decorativa || undefined}
      title={subselo.desc}
      width={size}
      height={size}
      loading="lazy"
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
    />
  );
}
