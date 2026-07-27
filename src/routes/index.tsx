import { createFileRoute, Link } from "@tanstack/react-router";
import { Blocks, ShieldCheck, GraduationCap, Users, Building2, ArrowRight, Lock, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "YC Blockchain — Certificação Educacional Descentralizada" },
      { name: "description", content: "Plataforma que garante transparência, segurança e confiança na certificação de instituições educacionais por meio de blockchain." },
      { property: "og:title", content: "YC Blockchain" },
      { property: "og:description", content: "Certificação educacional transparente e imutável via blockchain." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/40">
      <header className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-primary-foreground">
            <Blocks className="size-5" />
          </div>
          <span className="font-semibold">YC Blockchain</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#como" className="hover:text-foreground">Como funciona</a>
          <a href="#recursos" className="hover:text-foreground">Recursos</a>
          <Link to="/portal/login" className="hover:text-foreground">Entrar</Link>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-accent px-3 py-1 rounded-full text-accent-foreground">
            <Lock className="size-3" /> Certificação imutável via blockchain
          </div>
          <h1 className="mt-5 text-5xl font-bold tracking-tight leading-tight">
            YC <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Blockchain</span>
          </h1>
          <p className="mt-4 text-xl text-foreground/80 font-medium">
            Confiança educacional, verificável por qualquer cidadão.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Uma plataforma que certifica instituições de ensino com transparência total.
            Cada auditoria, selo e denúncia é registrado de forma imutável em blockchain —
            garantindo segurança, rastreabilidade e confiança pública.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/cidadao/consulta">
                <Users className="size-4" /> Área do Cidadão <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/portal/login">
                <Building2 className="size-4" /> Portal Institucional <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl rounded-full" />
          <div className="relative bg-card border rounded-2xl shadow-xl p-6 space-y-3">
            <div className="text-xs text-muted-foreground font-mono">CADEIA DE REGISTROS</div>
            {[
              { n: "#10521", t: "Certificação emitida", c: "primary" },
              { n: "#10548", t: "Auditoria registrada", c: "secondary" },
              { n: "#10570", t: "Atualização de informações", c: "primary" },
            ].map((b, i) => (
              <div key={b.n} className="relative">
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                  <div className={`size-10 rounded-md grid place-items-center text-primary-foreground ${b.c === "primary" ? "bg-primary" : "bg-secondary"}`}>
                    <Blocks className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-muted-foreground">Bloco {b.n}</div>
                    <div className="text-sm font-medium">{b.t}</div>
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">0x{i}f2a…c41d</div>
                </div>
                {i < 2 && <Link2 className="size-4 mx-auto my-1 text-muted-foreground rotate-90" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="recursos" className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: GraduationCap, title: "Educação com confiança", desc: "Instituições certificadas passam por auditorias rigorosas registradas em blockchain." },
          { icon: ShieldCheck, title: "Segurança e imutabilidade", desc: "Nenhum registro pode ser apagado ou adulterado — histórico público e verificável." },
          { icon: Blocks, title: "Rastreabilidade total", desc: "Cada evento (selo, auditoria, denúncia) é um bloco na cadeia com hash único." },
        ].map((f) => (
          <div key={f.title} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="size-11 rounded-lg bg-primary/10 text-primary grid place-items-center">
              <f.icon className="size-5" />
            </div>
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t bg-card/60">
        <div className="max-w-6xl mx-auto px-6 py-8 text-xs text-muted-foreground flex justify-between">
          <span>© 2026 YC Blockchain — Protótipo institucional</span>
          <span>Transparência • Segurança • Educação</span>
        </div>
      </footer>
    </div>
  );
}
