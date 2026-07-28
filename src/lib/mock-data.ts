/**
 * Dados de demonstração do protótipo.
 *
 * ATENÇÃO: instituições, notas, avaliadores e hashes abaixo são FICTÍCIOS e
 * existem apenas para demonstrar o funcionamento do portal. Nenhum dado real
 * de instituição brasileira deve ser inserido aqui sem autorização.
 *
 * O modelo reflete o desenho descrito no resumo do projeto: avaliação por
 * profissional credenciado, pontuação por critérios objetivos ancorados em
 * normas existentes, nível de certificação (Bronze/Prata/Ouro), subselos
 * temáticos e validade de 12 meses com renovação obrigatória.
 */

export type Nivel = "Ouro" | "Prata" | "Bronze";

export type Status = "Certificada" | "Em avaliação" | "Pendente" | "Suspensa";

/** O escopo do SIS não é só escola — cobre qualquer ambiente frequentado por
 *  crianças e adolescentes. */
export type TipoInstituicao =
  | "Escola"
  | "Creche"
  | "Clínica"
  | "Clube esportivo"
  | "Parque de diversões"
  | "Projeto social"
  | "Curso livre";

/** Os mesmos tipos em runtime — o formulário de modelo precisa iterar sobre eles. */
export const tiposDeInstituicao = [
  "Escola",
  "Creche",
  "Clínica",
  "Clube esportivo",
  "Parque de diversões",
  "Projeto social",
  "Curso livre",
] as const satisfies readonly TipoInstituicao[];

/** Um critério avaliado, com a norma que o fundamenta. */
export type Criterio = {
  nome: string;
  nota: number; // 0 a 100
  base: string;
};

export type Institution = {
  id: string;
  nome: string;
  tipo: TipoInstituicao;
  cidade: string;
  uf: string;
  status: Status;
  nivel: Nivel | null;
  pontuacao: number | null;
  descricao: string;
  ultimaAvaliacao: string;
  validade: string | null;
  avaliador: string | null;
  subselos: string[];
  criterios: Criterio[];
  /**
   * Rede gestora, quando a unidade pertence a uma (prefeitura, grupo privado).
   * Ausente = cliente direto, que responde por si mesmo no portal.
   */
  redeId?: string;
  /**
   * Acesso próprio ao portal. Só faz sentido em unidade de rede: a instituição
   * gestora decide se a unidade enxerga o painel dela ou se o acompanhamento
   * fica concentrado na rede. Cliente direto sempre tem acesso.
   */
  acessoProprio?: boolean;
};

/**
 * Instituição gestora de várias unidades — prefeitura, secretaria, grupo
 * educacional, rede de clínicas. No portal, é quem enxerga o consolidado e
 * quem concede (ou revoga) o acesso individual de cada unidade.
 */
export type Rede = {
  id: string;
  nome: string;
  tipo: "Poder público" | "Rede privada";
  cidade: string;
  uf: string;
  responsavel: string;
  contato: string;
  /** Plano contratado — usado na visão de clientes do administrador. */
  plano: string;
  desde: string;
};

/** Os seis eixos avaliados. As bases normativas vêm do desenho do projeto. */
export const eixos = [
  { nome: "Ambiente seguro e saudável", base: "ECA · Vigilância Sanitária" },
  { nome: "Segurança predial e prevenção", base: "Corpo de Bombeiros" },
  { nome: "Acessibilidade e inclusão", base: "LBI · Recomendações UNICEF" },
  { nome: "Qualificação dos profissionais", base: "ECA · Conselhos de classe" },
  { nome: "Proteção de dados de menores", base: "LGPD" },
  { nome: "Canais de escuta e denúncia", base: "ECA · Conselho Tutelar" },
] as const;

const criterios = (n: [number, number, number, number, number, number]): Criterio[] =>
  eixos.map((e, i) => ({ nome: e.nome, nota: n[i], base: e.base }));

/**
 * Redes clientes. Os municípios e grupos abaixo são inventados de propósito —
 * atribuir um selo, mesmo fictício, a uma prefeitura real seria afirmar algo
 * sobre ela que o projeto não tem como sustentar.
 */
export const redes: Rede[] = [
  {
    id: "rede-sv",
    nome: "Prefeitura de Serra Verde: Secretaria de Educação",
    tipo: "Poder público",
    cidade: "Serra Verde",
    uf: "SP",
    responsavel: "Helena Vasconcelos · Secretária de Educação",
    contato: "rede@demo.selo-infancia-segura.org",
    plano: "Municipal, até 20 unidades",
    desde: "08/2025",
  },
  {
    id: "rede-ng",
    nome: "Grupo Educacional Nova Geração",
    tipo: "Rede privada",
    cidade: "Recife",
    uf: "PE",
    responsavel: "Otávio Lins · Diretor de operações",
    contato: "compliance@demo.selo-infancia-segura.org",
    plano: "Rede privada, até 10 unidades",
    desde: "01/2026",
  },
];

