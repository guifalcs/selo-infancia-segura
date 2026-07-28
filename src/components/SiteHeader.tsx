import { Link } from "@tanstack/react-router";
import { Menu, Search, Megaphone, Building2, Info } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BrandLockup } from "@/components/Brand";

/**
 * Masthead institucional.
 *
 * A faixa superior escura é uma convenção de portal público (gov.br, portais
 * de tribunais, sites de agências): identifica a natureza da iniciativa antes
 * de qualquer conteúdo. Aqui ela cumpre também uma função de honestidade —
 * deixa explícito que este é um protótipo, não um serviço em
 * operação. Assumir isso aumenta a credibilidade em vez de reduzir.
 */

const secoes = [
  { label: "A iniciativa", hash: "a-iniciativa" },
  { label: "Como funciona", hash: "como-funciona" },
  { label: "Os selos", hash: "selos" },
  { label: "Base normativa", hash: "base-normativa" },
] as const;

const servicos = [
  { to: "/cidadao/consulta", label: "Consultar instituição", icon: Search },
  { to: "/cidadao/denuncia", label: "Canal de denúncia", icon: Megaphone },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      {/* Pular para o conteúdo: primeiro item alcançável por teclado. */}
      <a
        href="#conteudo"
        className="sr-only rounded-b-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-0 focus:z-50"
      >
        Pular para o conteúdo
      </a>

      <div className="bg-brand-navy-deep text-primary-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-xs sm:px-6">
          <p className="flex items-center gap-2">
            <Info className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              Protótipo · <span className="hidden sm:inline">iniciativa em desenvolvimento, </span>
              ainda não é um serviço em operação
            </span>
          </p>
          <Link
            to="/"
            hash="transparencia"
            className="hidden shrink-0 underline underline-offset-2 hover:no-underline sm:block"
          >
            Saiba mais
          </Link>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" aria-label="SIS: Selo Infância Segura, página inicial">
            <BrandLockup />
          </Link>

          <nav aria-label="Principal" className="hidden items-center gap-6 text-sm lg:flex">
            {secoes.map((s) => (
              <Link
                key={s.hash}
                to="/"
                hash={s.hash}
                className="font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {s.label}
              </Link>
            ))}
            <span aria-hidden className="h-5 w-px bg-border" />
            <Link
              to="/cidadao/consulta"
              className="font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Consultar
            </Link>
            <Button asChild size="sm">
              <Link to="/portal/login">
                <Building2 className="size-4" aria-hidden /> Portal institucional
              </Link>
            </Button>
          </nav>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <nav aria-label="Principal" className="mt-8 flex flex-col gap-1 text-sm">
                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  A plataforma
                </p>
                {secoes.map((s) => (
                  <Link
                    key={s.hash}
                    to="/"
                    hash={s.hash}
                    onClick={close}
                    className="rounded-md px-3 py-2.5 font-medium hover:bg-accent"
                  >
                    {s.label}
                  </Link>
                ))}

                <p className="px-3 pb-2 pt-5 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Serviços
                </p>
                {servicos.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    onClick={close}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2.5 font-medium hover:bg-accent"
                  >
                    <s.icon className="size-4 text-brand-teal" aria-hidden /> {s.label}
                  </Link>
                ))}

                <Button asChild className="mt-5">
                  <Link to="/portal/login" onClick={close}>
                    <Building2 className="size-4" aria-hidden /> Portal institucional
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
    </>
  );
}
