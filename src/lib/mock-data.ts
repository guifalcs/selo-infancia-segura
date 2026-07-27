export type Institution = {
  id: string;
  nome: string;
  cidade: string;
  status: "Certificada" | "Em auditoria" | "Pendente" | "Suspensa";
  ultimaAuditoria: string;
  descricao: string;
  selo: string;
};

export const institutions: Institution[] = [
  { id: "esc-001", nome: "Escola Municipal Aurora", cidade: "São Paulo - SP", status: "Certificada", ultimaAuditoria: "12/03/2026", descricao: "Escola pública com foco em educação integral e uso ético de tecnologia.", selo: "Selo Ouro" },
  { id: "esc-002", nome: "Instituto Educar+", cidade: "Rio de Janeiro - RJ", status: "Certificada", ultimaAuditoria: "05/02/2026", descricao: "ONG educacional atendendo comunidades de baixa renda.", selo: "Selo Prata" },
  { id: "esc-003", nome: "Colégio Horizonte", cidade: "Belo Horizonte - MG", status: "Em auditoria", ultimaAuditoria: "22/06/2026", descricao: "Rede privada de ensino fundamental e médio.", selo: "Selo Prata" },
  { id: "esc-004", nome: "Centro Educacional Renascer", cidade: "Curitiba - PR", status: "Certificada", ultimaAuditoria: "18/01/2026", descricao: "Instituição comunitária com programas de inclusão digital.", selo: "Selo Ouro" },
  { id: "esc-005", nome: "Fundação Saber Livre", cidade: "Salvador - BA", status: "Pendente", ultimaAuditoria: "—", descricao: "Fundação em processo inicial de certificação.", selo: "—" },
  { id: "esc-006", nome: "Escola Vale do Sol", cidade: "Fortaleza - CE", status: "Certificada", ultimaAuditoria: "10/04/2026", descricao: "Escola rural com forte atuação em sustentabilidade.", selo: "Selo Bronze" },
  { id: "esc-007", nome: "Instituto Cidadão do Amanhã", cidade: "Porto Alegre - RS", status: "Suspensa", ultimaAuditoria: "09/09/2025", descricao: "Suspenso após pendências de conformidade.", selo: "—" },
  { id: "esc-008", nome: "Colégio Nova Geração", cidade: "Recife - PE", status: "Certificada", ultimaAuditoria: "27/05/2026", descricao: "Colégio com projetos de mentoria e alfabetização digital.", selo: "Selo Prata" },
];

export const certifications = [
  { instituicao: "Escola Municipal Aurora", selo: "Selo Ouro", emissao: "12/03/2026" },
  { instituicao: "Instituto Educar+", selo: "Selo Prata", emissao: "05/02/2026" },
  { instituicao: "Centro Educacional Renascer", selo: "Selo Ouro", emissao: "18/01/2026" },
  { instituicao: "Escola Vale do Sol", selo: "Selo Bronze", emissao: "10/04/2026" },
  { instituicao: "Colégio Nova Geração", selo: "Selo Prata", emissao: "27/05/2026" },
  { instituicao: "Colégio Horizonte", selo: "Selo Prata", emissao: "14/11/2025" },
];

export const audits = [
  { instituicao: "Escola Municipal Aurora", responsavel: "Márcia Torres", data: "12/03/2026", status: "Aprovada" },
  { instituicao: "Colégio Horizonte", responsavel: "Diego Almeida", data: "22/06/2026", status: "Em andamento" },
  { instituicao: "Instituto Educar+", responsavel: "Larissa Souza", data: "05/02/2026", status: "Aprovada" },
  { instituicao: "Fundação Saber Livre", responsavel: "Rafael Prado", data: "01/07/2026", status: "Pendente" },
  { instituicao: "Escola Vale do Sol", responsavel: "Camila Nunes", data: "10/04/2026", status: "Aprovada" },
  { instituicao: "Instituto Cidadão do Amanhã", responsavel: "João Bezerra", data: "09/09/2025", status: "Reprovada" },
];

export const blockchainHistory: Record<string, { bloco: string; evento: string; data: string; hash: string }[]> = {
  default: [
    { bloco: "#10521", evento: "Certificação emitida", data: "12/03/2026", hash: "0x8f2a...c41d" },
    { bloco: "#10548", evento: "Auditoria registrada", data: "22/03/2026", hash: "0xa19b...77e2" },
    { bloco: "#10570", evento: "Atualização de informações", data: "04/04/2026", hash: "0x33d0...9f81" },
    { bloco: "#10612", evento: "Renovação de selo", data: "18/05/2026", hash: "0xbe45...2a09" },
  ],
};
