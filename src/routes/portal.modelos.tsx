import { createFileRoute } from "@tanstack/react-router";
import {
  Stamp,
  Plus,
  Pencil,
  Award,
  ShieldCheck,
  CheckCircle2,
  Archive,
  Send,
  Building2,
  AlertTriangle,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, Vazio, AvisoDemo, BarraDeNota } from "@/components/PortalUI";
import { SealChip } from "@/components/Seal";
import { SubseloBadge } from "@/components/SubseloBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useCatalogo, type Emissao, type NovoModelo } from "@/lib/certificacoes-store";
import {
  avaliadores,
  eixosComPesoIgual,
  faixasPadrao,
  institutionPorId,
  nivelPorFaixa,
  notaPonderada,
  subselos,
  tiposDeInstituicao,
  type EixoDoModelo,
  type Institution,
  type ModeloCertificacao,
  type Nivel,
  type TipoInstituicao,
} from "@/lib/mock-data";
import type { Escopo } from "@/lib/portal-access";

export const Route = createFileRoute("/portal/modelos")({
  head: () => ({
    meta: [
      { title: "Modelos de selo | Portal SIS" },
      {
        name: "description",
        content: "Catálogo de modelos de certificação e atribuição às instituições.",
      },
      { property: "og:title", content: "Modelos de selo | Portal SIS" },
      {
        property: "og:description",
        content: "Onde a equipe SIS define o que cada selo exige antes de emiti-lo.",
      },
    ],
  }),
  component: Modelos,
});

/* -------------------------------------------------------------------------- */
/* Formulário do modelo                                                       */
/* -------------------------------------------------------------------------- */

/** Estado editável do formulário. Requisitos viram texto: uma linha por item. */
type Rascunho = Omit<NovoModelo, "requisitos"> & { requisitos: string };

const rascunhoVazio = (): Rascunho => ({
  nome: "",
  codigo: "",
  descricao: "",
  tiposElegiveis: [],
  eixos: eixosComPesoIgual(),
  notaMinima: 60,
  faixas: faixasPadrao(),
  validadeMeses: 12,
  requisitos: "",
  subselosElegiveis: [],
  status: "Rascunho",
});

const paraRascunho = (m: ModeloCertificacao): Rascunho => ({
  nome: m.nome,
  codigo: m.codigo,
  descricao: m.descricao,
  tiposElegiveis: [...m.tiposElegiveis],
  eixos: m.eixos.map((e) => ({ ...e })),
  notaMinima: m.notaMinima,
  faixas: m.faixas.map((f) => ({ ...f })),
  validadeMeses: m.validadeMeses,
  requisitos: m.requisitos.join("\n"),
  subselosElegiveis: [...m.subselosElegiveis],
  status: m.status,
});

/**
 * Erros de preenchimento.
 *
 * A régua de um selo é o produto: um modelo com pesos que não somam 100 ou com
 * faixas embaralhadas produziria notas que ninguém consegue explicar à família
 * que consulta o selo. Por isso a validação bloqueia, em vez de só avisar.
 */
function validar(r: Rascunho): string[] {
  const erros: string[] = [];
  const soma = r.eixos.reduce((s, e) => s + e.peso, 0);

  if (!r.nome.trim()) erros.push("Dê um nome ao modelo.");
  if (!/^[A-Z0-9-]{3,12}$/.test(r.codigo.trim()))
    erros.push("O código deve ter de 3 a 12 caracteres, só letras maiúsculas, números e hífen.");
  if (!r.descricao.trim()) erros.push("Descreva a que tipo de ambiente o modelo se aplica.");
  if (r.tiposElegiveis.length === 0) erros.push("Marque ao menos um tipo de instituição elegível.");
  if (soma !== 100) erros.push(`Os pesos dos eixos somam ${soma}. Precisam somar 100.`);
  if (r.notaMinima < 1 || r.notaMinima > 100) erros.push("A nota mínima fica entre 1 e 100.");
  if (r.validadeMeses < 1 || r.validadeMeses > 60)
    erros.push("A validade fica entre 1 e 60 meses.");

  const [ouro, prata, bronze] = r.faixas;
  if (!(ouro.minimo > prata.minimo && prata.minimo > bronze.minimo))
    erros.push("As faixas precisam ser crescentes: Bronze < Prata < Ouro.");
  if (bronze.minimo < r.notaMinima)
    erros.push("A faixa Bronze não pode começar abaixo da nota mínima de aprovação.");
  if (!r.requisitos.split("\n").some((l) => l.trim()))
    erros.push("Liste ao menos um documento ou evidência exigida.");

  return erros;
}

