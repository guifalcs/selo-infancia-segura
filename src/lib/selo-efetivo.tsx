import { useMemo } from "react";

import { useCatalogo, type Emissao } from "@/lib/certificacoes-store";
import {
  apuracaoDaInstituicao,
  certificacaoDaInstituicao,
  hashDemo,
  modeloPorId,
  nivelDaInstituicao,
  nivelSugerido,
  planoDeAdequacao,
  pontuacaoDaInstituicao,
  proximoNivel,
  registros as registrosDaBase,
  registrosDaInstituicao,
  registrosPublicosDaInstituicao,
  situacaoDaValidade,
  validadeDaInstituicao,
  type Certificacao,
  type Criterio,
  type Institution,
  type ItemPlano,
  type ModeloCertificacao,
  type Nivel,
  type RegistroBlockchain,
  type ResumoDoConjunto,
  type Status,
} from "@/lib/mock-data";

/**
 * Selo efetivo de uma instituição: a base do protótipo mais o que foi emitido
 * nesta sessão.
 *
 * Existe porque emitir tinha de significar algo. Antes, atribuir um selo em
 * /portal/modelos gravava a emissão no navegador e nenhuma outra tela ficava
 * sabendo: a instituição continuava "Pendente" na consulta pública e fora dos
 * indicadores. Uma emissão que só a própria tela vê ensina errado sobre o
 * produto — a promessa do selo é justamente aparecer para quem consulta.
 *
 * Toda tela que precise de nível, nota, validade, certificação ou histórico lê
 * daqui em vez de perguntar à base direto. Ao ligar o backend, o overlay sai e
 * as mesmas funções passam a devolver o dado do servidor.
 */

/** Bloco seguinte ao último da base — as emissões da sessão continuam a cadeia. */
const blocoDepoisDaBase = (deslocamento: number) =>
  `#${10321 + (registrosDaBase.length + deslocamento) * 7}`;

export type Selo = {
  /** Nível do selo vigente. `null` quando não há emissão. */
  nivel: (inst: Institution) => Nivel | null;
  /** Nota apurada na última avaliação fechada. */
  pontuacao: (inst: Institution) => number | null;
  /** Validade da certificação vigente. */
  validade: (inst: Institution) => string | null;
  /** Estágio no ciclo, já considerando emissão feita nesta sessão. */
  status: (inst: Institution) => Status;
  /** Subselos concedidos na certificação vigente. */
  subselos: (inst: Institution) => string[];
  /** Notas por eixo que sustentam o selo vigente. */
  criterios: (inst: Institution) => Criterio[];
  /** Data da avaliação que gerou o selo vigente. */
  ultimaAvaliacao: (inst: Institution) => string;
  /** Certificação vigente, com token e hash. */
  certificacao: (inst: Institution) => Certificacao | null;
  /** Nível que a régua sugere para uma nota apurada sem selo emitido. */
  sugerido: (inst: Institution) => Nivel | null;
  /** Modelo sob o qual o selo vigente foi apurado. */
  modelo: (inst: Institution) => ModeloCertificacao | null;
  /** Plano de adequação, sobre as notas do selo vigente. */
  plano: (inst: Institution) => ItemPlano[];
  /** Próximo nível a alcançar, na régua do modelo do selo vigente. */
  proximoNivel: (inst: Institution) => ReturnType<typeof proximoNivel>;
  /** Histórico completo na cadeia, do mais recente ao mais antigo. */
  registros: (inst: Institution) => RegistroBlockchain[];
  /** Histórico visível na consulta pública. */
  registrosPublicos: (inst: Institution) => RegistroBlockchain[];
  /**
   * Cadeia de um conjunto de instituições, do bloco mais novo ao mais antigo.
   *
   * O livro de registros lia a base direto e por isso não mostrava a emissão
   * feita na demonstração: a unidade via o bloco novo no painel, clicava em
   * "ver tudo" e ele não estava lá.
   */
  registrosDoConjunto: (lista: Institution[]) => RegistroBlockchain[];
  /** Emissão feita nesta sessão, quando houver. */
  emissao: (inst: Institution) => Emissao | null;
  /** Alguma emissão foi feita nesta sessão? Usado para avisar o avaliador. */
  temEmissaoDaSessao: boolean;
};

