import { Link } from "@tanstack/react-router";
import { Phone, ShieldAlert } from "lucide-react";
import { BrandLockup } from "@/components/Brand";

/**
 * Rodapé institucional.
 *
 * Estruturado em colunas como em portal de órgão público, com um bloco fixo
 * de canais oficiais de emergência. Esse bloco é deliberado: um portal que
 * fala de proteção infantil tem obrigação de apontar o Disque 100 e o 190,
 * que funcionam hoje, em vez de sugerir que o próprio canal do protótipo
 * substitui um serviço de emergência.
 */

const colunas = [
  {
    titulo: "A plataforma",
    itens: [
      { label: "A iniciativa", to: "/", hash: "a-iniciativa" },
      { label: "Como funciona", to: "/", hash: "como-funciona" },
      { label: "Os selos", to: "/", hash: "selos" },
      { label: "Base normativa", to: "/", hash: "base-normativa" },
    ],
  },
  {
    titulo: "Para famílias",
    itens: [
      { label: "Consultar instituição", to: "/cidadao/consulta" },
      { label: "Registrar denúncia", to: "/cidadao/denuncia" },
      { label: "Como ler um selo", to: "/", hash: "selos" },
    ],
  },
  {
    titulo: "Para instituições",
    itens: [
      { label: "Portal institucional", to: "/portal/login" },
      { label: "Por que se certificar", to: "/", hash: "para-quem" },
      { label: "Transparência", to: "/", hash: "transparencia" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary/40">
      {/* Canais que existem de verdade, acima de qualquer navegação. */}
      <div className="border-b bg-brand-navy-deep text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="flex items-start gap-2.5">
            <ShieldAlert className="mt-0.5 size-5 shrink-0 text-brand-star" aria-hidden />
            <span>
              <strong className="font-semibold">
                Em caso de risco imediato a uma criança ou adolescente, procure os canais oficiais.
              </strong>{" "}
              <span className="text-primary-foreground/80">
                Este portal é um protótipo e não substitui atendimento de emergência.
              </span>
            </span>
          </p>
          <p className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1 font-semibold">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-4" aria-hidden /> Disque 100
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-4" aria-hidden /> 190
            </span>
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <BrandLockup className="h-16" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Certificação de instituições que atendem crianças e adolescentes, com histórico
              público e auditável registrado em blockchain.
            </p>
          </div>

          {colunas.map((col) => (
            <nav key={col.titulo} aria-label={col.titulo}>
              <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-primary">
                {col.titulo}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.itens.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      hash={"hash" in item ? item.hash : undefined}
                      className="text-muted-foreground transition-colors hover:text-primary hover:underline underline-offset-4"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} SIS: Selo Infância Segura. Protótipo acadêmico sem vínculo
            institucional com os órgãos citados.
          </p>
          <p>Dados exibidos são fictícios e servem apenas para demonstração.</p>
        </div>
      </div>
    </footer>
  );
}
