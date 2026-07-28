/**
 * Perfis de acesso do portal institucional.
 *
 * O SIS atende três tipos de cliente, e cada um enxerga um recorte diferente
 * da mesma base:
 *
 *   admin    — equipe do SIS. Vê todos os clientes, emite certificação,
 *              credencia avaliadores e responde pela fila de denúncias.
 *   rede     — instituição gestora de várias unidades (prefeitura, grupo
 *              privado). Vê o consolidado das suas unidades e decide quais
 *              delas têm acesso próprio ao portal.
 *   unidade  — uma instituição só. Vê a própria certificação, o plano de
 *              adequação e as denúncias que dizem respeito a ela. Pode ser
 *              cliente direto ou unidade de uma rede que concedeu o acesso.
 *
 * ATENÇÃO: este é um protótipo. As contas abaixo são ESTÁTICAS e existem para
 * que quem avalia o projeto entre em cada portal sem cadastro. Não há
 * autenticação real, hash de senha nem sessão no servidor — o "login" apenas
 * escolhe qual recorte de dados a interface vai mostrar.
 */

import {
  institutionPorId,
  institutions,
  instituicoesIndependentes,
  redePorId,
  redes,
  unidadesDaRede,
  type Institution,
  type Rede,
} from "@/lib/mock-data";

export type Papel = "admin" | "rede" | "unidade";

export const rotuloPapel: Record<Papel, string> = {
  admin: "Administração SIS",
  rede: "Instituição gestora",
  unidade: "Unidade",
};

export type Conta = {
  id: string;
  papel: Papel;
  email: string;
  senha: string;
  pessoa: string;
  cargo: string;
  /** Preenchido quando `papel === "rede"`. */
  redeId?: string;
  /** Preenchido quando `papel === "unidade"`. */
  instituicaoId?: string;
  /** Chamada do card de demonstração na tela de login. */
  demo: string;
};

/** Senha única — é um protótipo, e esconder isso só atrasaria quem avalia. */
export const SENHA_DEMO = "demo1234";

export const contas: Conta[] = [
  {
    id: "admin-sis",
    papel: "admin",
    email: "admin@demo.selo-infancia-segura.org",
    senha: SENHA_DEMO,
    pessoa: "Ana Ribeiro",
    cargo: "Coordenação de certificação na SIS",
    demo: "Visão do dono do projeto: todos os clientes, emissão de selos, avaliadores credenciados e a fila nacional de denúncias.",
  },
  {
    id: "rede-serra-verde",
    papel: "rede",
    email: "rede@demo.selo-infancia-segura.org",
    senha: SENHA_DEMO,
    pessoa: "Helena Vasconcelos",
    cargo: "Secretária de Educação",
    redeId: "rede-sv",
    demo: "Prefeitura que acompanha 5 unidades: selos de cada escola, denúncias por unidade e concessão de acesso individual.",
  },
  {
    id: "unidade-esc-101",
    papel: "unidade",
    email: "serraverdecentral@demo.selo-infancia-segura.org",
    senha: SENHA_DEMO,
    pessoa: "Paulo Andrade",
    cargo: "Direção",
    instituicaoId: "esc-101",
    demo: "Escola da rede municipal com acesso concedido pela secretaria: vê só a própria unidade, sem enxergar as demais.",
  },
  {
    id: "unidade-cre-002",
    papel: "unidade",
    email: "primeirospassos@demo.selo-infancia-segura.org",
    senha: SENHA_DEMO,
    pessoa: "Sônia Prado",
    cargo: "Direção",
    instituicaoId: "cre-002",
    demo: "Creche cliente direta, sem rede gestora: responde por si mesma e fala direto com o SIS.",
  },
];

export const contaPorId = new Map(contas.map((c) => [c.id, c]));

/** Login estático: e-mail e senha exatos, sem diferenciar maiúsculas no e-mail. */
export const autenticar = (email: string, senha: string) =>
  contas.find((c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.senha === senha) ??
  null;

/**
 * Recorte de dados de uma conta.
 *
 * Todas as telas do portal leem `instituicoes` daqui em vez de importar a base
 * inteira — é o que garante que a unidade não veja a vizinha e que a rede não
 * veja o cliente de outra rede.
 */
export type Escopo = {
  conta: Conta;
  papel: Papel;
  /** Organização exibida no cabeçalho — a instituição, não a pessoa. */
  organizacao: string;
  /** Linha de apoio do cabeçalho: onde essa conta está na hierarquia. */
  contexto: string;
  /** Instituições visíveis para a conta. */
  instituicoes: Institution[];
  /** Rede gestora do escopo, quando existe. */
  rede: Rede | null;
  /** Unidade da conta, quando o papel é `unidade`. */
  instituicao: Institution | null;
  /** Redes visíveis — só a administração enxerga mais de uma. */
  redesVisiveis: Rede[];
};

export function resolverEscopo(conta: Conta): Escopo {
  if (conta.papel === "admin") {
    return {
      conta,
      papel: "admin",
      organizacao: "SIS: Selo Infância Segura",
      contexto: `${institutions.length} instituições · ${redes.length} redes clientes`,
      instituicoes: institutions,
      rede: null,
      instituicao: null,
      redesVisiveis: redes,
    };
  }

  if (conta.papel === "rede") {
    const rede = (conta.redeId && redePorId.get(conta.redeId)) || null;
    const unidades = rede ? unidadesDaRede(rede.id) : [];
    return {
      conta,
      papel: "rede",
      organizacao: rede?.nome ?? "Rede sem vínculo",
      contexto: rede
        ? `${unidades.length} unidades · ${rede.cidade} - ${rede.uf}`
        : "Nenhuma unidade vinculada",
      instituicoes: unidades,
      rede,
      instituicao: null,
      redesVisiveis: rede ? [rede] : [],
    };
  }

  const instituicao = (conta.instituicaoId && institutionPorId.get(conta.instituicaoId)) || null;
  const rede = (instituicao?.redeId && redePorId.get(instituicao.redeId)) || null;
  return {
    conta,
    papel: "unidade",
    organizacao: instituicao?.nome ?? "Instituição sem vínculo",
    contexto: instituicao
      ? rede
        ? `Unidade de ${rede.nome}`
        : `Cliente direto · ${instituicao.cidade} - ${instituicao.uf}`
      : "Sem instituição vinculada",
    instituicoes: instituicao ? [instituicao] : [],
    rede,
    instituicao,
    redesVisiveis: [],
  };
}

/** Clientes do SIS na visão da administração: redes e instituições diretas. */
export const carteiraDeClientes = () => ({
  redes: redes.map((r) => ({ rede: r, unidades: unidadesDaRede(r.id) })),
  diretas: instituicoesIndependentes(),
});