export const institutions: Institution[] = [
  {
    id: "esc-001",
    nome: "Escola Municipal Aurora",
    tipo: "Escola",
    cidade: "São Paulo",
    uf: "SP",
    status: "Certificada",
    nivel: "Ouro",
    pontuacao: 94,
    descricao:
      "Escola pública de ensino fundamental com programa de educação integral e política própria de proteção à criança.",
    ultimaAvaliacao: "12/03/2026",
    validade: "12/03/2027",
    avaliador: "Márcia Torres · Pedagoga (CRP em convênio)",
    subselos: ["Acessibilidade", "Prevenção ao Bullying"],
    criterios: criterios([96, 92, 95, 97, 90, 94]),
  },
  {
    id: "cre-002",
    nome: "Creche Comunitária Primeiros Passos",
    tipo: "Creche",
    cidade: "Rio de Janeiro",
    uf: "RJ",
    status: "Certificada",
    nivel: "Prata",
    pontuacao: 81,
    descricao:
      "Creche conveniada que atende crianças de 0 a 3 anos em região de alta vulnerabilidade social.",
    ultimaAvaliacao: "05/02/2026",
    validade: "05/02/2027",
    avaliador: "Larissa Souza · Psicóloga",
    subselos: ["Prevenção ao Bullying"],
    criterios: criterios([84, 78, 74, 86, 80, 84]),
  },
  {
    id: "cli-003",
    nome: "Clínica Infantil Horizonte",
    tipo: "Clínica",
    cidade: "Belo Horizonte",
    uf: "MG",
    status: "Em avaliação",
    nivel: "Prata",
    pontuacao: 79,
    descricao: "Clínica pediátrica e de terapias multidisciplinares para crianças e adolescentes.",
    ultimaAvaliacao: "22/06/2026",
    validade: "22/06/2027",
    avaliador: "Diego Almeida · Psicólogo",
    subselos: ["Acessibilidade"],
    criterios: criterios([82, 80, 88, 76, 70, 78]),
  },
  {
    id: "prj-004",
    nome: "Centro Educacional Renascer",
    tipo: "Projeto social",
    cidade: "Curitiba",
    uf: "PR",
    status: "Certificada",
    nivel: "Ouro",
    pontuacao: 91,
    descricao:
      "Projeto social de contraturno escolar com oficinas de esporte, cultura e inclusão digital.",
    ultimaAvaliacao: "18/01/2026",
    validade: "18/01/2027",
    avaliador: "Camila Nunes · Assistente social",
    subselos: ["Inclusão TEA", "Prevenção ao Bullying", "Segurança Digital"],
    criterios: criterios([93, 88, 92, 90, 89, 94]),
  },
  {
    id: "clb-005",
    nome: "Clube Atlético Vale do Sol",
    tipo: "Clube esportivo",
    cidade: "Fortaleza",
    uf: "CE",
    status: "Certificada",
    nivel: "Bronze",
    pontuacao: 68,
    descricao: "Clube com escolinhas de futebol, natação e ginástica para crianças e adolescentes.",
    ultimaAvaliacao: "10/04/2026",
    validade: "10/04/2027",
    avaliador: "Rafael Prado · Educador físico",
    subselos: [],
    criterios: criterios([72, 70, 58, 74, 62, 72]),
  },
  {
    id: "prq-006",
    nome: "Parque Recreativo Cidade Alegre",
    tipo: "Parque de diversões",
    cidade: "Salvador",
    uf: "BA",
    status: "Pendente",
    nivel: null,
    pontuacao: null,
    descricao:
      "Parque de diversões com brinquedos para faixas etárias distintas. Avaliação inicial agendada.",
    ultimaAvaliacao: "-",
    validade: null,
    avaliador: null,
    subselos: [],
    criterios: [],
  },
  {
    id: "esc-007",
    nome: "Instituto Cidadão do Amanhã",
    tipo: "Curso livre",
    cidade: "Porto Alegre",
    uf: "RS",
    status: "Suspensa",
    nivel: null,
    pontuacao: null,
    descricao:
      "Certificação suspensa após apuração de denúncia relativa a canais de escuta e supervisão de profissionais.",
    ultimaAvaliacao: "09/09/2025",
    validade: null,
    avaliador: "João Bezerra · Psicólogo",
    subselos: [],
    criterios: [],
  },
  {
    id: "esc-008",
    nome: "Colégio Nova Geração",
    tipo: "Escola",
    cidade: "Recife",
    uf: "PE",
    status: "Certificada",
    nivel: "Prata",
    pontuacao: 84,
    descricao:
      "Colégio de ensino fundamental e médio com programa de mentoria e letramento digital.",
    ultimaAvaliacao: "27/05/2026",
    validade: "27/05/2027",
    avaliador: "Márcia Torres · Pedagoga",
    subselos: ["Segurança Digital"],
    criterios: criterios([86, 85, 78, 88, 84, 83]),
    redeId: "rede-ng",
    acessoProprio: true,
  },

  /* Unidades da rede municipal de Serra Verde. Duas delas têm acesso próprio
     ao portal; as outras são acompanhadas somente pela secretaria. */
  {
    id: "esc-101",
    nome: "EMEF Serra Verde Central",
    tipo: "Escola",
    cidade: "Serra Verde",
    uf: "SP",
    status: "Certificada",
    nivel: "Ouro",
    pontuacao: 92,
    descricao:
      "Maior escola da rede municipal, com ensino fundamental completo, biblioteca aberta à comunidade e núcleo de escuta permanente.",
    ultimaAvaliacao: "24/02/2026",
    validade: "24/02/2027",
    avaliador: "Márcia Torres · Pedagoga (CRP em convênio)",
    subselos: ["Acessibilidade", "Prevenção ao Bullying"],
    // Nível Ouro com dois eixos abaixo do patamar de 85: é o caso que mostra
    // que mesmo uma instituição bem avaliada mantém plano de adequação ativo.
    criterios: criterios([96, 84, 95, 97, 82, 98]),
    redeId: "rede-sv",
    acessoProprio: true,
  },
  {
    id: "cre-102",
    nome: "CEI Girassol",
    tipo: "Creche",
    cidade: "Serra Verde",
    uf: "SP",
    status: "Certificada",
    nivel: "Prata",
    pontuacao: 83,
    descricao:
      "Centro de educação infantil em tempo integral para crianças de 1 a 4 anos, com equipe de referência por turma.",
    ultimaAvaliacao: "16/03/2026",
    validade: "16/03/2027",
    avaliador: "Larissa Souza · Psicóloga",
    subselos: ["Inclusão TEA"],
    criterios: criterios([86, 82, 88, 84, 76, 82]),
    redeId: "rede-sv",
    acessoProprio: true,
  },
  {
    id: "esc-103",
    nome: "EMEF Vila Esperança",
    tipo: "Escola",
    cidade: "Serra Verde",
    uf: "SP",
    status: "Em avaliação",
    nivel: "Bronze",
    pontuacao: 71,
    descricao:
      "Escola de ensino fundamental em bairro periférico, em processo de adequação predial acompanhado pela secretaria.",
    ultimaAvaliacao: "02/07/2026",
    validade: "02/07/2027",
    avaliador: "Rafael Prado · Educador físico",
    subselos: [],
    criterios: criterios([74, 62, 66, 78, 72, 74]),
    redeId: "rede-sv",
    acessoProprio: false,
  },
  {
    id: "esc-104",
    nome: "EMEF Monteiro Verde",
    tipo: "Escola",
    cidade: "Serra Verde",
    uf: "SP",
    status: "Certificada",
    nivel: "Prata",
    pontuacao: 78,
    descricao:
      "Escola de ensino fundamental II com programa de contraturno esportivo e conselho escolar ativo.",
    ultimaAvaliacao: "11/05/2026",
    validade: "11/05/2027",
    avaliador: "Camila Nunes · Assistente social",
    subselos: ["Prevenção ao Bullying"],
    criterios: criterios([80, 76, 72, 82, 74, 84]),
    redeId: "rede-sv",
    acessoProprio: false,
  },
  {
    id: "prj-105",
    nome: "Centro de Contraturno Semear",
    tipo: "Projeto social",
    cidade: "Serra Verde",
    uf: "SP",
    status: "Pendente",
    nivel: null,
    pontuacao: null,
    descricao:
      "Equipamento municipal de contraturno inaugurado em 2026. Primeira avaliação agendada para agosto.",
    ultimaAvaliacao: "-",
    validade: null,
    avaliador: null,
    subselos: [],
    criterios: [],
    redeId: "rede-sv",
    acessoProprio: false,
  },

  /* Demais unidades do Grupo Nova Geração. */
  {
    id: "esc-201",
    nome: "Colégio Nova Geração, Unidade Boa Viagem",
    tipo: "Escola",
    cidade: "Recife",
    uf: "PE",
    status: "Certificada",
    nivel: "Prata",
    pontuacao: 86,
    descricao:
      "Segunda unidade do grupo, com ensino fundamental e médio e laboratório de tecnologia educacional.",
    ultimaAvaliacao: "03/06/2026",
    validade: "03/06/2027",
    avaliador: "Diego Almeida · Psicólogo",
    subselos: ["Segurança Digital"],
    criterios: criterios([88, 86, 82, 88, 86, 84]),
    redeId: "rede-ng",
    acessoProprio: false,
  },
  {
    id: "cre-202",
    nome: "Espaço Infantil Nova Geração",
    tipo: "Creche",
    cidade: "Olinda",
    uf: "PE",
    status: "Certificada",
    nivel: "Bronze",
    pontuacao: 73,
    descricao:
      "Berçário e educação infantil do grupo, com plano de adequação em acessibilidade em andamento.",
    ultimaAvaliacao: "19/04/2026",
    validade: "19/04/2027",
    avaliador: "Larissa Souza · Psicóloga",
    subselos: [],
    criterios: criterios([78, 74, 60, 76, 70, 78]),
    redeId: "rede-ng",
    acessoProprio: false,
  },
];

/** Unidades sob uma rede gestora. */
export const unidadesDaRede = (redeId: string) => institutions.filter((i) => i.redeId === redeId);

/** Clientes diretos — instituições que respondem por si mesmas. */
export const instituicoesIndependentes = () => institutions.filter((i) => !i.redeId);

export const institutionPorId = new Map(institutions.map((i) => [i.id, i]));
export const redePorId = new Map(redes.map((r) => [r.id, r]));

/** Descrição pública de cada nível — usada na home e na ficha da instituição. */
export const niveis: { nivel: Nivel; faixa: string; resumo: string }[] = [
  {
    nivel: "Bronze",
    faixa: "60 a 74 pontos",
    resumo:
      "Requisitos essenciais de segurança atendidos. A instituição tem plano de adequação ativo para os eixos com menor nota.",
  },
  {
    nivel: "Prata",
    faixa: "75 a 89 pontos",
    resumo:
      "Boas práticas consolidadas em todos os eixos, com procedimentos documentados e equipe capacitada.",
  },
  {
    nivel: "Ouro",
    faixa: "90 a 100 pontos",
    resumo:
      "Referência em proteção integral, com política própria, escuta ativa e acompanhamento contínuo.",
  },
];

export type Subselo = {
  nome: string;
  desc: string;
  /** Arte do medalhão, em `public/selos/subselos/` (WebP com fundo transparente). */
  arte: string;
};

/**
 * Subselos temáticos, conquistados em adição ao nível principal.
 *
 * Os nomes acompanham exatamente o texto gravado em cada medalhão — a arte é a
 * identidade visual do subselo, então divergir dela criaria dois nomes para a
 * mesma coisa. Ao acrescentar um subselo novo, gere a arte junto.
 */
