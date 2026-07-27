import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Building2, Award, ClipboardCheck, BarChart3, LogOut, Blocks } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/portal/instituicoes", label: "Instituições", icon: Building2 },
  { to: "/portal/certificacoes", label: "Certificações", icon: Award },
  { to: "/portal/auditorias", label: "Auditorias", icon: ClipboardCheck },
  { to: "/portal/relatorios", label: "Relatórios", icon: BarChart3 },
] as const;

export function PortalLayout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-64 shrink-0 border-r bg-sidebar text-sidebar-foreground flex flex-col">
        <Link to="/" className="flex items-center gap-2 px-5 h-16 border-b">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-primary-foreground">
            <Blocks className="size-5" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-sm">YC Blockchain</div>
            <div className="text-[11px] text-muted-foreground">Portal Institucional</div>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              activeProps={{ className: "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground" }}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t">
          <Link to="/portal/login" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-sidebar-accent">
            <LogOut className="size-4" /> Sair
          </Link>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="h-16 bg-card border-b flex items-center px-8">
          <div>
            <h1 className="text-lg font-semibold">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
