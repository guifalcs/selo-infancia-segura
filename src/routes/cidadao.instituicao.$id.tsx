import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  MapPin,
  Blocks,
  CalendarClock,
  UserCheck,
  Megaphone,
  Award,
  Info,
  Link2,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StatusBadge } from "@/components/StatusBadge";
import { Seal } from "@/components/Seal";
import { Button } from "@/components/ui/button";
import { institutions, blockchainHistory, type RegistroBlockchain } from "@/lib/mock-data";

export const Route = createFileRoute("/cidadao/instituicao/$id")({
  head: ({ params }) => {
    const inst = institutions.find((i) => i.id === params.id);
    const title = inst ? `${inst.nome} — SIS` : "Instituição — SIS";
    const desc = inst?.descricao ?? "Ficha pública de certificação da instituição.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  loader: ({ params }) => {
    const inst = institutions.find((i) => i.id === params.id);
    if (!inst) throw notFound();
    return { inst };
  },
  component: Ficha,
});

/** Cor da barra por faixa de nota — verde só a partir do patamar de referência. */
function corDaNota(nota: number) {
  if (nota >= 90) return "bg-success";
  if (nota >= 75) return "bg-brand-teal";
  if (nota >= 60) return "bg-brand-amber";
  return "bg-destructive";
}

const rotuloEvento: Record<RegistroBlockchain["tipo"], string> = {
  certificacao: "Certificação",
  avaliacao: "Avaliação",
  denuncia: "Denúncia",
  renovacao: "Renovação",
  atualizacao: "Atualização",
};

function Ficha() {
  const { inst } = Route.useLoaderData();
  const historico = blockchainHistory.default;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main id="conteudo" className="flex-1">
        {/* Identificação da instituição. */}
        <div className="border-b bg-secondary/40">
          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
            <Link
              to="/cidadao/consulta"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" aria-hidden /> Voltar à consulta
            </Link>

            <div className="mt-6 flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border bg-card px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    {inst.tipo}
                  </span>
                  <StatusBadge status={inst.status} />
                </div>

                <h1 className="mt-4 text-3xl font-bold leading-tight text-primary sm:text-4xl">
                  {inst.nome}
                </h1>

                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="size-4 shrink-0" aria-hidden />
                  {inst.cidade} - {inst.uf}
                </p>

                <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                  {inst.descricao}
                </p>
              </div>

              {inst.nivel && (
                <div className="shrink-0 text-center">
                  <Seal nivel={inst.nivel} className="mx-auto size-28" />
                  {inst.pontuacao !== null && (
                    <p className="mt-3 font-serif text-2xl font-bold text-primary">
                      {inst.pontuacao}
                      <span className="text-base font-normal text-muted-foreground">/100</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          {/* Dados do ciclo de certificação. */}
          <section aria-labelledby="ciclo">
            <h2 id="ciclo" className="sr-only">
              Dados da certificação
            </h2>
            <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: CalendarClock, rotulo: "Última avaliação", valor: inst.ultimaAvaliacao },
                { icon: CalendarClock, rotulo: "Validade do selo", valor: inst.validade ?? "—" },
                { icon: UserCheck, rotulo: "Avaliador responsável", valor: inst.avaliador ?? "—" },
                { icon: Award, rotulo: "Registro SIS", valor: inst.id.toUpperCase() },
              ].map((d) => (
                <div key={d.rotulo} className="rounded-lg border bg-card p-5">
                  <dt className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    <d.icon className="size-3.5" aria-hidden /> {d.rotulo}
                  </dt>
                  <dd className="mt-2 text-sm font-semibold leading-snug text-foreground">
                    {d.valor}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* Notas por eixo. */}
          {inst.criterios.length > 0 && (
            <section aria-labelledby="eixos" className="mt-12">
              <h2 id="eixos" className="font-serif text-2xl font-bold text-primary">
                Desempenho por eixo
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Cada eixo é avaliado presencialmente e recebe nota de 0 a 100. A nota final é a
                média ponderada que define o nível do selo.
              </p>

              <ul className="mt-7 space-y-5">
                {inst.criterios.map((c) => (
                  <li key={c.nome}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-semibold text-foreground">{c.nome}</p>
                      <p className="font-mono text-sm font-semibold text-primary">{c.nota}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.base}</p>
                    <div
                      className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                      role="img"
                      aria-label={`${c.nome}: ${c.nota} de 100 pontos`}
                    >
                      <div
                        className={`h-full rounded-full ${corDaNota(c.nota)}`}
                        style={{ width: `${c.nota}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Subselos. */}
          {inst.subselos.length > 0 && (
            <section
              aria-labelledby="subselos"
              className="mt-12 rounded-lg border bg-secondary/40 p-7"
            >
              <h2 id="subselos" className="font-serif text-xl font-bold text-primary">
                Subselos conquistados
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2.5">
                {inst.subselos.map((s) => (
                  <li
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-full border border-brand-teal/30 bg-card px-3.5 py-1.5 text-sm font-medium text-brand-teal"
                  >
                    <Award className="size-4" aria-hidden /> {s}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Histórico blockchain. */}
          <section aria-labelledby="historico" className="mt-12">
            <div className="flex items-start gap-3">
              <Blocks className="mt-1 size-6 shrink-0 text-brand-teal" aria-hidden />
              <div>
                <h2 id="historico" className="font-serif text-2xl font-bold text-primary">
                  Histórico registrado
                </h2>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Cadeia de eventos gravada em blockchain. Nenhum registro pode ser apagado ou
                  reescrito — inclusive os desfavoráveis à instituição.
                </p>
              </div>
            </div>

            <ol className="mt-7">
              {historico.map((b, i) => (
                <li key={b.bloco}>
                  <article className="rounded-lg border bg-card p-5">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="rounded-full border bg-background px-2.5 py-0.5 text-xs font-medium text-brand-teal">
                        {rotuloEvento[b.tipo]}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        Bloco {b.bloco}
                      </span>
                      <span aria-hidden className="text-muted-foreground">
                        ·
                      </span>
                      <time className="text-xs text-muted-foreground">{b.data}</time>
                    </div>
                    <p className="mt-2 font-medium text-foreground">{b.evento}</p>
                    <p className="mt-1.5 font-mono text-xs text-muted-foreground">hash {b.hash}</p>
                  </article>
                  {i < historico.length - 1 && (
                    <Link2 className="mx-auto my-1 size-4 rotate-90 text-border" aria-hidden />
                  )}
                </li>
              ))}
            </ol>
          </section>

          {/* Ação de denúncia. */}
          <section className="mt-12 rounded-lg border bg-card p-7 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-primary">
                Identificou alguma irregularidade?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                O registro é anônimo e fica gravado na cadeia desta instituição. Em caso de risco
                imediato, procure o Disque 100 ou a polícia.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="mt-5 w-full shrink-0 sm:mt-0 sm:w-auto"
            >
              <Link to="/cidadao/denuncia">
                <Megaphone className="size-4" aria-hidden /> Registrar denúncia
              </Link>
            </Button>
          </section>

          <p className="mt-8 flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0 text-brand-amber" aria-hidden />
            <span>
              Instituição, notas, avaliador e registros são fictícios e existem apenas para
              demonstrar a ficha pública neste protótipo.
            </span>
          </p>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
