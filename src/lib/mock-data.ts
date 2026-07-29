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
 *
 * Regra que vale para todo este arquivo: nada é escrito duas vezes. Pontuação,
 * certificação, avaliação e registro em cadeia são DERIVADOS das notas por eixo
 * e do modelo aplicado. Se uma tela mostra um número diferente de outra, é bug
 * de derivação, não divergência de dado.
 */

/**
 * Data de referência do protótipo.
 *
 * Prazos, vencimentos e "o que está atrasado" precisam de um hoje. Usar o
 * relógio real faria a demonstração envelhecer sozinha: um mês depois de
 * publicada, metade dos prazos apareceria vencida sem que ninguém tivesse
 * mexido em nada. Congelar a referência mantém o cenário coerente e deixa
 * explícito qual é o instante retratado.
 *
 * Ao ligar o backend, isto vira `new Date()` e nenhuma tela muda.
 */
export const DATA_DE_REFERENCIA = "28/07/2026";

/** Ano da data de referência — compõe protocolos e tokens. */
export const ANO_DE_REFERENCIA = Number(DATA_DE_REFERENCIA.slice(6));

export type Nivel = "Ouro" | "Prata" | "Bronze";

/**
 * Estágio da instituição no ciclo de certificação.
 *
 * `Aguardando emissão` existe porque avaliar e emitir são atos distintos: a
 * visita fecha com uma nota apurada, e a decisão de emitir o selo é da equipe
 * SIS. Sem esse estado, a instituição avaliada teria de aparecer como
 * "certificada" antes de existir certificado — que era exatamente o que fazia
 * a fila de emissão contradizer a tabela de selos.
 */
export type Status =
  "Certificada" | "Aguardando emissão" | "Em avaliação" | "Pendente" | "Suspensa";

/** Estados em que a instituição tem selo vigente e válido para consulta. */
export const temSeloVigente = (status: Status) => status === "Certificada";

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

/**
 * Patamar de referência de um eixo.
 *
 * Acima disso o eixo está resolvido; abaixo, entra no plano de adequação. É o
 * mesmo número que define a cor da barra de nota em toda a interface — duas
 * réguas diferentes para a mesma pergunta ("este eixo está bem?") fariam a tela
 * do plano contradizer o gráfico ao lado dela.
 */
export const PATAMAR_DE_REFERENCIA = 85;

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
  descricao: string;
  /**
   * Modelo de selo sob o qual a instituição foi avaliada. É ele que define os
   * pesos dos eixos, a nota de corte e a validade — e é a sigla dele que compõe
   * o token da certificação.
   */
  modeloId: string;
  ultimaAvaliacao: string;
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

/**
 * Base de instituições.
 *
 * Note que não há campo de nível, pontuação nem validade: os três são derivados
 * das notas por eixo e do modelo aplicado, logo abaixo. Guardar a nota final ao
 * lado das notas que a produzem é convite a divergência.
 */
