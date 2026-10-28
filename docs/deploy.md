# Deploy

Três serviços, cada um num lugar:

| Peça | Onde | Endereço |
|---|---|---|
| Site (React) | Vercel | https://sentinela-sepia.vercel.app |
| API (Spring Boot) | Render, plano Starter | https://sentinela-api-38j2.onrender.com |
| Banco (MySQL 8.4) | Aiven | `sentinela-db-sentinela-db.d.aivencloud.com:16526` |
| Bot do WhatsApp (Evolution API) | notebook da Larissa, exposto pelo ngrok | ver a seção 4 |

A ordem de criação importa, porque um precisa do endereço do outro: banco → site (sem API) → API (com o endereço do banco e do site) → endereço da API no site.

Senhas e chaves **não** ficam no repositório: estão nas variáveis de ambiente do Render e com a Jessica.

---

## 1. Banco — Aiven (MySQL)

1. Em [console.aiven.io](https://console.aiven.io), crie um serviço **MySQL** (plano Developer, pago com os créditos do trial, sem cartão). Região na América do Norte, para ficar perto da API.
2. Em **Connection information**, anote o host, a porta, o usuário (`avnadmin`) e a senha.
3. Crie o banco e rode os 4 scripts, na ordem, da raiz do repositório:

```bash
H=<host>.aivencloud.com; P=<porta>; U=avnadmin
M="mysql -h $H -P $P -u $U -p --ssl-mode=REQUIRED --default-character-set=utf8mb4"
$M -e "CREATE DATABASE sentinela CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
for f in database/schema/01_ddl.sql database/seeds/02_dados_iniciais.sql database/seeds/03_orientacoes.sql database/seeds/04_demonstracao.sql; do
  $M --init-command="SET time_zone='-03:00'" sentinela < $f
done
```

- O `--default-character-set=utf8mb4` mantém os acentos certos.
- O banco da Aiven roda em UTC. O `--init-command` faz o seed da demonstração (que usa `CURDATE()` e `NOW()`) gravar as datas no horário de Brasília.
- Sem o cliente `mysql` instalado, dá para usar o do contêiner do docker-compose: `docker exec -i sentinela-mysql mysql ...`.

## 2. API — Render

O `src/backend/Dockerfile` compila o `.jar` com o Maven e roda só o Java, com a memória limitada aos 512 MB do plano e o fuso de Brasília (o servidor do Render roda em UTC).

1. Em [dashboard.render.com](https://dashboard.render.com): **New → Web Service**, repositório `odrgues/sentinela`.
2. Configuração:

| Campo | Valor |
|---|---|
| Language | Docker |
| Branch | `main` |
| Region | Virginia (US East), perto do banco |
| Root Directory | `src/backend` |
| Dockerfile Path | `./Dockerfile` |
| Instance Type | **Starter** (0,5 CPU, 512 MB). O Free (0,1 CPU) leva ~6 min para ligar e 2 a 4 s por tela, e dorme depois de 15 min parado. |
| Health Check Path | `/swagger-ui/index.html` |
| Build Filters → Included Paths | `src/backend/**` (só publica de novo quando o backend muda) |

3. **Environment Variables:**

| Variável | Valor |
|---|---|
| `DB_URL` | `jdbc:mysql://<host>:<porta>/sentinela?sslMode=REQUIRED&serverTimezone=America/Sao_Paulo&sessionVariables=time_zone=%27-03:00%27` |
| `DB_USER` | `avnadmin` |
| `DB_PASSWORD` | a senha da Aiven |
| `JWT_SECRET` | um texto aleatório longo (`openssl rand -base64 48`); nunca o valor padrão do repositório |
| `FRONT_ORIGENS` | `https://sentinela-sepia.vercel.app` (mais de um: separados por vírgula) |
| `FRONT_URL` | o mesmo endereço do site (vai no link do e-mail de nova senha) |
| `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD` | opcionais: Gmail com senha de app. Sem elas, o link de nova senha só aparece em **Logs** |
| `EVOLUTION_API_URL`, `EVOLUTION_API_KEY` | o bot do WhatsApp; ver a seção 4 |

O `sessionVariables` no `DB_URL` põe cada conexão da API no horário de Brasília. Sem ele, as horas gravadas pelo banco (como "Previsão atualizada às…") aparecem 3 horas adiantadas.

O Render lê a porta da variável `PORT`, que ele mesmo define; o `application.properties` usa `server.port=${PORT:8080}`.

4. Teste:
   - `https://<api>.onrender.com/swagger-ui/index.html` responde `200`: a API está no ar.
   - `https://<api>.onrender.com/api/painel` sem token responde `401` em JSON.

Cada push na `main` que mexe em `src/backend` publica a API de novo (uns 5 minutos; com o health check, a versão antiga responde até a nova ficar pronta).

As rotas `/api/interno/...` só existem no perfil `dev`, então não aparecem em produção.

## 3. Site — Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe `odrgues/sentinela`.
2. **Root Directory:** `src/frontend`. O resto a Vercel preenche (Vite, `npm run build`, `dist`).
3. **Settings → Environment Variables:**

| Variável | Valor |
|---|---|
| `VITE_API_URL` | `https://sentinela-api-38j2.onrender.com` (sem barra no fim e sem `/api`) |

As variáveis `VITE_` entram no momento do build: mudou alguma, faça um novo deploy (**Deployments → ⋯ → Redeploy**).

O `src/frontend/vercel.json` manda as rotas do site (como `/lavouras/1`) para o `index.html`, então abrir um link direto funciona. Cada push na `main` publica o site de novo. Os mapas (Leaflet, Esri e OpenStreetMap) não pedem chave.

## 4. Bot do WhatsApp — Evolution API

A Evolution API é um WhatsApp Web automatizado: um celular dedicado escaneia o QR Code e vira o número do bot. Ela roda no Docker do notebook da Larissa, e o ngrok dá a ela um endereço público.

```
celular do produtor ⇄ WhatsApp ⇄ Evolution (notebook, porta 8082) ⇄ ngrok
                                         │ webhook (mensagem recebida)        ▲ envio da resposta
                                         ▼                                    │
                              API no Render: /api/whatsapp/webhook ───────────┘
```

1. Na Evolution, a instância (`sentinela-bot2`) manda o evento `MESSAGES_UPSERT` para `https://<api>.onrender.com/api/whatsapp/webhook`.
2. O ngrok aponta para a Evolution: `ngrok http --url=<domínio-fixo>.ngrok-free.dev 8082`.
3. No Render, as variáveis da API:

| Variável | Valor |
|---|---|
| `EVOLUTION_API_URL` | o endereço do ngrok, ex.: `https://<domínio-fixo>.ngrok-free.dev`. Sem ela, a API tenta `localhost:8082` e o bot não responde |
| `EVOLUTION_API_KEY` | a `AUTHENTICATION_API_KEY` da Evolution |

O bot só funciona com o notebook da Larissa ligado, com o Docker da Evolution e o ngrok de pé. O site e a API funcionam sem ele.

---

## No dia da apresentação

A rotina das 6h roda em produção e troca a previsão fixa da conta do João pela previsão de verdade do dia. Para o painel mostrar os avisos da demonstração (um crítico, dois de atenção e um "tudo certo"), rode de novo o `04_demonstracao.sql` no banco de produção **depois das 6h** daquele dia:

```bash
mysql -h <host>.aivencloud.com -P <porta> -u avnadmin -p --ssl-mode=REQUIRED --default-character-set=utf8mb4 \
  --init-command="SET time_zone='-03:00'" sentinela < database/seeds/04_demonstracao.sql
```

Se preferirem mostrar o clima real, não precisa rodar nada: os avisos da conta do João passam a ser os da previsão do dia.

Antes de apresentar, abram o site uma vez para conferir que está tudo no ar, e mandem uma mensagem ao bot.

## Depois da apresentação

O Render cobra o Starter (US$ 7/mês) proporcional aos dias de uso. Para parar a cobrança: **Settings → Delete Web Service** no Render. O banco da Aiven usa os créditos do trial e desliga sozinho quando eles acabam; a Vercel é grátis.
