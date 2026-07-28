import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Award,
  ClipboardCheck,
  Megaphone,
  Gauge,
  CalendarClock,
  KeyRound,
  ExternalLink,
  Blocks,
  ListChecks,
  ArrowRight,
} from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, Vazio, BarraDeNota } from "@/components/PortalUI";
import { StatusBadge } from "@/components/StatusBadge";
import { SealChip, Seal } from "@/components/Seal";
import { SubseloBadge } from "@/components/SubseloBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  avaliacoesDaInstituicao,
  certificacaoDaInstituicao,
  denuncias,
  denunciaEmAberto,
  denunciasDaInstituicao,
  institutionPorId,
  mediaPorEixo,
  planoDeAdequacao,
  redes,
  registros,
  registrosDaInstituicao,
  resumoDoConjunto,
  type Institution,
} from "@/lib/mock-data";
import type { Escopo } from "@/lib/portal-access";

export const Route = createFileRoute("/portal/dashboard")({
  head: () => ({
    meta: [
      { title: "Visão geral | Portal SIS" },
      { name: "description", content: "Painel do portal institucional do SIS." },
      { property: "og:title", content: "Visão geral | Portal SIS" },
      {
        property: "og:description",
        content: "Painel de certificação, avaliações e denúncias conforme o seu perfil de acesso.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <PortalLayout
      title="Visão geral"
      subtitle="Situação atual do que está sob sua responsabilidade"
    >
      {(escopo) =>
        escopo.papel === "unidade" ? (
          <PainelDaUnidade escopo={escopo} />
        ) : escopo.papel === "rede" ? (
          <PainelDaRede escopo={escopo} />
        ) : (
          <PainelDoSIS escopo={escopo} />
        )
      }
    </PortalLayout>
  );
}

/* -------------------------------------------------------------------------- */
/* Unidade — uma instituição só, olhando para o próprio selo.                 */
/* -------------------------------------------------------------------------- */

function PainelDaUnidade({ escopo }: { escopo: Escopo }) {
  const inst = escopo.instituicao;
  if (!inst) return <Vazio>Nenhuma instituição vinculada a este acesso.</Vazio>;

  const cert = certificacaoDaInstituicao(inst.id);
  const plano = planoDeAdequacao(inst);
  const minhasDenuncias = denunciasDaInstituicao(inst.id);
  const abertas = minhasDenuncias.filter(denunciaEmAberto);
  const proxima = avaliacoesDaInstituicao(inst.id).find(
    (a) => a.status === "Agendada" || a.status === "Em andamento",
  );
  const historico = registrosDaInstituicao(inst.id);

  return (
    <div className="space-y-6">
      {/* Cartão do selo — é o que a instituição vem ver primeiro. */}
      <section className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
          {inst.nivel ? (
            <Seal nivel={inst.nivel} className="size-32 shrink-0" />
          ) : (
            <div className="grid size-32 shrink-0 place-items-center rounded-full border border-dashed text-xs text-muted-foreground">
              sem selo
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={inst.status} />
              {cert && (
                <Badge variant="outline" className="font-mono text-[11px]">
                  {cert.token}
                </Badge>
              )}
            </div>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-primary">{inst.nome}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {inst.tipo} · {inst.cidade} - {inst.uf}
              {escopo.rede && ` · ${escopo.rede.nome}`}
            </p>
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">Pontuação</dt>
                <dd className="font-semibold">
                  {inst.pontuacao !== null ? `${inst.pontuacao}/100` : "-"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Validade do selo</dt>
                <dd className="font-semibold">{inst.validade ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Avaliador responsável</dt>
                <dd className="font-semibold">{inst.avaliador ?? "-"}</dd>
              </div>
            </dl>
          </div>

          <Button asChild variant="outline" className="shrink-0">
            <Link to="/cidadao/instituicao/$id" params={{ id: inst.id }}>
              <ExternalLink className="size-4" aria-hidden /> Ver ficha pública
            </Link>
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Indicador
          icon={Gauge}
          label="Pontuação atual"
          valor={inst.pontuacao ?? "-"}
          detalhe={inst.nivel ? `Nível ${inst.nivel}` : "Sem certificação vigente"}
        />
        <Indicador
          icon={ListChecks}
          label="Ações no plano de adequação"
          valor={plano.length}
          detalhe={plano.length ? `${plano[0].eixo} é a prioridade` : "Nenhum eixo abaixo de 85"}
          tom="amber"
        />
        <Indicador
          icon={Megaphone}
          label="Denúncias em aberto"
          valor={abertas.length}
          detalhe={`${minhasDenuncias.length} no histórico`}
          tom={abertas.length ? "destructive" : "green"}
        />
        <Indicador
          icon={CalendarClock}
          label="Próxima avaliação"
          valor={proxima ? proxima.data : "-"}
          detalhe={proxima ? `${proxima.tipo} · ${proxima.avaliador}` : "Nada agendado"}
          tom="teal"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Painel
          titulo="Desempenho por eixo"
          descricao="Notas da última avaliação presencial, de 0 a 100."
          className="lg:col-span-2"
        >
          {inst.criterios.length === 0 ? (
            <Vazio>A primeira avaliação ainda não foi realizada.</Vazio>
          ) : (
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
          )}
        </Painel>

        <div className="space-y-4">
          <Painel titulo="Subselos conquistados">
            {inst.subselos.length === 0 ? (
              <Vazio>Nenhum subselo temático até agora.</Vazio>
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

          <Painel
            titulo="Últimos registros"
            descricao="Cada evento do ciclo fica gravado na rede."
            acoes={
              <Button asChild variant="ghost" size="sm">
                <Link to="/portal/registros">
                  <Blocks className="size-4" aria-hidden /> Ver tudo
                </Link>
              </Button>
            }
          >
            {historico.length === 0 ? (
              <Vazio>Nenhum registro ainda.</Vazio>
            ) : (
              <ul className="divide-y">
                {historico.slice(0, 4).map((r) => (
                  <li key={r.bloco} className="px-5 py-3">
                    <p className="text-sm font-medium leading-snug">{r.evento}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {r.bloco} · {r.data} · {r.hash}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Painel>
        </div>
      </div>

      <Painel
        titulo="Plano de adequação"
        descricao="Ações recomendadas para os eixos abaixo do patamar de referência."
        acoes={
          <Button asChild variant="ghost" size="sm">
            <Link to="/portal/plano">
              Abrir plano <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        }
      >
        {plano.length === 0 ? (
          <Vazio>Todos os eixos estão em 85 pontos ou mais. Nada pendente.</Vazio>
        ) : (
          <ul className="divide-y">
            {plano.slice(0, 3).map((item) => (
              <li key={item.eixo} className="flex flex-wrap items-start gap-3 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{item.eixo}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {item.acao}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="outline">{item.prazo}</Badge>
                  <Badge variant={item.status === "Em andamento" ? "default" : "secondary"}>
                    {item.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Painel>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Rede — prefeitura ou grupo privado acompanhando suas unidades.             */
/* -------------------------------------------------------------------------- */

/** Linha da tabela de unidades, reaproveitada pelos painéis de rede e do SIS. */
function LinhaDeUnidade({ inst, mostrarAcesso }: { inst: Institution; mostrarAcesso?: boolean }) {
  const abertas = denunciasDaInstituicao(inst.id).filter(denunciaEmAberto).length;
  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link
          to="/cidadao/instituicao/$id"
          params={{ id: inst.id }}
          className="hover:text-primary hover:underline"
        >
          {inst.nome}
        </Link>
        <span className="block text-xs text-muted-foreground">
          {inst.tipo} · {inst.cidade} - {inst.uf}
        </span>
      </TableCell>
      <TableCell>{inst.nivel ? <SealChip nivel={inst.nivel} /> : "-"}</TableCell>
      <TableCell className="font-mono text-sm">{inst.pontuacao ?? "-"}</TableCell>
      <TableCell>
        <StatusBadge status={inst.status} />
      </TableCell>
      <TableCell>
        {abertas > 0 ? (
          <Badge variant="destructive">{abertas} em aberto</Badge>
        ) : (
          <span className="text-xs text-muted-foreground">nenhuma</span>
        )}
      </TableCell>
      {mostrarAcesso && (
        <TableCell>
          {inst.acessoProprio ? (
            <Badge className="border border-success/30 bg-success/10 text-success">Concedido</Badge>
          ) : (
            <Badge variant="secondary">Somente rede</Badge>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}

function PainelDaRede({ escopo }: { escopo: Escopo }) {
  const unidades = escopo.instituicoes;
  const resumo = resumoDoConjunto(unidades);
  const eixosDaRede = mediaPorEixo(unidades).filter((e) => e.media !== null);
  const maisFraco = [...eixosDaRede].sort((a, b) => (a.media ?? 0) - (b.media ?? 0))[0];
  const comAcesso = unidades.filter((u) => u.acessoProprio).length;
  const ids = new Set(unidades.map((u) => u.id));
  const abertas = denuncias.filter((d) => ids.has(d.instituicaoId) && denunciaEmAberto(d));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Indicador
          icon={Building2}
          label="Unidades acompanhadas"
          valor={resumo.total}
          detalhe={`${resumo.certificadas} certificadas · ${resumo.pendentes} sem avaliação`}
        />
        <Indicador
          icon={Gauge}
          label="Média da rede"
          valor={resumo.media ?? "-"}
          detalhe={maisFraco ? `Eixo mais fraco: ${maisFraco.eixo}` : "Sem notas ainda"}
          tom="teal"
        />
        <Indicador
          icon={Megaphone}
          label="Denúncias em aberto"
          valor={resumo.denunciasAbertas}
          detalhe={`${resumo.denuncias} no total da rede`}
          tom={resumo.denunciasAbertas ? "destructive" : "green"}
        />
        <Indicador
          icon={KeyRound}
          label="Unidades com acesso próprio"
          valor={`${comAcesso}/${resumo.total}`}
          detalhe="A rede concede ou revoga esse acesso"
          tom="amber"
        />
      </div>

      <Painel
        titulo="Unidades da rede"
        descricao="Selo, pontuação e situação de cada unidade sob esta gestão."
        acoes={
          <Button asChild variant="ghost" size="sm">
            <Link to="/portal/instituicoes">
              Ver detalhes <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Unidade</TableHead>
                <TableHead>Selo</TableHead>
                <TableHead>Nota</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Denúncias</TableHead>
                <TableHead>Acesso próprio</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unidades.map((u) => (
                <LinhaDeUnidade key={u.id} inst={u} mostrarAcesso />
              ))}
            </TableBody>
          </Table>
        </div>
      </Painel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Painel
          titulo="Onde a rede está mais fraca"
          descricao="Média das notas de todas as unidades, por eixo avaliado."
        >
          <ul className="space-y-4 p-5">
            {eixosDaRede.map((e) => (
              <li key={e.eixo}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-sm font-semibold">{e.eixo}</p>
                  <p className="font-mono text-sm font-semibold text-primary">{e.media}</p>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{e.base}</p>
                <BarraDeNota nota={e.media ?? 0} rotulo={`Média em ${e.eixo}`} className="mt-2" />
              </li>
            ))}
          </ul>
        </Painel>

        <Painel
          titulo="Denúncias que exigem resposta"
          descricao="Relatos recebidos pelo canal público e ainda em apuração."
          acoes={
            <Button asChild variant="ghost" size="sm">
              <Link to="/portal/denuncias">
                Ver todas <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          }
        >
          {abertas.length === 0 ? (
            <Vazio>Nenhuma denúncia em aberto nas unidades da rede.</Vazio>
          ) : (
            <ul className="divide-y">
              {abertas.map((d) => (
                <li key={d.protocolo}>
                  <Link
                    to="/portal/denuncias/$protocolo"
                    params={{ protocolo: d.protocolo }}
                    className="block px-5 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{d.protocolo}</span>
                      <Badge variant={d.status === "Recebida" ? "outline" : "default"}>
                        {d.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm font-semibold">
                      {institutionPorId.get(d.instituicaoId)?.nome}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {d.categoria} · {d.eixo}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Painel>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SIS — administração do projeto.                                            */
/* -------------------------------------------------------------------------- */

function PainelDoSIS({ escopo }: { escopo: Escopo }) {
  const todas = escopo.instituicoes;
  const resumo = resumoDoConjunto(todas);
  const aguardandoEmissao = todas.filter((i) => i.status === "Em avaliação");
  const semAvaliacao = todas.filter((i) => i.status === "Pendente");
  const ultimosRegistros = registros.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Indicador
          icon={Building2}
          label="Instituições na base"
          valor={resumo.total}
          detalhe={`${redes.length} redes clientes`}
        />
        <Indicador
          icon={Award}
          label="Selos ativos"
          valor={resumo.certificadas}
          detalhe={`${resumo.porNivel.Ouro} Ouro · ${resumo.porNivel.Prata} Prata · ${resumo.porNivel.Bronze} Bronze`}
          tom="green"
        />
        <Indicador
          icon={ClipboardCheck}
          label="Avaliações em aberto"
          valor={resumo.avaliacoesAbertas}
          detalhe={`${semAvaliacao.length} instituições nunca avaliadas`}
          tom="teal"
        />
        <Indicador
          icon={Megaphone}
          label="Denúncias em aberto"
          valor={resumo.denunciasAbertas}
          detalhe={`${resumo.denuncias} registradas na plataforma`}
          tom={resumo.denunciasAbertas ? "destructive" : "green"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Painel
          titulo="Fila de emissão"
          descricao="Avaliações concluídas aguardando decisão da equipe SIS."
          className="lg:col-span-2"
          acoes={
            <Button asChild size="sm">
              <Link to="/portal/certificacoes">
                <Award className="size-4" aria-hidden /> Emitir certificação
              </Link>
            </Button>
          }
        >
          {aguardandoEmissao.length === 0 ? (
            <Vazio>Nenhuma avaliação aguardando emissão.</Vazio>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Instituição</TableHead>
                    <TableHead>Nota apurada</TableHead>
                    <TableHead>Nível sugerido</TableHead>
                    <TableHead>Avaliador</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aguardandoEmissao.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell className="font-medium">
                        {i.nome}
                        <span className="block text-xs text-muted-foreground">
                          {i.cidade} - {i.uf}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{i.pontuacao ?? "-"}</TableCell>
                      <TableCell>{i.nivel ? <SealChip nivel={i.nivel} /> : "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {i.avaliador ?? "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Painel>

        <Painel titulo="Distribuição por selo" descricao="Certificações vigentes na base inteira.">
          <div className="space-y-4 p-5">
            {(
              [
                { label: "Selo Ouro", v: resumo.porNivel.Ouro, c: "bg-seal-ouro" },
                { label: "Selo Prata", v: resumo.porNivel.Prata, c: "bg-seal-prata" },
                { label: "Selo Bronze", v: resumo.porNivel.Bronze, c: "bg-seal-bronze" },
              ] as const
            ).map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{s.label}</span>
                  <span className="font-mono text-muted-foreground">{s.v}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full ${s.c}`}
                    style={{ width: `${resumo.total ? (s.v / resumo.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
            <p className="pt-2 text-xs leading-relaxed text-muted-foreground">
              {resumo.subselos} subselos temáticos concedidos · média geral de{" "}
              <strong className="font-mono">{resumo.media ?? "-"}</strong> pontos.
            </p>
          </div>
        </Painel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Painel
          titulo="Últimos registros na rede"
          descricao="O livro de eventos da plataforma, do mais recente para o mais antigo."
          acoes={
            <Button asChild variant="ghost" size="sm">
              <Link to="/portal/registros">
                Ver tudo <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {ultimosRegistros.map((r) => (
              <li key={r.bloco} className="px-5 py-3">
                <p className="text-sm font-medium leading-snug">{r.evento}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {institutionPorId.get(r.instituicaoId)?.nome}
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground/80">
                  {r.bloco} · {r.data} · {r.hash}
                </p>
              </li>
            ))}
          </ul>
        </Painel>

        <Painel
          titulo="Carteira de clientes"
          descricao="Redes gestoras e instituições que contratam direto."
          acoes={
            <Button asChild variant="ghost" size="sm">
              <Link to="/portal/instituicoes">
                Abrir carteira <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {redes.map((r) => {
              const unidades = todas.filter((i) => i.redeId === r.id);
              return (
                <li key={r.id} className="px-5 py-4">
                  <p className="text-sm font-semibold">{r.nome}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {r.plano} · {unidades.length} unidades · cliente desde {r.desde}
                  </p>
                </li>
              );
            })}
            <li className="px-5 py-4">
              <p className="text-sm font-semibold">Clientes diretos</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {todas.filter((i) => !i.redeId).length} instituições sem rede gestora, atendidas
                individualmente pelo SIS.
              </p>
            </li>
          </ul>
        </Painel>
      </div>
    </div>
  );
}
