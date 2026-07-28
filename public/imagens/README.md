# Imagens do portal

As ilustrações do site são SVG autorais (em `src/components/illustrations/`) e servem como
**estágio intermediário**. A intenção do projeto é substituí-las por fotografia real, que tem
muito mais peso numa apresentação.

## Como substituir

1. Coloque o arquivo nesta pasta com o nome esperado (tabela abaixo).
2. No componente indicado, troque o `<Componente />` por:

   ```tsx
   <img
     src="/imagens/hero-instituicao.jpg"
     alt="Descrição objetiva do que aparece na foto"
     className="w-full rounded-xl border bg-card shadow-sm"
     width={1600}
     height={1200}
   />
   ```

3. Mantenha as mesmas classes de tamanho e proporção para não quebrar o layout.
4. Escreva um `alt` descritivo — este portal fala de acessibilidade, então precisa ser acessível.

## Slots previstos

| Arquivo esperado         | Proporção | Tamanho mínimo | Onde aparece                          |
| ------------------------ | --------- | -------------- | ------------------------------------- |
| `hero-instituicao.jpg`   | 4:3       | 1600 × 1200    | Home, seção principal (`CenaInstituicao`) |

## Antes de publicar qualquer foto de criança

Isto não é detalhe burocrático — é o núcleo do que o projeto defende:

- **Autorização de uso de imagem.** Foto de criança identificável exige autorização expressa dos
  responsáveis (ECA, arts. 17 e 18; LGPD, art. 14, que exige consentimento específico de um dos
  pais ou responsável legal).
- **Banco de imagens licenciado** (Unsplash, Pexels, Adobe Stock) resolve o problema jurídico,
  porque o licenciamento e o *model release* já vêm tratados. É o caminho recomendado para o pitch.
- **Fotos sem rosto** — mãos, silhuetas, detalhe de ambiente, crianças de costas — são uma
  alternativa segura e muito usada por organizações do terceiro setor.
- Nunca use foto real de uma instituição existente ao lado de dados fictícios de certificação.

## Otimização

- Exporte em `.webp` ou `.jpg` com qualidade ~80.
- Mantenha cada arquivo abaixo de ~300 KB.
- Largura máxima útil no layout atual: 1600 px.
