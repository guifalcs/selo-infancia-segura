import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MapPin, ShieldCheck } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { institutions } from "@/lib/mock-data";

export const Route = createFileRoute("/cidadao/consulta")({
  head: () => ({
    meta: [
      { title: "Consulta de Instituições — YC Blockchain" },
      { name: "description", content: "Consulte instituições educacionais certificadas com transparência total." },
      { property: "og:title", content: "Consulta de Instituições — YC Blockchain" },
      { property: "og:description", content: "Encontre instituições certificadas na plataforma YC Blockchain." },
    ],
  }),
  component: Consulta,
});

const statusColor: Record<string, string> = {
  "Certificada": "bg-secondary/20 text-secondary-foreground border-secondary",
  "Em auditoria": "bg-accent text-accent-foreground",
  "Pendente": "bg-muted text-muted-foreground",
  "Suspensa": "bg-destructive/10 text-destructive border-destructive/30",
};

function Consulta() {
  const [q, setQ] = useState("");
  const [cidade, setCidade] = useState("all");
  const [status, setStatus] = useState("all");
  const cidades = useMemo(() => Array.from(new Set(institutions.map((i) => i.cidade))), []);
  const filtered = institutions.filter(
    (i) =>
      i.nome.toLowerCase().includes(q.toLowerCase()) &&
      (cidade === "all" || i.cidade === cidade) &&
      (status === "all" || i.status === status),
  );

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">Consulta de Instituições</h1>
        <p className="text-muted-foreground mt-1">Encontre e verifique instituições educacionais certificadas.</p>

        <div className="mt-6 grid md:grid-cols-[1fr_200px_200px] gap-3">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar por nome..." className="pl-9" />
          </div>
          <Select value={cidade} onValueChange={setCidade}>
            <SelectTrigger><SelectValue placeholder="Cidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {cidades.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="Certificada">Certificada</SelectItem>
              <SelectItem value="Em auditoria">Em auditoria</SelectItem>
              <SelectItem value="Pendente">Pendente</SelectItem>
              <SelectItem value="Suspensa">Suspensa</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((i) => (
            <Link
              key={i.id}
              to="/cidadao/instituicao/$id"
              params={{ id: i.id }}
              className="group bg-card border rounded-xl p-5 shadow-sm hover:shadow-md hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold group-hover:text-primary">{i.nome}</h3>
                <Badge variant="outline" className={statusColor[i.status]}>{i.status}</Badge>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" /> {i.cidade}
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{i.descricao}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 text-secondary-foreground/80"><ShieldCheck className="size-3.5 text-secondary" /> {i.selo}</span>
                <span className="text-muted-foreground">Auditoria: {i.ultimaAuditoria}</span>
              </div>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground py-12">Nenhuma instituição encontrada.</p>
          )}
        </div>
      </div>
    </div>
  );
}
