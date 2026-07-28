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
import { avaliacoes, avaliadores } from "@/lib/mock-data";

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
  const totalAvaliacoes = avaliadores.reduce((s, a) => s + a.avaliacoes, 0);

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
            detalhe="Somadas em toda a rede"
          />
          <Indicador
            icon={MapPin}
            label="Estados cobertos"
            valor={new Set(avaliadores.map((a) => a.regiao.split(" · ")[0])).size}
            detalhe="Cobertura atual do credenciamento"
            tom="teal"
          />
        </div>

        <Painel
          titulo="Rede de profissionais"
          descricao="Cada avaliação é assinada por um profissional credenciado; o registro fica vinculado ao nome dele na blockchain."
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
                  const abertas = avaliacoes.filter(
                    (av) =>
                      av.avaliador === a.nome &&
                      (av.status === "Agendada" || av.status === "Em andamento"),
                  ).length;
                  return (
                    <TableRow key={a.registro}>
                      <TableCell className="font-medium">{a.nome}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.formacao}</TableCell>
                      <TableCell className="font-mono text-sm">{a.registro}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{a.regiao}</TableCell>
                      <TableCell className="font-mono text-sm">{a.avaliacoes}</TableCell>
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