export const subselos: Subselo[] = [
  {
    nome: "Acessibilidade",
    desc: "Infraestrutura e atendimento adequados a crianças com deficiência.",
    arte: "/selos/subselos/acessibilidade.webp",
  },
  {
    nome: "Inclusão TEA",
    desc: "Acolhimento estruturado de crianças autistas, com equipe preparada e ambiente adaptado.",
    arte: "/selos/subselos/inclusao-tea.webp",
  },
  {
    nome: "Prevenção ao Bullying",
    desc: "Política ativa de enfrentamento da violência entre pares, com protocolo de resposta.",
    arte: "/selos/subselos/prevencao-bullying.webp",
  },
  {
    nome: "Segurança Digital",
    desc: "Uso de tecnologia com proteção de dados e mediação adequada à idade.",
    arte: "/selos/subselos/seguranca-digital.webp",
  },
];

/** Busca o subselo pelo nome guardado em `Institution.subselos`. */
export const subseloPorNome = new Map(subselos.map((s) => [s.nome, s]));

/* ---------------------------------------------------------------------------
 * Dados operacionais do portal institucional.
 *
 * Tudo aqui é derivado ou vinculado por `instituicaoId`, nunca por nome: as
 * telas do portal filtram por escopo (uma unidade, uma rede, ou a base
 * inteira), e casar registros por string de nome quebraria no primeiro
 * homônimo — "Colégio Nova Geração" e sua segunda unidade, por exemplo.
 * ------------------------------------------------------------------------ */

/** Data brasileira (dd/mm/aaaa) em número ordenável. `—` vira 0. */
export const ordemPorData = (data: string) => {
  const [d, m, a] = data.split("/");
  return a ? Number(a) * 10000 + Number(m) * 100 + Number(d) : 0;
};

/**
 * Hash pseudo-aleatório porém ESTÁVEL para um identificador.
 *
 * Precisa ser determinístico: o mesmo registro tem de mostrar o mesmo hash no
 * servidor e no cliente, senão a hidratação do React acusa divergência — e um
 * hash que muda a cada render contradiz justamente o que a blockchain promete.
 */
export const hashDemo = (semente: string) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < semente.length; i++) {
    h ^= semente.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  const hex = h.toString(16).padStart(8, "0");
  const cauda = Math.imul(h ^ 0x9e3779b9, 0x85ebca6b) >>> 0;
  return `0x${hex}…${cauda.toString(16).padStart(8, "0").slice(-4)}`;
};

export type StatusCertificacao = "Ativa" | "Em renovação" | "Suspensa";

export type Certificacao = {
  instituicaoId: string;
  nivel: Nivel;
  pontuacao: number;
  emissao: string;
  validade: string;
  status: StatusCertificacao;
  /** Token emitido na rede — é ele que a família consulta no portal público. */
  token: string;
  hash: string;
};

/**
 * Certificações vigentes, derivadas das instituições que já têm nível e
 * validade. Derivar em vez de repetir garante que o selo mostrado no portal
 * institucional é o mesmo da ficha pública.
 */
export const certificacoes: Certificacao[] = institutions
  .filter((i) => i.nivel !== null && i.pontuacao !== null && i.validade !== null)
  .map((i, idx) => ({
    instituicaoId: i.id,
    nivel: i.nivel!,
    pontuacao: i.pontuacao!,
    emissao: i.ultimaAvaliacao,
    validade: i.validade!,
    status:
      i.status === "Suspensa" ? "Suspensa" : i.status === "Em avaliação" ? "Em renovação" : "Ativa",
    token: `SIS-2026-${String(idx + 1).padStart(4, "0")}`,
    hash: hashDemo(`cert:${i.id}`),
  }));

export const certificacaoDaInstituicao = (instituicaoId: string) =>
  certificacoes.find((c) => c.instituicaoId === instituicaoId) ?? null;

/* ---------------------------------------------------------------------------
 * Modelos de certificação.
 *
 * Um modelo é a definição do selo — o que ele exige, como se pontua, quanto
 * vale e por quanto tempo. A instituição não "cria" uma certificação: ela é
 * avaliada contra um modelo já publicado pela equipe SIS e, se atinge o corte,
 * recebe uma emissão daquele modelo. A analogia é a de um curso: a instituição
 * de ensino define o diploma uma vez, e cada aprovado recebe o mesmo diploma
 * com os seus próprios dados.
 *
 * Separar as duas coisas é o que permite mudar a régua sem reescrever o
 * passado: alterar um modelo não altera as emissões já registradas na rede,
 * porque cada emissão guarda o modelo e a versão sob os quais foi feita.
 * ------------------------------------------------------------------------ */

export type StatusModelo = "Ativo" | "Rascunho" | "Arquivado";

/** Peso de um eixo dentro do modelo. A soma dos pesos é sempre 100. */
export type EixoDoModelo = { nome: string; base: string; peso: number };

/** Nota mínima para alcançar um nível. Guardadas do maior para o menor. */
export type FaixaDeNivel = { nivel: Nivel; minimo: number };

export type ModeloCertificacao = {
  id: string;
  nome: string;
  /** Sigla que compõe o token emitido na rede: `SIS-EB-2026-0001`. */
  codigo: string;
  descricao: string;
  /** Tipos de instituição que podem ser avaliados por este modelo. */
  tiposElegiveis: TipoInstituicao[];
  eixos: EixoDoModelo[];
  /** Corte de aprovação: abaixo disso não há emissão, só plano de adequação. */
  notaMinima: number;
  faixas: FaixaDeNivel[];
  validadeMeses: number;
  /** Evidências que o avaliador precisa anexar para fechar a avaliação. */
  requisitos: string[];
  /** Subselos temáticos que este modelo pode conceder. */
  subselosElegiveis: string[];
  status: StatusModelo;
  criadoEm: string;
  criadoPor: string;
  /** Versão do texto do modelo. Editar um modelo publicado incrementa aqui. */
  versao: number;
};

/** Pesos iguais para os seis eixos padrão — ponto de partida de um modelo novo. */
export const eixosComPesoIgual = (): EixoDoModelo[] =>
  eixos.map((e, i) => ({
    nome: e.nome,
    base: e.base,
    // 100 não divide por 6: o resto vai para o primeiro eixo, para a soma fechar.
    peso: i === 0 ? 100 - 17 * (eixos.length - 1) : 17,
  }));

/** Faixas padrão, alinhadas à descrição pública dos níveis. */
export const faixasPadrao = (): FaixaDeNivel[] => [
  { nivel: "Ouro", minimo: 90 },
  { nivel: "Prata", minimo: 75 },
  { nivel: "Bronze", minimo: 60 },
];

/** Nível correspondente a uma nota dentro de um modelo. `null` = reprovado. */
export const nivelPorFaixa = (modelo: ModeloCertificacao, nota: number): Nivel | null => {
  if (nota < modelo.notaMinima) return null;
  const faixa = [...modelo.faixas]
    .sort((a, b) => b.minimo - a.minimo)
    .find((f) => nota >= f.minimo);
  return faixa?.nivel ?? null;
};

/** Média ponderada das notas por eixo, conforme os pesos do modelo. */
export const notaPonderada = (modelo: ModeloCertificacao, notas: Record<string, number>) => {
  const soma = modelo.eixos.reduce((s, e) => s + e.peso, 0) || 1;
  const total = modelo.eixos.reduce((s, e) => s + (notas[e.nome] ?? 0) * e.peso, 0);
  return Math.round(total / soma);
};

/**
 * Data brasileira somada de N meses — usada para calcular a validade.
 *
 * O dia é limitado ao último dia do mês de destino: sem isso, um selo emitido
 * em 31/01 venceria em 03/03, porque a data transborda para o mês seguinte. A
 * validade de um selo não pode pular de mês por acidente de calendário.
 */
export const somarMeses = (data: string, meses: number) => {
  const [d, m, a] = data.split("/").map(Number);
  if (!a) return data;
  const ultimoDia = new Date(a, m + meses, 0).getDate();
  const dt = new Date(a, m - 1 + meses, Math.min(d, ultimoDia));
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
};

