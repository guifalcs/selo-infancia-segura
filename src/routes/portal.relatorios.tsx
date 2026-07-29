import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Award, CalendarClock, Megaphone } from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, Vazio, BarraDeNota, AvisoDemo } from "@/components/PortalUI";
import { SealChip } from "@/components/Seal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  denuncias,
  denunciaAtrasada,
  denunciaEmAberto,
  mediaPorEixo,
  resumoDoConjunto,
  type Institution,
} from "@/lib/mock-data";
import type { Escopo } from "@/lib/portal-access";
import { useResumoComEmissoes, useSelo } from "@/lib/selo-efetivo";

export const Route = createFileRoute("/portal/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios | Portal SIS" },
      { name: "description", content: "Indicadores consolidados do seu escopo de acesso." },
      { property: "og:title", content: "Relatórios | Portal SIS" },
      { property: "og:description", content: "Conformidade, evolução e pontos de atenção." },
    ],
  }),
  component: Relatorios,
});

function Relatorios() {
  return (
    <PortalLayout
      title="Relatórios"
      subtitle="Consolidado do conjunto de instituições sob sua responsabilidade"
      papeis={["admin", "rede"]}
    >
      {(escopo) => <Consolidado escopo={escopo} />}
    </PortalLayout>
  );
}

function Consolidado({ escopo }: { escopo: Escopo }) {
  const selo = useSelo();
  const lista = escopo.instituicoes;
  const resumo = useResumoComEmissoes(lista, resumoDoConjunto(lista));
  const eixosDoEscopo = mediaPorEixo(lista, selo.criterios).filter((e) => e.media !== null);
  const ids = new Set(lista.map((i) => i.id));
  const doEscopo = denuncias.filter((d) => ids.has(d.instituicaoId));
  const procedentes = doEscopo.filter((d) => d.status === "Procedente").length;
  const atrasadas = doEscopo.filter(denunciaAtrasada).length;

  const ranking = lista
    .map((i) => ({ inst: i, nota: selo.pontuacao(i), nivel: selo.nivel(i) }))
    .filter((r): r is { inst: Institution; nota: number; nivel: typeof r.nivel } => r.nota !== null)
    .sort((a, b) => b.nota - a.nota);

  const conformidade = resumo.total ? Math.round((resumo.certificadas / resumo.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Indicador
          icon={TrendingUp}
          label="Taxa de conformidade"
          valor={`${conformidade}%`}
          detalhe={`${resumo.certificadas} de ${resumo.total} com selo vigente`}
          tom="green"
        />
        <Indicador
          icon={Award}
          label="Média de pontuação"
          valor={resumo.media ?? "-"}
          /* Média de todas as notas apuradas; a distribuição por nível conta só
             selo vigente, e é por isso que o rótulo abaixo diz "vigentes". */
          detalhe={`Selos vigentes: ${resumo.porNivel.Ouro} Ouro · ${resumo.porNivel.Prata} Prata · ${resumo.porNivel.Bronze} Bronze`}
        />
        <Indicador
          icon={CalendarClock}
          label="Renovações a preparar"
          valor={resumo.aVencer + resumo.vencidos}
          detalhe={
            resumo.vencidos
              ? `${resumo.vencidos} vencido(s) · ${resumo.aVencer} a menos de 90 dias`
              : "Selos a menos de 90 dias do vencimento"
          }
          tom={resumo.vencidos ? "destructive" : "amber"}
        />
        <Indicador
          icon={Megaphone}
          label="Denúncias procedentes"
          valor={procedentes}
          detalhe={
            atrasadas
              ? `${doEscopo.filter(denunciaEmAberto).length} em aberto · ${atrasadas} com prazo vencido`
              : `${doEscopo.filter(denunciaEmAberto).length} ainda em aberto`
          }
          tom={atrasadas ? "destructive" : procedentes ? "amber" : "green"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Painel
          titulo="Média por eixo avaliado"
          descricao="Onde o conjunto está forte e onde a fiscalização precisa insistir."
        >
          {eixosDoEscopo.length === 0 ? (
            <Vazio>Nenhuma avaliação concluída no escopo.</Vazio>
          ) : (
            <ul className="space-y-4 p-5">
              {eixosDoEscopo.map((e) => (
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
          )}
        </Painel>

        <Painel
          titulo="Situação das instituições"
          descricao="Distribuição por estágio no ciclo de certificação."
        >
          <div className="space-y-4 p-5">
            {(
              [
                { label: "Com selo vigente", v: resumo.certificadas, c: "bg-success" },
                { label: "Aguardando emissão", v: resumo.aguardandoEmissao, c: "bg-brand-amber" },
                { label: "Em avaliação", v: resumo.emAvaliacao, c: "bg-brand-blue" },
                {
                  label: "Aguardando primeira visita",
                  v: resumo.pendentes,
                  c: "bg-muted-foreground",
                },
                { label: "Suspensas", v: resumo.suspensas, c: "bg-destructive" },
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

            <dl className="mt-6 space-y-2 border-t pt-4 text-sm">
              {[
                { rotulo: "Avaliações em aberto", valor: resumo.avaliacoesAbertas },
                { rotulo: "Denúncias registradas", valor: resumo.denuncias },
                { rotulo: "Denúncias em aberto", valor: resumo.denunciasAbertas },
              ].map((l) => (
                <div key={l.rotulo} className="flex justify-between">
                  <dt className="text-muted-foreground">{l.rotulo}</dt>
                  <dd className="font-semibold">{l.valor}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Painel>
      </div>

      <Painel
        titulo="Ranking por pontuação"
        descricao="A escala Bronze/Prata/Ouro existe para premiar evolução, não só aprovação; por isso o ranking acompanha a nota, e não apenas o selo."
      >
        {ranking.length === 0 ? (
          <Vazio>Nenhuma instituição com nota apurada.</Vazio>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead className="whitespace-nowrap">Instituição</TableHead>
                  <TableHead className="whitespace-nowrap">Selo</TableHead>
                  <TableHead className="whitespace-nowrap">Nota</TableHead>
                  <TableHead className="min-w-40">Desempenho</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking.map((r, idx) => (
                  <TableRow key={r.inst.id}>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {r.inst.nome}
                      <span className="block text-xs text-muted-foreground">
                        {r.inst.cidade} - {r.inst.uf}
                      </span>
                    </TableCell>
                    <TableCell>{r.nivel ? <SealChip nivel={r.nivel} /> : "-"}</TableCell>
                    <TableCell className="font-mono text-sm font-semibold">{r.nota}</TableCell>
                    <TableCell>
                      <BarraDeNota nota={r.nota} rotulo={r.inst.nome} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Painel>

      <AvisoDemo>
        {escopo.papel === "rede"
          ? "Na plataforma, este relatório é exportável em PDF para prestação de contas ao controle interno e aos órgãos fiscalizadores."
          : "Na plataforma, esta visão alimenta o acompanhamento comercial e o relatório de impacto por município."}
      </AvisoDemo>
    </div>
  );
}
