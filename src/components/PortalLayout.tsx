import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Building2,
  Award,
  ClipboardCheck,
  BarChart3,
  LogOut,
  Menu,
  Megaphone,
  Blocks,
  KeyRound,
  UserCheck,
  ListChecks,
  ChevronsUpDown,
  Check,
  ShieldAlert,
  Loader2,
  Stamp,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BrandLockup } from "@/components/Brand";
import { contas, rotuloPapel, type Escopo, type Papel } from "@/lib/portal-access";
import { usePortalSession } from "@/lib/portal-session";

/**
 * Navegação por papel.
 *
 * Cada perfil vê apenas o que lhe cabe: a unidade não tem por onde chegar à
 * lista de instituições, a rede não gerencia avaliadores, e só a equipe do SIS
 * emite certificação. O menu é a primeira camada disso; cada rota repete a
 * verificação em `papeis`, porque esconder o link não é controle de acesso.
 */
const navPorPapel = {
  admin: [
    { to: "/portal/dashboard", label: "Visão geral", icon: LayoutDashboard },
    { to: "/portal/instituicoes", label: "Clientes", icon: Building2 },
    { to: "/portal/modelos", label: "Modelos de selo", icon: Stamp },
    { to: "/portal/certificacoes", label: "Certificações", icon: Award },
    { to: "/portal/auditorias", label: "Avaliações", icon: ClipboardCheck },
    { to: "/portal/denuncias", label: "Denúncias", icon: Megaphone },
    { to: "/portal/avaliadores", label: "Avaliadores", icon: UserCheck },
    { to: "/portal/registros", label: "Registros", icon: Blocks },
    { to: "/portal/relatorios", label: "Relatórios", icon: BarChart3 },
  ],
  rede: [
    { to: "/portal/dashboard", label: "Visão geral", icon: LayoutDashboard },
    { to: "/portal/instituicoes", label: "Unidades", icon: Building2 },
    { to: "/portal/certificacoes", label: "Selos da rede", icon: Award },
    { to: "/portal/auditorias", label: "Avaliações", icon: ClipboardCheck },
    { to: "/portal/denuncias", label: "Denúncias", icon: Megaphone },
    { to: "/portal/acessos", label: "Acessos das unidades", icon: KeyRound },
    { to: "/portal/registros", label: "Registros", icon: Blocks },
    { to: "/portal/relatorios", label: "Relatórios", icon: BarChart3 },
  ],
  unidade: [
    { to: "/portal/dashboard", label: "Visão geral", icon: LayoutDashboard },
    { to: "/portal/certificacoes", label: "Minha certificação", icon: Award },
    { to: "/portal/plano", label: "Plano de adequação", icon: ListChecks },
    { to: "/portal/auditorias", label: "Avaliações", icon: ClipboardCheck },
    { to: "/portal/denuncias", label: "Denúncias", icon: Megaphone },
    { to: "/portal/registros", label: "Registros", icon: Blocks },
  ],
} as const satisfies Record<Papel, ReadonlyArray<{ to: string; label: string; icon: unknown }>>;

/** Cor do selo do papel — navy para o SIS, teal para rede, âmbar para unidade. */
const corDoPapel: Record<Papel, string> = {
  admin: "border-brand-blue/40 bg-brand-blue/10 text-brand-blue",
  rede: "border-brand-teal/40 bg-brand-teal/10 text-brand-teal",
  unidade: "border-brand-amber/50 bg-brand-amber/10 text-brand-amber",
};