/**
 * Modelos publicados pela equipe SIS.
 *
 * Três modelos cobrem os tipos de ambiente atendidos hoje. Os pesos mudam entre
 * eles de propósito: numa creche o ambiente físico pesa mais que o canal de
 * escuta, enquanto num curso livre online a proteção de dados é o eixo crítico.
 */
export const modelosIniciais: ModeloCertificacao[] = [
  {
    id: "mod-eb",
    nome: "Selo Infância Segura · Educação Básica",
    codigo: "SIS-EB",
    descricao:
      "Modelo para escolas, creches e cursos livres presenciais que recebem crianças e adolescentes em rotina diária.",
    tiposElegiveis: ["Escola", "Creche", "Curso livre"],
    eixos: [
      { nome: "Ambiente seguro e saudável", base: "ECA · Vigilância Sanitária", peso: 20 },
      { nome: "Segurança predial e prevenção", base: "Corpo de Bombeiros", peso: 20 },
      { nome: "Acessibilidade e inclusão", base: "LBI · Recomendações UNICEF", peso: 15 },
      { nome: "Qualificação dos profissionais", base: "ECA · Conselhos de classe", peso: 20 },
      { nome: "Proteção de dados de menores", base: "LGPD", peso: 10 },
      { nome: "Canais de escuta e denúncia", base: "ECA · Conselho Tutelar", peso: 15 },
    ],
    notaMinima: 60,
    faixas: faixasPadrao(),
    validadeMeses: 12,
    requisitos: [
      "Auto de Vistoria do Corpo de Bombeiros vigente",
      "Alvará sanitário da unidade",
      "Certidões negativas criminais de toda a equipe com contato direto",
      "Política de proteção à criança publicada e assinada pela direção",
      "Registro do canal de escuta e do fluxo de encaminhamento ao conselho tutelar",
    ],
    subselosElegiveis: [
      "Acessibilidade",
      "Inclusão TEA",
      "Prevenção ao Bullying",
      "Segurança Digital",
    ],
    status: "Ativo",
    criadoEm: "10/01/2026",
    criadoPor: "Ana Ribeiro",
    versao: 3,
  },
  {
    id: "mod-st",
    nome: "Selo Infância Segura · Saúde e Terapias",
    codigo: "SIS-ST",
    descricao:
      "Modelo para clínicas pediátricas e serviços de terapia infantil, com ênfase em prontuário, sigilo e supervisão profissional.",
    tiposElegiveis: ["Clínica"],
    eixos: [
      { nome: "Ambiente seguro e saudável", base: "ECA · Vigilância Sanitária", peso: 20 },
      { nome: "Segurança predial e prevenção", base: "Corpo de Bombeiros", peso: 10 },
      { nome: "Acessibilidade e inclusão", base: "LBI · Recomendações UNICEF", peso: 20 },
      { nome: "Qualificação dos profissionais", base: "ECA · Conselhos de classe", peso: 25 },
      { nome: "Proteção de dados de menores", base: "LGPD", peso: 15 },
      { nome: "Canais de escuta e denúncia", base: "ECA · Conselho Tutelar", peso: 10 },
    ],
    notaMinima: 65,
    faixas: faixasPadrao(),
    validadeMeses: 12,
    requisitos: [
      "Registro ativo do serviço no conselho de classe correspondente",
      "Política de sigilo e guarda de prontuário de paciente menor de idade",
      "Protocolo de atendimento com responsável presente ou autorização formal",
      "Certidões negativas criminais da equipe assistencial",
    ],
    subselosElegiveis: ["Acessibilidade", "Inclusão TEA", "Segurança Digital"],
    status: "Ativo",
    criadoEm: "18/02/2026",
    criadoPor: "Ana Ribeiro",
    versao: 2,
  },
  {
    id: "mod-el",
    nome: "Selo Infância Segura · Esporte, Lazer e Projetos",
    codigo: "SIS-EL",
    descricao:
      "Modelo para clubes, parques e projetos sociais, onde a rotação de público e a supervisão de atividades de risco são os pontos críticos.",
    tiposElegiveis: ["Clube esportivo", "Parque de diversões", "Projeto social"],
    eixos: [
      { nome: "Ambiente seguro e saudável", base: "ECA · Vigilância Sanitária", peso: 15 },
      { nome: "Segurança predial e prevenção", base: "Corpo de Bombeiros", peso: 30 },
      { nome: "Acessibilidade e inclusão", base: "LBI · Recomendações UNICEF", peso: 15 },
      { nome: "Qualificação dos profissionais", base: "ECA · Conselhos de classe", peso: 25 },
      { nome: "Proteção de dados de menores", base: "LGPD", peso: 5 },
      { nome: "Canais de escuta e denúncia", base: "ECA · Conselho Tutelar", peso: 10 },
    ],
    notaMinima: 60,
    faixas: faixasPadrao(),
    validadeMeses: 12,
    requisitos: [
      "Laudo estrutural dos equipamentos de recreação, quando houver",
      "Plano de emergência e equipe treinada em primeiros socorros por turno",
      "Relação nominal de monitores com formação e certidões negativas",
      "Controle de entrada e saída com identificação do responsável",
    ],
    subselosElegiveis: ["Acessibilidade", "Inclusão TEA", "Prevenção ao Bullying"],
    status: "Ativo",
    criadoEm: "05/03/2026",
    criadoPor: "Ana Ribeiro",
    versao: 1,
  },
  {
    id: "mod-ead",
    nome: "Selo Infância Segura · Ambientes Digitais",
    codigo: "SIS-AD",
    descricao:
      "Rascunho em construção para cursos e plataformas online voltadas a menores de idade. Ainda não publicado: aguarda parecer jurídico sobre LGPD e consentimento parental.",
    tiposElegiveis: ["Curso livre"],
    eixos: [
      { nome: "Ambiente seguro e saudável", base: "ECA · Vigilância Sanitária", peso: 5 },
      { nome: "Segurança predial e prevenção", base: "Corpo de Bombeiros", peso: 5 },
      { nome: "Acessibilidade e inclusão", base: "LBI · Recomendações UNICEF", peso: 20 },
      { nome: "Qualificação dos profissionais", base: "ECA · Conselhos de classe", peso: 15 },
      { nome: "Proteção de dados de menores", base: "LGPD", peso: 40 },
      { nome: "Canais de escuta e denúncia", base: "ECA · Conselho Tutelar", peso: 15 },
    ],
    notaMinima: 70,
    faixas: faixasPadrao(),
    validadeMeses: 12,
    requisitos: [
      "Termo de consentimento parental específico por funcionalidade",
      "Relatório de impacto à proteção de dados (RIPD)",
      "Moderação de interação entre usuários com registro auditável",
    ],
    subselosElegiveis: ["Segurança Digital", "Acessibilidade"],
    status: "Rascunho",
    criadoEm: "12/07/2026",
    criadoPor: "Ana Ribeiro",
    versao: 1,
  },
];

/** Modelo aplicável a um tipo de instituição — só entre os publicados. */
export const modelosParaTipo = (lista: ModeloCertificacao[], tipo: TipoInstituicao) =>
  lista.filter((m) => m.status === "Ativo" && m.tiposElegiveis.includes(tipo));

export type StatusAvaliacao = "Aprovada" | "Em andamento" | "Agendada" | "Reprovada";

export type Avaliacao = {
  id: string;
  instituicaoId: string;
  avaliador: string;
  data: string;
  tipo: "Inicial" | "Renovação" | "Extraordinária";
  status: StatusAvaliacao;
  pontuacao: number | null;
};

/** Avaliações já realizadas — uma por instituição com histórico. */
const avaliacoesRealizadas: Avaliacao[] = institutions
  .filter((i) => i.avaliador !== null && i.ultimaAvaliacao !== "-")
  .map((i) => ({
    id: `av-${i.id}`,
    instituicaoId: i.id,
    avaliador: i.avaliador!.split(" · ")[0],
    data: i.ultimaAvaliacao,
    tipo: "Inicial" as const,
    status:
      i.status === "Suspensa"
        ? ("Reprovada" as const)
        : i.status === "Em avaliação"
          ? ("Em andamento" as const)
          : ("Aprovada" as const),
    pontuacao: i.status === "Em avaliação" ? null : i.pontuacao,
  }));

