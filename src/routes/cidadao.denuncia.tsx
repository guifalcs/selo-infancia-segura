import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Send,
  EyeOff,
  Blocks,
  Scale,
  Phone,
  ShieldAlert,
  ShieldCheck,
  Copy,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ANO_DE_REFERENCIA,
  institutions,
  naturezasDeDenuncia,
  proximoProtocolo,
} from "@/lib/mock-data";

export const Route = createFileRoute("/cidadao/denuncia")({
  head: () => ({
    meta: [
      { title: "Canal de denúncia | SIS" },
      {
        name: "description",
        content:
          "Canal anônimo para registrar irregularidades em instituições que atendem crianças e adolescentes. O registro é imutável e rastreável.",
      },
      { property: "og:title", content: "Canal de denúncia | SIS" },
      {
        property: "og:description",
        content: "Registro anônimo, imutável e rastreável de irregularidades.",
      },
    ],
  }),
  component: Denuncia,
});

const garantias = [
  {
    icon: EyeOff,
    titulo: "Anônimo por padrão",
    texto:
      "Não pedimos nome, documento nem e-mail. Nenhum dado que identifique quem denuncia é coletado ou registrado.",
  },
  {
    icon: Blocks,
    titulo: "Registro que não some",
    texto:
      "A denúncia é gravada na cadeia da instituição. Nem a instituição nem a plataforma conseguem apagá-la depois.",
  },
  {
    icon: Scale,
    titulo: "Encaminhamento devido",
    texto:
      "A gravidade é definida na triagem do SIS, não por você: basta relatar o que viu. Denúncias com indício de crime são encaminhadas aos órgãos competentes, e o resultado da apuração também é publicado.",
  },
  {
    icon: ShieldCheck,
    titulo: "Publicação só após triagem",
    texto:
      "O relato entra na cadeia no momento em que você envia, mas a ficha pública da instituição só passa a exibi-lo depois da triagem. Isso protege quem denuncia de ver o caso arquivado por vício de forma, e a instituição de carregar publicamente uma acusação ainda não apurada.",
  },
];