function certificacaoDaEmissao(e: Emissao, modelo: ModeloCertificacao | null): Certificacao {
  const temporal = situacaoDaValidade(e.validade);

  return {
    instituicaoId: e.instituicaoId,
    nivel: e.nivel,
    pontuacao: e.pontuacao,
    emissao: e.emissao,
    validade: e.validade,
    status:
      temporal?.situacao === "Vencida"
        ? "Vencida"
        : temporal?.situacao === "A vencer"
          ? "A vencer"
          : "Ativa",
    diasParaVencer: temporal?.dias ?? 0,
    modeloId: e.modeloId,
    modeloCodigo: modelo?.codigo ?? e.modeloId,
    modeloVersao: e.modeloVersao,
    token: e.token,
    hash: e.hash,
  };
}

/**
 * Eventos que a emissão da sessão acrescenta à cadeia.
 *
 * A avaliação vem antes da emissão, e o subselo depois: a ordem é a mesma que a
 * base usa, para que o histórico da instituição não mude de gramática só porque
 * o evento foi criado durante a demonstração.
 */
function registrosDaEmissao(e: Emissao, deslocamento: number): RegistroBlockchain[] {
  const eventos: { evento: string; tipo: RegistroBlockchain["tipo"]; chave: string }[] = [
    {
      evento: `Avaliação inicial registrada com ${e.pontuacao} pontos`,
      tipo: "avaliacao",
      chave: `sessao:av:${e.id}`,
    },
    {
      evento: `Certificação emitida para o nível ${e.nivel} · token ${e.token}`,
      tipo: "certificacao",
      chave: `sessao:cert:${e.id}`,
    },
    ...e.subselos.map((s) => ({
      evento: `Subselo concedido: ${s}`,
      tipo: "atualizacao" as const,
      chave: `sessao:sub:${e.id}:${s}`,
    })),
  ];

  return eventos
    .map((ev, i) => ({
      evento: ev.evento,
      data: e.emissao,
      tipo: ev.tipo,
      instituicaoId: e.instituicaoId,
      bloco: blocoDepoisDaBase(deslocamento + i),
      hash: hashDemo(ev.chave),
      referencia: ev.chave,
      publico: true,
    }))
    .reverse();
}