/** Agenda futura e reavaliações extraordinárias abertas por denúncia. */
const avaliacoesAgendadas: Avaliacao[] = [
  {
    id: "av-prq-006-1",
    instituicaoId: "prq-006",
    avaliador: "Rafael Prado",
    data: "12/08/2026",
    tipo: "Inicial",
    status: "Agendada",
    pontuacao: null,
  },
  {
    id: "av-prj-105-1",
    instituicaoId: "prj-105",
    avaliador: "Camila Nunes",
    data: "26/08/2026",
    tipo: "Inicial",
    status: "Agendada",
    pontuacao: null,
  },
  {
    id: "av-clb-005-2",
    instituicaoId: "clb-005",
    avaliador: "Camila Nunes",
    data: "04/07/2026",
    tipo: "Extraordinária",
    status: "Em andamento",
    pontuacao: null,
  },
  {
    id: "av-esc-001-2",
    instituicaoId: "esc-001",
    avaliador: "Márcia Torres",
    data: "09/03/2027",
    tipo: "Renovação",
    status: "Agendada",
    pontuacao: null,
  },
  {
    id: "av-esc-101-2",
    instituicaoId: "esc-101",
    avaliador: "Márcia Torres",
    data: "20/02/2027",
    tipo: "Renovação",
    status: "Agendada",
    pontuacao: null,
  },
];

export const avaliacoes: Avaliacao[] = [...avaliacoesRealizadas, ...avaliacoesAgendadas].sort(
  (a, b) => ordemPorData(b.data) - ordemPorData(a.data),
);

export const avaliacoesDaInstituicao = (instituicaoId: string) =>
  avaliacoes.filter((a) => a.instituicaoId === instituicaoId);

export type StatusDenuncia = "Recebida" | "Em apuração" | "Procedente" | "Improcedente";

/** Gravidade atribuída na triagem — define prazo e prioridade da apuração. */
export type GravidadeDenuncia = "Alta" | "Média" | "Baixa";

/**
 * Natureza escolhida por quem registra — mesma lista fechada do canal público.
 *
 * É o único juízo pedido ao denunciante, e ainda assim de fato, não de risco:
 * ele descreve o que viu, não o quanto é grave.
 */
export type NaturezaDenuncia =
  | "Segurança física do ambiente"
  | "Suspeita de maus-tratos ou negligência"
  | "Conduta ou qualificação de profissionais"
  | "Falta de acessibilidade ou exclusão"
  | "Higiene, alimentação ou salubridade"
  | "Uso indevido de dados ou imagem de menores"
  | "Outra irregularidade";

/**
 * Piso de gravidade por natureza do relato.
 *
 * Quem denuncia nunca classifica a própria denúncia: a gravidade sai da
 * triagem do SIS. O piso abaixo é a parte automática dessa triagem — decorre
 * da natureza informada, sem depender de leitura. Maus-tratos e falha de
 * segurança física entram como alta porque envolvem notificação obrigatória
 * (ECA, art. 13) e risco imediato.
 *
 * A leitura do relato pode SUBIR o nível (atividade de risco, reincidência,
 * menção a lesão). Baixar abaixo do piso exige justificativa, que é registrada
 * na etapa de triagem e vai para a cadeia junto com ela. `null` = natureza sem
 * piso: o nível depende inteiramente da leitura.
 */
export const pisoDeGravidade: Record<NaturezaDenuncia, GravidadeDenuncia | null> = {
  "Suspeita de maus-tratos ou negligência": "Alta",
  "Segurança física do ambiente": "Alta",
  "Conduta ou qualificação de profissionais": "Média",
  "Higiene, alimentação ou salubridade": "Média",
  "Falta de acessibilidade ou exclusão": "Média",
  "Uso indevido de dados ou imagem de menores": "Média",
  "Outra irregularidade": null,
};

const ordemDaGravidade: Record<GravidadeDenuncia, number> = { Baixa: 1, Média: 2, Alta: 3 };

/**
 * Etapa da apuração.
 *
 * Cada etapa vira um evento na cadeia: é o que permite à instituição
 * acompanhar o andamento sem depender da palavra de quem apura.
 */
export type EtapaDenuncia = {
  data: string;
  titulo: string;
  detalhe: string;
  /** Quem executou a etapa — equipe SIS, avaliador credenciado ou a rede. */
  responsavel: string;
};

export type Denuncia = {
  protocolo: string;
  instituicaoId: string;
  data: string;
  /** Eixo afetado — permite ligar a denúncia ao critério que ela questiona. */
  eixo: string;
  categoria: string;
  /** Natureza marcada por quem registrou, no formulário do canal público. */
  natureza: NaturezaDenuncia;
  status: StatusDenuncia;
  /** Nula até a triagem acontecer: antes disso o caso ainda não tem nível. */
  gravidade: GravidadeDenuncia | null;
  /** Uma linha para a fila. */
  resumo: string;
  /** Texto integral do relato, como chegou pelo canal público. */
  relato: string;
  /** Quem responde pela apuração. */
  responsavel: string;
  /** Prazo para concluir a apuração. */
  prazo: string;
  andamento: EtapaDenuncia[];
  /** Providências determinadas até aqui. Vazio enquanto a triagem não termina. */
  providencias: string[];
  /** Conclusão da apuração — nulo enquanto o caso está em aberto. */
  desfecho: string | null;
  /** Efeito sobre a certificação, que é o que a instituição quer saber. */
  impactoNoSelo: string;
};

/**
 * Denúncias registradas pelo canal público.
 *
 * O portal mostra o teor, o andamento e o efeito sobre o selo. A autoria fica
 * fora da base: não é um campo escondido na interface, é dado que o canal não
 * guarda.
 */
