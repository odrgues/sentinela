# Sentinela

Sistema de acompanhamento de cultivos que traduz a previsão do tempo para o que ela significa em cada lavoura: o que vai acontecer, por quê, e o que fazer.

Trabalho da disciplina **Projetos Integrados 2 (VIA231)** — Uniube.
Equipe: **Jessica Rodrigues** e **Larissa Miuki**.

```
database/       schema (01) e seeds (02 a 04) do MySQL
src/backend/    API em Spring Boot
src/frontend/   site em Vite + React + TypeScript
```

---

## Como rodar tudo

Pré-requisitos: Docker, Java 21 e Node 22.22 ou mais novo.

### 1. Banco

```bash
docker compose up -d
```

Sobe um MySQL 8.0 na porta **3307**, com o banco `sentinela` já criado (usuário `root`, senha `root_local`). Depois, rode os scripts na ordem:

```bash
M="docker exec -i sentinela-mysql mysql -uroot -proot_local --default-character-set=utf8mb4 sentinela"
$M < database/schema/01_ddl.sql            # as 12 tabelas
$M < database/seeds/02_dados_iniciais.sql  # municípios, 19 culturas, série do El Niño, administrador
$M < database/seeds/03_orientacoes.sql     # "O que fazer" de cada aviso e as fases do ciclo
$M < database/seeds/04_demonstracao.sql    # conta de demonstração com 4 lavouras
```

Para recriar do zero, apague o banco antes: `docker exec sentinela-mysql mysql -uroot -proot_local -e "DROP DATABASE sentinela; CREATE DATABASE sentinela CHARACTER SET utf8mb4;"`.

### 2. API

```bash
cd src/backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

Sobe em `http://localhost:8080`. O perfil `dev` libera `POST /api/interno/rodar-rotina`, que roda na hora a rotina das 6h (previsão nova, avisos refeitos e WhatsApp), e `POST /api/interno/atualizar-enso`, que busca na NOAA a série do El Niño (a rotina automática roda todo dia 6). A documentação interativa fica em `http://localhost:8080/swagger-ui.html`.

Tudo o que muda em produção vem de variáveis de ambiente, com valores de desenvolvimento como padrão (ver `.env.example`): `DB_URL`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `FRONT_ORIGENS`, `FRONT_URL` e `MAIL_HOST`/`MAIL_USER`/`MAIL_PASSWORD`. Sem `MAIL_HOST`, o link de "Esqueci minha senha" aparece no log da API em vez de ir por e-mail.

### 3. Front

```bash
cd src/frontend
npm install
npm run dev:api   # o site falando com a API de verdade (a da porta 8080)
npm run dev       # o site com a API de mentira, sem precisar do backend
```

Abre em `http://localhost:5173`. Os mapas são do Leaflet, com imagens da Esri e endereços do OpenStreetMap: não pedem chave nem conta. Detalhes em [`src/frontend/README.md`](src/frontend/README.md).

### Deploy

Backend e banco no Azure, front na Vercel: passo a passo e variáveis em [`docs/deploy.md`](docs/deploy.md).

### Contas

| Conta | Senha | Para quê |
|---|---|---|
| `joao@exemplo.com` | `123456` | Produtor da demonstração, com 4 lavouras perto de Uberaba |
| `admin@sentinela.com` | `admin123` | Único que cadastra e altera culturas pela API (Postman) |

---

## Roteiro da apresentação

1. Na manhã da apresentação, depois das 6h, rode de novo `database/seeds/04_demonstracao.sql` no banco de produção (comando em [`docs/deploy.md`](docs/deploy.md)). Ele recria o João com a previsão e os avisos fixos a partir do dia de hoje, para o painel mostrar um aviso crítico, dois de atenção e um "tudo certo" sem depender do clima do dia. A rotina das 6h e editar uma lavoura trocam esses dados pela previsão de verdade.
2. Entre como João: o painel mostra a frase da semana, o tempo de hoje e as 4 lavouras com a fase do ciclo e o aviso principal.
3. Abra o **Talhão do fundo** (soja): fase do ciclo com a fonte, El Niño, o aviso crítico de calor com **O que fazer** e **Por quê?**, a previsão de 7 dias e o histórico.
4. Abra o **Canteiro de morango**: hortaliça de colheita contínua, já na fase de colheita, com orientações próprias do morango.
5. Cadastre uma lavoura nova (ex.: chuchu, 300 m²): a API busca a previsão real da Open-Meteo para o ponto marcado e já gera os avisos.
6. Mostre a tabela `mensagem` (ou `GET /api/whatsapp/historico`): o aviso crítico foi "enviado" pelo WhatsApp com a linha "O que fazer".

