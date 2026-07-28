# Marca — SIS · Selo Infância Segura

Arquivos gerados a partir da vetorização da logo do projeto.

| Arquivo                      | Uso                                                          |
| ---------------------------- | ------------------------------------------------------------ |
| `sis-logo.png`               | Assinatura completa, **fundo transparente**. Slides, documentos, camisetas. |
| `sis-logo-fundo-branco.png`  | Assinatura completa, **fundo branco**. Onde transparência não é suportada. |
| `sis-emblema.png`            | Só o emblema, fundo transparente. Avatar, redes sociais.      |
| `sis-emblema.svg`            | Emblema vetorial completo (anel + selos). Escala sem perder nitidez. |
| `sis-emblema-compacto.svg`   | Só o escudo. Para aplicações pequenas (favicon, ícone).       |

Derivados em `public/`: `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`.

## No site, use o componente — não estes PNGs

A marca renderizada no site vem de `src/components/Brand.tsx`, em SVG inline:

```tsx
import { BrandEmblem, BrandLockup, BrandStacked } from "@/components/Brand";

<BrandLockup />                        // assinatura horizontal (masthead, rodapé)
<BrandEmblem variant="compact" />      // só o escudo, para tamanhos < 48px
<BrandStacked />                       // assinatura vertical completa
```

Vantagem sobre o PNG: acompanha o tema claro/escuro, fica nítido em qualquer tamanho e não
gera requisição de rede. Os PNGs aqui existem para uso **fora** do site.

## Cores da marca

Extraídas da logo e registradas como tokens em `src/styles.css`:

| Token                 | Hex       | Elemento na logo             |
| --------------------- | --------- | ---------------------------- |
| `--brand-navy`        | `#1B3B6F` | escudo e "S" inicial         |
| `--brand-navy-deep`   | `#16305C` | contorno do escudo           |
| `--brand-teal`        | `#159C9C` | "I", criança à direita       |
| `--brand-green`       | `#5CB335` | "S" final, check             |
| `--brand-amber`       | `#F5A623` | selo de comunidade           |
| `--brand-blue`        | `#1E76D2` | selo de cadeado              |
| `--brand-star`        | `#FFC81E` | estrela                      |

## Regenerar os arquivos

Os PNGs foram exportados renderizando o SVG do componente em Chromium headless. Se o emblema
mudar em `Brand.tsx`, estes arquivos precisam ser reexportados para não divergirem.

## Substituir pela logo original

Se o grupo preferir usar o arquivo raster original em vez da vetorização, basta colocá-lo
nesta pasta e trocar `<BrandEmblem />` por uma `<img>` em `Brand.tsx`. O restante do site não
precisa de alteração.
