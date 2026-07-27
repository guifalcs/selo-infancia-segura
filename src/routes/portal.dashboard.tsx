import { createFileRoute } from "@tanstack/react-router";
import { Building2, Award, ClipboardCheck, AlertTriangle, TrendingUp } from "lucide-react";
import { PortalLayout } from "@/components/PortalLayout";

export const Route = createFileRoute("/portal/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Portal YC Blockchain" },
      { name: "description", content: "Indicadores gerais do portal institucional YC Blockchain." },
      { property: "og:title", content: "Dashboard — Portal YC Blockchain" },
      { property: "og:description", content: "Visão consolidada de instituições, certificações, auditorias e denúncias." },
    ],
  }),
  component: Dashboard,
});

const indicators = [
  { label: "Instituições cadastradas", value: 145, delta: "+8%", icon: Building2, color: "primary" },
  { label: "Certificações emitidas", value: 122, delta: "+12%", icon: Award, color: "secondary" },
  { label: "Auditorias realizadas", value: 18, delta: "+3%", icon: ClipboardCheck, color: "primary" },
  { label: "Denúncias registradas", value: 31, delta: "-4%", icon: AlertTriangle, color: "destructive" },
] as const;

const barData = [
  { mes: "Jan", v: 42 }, { mes: "Fev", v: 58 }, { mes: "Mar", v: 71 },
  { mes: "Abr", v: 66 }, { mes: "Mai", v: 84 }, { mes: "Jun", v: 92 },
];
const maxBar = Math.max(...barData.map((b) => b.v));

function Dashboard() {
  return (
    <PortalLayout title="Dashboard" subtitle="Visão geral do sistema YC Blockchain">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indicators.map((i) => (
          <div key={i.label} className="bg-card border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`size-10 rounded-lg grid place-items-center ${i.color === "primary" ? "bg-primary/10 text-primary" : i.color === "secondary" ? "bg-secondary/20 text-secondary-foreground" : "bg-destructive/10 text-destructive"}`}>
                <i.icon className="size-5" />
              </div>
              <span className="text-xs font-medium text-muted-foreground inline-flex items-center gap-1">
                <TrendingUp className="size-3" /> {i.delta}
              </span>
            </div>
            <div className="mt-4 text-3xl font-bold">{i.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{i.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold">Registros na blockchain</h3>
              <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
            </div>
            <span className="text-xs text-muted-foreground">2026</span>
          </div>
          <div className="flex items-end gap-4 h-56">
            {barData.map((b) => (
              <div key={b.mes} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center">
                  <span className="text-[11px] font-mono text-muted-foreground mb-1">{b.v}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-primary to-secondary"
                    style={{ height: `${(b.v / maxBar) * 180}px` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">{b.mes}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold">Distribuição por selo</h3>
          <p className="text-xs text-muted-foreground">Certificações ativas</p>
          <div className="mt-6 space-y-4">
            {[
              { label: "Selo Ouro", v: 42, c: "bg-secondary" },
              { label: "Selo Prata", v: 58, c: "bg-primary" },
              { label: "Selo Bronze", v: 22, c: "bg-accent-foreground/70" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{s.label}</span>
                  <span className="font-mono text-muted-foreground">{s.v}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${s.c}`} style={{ width: `${(s.v / 60) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