function Denuncia() {
  const [enviado, setEnviado] = useState(false);
  const [inst, setInst] = useState("");
  const [cat, setCat] = useState("");
  const [desc, setDesc] = useState("");
  const [copiado, setCopiado] = useState(false);

  // Protocolo fictício, só para ilustrar o comprovante do denunciante.
  const [protocolo, setProtocolo] = useState("");
  /** Quantos comprovantes já saíram nesta visita, para não repetir número. */
  const [emitidos, setEmitidos] = useState(0);

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    /* Mesmo formato da fila do portal (`DEN-aaaa-nnnn`). Um protocolo que só o
       comprovante entende seria inútil justamente para quem precisa cobrar
       andamento — e `SIS-aaaa-...` colidiria com o token de certificação. */
    setProtocolo(proximoProtocolo(ANO_DE_REFERENCIA, emitidos));
    setEmitidos((n) => n + 1);
    setCopiado(false);
    setEnviado(true);
  };

  const copiarProtocolo = async () => {
    try {
      await navigator.clipboard.writeText(protocolo);
      setCopiado(true);
    } catch {
      // Navegador sem permissão de área de transferência: o número segue visível
      // na tela para cópia manual, que é o que importa.
      setCopiado(false);
    }
  };

  const novaDenuncia = () => {
    setEnviado(false);
    setInst("");
    setCat("");
    setDesc("");
    setCopiado(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />

      <main id="conteudo" className="flex-1">
        <div className="border-b bg-secondary/40">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <nav aria-label="Trilha de navegação" className="text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary hover:underline underline-offset-4">
                Início
              </Link>
              <span aria-hidden className="mx-2">
                /
              </span>
              <span className="text-foreground">Canal de denúncia</span>
            </nav>

            <h1 className="mt-4 text-3xl font-bold text-primary sm:text-4xl">Canal de denúncia</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Registre de forma anônima uma irregularidade observada em instituição participante. O
              apontamento passa a fazer parte do histórico público e auditável da instituição.
            </p>
          </div>
        </div>

        {/* Aviso de emergência: precede o formulário de propósito. Quem chega
            aqui em situação de risco imediato precisa ver isso primeiro. */}
        <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">
          <div
            role="alert"
            className="flex flex-col gap-4 rounded-lg border-l-4 border-l-destructive bg-destructive/5 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="flex items-start gap-3 text-sm leading-relaxed">
              <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
              <span>
                <strong className="font-semibold text-foreground">
                  Há risco imediato a uma criança ou adolescente?
                </strong>{" "}
                <span className="text-muted-foreground">
                  Este canal não é serviço de emergência e este portal é um protótipo. Acione agora
                  os canais oficiais.
                </span>
              </span>
            </p>
            <p className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-1 text-sm font-semibold text-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-4 text-destructive" aria-hidden /> Disque 100
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-4 text-destructive" aria-hidden /> 190
              </span>
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.35fr_1fr]">
          {/* Formulário / comprovante. */}
          <div>
            {enviado ? (
              <div className="rounded-lg border bg-card p-8 text-center">
                <div className="mx-auto grid size-14 place-items-center rounded-full bg-success/10 text-success">
                  <CheckCircle2 className="size-8" aria-hidden />
                </div>
                <h2 className="mt-5 text-2xl font-bold text-primary">Denúncia registrada</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  Um registro imutável foi criado na cadeia da instituição. Guarde o protocolo
                  abaixo: é a sua prova de que o apontamento foi feito, e ele não identifica você.
                </p>

                <div className="mx-auto mt-6 max-w-sm rounded-lg border bg-secondary/40 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                    Protocolo do denunciante
                  </p>
                  <p className="mt-2 font-mono text-lg font-semibold text-primary">{protocolo}</p>
                  {/* Botão de verdade: o ícone de cópia antes era decorativo e
                      não copiava nada, o que é cruel com quem precisa guardar
                      justamente este número. */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={copiarProtocolo}
                  >
                    {copiado ? (
                      <>
                        <Check className="size-4" aria-hidden /> Protocolo copiado
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" aria-hidden /> Copiar protocolo
                      </>
                    )}
                  </Button>
                </div>

                <Button className="mt-7" variant="outline" onClick={novaDenuncia}>
                  Registrar outra denúncia
                </Button>
              </div>
            ) : (
              <form onSubmit={enviar} className="rounded-lg border bg-card p-6 sm:p-8">
                <h2 className="text-xl font-bold text-primary">Dados da ocorrência</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Todos os campos são obrigatórios. Não inclua seu nome ou contato.
                </p>

                <div className="mt-7 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="instituicao">Instituição relacionada</Label>
                    <Select value={inst} onValueChange={setInst} required>
                      <SelectTrigger id="instituicao">
                        <SelectValue placeholder="Selecione a instituição..." />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map((i) => (
                          <SelectItem key={i.id} value={i.id}>
                            {i.nome}, {i.cidade}/{i.uf}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="categoria">Natureza da irregularidade</Label>
                    <Select value={cat} onValueChange={setCat} required>
                      <SelectTrigger id="categoria">
                        <SelectValue placeholder="Selecione a natureza..." />
                      </SelectTrigger>
                      {/* Mesma lista fechada que a triagem usa para o piso de
                          gravidade: se o canal oferecesse outras naturezas, o
                          piso automático não teria como ser aplicado. */}
                      <SelectContent>
                        {naturezasDeDenuncia.map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição do ocorrido</Label>
                    <Textarea
                      id="descricao"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      rows={7}
                      required
                      placeholder="Descreva o que foi observado, quando ocorreu e em que local da instituição. Evite incluir nomes de crianças."
                      aria-describedby="ajuda-descricao"
                    />
                    <p
                      id="ajuda-descricao"
                      className="text-xs leading-relaxed text-muted-foreground"
                    >
                      Quanto mais objetiva a descrição, mais rápida a apuração. Não escreva
                      informações que identifiquem você ou uma criança específica.
                    </p>
                  </div>
                </div>

                <Button type="submit" size="lg" className="mt-8 w-full">
                  <Send className="size-4" aria-hidden /> Enviar denúncia anônima
                </Button>

                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Protótipo demonstrativo: nada é enviado ou armazenado de fato.
                </p>
              </form>
            )}
          </div>

          {/* Garantias. */}
          <aside aria-label="Como sua denúncia é tratada" className="space-y-4">
            <h2 className="text-lg font-bold text-primary">Como sua denúncia é tratada</h2>
            {garantias.map((g) => (
              <div key={g.titulo} className="rounded-lg border bg-card p-5">
                <g.icon className="size-5 text-brand-teal" aria-hidden />
                <h3 className="mt-3 text-sm font-bold text-foreground">{g.titulo}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{g.texto}</p>
              </div>
            ))}
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