export const denuncias: Denuncia[] = [
  {
    protocolo: "DEN-2026-0142",
    instituicaoId: "esc-001",
    data: "18/05/2026",
    eixo: "Canais de escuta e denúncia",
    categoria: "Demora no atendimento de ocorrência",
    natureza: "Outra irregularidade",
    status: "Improcedente",
    gravidade: "Média",
    resumo:
      "Relato de demora no retorno sobre ocorrência entre alunos. Apurado com registro de protocolo interno cumprido no prazo.",
    relato:
      "Uma ocorrência entre alunos do 6º ano teria sido comunicada à coordenação e ficado três semanas sem retorno às famílias envolvidas. O relato aponta que a escola só teria se manifestado depois de nova cobrança.",
    responsavel: "Larissa Souza · SIS-AV-0044",
    prazo: "17/06/2026",
    andamento: [
      {
        data: "18/05/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: "Canal público SIS",
      },
      {
        data: "20/05/2026",
        titulo: "Triagem concluída · gravidade média",
        detalhe:
          "Classificado no eixo Canais de escuta e denúncia, com prazo de apuração de 30 dias.",
        responsavel: "Coordenação de certificação SIS",
      },
      {
        data: "28/05/2026",
        titulo: "Documentação solicitada à instituição",
        detalhe:
          "Livro de ocorrências e comprovantes de comunicação às famílias no período foram requisitados.",
        responsavel: "Larissa Souza · SIS-AV-0044",
      },
      {
        data: "05/06/2026",
        titulo: "Apuração concluída · improcedente",
        detalhe:
          "Registros mostram atendimento em 48 horas e duas comunicações às famílias, ambas datadas.",
        responsavel: "Coordenação de certificação SIS",
      },
    ],
    providencias: [
      "Nenhuma medida aplicada à instituição.",
      "Evento mantido no histórico permanente, inclusive por ter sido considerado improcedente.",
    ],
    desfecho:
      "Improcedente. O protocolo interno foi cumprido dentro do prazo previsto e a comunicação às famílias está documentada.",
    impactoNoSelo: "Sem efeito sobre a certificação vigente.",
  },
  {
    protocolo: "DEN-2026-0187",
    instituicaoId: "esc-103",
    data: "02/06/2026",
    eixo: "Segurança predial e prevenção",
    categoria: "Infraestrutura",
    natureza: "Segurança física do ambiente",
    status: "Procedente",
    gravidade: "Alta",
    resumo:
      "Portão de acesso sem trava funcional no contraturno. Adequação incluída no plano da secretaria com prazo de 60 dias.",
    relato:
      "O portão principal permaneceria destravado durante as atividades do contraturno, com entrada e saída sem controle de quem circula pelo pátio. O relato menciona que a trava está quebrada há meses.",
    responsavel: "Márcia Torres · SIS-AV-0031",
    prazo: "02/07/2026",
    andamento: [
      {
        data: "02/06/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: "Canal público SIS",
      },
      {
        data: "03/06/2026",
        titulo: "Triagem concluída · gravidade alta",
        detalhe: "Risco de acesso não controlado a área com crianças. Apuração priorizada.",
        responsavel: "Coordenação de certificação SIS",
      },
      {
        data: "10/06/2026",
        titulo: "Vistoria presencial realizada",
        detalhe:
          "Trava eletrônica inoperante confirmada; controle de entrada feito apenas por funcionário no horário parcial.",
        responsavel: "Márcia Torres · SIS-AV-0031",
      },
      {
        data: "18/06/2026",
        titulo: "Apuração concluída · procedente",
        detalhe:
          "Adequação determinada e incluída no plano da secretaria, com reavaliação do eixo na próxima visita.",
        responsavel: "Coordenação de certificação SIS",
      },
    ],
    providencias: [
      "Substituição da trava do portão de acesso, com prazo de 60 dias.",
      "Registro de entrada e saída no contraturno até a conclusão da obra.",
      "Reavaliação do eixo Segurança predial e prevenção na próxima visita.",
    ],
    desfecho:
      "Procedente. A falha foi confirmada em vistoria e virou item prioritário do plano de adequação da rede.",
    impactoNoSelo: "Selo mantido sob plano de adequação com prazo de 60 dias.",
  },
  {
    protocolo: "DEN-2026-0203",
    instituicaoId: "clb-005",
    data: "21/06/2026",
    eixo: "Qualificação dos profissionais",
    categoria: "Supervisão de atividades",
    natureza: "Conduta ou qualificação de profissionais",
    status: "Em apuração",
    gravidade: "Alta",
    resumo:
      "Relato de turma de natação sem segundo profissional na borda. Avaliação extraordinária aberta.",
    relato:
      "Turmas de natação da faixa de 6 a 9 anos estariam sendo conduzidas por um único professor, sem segundo profissional na borda, contrariando a escala apresentada na avaliação inicial.",
    responsavel: "Rafael Prado · SIS-AV-0063",
    prazo: "21/07/2026",
    andamento: [
      {
        data: "21/06/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: "Canal público SIS",
      },
      {
        data: "22/06/2026",
        titulo: "Triagem concluída · gravidade alta",
        detalhe: "Risco de afogamento em atividade aquática. Apuração priorizada.",
        responsavel: "Coordenação de certificação SIS",
      },
      {
        data: "30/06/2026",
        titulo: "Avaliação extraordinária aberta",
        detalhe:
          "Visita presencial agendada para 15/07/2026, sem aviso do horário exato à unidade.",
        responsavel: "Rafael Prado · SIS-AV-0063",
      },
    ],
    providencias: [
      "Escala de profissionais das turmas de natação requisitada ao clube.",
      "Avaliação extraordinária aberta, com visita presencial em 15/07/2026.",
    ],
    desfecho: null,
    impactoNoSelo: "Selo em análise: a avaliação extraordinária pode alterar a nota do eixo.",
  },
  {
    protocolo: "DEN-2026-0211",
    instituicaoId: "cre-002",
    data: "26/06/2026",
    eixo: "Ambiente seguro e saudável",
    categoria: "Alimentação",
    natureza: "Higiene, alimentação ou salubridade",
    status: "Em apuração",
    gravidade: "Média",
    resumo:
      "Questionamento sobre armazenamento de alimentos na cozinha. Vistoria conjunta com a vigilância sanitária agendada.",
    relato:
      "Alimentos perecíveis estariam sendo mantidos fora da câmara fria por longos períodos durante o preparo do almoço, com a porta do equipamento aberta boa parte da manhã.",
    responsavel: "Camila Nunes · SIS-AV-0058",
    prazo: "26/07/2026",
    andamento: [
      {
        data: "26/06/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: "Canal público SIS",
      },
      {
        data: "27/06/2026",
        titulo: "Triagem concluída · gravidade média",
        detalhe: "Classificado no eixo Ambiente seguro e saudável, com prazo de 30 dias.",
        responsavel: "Coordenação de certificação SIS",
      },
      {
        data: "08/07/2026",
        titulo: "Vistoria conjunta agendada",
        detalhe:
          "Inspeção com a vigilância sanitária municipal marcada para 18/07/2026, com foco na cadeia de frio.",
        responsavel: "Camila Nunes · SIS-AV-0058",
      },
    ],
    providencias: [
      "Registros de temperatura da câmara fria solicitados à creche.",
      "Vistoria conjunta com a vigilância sanitária em 18/07/2026.",
    ],
    desfecho: null,
    impactoNoSelo: "Nenhuma alteração no selo até a conclusão da vistoria.",
  },
  {
    protocolo: "DEN-2026-0230",
    instituicaoId: "esc-101",
    data: "01/07/2026",
    eixo: "Proteção de dados de menores",
    categoria: "Uso de imagem",
    natureza: "Uso indevido de dados ou imagem de menores",
    status: "Recebida",
    gravidade: null,
    resumo:
      "Relato de publicação de fotos de turma em rede social sem autorização específica dos responsáveis.",
    relato:
      "Fotos de uma turma do 3º ano teriam sido publicadas no perfil da escola com rostos identificáveis, sem que os responsáveis tenham assinado autorização específica para uso de imagem.",
    responsavel: "Coordenação de certificação SIS",
    prazo: "31/07/2026",
    andamento: [
      {
        data: "01/07/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: "Canal público SIS",
      },
      {
        data: "02/07/2026",
        titulo: "Encaminhado para triagem",
        detalhe:
          "Na fila de classificação de gravidade; avaliador responsável ainda em designação.",
        responsavel: "Coordenação de certificação SIS",
      },
    ],
    providencias: [],
    desfecho: null,
    impactoNoSelo: "Nenhuma medida até a conclusão da triagem.",
  },
  {
    protocolo: "DEN-2026-0244",
    instituicaoId: "esc-104",
    data: "06/07/2026",
    eixo: "Acessibilidade e inclusão",
    categoria: "Acessibilidade física",
    natureza: "Falta de acessibilidade ou exclusão",
    status: "Em apuração",
    gravidade: "Média",
    resumo:
      "Rampa de acesso ao pátio com inclinação acima do previsto na norma. Medição técnica solicitada.",
    relato:
      "A rampa que liga o bloco de salas ao pátio teria inclinação acentuada demais para uso autônomo por cadeirante, obrigando alunos a serem carregados por funcionários.",
    responsavel: "Priscila Marques · SIS-AV-0071",
    prazo: "05/08/2026",
    andamento: [
      {
        data: "06/07/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: "Canal público SIS",
      },
      {
        data: "07/07/2026",
        titulo: "Triagem concluída · gravidade média",
        detalhe: "Classificado no eixo Acessibilidade e inclusão, com prazo de 30 dias.",
        responsavel: "Coordenação de certificação SIS",
      },
      {
        data: "14/07/2026",
        titulo: "Medição técnica solicitada",
        detalhe:
          "Verificação da inclinação conforme a NBR 9050 por profissional de acessibilidade credenciado.",
        responsavel: "Priscila Marques · SIS-AV-0071",
      },
    ],
    providencias: [
      "Medição da inclinação da rampa conforme a NBR 9050.",
      "Laudo de acessibilidade em vigor solicitado à instituição.",
    ],
    desfecho: null,
    impactoNoSelo: "Selo mantido enquanto a medição não é concluída.",
  },
  {
    protocolo: "DEN-2025-0918",
    instituicaoId: "esc-007",
    data: "09/09/2025",
    eixo: "Canais de escuta e denúncia",
    categoria: "Omissão em ocorrência grave",
    natureza: "Suspeita de maus-tratos ou negligência",
    status: "Procedente",
    gravidade: "Alta",
    resumo:
      "Ausência de encaminhamento de ocorrência ao conselho tutelar. Certificação suspensa após apuração.",
    relato:
      "Uma ocorrência grave envolvendo uma aluna teria sido tratada apenas internamente, sem a notificação obrigatória ao conselho tutelar prevista no ECA.",
    responsavel: "Diego Almeida · SIS-AV-0052",
    prazo: "09/10/2025",
    andamento: [
      {
        data: "09/09/2025",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: "Canal público SIS",
      },
      {
        data: "10/09/2025",
        titulo: "Triagem concluída · gravidade alta",
        detalhe:
          "Prioridade máxima: o relato trata de notificação obrigatória prevista no ECA, art. 13.",
        responsavel: "Coordenação de certificação SIS",
      },
      {
        data: "16/09/2025",
        titulo: "Avaliação extraordinária realizada",
        detalhe:
          "Visita presencial não localizou registro de encaminhamento ao conselho tutelar no período.",
        responsavel: "Diego Almeida · SIS-AV-0052",
      },
      {
        data: "25/09/2025",
        titulo: "Apuração concluída · procedente",
        detalhe: "Omissão confirmada. Caso comunicado ao conselho tutelar do município.",
        responsavel: "Coordenação de certificação SIS",
      },
      {
        data: "26/09/2025",
        titulo: "Certificação suspensa",
        detalhe: "Suspensão gravada na cadeia; a ficha pública da instituição passou a exibi-la.",
        responsavel: "Coordenação de certificação SIS",
      },
    ],
    providencias: [
      "Certificação suspensa até nova avaliação completa.",
      "Caso comunicado ao conselho tutelar do município.",
      "Revisão do protocolo interno de notificação como condição para reavaliação.",
    ],
    desfecho:
      "Procedente. A omissão de notificação foi confirmada e levou à suspensão do selo, visível na consulta pública.",
    impactoNoSelo: "Certificação suspensa em 26/09/2025.",
  },
  {
    protocolo: "DEN-2026-0119",
    instituicaoId: "esc-008",
    data: "11/05/2026",
    eixo: "Proteção de dados de menores",
    categoria: "Mediação de uso de tecnologia",
    natureza: "Uso indevido de dados ou imagem de menores",
    status: "Improcedente",
    gravidade: "Baixa",
    resumo:
      "Relato sobre acesso irrestrito à internet no laboratório. Verificado filtro de conteúdo ativo e registro de uso.",
    relato:
      "O laboratório de informática estaria liberando acesso irrestrito à internet nas aulas livres, sem filtro de conteúdo nem acompanhamento de professor.",
    responsavel: "Larissa Souza · SIS-AV-0044",
    prazo: "10/06/2026",
    andamento: [
      {
        data: "11/05/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: "Canal público SIS",
      },
      {
        data: "12/05/2026",
        titulo: "Triagem concluída · gravidade baixa",
        detalhe:
          "Rebaixado do piso médio da natureza informada: o relato aponta configuração técnica, sem menção a exposição de criança. Verificação documental, sem visita extraordinária.",
        responsavel: "Coordenação de certificação SIS",
      },
      {
        data: "21/05/2026",
        titulo: "Verificação técnica realizada",
        detalhe:
          "Filtro de conteúdo ativo, registro de uso por estação e escala de professor responsável confirmados.",
        responsavel: "Larissa Souza · SIS-AV-0044",
      },
      {
        data: "29/05/2026",
        titulo: "Apuração concluída · improcedente",
        detalhe: "Controles previstos no eixo estão em funcionamento. Nenhuma medida aplicada.",
        responsavel: "Coordenação de certificação SIS",
      },
    ],
    providencias: [
      "Nenhuma medida aplicada à instituição.",
      "Evento mantido no histórico permanente da unidade.",
    ],
    desfecho:
      "Improcedente. Os controles de mediação de uso de tecnologia estavam ativos e documentados.",
    impactoNoSelo: "Sem efeito sobre a certificação vigente.",
  },
  {
    protocolo: "DEN-2026-0251",
    instituicaoId: "cre-202",
    data: "10/07/2026",
    eixo: "Acessibilidade e inclusão",
    categoria: "Acolhimento de criança com deficiência",
    natureza: "Falta de acessibilidade ou exclusão",
    status: "Recebida",
    gravidade: null,
    resumo:
      "Relato de recusa de matrícula por falta de estrutura de acolhimento. Encaminhado para apuração pela rede gestora.",
    relato:
      "Uma família teria sido orientada a procurar outra unidade porque a creche não teria estrutura para acolher uma criança com deficiência, sem que a recusa fosse formalizada por escrito.",
    responsavel: "Coordenação de certificação SIS",
    prazo: "09/08/2026",
    andamento: [
      {
        data: "10/07/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: "Canal público SIS",
      },
      {
        data: "11/07/2026",
        titulo: "Encaminhado à rede gestora",
        detalhe:
          "Apuração conjunta com a rede, que responde pela política de matrícula das unidades.",
        responsavel: "Coordenação de certificação SIS",
      },
    ],
    providencias: [
      "Apuração conjunta com a rede gestora, que responde pela política de matrícula.",
    ],
    desfecho: null,
    impactoNoSelo: "Nenhuma medida até a conclusão da triagem.",
  },
];