export const institutions: Institution[] = [
  {
    id: "esc-001",
    nome: "Escola Municipal Aurora",
    tipo: "Escola",
    cidade: "São Paulo",
    uf: "SP",
    status: "Certificada",
    descricao:
      "Escola pública de ensino fundamental com programa de educação integral e política própria de proteção à criança.",
    modeloId: "mod-eb",
    ultimaAvaliacao: "12/03/2026",
    avaliador: "Márcia Torres · Pedagoga",
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
    descricao:
      "Creche conveniada que atende crianças de 0 a 3 anos em região de alta vulnerabilidade social.",
    modeloId: "mod-eb",
    ultimaAvaliacao: "05/02/2026",
    avaliador: "Larissa Souza · Psicóloga",
    subselos: ["Prevenção ao Bullying"],
    criterios: criterios([84, 78, 74, 86, 80, 84]),
  },
  {
    /* Avaliação fechada, selo ainda não emitido: é o caso que a fila de emissão
       do administrador existe para resolver. Enquanto a decisão não sai, a
       instituição não aparece como certificada em nenhuma tela. */
    id: "cli-003",
    nome: "Clínica Infantil Horizonte",
    tipo: "Clínica",
    cidade: "Belo Horizonte",
    uf: "MG",
    status: "Aguardando emissão",
    descricao: "Clínica pediátrica e de terapias multidisciplinares para crianças e adolescentes.",
    modeloId: "mod-st",
    ultimaAvaliacao: "22/06/2026",
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
    descricao:
      "Projeto social de contraturno escolar com oficinas de esporte, cultura e inclusão digital.",
    modeloId: "mod-el",
    ultimaAvaliacao: "18/01/2026",
    avaliador: "Camila Nunes · Assistente social",
    subselos: ["Inclusão TEA", "Prevenção ao Bullying", "Segurança Digital"],
    criterios: criterios([93, 88, 92, 90, 89, 94]),
  },
  {
    /* Acessibilidade exatamente no piso eliminatório do modelo: o caso que
       mostra que o piso por eixo existe e não é decorativo. Um ponto abaixo e
       não haveria emissão, ainda que a média continuasse acima do corte. */
    id: "clb-005",
    nome: "Clube Atlético Vale do Sol",
    tipo: "Clube esportivo",
    cidade: "Fortaleza",
    uf: "CE",
    status: "Certificada",
    descricao: "Clube com escolinhas de futebol, natação e ginástica para crianças e adolescentes.",
    modeloId: "mod-el",
    ultimaAvaliacao: "10/04/2026",
    avaliador: "Rafael Prado · Educador físico",
    subselos: [],
    criterios: criterios([72, 70, 60, 74, 62, 72]),
  },
  {
    id: "prq-006",
    nome: "Parque Recreativo Cidade Alegre",
    tipo: "Parque de diversões",
    cidade: "Salvador",
    uf: "BA",
    status: "Pendente",
    descricao:
      "Parque de diversões com brinquedos para faixas etárias distintas. Avaliação inicial agendada.",
    modeloId: "mod-el",
    ultimaAvaliacao: "-",
    avaliador: null,
    subselos: [],
    criterios: [],
  },
  {
    /* Suspensão só faz sentido sobre algo que existiu: as notas e a data abaixo
       são da certificação Bronze de 2025, que a cadeia mostra sendo emitida e
       depois suspensa. Sem a emissão no histórico, a ficha pública falaria de
       um selo cassado que nunca apareceu. */
    id: "cur-007",
    nome: "Instituto Cidadão do Amanhã",
    tipo: "Curso livre",
    cidade: "Porto Alegre",
    uf: "RS",
    status: "Suspensa",
    descricao:
      "Curso livre de reforço escolar e informática. Certificação Bronze suspensa em setembro de 2025, após apuração de denúncia sobre canais de escuta e notificação obrigatória.",
    modeloId: "mod-eb",
    ultimaAvaliacao: "14/03/2025",
    avaliador: "João Bezerra · Psicólogo",
    subselos: [],
    criterios: criterios([70, 64, 60, 72, 60, 66]),
  },
  {
    id: "esc-008",
    nome: "Colégio Nova Geração",
    tipo: "Escola",
    cidade: "Recife",
    uf: "PE",
    status: "Certificada",
    descricao:
      "Colégio de ensino fundamental e médio com programa de mentoria e letramento digital.",
    modeloId: "mod-eb",
    ultimaAvaliacao: "27/05/2026",
    avaliador: "Tiago Menezes · Pedagogo",
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
    descricao:
      "Maior escola da rede municipal, com ensino fundamental completo, biblioteca aberta à comunidade e núcleo de escuta permanente.",
    modeloId: "mod-eb",
    ultimaAvaliacao: "24/02/2026",
    avaliador: "Márcia Torres · Pedagoga",
    subselos: ["Acessibilidade", "Prevenção ao Bullying"],
    // Nível Ouro com dois eixos abaixo do patamar de referência: é o caso que
    // mostra que mesmo uma instituição bem avaliada mantém plano de adequação.
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
    descricao:
      "Centro de educação infantil em tempo integral para crianças de 1 a 4 anos, com equipe de referência por turma.",
    modeloId: "mod-eb",
    /* Primeira unidade certificada da rede municipal, na adesão de setembro de
       2025 — e por isso a que vence primeiro. É o caso que mostra a renovação
       chegando: sem uma certificação perto do vencimento, a fila de renovações
       da rede e do SIS ficaria sempre vazia e a validade de 12 meses seria
       apenas uma data decorativa na tela. */
    ultimaAvaliacao: "12/09/2025",
    avaliador: "Larissa Souza · Psicóloga",
    subselos: ["Inclusão TEA"],
    criterios: criterios([86, 82, 88, 84, 76, 82]),
    redeId: "rede-sv",
    acessoProprio: true,
  },
  {
    /* Certificada Bronze e, ao mesmo tempo, com avaliação extraordinária aberta
       pela denúncia procedente do portão. Selo vigente sob plano de adequação é
       o desenho do produto: reprovar não é a única resposta possível. */
    id: "esc-103",
    nome: "EMEF Vila Esperança",
    tipo: "Escola",
    cidade: "Serra Verde",
    uf: "SP",
    status: "Certificada",
    descricao:
      "Escola de ensino fundamental em bairro periférico, em processo de adequação predial acompanhado pela secretaria.",
    modeloId: "mod-eb",
    ultimaAvaliacao: "02/07/2026",
    avaliador: "Márcia Torres · Pedagoga",
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
    descricao:
      "Escola de ensino fundamental II com programa de contraturno esportivo e conselho escolar ativo.",
    modeloId: "mod-eb",
    ultimaAvaliacao: "11/05/2026",
    avaliador: "Márcia Torres · Pedagoga",
    subselos: ["Prevenção ao Bullying"],
    criterios: criterios([80, 76, 72, 82, 74, 84]),
    redeId: "rede-sv",
    acessoProprio: false,
  },
  {
    /* Visita em curso, sem nota fechada: é o que "Em avaliação" quer dizer. */
    id: "prj-105",
    nome: "Centro de Contraturno Semear",
    tipo: "Projeto social",
    cidade: "Serra Verde",
    uf: "SP",
    status: "Em avaliação",
    descricao:
      "Equipamento municipal de contraturno inaugurado em 2026. Primeira avaliação em curso, com visita presencial realizada em julho.",
    modeloId: "mod-el",
    ultimaAvaliacao: "-",
    avaliador: "Márcia Torres · Pedagoga",
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
    descricao:
      "Segunda unidade do grupo, com ensino fundamental e médio e laboratório de tecnologia educacional.",
    modeloId: "mod-eb",
    ultimaAvaliacao: "03/06/2026",
    avaliador: "Tiago Menezes · Pedagogo",
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
    descricao:
      "Berçário e educação infantil do grupo, com plano de adequação em acessibilidade em andamento.",
    modeloId: "mod-eb",
    ultimaAvaliacao: "19/04/2026",
    avaliador: "Tiago Menezes · Pedagogo",
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
 * Utilidades de data.
 * ------------------------------------------------------------------------ */

/** Data brasileira (dd/mm/aaaa) em número ordenável. `-` vira 0. */
export const ordemPorData = (data: string) => {
  const [d, m, a] = data.split("/");
  return a ? Number(a) * 10000 + Number(m) * 100 + Number(d) : 0;
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

const paraDate = (data: string) => {
  const [d, m, a] = data.split("/").map(Number);
  return a ? new Date(a, m - 1, d) : null;
};

/** Dias entre duas datas brasileiras. Negativo = a segunda já passou. */
export const diasEntre = (de: string, ate: string) => {
  const a = paraDate(de);
  const b = paraDate(ate);
  if (!a || !b) return null;
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
};

/** Dias até a data, contados da data de referência do protótipo. */
export const diasAPartirDeHoje = (data: string) => diasEntre(DATA_DE_REFERENCIA, data);

/** Uma data já passou em relação à referência do protótipo? */
export const jaPassou = (data: string) => {
  const d = diasAPartirDeHoje(data);
  return d !== null && d < 0;
};

/** Janela em que uma certificação entra em "renovação a preparar". */
export const DIAS_DE_ALERTA_DE_VALIDADE = 90;

export type SituacaoDaValidade = "Vigente" | "A vencer" | "Vencida";

/**
 * Situação temporal de uma validade.
 *
 * Um selo de 12 meses só significa algo se a plataforma souber dizer quando ele
 * está acabando. Sem isto, "validade 12/03/2027" é texto decorativo.
 */
export const situacaoDaValidade = (
  validade: string,
): { situacao: SituacaoDaValidade; dias: number } | null => {
  const dias = diasAPartirDeHoje(validade);
  if (dias === null) return null;
  if (dias < 0) return { situacao: "Vencida", dias };
  if (dias <= DIAS_DE_ALERTA_DE_VALIDADE) return { situacao: "A vencer", dias };
  return { situacao: "Vigente", dias };
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
  /** Corte de aprovação na média: abaixo disso não há emissão, só plano. */
  notaMinima: number;
  /**
   * Piso eliminatório por eixo.
   *
   * Média alta não compensa um eixo em ruína: uma escola com acessibilidade
   * zerada e todo o resto impecável ainda é uma escola que exclui criança com
   * deficiência. Sem este piso, o selo premiaria a média e ignoraria o risco
   * concentrado — que é justamente o que uma certificação de proteção infantil
   * não pode fazer.
   */
  notaMinimaPorEixo: number;
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

/**
 * Pesos iguais para os seis eixos padrão — ponto de partida de um modelo novo.
 *
 * 100 não divide por 6. O resto vai para o último eixo, e não para o primeiro,
 * para que a lista comece com o valor "redondo" que a pessoa espera ver.
 */
export const eixosComPesoIgual = (): EixoDoModelo[] => {
  const base = Math.floor(100 / eixos.length); // 16
  const resto = 100 - base * eixos.length; // 4
  return eixos.map((e, i) => ({
    nome: e.nome,
    base: e.base,
    peso: i === eixos.length - 1 ? base + resto : base,
  }));
};

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

export type ResultadoDaAvaliacao = {
  nota: number;
  /** `null` quando não há emissão: média abaixo do corte ou eixo abaixo do piso. */
  nivel: Nivel | null;
  /** Eixos que ficaram abaixo do piso eliminatório do modelo. */
  eixosReprovados: string[];
  /** Por que não houve emissão. `null` quando houve. */
  motivoDaReprovacao: "média abaixo do corte" | "eixo abaixo do piso eliminatório" | null;
};

/**
 * Apuração completa de uma avaliação contra um modelo.
 *
 * Única porta para transformar notas em selo: a média, o piso por eixo e o
 * corte entram na mesma conta, então nenhuma tela consegue conceder um nível
 * que outra tela recusaria.
 */
export function resultadoDaAvaliacao(
  modelo: ModeloCertificacao,
  notas: Record<string, number>,
): ResultadoDaAvaliacao {
  const nota = notaPonderada(modelo, notas);
  const eixosReprovados = modelo.eixos
    .filter((e) => (notas[e.nome] ?? 0) < modelo.notaMinimaPorEixo)
    .map((e) => e.nome);

  if (eixosReprovados.length) {
    return {
      nota,
      nivel: null,
      eixosReprovados,
      motivoDaReprovacao: "eixo abaixo do piso eliminatório",
    };
  }
  const nivel = nivelPorFaixa(modelo, nota);
  return {
    nota,
    nivel,
    eixosReprovados,
    motivoDaReprovacao: nivel ? null : "média abaixo do corte",
  };
}

/**
 * Modelos publicados pela equipe SIS.
 *
 * Três modelos cobrem os tipos de ambiente atendidos hoje. Os pesos mudam entre
 * eles de propósito: numa creche o ambiente físico pesa mais que o canal de
 * escuta, enquanto num curso livre online a proteção de dados é o eixo crítico.
 *
 * A faixa Bronze de cada modelo começa exatamente na nota de corte dele: uma
 * faixa que comece abaixo do corte descreveria um nível que nunca é concedido.
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
    notaMinimaPorEixo: 60,
    faixas: [
      { nivel: "Ouro", minimo: 90 },
      { nivel: "Prata", minimo: 75 },
      { nivel: "Bronze", minimo: 60 },
    ],
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
    notaMinimaPorEixo: 60,
    faixas: [
      { nivel: "Ouro", minimo: 90 },
      { nivel: "Prata", minimo: 75 },
      { nivel: "Bronze", minimo: 65 },
    ],
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
    notaMinimaPorEixo: 60,
    faixas: [
      { nivel: "Ouro", minimo: 90 },
      { nivel: "Prata", minimo: 75 },
      { nivel: "Bronze", minimo: 60 },
    ],
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
    id: "mod-ad",
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
    notaMinimaPorEixo: 60,
    faixas: [
      { nivel: "Ouro", minimo: 90 },
      { nivel: "Prata", minimo: 80 },
      { nivel: "Bronze", minimo: 70 },
    ],
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

export const modeloPorId = new Map(modelosIniciais.map((m) => [m.id, m]));

/** Modelo aplicável a um tipo de instituição — só entre os publicados. */
export const modelosParaTipo = (lista: ModeloCertificacao[], tipo: TipoInstituicao) =>
  lista.filter((m) => m.status === "Ativo" && m.tiposElegiveis.includes(tipo));

/* ---------------------------------------------------------------------------
 * Apuração das instituições da base.
 *
 * Nota, nível e validade saem daqui — uma vez, do modelo mais as notas por
 * eixo. Toda tela lê deste mapa em vez de guardar a própria cópia.
 * ------------------------------------------------------------------------ */

export type Apuracao = {
  modelo: ModeloCertificacao;
  /** `null` quando não há avaliação fechada (Pendente, Em avaliação). */
  nota: number | null;
  /** `null` quando não há selo (nem emitido, nem já emitido e suspenso). */
  nivel: Nivel | null;
  /** `null` quando não há certificação emitida. */
  validade: string | null;
  eixosReprovados: string[];
};

const apuracoes = new Map<string, Apuracao>(
  institutions.map((i) => {
    const modelo = modeloPorId.get(i.modeloId) ?? modelosIniciais[0];

    if (i.criterios.length === 0) {
      return [i.id, { modelo, nota: null, nivel: null, validade: null, eixosReprovados: [] }];
    }

    const notas = Object.fromEntries(i.criterios.map((c) => [c.nome, c.nota]));
    const { nota, nivel, eixosReprovados } = resultadoDaAvaliacao(modelo, notas);

    // "Aguardando emissão" tem nota apurada mas ainda não tem selo: o nível é
    // uma sugestão da régua, não um fato — por isso não vaza como `nivel`.
    const emitiu = i.status === "Certificada" || i.status === "Suspensa";

    return [
      i.id,
      {
        modelo,
        nota,
        nivel: emitiu ? nivel : null,
        validade: emitiu ? somarMeses(i.ultimaAvaliacao, modelo.validadeMeses) : null,
        eixosReprovados,
      },
    ];
  }),
);

export const apuracaoDaInstituicao = (id: string): Apuracao | null => apuracoes.get(id) ?? null;

/** Nota final apurada. `null` sem avaliação fechada. */
export const pontuacaoDaInstituicao = (id: string) => apuracoes.get(id)?.nota ?? null;

/** Nível do selo emitido. `null` quando não há emissão. */
export const nivelDaInstituicao = (id: string) => apuracoes.get(id)?.nivel ?? null;

/** Validade do selo emitido. `null` quando não há emissão. */
export const validadeDaInstituicao = (id: string) => apuracoes.get(id)?.validade ?? null;

/**
 * Nível que a régua do modelo sugere para uma nota já apurada.
 *
 * É o que a fila de emissão mostra: a decisão ainda é da equipe SIS, então a
 * tela sugere sem afirmar que o selo existe.
 */
export const nivelSugerido = (id: string): Nivel | null => {
  const a = apuracoes.get(id);
  if (!a || a.nota === null || a.eixosReprovados.length) return null;
  return nivelPorFaixa(a.modelo, a.nota);
};

/**
 * Descrição pública de cada nível.
 *
 * A faixa inferior do Bronze não é fixa: cada modelo define a própria nota de
 * corte (60 na educação básica, 65 em saúde, 70 no rascunho digital). Dizer
 * "60 a 74" para todos faria a home contradizer o catálogo de modelos.
 */
export const niveis: { nivel: Nivel; faixa: string; resumo: string }[] = [
  {
    nivel: "Bronze",
    faixa: "da nota de corte até 74 pontos",
    resumo:
      "Requisitos essenciais de segurança atendidos, com nenhum eixo abaixo do piso eliminatório. A instituição tem plano de adequação ativo para os eixos com menor nota.",
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

/** Faixa de corte de cada modelo ativo — usada na home para não fixar o 60. */
export const cortesDosModelosAtivos = () =>
  modelosIniciais
    .filter((m) => m.status === "Ativo")
    .map((m) => ({ nome: m.nome, codigo: m.codigo, corte: m.notaMinima }));

/* ---------------------------------------------------------------------------
 * Dados operacionais do portal institucional.
 *
 * Tudo aqui é derivado ou vinculado por `instituicaoId`, nunca por nome: as
 * telas do portal filtram por escopo (uma unidade, uma rede, ou a base
 * inteira), e casar registros por string de nome quebraria no primeiro
 * homônimo — "Colégio Nova Geração" e sua segunda unidade, por exemplo.
 * ------------------------------------------------------------------------ */

export type StatusCertificacao = "Ativa" | "A vencer" | "Vencida" | "Suspensa";

export type Certificacao = {
  instituicaoId: string;
  nivel: Nivel;
  pontuacao: number;
  emissao: string;
  validade: string;
  status: StatusCertificacao;
  /** Dias até o vencimento, contados da data de referência. Negativo = vencida. */
  diasParaVencer: number;
  modeloId: string;
  modeloCodigo: string;
  modeloVersao: number;
  /** Token emitido na rede — é ele que a família consulta no portal público. */
  token: string;
  hash: string;
};

/**
 * Certificações emitidas, derivadas das instituições que têm selo.
 *
 * Inclui as suspensas: um selo cassado continua tendo existido, e é isso que a
 * cadeia precisa contar. O que muda é o `status`, nunca a existência do
 * registro.
 *
 * O token carrega a sigla do modelo (`SIS-EB-2026-0001`) porque é o modelo que
 * diz sob qual régua aquele selo foi concedido. Um token sem essa informação
 * não permitiria auditar a emissão anos depois, quando a régua já mudou.
 */
export const certificacoes: Certificacao[] = (() => {
  const comSelo = institutions
    .filter((i) => i.status === "Certificada" || i.status === "Suspensa")
    .sort((a, b) => ordemPorData(a.ultimaAvaliacao) - ordemPorData(b.ultimaAvaliacao));

  const sequencial = new Map<string, number>();

  return comSelo.map((i) => {
    const a = apuracoes.get(i.id)!;
    const validade = a.validade!;
    const chaveSeq = `${a.modelo.codigo}-${i.ultimaAvaliacao.slice(6)}`;
    const n = (sequencial.get(chaveSeq) ?? 0) + 1;
    sequencial.set(chaveSeq, n);

    const temporal = situacaoDaValidade(validade)!;
    const status: StatusCertificacao =
      i.status === "Suspensa"
        ? "Suspensa"
        : temporal.situacao === "Vencida"
          ? "Vencida"
          : temporal.situacao === "A vencer"
            ? "A vencer"
            : "Ativa";

    return {
      instituicaoId: i.id,
      nivel: a.nivel!,
      pontuacao: a.nota!,
      emissao: i.ultimaAvaliacao,
      validade,
      status,
      diasParaVencer: temporal.dias,
      modeloId: a.modelo.id,
      modeloCodigo: a.modelo.codigo,
      modeloVersao: a.modelo.versao,
      token: `${chaveSeq}-${String(n).padStart(4, "0")}`,
      hash: hashDemo(`cert:${i.id}`),
    };
  });
})();

export const certificacaoDaInstituicao = (instituicaoId: string) =>
  certificacoes.find((c) => c.instituicaoId === instituicaoId) ?? null;

/* ---------------------------------------------------------------------------
 * Avaliadores credenciados.
 * ------------------------------------------------------------------------ */

export type Avaliador = {
  nome: string;
  formacao: string;
  registro: string;
  /** UFs que o credenciamento cobre. Vazio = perícia nacional sob demanda. */
  ufs: string[];
  regiao: string;
  status: "Ativo" | "Em formação" | "Inativo";
};

/**
 * Rede de profissionais credenciados — visão exclusiva da equipe SIS.
 *
 * Duas regras que a base tem de respeitar, porque a interface as afirma:
 *
 *   1. quem assina uma avaliação está `Ativo` (ou estava, no caso de registro
 *      histórico de alguém hoje inativo). Profissional `Em formação` não assina;
 *   2. a visita cai na UF que o credenciamento do profissional cobre. A exceção
 *      é a perícia de acessibilidade, que é acionada por especialidade e não por
 *      região — e por isso tem `ufs` vazio, explicitamente.
 *
 * O contador de avaliações não é digitado: sai de `avaliacoes`. Número escrito
 * à mão aqui divergiria da lista na primeira alteração de cenário.
 */
export const avaliadores: Avaliador[] = [
  {
    nome: "Márcia Torres",
    formacao: "Pedagoga",
    registro: "SIS-AV-0031",
    ufs: ["SP"],
    regiao: "SP · Capital e interior",
    status: "Ativo",
  },
  {
    nome: "Larissa Souza",
    formacao: "Psicóloga",
    registro: "SIS-AV-0044",
    ufs: ["RJ", "SP"],
    regiao: "RJ e SP · Região metropolitana",
    status: "Ativo",
  },
  {
    nome: "Diego Almeida",
    formacao: "Psicólogo",
    registro: "SIS-AV-0052",
    ufs: ["MG"],
    regiao: "MG · Belo Horizonte",
    status: "Ativo",
  },
  {
    nome: "Camila Nunes",
    formacao: "Assistente social",
    registro: "SIS-AV-0058",
    ufs: ["PR", "SC"],
    regiao: "PR e SC · Sul",
    status: "Ativo",
  },
  {
    nome: "Rafael Prado",
    formacao: "Educador físico",
    registro: "SIS-AV-0063",
    ufs: ["CE"],
    regiao: "CE · Fortaleza",
    status: "Ativo",
  },
  {
    nome: "Tiago Menezes",
    formacao: "Pedagogo",
    registro: "SIS-AV-0067",
    ufs: ["PE"],
    regiao: "PE · Região metropolitana",
    status: "Ativo",
  },
  {
    nome: "Beatriz Coelho",
    formacao: "Psicóloga",
    registro: "SIS-AV-0069",
    ufs: ["BA"],
    regiao: "BA · Salvador",
    status: "Ativo",
  },
  {
    /* Perícia de acessibilidade: acionada pela especialidade, em qualquer UF.
       É o único credenciamento sem recorte regional, e é assim de propósito —
       medição conforme a NBR 9050 exige formação que a rede regional não tem. */
    nome: "Priscila Marques",
    formacao: "Arquiteta · acessibilidade",
    registro: "SIS-AV-0071",
    ufs: [],
    regiao: "Nacional · perícia de acessibilidade",
    status: "Ativo",
  },
  {
    nome: "João Bezerra",
    formacao: "Psicólogo",
    registro: "SIS-AV-0027",
    ufs: ["RS"],
    regiao: "RS · Porto Alegre",
    status: "Inativo",
  },
  {
    nome: "Nataniel Vieira",
    formacao: "Assistente social",
    registro: "SIS-AV-0078",
    ufs: ["GO"],
    regiao: "GO · Goiânia",
    status: "Em formação",
  },
];

export const avaliadorPorNome = new Map(avaliadores.map((a) => [a.nome, a]));

/** Rótulo completo de um avaliador, como aparece assinando uma avaliação. */
export const rotuloDoAvaliador = (nome: string) => {
  const a = avaliadorPorNome.get(nome);
  return a ? `${a.nome} · ${a.formacao}` : nome;
};

/** Identificação com registro, usada na apuração de denúncia. */
export const responsavelDaApuracao = (nome: string) => {
  const a = avaliadorPorNome.get(nome);
  return a ? `${a.nome} · ${a.registro}` : nome;
};

export type StatusAvaliacao = "Aprovada" | "Em andamento" | "Agendada" | "Reprovada";

export type Avaliacao = {
  id: string;
  instituicaoId: string;
  avaliador: string;
  data: string;
  tipo: "Inicial" | "Renovação" | "Extraordinária";
  status: StatusAvaliacao;
  pontuacao: number | null;
  /** Por que esta visita existe. Aparece no histórico da unidade. */
  motivo?: string;
};

/**
 * Avaliação que fechou com nota — a que sustenta o selo (ou a suspensão) atual.
 *
 * Derivada da instituição: a nota é a mesma da apuração, então a tela de
 * avaliações não pode mostrar um número diferente da tela de certificações.
 */
const avaliacoesFechadas: Avaliacao[] = institutions
  .filter((i) => i.criterios.length > 0 && i.ultimaAvaliacao !== "-")
  .map((i) => ({
    id: `av-${i.id}-1`,
    instituicaoId: i.id,
    avaliador: i.avaliador!.split(" · ")[0],
    data: i.ultimaAvaliacao,
    tipo: "Inicial" as const,
    status: "Aprovada" as const,
    pontuacao: apuracoes.get(i.id)!.nota,
  }));

/**
 * Visitas em curso, agendadas e extraordinárias.
 *
 * Toda extraordinária aqui tem uma denúncia procedente atrás dela, e toda
 * renovação está marcada antes do vencimento do selo que renova — as duas
 * coisas que a tela de avaliações afirma sobre a agenda.
 */
const avaliacoesAbertas: Avaliacao[] = [
  /* Primeira avaliação em curso: visita feita, nota não fechada. */
  {
    id: "av-prj-105-1",
    instituicaoId: "prj-105",
    avaliador: "Márcia Torres",
    data: "20/07/2026",
    tipo: "Inicial",
    status: "Em andamento",
    pontuacao: null,
    motivo: "Primeira avaliação da unidade, inaugurada em 2026.",
  },
  /* Nunca avaliado: visita marcada. */
  {
    id: "av-prq-006-1",
    instituicaoId: "prq-006",
    avaliador: "Beatriz Coelho",
    data: "12/08/2026",
    tipo: "Inicial",
    status: "Agendada",
    pontuacao: null,
    motivo: "Primeira avaliação após adesão do parque.",
  },
  /* Extraordinária aberta pela DEN-2026-0203 (turma de natação sem segundo
     profissional na borda). Educador físico, na UF do clube. */
  {
    id: "av-clb-005-2",
    instituicaoId: "clb-005",
    avaliador: "Rafael Prado",
    data: "15/07/2026",
    tipo: "Extraordinária",
    status: "Em andamento",
    pontuacao: null,
    motivo: "Aberta pela denúncia DEN-2026-0203, sobre supervisão em atividade aquática.",
  },
  /* Extraordinária aberta pela DEN-2026-0187 (portão sem trava), procedente:
     reavaliação do eixo de segurança predial, como consta nas providências. */
  {
    id: "av-esc-103-2",
    instituicaoId: "esc-103",
    avaliador: "Márcia Torres",
    data: "22/07/2026",
    tipo: "Extraordinária",
    status: "Em andamento",
    pontuacao: null,
    motivo: "Reavaliação do eixo de segurança predial determinada na DEN-2026-0187.",
  },
  /* Extraordinária de perícia de acessibilidade, aberta pela DEN-2026-0244:
     medição da rampa conforme a NBR 9050. É visita técnica de especialidade, e
     por isso não segue o recorte regional dos credenciados. */
  {
    id: "av-esc-104-2",
    instituicaoId: "esc-104",
    avaliador: "Priscila Marques",
    data: "14/07/2026",
    tipo: "Extraordinária",
    status: "Em andamento",
    pontuacao: null,
    motivo: "Medição de acessibilidade determinada na DEN-2026-0244, conforme a NBR 9050.",
  },
  /* Renovações: marcadas antes do vencimento de cada selo. */
  {
    id: "av-cre-102-2",
    instituicaoId: "cre-102",
    avaliador: "Larissa Souza",
    data: "20/08/2026",
    tipo: "Renovação",
    status: "Agendada",
    pontuacao: null,
    motivo: "Selo vence em 12/09/2026: é a primeira renovação da rede municipal.",
  },
  {
    id: "av-cre-002-2",
    instituicaoId: "cre-002",
    avaliador: "Larissa Souza",
    data: "02/02/2027",
    tipo: "Renovação",
    status: "Agendada",
    pontuacao: null,
    motivo: "Selo vence em 05/02/2027.",
  },
  {
    id: "av-esc-101-2",
    instituicaoId: "esc-101",
    avaliador: "Márcia Torres",
    data: "20/02/2027",
    tipo: "Renovação",
    status: "Agendada",
    pontuacao: null,
    motivo: "Selo vence em 24/02/2027.",
  },
  {
    id: "av-esc-001-2",
    instituicaoId: "esc-001",
    avaliador: "Márcia Torres",
    data: "09/03/2027",
    tipo: "Renovação",
    status: "Agendada",
    pontuacao: null,
    motivo: "Selo vence em 12/03/2027.",
  },
];

/**
 * Extraordinária que levou à suspensão do Instituto Cidadão do Amanhã.
 *
 * Fica separada porque é a única avaliação reprovada da base, e é ela que
 * justifica a suspensão que a cadeia pública mostra. Sem este registro, a ficha
 * falaria de um selo cassado sem dizer por qual visita.
 */
const avaliacaoDaSuspensao: Avaliacao = {
  id: "av-cur-007-2",
  instituicaoId: "cur-007",
  avaliador: "João Bezerra",
  data: "16/09/2025",
  tipo: "Extraordinária",
  status: "Reprovada",
  pontuacao: null,
  motivo: "Aberta pela denúncia DEN-2025-0918, sobre omissão de notificação obrigatória.",
};

export const avaliacoes: Avaliacao[] = [
  ...avaliacoesFechadas,
  avaliacaoDaSuspensao,
  ...avaliacoesAbertas,
].sort((a, b) => ordemPorData(b.data) - ordemPorData(a.data));

export const avaliacoesDaInstituicao = (instituicaoId: string) =>
  avaliacoes.filter((a) => a.instituicaoId === instituicaoId);

/** Avaliações que o profissional já assinou na plataforma. */
export const avaliacoesAssinadas = (nome: string) =>
  avaliacoes.filter((a) => a.avaliador === nome && a.status !== "Agendada").length;

/** Visitas ainda abertas na mão do profissional. */
export const avaliacoesEmAberto = (nome: string) =>
  avaliacoes.filter(
    (a) => a.avaliador === nome && (a.status === "Agendada" || a.status === "Em andamento"),
  ).length;

/* ---------------------------------------------------------------------------
 * Denúncias.
 * ------------------------------------------------------------------------ */

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

/** Naturezas na ordem em que o canal público as apresenta. */
export const naturezasDeDenuncia = [
  "Segurança física do ambiente",
  "Suspeita de maus-tratos ou negligência",
  "Conduta ou qualificação de profissionais",
  "Falta de acessibilidade ou exclusão",
  "Higiene, alimentação ou salubridade",
  "Uso indevido de dados ou imagem de menores",
  "Outra irregularidade",
] as const satisfies readonly NaturezaDenuncia[];

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

const CANAL = "Canal público SIS";
const COORD = "Coordenação de certificação SIS";

/**
 * Denúncias registradas pelo canal público.
 *
 * O portal mostra o teor, o andamento e o efeito sobre o selo. A autoria fica
 * fora da base: não é um campo escondido na interface, é dado que o canal não
 * guarda.
 *
 * Duas invariantes de cenário, verificadas contra `DATA_DE_REFERENCIA`:
 * nenhum caso em aberto tem prazo vencido sem etapa de prorrogação, e nenhuma
 * visita marcada para o passado ficou sem a etapa que a registra.
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
    responsavel: responsavelDaApuracao("Larissa Souza"),
    prazo: "17/06/2026",
    andamento: [
      {
        data: "18/05/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: CANAL,
      },
      {
        data: "20/05/2026",
        titulo: "Triagem concluída · gravidade média",
        detalhe:
          "Classificado no eixo Canais de escuta e denúncia, com prazo de apuração de 30 dias.",
        responsavel: COORD,
      },
      {
        data: "28/05/2026",
        titulo: "Documentação solicitada à instituição",
        detalhe:
          "Livro de ocorrências e comprovantes de comunicação às famílias no período foram requisitados.",
        responsavel: responsavelDaApuracao("Larissa Souza"),
      },
      {
        data: "05/06/2026",
        titulo: "Apuração concluída · improcedente",
        detalhe:
          "Registros mostram atendimento em 48 horas e duas comunicações às famílias, ambas datadas.",
        responsavel: COORD,
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
    responsavel: responsavelDaApuracao("Márcia Torres"),
    prazo: "02/07/2026",
    andamento: [
      {
        data: "02/06/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: CANAL,
      },
      {
        data: "03/06/2026",
        titulo: "Triagem concluída · gravidade alta",
        detalhe: "Risco de acesso não controlado a área com crianças. Apuração priorizada.",
        responsavel: COORD,
      },
      {
        data: "10/06/2026",
        titulo: "Vistoria presencial realizada",
        detalhe:
          "Trava eletrônica inoperante confirmada; controle de entrada feito apenas por funcionário no horário parcial.",
        responsavel: responsavelDaApuracao("Márcia Torres"),
      },
      {
        data: "18/06/2026",
        titulo: "Apuração concluída · procedente",
        detalhe:
          "Adequação determinada e incluída no plano da secretaria, com reavaliação do eixo na próxima visita.",
        responsavel: COORD,
      },
      {
        data: "22/07/2026",
        titulo: "Avaliação extraordinária aberta",
        detalhe:
          "Reavaliação do eixo Segurança predial e prevenção iniciada, conforme providência determinada.",
        responsavel: responsavelDaApuracao("Márcia Torres"),
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
      "Relato de turma de natação sem segundo profissional na borda. Avaliação extraordinária realizada; laudo em análise.",
    relato:
      "Turmas de natação da faixa de 6 a 9 anos estariam sendo conduzidas por um único professor, sem segundo profissional na borda, contrariando a escala apresentada na avaliação inicial.",
    responsavel: responsavelDaApuracao("Rafael Prado"),
    /* Prorrogado com etapa registrada: prazo em aberto nunca vence em silêncio. */
    prazo: "20/08/2026",
    andamento: [
      {
        data: "21/06/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: CANAL,
      },
      {
        data: "22/06/2026",
        titulo: "Triagem concluída · gravidade alta",
        detalhe: "Risco de afogamento em atividade aquática. Apuração priorizada.",
        responsavel: COORD,
      },
      {
        data: "30/06/2026",
        titulo: "Avaliação extraordinária aberta",
        detalhe:
          "Visita presencial agendada para 15/07/2026, sem aviso do horário exato à unidade.",
        responsavel: responsavelDaApuracao("Rafael Prado"),
      },
      {
        data: "15/07/2026",
        titulo: "Avaliação extraordinária realizada",
        detalhe:
          "Duas das quatro turmas observadas estavam com um único profissional na borda. Escala e folhas de ponto do período recolhidas.",
        responsavel: responsavelDaApuracao("Rafael Prado"),
      },
      {
        data: "20/07/2026",
        titulo: "Prazo de apuração prorrogado por 30 dias",
        detalhe:
          "Prorrogação registrada na cadeia: a análise depende do cruzamento entre escala apresentada e folhas de ponto dos três últimos meses.",
        responsavel: COORD,
      },
    ],
    providencias: [
      "Escala de profissionais das turmas de natação requisitada ao clube.",
      "Avaliação extraordinária realizada em 15/07/2026.",
      "Segundo profissional na borda exigido em todas as turmas até a conclusão da apuração.",
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
    status: "Procedente",
    gravidade: "Média",
    resumo:
      "Falha na cadeia de frio confirmada em vistoria conjunta com a vigilância sanitária. Adequação com prazo de 30 dias.",
    relato:
      "Alimentos perecíveis estariam sendo mantidos fora da câmara fria por longos períodos durante o preparo do almoço, com a porta do equipamento aberta boa parte da manhã.",
    responsavel: responsavelDaApuracao("Larissa Souza"),
    prazo: "26/07/2026",
    andamento: [
      {
        data: "26/06/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: CANAL,
      },
      {
        data: "27/06/2026",
        titulo: "Triagem concluída · gravidade média",
        detalhe: "Classificado no eixo Ambiente seguro e saudável, com prazo de 30 dias.",
        responsavel: COORD,
      },
      {
        data: "08/07/2026",
        titulo: "Vistoria conjunta agendada",
        detalhe:
          "Inspeção com a vigilância sanitária municipal marcada para 18/07/2026, com foco na cadeia de frio.",
        responsavel: responsavelDaApuracao("Larissa Souza"),
      },
      {
        data: "18/07/2026",
        titulo: "Vistoria conjunta realizada",
        detalhe:
          "Registro de temperatura incompleto em 9 dos 30 dias analisados e vedação da porta da câmara fria danificada.",
        responsavel: responsavelDaApuracao("Larissa Souza"),
      },
      {
        data: "24/07/2026",
        titulo: "Apuração concluída · procedente",
        detalhe:
          "Falha confirmada. Adequação determinada com prazo de 30 dias e acompanhamento na próxima visita.",
        responsavel: COORD,
      },
    ],
    providencias: [
      "Troca da vedação da câmara fria, com prazo de 30 dias.",
      "Planilha diária de temperatura com conferência assinada por responsável de turno.",
      "Reavaliação do eixo Ambiente seguro e saudável na renovação de fevereiro de 2027.",
    ],
    desfecho:
      "Procedente. A falha na cadeia de frio foi confirmada em vistoria conjunta e gerou adequação com prazo, sem suspensão do selo.",
    impactoNoSelo: "Selo mantido sob plano de adequação com prazo de 30 dias.",
  },
  {
    protocolo: "DEN-2026-0230",
    instituicaoId: "esc-101",
    data: "01/07/2026",
    eixo: "Proteção de dados de menores",
    categoria: "Uso de imagem",
    natureza: "Uso indevido de dados ou imagem de menores",
    status: "Em apuração",
    gravidade: "Média",
    resumo:
      "Relato de publicação de fotos de turma em rede social sem autorização específica dos responsáveis. Termos de autorização em conferência.",
    relato:
      "Fotos de uma turma do 3º ano teriam sido publicadas no perfil da escola com rostos identificáveis, sem que os responsáveis tenham assinado autorização específica para uso de imagem.",
    responsavel: responsavelDaApuracao("Márcia Torres"),
    prazo: "31/07/2026",
    andamento: [
      {
        data: "01/07/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: CANAL,
      },
      {
        data: "03/07/2026",
        titulo: "Triagem concluída · gravidade média",
        detalhe:
          "Piso automático da natureza informada confirmado: não há menção a exposição de dado sensível além da imagem.",
        responsavel: COORD,
      },
      {
        data: "13/07/2026",
        titulo: "Termos de autorização requisitados",
        detalhe:
          "Autorizações de uso de imagem da turma e política de redes sociais da unidade solicitadas à direção.",
        responsavel: responsavelDaApuracao("Márcia Torres"),
      },
      {
        data: "24/07/2026",
        titulo: "Conferência documental em andamento",
        detalhe:
          "22 dos 27 termos da turma foram apresentados. A unidade tem até 29/07/2026 para completar ou remover as publicações.",
        responsavel: responsavelDaApuracao("Márcia Torres"),
      },
    ],
    providencias: [
      "Apresentação dos termos de autorização de uso de imagem de toda a turma.",
      "Remoção das publicações cujos termos não forem localizados.",
    ],
    desfecho: null,
    impactoNoSelo: "Nenhuma alteração no selo até a conclusão da apuração.",
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
      "Rampa de acesso ao pátio com inclinação acima do previsto na norma. Medição técnica solicitada à perícia de acessibilidade.",
    relato:
      "A rampa que liga o bloco de salas ao pátio teria inclinação acentuada demais para uso autônomo por cadeirante, obrigando alunos a serem carregados por funcionários.",
    responsavel: responsavelDaApuracao("Priscila Marques"),
    prazo: "05/08/2026",
    andamento: [
      {
        data: "06/07/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: CANAL,
      },
      {
        data: "07/07/2026",
        titulo: "Triagem concluída · gravidade média",
        detalhe: "Classificado no eixo Acessibilidade e inclusão, com prazo de 30 dias.",
        responsavel: COORD,
      },
      {
        data: "14/07/2026",
        titulo: "Medição técnica solicitada",
        detalhe:
          "Verificação da inclinação conforme a NBR 9050 encaminhada à perícia de acessibilidade, acionada por especialidade e não por região.",
        responsavel: responsavelDaApuracao("Priscila Marques"),
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
    instituicaoId: "cur-007",
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
    responsavel: responsavelDaApuracao("João Bezerra"),
    prazo: "09/10/2025",
    andamento: [
      {
        data: "09/09/2025",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: CANAL,
      },
      {
        data: "10/09/2025",
        titulo: "Triagem concluída · gravidade alta",
        detalhe:
          "Prioridade máxima: o relato trata de notificação obrigatória prevista no ECA, art. 13.",
        responsavel: COORD,
      },
      {
        data: "16/09/2025",
        titulo: "Avaliação extraordinária realizada",
        detalhe:
          "Visita presencial não localizou registro de encaminhamento ao conselho tutelar no período.",
        responsavel: responsavelDaApuracao("João Bezerra"),
      },
      {
        data: "25/09/2025",
        titulo: "Apuração concluída · procedente",
        detalhe: "Omissão confirmada. Caso comunicado ao conselho tutelar do município.",
        responsavel: COORD,
      },
      {
        data: "26/09/2025",
        titulo: "Certificação suspensa",
        detalhe: "Suspensão gravada na cadeia; a ficha pública da instituição passou a exibi-la.",
        responsavel: COORD,
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
    responsavel: responsavelDaApuracao("Tiago Menezes"),
    prazo: "10/06/2026",
    andamento: [
      {
        data: "11/05/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: CANAL,
      },
      {
        data: "12/05/2026",
        titulo: "Triagem concluída · gravidade baixa",
        detalhe:
          "Rebaixado do piso médio da natureza informada: o relato aponta configuração técnica, sem menção a exposição de criança. Verificação documental, sem visita extraordinária.",
        responsavel: COORD,
      },
      {
        data: "21/05/2026",
        titulo: "Verificação técnica realizada",
        detalhe:
          "Filtro de conteúdo ativo, registro de uso por estação e escala de professor responsável confirmados.",
        responsavel: responsavelDaApuracao("Tiago Menezes"),
      },
      {
        data: "29/05/2026",
        titulo: "Apuração concluída · improcedente",
        detalhe: "Controles previstos no eixo estão em funcionamento. Nenhuma medida aplicada.",
        responsavel: COORD,
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
    /* Único caso ainda sem triagem, e recente de propósito: é o que demonstra
       que a gravidade não existe antes da classificação do SIS. */
    protocolo: "DEN-2026-0251",
    instituicaoId: "cre-202",
    data: "24/07/2026",
    eixo: "Acessibilidade e inclusão",
    categoria: "Acolhimento de criança com deficiência",
    natureza: "Falta de acessibilidade ou exclusão",
    status: "Recebida",
    gravidade: null,
    resumo:
      "Relato de recusa de matrícula por falta de estrutura de acolhimento. Na fila de triagem.",
    relato:
      "Uma família teria sido orientada a procurar outra unidade porque a creche não teria estrutura para acolher uma criança com deficiência, sem que a recusa fosse formalizada por escrito.",
    responsavel: COORD,
    prazo: "23/08/2026",
    andamento: [
      {
        data: "24/07/2026",
        titulo: "Relato recebido pelo canal público",
        detalhe: "Protocolo gerado e gravado na cadeia da instituição.",
        responsavel: CANAL,
      },
      {
        data: "27/07/2026",
        titulo: "Encaminhado para triagem",
        detalhe:
          "Na fila de classificação de gravidade; avaliador responsável ainda em designação.",
        responsavel: COORD,
      },
    ],
    providencias: [],
    desfecho: null,
    impactoNoSelo: "Nenhuma medida até a conclusão da triagem.",
  },
];

export const denunciasDaInstituicao = (instituicaoId: string) =>
  denuncias.filter((d) => d.instituicaoId === instituicaoId);

export const denunciaPorProtocolo = new Map(denuncias.map((d) => [d.protocolo, d]));

/**
 * Próximo protocolo do canal público.
 *
 * O formato é o mesmo da fila do portal (`DEN-aaaa-nnnn`): quem denuncia guarda
 * um número que a instituição e o SIS reconhecem. Um formato só para o
 * comprovante tornaria o protocolo inútil justamente para quem mais precisa
 * dele — e `SIS-aaaa-...` colidiria com o token de certificação.
 */
export const proximoProtocolo = (ano: number, jaEmitidos = 0) => {
  const maior = denuncias
    .filter((d) => d.protocolo.startsWith(`DEN-${ano}-`))
    .reduce((max, d) => Math.max(max, Number(d.protocolo.slice(-4)) || 0), 0);
  return `DEN-${ano}-${String(maior + 1 + jaEmitidos).padStart(4, "0")}`;
};

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

/** Apuração em aberto cujo prazo já passou da data de referência. */
export const denunciaAtrasada = (d: Denuncia) => denunciaEmAberto(d) && jaPassou(d.prazo);

/**
 * Etapa de apuração que a ficha pública exibe: só a suspensão do selo.
 *
 * Denúncia nenhuma aparece na vitrine pública, nem depois da triagem. Um relato
 * publicado nominalmente é uma acusação pendurada na porta da instituição, e a
 * ficha pública é justamente onde ela mais custa: bastaria um punhado de
 * relatos infundados para derrubar a reputação de quem não fez nada — o canal
 * de escuta viraria arma de ataque de imagem, e o incentivo a usá-lo assim
 * estaria dado. A apuração pertence ao portal institucional, onde a instituição
 * responde e o SIS decide.
 *
 * A suspensão é exceção porque não é relato: é decisão tomada pelo SIS ao fim
 * da apuração, e afeta diretamente o que o selo afirma a quem consulta. Sem ela
 * a ficha mostraria o selo esmaecido sem dizer por quê.
 */
export const etapaPublica = (e: EtapaDenuncia) => e.titulo.startsWith("Certificação suspensa");

/* ---------------------------------------------------------------------------
 * Livro de registros.
 * ------------------------------------------------------------------------ */

export type RegistroBlockchain = {
  bloco: string;
  evento: string;
  data: string;
  hash: string;
  tipo: "certificacao" | "avaliacao" | "denuncia" | "renovacao" | "atualizacao" | "suspensao";
  instituicaoId: string;
  /**
   * O que o evento registra — mesma chave usada para gerar o hash. Permite ir
   * da tela do assunto (uma etapa de denúncia, por exemplo) até o bloco.
   */
  referencia: string;
  /**
   * Visível na consulta pública. Falso para etapa de apuração de denúncia: o
   * bloco existe e é auditável no portal, mas a vitrine pública não o exibe.
   */
  publico: boolean;
  /**
   * Texto para a ficha pública, quando o interno cita a denúncia que originou o
   * bloco. Só a suspensão precisa: ela é pública, o protocolo não.
   */
  eventoPublico?: string;
};

const rotuloTipoAvaliacao: Record<Avaliacao["tipo"], RegistroBlockchain["tipo"]> = {
  Inicial: "avaliacao",
  Renovação: "renovacao",
  Extraordinária: "avaliacao",
};

type RegistroBruto = {
  evento: string;
  data: string;
  tipo: RegistroBlockchain["tipo"];
  instituicaoId: string;
  chave: string;
  publico: boolean;
  eventoPublico?: string;
};

/**
 * Livro de registros da rede.
 *
 * Cada evento do ciclo — avaliação, emissão de selo, subselo, denúncia,
 * suspensão — vira um registro. É construído a partir dos mesmos dados que
 * alimentam as outras telas, de forma que o histórico nunca conte uma versão
 * diferente dos fatos.
 */
export const registros: RegistroBlockchain[] = (
  [
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
        publico: true,
      })),
    ...certificacoes.map((c) => ({
      evento: `Certificação emitida para o nível ${c.nivel} · token ${c.token}`,
      data: c.emissao,
      tipo: "certificacao" as const,
      instituicaoId: c.instituicaoId,
      chave: `cert:${c.instituicaoId}`,
      publico: true,
    })),
    ...institutions
      .filter((i) => i.subselos.length > 0 && i.ultimaAvaliacao !== "-")
      .flatMap((i) =>
        i.subselos.map((s) => ({
          evento: `Subselo concedido: ${s}`,
          data: i.ultimaAvaliacao,
          tipo: "atualizacao" as const,
          instituicaoId: i.id,
          chave: `sub:${i.id}:${s}`,
          publico: true,
        })),
      ),
    /* Cada etapa da apuração entra na cadeia — é isso que permite à instituição
       acompanhar o andamento sem depender da palavra de quem apura. Todas ficam
       fora da vitrine pública, menos a suspensão do selo; ver `etapaPublica`. */
    ...denuncias.flatMap((d) =>
      d.andamento.map((e, i) => {
        const suspensao = etapaPublica(e);
        return {
          evento: `Denúncia ${d.protocolo} · ${e.titulo}`,
          // Publicamente a suspensão vale pelo que decidiu, não pelo relato que
          // a originou: o protocolo é rastro de apuração e fica no portal.
          eventoPublico: suspensao ? "Certificação suspensa por decisão do SIS" : undefined,
          data: e.data,
          tipo: (suspensao ? "suspensao" : "denuncia") as "suspensao" | "denuncia",
          instituicaoId: d.instituicaoId,
          chave: `${d.protocolo}:${i}`,
          publico: suspensao,
        };
      }),
    ),
  ] satisfies RegistroBruto[]
)
  // Ordem cronológica dá o número de bloco; depois invertemos para exibir o
  // mais recente primeiro, sem que o bloco deixe de crescer com o tempo.
  .sort((a, b) => ordemPorData(a.data) - ordemPorData(b.data) || a.chave.localeCompare(b.chave))
  /* A anotação uniformiza o elemento: sem ela o `satisfies` deixa o tipo como
     união das formas literais de cada origem, e `eventoPublico` — presente só
     na de denúncia — não existiria nos outros ramos da união. */
  .map((r: RegistroBruto, idx) => ({
    evento: r.evento,
    data: r.data,
    tipo: r.tipo,
    instituicaoId: r.instituicaoId,
    bloco: `#${10321 + idx * 7}`,
    hash: hashDemo(r.chave),
    referencia: r.chave,
    publico: r.publico,
    eventoPublico: r.eventoPublico,
  }))
  .reverse();

export const registrosDaInstituicao = (instituicaoId: string) =>
  registros.filter((r) => r.instituicaoId === instituicaoId);

/** Só o que a ficha pública exibe: a apuração de denúncia fica de fora. */
export const registrosPublicosDaInstituicao = (instituicaoId: string) =>
  registros.filter((r) => r.instituicaoId === instituicaoId && r.publico);

export const registroPorReferencia = new Map(registros.map((r) => [r.referencia, r]));

/** Bloco que registrou uma etapa específica da apuração de uma denúncia. */
export const registroDaEtapa = (protocolo: string, indice: number) =>
  registroPorReferencia.get(`${protocolo}:${indice}`) ?? null;

/** Todos os blocos gerados por uma denúncia, do mais recente ao mais antigo. */
export const registrosDaDenuncia = (protocolo: string) =>
  registros.filter((r) => r.referencia.startsWith(`${protocolo}:`));

/* ---------------------------------------------------------------------------
 * Plano de adequação.
 * ------------------------------------------------------------------------ */

export type ItemPlano = {
  eixo: string;
  acao: string;
  base: string;
  prazo: string;
  status: "Em andamento" | "Pendente";
  /** Eixo abaixo do piso eliminatório do modelo: bloqueia a próxima emissão. */
  eliminatorio: boolean;
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
 * Derivado das notas: todo eixo abaixo do patamar de referência entra com uma
 * ação recomendada. O prazo é proporcional à distância do patamar — quanto
 * menor a nota, mais curto o prazo, porque é onde o risco à criança é maior.
 */
export const planoDeAdequacao = (inst: Institution): ItemPlano[] => {
  const modelo = apuracoes.get(inst.id)?.modelo;
  const piso = modelo?.notaMinimaPorEixo ?? 60;

  return inst.criterios
    .filter((c) => c.nota < PATAMAR_DE_REFERENCIA)
    .sort((a, b) => a.nota - b.nota)
    .map((c) => ({
      eixo: c.nome,
      acao: acaoPorEixo[c.nome] ?? "Revisar o eixo com o avaliador responsável.",
      base: c.base,
      prazo: c.nota < 70 ? "30 dias" : c.nota < 80 ? "60 dias" : "90 dias",
      status: c.nota < 75 ? "Em andamento" : "Pendente",
      // No piso, um ponto para baixo já impede a próxima emissão.
      eliminatorio: c.nota <= piso,
    }));
};

/**
 * Próximo nível a alcançar e quantos pontos faltam.
 *
 * As faixas vêm do modelo da instituição, não de números fixos: em Saúde e
 * Terapias o Bronze começa em 65, e prometer "faltam X para o Prata" com a
 * régua da Educação Básica daria uma meta errada.
 */
export const proximoNivel = (inst: Institution) => {
  const a = apuracoes.get(inst.id);
  if (!a || a.nota === null) return null;

  const acima = [...a.modelo.faixas]
    .sort((x, y) => x.minimo - y.minimo)
    .find((f) => f.minimo > a.nota!);

  if (!acima) return null;
  return { nivel: acima.nivel, alvo: acima.minimo, faltam: acima.minimo - a.nota };
};

/* ---------------------------------------------------------------------------
 * Consolidados.
 * ------------------------------------------------------------------------ */

/**
 * Consolidado de um conjunto de instituições — base dos painéis de rede e SIS.
 *
 * `porNivel` conta apenas selo vigente, de forma que a soma dos três níveis é
 * sempre igual a `certificadas`. Contar nível de instituição suspensa ou ainda
 * sem emissão fazia o indicador dizer "10 selos ativos" e detalhar 12.
 */
export const resumoDoConjunto = (lista: Institution[]) => {
  const ids = new Set(lista.map((i) => i.id));
  const denunciasDoEscopo = denuncias.filter((d) => ids.has(d.instituicaoId));
  const vigentes = lista.filter((i) => temSeloVigente(i.status));
  const comNota = lista
    .map((i) => apuracoes.get(i.id)?.nota)
    .filter((n): n is number => n !== null && n !== undefined);

  const certsDoEscopo = certificacoes.filter((c) => ids.has(c.instituicaoId));

  return {
    total: lista.length,
    certificadas: vigentes.length,
    aguardandoEmissao: lista.filter((i) => i.status === "Aguardando emissão").length,
    emAvaliacao: lista.filter((i) => i.status === "Em avaliação").length,
    pendentes: lista.filter((i) => i.status === "Pendente").length,
    suspensas: lista.filter((i) => i.status === "Suspensa").length,
    porNivel: {
      Ouro: vigentes.filter((i) => nivelDaInstituicao(i.id) === "Ouro").length,
      Prata: vigentes.filter((i) => nivelDaInstituicao(i.id) === "Prata").length,
      Bronze: vigentes.filter((i) => nivelDaInstituicao(i.id) === "Bronze").length,
    } satisfies Record<Nivel, number>,
    media: comNota.length ? Math.round(comNota.reduce((s, n) => s + n, 0) / comNota.length) : null,
    subselos: vigentes.reduce((s, i) => s + i.subselos.length, 0),
    denuncias: denunciasDoEscopo.length,
    denunciasAbertas: denunciasDoEscopo.filter(denunciaEmAberto).length,
    denunciasAtrasadas: denunciasDoEscopo.filter(denunciaAtrasada).length,
    avaliacoesAbertas: avaliacoes.filter(
      (a) => ids.has(a.instituicaoId) && a.status !== "Aprovada" && a.status !== "Reprovada",
    ).length,
    /** Selos vigentes a menos de 90 dias do vencimento. */
    aVencer: certsDoEscopo.filter((c) => c.status === "A vencer").length,
    vencidos: certsDoEscopo.filter((c) => c.status === "Vencida").length,
    /** Eixos abaixo do piso eliminatório em todo o conjunto. */
    eixosCriticos: lista.reduce(
      (s, i) => s + (apuracoes.get(i.id)?.eixosReprovados.length ?? 0),
      0,
    ),
  };
};

export type ResumoDoConjunto = ReturnType<typeof resumoDoConjunto>;

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

/** Certificações do escopo ordenadas por urgência de renovação. */
export const renovacoesProximas = (lista: Institution[]) => {
  const ids = new Set(lista.map((i) => i.id));
  return certificacoes
    .filter((c) => ids.has(c.instituicaoId) && c.status !== "Suspensa")
    .sort((a, b) => a.diasParaVencer - b.diasParaVencer);
};
