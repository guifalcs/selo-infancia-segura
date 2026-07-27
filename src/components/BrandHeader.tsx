import { Link } from "@tanstack/react-router";
import { Blocks } from "lucide-react";

export function BrandHeader() {
  return (
    <header className="border-b bg-card/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-primary-foreground">
            <Blocks className="size-5" />
          </div>
          <div className="leading-tight">
            <div className="font-semibold text-sm">YC Blockchain</div>
            <div className="text-[11px] text-muted-foreground">Certificação Educacional Descentralizada</div>
          </div>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/cidadao/consulta" className="text-muted-foreground hover:text-foreground">Consultar</Link>
          <Link to="/cidadao/denuncia" className="text-muted-foreground hover:text-foreground">Denunciar</Link>
          <Link to="/portal/login" className="text-primary font-medium">Portal Institucional</Link>
        </nav>
      </div>
    </header>
  );
}
