import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Search,
  Building2,
  Users,
  ShieldCheck,
  ClipboardCheck,
  Scale,
  Blocks,
  Megaphone,
  UserCheck,
  CalendarClock,
  Landmark,
  HeartHandshake,
  School,
  Link2,
  FileWarning,
  Accessibility,
  Lock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SectionHeading } from "@/components/SectionHeading";
import { SubseloBadge } from "@/components/SubseloBadge";
import { Seal } from "@/components/Seal";
import { TramaInstitucional } from "@/components/illustrations";
import { eixos, niveis, subselos } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SIS | Selo Infância Segura" },
      {
        name: "description",
        content:
          "Certificação de instituições que atendem crianças e adolescentes, com histórico público e auditável registrado em blockchain. Consulte escolas, creches, clínicas, clubes, parques, cursos e projetos sociais.",
      },
      { property: "og:title", content: "SIS | Selo Infância Segura" },
      {
        property: "og:description",
        content:
          "Transparência, segurança e confiança na escolha de onde as crianças passam o dia.",
      },
      { property: "og:image", content: "/marca/og-sis.png" },
    ],
  }),
  component: Home,
});

/* ---------------------------------------------------------------- conteúdo */

const publicosAfetados = [
  {
    icon: HeartHandshake,
    titulo: "Famílias",
    texto:
      "Precisam confiar sem ter informação suficiente. Hoje a escolha de uma escola, creche ou clínica é feita por indicação, aparência ou proximidade.",
  },
  {
    icon: School,
    titulo: "Instituições sérias",
    texto:
      "Investem em qualidade e formação de equipe, mas não têm como demonstrar isso de forma verificável e comparável.",
  },
  {
    icon: Landmark,
    titulo: "Poder público e redes privadas",
    texto:
      "Precisam fiscalizar dezenas ou centenas de unidades com recursos limitados, e respondem por omissão sobre a rede que financiam.",
  },
];

const etapas = [
  {
    icon: ClipboardCheck,
    titulo: "Adesão",
    texto: "A instituição, a rede ou a prefeitura responsável solicita a avaliação.",
  },
  {
    icon: UserCheck,
    titulo: "Avaliação presencial",
    texto: "Profissionais credenciados visitam a unidade e avaliam os seis eixos.",
  },
  {
    icon: ShieldCheck,
    titulo: "Pontuação e selo",
    texto: "A nota define o nível (Bronze, Prata ou Ouro) e os subselos conquistados.",
  },
  {
    icon: Blocks,
    titulo: "Registro imutável",
    texto: "Cada evento é gravado em blockchain e não pode ser reescrito depois.",
  },
  {
    icon: Search,
    titulo: "Consulta pública",
    texto: "Qualquer responsável acessa o histórico completo antes de decidir.",
  },
];

const paraQuem = [
  {
    icon: Users,
    titulo: "Para famílias",
    texto:
      "Consulta gratuita e aberta do histórico de qualquer instituição participante, com nível do selo, eixos avaliados e ocorrências registradas.",
    acao: { label: "Consultar instituição", to: "/cidadao/consulta" as const },
  },
  {
    icon: Landmark,
    titulo: "Para prefeituras e redes",
    texto:
      "Painel de gestão da rede conveniada, com métricas de qualidade por unidade e alerta de situações que exigem atenção imediata.",
    acao: { label: "Portal institucional", to: "/portal/login" as const },
  },
  {
    icon: Building2,
    titulo: "Para instituições",
    texto:
      "Um caminho estruturado para demonstrar conformidade a órgãos fiscalizadores, fortalecer a reputação junto às famílias e evoluir de nível a cada ciclo de avaliação.",
    acao: { label: "Portal institucional", to: "/portal/login" as const },
  },
];

const razoesBlockchain = [
  {
    icon: Lock,
    titulo: "Histórico que não se apaga",
    texto:
      "Diferente de um banco de dados comum, o registro não pode ser alterado sem deixar evidência. Um selo revogado continua na história da instituição.",
  },
  {
    icon: Megaphone,
    titulo: "Denúncia anônima e rastreável",
    texto:
      "O denunciante não é identificado, mas recebe um comprovante próprio de que o apontamento foi registrado, e a instituição não consegue fazê-lo desaparecer.",
  },
  {
    icon: FileWarning,
    titulo: "Prova de que o dever foi cumprido",
    texto:
      "O comprovante de notificação serve como evidência de que a comunicação obrigatória prevista em lei foi de fato realizada.",
  },
];