export function useSelo(): Selo {
  const { modelos, emissoes, emissaoDaInstituicao } = useCatalogo();

  return useMemo(() => {
    // Deslocamento de bloco por emissão: a primeira da sessão continua a cadeia
    // de onde a base parou, a segunda continua depois da primeira.
    const deslocamentos = new Map<string, number>();
    let acumulado = 0;
    for (const e of [...emissoes].reverse()) {
      deslocamentos.set(e.id, acumulado);
      acumulado += 2 + e.subselos.length;
    }

    const emissaoDe = (inst: Institution) => emissaoDaInstituicao(inst.id);

    /* O catálogo vivo vem primeiro: um modelo criado durante a demonstração não
       está em `modeloPorId`, e procurar só ali fazia a emissão perder os eixos
       (ficha pública sem nota nenhuma) e exibir o id cru no lugar da sigla. */
    const modeloDaEmissao = (e: Emissao) =>
      modelos.find((m) => m.id === e.modeloId) ?? modeloPorId.get(e.modeloId) ?? null;

    const criteriosDaEmissao = (e: Emissao): Criterio[] => {
      const modelo = modeloDaEmissao(e);
      if (!modelo) return [];
      return modelo.eixos.map((eixo) => ({
        nome: eixo.nome,
        nota: e.notas[eixo.nome] ?? 0,
        base: eixo.base,
      }));
    };

    /** Modelo que responde pelo selo vigente: o da emissão, ou o da base. */
    const modeloDe = (inst: Institution) => {
      const e = emissaoDe(inst);
      return e ? modeloDaEmissao(e) : (apuracaoDaInstituicao(inst.id)?.modelo ?? null);
    };

    return {
      nivel: (inst) => emissaoDe(inst)?.nivel ?? nivelDaInstituicao(inst.id),
      pontuacao: (inst) => emissaoDe(inst)?.pontuacao ?? pontuacaoDaInstituicao(inst.id),
      validade: (inst) => emissaoDe(inst)?.validade ?? validadeDaInstituicao(inst.id),
      status: (inst) => (emissaoDe(inst) ? "Certificada" : inst.status),
      subselos: (inst) => emissaoDe(inst)?.subselos ?? inst.subselos,
      criterios: (inst) => {
        const e = emissaoDe(inst);
        return e ? criteriosDaEmissao(e) : inst.criterios;
      },
      ultimaAvaliacao: (inst) => emissaoDe(inst)?.emissao ?? inst.ultimaAvaliacao,
      certificacao: (inst) => {
        const e = emissaoDe(inst);
        return e
          ? certificacaoDaEmissao(e, modeloDaEmissao(e))
          : certificacaoDaInstituicao(inst.id);
      },
      sugerido: (inst) => (emissaoDe(inst) ? null : nivelSugerido(inst.id)),
      modelo: modeloDe,
      plano: (inst) => {
        const e = emissaoDe(inst);
        const modelo = e ? modeloDaEmissao(e) : null;
        // Só desvia da base quando há emissão E modelo: o plano precisa das
        // notas e do piso da mesma régua, nunca de uma metade de cada.
        return e && modelo
          ? planoDeAdequacao(inst, { criterios: criteriosDaEmissao(e), modelo })
          : planoDeAdequacao(inst);
      },
      proximoNivel: (inst) => {
        const e = emissaoDe(inst);
        const modelo = e ? modeloDaEmissao(e) : null;
        return e && modelo ? proximoNivel(inst, { nota: e.pontuacao, modelo }) : proximoNivel(inst);
      },
      registros: (inst) => {
        const e = emissaoDe(inst);
        const daBase = registrosDaInstituicao(inst.id);
        return e ? [...registrosDaEmissao(e, deslocamentos.get(e.id) ?? 0), ...daBase] : daBase;
      },
      registrosPublicos: (inst) => {
        const e = emissaoDe(inst);
        const daBase = registrosPublicosDaInstituicao(inst.id);
        return e ? [...registrosDaEmissao(e, deslocamentos.get(e.id) ?? 0), ...daBase] : daBase;
      },
      registrosDoConjunto: (lista) => {
        const ids = new Set(lista.map((i) => i.id));
        const daSessao = lista
          .map(emissaoDe)
          .filter((e): e is Emissao => e !== null)
          .flatMap((e) => registrosDaEmissao(e, deslocamentos.get(e.id) ?? 0))
          // Bloco maior é evento mais novo: mesma ordem que a base já entrega,
          // então as duas listas se emendam sem reordenar o livro inteiro.
          .sort((a, b) => Number(b.bloco.slice(1)) - Number(a.bloco.slice(1)));

        return [...daSessao, ...registrosDaBase.filter((r) => ids.has(r.instituicaoId))];
      },
      emissao: (inst) => emissaoDe(inst),
      temEmissaoDaSessao: emissoes.length > 0,
    };
  }, [modelos, emissoes, emissaoDaInstituicao]);
}

/**
 * Consolidado de um conjunto, já com as emissões da sessão aplicadas.
 *
 * `resumoDoConjunto` da base não conhece o overlay, então recalculamos aqui os
 * campos que uma emissão muda. O resto vem intacto — reescrever o consolidado
 * inteiro criaria uma segunda régua para os mesmos números.
 */
export function useResumoComEmissoes(lista: Institution[], base: ResumoDoConjunto) {
  const selo = useSelo();

  return useMemo(() => {
    if (!selo.temEmissaoDaSessao) return base;

    const vigentes = lista.filter((i) => selo.status(i) === "Certificada");
    const conta = (n: Nivel) => vigentes.filter((i) => selo.nivel(i) === n).length;
    // Uma emissão pode dar nota a quem não tinha: a média precisa acompanhar.
    const notas = lista
      .map((i) => selo.pontuacao(i))
      .filter((n): n is number => n !== null && n !== undefined);

    return {
      ...base,
      media: notas.length ? Math.round(notas.reduce((s, n) => s + n, 0) / notas.length) : null,
      certificadas: vigentes.length,
      aguardandoEmissao: lista.filter((i) => selo.status(i) === "Aguardando emissão").length,
      emAvaliacao: lista.filter((i) => selo.status(i) === "Em avaliação").length,
      pendentes: lista.filter((i) => selo.status(i) === "Pendente").length,
      /* Recontado junto com os outros estágios: deixar `suspensas` vindo da base
         permitia que a mesma instituição fosse contada como certificada e como
         suspensa, e as barras de "situação das instituições" somavam mais que o
         total do escopo. Os cinco estágios têm de fechar em `total`. */
      suspensas: lista.filter((i) => selo.status(i) === "Suspensa").length,
      porNivel: { Ouro: conta("Ouro"), Prata: conta("Prata"), Bronze: conta("Bronze") },
      subselos: vigentes.reduce((s, i) => s + selo.subselos(i).length, 0),
    };
  }, [lista, base, selo]);
}
