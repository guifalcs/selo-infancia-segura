import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/PortalLayout";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { institutions } from "@/lib/mock-data";

export const Route = createFileRoute("/portal/instituicoes")({
  head: () => ({
    meta: [
      { title: "Instituições — Portal YC Blockchain" },
      { name: "description", content: "Tabela de instituições registradas no sistema YC Blockchain." },
      { property: "og:title", content: "Instituições — Portal YC Blockchain" },
      { property: "og:description", content: "Consulte todas as instituições cadastradas." },
    ],
  }),
  component: () => (
    <PortalLayout title="Instituições" subtitle="Todas as instituições registradas">
      <div className="bg-card border rounded-xl shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">Nome</TableHead>
              <TableHead className="whitespace-nowrap">Cidade</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Última auditoria</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {institutions.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium whitespace-nowrap">{i.nome}</TableCell>
                <TableCell className="text-muted-foreground whitespace-nowrap">{i.cidade}</TableCell>
                <TableCell>
                  <Badge variant={i.status === "Suspensa" ? "destructive" : "secondary"}>{i.status}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm whitespace-nowrap">{i.ultimaAuditoria}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PortalLayout>
  ),
});