export function PapelBadge({ papel, className }: { papel: Papel; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${corDoPapel[papel]} ${className ?? ""}`}
    >
      {rotuloPapel[papel]}
    </span>
  );
}

function SidebarContent({ escopo, onNavigate }: { escopo: Escopo; onNavigate?: () => void }) {
  const itens = navPorPapel[escopo.papel];
  const { sair } = usePortalSession();
  const nav = useNavigate();

  return (
    <>
      <Link to="/" onClick={onNavigate} className="flex h-16 items-center gap-2 border-b px-5">
        <BrandLockup className="h-10" />
        <span className="truncate text-[11px] font-medium text-muted-foreground">
          Portal Institucional
        </span>
      </Link>

      <div className="border-b px-5 py-4">
        <PapelBadge papel={escopo.papel} />
        <p className="mt-2 text-sm font-semibold leading-snug">{escopo.organizacao}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{escopo.contexto}</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {itens.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{
              className:
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground",
            }}
          >
            <Icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t p-3">
        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            sair();
            nav({ to: "/portal/login" });
          }}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
        >
          <LogOut className="size-4 shrink-0" aria-hidden /> Sair
        </button>
      </div>
    </>
  );
}

/**
 * Seletor de perfil.
 *
 * Existe para a demonstração: permite pular entre os quatro acessos sem
 * deslogar e digitar credenciais de novo. Num ambiente real, este menu mostra
 * só as organizações às quais a pessoa pertence de fato.
 */
function SeletorDePerfil({ escopo }: { escopo: Escopo }) {
  const { usarConta, sair } = usePortalSession();
  const nav = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-auto max-w-[15rem] gap-2 py-1.5 pl-2.5 pr-2">
          <span className="min-w-0 text-left">
            <span className="block truncate text-xs font-semibold leading-tight">
              {escopo.conta.pessoa}
            </span>
            <span className="block truncate text-[11px] leading-tight text-muted-foreground">
              {rotuloPapel[escopo.papel]}
            </span>
          </span>
          <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Perfis de demonstração: troque de acesso sem sair
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {contas.map((c) => {
          const atual = c.id === escopo.conta.id;
          return (
            <DropdownMenuItem
              key={c.id}
              onSelect={() => {
                if (!atual) {
                  usarConta(c.id);
                  nav({ to: "/portal/dashboard" });
                }
              }}
              className="items-start gap-2 py-2"
            >
              <Check
                className={`mt-0.5 size-4 shrink-0 ${atual ? "opacity-100" : "opacity-0"}`}
                aria-hidden
              />
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-semibold">{c.pessoa}</span>
                  <PapelBadge papel={c.papel} />
                </span>
                <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                  {c.cargo}
                </span>
              </span>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            sair();
            nav({ to: "/portal/login" });
          }}
        >
          <LogOut className="size-4" aria-hidden /> Sair do portal
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TelaDeEspera({ mensagem }: { mensagem: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-muted/30 px-4">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" aria-hidden /> {mensagem}
      </p>
    </div>
  );
}

function SemPermissao({ escopo }: { escopo: Escopo }) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <ShieldAlert className="size-6" aria-hidden />
      </div>
      <h2 className="mt-4 text-lg font-semibold">Esta área não faz parte do seu acesso</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        O perfil <strong>{rotuloPapel[escopo.papel]}</strong> não tem permissão para abrir esta
        página. Se você precisa desses dados, solicite ao responsável pela sua organização.
      </p>
      <Button asChild className="mt-6">
        <Link to="/portal/dashboard">Voltar à visão geral</Link>
      </Button>
    </div>
  );
}

/**
 * Moldura de todas as telas internas do portal.
 *
 * Além do enquadramento visual, é aqui que a sessão é exigida: sem conta
 * escolhida, a pessoa volta ao login; com papel fora de `papeis`, vê o aviso de
 * permissão em vez do conteúdo. As páginas recebem o escopo já resolvido, então
 * nenhuma delas precisa saber como o recorte foi calculado.
 */
export function PortalLayout({
  title,
  subtitle,
  papeis,
  acoes,
  children,
}: {
  title: string;
  subtitle?: string;
  /** Papéis autorizados. Omitido = qualquer perfil autenticado. */
  papeis?: readonly Papel[];
  /** Ações no topo direito da página (filtros, botões de emissão etc.). */
  acoes?: ReactNode;
  children: ReactNode | ((escopo: Escopo) => ReactNode);
}) {
  const { pronta, escopo } = usePortalSession();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    if (pronta && !escopo) nav({ to: "/portal/login", replace: true });
  }, [pronta, escopo, nav]);

  if (!pronta) return <TelaDeEspera mensagem="Carregando o portal…" />;
  if (!escopo) return <TelaDeEspera mensagem="Redirecionando para o login…" />;

  const autorizado = !papeis || papeis.includes(escopo.papel);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
        <SidebarContent escopo={escopo} />
      </aside>

      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center gap-3 border-b bg-card px-4 sm:px-6 lg:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-72 flex-col bg-sidebar p-0 text-sidebar-foreground"
            >
              <SheetTitle className="sr-only">Menu do portal</SheetTitle>
              <SidebarContent escopo={escopo} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold sm:text-lg">{title}</h1>
            {subtitle && <p className="truncate text-xs text-muted-foreground">{subtitle}</p>}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {autorizado && acoes}
            <SeletorDePerfil escopo={escopo} />
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          {!autorizado ? (
            <SemPermissao escopo={escopo} />
          ) : typeof children === "function" ? (
            children(escopo)
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
