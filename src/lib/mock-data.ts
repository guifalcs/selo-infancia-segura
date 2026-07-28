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
    subselos: ["Acessibilidade PCD", "Escuta ativa"],
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
    subselos: ["Escuta ativa"],
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
    subselos: ["Acessibilidade PCD"],
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
    subselos: ["Inclusão", "Escuta ativa", "Educação digital segura"],
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
    ultimaAvaliacao: "—",
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
    subselos: ["Educação digital segura"],
    criterios: criterios([86, 85, 78, 88, 84, 83]),
  },
];

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

/** Subselos temáticos, conquistados em adição ao nível principal. */
export const subselos = [
  {
    nome: "Acessibilidade PCD",
    desc: "Infraestrutura e atendimento adequados a crianças com deficiência.",
  },
  {
    nome: "Inclusão",
    desc: "Políticas ativas de acolhimento à diversidade e combate à discriminação.",
  },
  {
    nome: "Escuta ativa",
    desc: "Canais estruturados de escuta de crianças, adolescentes e responsáveis.",
  },
  {
    nome: "Educação digital segura",
    desc: "Uso de tecnologia com proteção de dados e mediação adequada à idade.",
  },
];

/* ---------------------------------------------------------------------------
 * Dados do portal institucional (dashboard, auditorias, relatórios).
 * Mantidos com a mesma forma de antes para não quebrar as telas do portal,
 * que serão repaginadas na próxima etapa.
 * ------------------------------------------------------------------------ */

export const certifications = [
  { instituicao: "Escola Municipal Aurora", selo: "Selo Ouro", emissao: "12/03/2026" },
  { instituicao: "Creche Comunitária Primeiros Passos", selo: "Selo Prata", emissao: "05/02/2026" },
  { instituicao: "Centro Educacional Renascer", selo: "Selo Ouro", emissao: "18/01/2026" },
  { instituicao: "Clube Atlético Vale do Sol", selo: "Selo Bronze", emissao: "10/04/2026" },
  { instituicao: "Colégio Nova Geração", selo: "Selo Prata", emissao: "27/05/2026" },
  { instituicao: "Clínica Infantil Horizonte", selo: "Selo Prata", emissao: "14/11/2025" },
];

export const audits = [
  {
    instituicao: "Escola Municipal Aurora",
    responsavel: "Márcia Torres",
    data: "12/03/2026",
    status: "Aprovada",
  },
  {
    instituicao: "Clínica Infantil Horizonte",
    responsavel: "Diego Almeida",
    data: "22/06/2026",
    status: "Em andamento",
  },
  {
    instituicao: "Creche Comunitária Primeiros Passos",
    responsavel: "Larissa Souza",
    data: "05/02/2026",
    status: "Aprovada",
  },
  {
    instituicao: "Parque Recreativo Cidade Alegre",
    responsavel: "Rafael Prado",
    data: "01/07/2026",
    status: "Pendente",
  },
  {
    instituicao: "Clube Atlético Vale do Sol",
    responsavel: "Camila Nunes",
    data: "10/04/2026",
    status: "Aprovada",
  },
  {
    instituicao: "Instituto Cidadão do Amanhã",
    responsavel: "João Bezerra",
    data: "09/09/2025",
    status: "Reprovada",
  },
];

export type RegistroBlockchain = {
  bloco: string;
  evento: string;
  data: string;
  hash: string;
  tipo: "certificacao" | "avaliacao" | "denuncia" | "renovacao" | "atualizacao";
};

export const blockchainHistory: Record<string, RegistroBlockchain[]> = {
  default: [
    {
      bloco: "#10521",
      evento: "Certificação emitida — nível Ouro",
      data: "12/03/2026",
      hash: "0x8f2a…c41d",
      tipo: "certificacao",
    },
    {
      bloco: "#10548",
      evento: "Avaliação presencial registrada",
      data: "22/03/2026",
      hash: "0xa19b…77e2",
      tipo: "avaliacao",
    },
    {
      bloco: "#10570",
      evento: "Subselo de acessibilidade concedido",
      data: "04/04/2026",
      hash: "0x33d0…9f81",
      tipo: "atualizacao",
    },
    {
      bloco: "#10612",
      evento: "Denúncia recebida e encaminhada",
      data: "18/05/2026",
      hash: "0xbe45…2a09",
      tipo: "denuncia",
    },
    {
      bloco: "#10688",
      evento: "Denúncia apurada — sem irregularidade",
      data: "02/06/2026",
      hash: "0x71c8…40ab",
      tipo: "atualizacao",
    },
  ],
};
