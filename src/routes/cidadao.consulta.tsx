import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, MapPin, SlidersHorizontal, ArrowRight, Info } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusBadge } from "@/components/StatusBadge";
import { SubseloBadge } from "@/components/SubseloBadge";
import { SealChip } from "@/components/Seal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { institutions } from "@/lib/mock-data";

export const Route = createFileRoute("/cidadao/consulta")({
  head: () => ({
    meta: [
      { title: "Consulta pública de instituições | SIS" },
      {
        name: "description",
        content:
          "Consulte o histórico de certificação de escolas, creches, clínicas, clubes, parques e projetos sociais que atendem crianças e adolescentes.",
      },
      { property: "og:title", content: "Consulta pública de instituições | SIS" },
      {
        property: "og:description",
        content: "Verifique o selo, os eixos avaliados e o histórico de uma instituição.",
      },
    ],
  }),
  component: Consulta,
});

function Consulta() {
  const [q, setQ] = useState("");
  const [cidade, setCidade] = useState("all");
  const [tipo, setTipo] = useState("all");
  const [status, setStatus] = useState("all");

  const cidades = useMemo(
    () => Array.from(new Set(institutions.map((i) => `${i.cidade} - ${i.uf}`))).sort(),
    [],
  );
  const tipos = useMemo(() => Array.from(new Set(institutions.map((i) => i.tipo))).sort(), []);

  const filtradas = institutions.filter(
    (i) =>
      i.nome.toLowerCase().includes(q.trim().toLowerCase()) &&
      (cidade === "all" || `${i.cidade} - ${i.uf}` === cidade) &&
      (tipo === "all" || i.tipo === tipo) &&
      (status === "all" || i.status === status),
  );

  const temFiltro = q !== "" || cidade !== "all" || tipo !== "all" || status !== "all";
  const limpar = () => {
    setQ("");
    setCidade("all");
    setTipo("all");
    setStatus("all");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main id="conteudo" className="flex-1">
        {/* Cabeçalho da página. */}
        <div className="border-b bg-secondary/40">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <nav aria-label="Trilha de navegação" className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary hover:underline underline-offset-4">
                Início
              </Link>
              <span aria-hidden className="mx-2">
                /
              </span>
              <span className="text-foreground">Consulta pública</span>
            </nav>

            <h1 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">
              Consulta pública de instituições
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Verifique o nível do selo, os eixos avaliados e o histórico registrado de qualquer
              instituição participante antes de decidir onde a criança vai passar o dia.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {/* Filtros. */}
          <section aria-label="Filtros de busca" className="rounded-lg border bg-card p-5 sm:p-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-primary">
              <SlidersHorizontal className="size-4 text-brand-teal" aria-hidden />
              Refine a busca
            </h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
              <div className="relative">
                <label htmlFor="busca" className="sr-only">
                  Pesquisar pelo nome da instituição
                </label>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="busca"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Nome da instituição..."
                  className="pl-9"
                />
              </div>

              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger aria-label="Tipo de instituição">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {tipos.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={cidade} onValueChange={setCidade}>
                <SelectTrigger aria-label="Cidade">
                  <SelectValue placeholder="Cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cidades.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger aria-label="Situação da certificação">
                  <SelectValue placeholder="Situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as situações</SelectItem>
                  <SelectItem value="Certificada">Certificada</SelectItem>
                  <SelectItem value="Em avaliação">Em avaliação</SelectItem>
                  <SelectItem value="Pendente">Pendente</SelectItem>
                  <SelectItem value="Suspensa">Suspensa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Resultados. */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <p aria-live="polite" className="text-sm text-muted-foreground">
              <strong className="font-semibold text-foreground">{filtradas.length}</strong>{" "}
              {filtradas.length === 1 ? "instituição encontrada" : "instituições encontradas"}
            </p>
            {temFiltro && (
              <Button variant="ghost" size="sm" onClick={limpar}>
                Limpar filtros
              </Button>
            )}
          </div>

          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtradas.map((i) => (
              <li key={i.id}>
                <Link
                  to="/cidadao/instituicao/$id"
                  params={{ id: i.id }}
                  className="group flex h-full flex-col rounded-lg border bg-card p-6 transition-colors hover:border-primary/50 hover:bg-secondary/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {i.tipo}
                    </span>
                    <StatusBadge status={i.status} />
                  </div>

                  <h3 className="mt-4 text-lg font-bold leading-snug text-primary">{i.nome}</h3>

                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="size-3.5 shrink-0" aria-hidden />
                    {i.cidade} - {i.uf}
                  </p>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {i.descricao}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t pt-4">
                    {i.nivel ? (
                      <SealChip nivel={i.nivel} />
                    ) : (
                      <span className="text-xs text-muted-foreground">Sem selo vigente</span>
                    )}
                    {i.pontuacao !== null && (
                      <span className="text-xs text-muted-foreground">
                        {i.pontuacao}/100 pontos
                      </span>
                    )}

                    {/* Subselos em escala reduzida: aqui eles são sinal de
                        comparação entre instituições, não o assunto do card.
                        Sem `decorativa`, porque o nome não aparece por escrito. */}
                    {i.subselos.length > 0 && (
                      <span className="ml-auto flex items-center gap-1">
                        {i.subselos.map((s) => (
                          <SubseloBadge key={s} nome={s} size={24} />
                        ))}
                      </span>
                    )}
                  </div>

                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Ver ficha completa
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {filtradas.length === 0 && (
            <div className="mt-5 rounded-lg border border-dashed bg-card p-12 text-center">
              <Search className="mx-auto size-8 text-muted-foreground" aria-hidden />
              <p className="mt-4 font-semibold text-foreground">Nenhuma instituição encontrada</p>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
                Tente ajustar os filtros ou pesquisar por outro termo.
              </p>
              <Button variant="outline" className="mt-6" onClick={limpar}>
                Limpar filtros
              </Button>
            </div>
          )}

          <p className="mt-10 flex items-start gap-2.5 rounded-lg border-l-4 border-l-brand-amber bg-card p-5 text-sm leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-brand-amber" aria-hidden />
            <span>
              As instituições listadas são fictícias e servem apenas para demonstrar o funcionamento
              da consulta pública neste protótipo.
            </span>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
