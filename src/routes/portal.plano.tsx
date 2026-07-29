import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ListChecks,
  Target,
  CalendarClock,
  TrendingUp,
  Megaphone,
  AlertTriangle,
} from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import {
  Indicador,
  Painel,
  Vazio,
  BarraDeNota,
  AvisoDemo,
  ValidadeBadge,
} from "@/components/PortalUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { denunciasDaInstituicao, niveis, PATAMAR_DE_REFERENCIA } from "@/lib/mock-data";
import type { Escopo } from "@/lib/portal-access";
import { useSelo } from "@/lib/selo-efetivo";

export const Route = createFileRoute("/portal/plano")({
  head: () => ({
    meta: [
      { title: "Plano de adequação | Portal SIS" },
      {
        name: "description",
        content: "Ações recomendadas para elevar o nível da certificação na próxima renovação.",
      },
      { property: "og:title", content: "Plano de adequação | Portal SIS" },
      {
        property: "og:description",
        content: "O que a instituição precisa resolver antes da próxima avaliação.",
      },
    ],
  }),
  component: Plano,
});

function Plano() {
  return (
    <PortalLayout
      title="Plano de adequação"
      subtitle="O caminho até a próxima renovação, eixo por eixo"
      papeis={["unidade"]}
    >
      {(escopo) => <Conteudo escopo={escopo} />}
    </PortalLayout>
  );
}

function Conteudo({ escopo }: { escopo: Escopo }) {
  const selo = useSelo();
  const inst = escopo.instituicao;
  if (!inst) return <Vazio>Nenhuma instituição vinculada a este acesso.</Vazio>;

  /* Plano, meta e modelo saem todos do selo efetivo: com uma emissão feita na
     demonstração, ler as ações da base e as notas do overlay fazia a tela
     listar um eixo como pendente e exibir, na mesma linha, a nota já resolvida. */
  const itens = selo.plano(inst);
  const meta = selo.proximoNivel(inst);
  const emAndamento = itens.filter((i) => i.status === "Em andamento").length;
  const eliminatorios = itens.filter((i) => i.eliminatorio);
  const denunciasProcedentes = denunciasDaInstituicao(inst.id).filter(
    (d) => d.status === "Procedente",
  );
  const nivel = selo.nivel(inst);
  const validade = selo.validade(inst);
  const criterios = selo.criterios(inst);
  const faixaAtual = niveis.find((n) => n.nivel === nivel);
  const modelo = selo.modelo(inst);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Indicador
          icon={ListChecks}
          label="Ações no plano"
          valor={itens.length}
          detalhe={`Eixos abaixo de ${PATAMAR_DE_REFERENCIA} pontos`}
        />
        <Indicador
          icon={TrendingUp}
          label="Em andamento"
          valor={emAndamento}
          detalhe={`${itens.length - emAndamento} ainda não iniciadas`}
          tom="teal"
        />
        <Indicador
          icon={Target}
          label={meta ? `Faltam para o ${meta.nivel}` : "Nível máximo"}
          valor={meta ? `${meta.faltam} pts` : (nivel ?? "-")}
          detalhe={
            meta
              ? `Meta: ${meta.alvo} pontos na média, na régua do modelo ${modelo?.codigo ?? ""}`
              : "Manter o padrão na renovação"
          }
          tom="amber"
        />
        <Indicador
          icon={CalendarClock}
          label="Validade do selo atual"
          valor={validade ?? "-"}
          detalhe="Renovação exige nova avaliação"
        />
      </div>

      {/* A validade em dias vem primeiro porque é o que define a urgência de
          tudo o que vem abaixo. */}
      {validade && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border bg-card px-4 py-3">
          <span className="text-sm font-medium">Situação da certificação</span>
          <ValidadeBadge validade={validade} />
          <span className="text-xs text-muted-foreground">
            A renovação exige nova avaliação presencial: as ações abaixo precisam estar concluídas
            antes dela.
          </span>
        </div>
      )}

      {faixaAtual && (
        <AvisoDemo>
          Nível atual <strong>{faixaAtual.nivel}</strong> ({faixaAtual.faixa}). {faixaAtual.resumo}
        </AvisoDemo>
      )}

      {/* Eixo no piso é a informação mais urgente do plano: não é "melhorar", é
          "sem isto não há próxima emissão". */}
      {eliminatorios.length > 0 && modelo && (
        <p className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-relaxed">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
          <span>
            <strong className="font-semibold">
              {eliminatorios.length === 1 ? "Um eixo está" : `${eliminatorios.length} eixos estão`}{" "}
              no piso eliminatório
            </strong>{" "}
            de {modelo.notaMinimaPorEixo} pontos ({eliminatorios.map((e) => e.eixo).join(", ")}). Um
            ponto abaixo disso e a próxima avaliação não gera emissão, ainda que a média passe o
            corte.
          </span>
        </p>
      )}

      <Painel
        titulo="Ações recomendadas"
        descricao="Geradas a partir das notas da última avaliação: quanto menor a nota, mais curto o prazo, porque é onde o risco à criança é maior."
      >
        {itens.length === 0 ? (
          <Vazio>
            Nenhum eixo abaixo de {PATAMAR_DE_REFERENCIA} pontos. Basta manter as evidências em
            ordem para a renovação.
          </Vazio>
        ) : (
          <ol className="divide-y">
            {itens.map((item, idx) => {
              const nota = criterios.find((c) => c.nome === item.eixo)?.nota ?? 0;
              return (
                <li key={item.eixo} className="px-5 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-semibold">
                        <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                          {idx + 1}
                        </span>
                        {item.eixo}
                      </p>
                      <p className="mt-0.5 pl-7 text-xs text-muted-foreground">{item.base}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {item.eliminatorio && <Badge variant="destructive">Eliminatório</Badge>}
                      <Badge variant="outline">Prazo {item.prazo}</Badge>
                      <Badge variant={item.status === "Em andamento" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>

                  <p className="mt-3 pl-7 text-sm leading-relaxed text-muted-foreground">
                    {item.acao}
                  </p>

                  <div className="mt-3 pl-7">
                    <div className="mb-1 flex items-baseline justify-between text-xs">
                      <span className="text-muted-foreground">Nota atual neste eixo</span>
                      <span className="font-mono font-semibold text-primary">{nota}</span>
                    </div>
                    <BarraDeNota nota={nota} rotulo={item.eixo} />
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Painel>

      {denunciasProcedentes.length > 0 && (
        <Painel
          titulo="Pendências vindas de denúncias"
          descricao="Relatos considerados procedentes entram no plano com prioridade."
          acoes={
            <Button asChild variant="ghost" size="sm">
              <Link to="/portal/denuncias">
                <Megaphone className="size-4" aria-hidden /> Ver denúncias
              </Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {denunciasProcedentes.map((d) => (
              <li key={d.protocolo}>
                <Link
                  to="/portal/denuncias/$protocolo"
                  params={{ protocolo: d.protocolo }}
                  className="block px-5 py-4 transition-colors hover:bg-muted/50"
                >
                  <p className="font-mono text-xs text-muted-foreground">{d.protocolo}</p>
                  <p className="mt-1 text-sm font-semibold">{d.categoria}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{d.resumo}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Painel>
      )}
    </div>
  );
}
