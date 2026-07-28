import type { GravidadeDenuncia, StatusDenuncia } from "@/lib/mock-data";

/**
 * Etiquetas de denúncia compartilhadas pela fila e pela tela de detalhe.
 *
 * Status e gravidade são lidos nas duas telas em sequência — se cada uma
 * pintasse do seu jeito, a mesma denúncia pareceria outra ao ser aberta.
 */

const corDoStatus: Record<StatusDenuncia, string> = {
  Recebida: "border-brand-blue/30 bg-brand-blue/10 text-brand-blue",
  "Em apuração": "border-brand-amber/40 bg-brand-amber/10 text-brand-amber",
  Procedente: "border-destructive/30 bg-destructive/10 text-destructive",
  Improcedente: "border-success/30 bg-success/10 text-success",
};

const corDaGravidade: Record<GravidadeDenuncia, string> = {
  Alta: "border-destructive/30 bg-destructive/10 text-destructive",
  Média: "border-brand-amber/40 bg-brand-amber/10 text-brand-amber",
  Baixa: "border-brand-teal/30 bg-brand-teal/10 text-brand-teal",
};

export function StatusDenunciaBadge({ status }: { status: StatusDenuncia }) {
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${corDoStatus[status]}`}
    >
      {status}
    </span>
  );
}

/**
 * Gravidade — ou a ausência dela.
 *
 * Nível nulo é o caso ainda não triado. Mostrar "aguardando triagem" em vez de
 * um nível qualquer evita a tela afirmar uma classificação que a linha do tempo
 * diz que ainda não aconteceu.
 */
export function GravidadeBadge({ gravidade }: { gravidade: GravidadeDenuncia | null }) {
  if (!gravidade) {
    return (
      <span className="rounded-full border border-dashed px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        Aguardando triagem
      </span>
    );
  }

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${corDaGravidade[gravidade]}`}
    >
      Gravidade {gravidade.toLowerCase()}
    </span>
  );
}
