import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Award, ShieldCheck, ExternalLink, Blocks, CheckCircle2, RefreshCw } from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, Vazio, BarraDeNota } from "@/components/PortalUI";
import { StatusBadge } from "@/components/StatusBadge";
import { Seal, SealChip } from "@/components/Seal";
import { SubseloBadge } from "@/components/SubseloBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  certificacaoDaInstituicao,
  hashDemo,
  niveis,
  registrosDaInstituicao,
  resumoDoConjunto,
  type Institution,
} from "@/lib/mock-data";
import type { Escopo } from "@/lib/portal-access";

export const Route = createFileRoute("/portal/certificacoes")({
  head: () => ({
    meta: [
      { title: "Certificações | Portal SIS" },
      { name: "description", content: "Selos emitidos e registrados em blockchain." },
      { property: "og:title", content: "Certificações | Portal SIS" },
      { property: "og:description", content: "Certificações do seu escopo de acesso." },
    ],
  }),
  component: Certificacoes,
});

function Certificacoes() {
  return (
    <PortalLayout
      title="Certificações"
      subtitle="Selos vigentes, validade e registro na blockchain"
    >
      {(escopo) =>
        escopo.papel === "unidade" ? (
          <MinhaCertificacao escopo={escopo} />
        ) : (
          <CertificacoesDoEscopo escopo={escopo} />
        )
      }
    </PortalLayout>
  );
}

/* -------------------------------------------------------------------------- */
/* Unidade                                                                    */
/* -------------------------------------------------------------------------- */

