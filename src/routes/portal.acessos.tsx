import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { KeyRound, UserCheck, EyeOff, Info } from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Indicador, Painel, Vazio, AvisoDemo } from "@/components/PortalUI";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Institution } from "@/lib/mock-data";
import { contas, type Escopo } from "@/lib/portal-access";

export const Route = createFileRoute("/portal/acessos")({
  head: () => ({
    meta: [
      { title: "Acessos das unidades | Portal SIS" },
      {
        name: "description",
        content: "Concessão de acesso individual das unidades ao portal institucional.",
      },
      { property: "og:title", content: "Acessos das unidades | Portal SIS" },
      {
        property: "og:description",
        content: "A rede gestora decide quais unidades enxergam o próprio painel.",
      },
    ],
  }),
  component: Acessos,
});

/**
 * E-mail de acesso da unidade.
 *
 * Devolve `null` quando a unidade não tem conta de demonstração, em vez de
 * inventar um endereço plausível. O e-mail gerado parecia funcional e não
 * entrava em lugar nenhum — a tela prometia um login que o protótipo não tinha.
 */
function emailDaUnidade(inst: Institution) {
  return contas.find((c) => c.instituicaoId === inst.id)?.email ?? null;
}

function Acessos() {
  return (
    <PortalLayout
      title="Acessos das unidades"
      subtitle="Quem, dentro da rede, pode abrir o próprio painel"
      papeis={["rede"]}
    >
      {(escopo) => <Gestao escopo={escopo} />}
    </PortalLayout>
  );
}

function Gestao({ escopo }: { escopo: Escopo }) {
  const unidades = escopo.instituicoes;

  /**
   * Estado local das concessões.
   *
   * No protótipo, ligar e desligar o acesso muda só esta tela — não há backend
   * para persistir nem conta para criar. A regra que a tela demonstra é a real:
   * a unidade só enxerga o painel dela se a rede gestora conceder.
   */
  const [concessoes, setConcessoes] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(unidades.map((u) => [u.id, Boolean(u.acessoProprio)])),
  );
  const [ultimaMudanca, setUltimaMudanca] = useState<string | null>(null);

  const concedidos = unidades.filter((u) => concessoes[u.id]).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Indicador icon={KeyRound} label="Unidades na rede" valor={unidades.length} />
        <Indicador
          icon={UserCheck}
          label="Com acesso próprio"
          valor={concedidos}
          detalhe="Enxergam apenas a própria unidade"
          tom="green"
        />
        <Indicador
          icon={EyeOff}
          label="Somente pela rede"
          valor={unidades.length - concedidos}
          detalhe="Acompanhamento concentrado na gestão"
          tom="amber"
        />
      </div>

      <Painel
        titulo="Concessão de acesso"
        descricao="Ao conceder, a unidade recebe um login que abre apenas o painel dela: selo, plano de adequação, avaliações e denúncias da própria unidade. Nunca as das outras."
      >
        {unidades.length === 0 ? (
          <Vazio>Nenhuma unidade vinculada a esta rede.</Vazio>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Unidade</TableHead>
                  <TableHead className="whitespace-nowrap">Situação da certificação</TableHead>
                  <TableHead className="whitespace-nowrap">E-mail de acesso</TableHead>
                  <TableHead className="whitespace-nowrap">Acesso ao portal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {unidades.map((u) => {
                  const ativo = Boolean(concessoes[u.id]);
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.nome}
                        <span className="block text-xs text-muted-foreground">
                          {u.tipo} · {u.cidade} - {u.uf}
                        </span>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={u.status} />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {!ativo
                          ? "-"
                          : (emailDaUnidade(u) ?? (
                              <span className="font-sans italic">
                                login a criar no primeiro acesso
                              </span>
                            ))}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={ativo}
                            onCheckedChange={(v) => {
                              setConcessoes((atual) => ({ ...atual, [u.id]: v }));
                              setUltimaMudanca(
                                `${v ? "Acesso concedido a" : "Acesso revogado de"} ${u.nome}.`,
                              );
                            }}
                            aria-label={`Acesso próprio de ${u.nome}`}
                          />
                          <Badge variant={ativo ? "secondary" : "outline"}>
                            {ativo ? "Concedido" : "Somente rede"}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Painel>

      {ultimaMudanca && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-lg border border-brand-teal/30 bg-brand-teal/10 px-4 py-3 text-sm text-foreground"
        >
          <Info className="mt-0.5 size-4 shrink-0 text-brand-teal" aria-hidden />
          <span>
            {ultimaMudanca} Numa operação real, a mudança gera registro de auditoria e a unidade é
            avisada por e-mail.
          </span>
        </p>
      )}

      <AvisoDemo>
        Nesta demonstração, a alteração vale só durante a visita à página: não há backend para
        gravar a concessão. As unidades que já vêm com acesso concedido têm conta de teste no
        seletor do cabeçalho — a EMEF Serra Verde Central e o CEI Girassol mostram exatamente o que
        uma unidade concedida vê. Conceder acesso a uma unidade que ainda não tem conta não cria
        login neste protótipo, e a coluna acima diz isso em vez de exibir um e-mail que não entra.
      </AvisoDemo>
    </div>
  );
}
