# Marca — SIS · Selo Infância Segura

## Em uso pelo site

| Arquivo         | Uso                                                                |
| --------------- | ------------------------------------------------------------------ |
| `logo-sis.webp` | Assinatura oficial. Renderizada por `src/components/Brand.tsx`.    |
| `og-sis.png`    | Imagem de compartilhamento (`og:image`), 1200×630 com fundo opaco. |

Derivados na raiz de `public/`: `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`.

No código, **nunca** escreva o caminho à mão — use o componente, que centraliza a origem:

```tsx
import { BrandLockup, BrandStacked } from "@/components/Brand";

<BrandLockup />    // assinatura no masthead e rodapé
<BrandStacked />   // aplicação em destaque, para heros e material de pitch
```

### Por que o `og:image` é PNG e não WebP

Vários crawlers de rede social (WhatsApp, Facebook, LinkedIn) não renderizam WebP em preview de
link. O `og-sis.png` também tem **fundo opaco** de propósito: transparência vira preto em alguns
previews. Se trocar essa arte, mantenha 1200×630 e fundo sólido.

## `originais/` — assets órfãos

A identidade do site era um emblema em SVG inline (`BrandEmblem`, em `Brand.tsx`), e os arquivos
em `originais/` são exportações dele. O componente foi substituído pela logo raster, então **nada
em `originais/` é usado pelo site hoje**:

| Arquivo                     | Uso original                                                |
| --------------------------- | ----------------------------------------------------------- |
| `sis-logo.png`              | Assinatura completa, fundo transparente. Slides, camisetas. |
| `sis-logo-fundo-branco.png` | Assinatura completa, onde transparência não é suportada.    |
| `sis-emblema.png`           | Só o emblema. Avatar, redes sociais.                        |
| `sis-emblema.svg`           | Emblema vetorial completo (anel + selos).                   |
| `sis-emblema-compacto.svg`  | Só o escudo, para aplicações pequenas.                      |

Foram mantidos porque servem para material impresso e de apresentação. **Atenção:** tudo em
`public/` é publicado no deploy. Se não forem usados fora do site, o lugar deles é fora de
`public/` — ou podem ser removidos.

## Cores da marca

Extraídas da logo e registradas como tokens em `src/styles.css`:

| Token               | Hex       | Elemento na logo       |
| ------------------- | --------- | ---------------------- |
| `--brand-navy`      | `#1B3B6F` | escudo e "S" inicial   |
| `--brand-navy-deep` | `#16305C` | contorno do escudo     |
| `--brand-teal`      | `#159C9C` | "I", criança à direita |
| `--brand-green`     | `#5CB335` | "S" final, check       |
| `--brand-amber`     | `#F5A623` | selo de comunidade     |
| `--brand-blue`      | `#1E76D2` | selo de cadeado        |
| `--brand-star`      | `#FFC81E` | estrela                |
