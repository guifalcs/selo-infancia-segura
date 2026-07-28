import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Blocks,
  Link2,
  ShieldCheck,
  FileClock,
  ChevronLeft,
  ChevronRight,
  EyeOff,
} from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, Vazio, AvisoDemo } from "@/components/PortalUI";
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
  suspensao: "Suspensão",
  atualizacao: "Atualização",
};

const corTipo: Record<RegistroBlockchain["tipo"], string> = {
  certificacao: "border-success/30 bg-success/10 text-success",
  avaliacao: "border-brand-teal/30 bg-brand-teal/10 text-brand-teal",
  renovacao: "border-brand-blue/30 bg-brand-blue/10 text-brand-blue",
  denuncia: "border-brand-amber/40 bg-brand-amber/10 text-brand-amber",
  suspensao: "border-destructive/30 bg-destructive/10 text-destructive",
  atualizacao: "border-muted-foreground/30 bg-muted text-muted-foreground",
};

const tipos = [
  "todos",
  "certificacao",
  "avaliacao",
  "renovacao",
  "denuncia",
  "suspensao",
  "atualizacao",
] as const;

/** Registros por página do livro. */
const POR_PAGINA = 10;

/**
 * Rodapé de paginação.
 *
 * Mostra a faixa de registros à esquerda porque, num livro que se pretende
 * auditável, saber "10 de 43" importa tanto quanto ver os dez: a pessoa
 * precisa perceber que existe mais coisa abaixo do que está na tela.
 */
function Paginacao({
  pagina,
  totalPaginas,
  primeiro,
  ultimo,
  total,
  onIr,
}: {
  pagina: number;
  totalPaginas: number;
  primeiro: number;
  ultimo: number;
  total: number;
  onIr: (p: number) => void;
}) {
  // Janela de no máximo cinco números em volta da página atual: com muitos
  // blocos, listar todas as páginas empurraria os controles para fora da tela.
  const inicio = Math.max(1, Math.min(pagina - 2, totalPaginas - 4));
  const fim = Math.min(totalPaginas, inicio + 4);
  const numeros = Array.from({ length: fim - inicio + 1 }, (_, i) => inicio + i);

  return (
    <nav
      aria-label="Paginação do livro de eventos"
      className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3"
    >
      <p className="text-xs text-muted-foreground">
        Mostrando{" "}
        <span className="font-medium text-foreground">
          {primeiro}–{ultimo}
        </span>{" "}
        de <span className="font-medium text-foreground">{total}</span> eventos
      </p>

      <div className="flex flex-wrap items-center gap-1">
        <Button
          size="sm"
          variant="ghost"
          disabled={pagina === 1}
          onClick={() => onIr(pagina - 1)}
          aria-label="Página anterior"
        >
          <ChevronLeft className="size-4" aria-hidden /> Anterior
        </Button>

        {inicio > 1 && <span className="px-1 text-xs text-muted-foreground">…</span>}

        {numeros.map((n) => (
          <Button
            key={n}
            size="sm"
            variant={n === pagina ? "default" : "ghost"}
            onClick={() => onIr(n)}
            aria-label={`Página ${n}`}
            aria-current={n === pagina ? "page" : undefined}
            className="w-9 px-0 font-mono"
          >
            {n}
          </Button>
        ))}

        {fim < totalPaginas && <span className="px-1 text-xs text-muted-foreground">…</span>}

        <Button
          size="sm"
          variant="ghost"
          disabled={pagina === totalPaginas}
          onClick={() => onIr(pagina + 1)}
          aria-label="Próxima página"
        >
          Próxima <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>
    </nav>
  );
}

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
  const [pagina, setPagina] = useState(1);
  const ids = new Set(escopo.instituicoes.map((i) => i.id));
  const doEscopo = registros.filter((r) => ids.has(r.instituicaoId));
  const lista = tipo === "todos" ? doEscopo : doEscopo.filter((r) => r.tipo === tipo);

  const certificacoesRegistradas = doEscopo.filter(
    (r) => r.tipo === "certificacao" || r.tipo === "renovacao",
  ).length;

  // A página é derivada, não só guardada: trocar de filtro pode encurtar a
  // lista, e uma página fora do intervalo deixaria a tabela vazia sem motivo.
  const totalPaginas = Math.max(1, Math.ceil(lista.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const daPagina = lista.slice(inicio, inicio + POR_PAGINA);
  const mostraInstituicao = escopo.papel !== "unidade";

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
          /* Só entram os filtros que têm registro no escopo. Um botão que sempre
             devolve lista vazia — "Renovação", enquanto nenhuma renovação foi
             concluída — parece defeito da tela, não ausência de evento. */
          <div className="flex flex-wrap gap-1">
            {tipos
              .filter((t) => t === "todos" || doEscopo.some((r) => r.tipo === t))
              .map((t) => (
                <Button
                  key={t}
                  size="sm"
                  variant={tipo === t ? "default" : "ghost"}
                  onClick={() => {
                    setTipo(t);
                    setPagina(1);
                  }}
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
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Bloco</TableHead>
                    <TableHead className="whitespace-nowrap">Tipo</TableHead>
                    {mostraInstituicao && (
                      <TableHead className="whitespace-nowrap">Instituição</TableHead>
                    )}
                    <TableHead>Evento</TableHead>
                    <TableHead className="whitespace-nowrap">Hash</TableHead>
                    <TableHead className="whitespace-nowrap">Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {daPagina.map((r) => (
                    <TableRow key={r.bloco}>
                      <TableCell className="whitespace-nowrap font-mono text-xs font-semibold text-muted-foreground">
                        {r.bloco}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${corTipo[r.tipo]}`}
                        >
                          {rotuloTipo[r.tipo]}
                        </span>
                      </TableCell>
                      {mostraInstituicao && (
                        <TableCell className="text-xs font-medium text-primary">
                          {institutionPorId.get(r.instituicaoId)?.nome ?? r.instituicaoId}
                        </TableCell>
                      )}
                      <TableCell className="min-w-[16rem] text-sm font-medium leading-snug">
                        {r.evento}
                        {/* O bloco existe e é auditável; o que espera a triagem é
                            a exibição na ficha pública. Dizer isso aqui evita a
                            leitura de que o registro foi omitido. */}
                        {!r.publico && (
                          <span className="mt-1 flex items-center gap-1 text-[11px] font-normal text-muted-foreground">
                            <EyeOff className="size-3 shrink-0" aria-hidden />
                            gravado na cadeia, fora da ficha pública até a triagem
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Link2 className="size-3 shrink-0" aria-hidden />
                          {r.hash}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="whitespace-nowrap font-mono text-[11px]"
                        >
                          {r.data}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Paginacao
              pagina={paginaAtual}
              totalPaginas={totalPaginas}
              primeiro={inicio + 1}
              ultimo={inicio + daPagina.length}
              total={lista.length}
              onIr={setPagina}
            />
          </>
        )}
      </Painel>

      <AvisoDemo>
        Hashes e números de bloco são gerados de forma determinística a partir dos dados de
        demonstração. Não há rede blockchain conectada a este protótipo. A estrutura, porém, é a que
        será registrada: evento, data, instituição e hash do conteúdo.
      </AvisoDemo>
    </div>
  );
}