function CampoNumero({
  id,
  label,
  valor,
  min,
  max,
  sufixo,
  onChange,
}: {
  id: string;
  label: string;
  valor: number;
  min: number;
  max: number;
  sufixo?: string;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <div className="mt-1 flex items-center gap-2">
        <Input
          id={id}
          type="number"
          min={min}
          max={max}
          value={valor}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-9"
        />
        {sufixo && <span className="shrink-0 text-xs text-muted-foreground">{sufixo}</span>}
      </div>
    </div>
  );
}

function FormularioDeModelo({
  inicial,
  rotuloEnvio,
  onSalvar,
  onCancelar,
}: {
  inicial: Rascunho;
  rotuloEnvio: string;
  onSalvar: (dados: NovoModelo) => void;
  onCancelar: () => void;
}) {
  const [r, setR] = useState<Rascunho>(inicial);
  const [tentou, setTentou] = useState(false);

  const erros = validar(r);
  const somaPesos = r.eixos.reduce((s, e) => s + e.peso, 0);

  const alterar = <K extends keyof Rascunho>(campo: K, valor: Rascunho[K]) =>
    setR((atual) => ({ ...atual, [campo]: valor }));

  const alterarPeso = (nome: string, peso: number) =>
    setR((atual) => ({
      ...atual,
      eixos: atual.eixos.map((e) => (e.nome === nome ? { ...e, peso } : e)),
    }));

  const alterarFaixa = (nivel: Nivel, minimo: number) =>
    setR((atual) => ({
      ...atual,
      faixas: atual.faixas.map((f) => (f.nivel === nivel ? { ...f, minimo } : f)),
    }));

  const alternar = <T extends string>(lista: T[], item: T): T[] =>
    lista.includes(item) ? lista.filter((i) => i !== item) : [...lista, item];

  const enviar = (e: React.FormEvent) => {
    e.preventDefault();
    setTentou(true);
    if (erros.length) return;
    onSalvar({
      ...r,
      nome: r.nome.trim(),
      codigo: r.codigo.trim().toUpperCase(),
      descricao: r.descricao.trim(),
      requisitos: r.requisitos
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={enviar} className="space-y-6">
      {/* Identificação -------------------------------------------------- */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold">Identificação</legend>

        <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
          <div>
            <Label htmlFor="nome" className="text-xs">
              Nome do selo
            </Label>
            <Input
              id="nome"
              value={r.nome}
              onChange={(e) => alterar("nome", e.target.value)}
              placeholder="Selo Infância Segura · Educação Básica"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="codigo" className="text-xs">
              Código no token
            </Label>
            <Input
              id="codigo"
              value={r.codigo}
              onChange={(e) => alterar("codigo", e.target.value.toUpperCase())}
              placeholder="SIS-EB"
              className="mt-1 font-mono"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="descricao" className="text-xs">
            Descrição
          </Label>
          <Textarea
            id="descricao"
            value={r.descricao}
            onChange={(e) => alterar("descricao", e.target.value)}
            placeholder="A que ambientes este modelo se aplica e o que ele verifica."
            rows={2}
            className="mt-1"
          />
        </div>

        <div>
          <p className="text-xs font-medium">Tipos de instituição elegíveis</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {tiposDeInstituicao.map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={r.tiposElegiveis.includes(t)}
                  onCheckedChange={() =>
                    alterar("tiposElegiveis", alternar<TipoInstituicao>(r.tiposElegiveis, t))
                  }
                />
                {t}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {/* Régua de avaliação --------------------------------------------- */}
      <fieldset className="space-y-4 border-t pt-5">
        <legend className="text-sm font-semibold">Régua de avaliação</legend>
        <p className="text-xs leading-relaxed text-muted-foreground">
          O peso define quanto cada eixo influencia a nota final. Numa creche o ambiente físico
          costuma pesar mais; num curso online, a proteção de dados.
        </p>

        <ul className="space-y-2">
          {r.eixos.map((e) => (
            <li key={e.nome} className="flex items-center gap-3">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm">{e.nome}</span>
                <span className="block truncate text-[11px] text-muted-foreground">{e.base}</span>
              </span>
              <Input
                type="number"
                min={0}
                max={100}
                value={e.peso}
                onChange={(ev) => alterarPeso(e.nome, Number(ev.target.value))}
                aria-label={`Peso de ${e.nome}`}
                className="h-9 w-20"
              />
              <span className="w-4 text-xs text-muted-foreground">%</span>
            </li>
          ))}
        </ul>

        <p
          className={`text-xs font-medium ${somaPesos === 100 ? "text-success" : "text-destructive"}`}
        >
          Soma dos pesos: {somaPesos}% {somaPesos === 100 ? "· fechado" : "· precisa somar 100%"}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CampoNumero
            id="nota-minima"
            label="Nota mínima"
            valor={r.notaMinima}
            min={1}
            max={100}
            sufixo="pts"
            onChange={(n) => alterar("notaMinima", n)}
          />
          {r.faixas.map((f) => (
            <CampoNumero
              key={f.nivel}
              id={`faixa-${f.nivel}`}
              label={`${f.nivel} a partir de`}
              valor={f.minimo}
              min={0}
              max={100}
              sufixo="pts"
              onChange={(n) => alterarFaixa(f.nivel, n)}
            />
          ))}
        </div>
      </fieldset>

      {/* Vigência e evidências ------------------------------------------ */}
      <fieldset className="space-y-4 border-t pt-5">
        <legend className="text-sm font-semibold">Vigência e evidências</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <CampoNumero
            id="validade"
            label="Validade do selo"
            valor={r.validadeMeses}
            min={1}
            max={60}
            sufixo="meses"
            onChange={(n) => alterar("validadeMeses", n)}
          />
          <div>
            <Label htmlFor="status" className="text-xs">
              Situação do modelo
            </Label>
            <Select
              value={r.status}
              onValueChange={(v) => alterar("status", v as ModeloCertificacao["status"])}
            >
              <SelectTrigger id="status" className="mt-1 h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Rascunho">Rascunho: ainda não emite</SelectItem>
                <SelectItem value="Ativo">Ativo: disponível para emissão</SelectItem>
                <SelectItem value="Arquivado">Arquivado: só histórico</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="requisitos" className="text-xs">
            Documentos e evidências exigidas: um por linha
          </Label>
          <Textarea
            id="requisitos"
            value={r.requisitos}
            onChange={(e) => alterar("requisitos", e.target.value)}
            placeholder={"Auto de Vistoria do Corpo de Bombeiros vigente\nAlvará sanitário"}
            rows={5}
            className="mt-1"
          />
        </div>

        <div>
          <p className="text-xs font-medium">Subselos que este modelo pode conceder</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {subselos.map((s) => (
              <label key={s.nome} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={r.subselosElegiveis.includes(s.nome)}
                  onCheckedChange={() =>
                    alterar("subselosElegiveis", alternar(r.subselosElegiveis, s.nome))
                  }
                />
                <SubseloBadge nome={s.nome} size={28} decorativa />
                {s.nome}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      {tentou && erros.length > 0 && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm">
          <p className="flex items-center gap-2 font-semibold text-destructive">
            <AlertTriangle className="size-4" aria-hidden /> Ajuste antes de salvar
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-foreground">
            {erros.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit">
          <Stamp className="size-4" aria-hidden /> {rotuloEnvio}
        </Button>
      </DialogFooter>
    </form>
  );
}

function DialogoDeModelo({ modelo }: { modelo?: ModeloCertificacao }) {
  const { criarModelo, atualizarModelo } = useCatalogo();
  const [aberto, setAberto] = useState(false);
  const editando = Boolean(modelo);

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger asChild>
        {editando ? (
          <Button size="sm" variant="outline">
            <Pencil className="size-4" aria-hidden /> Editar
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4" aria-hidden /> Novo modelo
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editando ? `Editar ${modelo!.nome}` : "Novo modelo de selo"}</DialogTitle>
          <DialogDescription>
            {editando
              ? "Editar publica uma nova versão. As emissões já feitas continuam válidas sob a versão anterior."
              : "Defina uma vez o que o selo exige. Toda instituição aprovada nesta régua recebe a mesma certificação, com os próprios dados."}
          </DialogDescription>
        </DialogHeader>

        {/* `key` remonta o formulário a cada abertura, para não guardar o que foi
            digitado e descartado numa tentativa anterior. */}
        <FormularioDeModelo
          key={aberto ? "aberto" : "fechado"}
          inicial={modelo ? paraRascunho(modelo) : rascunhoVazio()}
          rotuloEnvio={editando ? "Publicar nova versão" : "Criar modelo"}
          onSalvar={(dados) => {
            if (modelo) atualizarModelo(modelo.id, dados);
            else criarModelo(dados);
            setAberto(false);
          }}
          onCancelar={() => setAberto(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Atribuição do modelo a uma instituição                                     */
/* -------------------------------------------------------------------------- */

function DialogoDeAtribuicao({
  modelo,
  candidatas,
}: {
  modelo: ModeloCertificacao;
  candidatas: Institution[];
}) {
  const { atribuir } = useCatalogo();
  const [aberto, setAberto] = useState(false);
  const [instituicaoId, setInstituicaoId] = useState("");
  const [avaliador, setAvaliador] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [escolhidos, setEscolhidos] = useState<string[]>([]);
  const [notas, setNotas] = useState<Record<string, number>>(() =>
    Object.fromEntries(modelo.eixos.map((e) => [e.nome, 70])),
  );
  // Guardamos o que a emissão de fato registrou, em vez de recalcular na tela:
  // o token e a validade mostrados são os mesmos que foram para o registro.
  const [emitida, setEmitida] = useState<Emissao | null>(null);

  const inst = instituicaoId ? candidatas.find((i) => i.id === instituicaoId) : null;
  const nota = notaPonderada(modelo, notas);
  const nivel = nivelPorFaixa(modelo, nota);
  const podeEmitir = Boolean(inst) && Boolean(avaliador) && nivel !== null;

  const limpar = () => {
    setInstituicaoId("");
    setAvaliador("");
    setObservacoes("");
    setEscolhidos([]);
    setNotas(Object.fromEntries(modelo.eixos.map((e) => [e.nome, 70])));
    setEmitida(null);
  };

  return (
    <Dialog
      open={aberto}
      onOpenChange={(v) => {
        setAberto(v);
        if (!v) limpar();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" disabled={modelo.status !== "Ativo"}>
          <Send className="size-4" aria-hidden /> Atribuir
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Atribuir {modelo.nome}</DialogTitle>
          <DialogDescription>
            Lance as notas apuradas na avaliação presencial. O nível sai da régua do modelo, não de
            uma escolha manual: a mesma nota produz o mesmo selo em qualquer instituição.
          </DialogDescription>
        </DialogHeader>

        {emitida ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-success/30 bg-success/10 p-4 text-sm">
              <p className="flex items-center gap-2 font-semibold text-success">
                <CheckCircle2 className="size-4" aria-hidden /> Certificação atribuída a{" "}
                {inst?.nome}
              </p>
              <p className="mt-2 font-mono text-xs">
                token {emitida.token} · hash {emitida.hash}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Nível {emitida.nivel} com {emitida.pontuacao} pontos, emitido em {emitida.emissao} e
                válido até {emitida.validade}. Numa emissão real, este token passaria a aparecer na
                ficha pública da instituição.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={limpar}>
                Atribuir a outra instituição
              </Button>
              <Button onClick={() => setAberto(false)}>Concluir</Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="instituicao" className="text-xs">
                  Instituição avaliada
                </Label>
                <Select value={instituicaoId} onValueChange={setInstituicaoId}>
                  <SelectTrigger id="instituicao" className="mt-1">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidatas.map((i) => (
                      <SelectItem key={i.id} value={i.id}>
                        {i.nome} · {i.cidade}-{i.uf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Só aparecem os tipos elegíveis: {modelo.tiposElegiveis.join(", ")}.
                </p>
              </div>

              <div>
                <Label htmlFor="avaliador" className="text-xs">
                  Avaliador responsável
                </Label>
                <Select value={avaliador} onValueChange={setAvaliador}>
                  <SelectTrigger id="avaliador" className="mt-1">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {avaliadores
                      .filter((a) => a.status === "Ativo")
                      .map((a) => (
                        <SelectItem key={a.registro} value={`${a.nome} · ${a.formacao}`}>
                          {a.nome} · {a.formacao}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium">Notas por eixo</p>
              <ul className="mt-3 space-y-4">
                {modelo.eixos.map((e) => (
                  <li key={e.nome}>
                    <div className="flex items-center gap-3">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm">{e.nome}</span>
                        <span className="block text-[11px] text-muted-foreground">
                          peso {e.peso}% · {e.base}
                        </span>
                      </span>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={notas[e.nome] ?? 0}
                        onChange={(ev) =>
                          setNotas((n) => ({
                            ...n,
                            [e.nome]: Math.max(0, Math.min(100, Number(ev.target.value))),
                          }))
                        }
                        aria-label={`Nota de ${e.nome}`}
                        className="h-9 w-20"
                      />
                    </div>
                    <BarraDeNota nota={notas[e.nome] ?? 0} rotulo={e.nome} className="mt-2" />
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Nota final ponderada</p>
                  <p className="text-2xl font-bold text-primary">{nota}/100</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Nível na régua do modelo</p>
                  {nivel ? (
                    <SealChip nivel={nivel} className="mt-1" />
                  ) : (
                    <p className="mt-1 text-sm font-semibold text-destructive">
                      Abaixo do corte de {modelo.notaMinima} pontos
                    </p>
                  )}
                </div>
              </div>
              {!nivel && (
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Sem emissão: a instituição recebe plano de adequação e nova avaliação. Reprovar é
                  um resultado do processo, não uma falha do formulário.
                </p>
              )}
            </div>

            {modelo.subselosElegiveis.length > 0 && (
              <div>
                <p className="text-xs font-medium">Subselos concedidos nesta avaliação</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {modelo.subselosElegiveis.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={escolhidos.includes(s)}
                        onCheckedChange={() =>
                          setEscolhidos((a) =>
                            a.includes(s) ? a.filter((x) => x !== s) : [...a, s],
                          )
                        }
                      />
                      <SubseloBadge nome={s} size={28} decorativa />
                      {s}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="observacoes" className="text-xs">
                Observações do parecer (opcional)
              </Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                rows={2}
                className="mt-1"
              />
            </div>

            <div className="rounded-lg border border-dashed p-4">
              <p className="text-xs font-medium">Evidências exigidas por este modelo</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                {modelo.requisitos.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setAberto(false)}>
                Cancelar
              </Button>
              <Button
                disabled={!podeEmitir}
                onClick={() => {
                  const feita = atribuir({
                    modeloId: modelo.id,
                    instituicaoId,
                    notas,
                    subselos: escolhidos,
                    avaliador,
                    responsavel: "Ana Ribeiro",
                    observacoes,
                  });
                  if (feita) setEmitida(feita);
                }}
              >
                <ShieldCheck className="size-4" aria-hidden /> Registrar na blockchain
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Catálogo                                                                   */
/* -------------------------------------------------------------------------- */

const corDoStatus: Record<ModeloCertificacao["status"], string> = {
  Ativo: "border-success/40 bg-success/10 text-success",
  Rascunho: "border-brand-amber/50 bg-brand-amber/10 text-brand-amber",
  Arquivado: "border-muted-foreground/30 bg-muted text-muted-foreground",
};

function CartaoDeModelo({ modelo, escopo }: { modelo: ModeloCertificacao; escopo: Escopo }) {
  const { mudarStatusModelo, emissoesDoModelo } = useCatalogo();
  const emitidas = emissoesDoModelo(modelo.id);
  const candidatas = escopo.instituicoes.filter((i) => modelo.tiposElegiveis.includes(i.tipo));

  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${corDoStatus[modelo.status]}`}
            >
              {modelo.status}
            </span>
            <Badge variant="outline" className="font-mono">
              {modelo.codigo}
            </Badge>
            <span className="text-[11px] text-muted-foreground">versão {modelo.versao}</span>
          </div>
          <h3 className="mt-2 text-lg font-semibold leading-snug">{modelo.nome}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {modelo.descricao}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <DialogoDeAtribuicao modelo={modelo} candidatas={candidatas} />
          <DialogoDeModelo modelo={modelo} />
          {modelo.status !== "Arquivado" ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => mudarStatusModelo(modelo.id, "Arquivado")}
            >
              <Archive className="size-4" aria-hidden /> Arquivar
            </Button>
          ) : (
            <Button size="sm" variant="ghost" onClick={() => mudarStatusModelo(modelo.id, "Ativo")}>
              <RotateCcw className="size-4" aria-hidden /> Reativar
            </Button>
          )}
        </div>
      </div>

      <dl className="mt-5 grid gap-x-6 gap-y-3 border-t pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {[
          { rotulo: "Aprovação a partir de", valor: `${modelo.notaMinima} pontos` },
          { rotulo: "Validade", valor: `${modelo.validadeMeses} meses` },
          {
            rotulo: "Faixas",
            valor: modelo.faixas.map((f) => `${f.nivel} ${f.minimo}+`).join(" · "),
          },
          {
            rotulo: "Emitidas neste protótipo",
            valor: `${emitidas.length} · ${candidatas.length} elegíveis`,
          },
        ].map((d) => (
          <div key={d.rotulo}>
            <dt className="text-xs text-muted-foreground">{d.rotulo}</dt>
            <dd className="font-semibold">{d.valor}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid gap-5 border-t pt-4 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold">Pesos por eixo</p>
          <ul className="mt-2 space-y-2">
            {modelo.eixos.map((e: EixoDoModelo) => (
              <li key={e.nome}>
                <div className="flex items-baseline justify-between gap-3">
                  <span className="min-w-0 truncate text-xs">{e.nome}</span>
                  <span className="shrink-0 font-mono text-xs font-semibold text-primary">
                    {e.peso}%
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${e.peso}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold">Evidências exigidas</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted-foreground">
              {modelo.requisitos.map((req) => (
                <li key={req}>{req}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold">Aplica-se a</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {modelo.tiposElegiveis.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </div>
          </div>

          {modelo.subselosElegiveis.length > 0 && (
            <div>
              <p className="text-xs font-semibold">Subselos que pode conceder</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {modelo.subselosElegiveis.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 text-xs">
                    <SubseloBadge nome={s} size={32} decorativa /> {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Modelos() {
  return (
    <PortalLayout
      title="Modelos de selo"
      subtitle="Onde a equipe SIS define o que cada certificação exige antes de emiti-la"
      papeis={["admin"]}
    >
      {(escopo) => <Catalogo escopo={escopo} />}
    </PortalLayout>
  );
}

function Catalogo({ escopo }: { escopo: Escopo }) {
  const { modelos, emissoes, restaurarPadrao } = useCatalogo();
  const ativos = modelos.filter((m) => m.status === "Ativo");
  const rascunhos = modelos.filter((m) => m.status === "Rascunho");
  const cobertos = new Set(ativos.flatMap((m) => m.tiposElegiveis));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Indicador icon={Stamp} label="Modelos publicados" valor={ativos.length} tom="green" />
        <Indicador
          icon={Pencil}
          label="Rascunhos"
          valor={rascunhos.length}
          detalhe="Ainda não emitem selo"
          tom="amber"
        />
        <Indicador
          icon={Building2}
          label="Tipos de ambiente cobertos"
          valor={`${cobertos.size}/${tiposDeInstituicao.length}`}
          detalhe="Tipos com ao menos um modelo ativo"
          tom="teal"
        />
        <Indicador
          icon={Award}
          label="Atribuições neste protótipo"
          valor={emissoes.length}
          detalhe="Emissões feitas a partir dos modelos"
        />
      </div>

      <AvisoDemo>
        Um modelo é o desenho do selo — o que ele exige, como se pontua e por quanto tempo vale.
        Publicado o modelo, toda instituição aprovada nessa régua recebe a mesma certificação, com
        as próprias notas. Neste protótipo, criar e atribuir grava só no seu navegador: nada é
        registrado em rede.
      </AvisoDemo>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold">Catálogo de modelos</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="ghost" onClick={restaurarPadrao}>
            <RotateCcw className="size-4" aria-hidden /> Restaurar catálogo padrão
          </Button>
          <DialogoDeModelo />
        </div>
      </div>

      <div className="space-y-4">
        {modelos.map((m) => (
          <CartaoDeModelo key={m.id} modelo={m} escopo={escopo} />
        ))}
      </div>

      <Painel
        titulo="Atribuições feitas nesta sessão"
        descricao="Cada linha é um selo emitido a partir de um modelo, com a versão sob a qual foi avaliado."
      >
        {emissoes.length === 0 ? (
          <Vazio>
            Nenhuma atribuição ainda. Use “Atribuir” em um modelo ativo para emitir uma
            certificação.
          </Vazio>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Instituição</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Nota</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead className="whitespace-nowrap">Emissão · validade</TableHead>
                  <TableHead>Token · hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emissoes.map((e) => {
                  const inst = institutionPorId.get(e.instituicaoId);
                  const modelo = modelos.find((m) => m.id === e.modeloId);
                  return (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{inst?.nome ?? e.instituicaoId}</TableCell>
                      <TableCell className="text-sm">
                        {modelo?.nome ?? e.modeloId}
                        <span className="block text-xs text-muted-foreground">
                          versão {e.modeloVersao}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{e.pontuacao}</TableCell>
                      <TableCell>
                        <SealChip nivel={e.nivel} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs">
                        {e.emissao}
                        <span className="block text-muted-foreground">até {e.validade}</span>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                        {e.token}
                        <span className="block">{e.hash}</span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Painel>
    </div>
  );
}
