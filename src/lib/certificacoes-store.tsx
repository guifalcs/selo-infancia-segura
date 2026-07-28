import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  hashDemo,
  modelosIniciais,
  nivelPorFaixa,
  somarMeses,
  type ModeloCertificacao,
  type Nivel,
} from "@/lib/mock-data";

/**
 * Catálogo de modelos de certificação e emissões feitas a partir deles.
 *
 * Protótipo: o catálogo vive em memória, espelhado no `localStorage`, para que
 * o avaliador do projeto crie um modelo, atribua a uma instituição e veja o
 * resultado nas outras telas sem que exista backend. Ao ligar o servidor, o
 * provider passa a buscar a mesma forma de dado e nenhuma tela muda.
 *
 * O estado inicial é sempre `modelosIniciais`: ler o `localStorage` no primeiro
 * render faria o HTML do servidor divergir do cliente, e o React descartaria a
 * árvore hidratada.
 */

const CHAVE = "sis.portal.certificacoes";

/** Uma emissão: o modelo aplicado a uma instituição específica. */
export type Emissao = {
  id: string;
  modeloId: string;
  /** Versão do modelo no momento da emissão — o selo não muda se o modelo mudar. */
  modeloVersao: number;
  instituicaoId: string;
  /** Nota por eixo, na régua do modelo. */
  notas: Record<string, number>;
  pontuacao: number;
  nivel: Nivel;
  subselos: string[];
  emissao: string;
  validade: string;
  avaliador: string;
  responsavel: string;
  observacoes: string;
  token: string;
  hash: string;
};

type Catalogo = {
  /** `false` enquanto o que estava salvo ainda não foi lido no cliente. */
  pronto: boolean;
  modelos: ModeloCertificacao[];
  emissoes: Emissao[];
  criarModelo: (dados: NovoModelo) => ModeloCertificacao;
  atualizarModelo: (id: string, dados: NovoModelo) => void;
  mudarStatusModelo: (id: string, status: ModeloCertificacao["status"]) => void;
  /** Emite um modelo para uma instituição. `null` = nota abaixo do corte. */
  atribuir: (dados: NovaEmissao) => Emissao | null;
  emissoesDoModelo: (modeloId: string) => Emissao[];
  restaurarPadrao: () => void;
};

export type NovoModelo = Omit<ModeloCertificacao, "id" | "criadoEm" | "criadoPor" | "versao">;

export type NovaEmissao = {
  modeloId: string;
  instituicaoId: string;
  notas: Record<string, number>;
  subselos: string[];
  avaliador: string;
  responsavel: string;
  observacoes: string;
};

const CatalogoContext = createContext<Catalogo | null>(null);

/** Data de hoje em dd/mm/aaaa — só chamada em resposta a uma ação da pessoa. */
const hoje = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

const idDeModelo = (codigo: string, existentes: ModeloCertificacao[]) => {
  const base = `mod-${
    codigo
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "novo"
  }`;
  let id = base;
  let n = 2;
  while (existentes.some((m) => m.id === id)) id = `${base}-${n++}`;
  return id;
};

type Salvo = { modelos: ModeloCertificacao[]; emissoes: Emissao[] };

export function CatalogoProvider({ children }: { children: ReactNode }) {
  const [modelos, setModelos] = useState<ModeloCertificacao[]>(modelosIniciais);
  const [emissoes, setEmissoes] = useState<Emissao[]>([]);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (bruto) {
        const salvo = JSON.parse(bruto) as Partial<Salvo>;
        if (Array.isArray(salvo.modelos) && salvo.modelos.length) setModelos(salvo.modelos);
        if (Array.isArray(salvo.emissoes)) setEmissoes(salvo.emissoes);
      }
    } catch {
      // Storage bloqueado ou conteúdo corrompido: segue com o catálogo padrão.
    }
    setPronto(true);
  }, []);

  const guardar = useCallback((dados: Salvo) => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(dados));
    } catch {
      /* idem */
    }
  }, []);

  const valor = useMemo<Catalogo>(() => {
    const persistir = (proximos: ModeloCertificacao[], proximasEmissoes: Emissao[]) => {
      setModelos(proximos);
      setEmissoes(proximasEmissoes);
      guardar({ modelos: proximos, emissoes: proximasEmissoes });
    };

    return {
      pronto,
      modelos,
      emissoes,

      criarModelo: (dados) => {
        const modelo: ModeloCertificacao = {
          ...dados,
          id: idDeModelo(dados.codigo, modelos),
          criadoEm: hoje(),
          criadoPor: "Ana Ribeiro",
          versao: 1,
        };
        persistir([...modelos, modelo], emissoes);
        return modelo;
      },

      atualizarModelo: (id, dados) => {
        persistir(
          modelos.map((m) =>
            m.id === id
              ? // A versão sobe a cada edição: as emissões antigas continuam
                // apontando para a versão sob a qual foram feitas.
                {
                  ...m,
                  ...dados,
                  id: m.id,
                  criadoEm: m.criadoEm,
                  criadoPor: m.criadoPor,
                  versao: m.versao + 1,
                }
              : m,
          ),
          emissoes,
        );
      },

      mudarStatusModelo: (id, status) => {
        persistir(
          modelos.map((m) => (m.id === id ? { ...m, status } : m)),
          emissoes,
        );
      },

      atribuir: (dados) => {
        const modelo = modelos.find((m) => m.id === dados.modeloId);
        if (!modelo) return null;

        const soma = modelo.eixos.reduce((s, e) => s + e.peso, 0) || 1;
        const pontuacao = Math.round(
          modelo.eixos.reduce((s, e) => s + (dados.notas[e.nome] ?? 0) * e.peso, 0) / soma,
        );
        const nivel = nivelPorFaixa(modelo, pontuacao);
        if (!nivel) return null;

        const data = hoje();
        const sequencial = String(
          emissoes.filter((e) => e.modeloId === modelo.id).length + 1,
        ).padStart(4, "0");
        const token = `${modelo.codigo}-${data.slice(6)}-${sequencial}`;

        const emissao: Emissao = {
          id: `emi-${modelo.id}-${dados.instituicaoId}-${sequencial}`,
          modeloId: modelo.id,
          modeloVersao: modelo.versao,
          instituicaoId: dados.instituicaoId,
          notas: dados.notas,
          pontuacao,
          nivel,
          subselos: dados.subselos,
          emissao: data,
          validade: somarMeses(data, modelo.validadeMeses),
          avaliador: dados.avaliador,
          responsavel: dados.responsavel,
          observacoes: dados.observacoes,
          token,
          hash: hashDemo(`emissao:${modelo.id}:${dados.instituicaoId}:${sequencial}`),
        };

        persistir(modelos, [emissao, ...emissoes]);
        return emissao;
      },

      emissoesDoModelo: (modeloId) => emissoes.filter((e) => e.modeloId === modeloId),

      restaurarPadrao: () => persistir(modelosIniciais, []),
    };
  }, [modelos, emissoes, pronto, guardar]);

  return <CatalogoContext.Provider value={valor}>{children}</CatalogoContext.Provider>;
}

export function useCatalogo() {
  const ctx = useContext(CatalogoContext);
  if (!ctx) throw new Error("useCatalogo precisa estar dentro de <CatalogoProvider>.");
  return ctx;
}