function MinhaCertificacao({ escopo }: { escopo: Escopo }) {
  const inst = escopo.instituicao;
  if (!inst) return <Vazio>Nenhuma instituição vinculada a este acesso.</Vazio>;

  const cert = certificacaoDaInstituicao(inst.id);
  const faixa = niveis.find((n) => n.nivel === inst.nivel);
  const eventos = registrosDaInstituicao(inst.id).filter(
    (r) => r.tipo === "certificacao" || r.tipo === "renovacao" || r.tipo === "atualizacao",
  );

  if (!cert || !inst.nivel) {
    return (
      <Painel titulo="Sem certificação vigente">
        <div className="space-y-4 p-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            Esta instituição ainda não tem selo emitido. A primeira avaliação presencial precisa ser
            concluída por um profissional credenciado antes da emissão.
          </p>
          <Button asChild variant="outline">
            <Link to="/portal/auditorias">Ver avaliações agendadas</Link>
          </Button>
        </div>
      </Painel>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Seal nivel={inst.nivel} className="size-36 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={inst.status} />
              <Badge variant="outline">{cert.status}</Badge>
            </div>
            <h2 className="mt-3 text-2xl font-bold text-primary">Selo {inst.nivel}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {faixa ? `${faixa.faixa}: ${faixa.resumo}` : ""}
            </p>

            <dl className="mt-5 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              {[
                { rotulo: "Pontuação", valor: `${cert.pontuacao}/100`, mono: false },
                { rotulo: "Emissão", valor: cert.emissao, mono: false },
                { rotulo: "Validade", valor: cert.validade, mono: false },
                { rotulo: "Token", valor: cert.token, mono: true },
              ].map((d) => (
                <div key={d.rotulo}>
                  <dt className="text-xs text-muted-foreground">{d.rotulo}</dt>
                  <dd className={`font-semibold ${d.mono ? "font-mono text-xs" : ""}`}>
                    {d.valor}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-4 font-mono text-[11px] text-muted-foreground">
              hash do registro: {cert.hash}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t pt-5">
          <Button asChild variant="outline">
            <Link to="/cidadao/instituicao/$id" params={{ id: inst.id }}>
              <ExternalLink className="size-4" aria-hidden /> Ver como as famílias veem
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/portal/registros">
              <Blocks className="size-4" aria-hidden /> Histórico na blockchain
            </Link>
          </Button>
          <Button asChild>
            <Link to="/portal/plano">
              <RefreshCw className="size-4" aria-hidden /> Preparar renovação
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Painel
          titulo="Notas que sustentam o selo"
          descricao="O nível é definido pela média ponderada dos seis eixos."
          className="lg:col-span-2"
        >
          <ul className="space-y-5 p-5">
            {inst.criterios.map((c) => (
              <li key={c.nome}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-sm font-semibold">{c.nome}</p>
                  <p className="font-mono text-sm font-semibold text-primary">{c.nota}</p>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{c.base}</p>
                <BarraDeNota nota={c.nota} rotulo={c.nome} className="mt-2" />
              </li>
            ))}
          </ul>
        </Painel>

        <div className="space-y-4">
          <Painel titulo="Subselos">
            {inst.subselos.length === 0 ? (
              <Vazio>Nenhum subselo temático conquistado até agora.</Vazio>
            ) : (
              <ul className="space-y-3 p-5">
                {inst.subselos.map((s) => (
                  <li key={s} className="flex items-center gap-3">
                    <SubseloBadge nome={s} size={44} decorativa />
                    <span className="text-sm font-medium">{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </Painel>

          <Painel titulo="Eventos do selo" descricao="Emissões, renovações e subselos.">
            <ul className="divide-y">
              {eventos.map((e) => (
                <li key={e.bloco} className="px-5 py-3">
                  <p className="text-sm font-medium leading-snug">{e.evento}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                    {e.bloco} · {e.data}
                  </p>
                </li>
              ))}
            </ul>
          </Painel>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Rede e administração                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Emissão de certificação — exclusiva da equipe SIS.
 *
 * No protótipo, a confirmação não grava nada: mostra o token e o hash que
 * seriam registrados. É deliberado deixar isso explícito na tela, para que
 * ninguém confunda a demonstração com uma emissão de verdade.
 */
function DialogoDeEmissao({ inst }: { inst: Institution }) {
  const [aberto, setAberto] = useState(false);
  const [emitido, setEmitido] = useState(false);
  const token = `SIS-2026-${inst.id.replace(/\D/g, "").padStart(4, "0")}`;

  return (
    <Dialog
      open={aberto}
      onOpenChange={(v) => {
        setAberto(v);
        if (!v) setEmitido(false);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Award className="size-4" aria-hidden /> Emitir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Emitir certificação para {inst.nome}</DialogTitle>
          <DialogDescription>
            Confira a apuração antes de registrar o selo. O registro na blockchain é definitivo:
            correções posteriores entram como novo evento, nunca como edição.
          </DialogDescription>
        </DialogHeader>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Nota apurada</dt>
            <dd className="font-semibold">{inst.pontuacao ?? "-"}/100</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Nível correspondente</dt>
            <dd className="font-semibold">{inst.nivel ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Avaliador</dt>
            <dd className="font-semibold">{inst.avaliador ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Validade</dt>
            <dd className="font-semibold">12 meses a partir da emissão</dd>
          </div>
        </dl>

        {emitido ? (
          <div className="rounded-lg border border-success/30 bg-success/10 p-4 text-sm">
            <p className="flex items-center gap-2 font-semibold text-success">
              <CheckCircle2 className="size-4" aria-hidden /> Emissão simulada
            </p>
            <p className="mt-2 font-mono text-xs text-foreground">
              token {token} · hash {hashDemo(`emissao:${inst.id}`)}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Nada foi gravado: este protótipo não tem contrato em rede. Numa emissão real, o token
              passaria a aparecer na ficha pública da instituição.
            </p>
          </div>
        ) : (
          <DialogFooter>
            <Button variant="outline" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setEmitido(true)}>
              <ShieldCheck className="size-4" aria-hidden /> Registrar na blockchain
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CertificacoesDoEscopo({ escopo }: { escopo: Escopo }) {
  const ehAdmin = escopo.papel === "admin";
  const lista = escopo.instituicoes;
  const resumo = resumoDoConjunto(lista);
  const comSelo = lista.filter((i) => i.nivel !== null);
  const filaDeEmissao = lista.filter((i) => i.status === "Em avaliação");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Indicador icon={Award} label="Selos vigentes" valor={resumo.certificadas} tom="green" />
        <Indicador
          icon={ShieldCheck}
          label="Nível predominante"
          valor={
            resumo.porNivel.Ouro >= resumo.porNivel.Prata &&
            resumo.porNivel.Ouro >= resumo.porNivel.Bronze
              ? "Ouro"
              : resumo.porNivel.Prata >= resumo.porNivel.Bronze
                ? "Prata"
                : "Bronze"
          }
          detalhe={`${resumo.porNivel.Ouro} Ouro · ${resumo.porNivel.Prata} Prata · ${resumo.porNivel.Bronze} Bronze`}
        />
        <Indicador
          icon={RefreshCw}
          label="Em renovação"
          valor={resumo.emAvaliacao}
          detalhe="Avaliação em andamento"
          tom="teal"
        />
        <Indicador
          icon={Blocks}
          label="Subselos concedidos"
          valor={resumo.subselos}
          detalhe="Temáticos, somados ao nível principal"
          tom="amber"
        />
      </div>

      {ehAdmin && (
        <Painel
          titulo="Aguardando emissão"
          descricao="Avaliações concluídas cuja decisão de selo ainda está com a equipe SIS."
        >
          {filaDeEmissao.length === 0 ? (
            <Vazio>Nenhuma emissão pendente.</Vazio>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Nota</TableHead>
                    <TableHead>Nível</TableHead>
                    <TableHead>Avaliador</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filaDeEmissao.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">{i.nome}</TableCell>
                      <TableCell className="font-mono text-sm">{i.pontuacao ?? "-"}</TableCell>
                      <TableCell>{i.nivel ? <SealChip nivel={i.nivel} /> : "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {i.avaliador ?? "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DialogoDeEmissao inst={i} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Painel>
      )}

      <Painel
        titulo={ehAdmin ? "Certificações emitidas" : "Selos das unidades"}
        descricao="Token e hash identificam o registro na rede; a validade é de 12 meses."
      >
        {comSelo.length === 0 ? (
          <Vazio>Nenhuma certificação emitida neste escopo.</Vazio>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Instituição</TableHead>
                  <TableHead className="whitespace-nowrap">Selo</TableHead>
                  <TableHead className="whitespace-nowrap">Nota</TableHead>
                  <TableHead className="whitespace-nowrap">Emissão</TableHead>
                  <TableHead className="whitespace-nowrap">Validade</TableHead>
                  <TableHead className="whitespace-nowrap">Situação</TableHead>
                  <TableHead className="whitespace-nowrap">Token · hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comSelo.map((i) => {
                  const cert = certificacaoDaInstituicao(i.id);
                  return (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">
                        <Link
                          to="/cidadao/instituicao/$id"
                          params={{ id: i.id }}
                          className="hover:text-primary hover:underline"
                        >
                          {i.nome}
                        </Link>
                        <span className="block text-xs text-muted-foreground">
                          {i.cidade} - {i.uf}
                        </span>
                      </TableCell>
                      <TableCell>{i.nivel && <SealChip nivel={i.nivel} />}</TableCell>
                      <TableCell className="font-mono text-sm">{i.pontuacao ?? "-"}</TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-sm">
                        {cert?.emissao ?? "-"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-sm">
                        {cert?.validade ?? "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            cert?.status === "Suspensa"
                              ? "destructive"
                              : cert?.status === "Em renovação"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {cert?.status ?? "-"}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                        {cert?.token}
                        <span className="block">{cert?.hash}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Painel>
    </div>
  );
}
