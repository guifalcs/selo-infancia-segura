import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck, CheckCircle2, CalendarClock, Clock } from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, Vazio, AvisoDemo } from "@/components/PortalUI";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { avaliacoes, institutionPorId, type StatusAvaliacao } from "@/lib/mock-data";
import type { Escopo } from "@/lib/portal-access";

export const Route = createFileRoute("/portal/auditorias")({
  head: () => ({
    meta: [
      { title: "Avaliações | Portal SIS" },
      { name: "description", content: "Avaliações realizadas e agendadas no seu escopo." },
      { property: "og:title", content: "Avaliações | Portal SIS" },
      { property: "og:description", content: "Registro de avaliações presenciais do SIS." },
    ],
  }),
  component: Auditorias,
});

const corDoStatus: Record<StatusAvaliacao, "default" | "secondary" | "destructive" | "outline"> = {
  Aprovada: "secondary",
  "Em andamento": "default",
  Agendada: "outline",
  Reprovada: "destructive",
};

function Auditorias() {
  return (
    <PortalLayout
      title="Avaliações"
      subtitle="Visitas presenciais realizadas por profissionais credenciados"
    >
      {(escopo) => <Lista escopo={escopo} />}
    </PortalLayout>
  );
}

function Lista({ escopo }: { escopo: Escopo }) {
  const ids = new Set(escopo.instituicoes.map((i) => i.id));
  const doEscopo = avaliacoes.filter((a) => ids.has(a.instituicaoId));
  const conta = (s: StatusAvaliacao) => doEscopo.filter((a) => a.status === s).length;
  const ehUnidade = escopo.papel === "unidade";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Indicador icon={ClipboardCheck} label="Avaliações no histórico" valor={doEscopo.length} />
        <Indicador
          icon={CheckCircle2}
          label="Aprovadas"
          valor={conta("Aprovada")}
          tom="green"
          detalhe="Resultaram em emissão de selo"
        />
        <Indicador
          icon={Clock}
          label="Em andamento"
          valor={conta("Em andamento")}
          tom="teal"
          detalhe="Apuração aberta"
        />
        <Indicador
          icon={CalendarClock}
          label="Agendadas"
          valor={conta("Agendada")}
          tom="amber"
          detalhe="Visitas futuras confirmadas"
        />
      </div>

      <Painel
        titulo={ehUnidade ? "Histórico da unidade" : "Avaliações do escopo"}
        descricao="Renovação obrigatória a cada 12 meses; avaliações extraordinárias são abertas quando uma denúncia é considerada procedente."
      >
        {doEscopo.length === 0 ? (
          <Vazio>Nenhuma avaliação registrada até agora.</Vazio>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {!ehUnidade && <TableHead className="whitespace-nowrap">Instituição</TableHead>}
                  <TableHead className="whitespace-nowrap">Data</TableHead>
                  <TableHead className="whitespace-nowrap">Tipo</TableHead>
                  <TableHead className="whitespace-nowrap">Avaliador</TableHead>
                  <TableHead className="whitespace-nowrap">Nota</TableHead>
                  <TableHead className="whitespace-nowrap">Situação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doEscopo.map((a) => (
                  <TableRow key={a.id}>
                    {!ehUnidade && (
                      <TableCell className="font-medium">
                        {institutionPorId.get(a.instituicaoId)?.nome ?? a.instituicaoId}
                      </TableCell>
                    )}
                    <TableCell className="whitespace-nowrap font-mono text-sm">{a.data}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{a.tipo}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{a.avaliador}</TableCell>
                    <TableCell className="font-mono text-sm">{a.pontuacao ?? "-"}</TableCell>
                    <TableCell>
                      <Badge variant={corDoStatus[a.status]}>{a.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Painel>

      <AvisoDemo>
        No protótipo, a agenda é estática. Na plataforma, o agendamento parte da equipe SIS, que
        distribui as visitas conforme a região e a especialidade de cada avaliador credenciado.
      </AvisoDemo>
    </div>
  );
}