export const denunciasDaInstituicao = (instituicaoId: string) =>
  denuncias.filter((d) => d.instituicaoId === instituicaoId);

export const denunciaPorProtocolo = new Map(denuncias.map((d) => [d.protocolo, d]));

/**
 * Como aquele nível de gravidade foi parar ali.
 *
 * A pergunta aparece sempre que alguém olha a fila: quem denuncia não
 * classifica nada, então a tela precisa dizer de onde veio o número — piso
 * automático da natureza, elevação por leitura do relato ou rebaixamento com
 * justificativa.
 */
export function origemDaGravidade(d: Denuncia) {
  const piso = pisoDeGravidade[d.natureza];

  if (d.gravidade === null) {
    return piso
      ? `Aguardando triagem · a natureza informada garante piso de gravidade ${piso.toLowerCase()}`
      : "Aguardando triagem · a natureza informada não define piso automático";
  }
  if (!piso) return "Definida na triagem, pela leitura do relato: esta natureza não tem piso";
  if (ordemDaGravidade[d.gravidade] > ordemDaGravidade[piso])
    return `Elevada na triagem pela leitura do relato · piso da natureza informada: ${piso.toLowerCase()}`;
  if (ordemDaGravidade[d.gravidade] < ordemDaGravidade[piso])
    return `Rebaixada na triagem com justificativa registrada · piso da natureza informada: ${piso.toLowerCase()}`;
  return "Piso automático da natureza informada, confirmado na triagem";
}

/** Denúncias em aberto — o que ainda demanda ação de alguém. */
export const denunciaEmAberto = (d: Denuncia) =>
  d.status === "Recebida" || d.status === "Em apuração";

export type Avaliador = {
  nome: string;
  formacao: string;
  registro: string;
  regiao: string;
  avaliacoes: number;
  status: "Ativo" | "Em formação" | "Inativo";
};

/** Rede de profissionais credenciados — visão exclusiva da equipe SIS. */
export const avaliadores: Avaliador[] = [
  {
    nome: "Márcia Torres",
    formacao: "Pedagoga",
    registro: "SIS-AV-0031",
    regiao: "SP · Interior",
    avaliacoes: 24,
    status: "Ativo",
  },
  {
    nome: "Larissa Souza",
    formacao: "Psicóloga",
    registro: "SIS-AV-0044",
    regiao: "RJ · Região metropolitana",
    avaliacoes: 19,
    status: "Ativo",
  },
  {
    nome: "Diego Almeida",
    formacao: "Psicólogo",
    registro: "SIS-AV-0052",
    regiao: "MG · Belo Horizonte",
    avaliacoes: 17,
    status: "Ativo",
  },
  {
    nome: "Camila Nunes",
    formacao: "Assistente social",
    registro: "SIS-AV-0058",
    regiao: "PR · Curitiba",
    avaliacoes: 14,
    status: "Ativo",
  },
  {
    nome: "Rafael Prado",
    formacao: "Educador físico",
    registro: "SIS-AV-0063",
    regiao: "CE · Fortaleza",
    avaliacoes: 11,
    status: "Ativo",
  },
  {
    nome: "João Bezerra",
    formacao: "Psicólogo",
    registro: "SIS-AV-0027",
    regiao: "RS · Porto Alegre",
    avaliacoes: 9,
    status: "Inativo",
  },
  {
    nome: "Priscila Marques",
    formacao: "Arquiteta · acessibilidade",
    registro: "SIS-AV-0071",
    regiao: "PE · Recife",
    avaliacoes: 2,
    status: "Em formação",
  },
];

