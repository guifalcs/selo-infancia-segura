import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Peças de interface compartilhadas pelas telas do portal.
 *
 * Os três perfis (SIS, rede e unidade) mostram números diferentes nas mesmas
 * formas — indicador, painel, tabela, barra de nota. Concentrar as formas aqui
 * é o que faz os painéis parecerem o mesmo produto em vez de três protótipos.
 */

type Tom = "primary" | "teal" | "amber" | "green" | "destructive";

const tons: Record<Tom, string> = {
  primary: "bg-primary/10 text-primary",
  teal: "bg-brand-teal/10 text-brand-teal",
  amber: "bg-brand-amber/15 text-brand-amber",
  green: "bg-success/10 text-success",
  destructive: "bg-destructive/10 text-destructive",
};

/** Indicador numérico do topo dos painéis. */
export function Indicador({
  label,
  valor,
  detalhe,
  icon: Icon,
  tom = "primary",
}: {
  label: string;
  valor: ReactNode;
  detalhe?: string;
  icon: LucideIcon;
  tom?: Tom;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className={cn("grid size-10 place-items-center rounded-lg", tons[tom])}>
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="mt-4 text-3xl font-bold leading-none text-foreground">{valor}</div>
      <div className="mt-2 text-xs font-medium text-muted-foreground">{label}</div>
      {detalhe && <div className="mt-1 text-xs text-muted-foreground/80">{detalhe}</div>}
    </div>
  );
}

/** Bloco de conteúdo com título, descrição e ação opcional. */
export function Painel({
  titulo,
  descricao,
  acoes,
  className,
  children,
}: {
  titulo: string;
  descricao?: string;
  acoes?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section className={cn("rounded-xl border bg-card shadow-sm", className)}>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b px-5 py-4">
        <div className="min-w-0">
          <h2 className="font-semibold leading-tight">{titulo}</h2>
          {descricao && (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{descricao}</p>
          )}
        </div>
        {acoes && <div className="flex shrink-0 items-center gap-2">{acoes}</div>}
      </div>
      {children}
    </section>
  );
}

/** Estado vazio — nunca deixar uma tabela sem explicação de por que está vazia. */
export function Vazio({ children }: { children: ReactNode }) {
  return <p className="px-5 py-10 text-center text-sm text-muted-foreground">{children}</p>;
}

/** Cor da nota por faixa: verde só a partir do patamar de referência. */
export function corDaNota(nota: number) {
  if (nota >= 90) return "bg-success";
  if (nota >= 75) return "bg-brand-teal";
  if (nota >= 60) return "bg-brand-amber";
  return "bg-destructive";
}

/** Barra de pontuação com rótulo acessível. */
export function BarraDeNota({
  nota,
  rotulo,
  className,
}: {
  nota: number;
  rotulo: string;
  className?: string;
}) {
  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-muted", className)}
      role="img"
      aria-label={`${rotulo}: ${nota} de 100 pontos`}
    >
      <div className={cn("h-full rounded-full", corDaNota(nota))} style={{ width: `${nota}%` }} />
    </div>
  );
}

/** Aviso de que os dados são de demonstração. */
export function AvisoDemo({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed bg-card px-4 py-3 text-xs leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}
