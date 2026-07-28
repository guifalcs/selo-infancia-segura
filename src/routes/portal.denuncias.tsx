import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Megaphone, ShieldAlert, CheckCircle2, Clock3, ChevronRight } from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, Vazio, AvisoDemo } from "@/components/PortalUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GravidadeBadge, StatusDenunciaBadge } from "@/components/DenunciaUI";
import { denuncias, denunciaEmAberto, institutionPorId, type Denuncia } from "@/lib/mock-data";
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

const filtros = ["Todas", "Em aberto", "Concluídas"] as const;

function Denuncias() {
  return (
    <PortalLayout title="Denúncias" subtitle="Relatos recebidos pelo canal público de escuta">
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
  const graves = doEscopo.filter((d) => d.gravidade === "Alta" && denunciaEmAberto(d));
  const semTriagem = doEscopo.filter((d) => d.gravidade === null);

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
          icon={Clock3}
          label="Gravidade alta em aberto"
          valor={graves.length}
          detalhe={
            semTriagem.length
              ? `Apuração prioritária · ${semTriagem.length} ainda sem triagem`
              : "Apuração prioritária"
          }
          tom={graves.length ? "destructive" : "teal"}
        />
      </div>

      <Painel
        titulo="Relatos recebidos"
        descricao="Clique em uma denúncia para ver o relato completo, a linha do tempo da apuração e o efeito sobre o selo."
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
              <li key={d.protocolo}>
                <ItemDaFila denuncia={d} mostrarInstituicao={escopo.papel !== "unidade"} />
              </li>
            ))}
          </ul>
        )}
      </Painel>

      <AvisoDemo>
        A gravidade não é declarada por quem denuncia: sai da triagem do SIS, a partir do piso
        automático da natureza informada, da leitura do relato e da recorrência de relatos no mesmo
        eixo da unidade. Até a triagem acontecer, o caso não tem nível.{" "}
        {escopo.papel === "admin"
          ? "É a equipe SIS que classifica, abre avaliação extraordinária quando é o caso e decide por suspender um selo — e cada etapa vira um evento na cadeia, inclusive as que terminam em improcedência."
          : "Cada etapa vira um evento na cadeia, inclusive as que terminam em improcedência: é o que faz o andamento não depender da palavra de quem apura."}
      </AvisoDemo>
    </div>
  );
}

function ItemDaFila({
  denuncia: d,
  mostrarInstituicao,
}: {
  denuncia: Denuncia;
  mostrarInstituicao: boolean;
}) {
  return (
    <Link
      to="/portal/denuncias/$protocolo"
      params={{ protocolo: d.protocolo }}
      className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/50"
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">{d.protocolo}</span>
          <StatusDenunciaBadge status={d.status} />
          <GravidadeBadge gravidade={d.gravidade} />
          <span className="ml-auto font-mono text-xs text-muted-foreground">{d.data}</span>
        </div>

        {mostrarInstituicao && (
          <p className="mt-2 text-sm font-semibold text-primary">
            {institutionPorId.get(d.instituicaoId)?.nome ?? d.instituicaoId}
          </p>
        )}

        <p className="mt-1 text-sm font-medium">{d.categoria}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{d.resumo}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="outline" className="font-normal">
            {d.eixo}
          </Badge>
          <span>
            {denunciaEmAberto(d) ? `Prazo de apuração: ${d.prazo}` : `Encerrada · ${d.responsavel}`}
          </span>
        </div>
      </div>

      <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
    </Link>
  );
}
