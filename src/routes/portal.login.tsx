import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogIn, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrandLockup } from "@/components/Brand";
import { PapelBadge } from "@/components/PortalLayout";
import { contas, SENHA_DEMO } from "@/lib/portal-access";
import { usePortalSession } from "@/lib/portal-session";

export const Route = createFileRoute("/portal/login")({
  head: () => ({
    meta: [
      { title: "Login institucional | SIS" },
      { name: "description", content: "Acesse o portal institucional do SIS." },
      { property: "og:title", content: "Login institucional | SIS" },
      { property: "og:description", content: "Portal institucional do SIS." },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const { entrar, conta } = usePortalSession();

  // Domínio fictício e neutro de propósito: usar um `.gov.br` inventado num
  // projeto sem vínculo com o governo é um risco real de credibilidade.
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);

  const acessar = (emailTentado: string, senhaTentada: string) => {
    const encontrada = entrar(emailTentado, senhaTentada);
    if (!encontrada) {
      setErro("E-mail ou senha não correspondem a nenhum acesso de demonstração.");
      return;
    }
    setErro(null);
    nav({ to: "/portal/dashboard" });
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.15fr]">
      <div className="hidden flex-col justify-between bg-brand-navy-deep p-10 text-primary-foreground lg:flex lg:p-14">
        <Link to="/" className="w-fit">
          <BrandLockup className="h-14" />
        </Link>

        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-tight">Portal Institucional</h2>
          <p className="mt-4 text-lg leading-relaxed text-primary-foreground/80">
            Um acesso para cada papel na certificação: a unidade acompanha o próprio selo, a rede
            gestora acompanha suas unidades e o SIS emite e audita tudo.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-primary-foreground/75">
            {[
              "Cada perfil vê apenas o que lhe compete.",
              "Selo, plano de adequação e denúncias no mesmo lugar.",
              "Histórico registrado em blockchain, sem edição retroativa.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-star" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-primary-foreground/60">© 2026 SIS: Selo Infância Segura</div>
      </div>

      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesse sua conta institucional para acompanhar a certificação.
          </p>

          <form
            className="mt-7 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              acessar(email, senha);
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">E-mail institucional</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="nome@instituicao.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            {erro && (
              <p
                role="alert"
                className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                {erro}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg">
              <LogIn className="size-4" aria-hidden /> Entrar no portal
            </Button>
          </form>

          {conta && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Sessão ativa como <strong>{conta.pessoa}</strong>:{" "}
              <Link to="/portal/dashboard" className="font-semibold text-primary hover:underline">
                continuar de onde parou
              </Link>
            </p>
          )}

          {/* Bloco de avaliação: o objetivo é que quem analisa o projeto veja os
              três tipos de acesso sem precisar de credenciais nossas. */}
          <div className="mt-10 border-t pt-6">
            <h2 className="text-sm font-semibold">Acessos de demonstração</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Protótipo sem autenticação real. Clique em um perfil para entrar direto, ou use o
              e-mail com a senha <code className="font-mono font-semibold">{SENHA_DEMO}</code> no
              formulário acima. Dentro do portal é possível trocar de perfil pelo menu do cabeçalho.
            </p>

            <ul className="mt-4 space-y-3">
              {contas.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(c.email);
                      setSenha(c.senha);
                      acessar(c.email, c.senha);
                    }}
                    className="group w-full rounded-lg border bg-card p-4 text-left transition-colors hover:border-primary/40 hover:bg-secondary/50"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-primary">{c.pessoa}</span>
                      <PapelBadge papel={c.papel} />
                      <ArrowRight
                        className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden
                      />
                    </span>
                    <span className="mt-1 block text-xs font-medium text-foreground">
                      {c.cargo}
                    </span>
                    <span className="mt-1.5 block text-xs leading-relaxed text-muted-foreground">
                      {c.demo}
                    </span>
                    <span className="mt-2 block truncate font-mono text-[11px] text-muted-foreground/80">
                      {c.email}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
