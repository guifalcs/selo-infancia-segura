import { createFileRoute, Link } from "@tanstack/react-router";
import { ListChecks, Target, CalendarClock, TrendingUp, Megaphone } from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, Vazio, BarraDeNota, AvisoDemo } from "@/components/PortalUI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  denunciasDaInstituicao,
  niveis,
  planoDeAdequacao,
  type Institution,
} from "@/lib/mock-data";
import type { Escopo } from "@/lib/portal-access";

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

/** Próximo nível a alcançar e quantos pontos faltam. */
function proximoNivel(inst: Institution) {
  const nota = inst.pontuacao;
  if (nota === null) return null;
  if (nota >= 90) return null;
  const alvo = nota >= 75 ? 90 : 75;
  const nivel = alvo === 90 ? "Ouro" : "Prata";
  return { nivel, alvo, faltam: alvo - nota };
}

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
  const inst = escopo.instituicao;
  if (!inst) return <Vazio>Nenhuma instituição vinculada a este acesso.</Vazio>;

  const itens = planoDeAdequacao(inst);
  const meta = proximoNivel(inst);
  const emAndamento = itens.filter((i) => i.status === "Em andamento").length;
  const denunciasProcedentes = denunciasDaInstituicao(inst.id).filter(
    (d) => d.status === "Procedente",
  );
  const faixaAtual = niveis.find((n) => n.nivel === inst.nivel);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Indicador
          icon={ListChecks}
          label="Ações no plano"
          valor={itens.length}
          detalhe="Eixos abaixo de 85 pontos"
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
          valor={meta ? `${meta.faltam} pts` : "Ouro"}
          detalhe={meta ? `Meta: ${meta.alvo} pontos na média` : "Manter o padrão na renovação"}
          tom="amber"
        />
        <Indicador
          icon={CalendarClock}
          label="Validade do selo atual"
          valor={inst.validade ?? "-"}
          detalhe="Renovação exige nova avaliação"
        />
      </div>

      {faixaAtual && (
        <AvisoDemo>
          Nível atual <strong>{faixaAtual.nivel}</strong> ({faixaAtual.faixa}). {faixaAtual.resumo}
        </AvisoDemo>
      )}

      <Painel
        titulo="Ações recomendadas"
        descricao="Geradas a partir das notas da última avaliação: quanto menor a nota, mais curto o prazo, porque é onde o risco à criança é maior."
      >
        {itens.length === 0 ? (
          <Vazio>
            Nenhum eixo abaixo de 85 pontos. Basta manter as evidências em ordem para a renovação.
          </Vazio>
        ) : (
          <ol className="divide-y">
            {itens.map((item, idx) => {
              const nota = inst.criterios.find((c) => c.nome === item.eixo)?.nota ?? 0;
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
