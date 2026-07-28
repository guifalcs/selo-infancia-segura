import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Blocks, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/portal/login")({
  head: () => ({
    meta: [
      { title: "Login institucional — SIS" },
      { name: "description", content: "Acesse o portal institucional do SIS." },
      { property: "og:title", content: "Login institucional — SIS" },
      { property: "og:description", content: "Portal institucional do SIS." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  // Domínio fictício e neutro de propósito: usar um `.gov.br` inventado num
  // projeto sem vínculo com o governo é um risco real de credibilidade.
  const [email, setEmail] = useState("gestor@demo.selo-infancia-segura.org");
  const [pwd, setPwd] = useState("••••••••");

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between p-10 bg-brand-navy-deep text-primary-foreground">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-lg bg-white/15 grid place-items-center">
            <Blocks className="size-5" />
          </div>
          <span className="font-semibold">SIS — Selo Infância Segura</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">Portal Institucional</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-sm">
            Gerencie instituições, certificações e auditorias com total transparência,
            segurança e imutabilidade.
          </p>
        </div>
        <div className="text-xs text-primary-foreground/60">© 2026 SIS — Selo Infância Segura</div>
      </div>

      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="text-sm text-muted-foreground mt-1">Acesse sua conta institucional.</p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => { e.preventDefault(); nav({ to: "/portal/dashboard" }); }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">E-mail institucional</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pwd">Senha</Label>
              <Input id="pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" size="lg">
              <LogIn className="size-4" /> Entrar no portal
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Acesso demonstrativo — nenhuma autenticação real.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
