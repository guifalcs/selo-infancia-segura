# `public/` — assets estáticos

Tudo aqui é servido na raiz do site (`public/marca/logo-sis.webp` → `/marca/logo-sis.webp`) e
**publicado no deploy**. Arquivo não usado aqui é peso morto que o visitante baixa ou que infla o
build — não guarde original de trabalho nesta pasta.

## Estrutura

```
public/
├── favicon.ico            ─┐
├── favicon.svg             │ precisam ficar na raiz: navegador,
├── apple-touch-icon.png    │ iOS e crawlers buscam por caminho fixo
├── robots.txt             ─┘
│
├── marca/                  identidade visual (ver marca/README.md)
│   ├── logo-sis.webp       assinatura usada pelo site
│   ├── og-sis.png          imagem de compartilhamento, 1200×630
│   └── originais/          exportações do emblema SVG antigo — órfãs
│
├── imagens/                fotografia (ver imagens/README.md)
│   └── hero-instituicao.webp
│
└── selos/                  o objeto central do produto
    ├── nivel/              bronze · prata · ouro
    └── subselos/           acessibilidade · inclusao-tea ·
                            prevencao-bullying · seguranca-digital
```

## Convenções

- **WebP** para toda imagem exibida no site. Exceção: `og-sis.png`, porque crawlers de rede social
  não renderizam WebP em preview de link.
- **Nomes em kebab-case**, sem acento e sem camelCase — evita divergência entre sistemas de
  arquivos sensíveis e insensíveis a caixa, que quebra em produção e não no Linux local.
- **Dimensione pelo uso real**, a 2× do maior tamanho de exibição. Os selos de nível saem a 384 px
  porque o maior uso é `size-44` (176 px); a logo a 512 px por causa do `h-56` (224 px).
- **Não escreva o caminho à mão** nos componentes. Cada família de asset tem um ponto único de
  verdade:

  | Asset          | Onde o caminho é definido                          |
  | -------------- | -------------------------------------------------- |
  | logo           | `src/components/Brand.tsx`                         |
  | selos de nível | `src/components/Seal.tsx`                          |
  | subselos       | campo `arte` em `subselos`, `src/lib/mock-data.ts` |
  | hero           | `src/routes/index.tsx`                             |
  | `og:image`     | `src/routes/__root.tsx` e `src/routes/index.tsx`   |

## Peso

O React 19 emite `<link rel="preload" as="image">` automaticamente para `<img>` renderizada no SSR
— então imagem grande referenciada em componente de layout é baixada com prioridade em **toda**
página, mesmo que apareça a 14 px. Já custou 6,9 MB de preload neste projeto. Verifique com:

```sh
curl -s http://localhost:8080/ | grep -o 'rel="preload" as="image" href="[^"]*"'
```
