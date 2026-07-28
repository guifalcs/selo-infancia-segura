import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Blocks, Link2, ShieldCheck, FileClock } from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, Vazio, AvisoDemo } from "@/components/PortalUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { institutionPorId, registros, type RegistroBlockchain } from "@/lib/mock-data";
import type { Escopo } from "@/lib/portal-access";

export const Route = createFileRoute("/portal/registros")({
  head: () => ({
    meta: [
      { title: "Registros | Portal SIS" },
      {
        name: "description",
        content: "Eventos do ciclo de certificação registrados em blockchain.",
      },
      { property: "og:title", content: "Registros | Portal SIS" },
      {
        property: "og:description",
        content: "Histórico imutável de avaliações, selos e denúncias.",
      },
    ],
  }),
  component: Registros,
});

const rotuloTipo: Record<RegistroBlockchain["tipo"], string> = {
  certificacao: "Certificação",
  avaliacao: "Avaliação",
  renovacao: "Renovação",
  denuncia: "Denúncia",
  atualizacao: "Atualização",
};

const corTipo: Record<RegistroBlockchain["tipo"], string> = {
  certificacao: "border-success/30 bg-success/10 text-success",
  avaliacao: "border-brand-teal/30 bg-brand-teal/10 text-brand-teal",
  renovacao: "border-brand-blue/30 bg-brand-blue/10 text-brand-blue",
  denuncia: "border-destructive/30 bg-destructive/10 text-destructive",
  atualizacao: "border-brand-amber/40 bg-brand-amber/10 text-brand-amber",
};

const tipos = [
  "todos",
  "certificacao",
  "avaliacao",
  "renovacao",
  "denuncia",
  "atualizacao",
] as const;

function Registros() {
  return (
    <PortalLayout
      title="Registros na blockchain"
      subtitle="Histórico permanente: nada é editado, tudo entra como novo evento"
    >
      {(escopo) => <Livro escopo={escopo} />}
    </PortalLayout>
  );
}

function Livro({ escopo }: { escopo: Escopo }) {
  const [tipo, setTipo] = useState<(typeof tipos)[number]>("todos");
  const ids = new Set(escopo.instituicoes.map((i) => i.id));
  const doEscopo = registros.filter((r) => ids.has(r.instituicaoId));
  const lista = tipo === "todos" ? doEscopo : doEscopo.filter((r) => r.tipo === tipo);

  const certificacoesRegistradas = doEscopo.filter(
    (r) => r.tipo === "certificacao" || r.tipo === "renovacao",
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Indicador
          icon={Blocks}
          label="Eventos registrados"
          valor={doEscopo.length}
          detalhe={escopo.papel === "unidade" ? "Nesta unidade" : "No seu escopo"}
        />
        <Indicador
          icon={ShieldCheck}
          label="Selos e renovações"
          valor={certificacoesRegistradas}
          detalhe="Cada emissão gera um token"
          tom="green"
        />
        <Indicador
          icon={FileClock}
          label="Bloco mais recente"
          valor={doEscopo[0]?.bloco ?? "-"}
          detalhe={doEscopo[0]?.data ?? "Sem registros"}
          tom="teal"
        />
      </div>

      <Painel
        titulo="Livro de eventos"
        descricao="Ordenado do mais recente para o mais antigo. O número do bloco cresce com o tempo, então a ordem não pode ser reescrita."
        acoes={
          <div className="flex flex-wrap gap-1">
            {tipos.map((t) => (
              <Button
                key={t}
                size="sm"
                variant={tipo === t ? "default" : "ghost"}
                onClick={() => setTipo(t)}
              >
                {t === "todos" ? "Todos" : rotuloTipo[t]}
              </Button>
            ))}
          </div>
        }
      >
        {lista.length === 0 ? (
          <Vazio>Nenhum registro para este filtro.</Vazio>
        ) : (
          <ol className="divide-y">
            {lista.map((r) => (
              <li key={r.bloco} className="flex flex-wrap items-start gap-3 px-5 py-4">
                <span className="mt-0.5 font-mono text-xs font-semibold text-muted-foreground">
                  {r.bloco}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${corTipo[r.tipo]}`}
                    >
                      {rotuloTipo[r.tipo]}
                    </span>
                    {escopo.papel !== "unidade" && (
                      <span className="text-xs font-medium text-primary">
                        {institutionPorId.get(r.instituicaoId)?.nome ?? r.instituicaoId}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm font-medium leading-snug">{r.evento}</p>
                  <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                    <Link2 className="size-3 shrink-0" aria-hidden />
                    {r.hash}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 font-mono text-[11px]">
                  {r.data}
                </Badge>
              </li>
            ))}
          </ol>
        )}
      </Painel>

      <AvisoDemo>
        Hashes e números de bloco são gerados de forma determinística a partir dos dados de
        demonstração. Não há rede blockchain conectada a este protótipo. A estrutura, porém, é a
        que será registrada: evento, data, instituição e hash do conteúdo.
      </AvisoDemo>
    </div>
  );
}