export type RegistroBlockchain = {
  bloco: string;
  evento: string;
  data: string;
  hash: string;
  tipo: "certificacao" | "avaliacao" | "denuncia" | "renovacao" | "atualizacao";
  instituicaoId: string;
  /**
   * O que o evento registra — mesma chave usada para gerar o hash. Permite ir
   * da tela do assunto (uma etapa de denúncia, por exemplo) até o bloco.
   */
  referencia: string;
};

const rotuloTipoAvaliacao: Record<Avaliacao["tipo"], RegistroBlockchain["tipo"]> = {
  Inicial: "avaliacao",
  Renovação: "renovacao",
  Extraordinária: "avaliacao",
};

/**
 * Livro de registros da rede.
 *
 * Cada evento do ciclo — avaliação, emissão de selo, subselo, denúncia — vira
 * um registro. É construído a partir dos mesmos dados que alimentam as outras
 * telas, de forma que o histórico nunca conte uma versão diferente dos fatos.
 */
export const registros: RegistroBlockchain[] = [
  ...avaliacoes
    .filter((a) => a.status !== "Agendada")
    .map((a) => ({
      evento:
        a.status === "Reprovada"
          ? `Avaliação ${a.tipo.toLowerCase()} reprovada`
          : a.status === "Em andamento"
            ? `Avaliação ${a.tipo.toLowerCase()} iniciada`
            : `Avaliação ${a.tipo.toLowerCase()} registrada${a.pontuacao !== null ? ` com ${a.pontuacao} pontos` : ""}`,
      data: a.data,
      tipo: rotuloTipoAvaliacao[a.tipo],
      instituicaoId: a.instituicaoId,
      chave: a.id,
    })),
  ...certificacoes.map((c) => ({
    evento: `Certificação emitida para o nível ${c.nivel} · token ${c.token}`,
    data: c.emissao,
    tipo: "certificacao" as const,
    instituicaoId: c.instituicaoId,
    chave: `cert:${c.instituicaoId}`,
  })),
  ...institutions.flatMap((i) =>
    i.subselos.map((s) => ({
      evento: `Subselo concedido: ${s}`,
      data: i.ultimaAvaliacao,
      tipo: "atualizacao" as const,
      instituicaoId: i.id,
      chave: `sub:${i.id}:${s}`,
    })),
  ),
  /* Cada etapa da apuração entra na cadeia — é isso que permite à instituição
     acompanhar o andamento sem depender da palavra de quem apura. */
  ...denuncias.flatMap((d) =>
    d.andamento.map((e, i) => ({
      evento: `Denúncia ${d.protocolo} · ${e.titulo}`,
      data: e.data,
      tipo: "denuncia" as const,
      instituicaoId: d.instituicaoId,
      chave: `${d.protocolo}:${i}`,
    })),
  ),
]
  // Ordem cronológica dá o número de bloco; depois invertemos para exibir o
  // mais recente primeiro, sem que o bloco deixe de crescer com o tempo.
  .sort((a, b) => ordemPorData(a.data) - ordemPorData(b.data))
  .map((r, idx) => ({
    evento: r.evento,
    data: r.data,
    tipo: r.tipo,
    instituicaoId: r.instituicaoId,
    bloco: `#${10321 + idx * 7}`,
    hash: hashDemo(r.chave),
    referencia: r.chave,
  }))
  .reverse();

export const registrosDaInstituicao = (instituicaoId: string) =>
  registros.filter((r) => r.instituicaoId === instituicaoId);

export const registroPorReferencia = new Map(registros.map((r) => [r.referencia, r]));

/** Bloco que registrou uma etapa específica da apuração de uma denúncia. */
export const registroDaEtapa = (protocolo: string, indice: number) =>
  registroPorReferencia.get(`${protocolo}:${indice}`) ?? null;

/** Todos os blocos gerados por uma denúncia, do mais recente ao mais antigo. */
export const registrosDaDenuncia = (protocolo: string) =>
  registros.filter((r) => r.referencia.startsWith(`${protocolo}:`));

export type ItemPlano = {
  eixo: string;
  acao: string;
  base: string;
  prazo: string;
  status: "Em andamento" | "Pendente";
};

/** Ação recomendada por eixo quando a nota fica abaixo do patamar de referência. */
const acaoPorEixo: Record<string, string> = {
  "Ambiente seguro e saudável":
    "Revisar rotina de higiene, armazenamento de alimentos e registro de manutenção preventiva.",
  "Segurança predial e prevenção":
    "Atualizar laudo do corpo de bombeiros e sinalização de rotas de fuga; treinar a equipe em evacuação.",
  "Acessibilidade e inclusão":
    "Adequar rampas, sinalização tátil e banheiros conforme a LBI, com plano de atendimento individualizado.",
  "Qualificação dos profissionais":
    "Comprovar formação continuada em proteção infantil e regularizar a supervisão por turma.",
  "Proteção de dados de menores":
    "Publicar política de uso de imagem e dados, com termo específico por responsável e registro de acessos.",
  "Canais de escuta e denúncia":
    "Instalar canal de escuta acessível à criança e formalizar o fluxo de encaminhamento ao conselho tutelar.",
};

/**
 * Plano de adequação da instituição.
 *
 * Derivado das notas: todo eixo abaixo de 85 entra com uma ação recomendada. O
 * prazo é proporcional à distância do patamar — quanto menor a nota, mais curto
 * o prazo, porque é onde o risco à criança é maior.
 */
export const planoDeAdequacao = (inst: Institution): ItemPlano[] =>
  inst.criterios
    .filter((c) => c.nota < 85)
    .sort((a, b) => a.nota - b.nota)
    .map((c) => ({
      eixo: c.nome,
      acao: acaoPorEixo[c.nome] ?? "Revisar o eixo com o avaliador responsável.",
      base: c.base,
      prazo: c.nota < 70 ? "30 dias" : c.nota < 80 ? "60 dias" : "90 dias",
      status: c.nota < 75 ? "Em andamento" : "Pendente",
    }));

/** Consolidado de um conjunto de instituições — base dos painéis de rede e SIS. */
export const resumoDoConjunto = (lista: Institution[]) => {
  const comNota = lista.filter((i) => i.pontuacao !== null);
  const ids = new Set(lista.map((i) => i.id));
  const denunciasDoEscopo = denuncias.filter((d) => ids.has(d.instituicaoId));

  return {
    total: lista.length,
    certificadas: lista.filter((i) => i.status === "Certificada").length,
    emAvaliacao: lista.filter((i) => i.status === "Em avaliação").length,
    pendentes: lista.filter((i) => i.status === "Pendente").length,
    suspensas: lista.filter((i) => i.status === "Suspensa").length,
    porNivel: {
      Ouro: lista.filter((i) => i.nivel === "Ouro").length,
      Prata: lista.filter((i) => i.nivel === "Prata").length,
      Bronze: lista.filter((i) => i.nivel === "Bronze").length,
    } satisfies Record<Nivel, number>,
    media: comNota.length
      ? Math.round(comNota.reduce((s, i) => s + (i.pontuacao ?? 0), 0) / comNota.length)
      : null,
    subselos: lista.reduce((s, i) => s + i.subselos.length, 0),
    denuncias: denunciasDoEscopo.length,
    denunciasAbertas: denunciasDoEscopo.filter(denunciaEmAberto).length,
    avaliacoesAbertas: avaliacoes.filter(
      (a) => ids.has(a.instituicaoId) && a.status !== "Aprovada" && a.status !== "Reprovada",
    ).length,
  };
};

/** Média por eixo no conjunto — mostra onde a rede inteira está fraca. */
export const mediaPorEixo = (lista: Institution[]) =>
  eixos.map((e) => {
    const notas = lista.flatMap((i) =>
      i.criterios.filter((c) => c.nome === e.nome).map((c) => c.nota),
    );
    return {
      eixo: e.nome,
      base: e.base,
      media: notas.length ? Math.round(notas.reduce((s, n) => s + n, 0) / notas.length) : null,
    };
  });
