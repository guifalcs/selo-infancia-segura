import { createFileRoute, Link } from "@tanstack/react-router";
import { Blocks, ShieldCheck, GraduationCap, Users, Building2, ArrowRight, Lock, Link2, FileCheck2, Search, ClipboardCheck, Megaphone, Settings2, History } from "lucide-react";
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
      <header className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-9 shrink-0 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-primary-foreground">
            <Blocks className="size-5" />
          </div>
          <span className="font-semibold truncate">YC Blockchain</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#como" className="hover:text-foreground">Como funciona</a>
          <a href="#recursos" className="hover:text-foreground">Recursos</a>
          <Link to="/portal/login" className="hover:text-foreground">Entrar</Link>
        </nav>
        <Link to="/portal/login" className="md:hidden text-sm text-primary font-medium shrink-0">Entrar</Link>
      </header>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16 sm:pb-20 grid md:grid-cols-2 gap-10 md:gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-accent px-3 py-1 rounded-full text-accent-foreground">
            <Lock className="size-3" /> Certificação imutável via blockchain
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            YC <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Blockchain</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-foreground/80 font-medium">
            Confiança educacional, verificável por qualquer cidadão.
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Uma plataforma que certifica instituições de ensino com transparência total.
            Cada auditoria, selo e denúncia é registrado de forma imutável em blockchain —
            garantindo segurança, rastreabilidade e confiança pública.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link to="/cidadao/consulta">
                <Users className="size-4" /> Área do Cidadão <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link to="/portal/login">
                <Building2 className="size-4" /> Portal Institucional <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl rounded-full" />
          <div className="relative bg-card border rounded-2xl shadow-xl p-4 sm:p-6 space-y-3">
            <div className="text-xs text-muted-foreground font-mono">CADEIA DE REGISTROS</div>
            {[
              { n: "#10521", t: "Certificação emitida", c: "primary" },
              { n: "#10548", t: "Auditoria registrada", c: "secondary" },
              { n: "#10570", t: "Atualização de informações", c: "primary" },
            ].map((b, i) => (
              <div key={b.n} className="relative">
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-background">
                  <div className={`size-10 shrink-0 rounded-md grid place-items-center text-primary-foreground ${b.c === "primary" ? "bg-primary" : "bg-secondary"}`}>
                    <Blocks className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono text-muted-foreground">Bloco {b.n}</div>
                    <div className="text-sm font-medium truncate">{b.t}</div>
                  </div>
                  <div className="hidden sm:block text-xs font-mono text-muted-foreground shrink-0">0x{i}f2a…c41d</div>
                </div>
                {i < 2 && <Link2 className="size-4 mx-auto my-1 text-muted-foreground rotate-90" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-accent px-3 py-1 rounded-full text-accent-foreground">
            <ClipboardCheck className="size-3" /> Fluxo transparente
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">Como funciona</h2>
          <p className="mt-3 text-muted-foreground">
            Um processo simples, auditável e verificável — do pedido de certificação à consulta pública.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: FileCheck2, title: "Solicitação de certificação", desc: "A instituição envia seus dados e documentos para iniciar o processo de certificação." },
            { icon: ShieldCheck, title: "Auditoria especializada", desc: "Auditores avaliam critérios pedagógicos, administrativos e legais com rigor técnico." },
            { icon: Blocks, title: "Registro transparente", desc: "Cada etapa é registrada em blockchain, com hash único e histórico imutável." },
            { icon: Search, title: "Consulta pelos responsáveis", desc: "Cidadãos e responsáveis consultam certificações e histórico de forma pública." },
          ].map((s, i) => (
            <div key={s.title} className="relative bg-card border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-3 -left-3 size-8 rounded-full bg-gradient-to-br from-primary to-secondary text-primary-foreground text-sm font-semibold grid place-items-center shadow-md">
                {i + 1}
              </div>
              <div className="size-11 rounded-lg bg-primary/10 text-primary grid place-items-center">
                <s.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="recursos" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-secondary/20 px-3 py-1 rounded-full text-secondary-foreground">
            <Blocks className="size-3" /> Recursos da plataforma
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">Tudo em um só lugar</h2>
          <p className="mt-3 text-muted-foreground">
            Ferramentas completas para instituições, auditores e cidadãos — com a segurança da blockchain.
          </p>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: GraduationCap, title: "Certificação de instituições", desc: "Emissão de selos oficiais após auditoria criteriosa, com validade verificável." },
            { icon: Search, title: "Consulta pública", desc: "Qualquer cidadão pode verificar status, selos e histórico de uma instituição." },
            { icon: History, title: "Histórico blockchain", desc: "Cadeia de blocos imutável com todos os eventos: emissões, auditorias e atualizações." },
            { icon: Megaphone, title: "Canal de denúncias", desc: "Cidadãos podem registrar denúncias de forma segura, com rastreabilidade total." },
            { icon: Settings2, title: "Gestão institucional", desc: "Portal completo para acompanhar certificações, auditorias e relatórios." },
            { icon: ShieldCheck, title: "Segurança e imutabilidade", desc: "Nenhum registro pode ser adulterado — a confiança é garantida pela criptografia." },
          ].map((f) => (
            <div key={f.title} className="group bg-card border rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="size-11 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/20 text-primary grid place-items-center group-hover:scale-110 transition-transform">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>


      <footer className="border-t bg-card/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between text-center sm:text-left">
          <span>© 2026 YC Blockchain — Protótipo institucional</span>
          <span>Transparência • Segurança • Educação</span>
        </div>
      </footer>
    </div>
  );
}
