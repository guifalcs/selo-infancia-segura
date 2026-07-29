import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Blocks,
  Building2,
  CalendarClock,
  ClipboardList,
  ExternalLink,
  FileText,
  Gavel,
  Link2,
  ListChecks,
  Megaphone,
  ShieldAlert,
  UserCheck,
  EyeOff,
} from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { GravidadeBadge, StatusDenunciaBadge } from "@/components/DenunciaUI";
import { Painel, Vazio, AvisoDemo, PrazoBadge } from "@/components/PortalUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  denunciaEmAberto,
  denunciaPorProtocolo,
  institutionPorId,
  nivelDaInstituicao,
  origemDaGravidade,
  pisoDeGravidade,
  pontuacaoDaInstituicao,
  registroDaEtapa,
  type Denuncia,
} from "@/lib/mock-data";
import type { Escopo } from "@/lib/portal-access";
import { usePortalSession } from "@/lib/portal-session";

export const Route = createFileRoute("/portal/denuncias_/$protocolo")({
  /* Sem teor do caso nas metatags: elas são geradas antes de saber quem está
     logado, e o recorte por escopo só acontece no corpo da página. */
  head: ({ params }) => {
    const title = `${params.protocolo} | Portal SIS`;
    const desc = "Acompanhamento de denúncia recebida pelo canal público.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: DetalheDaDenuncia,
});

function DetalheDaDenuncia() {
  const { protocolo } = Route.useParams();
  const { escopo } = usePortalSession();
  const denuncia = denunciaPorProtocolo.get(protocolo) ?? null;

  /* O cabeçalho é renderizado antes do corpo, então o recorte também vale para
     ele: a categoria de uma denúncia de outra instituição não pode vazar pelo
     subtítulo de quem digitou a URL. */
  const visivel = Boolean(
    denuncia && escopo?.instituicoes.some((i) => i.id === denuncia.instituicaoId),
  );

  return (
    <PortalLayout
      title={protocolo}
      subtitle={visivel && denuncia ? denuncia.categoria : "Denúncia recebida pelo canal público"}
      acoes={
        <Button asChild variant="outline" size="sm">
          <Link to="/portal/denuncias">
            <ArrowLeft className="size-4" aria-hidden /> Voltar à fila
          </Link>
        </Button>
      }
    >
      {(escopo) => <Conteudo escopo={escopo} denuncia={denuncia} />}
    </PortalLayout>
  );
}

/** Aviso de denúncia inexistente ou fora do recorte da conta. */
function ForaDoEscopo({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="size-6" aria-hidden />
      </div>
      <h2 className="mt-4 text-lg font-semibold">{titulo}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{texto}</p>
      <Button asChild className="mt-6">
        <Link to="/portal/denuncias">Voltar às denúncias</Link>
      </Button>
    </div>
  );
}

function Conteudo({ escopo, denuncia }: { escopo: Escopo; denuncia: Denuncia | null }) {
  if (!denuncia) {
    return (
      <ForaDoEscopo
        titulo="Denúncia não localizada"
        texto="Nenhum relato com este protocolo consta na base. Confira o número na fila de denúncias."
      />
    );
  }

  /* O recorte por escopo é refeito aqui: a URL é adivinhável, então esconder o
     link na fila não bastaria para impedir uma unidade de ler a da vizinha. */
  const noEscopo = escopo.instituicoes.some((i) => i.id === denuncia.instituicaoId);
  if (!noEscopo) {
    return (
      <ForaDoEscopo
        titulo="Esta denúncia está fora do seu acesso"
        texto="O relato pertence a uma instituição que não faz parte do seu escopo. Se você precisa acompanhá-lo, solicite ao responsável pela sua organização."
      />
    );
  }

  const inst = institutionPorId.get(denuncia.instituicaoId) ?? null;
  const emAberto = denunciaEmAberto(denuncia);

  return (
    <div className="space-y-6">
      {/* Cabeçalho do caso — status, gravidade e efeito sobre o selo juntos. */}
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <StatusDenunciaBadge status={denuncia.status} />
          <GravidadeBadge gravidade={denuncia.gravidade} />
          <Badge variant="outline" className="font-normal">
            {denuncia.eixo}
          </Badge>
        </div>

        {/* Quem denuncia não classifica o próprio relato: a linha abaixo diz de
            onde veio o nível, que é a primeira pergunta de quem lê a fila. */}
        <p className="mt-2 text-xs text-muted-foreground">{origemDaGravidade(denuncia)}</p>

        <h2 className="mt-4 text-2xl font-bold leading-tight text-primary">{denuncia.categoria}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {denuncia.resumo}
        </p>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: CalendarClock, rotulo: "Recebida em", valor: denuncia.data },
            {
              icon: ClipboardList,
              /* Sem triagem, o prazo ainda é o padrão de 30 dias: pode encurtar
                 quando o caso for classificado. */
              rotulo: !emAberto
                ? "Apuração encerrada"
                : denuncia.gravidade
                  ? "Prazo de apuração"
                  : "Prazo inicial de apuração",
              valor: emAberto
                ? denuncia.prazo
                : (denuncia.andamento.at(-1)?.data ?? denuncia.prazo),
              badge: emAberto ? <PrazoBadge prazo={denuncia.prazo} /> : null,
            },
            { icon: UserCheck, rotulo: "Responsável", valor: denuncia.responsavel },
            { icon: Building2, rotulo: "Instituição", valor: inst?.nome ?? denuncia.instituicaoId },
          ].map((d) => (
            <div key={d.rotulo} className="rounded-lg border bg-background p-4">
              <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                <d.icon className="size-3.5 shrink-0" aria-hidden /> {d.rotulo}
              </dt>
              <dd className="mt-2 text-sm font-semibold leading-snug">{d.valor}</dd>
              {"badge" in d && d.badge && <div className="mt-2">{d.badge}</div>}
            </div>
          ))}
        </dl>

        {/* O caso está na cadeia e não na ficha pública — em qualquer estágio.
            Dizer isso onde a instituição lê o caso é o que sustenta a confiança
            no canal: ela sabe que a plataforma não expõe acusação por apurar. */}
        <p className="mt-4 flex items-start gap-2 rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          <EyeOff className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>
            Este relato está gravado na cadeia, com bloco e hash próprios, e não aparece na ficha
            pública da instituição em nenhum estágio — nem depois da triagem. Relato é alegação:
            publicá-lo cobraria da instituição uma acusação que o SIS ainda não decidiu, e faria do
            canal de escuta um instrumento de ataque de imagem. Da apuração, só a suspensão do selo
            chega ao público, e sem citar este protocolo.
          </span>
        </p>

        <p className="mt-5 flex items-start gap-2 rounded-lg border border-dashed bg-muted/40 px-4 py-3 text-sm leading-relaxed">
          <Gavel className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
          <span>
            <strong className="font-semibold">Efeito sobre o selo:</strong> {denuncia.impactoNoSelo}
          </span>
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Painel
            titulo="Relato registrado"
            descricao="Teor recebido pelo canal público, sem edição posterior."
          >
            <div className="px-5 py-5">
              <p className="text-xs text-muted-foreground">
                Natureza marcada no formulário:{" "}
                <strong className="font-semibold text-foreground">{denuncia.natureza}</strong>
                {pisoDeGravidade[denuncia.natureza]
                  ? ` · piso de gravidade ${pisoDeGravidade[denuncia.natureza]?.toLowerCase()}`
                  : " · sem piso de gravidade automático"}
              </p>
              <p className="mt-3 border-l-2 border-primary/30 pl-4 text-sm leading-relaxed">
                {denuncia.relato}
              </p>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                <FileText className="size-3.5 shrink-0" aria-hidden />
                Protocolo {denuncia.protocolo} · registrado em {denuncia.data}
              </p>
            </div>
          </Painel>

          <Painel
            titulo="Linha do tempo da apuração"
            descricao="Cada etapa entra na cadeia como um bloco novo: nada é reescrito depois."
          >
            <ol className="space-y-0 px-5 py-5">
              {denuncia.andamento.map((etapa, i) => {
                const registro = registroDaEtapa(denuncia.protocolo, i);
                const ultima = i === denuncia.andamento.length - 1;
                return (
                  <li key={`${etapa.data}-${etapa.titulo}`} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span
                        className={`mt-1 size-2.5 shrink-0 rounded-full ${
                          ultima && !emAberto
                            ? "bg-success"
                            : ultima
                              ? "bg-brand-amber"
                              : "bg-primary/40"
                        }`}
                        aria-hidden
                      />
                      {!ultima && <span className="my-1 w-px flex-1 bg-border" aria-hidden />}
                    </div>

                    <div className={ultima ? "min-w-0 flex-1" : "min-w-0 flex-1 pb-6"}>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="text-sm font-semibold leading-snug">{etapa.titulo}</p>
                        <time className="font-mono text-xs text-muted-foreground">
                          {etapa.data}
                        </time>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        {etapa.detalhe}
                      </p>
                      <p className="mt-1.5 text-xs text-muted-foreground">{etapa.responsavel}</p>
                      {registro && (
                        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-muted-foreground">
                          <Link2 className="size-3 shrink-0" aria-hidden />
                          bloco {registro.bloco} · {registro.hash}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </Painel>

          <Painel
            titulo="Providências"
            descricao="O que foi determinado à instituição a partir deste relato."
          >
            {denuncia.providencias.length === 0 ? (
              <Vazio>
                Nenhuma providência até aqui: a triagem ainda não classificou a gravidade do relato.
              </Vazio>
            ) : (
              <ul className="space-y-3 px-5 py-5">
                {denuncia.providencias.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-sm leading-relaxed">
                    <ListChecks className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            )}
          </Painel>
        </div>

        <div className="space-y-6">
          <Painel titulo="Desfecho">
            <div className="px-5 py-5">
              {denuncia.desfecho ? (
                <p className="text-sm leading-relaxed">{denuncia.desfecho}</p>
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Apuração em curso. O desfecho é publicado aqui e gravado na cadeia quando o caso
                  for encerrado — inclusive se for considerado improcedente.
                </p>
              )}
            </div>
          </Painel>

          {inst && (
            <Painel titulo="Instituição" descricao={`${inst.tipo} · ${inst.cidade} - ${inst.uf}`}>
              <div className="space-y-3 px-5 py-5">
                <p className="text-sm font-semibold text-primary">{inst.nome}</p>
                <dl className="space-y-2 text-xs">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Situação</dt>
                    <dd className="font-medium">{inst.status}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Nível do selo</dt>
                    <dd className="font-medium">{nivelDaInstituicao(inst.id) ?? "-"}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Pontuação</dt>
                    <dd className="font-mono font-medium">
                      {pontuacaoDaInstituicao(inst.id) ?? "-"}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Última avaliação</dt>
                    <dd className="font-mono font-medium">{inst.ultimaAvaliacao}</dd>
                  </div>
                </dl>

                <div className="flex flex-col gap-2 pt-1">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/cidadao/instituicao/$id" params={{ id: inst.id }}>
                      <ExternalLink className="size-4" aria-hidden /> Ver ficha pública
                    </Link>
                  </Button>
                  {escopo.papel === "unidade" && (
                    <Button asChild variant="ghost" size="sm">
                      <Link to="/portal/plano">
                        <ListChecks className="size-4" aria-hidden /> Abrir plano de adequação
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </Painel>
          )}

          <Painel
            titulo="Rastro na blockchain"
            descricao="Blocos gerados por esta denúncia."
            acoes={
              <Button asChild variant="ghost" size="sm">
                <Link to="/portal/registros">
                  <Blocks className="size-4" aria-hidden /> Livro
                </Link>
              </Button>
            }
          >
            <ul className="divide-y">
              {denuncia.andamento.map((etapa, i) => {
                const registro = registroDaEtapa(denuncia.protocolo, i);
                if (!registro) return null;
                return (
                  <li key={registro.bloco} className="px-5 py-3">
                    <p className="font-mono text-xs font-semibold">{registro.bloco}</p>
                    <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                      {etapa.titulo}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {registro.hash}
                    </p>
                  </li>
                );
              })}
            </ul>
          </Painel>
        </div>
      </div>

      <AvisoDemo>
        <span className="flex items-start gap-2">
          <Megaphone className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          <span>
            Relato, etapas e hashes são fictícios e existem para demonstrar como um caso é
            acompanhado do recebimento ao desfecho.
          </span>
        </span>
      </AvisoDemo>
    </div>
  );
}
