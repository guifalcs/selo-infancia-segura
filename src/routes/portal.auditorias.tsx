import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { audits } from "@/lib/mock-data";

const color: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  "Aprovada": "secondary",
  "Em andamento": "default",
  "Pendente": "outline",
  "Reprovada": "destructive",
};

export const Route = createFileRoute("/portal/auditorias")({
  head: () => ({
    meta: [
      { title: "Auditorias — Portal YC Blockchain" },
      { name: "description", content: "Auditorias realizadas nas instituições cadastradas." },
      { property: "og:title", content: "Auditorias — Portal YC Blockchain" },
      { property: "og:description", content: "Registro de auditorias no sistema YC Blockchain." },
    ],
  }),
  component: () => (
    <PortalLayout title="Auditorias" subtitle="Registro completo de auditorias realizadas">
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Instituição</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audits.map((a, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{a.instituicao}</TableCell>
                <TableCell className="text-muted-foreground">{a.responsavel}</TableCell>
                <TableCell className="font-mono text-sm">{a.data}</TableCell>
                <TableCell><Badge variant={color[a.status] ?? "default"}>{a.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PortalLayout>
  ),
});
