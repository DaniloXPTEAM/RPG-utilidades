# HANDOFF — Bússola de Arton (Oráculo de Vectora)

Roteiro operacional para publicar o delta da **taverna na intro** no repositório
`DaniloXPTEAM/RPG-utilidades`. Siga os passos **na ordem**.

---

## 1. Taverna com o logo da Armada de Vectora

1. Pegue o logo anexado (`novalogoaramdadevectora.jpg`, normalmente em
   `/home/user/uploads/`).
2. Pinte-o no **banner da taverna** nas 3 imagens-fonte em `taverna-src/`
   (`pose1-olhar`, `pose2-limpando`, `pose3-brinde`), mantendo cena e
   personagem **idênticos** (edição por inpainting, sem regenerar a cena).
3. Regere `public/oraculo-taverna.mp4` — **10 s, 1920×1080, movimento suave,
   imagem clara** — a partir das 3 poses, nesta ordem: olhar → limpando → brinde.

Pipeline (ffmpeg do projeto: `require('@ffmpeg-installer/ffmpeg').path`):

```bash
FF=$(node -p "require('@ffmpeg-installer/ffmpeg').path")
for p in pose1-olhar pose2-limpando pose3-brinde; do
  "$FF" -y -loop 1 -i taverna-src/$p.png \
    -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0008,1.12)':d=96:s=1920x1080:fps=24" \
    -t 4 -r 24 -pix_fmt yuv420p /tmp/$p.mp4
done
"$FF" -y -i /tmp/pose1-olhar.mp4 -i /tmp/pose2-limpando.mp4 -i /tmp/pose3-brinde.mp4 \
  -filter_complex "[0][1]xfade=transition=fade:duration=1:offset=3[x1];[x1][2]xfade=transition=fade:duration=1:offset=6" \
  -pix_fmt yuv420p -movflags +faststart -crf 20 public/oraculo-taverna.mp4
"$FF" -y -ss 5 -i public/oraculo-taverna.mp4 -frames:v 1 -q:v 3 public/oraculo-taverna-poster.jpg
```

Resultado: 3 trechos de 4 s com zoom lento + 2 transições fade de 1 s = 10 s.

## 2. Publicar o delta sobre `origin/main`

- **Intro da taverna** em `src/main.jsx` (constantes `fundoUrl` →
  `./oraculo-taverna.mp4`, `posterUrl` → `./oraculo-taverna-poster.jpg`).
- **11 retratos novos** em `src/assets` + ligação em `src/classes.js`
  (`inovador`, `alquimista`, `ventanista`, `atleta`, `burgues`, `santo`,
  `sentinela`, `miragem`, `cruzado`, `capanga`, `comandante`) — grimório passa
  de 32 para **43 retratos**.
- **Mantenha tudo do PR #8** (`oraculo-fundo.mp4`, `oraculo-fundo.jpg` etc. no
  repo), exceto a troca do vídeo da intro.
- **NÃO altere as imagens de classe antigas** (as 32 existentes ficam intactas).

## 3. Restaurar mídia original (pedido do dono do repo)

```bash
git checkout d2f88e6 -- public/oraculo-loop.mp4 public/oraculo-poster.jpg
```

## 4. Commit, push, PR e merge

Trabalhe na branch da Arena da sessão; ao final:

```bash
git add -A && git commit -m "Taverna com logo da Armada na intro + 11 retratos novos"
git push origin HEAD
gh pr create --base main --fill
gh pr merge --merge
```

Aguarde o deploy do Pages (`gh run watch` no workflow `deploy-pages`).

## 5. Verificação item a item

1. `https://daniloxpteam.github.io/RPG-utilidades/?selftest` →
   **31 PASS / 0 FAIL** (local: `npm run build && node selftest-run.mjs`).
2. `public/oraculo-taverna.mp4` no ar (HTTP 200).
3. Grimório com **43 retratos** (32 antigos + 11 novos).
4. `public/oraculo-loop.mp4` e `public/oraculo-poster.jpg` **restaurados**.
5. Página inicial rodando a **taverna com o logo da Armada de Vectora** na intro.

---

*Reconstruído em 2026-08-15 (o original se perdeu com a sessão anterior; o
pipeline e os itens de verificação foram restaurados a partir do git e do app).*
