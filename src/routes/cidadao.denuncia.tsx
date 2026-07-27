import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { BrandHeader } from "@/components/BrandHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { institutions } from "@/lib/mock-data";

export const Route = createFileRoute("/cidadao/denuncia")({
  head: () => ({
    meta: [
      { title: "Canal de Denúncia — YC Blockchain" },
      { name: "description", content: "Canal seguro para denúncias sobre instituições educacionais." },
      { property: "og:title", content: "Canal de Denúncia — YC Blockchain" },
      { property: "og:description", content: "Registre uma denúncia de forma segura e transparente." },
    ],
  }),
  component: Denuncia,
});

function Denuncia() {
  const [sent, setSent] = useState(false);
  const [inst, setInst] = useState("");
  const [cat, setCat] = useState("");
  const [desc, setDesc] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <BrandHeader />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold">Canal de Denúncia</h1>
        <p className="text-muted-foreground mt-1">
          Sua denúncia será registrada de forma anônima e segura na cadeia blockchain.
        </p>

        {sent ? (
          <div className="mt-8 bg-card border rounded-2xl p-8 text-center shadow-sm">
            <div className="size-14 mx-auto rounded-full bg-secondary/20 text-secondary grid place-items-center">
              <CheckCircle2 className="size-8" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Denúncia registrada com sucesso.</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Um registro imutável foi criado. Obrigado por contribuir com a transparência educacional.
            </p>
            <Button className="mt-6" onClick={() => { setSent(false); setInst(""); setCat(""); setDesc(""); }}>
              Registrar nova denúncia
            </Button>
          </div>
        ) : (
          <form
            className="mt-8 bg-card border rounded-2xl p-6 space-y-5 shadow-sm"
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
          >
            <div className="space-y-2">
              <Label>Instituição relacionada</Label>
              <Select value={inst} onValueChange={setInst} required>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {institutions.map((i) => <SelectItem key={i.id} value={i.id}>{i.nome}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoria da denúncia</Label>
              <Select value={cat} onValueChange={setCat} required>
                <SelectTrigger><SelectValue placeholder="Selecione a categoria..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fraude">Fraude em certificação</SelectItem>
                  <SelectItem value="infra">Problemas de infraestrutura</SelectItem>
                  <SelectItem value="pedagogica">Irregularidade pedagógica</SelectItem>
                  <SelectItem value="financeira">Irregularidade financeira</SelectItem>
                  <SelectItem value="outra">Outra</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={6} required placeholder="Descreva o ocorrido com o máximo de detalhes possível..." />
            </div>
            <Button type="submit" className="w-full" size="lg">
              <Send className="size-4" /> Enviar denúncia
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