---

## Rotas da API

Todas exigem `Authorization: Bearer <token>`, menos login, cadastro, esqueci a senha e nova senha. Erros sempre no formato `{ status, mensagem, campos }`. Contrato completo no doc "Sentinela — Especificação da API".

| Método | Rota | Tela |
|---|---|---|
| `POST` | `/api/auth/login` | Entrar |
| `POST` | `/api/auth/esqueci-senha` | Esqueci minha senha, Trocar senha |
| `POST` | `/api/auth/redefinir-senha` | Criar nova senha (410 com link vencido) |
| `POST` | `/api/usuario` | Cadastro (já devolve o token) |
| `GET` `PATCH` `DELETE` | `/api/usuario/me` | Minha conta, Excluir conta |
| `GET` | `/api/culturas` | Lista de "O que você plantou?" |
| `GET` | `/api/culturas/{id}` | Faixas e fonte de uma cultura |
| `POST` `PATCH` | `/api/culturas`, `/api/culturas/{id}` | Só o administrador (403 para os outros) |
| `GET` | `/api/painel` | Painel |
| `POST` | `/api/cultivos` | Nova lavoura (pelo ponto do mapa) |
| `GET` | `/api/cultivos/{id}` | Detalhe: ciclo, fase, El Niño, avisos com "O que fazer", previsão |
| `GET` | `/api/cultivos/{id}/alertas` | Histórico, com filtros e 20 por página |
| `PATCH` | `/api/cultivos/{id}` | Editar lavoura, Já colhi |
| `DELETE` | `/api/cultivos/{id}` | Excluir lavoura |
| `GET` | `/api/alertas`, `/api/enso/atual`, `/api/whatsapp/historico` | Consultas de apoio |

Referência completa das rotas, com exemplos: [`docs/especificacao_api.md`](docs/especificacao_api.md). Coleção do Postman com todas elas: [`docs/postman_sentinela.json`](docs/postman_sentinela.json) (a do CP-2 continua em `docs/postman_cp2.json`).

---

## Como o Sentinela decide o aviso

Uma rotina roda todo dia às 6h (e logo depois de salvar ou editar uma lavoura): busca na Open-Meteo os 7 dias do **ponto exato** da lavoura, guarda em `previsao_diaria` e compara com as faixas da cultura.

| Aviso | Quando | Nível |
|---|---|---|
| Geada ou frio forte | mínima de algum dia abaixo do limite crítico de frio | crítico |
| Calor forte | média das máximas dos 7 dias acima do limite crítico de calor (um dia quente sozinho fica em atenção) | crítico |
| Semana fria ou quente | média da semana fora da faixa ideal (não vale para perenes) | atenção |
| Chuva demais ou pouca chuva | chuva da semana fora da faixa da cultura | atenção |
| Tudo certo | nenhum dos casos acima | info |

Cada aviso vem com três partes: a **mensagem** (o que vai acontecer), o **Por quê?** (a faixa da cultura e a fonte) e o **O que fazer** (tabela `recomendacao`: primeiro o texto da cultura; sem ele, o genérico do tipo de aviso). A lavoura também mostra a **fase do ciclo** em que está (tabela `fase_cultura`) e o que essa fase pede. Todo texto e todo número têm fonte da Embrapa, do MAPA ou da EPAMIG, registrada na coluna `fonte`.

Os avisos críticos novos vão para o WhatsApp de quem não mandou PARAR. Enquanto a conta da Meta não está ligada, o envio é simulado: a mensagem é gravada em `mensagem` e aparece no log.

---

## As culturas

| Tipo de ciclo | Culturas | Como funciona |
|---|---|---|
| `anual` | feijão, milho, soja, algodão, sorgo, trigo, arroz, alface, brócolis, repolho | colhe no fim do ciclo; "Dia X de Y" |
| `cana` | cana-de-açúcar | ano e meio se plantada de janeiro a março, senão 12 meses |
| `continua` | tomate, pepino, couve, morango, chuchu | a colheita começa no meio do ciclo e vai até o fim |
| `perene` | café, banana, goiaba | só os limites críticos geram aviso; o café tem safra (colheita de maio a agosto) |

