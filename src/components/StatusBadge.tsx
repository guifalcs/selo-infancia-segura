import { CheckCircle2, Clock, CircleDashed, AlertOctagon } from "lucide-react";
import type { Status } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * Situação da certificação.
 *
 * A cor aqui é semântica, nunca decorativa: verde só aparece quando a
 * instituição está de fato certificada, e vermelho só em suspensão. Cada
 * estado também carrega um ícone próprio — cor sozinha não é acessível para
 * quem tem daltonismo.
 */

const config: Record<Status, { classe: string; Icone: typeof CheckCircle2 }> = {
  Certificada: {
    classe: "border-success/30 bg-success/10 text-success",
    Icone: CheckCircle2,
  },
  "Em avaliação": {
    classe: "border-brand-blue/30 bg-brand-blue/10 text-brand-blue",
    Icone: Clock,
  },
  Pendente: {
    classe: "border-border bg-muted text-muted-foreground",
    Icone: CircleDashed,
  },
  Suspensa: {
    classe: "border-destructive/30 bg-destructive/10 text-destructive",
    Icone: AlertOctagon,
  },
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  const { classe, Icone } = config[status];
  return (
    <span
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
