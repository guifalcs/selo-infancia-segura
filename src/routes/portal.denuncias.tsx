import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Megaphone, ShieldAlert, CheckCircle2, EyeOff } from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, Vazio, AvisoDemo } from "@/components/PortalUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  denuncias,
  denunciaEmAberto,
  institutionPorId,
  type StatusDenuncia,
} from "@/lib/mock-data";
import type { Escopo } from "@/lib/portal-access";

export const Route = createFileRoute("/portal/denuncias")({
  head: () => ({
    meta: [
      { title: "Denúncias | Portal SIS" },
      { name: "description", content: "Relatos recebidos pelo canal público de denúncias." },
      { property: "og:title", content: "Denúncias | Portal SIS" },
      { property: "og:description", content: "Acompanhamento das denúncias no seu escopo." },
    ],
  }),
  component: Denuncias,
});

const corDoStatus: Record<StatusDenuncia, string> = {
  Recebida: "border-brand-blue/30 bg-brand-blue/10 text-brand-blue",
  "Em apuração": "border-brand-amber/40 bg-brand-amber/10 text-brand-amber",
  Procedente: "border-destructive/30 bg-destructive/10 text-destructive",
  Improcedente: "border-success/30 bg-success/10 text-success",
};

const filtros = ["Todas", "Em aberto", "Concluídas"] as const;

function Denuncias() {
  return (
    <PortalLayout
      title="Denúncias"
      subtitle="Canal público de escuta: o autor nunca é exposto no portal"
    >
      {(escopo) => <Fila escopo={escopo} />}
    </PortalLayout>
  );
}

function Fila({ escopo }: { escopo: Escopo }) {
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>("Todas");
  const ids = new Set(escopo.instituicoes.map((i) => i.id));
  const doEscopo = denuncias.filter((d) => ids.has(d.instituicaoId));

  const lista = doEscopo.filter((d) =>
    filtro === "Todas" ? true : filtro === "Em aberto" ? denunciaEmAberto(d) : !denunciaEmAberto(d),
  );

  const abertas = doEscopo.filter(denunciaEmAberto);
  const procedentes = doEscopo.filter((d) => d.status === "Procedente");
  const anonimas = doEscopo.filter((d) => d.canal === "Anônimo");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Indicador icon={Megaphone} label="Denúncias no escopo" valor={doEscopo.length} />
        <Indicador
          icon={ShieldAlert}
          label="Em aberto"
          valor={abertas.length}
          detalhe="Recebidas ou em apuração"
          tom={abertas.length ? "destructive" : "green"}
        />
        <Indicador
          icon={CheckCircle2}
          label="Procedentes"
          valor={procedentes.length}
          detalhe="Geraram plano de adequação ou suspensão"
          tom="amber"
        />
        <Indicador
          icon={EyeOff}
          label="Recebidas anonimamente"
          valor={anonimas.length}
          detalhe="Identidade nunca exibida no portal"
          tom="teal"
        />
      </div>

      <Painel
        titulo="Relatos recebidos"
        descricao="Cada denúncia entra na blockchain como evento, inclusive quando é apurada e considerada improcedente."
        acoes={
          <div className="flex flex-wrap gap-1">
            {filtros.map((f) => (
              <Button
                key={f}
                size="sm"
                variant={filtro === f ? "default" : "ghost"}
                onClick={() => setFiltro(f)}
              >
                {f}
              </Button>
            ))}
          </div>
        }
      >
        {lista.length === 0 ? (
          <Vazio>
            {doEscopo.length === 0
              ? "Nenhuma denúncia registrada no seu escopo."
              : "Nenhuma denúncia neste filtro."}
          </Vazio>
        ) : (
          <ul className="divide-y">
            {lista.map((d) => (
              <li key={d.protocolo} className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{d.protocolo}</span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${corDoStatus[d.status]}`}
                  >
                    {d.status}
                  </span>
                  <Badge variant="outline">{d.canal}</Badge>
                  <span className="ml-auto font-mono text-xs text-muted-foreground">{d.data}</span>
                </div>

                {escopo.papel !== "unidade" && (
                  <p className="mt-2 text-sm font-semibold text-primary">
                    {institutionPorId.get(d.instituicaoId)?.nome ?? d.instituicaoId}
                  </p>
                )}

                <p className="mt-1 text-sm font-medium">{d.categoria}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.resumo}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Eixo afetado: <strong className="font-semibold">{d.eixo}</strong>
                </p>
              </li>
            ))}
          </ul>
        )}
      </Painel>

      <AvisoDemo>
        {escopo.papel === "admin"
          ? "A equipe SIS é quem classifica a denúncia, abre avaliação extraordinária e decide por suspender um selo. A instituição vê o teor e o encaminhamento, nunca a identidade de quem denunciou."
          : "A instituição enxerga o teor e o andamento de cada relato, mas não quem o registrou: isso é o que mantém o canal utilizável por famílias e funcionários."}
      </AvisoDemo>
    </div>
  );
}