São 19 culturas. As frutas e hortaliças entraram quando havia, em publicação técnica, todos os números que o sistema precisa: faixa ideal, limites de dano por frio e por calor, necessidade de água e duração do ciclo. A fonte preferida é sempre a Embrapa ou o MAPA; quando eles não dão o número, ele vem do IAC, da Epagri ou da FAO (Ecocrop), e a coluna `fonte` diz qual. Ficaram de fora a rúcula e a couve-flor, que não têm limite de dano por temperatura em número em nenhuma dessas fontes.

Geada: a mínima do ar abaixo de 3 °C (medida a 2 m, como na previsão) indica temperatura negativa na planta, o critério usado pela Embrapa Clima Temperado (Doc. 283), pela Embrapa Trigo e pela Epagri.

---

## As 12 tabelas

| Tabela | O que guarda |
|---|---|
| `usuario` | Produtor cadastrado no site, com o WhatsApp (E.164), a chave `avisos_whatsapp` (PARAR/VOLTAR) e o `papel` (`produtor` ou `admin`). |
| `redefinicao_senha` | Links de nova senha: só o hash SHA-256 do código, a validade (30 min) e quando foi usado. |
| `municipio` | Município de cada lavoura. Entra sozinho quando alguém marca uma lavoura numa cidade nova. |
| `cultura` | Cultura agrícola, o tipo de ciclo e as faixas ideais e críticas de temperatura e chuva, sempre com `fonte`. |
| `recomendacao` | O "O que fazer" de cada tipo de aviso, por cultura ou genérico (`cultura_id` nulo), com fonte. |
| `fase_cultura` | As fases do ciclo de cada cultura, em dias desde o plantio, com a orientação e a fonte. |
| `fase_enso` | Classificação mensal do El Niño / La Niña (série oficial ONI da NOAA). |
| `orientacao_enso` | O que cada fase do El Niño / La Niña costuma trazer para a região e o que fazer, geral ou por cultura, com fonte. |
| `cultivo` | O registro central: quem plantou o quê, onde (ponto exato no mapa), quando, e se a última previsão deu certo. |
| `previsao_diaria` | Os 7 dias de previsão de cada cultivo, guardados pela rotina. O painel lê daqui. |
| `alerta` | Os avisos gerados para cada cultivo e dia. |
| `mensagem` | Histórico do WhatsApp: tudo o que foi recebido e enviado. |

```
usuario   1───N  cultivo            (ON DELETE CASCADE)
usuario   1───N  redefinicao_senha  (ON DELETE CASCADE)
usuario   1───N  mensagem           (usuario_id fica nulo se o chat não for vinculado)
municipio 1───N  cultivo
cultura   1───N  cultivo
cultura   1───N  recomendacao       (cultura_id nulo = vale para todas)
cultura   1───N  fase_cultura
cultura   1───N  orientacao_enso    (cultura_id nulo = vale para todas)
cultivo   1───N  alerta             (ON DELETE CASCADE)
cultivo   1───N  previsao_diaria    (ON DELETE CASCADE)
```

`fase_enso` não tem FK com ninguém: é consultada pelo mês do plantio (ou o último mês medido, nas perenes).

O diagrama ER fica em `database/er_dbdiagram.txt` (DBML, editável em [dbdiagram.io](https://dbdiagram.io)). As imagens `database/er_diagrama.png` e `.pdf` são da versão do CP-1: para atualizar, cole o DBML no dbdiagram.io e exporte de novo.

---

## Créditos

- Previsão do tempo: [Open-Meteo](https://open-meteo.com) (CC BY 4.0)
- Fase do ENSO: [NOAA — Climate Prediction Center](https://www.cpc.ncep.noaa.gov) (domínio público)
- Faixas das culturas, recomendações e fases: publicações da Embrapa, do MAPA (ZARC), da EPAMIG, do IAC, da Epagri e da FAO (Ecocrop), citadas com a página em cada linha das tabelas `cultura`, `recomendacao` e `fase_cultura`
