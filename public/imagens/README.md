# Imagens do portal

Fotografia. Ilustrações vetoriais autorais ficam em `src/components/illustrations/`, a marca em
`public/marca/` e os selos em `public/selos/`.

## Slots em uso

| Arquivo                 | Proporção | Resolução | Onde aparece          |
| ----------------------- | --------- | --------- | --------------------- |
| `hero-instituicao.webp` | 4:3       | 1448×1086 | Home, seção principal |

O hero é o elemento de LCP da home, então carrega com `loading="eager"` e `fetchPriority="high"`
— **nunca** `lazy`. Mantenha `width`/`height` explícitos no `<img>` para não causar layout shift.

## Como trocar ou acrescentar

1. Exporte em **WebP**, qualidade ~82, abaixo de **300 KB** (largura útil máxima no layout: 1600 px).
2. Coloque o arquivo aqui e aponte a `<img>` para `/imagens/<nome>.webp`.
3. Mantenha as mesmas classes de tamanho e proporção para não quebrar o layout.
4. Escreva um `alt` descritivo — este portal fala de acessibilidade, então precisa ser acessível.
   O `alt` do hero descreve a cena **e** a rampa de acessibilidade, não só "foto de escola".

Não há `cwebp` nem ImageMagick nesta máquina. Para converter, use Python:

```python
from PIL import Image
Image.open("origem.png").convert("RGB").save("destino.webp", "WEBP", quality=82, method=6)
```

Imagem **com transparência** exige redimensionar em espaço pré-multiplicado — senão o RGB guardado
sob os pixels transparentes sangra para a borda e cria franja. Foi o caso dos selos.

## Antes de publicar qualquer foto de criança

Isto não é detalhe burocrático — é o núcleo do que o projeto defende:

- **Autorização de uso de imagem.** Foto de criança identificável exige autorização expressa dos
  responsáveis (ECA, arts. 17 e 18; LGPD, art. 14, que exige consentimento específico de um dos
  pais ou responsável legal).
- **Banco de imagens licenciado** (Unsplash, Pexels, Adobe Stock) resolve o problema jurídico,
  porque o licenciamento e o _model release_ já vêm tratados.
- **Fotos sem rosto** — mãos, silhuetas, detalhe de ambiente, crianças de costas — são uma
  alternativa segura e muito usada por organizações do terceiro setor. É o caminho adotado no
  `hero-instituicao.webp`: todos de costas, nenhum rosto identificável.
- **Imagem gerada por IA** elimina a questão de autorização de imagem, mas continua sensível num
  projeto sobre proteção infantil. Se usar, mantenha a regra de não gerar rosto de criança.
- Nunca use foto real de uma instituição existente ao lado de dados fictícios de certificação.
