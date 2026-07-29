import { createFileRoute } from "@tanstack/react-router";
import { UserCheck, GraduationCap, MapPin, ClipboardCheck } from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, AvisoDemo } from "@/components/PortalUI";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  avaliacaoAssinada,
  avaliacoes,
  avaliacoesAssinadas,
  avaliacoesEmAberto,
  avaliadores,
  ordemPorData,
} from "@/lib/mock-data";

export const Route = createFileRoute("/portal/avaliadores")({
  head: () => ({
    meta: [
      { title: "Avaliadores | Portal SIS" },
      { name: "description", content: "Rede de profissionais credenciados para avaliar." },
      { property: "og:title", content: "Avaliadores | Portal SIS" },
      {
        property: "og:description",
        content: "Credenciamento e distribuição da rede de avaliadores do SIS.",
      },
    ],
  }),
  component: Avaliadores,
});

function Avaliadores() {
  const ativos = avaliadores.filter((a) => a.status === "Ativo");
  const emFormacao = avaliadores.filter((a) => a.status === "Em formação");
  // Derivado da lista de avaliações, não digitado: um contador escrito à mão
  // divergiria do histórico na primeira mudança de cenário — antes somava 96
  // assinaturas para uma base de 15 instituições.
  const totalAvaliacoes = avaliadores.reduce((s, a) => s + avaliacoesAssinadas(a.nome), 0);
  /* A data de início também sai do histórico. Fixada no texto ela dizia "desde
     agosto de 2025" enquanto a primeira avaliação assinada da base é de março. */
  const primeiraAssinada = avaliacoes
    .filter(avaliacaoAssinada)
    .sort((a, b) => ordemPorData(a.data) - ordemPorData(b.data))[0];

  return (
    <PortalLayout
      title="Avaliadores credenciados"
      subtitle="Quem pode assinar uma avaliação em nome do SIS"
      papeis={["admin"]}
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Indicador
            icon={UserCheck}
            label="Credenciados ativos"
            valor={ativos.length}
            tom="green"
          />
          <Indicador
            icon={GraduationCap}
            label="Em formação"
            valor={emFormacao.length}
            detalhe="Concluindo o credenciamento"
            tom="amber"
          />
          <Indicador
            icon={ClipboardCheck}
            label="Avaliações assinadas"
            valor={totalAvaliacoes}
            detalhe={
              primeiraAssinada
                ? `Nesta plataforma, desde ${primeiraAssinada.data}`
                : "Nenhuma avaliação fechada ainda"
            }
          />
          {/* Só os credenciados ativos: contar a UF de quem está inativo ou em
              formação afirmaria cobertura que ninguém consegue atender hoje. */}
          <Indicador
            icon={MapPin}
            label="Estados cobertos"
            valor={new Set(ativos.flatMap((a) => a.ufs)).size}
            detalhe="UFs com credenciamento regional ativo"
            tom="teal"
          />
        </div>

        <Painel
          titulo="Rede de profissionais"
          descricao="Cada avaliação é assinada por um profissional credenciado, na UF que o credenciamento dele cobre, e o registro fica vinculado ao nome dele na blockchain. Profissional em formação não assina avaliação: acompanha as visitas até concluir o credenciamento."
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Profissional</TableHead>
                  <TableHead className="whitespace-nowrap">Formação</TableHead>
                  <TableHead className="whitespace-nowrap">Registro SIS</TableHead>
                  <TableHead className="whitespace-nowrap">Região</TableHead>
                  <TableHead className="whitespace-nowrap">Avaliações</TableHead>
                  <TableHead className="whitespace-nowrap">Em aberto</TableHead>
                  <TableHead className="whitespace-nowrap">Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {avaliadores.map((a) => {
                  const abertas = avaliacoesEmAberto(a.nome);
                  const assinadas = avaliacoesAssinadas(a.nome);
                  return (
                    <TableRow key={a.registro}>
                      <TableCell className="font-medium">{a.nome}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.formacao}</TableCell>
                      <TableCell className="font-mono text-sm">{a.registro}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {a.regiao}
                        {a.ufs.length === 0 && (
                          <span className="block text-[11px]">
                            acionada por especialidade, sem recorte regional
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">{assinadas}</TableCell>
                      <TableCell>
                        {abertas > 0 ? (
                          <Badge variant="default">{abertas}</Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            a.status === "Ativo"
                              ? "secondary"
                              : a.status === "Em formação"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {a.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Painel>

        <AvisoDemo>
          O credenciamento é uma das três frentes de investimento do projeto: formar a primeira rede
          de avaliadores é o que permite escalar a certificação sem perder consistência entre
          municípios.
        </AvisoDemo>
      </div>
    </PortalLayout>
  );
}
