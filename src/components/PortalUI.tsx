import { AlertTriangle, CalendarCheck, CalendarClock, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { PATAMAR_DE_REFERENCIA, diasAPartirDeHoje, situacaoDaValidade } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * Piso eliminatório usado para colorir uma nota fora do contexto de um modelo.
 *
 * Os modelos publicados hoje usam 60. Quando a barra é desenhada já sabendo o
 * modelo, prefira o `notaMinimaPorEixo` dele.
 */
export const PISO_ELIMINATORIO_PADRAO = 60;

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

/**
 * Cor da nota por faixa.
 *
 * A régua é a mesma do plano de adequação, e não uma escala própria: verde
 * significa "fora do plano", âmbar significa "no plano" e vermelho significa
 * "abaixo do piso eliminatório, bloqueia a emissão". Antes a barra virava verde
 * em 90 enquanto o plano usava 85 como patamar — duas cores contando histórias
 * diferentes sobre o mesmo eixo, na mesma tela.
 */
export function corDaNota(nota: number) {
  if (nota >= PATAMAR_DE_REFERENCIA) return "bg-success";
  if (nota >= PISO_ELIMINATORIO_PADRAO) return "bg-brand-amber";
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

/**
 * Situação temporal de uma validade.
 *
 * Um selo de 12 meses só cumpre a promessa se a plataforma disser quando ele
 * está acabando. Sem isto, a data de validade é texto decorativo e a renovação
 * obrigatória depende de alguém lembrar.
 */
export function ValidadeBadge({ validade, className }: { validade: string; className?: string }) {
  const temporal = situacaoDaValidade(validade);
  if (!temporal) return null;

  const { situacao, dias } = temporal;
  const tom =
    situacao === "Vencida"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : situacao === "A vencer"
        ? "border-brand-amber/40 bg-brand-amber/10 text-brand-amber"
        : "border-success/30 bg-success/10 text-success";

  /* Contagem em dias só onde ela muda o que alguém faz: perto do vencimento ou
     depois dele. Fora dessa janela, a data diz mais que "faltam 339 dias". */
  const texto =
    situacao === "Vencida"
      ? `Vencido há ${Math.abs(dias)} dias`
      : situacao === "A vencer"
        ? `Vence em ${dias} dias · ${validade}`
        : `Vigente até ${validade}`;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        tom,
        className,
      )}
    >
      {situacao === "Vigente" ? (
        <CalendarCheck className="size-3.5" aria-hidden />
      ) : (
        <CalendarClock className="size-3.5" aria-hidden />
      )}
      {texto}
    </span>
  );
}

/**
 * Prazo de apuração, marcado quando já passou.
 *
 * Uma fila que mostra prazo vencido com a mesma cara de prazo em dia esconde
 * exatamente o caso que precisa de ação.
 */
export function PrazoBadge({ prazo, className }: { prazo: string; className?: string }) {
  const dias = diasAPartirDeHoje(prazo);
  if (dias === null) return null;

  const atrasado = dias < 0;
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
        atrasado
          ? "border-destructive/30 bg-destructive/10 font-semibold text-destructive"
          : "border-border text-muted-foreground",
        className,
      )}
    >
      {atrasado ? (
        <>
          <AlertTriangle className="size-3" aria-hidden /> Prazo vencido há {Math.abs(dias)} dias
        </>
      ) : (
        <>
          <CalendarClock className="size-3" aria-hidden /> Prazo em {dias} dias · {prazo}
        </>
      )}
    </span>
  );
}
