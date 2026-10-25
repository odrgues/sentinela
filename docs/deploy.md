# Deploy

Backend e banco no Azure (Larissa), front no Cloudflare Pages (Jessica). A ordem importa, porque um precisa do endereço do outro:

1. Larissa sobe o banco e a API e passa o endereço da API (`https://<app>.azurewebsites.net`).
2. Jessica publica o front com esse endereço e passa o endereço do site (`https://<projeto>.pages.dev`).
3. Larissa coloca o endereço do site no CORS e no link de nova senha da API.

---

## 1. Banco — Azure Database for MySQL (Flexible Server)

1. Crie o servidor MySQL **8.0** (plano B1MS do Azure for Students). Anote o host (`<servidor>.mysql.database.azure.com`), o usuário e a senha do administrador.
2. Em **Rede**, libere o seu IP (para rodar os scripts) e marque **Permitir acesso público de qualquer serviço do Azure** (para a API conseguir entrar).
3. Em **Parâmetros do servidor**, mude `time_zone` para `-03:00`. O Azure começa em UTC; o banco local (docker-compose) já roda em `-03:00`, e o seed da demonstração usa `CURDATE()` e `NOW()`. Sem isso, os horários da demonstração ficam 3 horas adiantados.
4. Crie o banco e rode os 4 scripts, na ordem, da raiz do repositório:

```bash
H=<servidor>.mysql.database.azure.com
U=<usuario-admin>
mysql -h $H -u $U -p --ssl-mode=REQUIRED -e "CREATE DATABASE sentinela CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;"
for f in database/schema/01_ddl.sql database/seeds/02_dados_iniciais.sql database/seeds/03_orientacoes.sql database/seeds/04_demonstracao.sql; do
  mysql -h $H -u $U -p --ssl-mode=REQUIRED --default-character-set=utf8mb4 sentinela < $f
done
```

O `--default-character-set=utf8mb4` é o que mantém os acentos certos.

## 2. API — Azure App Service

1. Gere o `.jar`:

```bash
cd src/backend
./mvnw clean package -DskipTests
# gera target/backend-0.0.1-SNAPSHOT.jar
```

2. Crie um **App Service** Linux, pilha **Java 21**, servidor **Java SE**, plano B1.
3. Em **Configuração → Configurações gerais**, ligue o **Always On**. Sem ele a API dorme, e a rotina das 6h (previsão e avisos) e a do dia 6 (El Niño) não rodam.
4. Em **Configuração → Configurações do aplicativo**, crie as variáveis:

| Variável | Valor |
|---|---|
| `DB_URL` | `jdbc:mysql://<servidor>.mysql.database.azure.com:3306/sentinela?useSSL=true&requireSSL=true&serverTimezone=America/Sao_Paulo` |
| `DB_USER` | usuário do MySQL |
| `DB_PASSWORD` | senha do MySQL |
| `JWT_SECRET` | um texto aleatório longo (ex.: `openssl rand -base64 48`); nunca o valor padrão do repositório |
| `FRONT_ORIGENS` | endereço do site, ex.: `https://sentinela.pages.dev` (mais de um: separados por vírgula) |
| `FRONT_URL` | o mesmo endereço do site (vai no link do e-mail de nova senha) |
| `MAIL_HOST` | `smtp.gmail.com` |
| `MAIL_PORT` | `587` |
| `MAIL_USER` | o Gmail do projeto (ex.: `sentinela.avisos@gmail.com`) |
| `MAIL_PASSWORD` | a **senha de app** do Google (exige verificação em 2 etapas na conta), não a senha normal |
| `SERVER_PORT` | `80`, se o Azure não definir sozinho (a API escuta em 8080 por padrão) |

Sem as variáveis de e-mail, "Esqueci minha senha" continua respondendo, mas o link só aparece no log da API (**Fluxo de log** do App Service).

5. Publique o `.jar` (pelo **Centro de Implantação**, ou com a CLI):

```bash
az webapp deploy --resource-group <grupo> --name <app> --src-path target/backend-0.0.1-SNAPSHOT.jar --type jar
```

6. Teste:
   - `https://<app>.azurewebsites.net/api/painel` sem token responde `401` em JSON: a API está no ar.
   - No Postman (`docs/postman_sentinela.json`), troque `baseUrl` para `https://<app>.azurewebsites.net/api` e rode **Entrar (João)** e **Painel**.

As rotas `/api/interno/...` só existem no perfil `dev`, então não aparecem em produção.

## 3. Front — Cloudflare Pages

1. Em **Workers & Pages → Criar → Pages → Conectar ao Git**, escolha o repositório `odrgues/sentinela`.
2. Configuração do build:

| Campo | Valor |
|---|---|
| Branch de produção | `main` |
| Diretório raiz | `src/frontend` |
| Comando de build | `npm run build` |
| Pasta de saída | `dist` |

3. **Variáveis de ambiente** (produção):

| Variável | Valor |
|---|---|
| `VITE_API_URL` | `https://<app>.azurewebsites.net` (sem barra no fim e sem `/api`) |
| `VITE_GOOGLE_MAPS_KEY` | a chave do Google Maps |
| `VITE_GOOGLE_MAP_ID` | o Map ID |
| `NODE_VERSION` | `22` |

As variáveis `VITE_` entram no momento do build: mudou alguma, rode um novo deploy.

4. Depois do primeiro deploy:
   - passe o endereço `https://<projeto>.pages.dev` para a Larissa colocar em `FRONT_ORIGENS` e `FRONT_URL`;
   - adicione `https://<projeto>.pages.dev/*` nas restrições de site da chave do Google Maps.
5. Teste no celular e no computador: entrar como João, painel, detalhe de uma lavoura, nova lavoura no mapa, "Esqueci minha senha".

O Pages já devolve o `index.html` para rotas como `/lavouras/1` (o site não tem `404.html`), então abrir um link direto funciona.

---

## No dia da apresentação

A rotina das 6h roda em produção e troca a previsão fixa da conta do João pela previsão de verdade do dia. Para o painel mostrar os avisos da demonstração (um crítico, dois de atenção e um "tudo certo"), rode de novo o `04_demonstracao.sql` no banco de produção **depois das 6h** daquele dia:

```bash
mysql -h <servidor>.mysql.database.azure.com -u <usuario> -p --ssl-mode=REQUIRED --default-character-set=utf8mb4 sentinela < database/seeds/04_demonstracao.sql
```

Se preferirem mostrar o clima real, não precisa rodar nada: os avisos da conta do João passam a ser os da previsão do dia.

Antes de apresentar, abram o site e a API uma vez, para conferir que está tudo no ar.
