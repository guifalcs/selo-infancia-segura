import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, ShieldCheck, Blocks, Link2 } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { Badge } from "@/components/ui/badge";
import { institutions, blockchainHistory } from "@/lib/mock-data";

export const Route = createFileRoute("/cidadao/instituicao/$id")({
  head: ({ params }) => {
    const inst = institutions.find((i) => i.id === params.id);
    const title = inst ? `${inst.nome} — YC Blockchain` : "Instituição — YC Blockchain";
    return {
      meta: [
        { title },
        { name: "description", content: inst?.descricao ?? "Detalhes da instituição." },
        { property: "og:title", content: title },
        { property: "og:description", content: inst?.descricao ?? "Detalhes da instituição." },
      ],
    };
  },
  loader: ({ params }) => {
    const inst = institutions.find((i) => i.id === params.id);
    if (!inst) throw notFound();
    return { inst };
  },
  component: Detalhe,
});

function Detalhe() {
  const { inst } = Route.useLoaderData();
  const history = blockchainHistory.default;

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Link to="/cidadao/consulta" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Voltar à consulta
        </Link>

        <div className="mt-6 bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:flex-wrap sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold break-words">{inst.nome}</h1>
              <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" /> <span className="truncate">{inst.cidade}</span>
              </div>
            </div>
            <Badge className="bg-secondary text-secondary-foreground shrink-0">{inst.status}</Badge>
          </div>
          <p className="mt-4 text-muted-foreground">{inst.descricao}</p>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Info label="Selo" value={inst.selo} icon={ShieldCheck} />
            <Info label="Última auditoria" value={inst.ultimaAuditoria} />
            <Info label="ID Institucional" value={inst.id.toUpperCase()} />
          </div>
        </div>

        <section className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-8 rounded-md bg-primary/10 text-primary grid place-items-center">
              <Blocks className="size-4" />
            </div>
            <div>
              <h2 className="font-semibold">Histórico Blockchain</h2>
              <p className="text-xs text-muted-foreground">Cadeia imutável de eventos registrados</p>
            </div>
          </div>

          <div className="space-y-2">
            {history.map((b, i) => (
              <div key={b.bloco}>
                <div className="flex items-center gap-4 bg-card border rounded-xl p-4">
                  <div className="size-12 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-primary-foreground shrink-0">
                    <Blocks className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">Bloco {b.bloco}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{b.data}</span>
                    </div>
                    <div className="font-medium text-sm mt-0.5">{b.evento}</div>
                    <div className="text-xs font-mono text-muted-foreground mt-1">hash: {b.hash}</div>
                  </div>
                </div>
                {i < history.length - 1 && (
                  <div className="flex justify-center py-1">
                    <Link2 className="size-4 text-muted-foreground rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold flex items-center gap-1.5">
        {Icon && <Icon className="size-4 text-secondary" />}
        {value}
      </div>
    </div>
  );
}
