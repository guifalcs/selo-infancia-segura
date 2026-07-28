import { CheckCircle2, Clock, CircleDashed, AlertOctagon, Stamp } from "lucide-react";
import type { Status } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * Situação da certificação.
 *
 * A cor aqui é semântica, nunca decorativa: verde só aparece quando a
 * instituição está de fato certificada, e vermelho só em suspensão. Cada
 * estado também carrega um ícone próprio — cor sozinha não é acessível para
 * quem tem daltonismo.
 *
 * "Aguardando emissão" usa âmbar de propósito: a avaliação terminou, mas ainda
 * não existe selo, e pintar de verde faria a etiqueta afirmar uma certificação
 * que a tabela de certificações não teria como mostrar.
 */

const config: Record<Status, { classe: string; Icone: typeof CheckCircle2; ajuda: string }> = {
  Certificada: {
    classe: "border-success/30 bg-success/10 text-success",
    Icone: CheckCircle2,
    ajuda: "Selo emitido e dentro da validade.",
  },
  "Aguardando emissão": {
    classe: "border-brand-amber/40 bg-brand-amber/10 text-brand-amber",
    Icone: Stamp,
    ajuda: "Avaliação concluída com nota apurada; a emissão do selo é decisão da equipe SIS.",
  },
  "Em avaliação": {
    classe: "border-brand-blue/30 bg-brand-blue/10 text-brand-blue",
    Icone: Clock,
    ajuda: "Visita presencial em curso, sem nota fechada.",
  },
  Pendente: {
    classe: "border-border bg-muted text-muted-foreground",
    Icone: CircleDashed,
    ajuda: "Primeira avaliação ainda não realizada.",
  },
  Suspensa: {
    classe: "border-destructive/30 bg-destructive/10 text-destructive",
    Icone: AlertOctagon,
    ajuda: "Selo cassado após apuração de denúncia. O histórico permanece na cadeia.",
  },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const { classe, Icone, ajuda } = config[status];
  return (
    <span
      title={ajuda}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        classe,
        className,
      )}
    >
      <Icone className="size-3.5" aria-hidden />
      {status}
    </span>
  );
}
