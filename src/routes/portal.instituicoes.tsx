import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Building2, KeyRound, Users } from "lucide-react";

import { PortalLayout } from "@/components/PortalLayout";
import { Painel, Vazio } from "@/components/PortalUI";
import { StatusBadge } from "@/components/StatusBadge";
import { SealChip } from "@/components/Seal";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { denunciaEmAberto, denunciasDaInstituicao, redes, type Institution } from "@/lib/mock-data";
import type { Escopo } from "@/lib/portal-access";

export const Route = createFileRoute("/portal/instituicoes")({
  head: () => ({
    meta: [
      { title: "Instituições | Portal SIS" },
      { name: "description", content: "Instituições visíveis no seu perfil de acesso." },
      { property: "og:title", content: "Instituições | Portal SIS" },
      { property: "og:description", content: "Unidades e clientes acompanhados no portal do SIS." },
    ],
  }),
  component: Instituicoes,
});

function Instituicoes() {
  return (
    <PortalLayout
      title="Instituições"
      subtitle="Somente as instituições sob a sua responsabilidade"
      papeis={["admin", "rede"]}
    >
      {(escopo) => <Lista escopo={escopo} />}
    </PortalLayout>
  );
}

function TabelaDeInstituicoes({
  lista,
  mostrarAcesso,
}: {
  lista: Institution[];
  /** Coluna de acesso concedido — só faz sentido em unidade de rede. */
  mostrarAcesso?: boolean;
}) {
  if (lista.length === 0) return <Vazio>Nenhuma instituição corresponde à busca.</Vazio>;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">Instituição</TableHead>
            <TableHead className="whitespace-nowrap">Selo</TableHead>
            <TableHead className="whitespace-nowrap">Nota</TableHead>
            <TableHead className="whitespace-nowrap">Situação</TableHead>
            <TableHead className="whitespace-nowrap">Última avaliação</TableHead>
            <TableHead className="whitespace-nowrap">Denúncias</TableHead>
            {mostrarAcesso && <TableHead className="whitespace-nowrap">Acesso próprio</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {lista.map((i) => {
            const abertas = denunciasDaInstituicao(i.id).filter(denunciaEmAberto).length;
            return (
              <TableRow key={i.id}>
                <TableCell className="font-medium">
                  <Link
                    to="/cidadao/instituicao/$id"
                    params={{ id: i.id }}
                    className="hover:text-primary hover:underline"
                  >
                    {i.nome}
                  </Link>
                  <span className="block text-xs text-muted-foreground">
                    {i.tipo} · {i.cidade} - {i.uf}
                  </span>
                </TableCell>
                <TableCell>{i.nivel ? <SealChip nivel={i.nivel} /> : "-"}</TableCell>
                <TableCell className="font-mono text-sm">{i.pontuacao ?? "-"}</TableCell>
                <TableCell>
                  <StatusBadge status={i.status} />
                </TableCell>
                <TableCell className="whitespace-nowrap font-mono text-sm">
                  {i.ultimaAvaliacao}
                </TableCell>
                <TableCell>
                  {abertas > 0 ? (
                    <Badge variant="destructive">{abertas} em aberto</Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">nenhuma</span>
                  )}
                </TableCell>
                {mostrarAcesso && (
                  <TableCell>
                    {i.acessoProprio ? (
                      <Badge className="border border-success/30 bg-success/10 text-success">
                        Concedido
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Somente rede</Badge>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function Lista({ escopo }: { escopo: Escopo }) {
  const [busca, setBusca] = useState("");
  const termo = busca.trim().toLowerCase();
  const filtrar = (lista: Institution[]) =>
    termo
      ? lista.filter((i) => `${i.nome} ${i.cidade} ${i.uf} ${i.tipo}`.toLowerCase().includes(termo))
      : lista;

  const campoDeBusca = (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome, cidade ou tipo"
        aria-label="Buscar instituição"
        className="pl-9 sm:w-72"
      />
    </div>
  );

  /* Rede: uma tabela só, com a coluna de acesso concedido. */
  if (escopo.papel === "rede") {
    return (
      <Painel
        titulo={`Unidades de ${escopo.rede?.nome ?? "sua rede"}`}
        descricao="Cada unidade responde por suas próprias adequações; a rede acompanha o conjunto."
        acoes={campoDeBusca}
      >
        <TabelaDeInstituicoes lista={filtrar(escopo.instituicoes)} mostrarAcesso />
      </Painel>
    );
  }

  /* Administração: carteira separada entre redes gestoras e clientes diretos —
     é a divisão que importa comercialmente. */
  const diretas = filtrar(escopo.instituicoes.filter((i) => !i.redeId));

  return (
    <div className="space-y-6">
      <Painel
        titulo="Carteira de clientes"
        descricao="Toda a base do SIS, separada por forma de contratação."
        acoes={campoDeBusca}
      >
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          {[
            { icon: Building2, label: "Instituições na base", valor: escopo.instituicoes.length },
            { icon: Users, label: "Redes gestoras", valor: redes.length },
            { icon: KeyRound, label: "Clientes diretos", valor: diretas.length },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3 rounded-lg border p-4">
              <c.icon className="size-5 shrink-0 text-primary" aria-hidden />
              <div>
                <div className="text-xl font-bold leading-none">{c.valor}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      </Painel>

      {redes.map((rede) => {
        const unidades = filtrar(escopo.instituicoes.filter((i) => i.redeId === rede.id));
        return (
          <Painel
            key={rede.id}
            titulo={rede.nome}
            descricao={`${rede.tipo} · ${rede.cidade} - ${rede.uf} · ${rede.plano} · responsável: ${rede.responsavel}`}
          >
            <TabelaDeInstituicoes lista={unidades} mostrarAcesso />
          </Painel>
        );
      })}

      <Painel
        titulo="Clientes diretos"
        descricao="Instituições sem rede gestora: o relacionamento é direto com o SIS."
      >
        <TabelaDeInstituicoes lista={diretas} />
      </Painel>
    </div>
  );
}