/* -------------------------------------------------------------------- home */

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main id="conteudo">
        {/* ---------------------------------------------------------- hero */}
        <section className="relative overflow-hidden border-b bg-secondary/30">
          <TramaInstitucional className="pointer-events-none absolute inset-0 text-primary/[0.06]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:py-24">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-brand-teal/30 bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-teal">
                <Sparkles className="size-3.5" aria-hidden />
                Certificação de proteção infantojuvenil
              </p>

              <h1 className="mt-6 text-4xl font-bold leading-[1.1] text-primary sm:text-5xl lg:text-[3.4rem]">
                Nenhuma família deveria escolher no escuro.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/80">
                O SIS certifica escolas, creches, clínicas, clubes, parques, cursos e projetos
                sociais quanto à segurança e à adequação do ambiente para crianças e adolescentes,
                e publica esse histórico de forma aberta e auditável.
              </p>

              <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
                Quando falamos da segurança de uma criança, transparência não deveria ser um
                diferencial. Deveria ser um direito.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link to="/cidadao/consulta">
                    <Search className="size-4" aria-hidden /> Consultar uma instituição
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="w-full bg-card sm:w-auto">
                  <Link to="/cidadao/denuncia">
                    <Megaphone className="size-4" aria-hidden /> Registrar uma denúncia
                  </Link>
                </Button>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-4 border-t pt-6 text-sm">
                {[
                  { k: "6 eixos", v: "avaliados por visita técnica" },
                  { k: "12 meses", v: "de validade, com renovação" },
                  { k: "3 níveis", v: "Bronze, Prata e Ouro" },
                ].map((s) => (
                  <div key={s.k}>
                    <dt className="text-xl font-bold text-primary">{s.k}</dt>
                    <dd className="mt-0.5 text-xs leading-snug text-muted-foreground">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative">
              {/* Elemento de LCP da home: carrega com prioridade, nunca lazy.
                  Sem rosto identificável, conforme public/imagens/README.md. */}
              <img
                src="/imagens/hero-instituicao.webp"
                alt="Uma responsável e duas crianças de uniforme, vistos de costas, entram pelo portão de uma escola infantil arborizada. À esquerda, uma rampa de acessibilidade com corrimão dá acesso à entrada."
                className="w-full rounded-xl border bg-card object-cover shadow-sm"
                width={1448}
                height={1086}
                loading="eager"
                fetchPriority="high"
              />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ o problema */}
        <section id="a-iniciativa" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="O problema"
            icon={FileWarning}
            title="Confiança, hoje, é construída no escuro"
            description="Todos os anos são registrados no Brasil casos de negligência, maus-tratos e violação de direitos de crianças e adolescentes. Ainda assim, não existe uma forma padronizada e confiável de verificar se uma instituição oferece um ambiente seguro, acessível e adequado."
          />

          {/*
            TODO(dados): esta seção ganha muito com números oficiais citáveis.
            Sugestão de fontes para o grupo levantar e inserir aqui, sempre com
            link e ano da publicação:
              · Disque 100 / Ouvidoria Nacional de Direitos Humanos — denúncias por ano
              · SINAN / Ministério da Saúde — notificações de violência infantil
              · Censo Escolar / INEP — acessibilidade em unidades de ensino
            Não inserir estimativa sem fonte: número sem referência derruba a
            credibilidade da apresentação inteira.
          */}

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {publicosAfetados.map((p) => (
              <article key={p.titulo} className="rounded-lg border bg-card p-7">
                <p.icon className="size-7 text-brand-teal" aria-hidden />
                <h3 className="mt-5 text-lg font-bold text-primary">{p.titulo}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{p.texto}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- como funciona */}
        <section id="como-funciona" className="border-y bg-secondary/40 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Como funciona"
              icon={ClipboardCheck}
              title="Da visita técnica à consulta pública"
              description="Um processo com etapas definidas, feito por profissionais credenciados e registrado a cada passo."
            />

            {/* Linha do tempo: a régua contínua atrás dos marcadores comunica
                sequência melhor do que cinco cartões soltos lado a lado. */}
            <ol className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
              <span
                aria-hidden
                className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block"
              />
              {etapas.map((e, i) => (
                <li key={e.titulo} className="relative">
                  <div className="flex items-center gap-3 lg:block">
                    <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full border-2 border-brand-teal/25 bg-card text-brand-teal">
                      <e.icon className="size-5" aria-hidden />
                    </span>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal lg:mt-4">
                      Etapa {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-primary lg:mt-1.5">{e.titulo}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{e.texto}</p>
                </li>
              ))}
            </ol>

            {/* Os seis eixos avaliados. */}
            <div className="mt-12 rounded-lg border bg-card p-7 sm:p-9">
              <h3 className="text-xl font-bold text-primary">Os seis eixos avaliados</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Cada eixo recebe uma nota de 0 a 100, sempre ancorada em norma já existente: a
                plataforma não inventa exigência nova.
              </p>
              <ul className="mt-7 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {eixos.map((e) => (
                  <li key={e.nome} className="border-l-2 border-brand-teal/40 pl-4">
                    <p className="font-semibold text-foreground">{e.nome}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{e.base}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------- selos */}
        <section id="selos" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Os selos"
            icon={ShieldCheck}
            title="Um selo que incentiva evolução, não só aprovação"
            description="O nível reflete a pontuação obtida. Como a certificação vale 12 meses e exige nova avaliação, a instituição precisa sustentar o padrão ao longo do tempo, e pode subir de nível a cada ciclo."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {niveis.map((n) => (
              <article
                key={n.nivel}
                className="flex flex-col items-center rounded-lg border bg-card p-8 text-center"
              >
                <Seal nivel={n.nivel} className="size-40" />
                <h3 className="mt-5 text-xl font-bold text-primary">Selo {n.nivel}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  {n.faixa}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{n.resumo}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-lg border bg-secondary/40 p-7 sm:p-9">
            <div className="flex items-start gap-3">
              <Accessibility className="mt-0.5 size-6 shrink-0 text-brand-amber" aria-hidden />
              <div>
                <h3 className="text-xl font-bold text-primary">Subselos temáticos</h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                  Além do nível principal, a instituição pode conquistar reconhecimentos específicos
                  por boas práticas, especialmente em inclusão e acessibilidade.
                </p>
              </div>
            </div>
            <ul className="mt-7 grid gap-5 sm:grid-cols-2">
              {subselos.map((s) => (
                <li key={s.nome} className="flex items-start gap-4 rounded-md border bg-card p-5">
                  <SubseloBadge nome={s.nome} size={64} decorativa />
                  <div>
                    <p className="font-semibold text-foreground">{s.nome}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 flex items-start justify-center gap-2 text-center text-sm text-muted-foreground">
            <CalendarClock className="mt-0.5 size-4 shrink-0" aria-hidden />
            Toda certificação vale 12 meses e só é mantida mediante nova avaliação presencial.
          </p>
        </section>

        {/* -------------------------------------------------- base normativa */}
        <section
          id="base-normativa"
          className="border-y bg-brand-navy-deep py-20 text-primary-foreground"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mx-auto max-w-2xl text-center">
              <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-star">
                <Scale className="size-4" aria-hidden />
                Base normativa
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Critérios ancorados em normas que já existem
              </h2>
              <p className="mt-4 text-base leading-relaxed text-primary-foreground/75 sm:text-lg">
                O SIS não cria uma exigência paralela. Os parâmetros de avaliação partem da
                legislação brasileira vigente e de recomendações de instituições de referência no
                cuidado com o público infantojuvenil.
              </p>
            </div>

            <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  sigla: "ECA",
                  nome: "Estatuto da Criança e do Adolescente",
                  desc: "Proteção integral, dever de comunicar suspeita de maus-tratos e canais de escuta.",
                },
                {
                  sigla: "LGPD",
                  nome: "Lei Geral de Proteção de Dados",
                  desc: "Tratamento de dados de crianças e adolescentes sempre em seu melhor interesse.",
                },
                {
                  sigla: "CF/88",
                  nome: "Constituição Federal",
                  desc: "Prioridade absoluta dos direitos da criança e do adolescente.",
                },
                {
                  sigla: "ANVISA",
                  nome: "Vigilância Sanitária",
                  desc: "Condições de higiene, alimentação e salubridade do ambiente.",
                },
                {
                  sigla: "CBM",
                  nome: "Corpo de Bombeiros",
                  desc: "Prevenção de incêndio, rotas de fuga e segurança predial.",
                },
                {
                  sigla: "UNICEF",
                  nome: "Recomendações UNICEF",
                  desc: "Referências internacionais de ambiente protetor e escuta infantil.",
                },
              ].map((n) => (
                <li
                  key={n.sigla}
                  className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/[0.06] p-6"
                >
                  <p className="text-lg font-bold text-brand-star">{n.sigla}</p>
                  <p className="mt-1 text-sm font-semibold">{n.nome}</p>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/70">
                    {n.desc}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------ por que blockchain */}
        <section id="blockchain" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Por que blockchain"
            icon={Blocks}
            title="Confiança precisa ser verificável, não prometida"
            description="A tecnologia aqui não é enfeite; ela resolve um problema concreto de quem fiscaliza: garantir que o histórico de uma instituição não possa ser convenientemente reescrito."
          />

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {razoesBlockchain.map((r) => (
              <article key={r.titulo} className="rounded-lg border bg-card p-7">
                <r.icon className="size-7 text-brand-teal" aria-hidden />
                <h3 className="mt-5 text-lg font-bold text-primary">{r.titulo}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{r.texto}</p>
              </article>
            ))}
          </div>

          {/* Cadeia de registros ilustrativa. */}
          <div className="mt-10 rounded-lg border bg-card p-7 sm:p-9">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Exemplo de cadeia de registros
            </p>
            <ol className="mt-5 space-y-1">
              {[
                { n: "#10521", t: "Certificação emitida (nível Ouro)", h: "0x8f2a…c41d" },
                { n: "#10612", t: "Denúncia registrada de forma anônima", h: "0xbe45…2a09" },
                { n: "#10688", t: "Denúncia apurada e resultado publicado", h: "0x71c8…40ab" },
              ].map((b, i, arr) => (
                <li key={b.n}>
                  <div className="flex items-center gap-4 rounded-md border bg-background p-4">
                    <Blocks className="size-5 shrink-0 text-brand-teal" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="font-mono text-xs text-muted-foreground">Bloco {b.n}</p>
                      <p className="truncate text-sm font-medium text-foreground">{b.t}</p>
                    </div>
                    <code className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:block">
                      {b.h}
                    </code>
                  </div>
                  {i < arr.length - 1 && (
                    <Link2 className="mx-auto my-1 size-4 rotate-90 text-border" aria-hidden />
                  )}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------- para quem */}
        <section id="para-quem" className="border-y bg-secondary/40 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Para quem"
              icon={Users}
              title="Três públicos, um mesmo registro"
              description="O mesmo histórico auditável atende quem escolhe, quem fiscaliza e quem quer provar que faz bem-feito."
            />

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {paraQuem.map((p) => (
                <article key={p.titulo} className="flex flex-col rounded-lg border bg-card p-7">
                  <p.icon className="size-7 text-brand-teal" aria-hidden />
                  <h3 className="mt-5 text-lg font-bold text-primary">{p.titulo}</h3>
                  <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {p.texto}
                  </p>
                  <Link
                    to={p.acao.to}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {p.acao.label} <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- transparência */}
        <section id="transparencia" className="mx-auto max-w-4xl px-4 py-20 sm:px-6">
          <SectionHeading
            eyebrow="Transparência"
            icon={Scale}
            title="O que ainda não podemos afirmar"
            description="Um projeto que cobra transparência das instituições precisa começar sendo transparente sobre os próprios limites."
          />

          <div className="mt-12 space-y-4">
            {[
              {
                t: "Nenhuma lei obriga a contratar certificação",
                d: "Nenhum selo de proteção infantil é obrigatório no Brasil. A legislação cria dever de agir e de comunicar, não dever de comprar. Somos uma forma de cumprir e comprovar esse dever, mas não a única.",
              },
              {
                t: "O modelo jurídico ainda está em validação",
                d: "O desenho de financiamento e a estrutura de responsabilidade precisam ser validados com assessoria jurídica antes de qualquer contratação real.",
              },
              {
                t: "Este portal é um protótipo",
                d: "As instituições, notas, avaliadores e registros exibidos aqui são fictícios e existem apenas para demonstrar o funcionamento da plataforma.",
              },
            ].map((item) => (
              <div
                key={item.t}
                className="rounded-lg border-l-4 border-l-brand-amber bg-card p-6 shadow-sm"
              >
                <h3 className="text-base font-bold text-primary">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------- cta final */}
        <section className="border-t bg-primary py-16 text-primary-foreground">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Transformar confiança em algo verificável
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
              Consulte o histórico de uma instituição ou conheça o portal de gestão para prefeituras
              e redes que respondem por várias unidades.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                <Link to="/cidadao/consulta">
                  <Search className="size-4" aria-hidden /> Consultar instituição
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
              >
                <Link to="/portal/login">
                  <Building2 className="size-4" aria-hidden /> Portal institucional
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
