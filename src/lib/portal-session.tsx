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
  autenticar,
  contaPorId,
  resolverEscopo,
  type Conta,
  type Escopo,
} from "@/lib/portal-access";

/**
 * Sessão do portal — protótipo.
 *
 * Guarda apenas o id da conta escolhida, no `localStorage`, para que recarregar
 * a página não jogue o avaliador de volta ao login. Não é autenticação: não há
 * token, não há verificação no servidor, e qualquer pessoa com o console pode
 * trocar o valor. Ao ligar o backend, isto vira uma sessão de verdade e as
 * telas continuam lendo `escopo` da mesma forma.
 *
 * O estado começa vazio e só lê o `localStorage` depois da montagem: ler no
 * primeiro render faria o HTML do servidor divergir do cliente e o React
 * descartaria a árvore hidratada.
 */

const CHAVE = "sis.portal.sessao";

type Sessao = {
  /** `false` enquanto a sessão salva ainda não foi lida no cliente. */
  pronta: boolean;
  conta: Conta | null;
  escopo: Escopo | null;
  /** Login estático. Devolve a conta em caso de acerto, `null` se não bater. */
  entrar: (email: string, senha: string) => Conta | null;
  /** Troca de perfil sem passar pelo formulário — usado no seletor do portal. */
  usarConta: (contaId: string) => void;
  sair: () => void;
};

const SessaoContext = createContext<Sessao | null>(null);

export function PortalSessionProvider({ children }: { children: ReactNode }) {
  const [contaId, setContaId] = useState<string | null>(null);
  const [pronta, setPronta] = useState(false);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo && contaPorId.has(salvo)) setContaId(salvo);
    } catch {
      // Navegador com storage bloqueado: a sessão simplesmente não persiste.
    }
    setPronta(true);
  }, []);

  const guardar = useCallback((id: string | null) => {
    setContaId(id);
    try {
      if (id) localStorage.setItem(CHAVE, id);
      else localStorage.removeItem(CHAVE);
    } catch {
      /* idem */
    }
  }, []);

  const valor = useMemo<Sessao>(() => {
    const conta = contaId ? (contaPorId.get(contaId) ?? null) : null;
    return {
      pronta,
      conta,
      escopo: conta ? resolverEscopo(conta) : null,
      entrar: (email, senha) => {
        const encontrada = autenticar(email, senha);
        if (encontrada) guardar(encontrada.id);
        return encontrada;
      },
      usarConta: (id) => {
        if (contaPorId.has(id)) guardar(id);
      },
      sair: () => guardar(null),
    };
  }, [contaId, pronta, guardar]);

  return <SessaoContext.Provider value={valor}>{children}</SessaoContext.Provider>;
}

export function usePortalSession() {
  const ctx = useContext(SessaoContext);
  if (!ctx) {
    throw new Error("usePortalSession precisa estar dentro de <PortalSessionProvider>.");
  }
  return ctx;
}
