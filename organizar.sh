#!/usr/bin/env bash
# Sentinela — organiza a estrutura de pastas do repositório.
# Rode na raiz do repositório clonado:  bash organizar.sh
# É seguro rodar mais de uma vez.

set -euo pipefail

# --- confere que estamos num repositório git ---
if [ ! -d .git ]; then
  echo "ERRO: rode este script na raiz do repositório clonado (não achei a pasta .git)."
  exit 1
fi

echo "==> Criando estrutura de pastas"
mkdir -p src/backend src/frontend
mkdir -p database/schema database/seeds
mkdir -p docs/atas

# .gitkeep para o git versionar as pastas ainda vazias
for d in src/backend src/frontend docs/atas; do
  [ -e "$d/.gitkeep" ] || touch "$d/.gitkeep"
done

# --- move um arquivo só se ele existir na raiz ---
mover() {
  origem="$1"; destino="$2"
  if [ -f "$origem" ]; then
    mkdir -p "$destino"
    mv "$origem" "$destino"/
    echo "    $origem -> $destino/"
  fi
}

echo "==> Movendo arquivos para seus lugares"
mover "01_ddl.sql"                  "database/schema"
mover "Script_SQL.sql"              "database/schema"
mover "02_dados_iniciais.sql"       "database/seeds"
mover "Script_dados_iniciais.sql"   "database/seeds"
mover "er_dbdiagram.txt"            "database"
mover "Diagrama_ER.pdf"             "database"
mover "er_diagrama.pdf"             "database"
mover "er_diagrama.png"             "database"
mover "sentinela-escopo.pdf"        "docs"
mover "sentinela-escopo.pptx"       "docs"
mover "kanban-gitlab-sentinela.md"  "docs"
mover "texto-corrido-sentinela.pdf" "docs"
mover "texto-corrido-sentinela.txt" "docs"
mover "roteiro-fala-sentinela.pdf"  "docs"

# --- rascunhos que não devem ir para o repositório ---
echo "==> Rascunhos encontrados na raiz (não fazem parte do projeto)"
RASCUNHOS=(
  "proposta-projeto-enso.md" "proposta-plano-janela.md" "proposta-plano-janela.pdf"
  "proposta-safra-certa.md" "proposta-sentinela.md" "proposta-sentinela.pdf"
  "plano-agro-vs-pecuaria.md" "plano-execucao-agro.md" "plano-execucao-pecuaria.md"
  "apresentacao-escopo-sentinela.md" "roteiro-fala-sentinela.md"
  "texto-corrido-sentinela.md"
)
mkdir -p .rascunhos
achou=0
for f in "${RASCUNHOS[@]}"; do
  if [ -f "$f" ]; then mv "$f" .rascunhos/; echo "    $f -> .rascunhos/"; achou=1; fi
done
[ "$achou" -eq 0 ] && echo "    nenhum"

# --- modelo de ata, no formato do professor ---
echo "==> Escrevendo modelo de ata em docs/atas"
if [ ! -f docs/atas/_modelo_ata.md ]; then
cat > docs/atas/_modelo_ata.md <<'EOF'
# Ata de Reunião — Semana SXX

Data: DD/MM/AAAA
Horário: HH:MM – HH:MM
Local/Plataforma: Presencial / Discord / Meet
Grupo: Sentinela

## Participantes
| Nome | Presente |
|------|----------|
| Jessica Rodrigues | ✅ / ❌ |
| Larissa Miuki | ✅ / ❌ |

## Pauta
1. [Tópico 1]
2. [Tópico 2]

## Decisões Tomadas
- Decisão 1
- Decisão 2

## Tarefas Definidas
| Tarefa | Responsável | Prazo |
|--------|------------|-------|
| Tarefa X | Nome | DD/MM |

## Pendências Anteriores
- [x] Tarefa concluída
- [ ] Tarefa pendente

## Observações
Anotações relevantes.
EOF
echo "    docs/atas/_modelo_ata.md  (nomeie as atas como ata_S03_2026-03-05.md)"
fi

# --- .gitignore ---
echo "==> Escrevendo .gitignore"
cat > .gitignore <<'EOF'
# Segredos
.env
.env.local

# Rascunhos do planejamento (não fazem parte do projeto)
.rascunhos/

# Java / Maven
target/
*.class
*.jar

# Node / Vite
node_modules/
dist/
.vite/

# IDE
.idea/
.vscode/
*.iml

# Sistema
.DS_Store
Thumbs.db
EOF

# --- .env.example ---
echo "==> Escrevendo .env.example"
cat > .env.example <<'EOF'
# Banco de dados
DB_URL=jdbc:mysql://localhost:3306/sentinela?useSSL=false&serverTimezone=America/Sao_Paulo&allowPublicKeyRetrieval=true
DB_USER=
DB_PASSWORD=

# GitLab (somente para a API: issues, labels, milestones)
GITLAB_TOKEN=

# Telegram Bot API
TELEGRAM_BOT_TOKEN=

# Modelo de linguagem
LLM_API_KEY=
EOF

# --- verificações finais ---
echo ""
echo "==> Verificações"
if git ls-files --error-unmatch .env >/dev/null 2>&1; then
  echo "    ATENÇÃO: o .env está rastreado pelo git. Rode: git rm --cached .env"
else
  echo "    ok: .env não está rastreado"
fi
[ -f CLAUDE.md ] && echo "    ok: CLAUDE.md na raiz" || echo "    ATENÇÃO: CLAUDE.md não está na raiz"
[ -f database/schema/01_ddl.sql ] && echo "    ok: DDL em database/schema" || echo "    ATENÇÃO: não achei o DDL"
[ -f database/er_dbdiagram.txt ] && echo "    ok: DBML em database" || echo "    ATENÇÃO: não achei o er_dbdiagram.txt"
[ -d src ] && echo "    ok: pasta src" || echo "    ATENÇÃO: falta a pasta src"

echo ""
echo "==> Estrutura final"
if command -v tree >/dev/null 2>&1; then
  tree -a -I '.git|node_modules|.rascunhos' -L 3
else
  find . -path ./.git -prune -o -path ./.rascunhos -prune -o -print | sed 's|[^/]*/|  |g'
fi

echo ""
echo "Pronto. Confira o resultado, depois rode: git status"
echo "Ainda falta (na mão): exportar o diagrama do dbdiagram.io para database/,"
echo "escrever docs/termo_abertura.md, docs/cronograma.md e as atas em docs/atas"
echo "(use docs/atas/_modelo_ata.md, nomeando como ata_S03_2026-03-05.md)."
