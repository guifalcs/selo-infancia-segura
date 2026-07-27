import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PortalLayout } from "@/components/PortalLayout";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { certifications } from "@/lib/mock-data";

export const Route = createFileRoute("/portal/certificacoes")({
  head: () => ({
    meta: [
      { title: "Certificações — Portal YC Blockchain" },
      { name: "description", content: "Certificações emitidas no sistema YC Blockchain." },
      { property: "og:title", content: "Certificações — Portal YC Blockchain" },
      { property: "og:description", content: "Todas as certificações emitidas na plataforma." },
    ],
  }),
  component: () => (
    <PortalLayout title="Certificações" subtitle="Selos emitidos e registrados em blockchain">
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Instituição</TableHead>
              <TableHead>Selo</TableHead>
              <TableHead>Data de emissão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {certifications.map((c, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{c.instituicao}</TableCell>
                <TableCell>
                  <Badge className="bg-secondary/20 text-secondary-foreground border border-secondary gap-1">
                    <ShieldCheck className="size-3" /> {c.selo}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{c.emissao}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </PortalLayout>
  ),
});
