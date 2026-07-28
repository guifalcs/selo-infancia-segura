import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Award, ShieldCheck, ClipboardCheck } from "lucide-react";
import { PortalLayout } from "@/components/PortalLayout";

export const Route = createFileRoute("/portal/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — Portal SIS" },
      { name: "description", content: "Indicadores, gráficos e resumo de desempenho da plataforma." },
      { property: "og:title", content: "Relatórios — Portal SIS" },
      { property: "og:description", content: "Resumo de desempenho institucional." },
    ],
  }),
  component: Relatorios,
});

const trend = [
  { mes: "Jan", cert: 12, aud: 3 },
  { mes: "Fev", cert: 18, aud: 5 },
  { mes: "Mar", cert: 22, aud: 6 },
  { mes: "Abr", cert: 19, aud: 4 },
  { mes: "Mai", cert: 26, aud: 7 },
  { mes: "Jun", cert: 25, aud: 6 },
];

function LineChart() {
  const w = 560, h = 200, pad = 30;
  const maxV = 30;
  const step = (w - pad * 2) / (trend.length - 1);
  const path = (key: "cert" | "aud") =>
    trend.map((d, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${h - pad - (d[key] / maxV) * (h - pad * 2)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-56">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={pad} x2={w - pad} y1={pad + f * (h - pad * 2)} y2={pad + f * (h - pad * 2)} stroke="var(--border)" />
      ))}
      <path d={path("cert")} fill="none" stroke="var(--primary)" strokeWidth={2.5} />
      <path d={path("aud")} fill="none" stroke="var(--brand-teal)" strokeWidth={2.5} />
      {trend.map((d, i) => (
        <g key={d.mes}>
          <circle cx={pad + i * step} cy={h - pad - (d.cert / maxV) * (h - pad * 2)} r={3} fill="var(--primary)" />
          <circle cx={pad + i * step} cy={h - pad - (d.aud / maxV) * (h - pad * 2)} r={3} fill="var(--brand-teal)" />
          <text x={pad + i * step} y={h - 8} textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">{d.mes}</text>
        </g>
      ))}
    </svg>
  );
}

function Relatorios() {
  const kpis = [
    { label: "Taxa de aprovação", value: "87%", icon: TrendingUp },
    { label: "Certificações no período", value: "122", icon: Award },
    { label: "Selos Ouro ativos", value: "42", icon: ShieldCheck },
    { label: "Auditorias concluídas", value: "31", icon: ClipboardCheck },
  ];

  return (
    <PortalLayout title="Relatórios" subtitle="Indicadores e desempenho da plataforma">
      <div className="grid md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-card border rounded-xl p-5 shadow-sm">
            <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center">
              <k.icon className="size-5" />
            </div>
            <div className="mt-4 text-2xl font-bold">{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold">Certificações vs Auditorias</h3>
              <p className="text-xs text-muted-foreground">Evolução semestral</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-primary" /> Certificações</span>
              <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-brand-teal" /> Auditorias</span>
            </div>
          </div>
          <LineChart />
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold">Resumo de desempenho</h3>
          <p className="text-xs text-muted-foreground mb-4">Últimos 6 meses</p>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span className="text-muted-foreground">Novas instituições</span><span className="font-semibold">+23</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Selos emitidos</span><span className="font-semibold">+38</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Auditorias aprovadas</span><span className="font-semibold">27</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Denúncias resolvidas</span><span className="font-semibold">19</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Registros blockchain</span><span className="font-semibold font-mono">413</span></li>
          </ul>
          <div className="mt-6 p-4 rounded-lg bg-brand-teal/10 border border-brand-teal/30 text-sm">
            <strong className="text-brand-teal">Desempenho geral:</strong>{" "}
            crescimento consistente com alta taxa de conformidade e transparência.
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
