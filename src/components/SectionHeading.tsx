import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cabeçalho de seção padronizado.
 *
 * Substitui o padrão "chip + h2 + parágrafo" que estava repetido à mão em
 * cada seção da home. Centralizar aqui mantém o ritmo tipográfico uniforme
 * ao longo do site — que é boa parte do que faz um portal parecer sério.
 */
export function SectionHeading({
  eyebrow,
  icon: Icon,
  title,
  description,
  align = "center",
  as: Tag = "h2",
  className,
}: {
  eyebrow?: string;
  icon?: LucideIcon;
  title: string;
  description?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}
    >
      {eyebrow && (
        <p
          className={cn(
            "flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal",
            align === "center" && "justify-center",
          )}
        >
          {Icon && <Icon className="size-4" aria-hidden />}
          {eyebrow}
        </p>
      )}
      <Tag className="mt-3 text-3xl font-bold text-primary sm:text-4xl">{title}</Tag>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
