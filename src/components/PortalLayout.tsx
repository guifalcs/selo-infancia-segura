import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Award, ClipboardCheck, BarChart3, LogOut, Blocks, Menu } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portal/instituicoes", label: "Instituições", icon: Building2 },
  { to: "/portal/certificacoes", label: "Certificações", icon: Award },
  { to: "/portal/auditorias", label: "Auditorias", icon: ClipboardCheck },
  { to: "/portal/relatorios", label: "Relatórios", icon: BarChart3 },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2 px-5 h-16 border-b">
        <div className="size-9 shrink-0 rounded-lg bg-brand-navy grid place-items-center text-primary-foreground">
          <Blocks className="size-5" />
        </div>
        <div className="leading-tight min-w-0">
          <div className="font-semibold text-sm truncate">SIS — Selo Infância Segura</div>
          <div className="text-[11px] text-muted-foreground truncate">Portal Institucional</div>
        </div>
      </Link>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            activeProps={{ className: "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground" }}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t">
        <Link to="/portal/login" onClick={onNavigate} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent">
          <LogOut className="size-4 shrink-0" /> Sair
        </Link>
      </div>
    </>
  );
}

export function PortalLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden lg:flex w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground flex-col">
        <SidebarContent />
      </aside>
      <main className="flex-1 min-w-0">
        <header className="h-16 bg-card border-b flex items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0" aria-label="Abrir menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 bg-sidebar text-sidebar-foreground flex flex-col">
              <SheetTitle className="sr-only">Menu do portal</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-semibold truncate">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
