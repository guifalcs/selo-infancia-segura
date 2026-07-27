import { Link } from "@tanstack/react-router";
import { Blocks, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function BrandHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="border-b bg-card/60 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 h-16">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <div className="size-9 shrink-0 rounded-lg bg-gradient-to-br from-primary to-secondary grid place-items-center text-primary-foreground">
            <Blocks className="size-5" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="font-semibold text-sm truncate">YC Blockchain</div>
            <div className="text-[11px] text-muted-foreground truncate hidden sm:block">Certificação Educacional Descentralizada</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/cidadao/consulta" className="text-muted-foreground hover:text-foreground">Consultar</Link>
          <Link to="/cidadao/denuncia" className="text-muted-foreground hover:text-foreground">Denunciar</Link>
          <Link to="/portal/login" className="text-primary font-medium">Portal Institucional</Link>
        </nav>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden shrink-0" aria-label="Abrir menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <nav className="mt-8 flex flex-col gap-1 text-sm">
              <Link to="/cidadao/consulta" onClick={close} className="px-3 py-2 rounded-md hover:bg-accent">Consultar</Link>
              <Link to="/cidadao/denuncia" onClick={close} className="px-3 py-2 rounded-md hover:bg-accent">Denunciar</Link>
              <Link to="/portal/login" onClick={close} className="px-3 py-2 rounded-md bg-primary text-primary-foreground font-medium">Portal Institucional</Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
