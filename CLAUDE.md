# Sentinela

Sistema de acompanhamento de cultivos que traduz a previsão do tempo para o que ela significa em cada lavoura.
Trabalho da disciplina **Projetos Integrados 2 (VIA231)** — Uniube.
Equipe: **Jessica Rodrigues** e **Larissa Miuki** (duas pessoas).

---

## ⚠ RESTRIÇÃO MAIS IMPORTANTE — leia antes de escrever qualquer código

A disciplina tem uma avaliação chamada **Live Coding**: em cada checkpoint, uma integrante é **sorteada aleatoriamente** e precisa **modificar o código ao vivo, na frente do professor, sem usar nenhuma IA**. Vale cerca de 2,5 pontos em cada um dos 5 checkpoints. Quem não souber explicar ou modificar derruba a nota das duas.

**Consequência direta para você, Claude:**

- Escreva o código **mais simples e explícito possível**, mesmo quando existir solução mais elegante.
- **Nada de abstrações espertas**: sem generics complexos, sem reflection, sem padrões de projeto sofisticados, sem "framework interno".
- **Prefira repetição a indireção.** Três métodos parecidos são melhores que um método genérico configurável.
- **Sem Lombok.** Getters e setters escritos por extenso. Anotação que gera código invisível é veneno em prova ao vivo.
- Uma regra de negócio vive em **um lugar óbvio**, na camada `service`. Se alguém precisar de mais de 30 segundos para achar onde mexer, está complexo demais.
- Comentários curtos em português onde a intenção não for evidente.
- **Não adicione dependências sem perguntar.**

Se você achar que a solução ideal é sofisticada, escolha a chata e diga por quê.

---

## O que o sistema faz

O produtor cadastra seus cultivos: qual cultura, em qual município, plantado em qual data. A partir disso:

1. O sistema busca a **previsão de 7 dias** na coordenada do município (Open-Meteo).
2. Compara com as **faixas climáticas daquela cultura**, guardadas no banco com a fonte registrada.
3. Gera **alertas em linguagem direta** — "Mínima de 10,4 °C na sexta; o feijão sofre dano abaixo de 12 °C".
4. Mostra a **fase do El Niño / La Niña** vigente no ciclo daquele cultivo.
5. Responde ao produtor **pelo Telegram**, em linguagem natural.

**Não existe modelo preditivo, estatística, aprendizado de máquina ou processamento de série histórica.** A previsão vem pronta das agências meteorológicas; a "inteligência" do sistema é comparação de valores.

---

## O agente no Telegram — regra de ouro

O agente é **canal de consulta**, não de cadastro. O CRUD continua no site.

**O modelo de linguagem NUNCA responde de cabeça.** Fluxo obrigatório:

```
1. Mensagem chega no webhook
2. Identifica o usuário pelo chat_id (usuario.telegram_chat_id)
3. Classifica a intenção (saudacao | consulta_cultivos | consulta_previsao |
                          consulta_alertas | nao_identificada)
4. O NOSSO backend busca os dados: cultivos, alertas já calculados, previsão
5. O modelo de linguagem recebe esses dados e SÓ REDIGE a resposta em português
6. Salva as duas mensagens na tabela `mensagem`
```

O modelo não sabe agronomia, não calcula alerta, não inventa número. Se não houver dado para responder, a resposta é dizer que não encontrou — nunca preencher a lacuna.

Se o chat não estiver vinculado a nenhuma conta, responda convidando a se cadastrar pelo site. Não crie usuário pelo Telegram.

**Apenas reativo.** O sistema só responde a quem mandou mensagem primeiro. Envio proativo está fora do escopo.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Backend | **Java 21 + Spring Boot 3** (Maven) |
| Persistência | Spring Data JPA |
| Banco | **MySQL 8.0.16+** (a versão importa: CHECK só é aplicado a partir dela) |
| Frontend | **React 18 + Vite** |
| HTTP no backend | `RestClient` do Spring |

**Migrations:** não usamos Flyway nem Liquibase. Os scripts SQL ficam em `/database` e são executados manualmente. Configure o JPA com `ddl-auto: validate` — nunca `update` ou `create`.

**Idioma do código:** tabelas, entidades, campos e endpoints em **português**. Classes em PascalCase (`Cultivo`), campos em camelCase (`dataPlantio`), colunas em snake_case (`data_plantio`) mapeadas com `@Column`.

---

## Estrutura de pastas (definida pelo checklist da disciplina — não altere)

Estrutura obrigatória publicada pelo professor: `/src`, `/database`, `/docs` e `README.md`.

```
/src
  /backend            projeto Spring Boot (pom.xml na raiz desta pasta)
    src/main/java/br/com/sentinela/
      controller/     endpoints REST
      service/        regras de negócio
      repository/     interfaces JPA
      model/          entidades
      dto/            objetos de entrada e saída
      client/         OpenMeteoClient, TelegramClient, ModeloLinguagemClient
      config/         segurança e CORS
  /frontend           projeto React + Vite
    src/
      pages/          Login  Painel  Cultivos  CultivoDetalhe  Culturas  Alertas
      components/     Tabela  Formulario  Filtro  CartaoPrevisao  BadgeAlerta
      api/            client.js
/database
  schema/01_ddl.sql
  seeds/02_dados_iniciais.sql
  er_dbdiagram.txt    fonte do diagrama (dbdiagram.io)
  er_diagrama.pdf
  er_diagrama.png
/docs
  atas/               ata_S03_2026-03-05.md, ata_S04_... (nome com semana e data)
  termo_abertura.md
  cronograma.md
  especificacao_api.md
  relatorio_final.md  (CP-5)
README.md
CLAUDE.md
.gitignore
.env.example
```

**Atas:** mínimo de 12 no semestre, uma por semana, no template do professor (participantes, pauta, decisões, tarefas com responsável e prazo, pendências anteriores). O nome do arquivo segue `ata_SXX_AAAA-MM-DD.md`.

---

## Modelo de dados — 7 tabelas

O DDL oficial está em `/database/schema/01_ddl.sql`. **Nunca altere o schema sem avisar** — ele foi entregue e mudança precisa ser combinada.

| Tabela | Conteúdo |
|---|---|
| `usuario` | id, nome, email (único), senha_hash, **telegram_chat_id** (único), criado_em |
| `municipio` | id, nome, uf, latitude, longitude · único (nome, uf) |
| `cultura` | id, nome, ciclo_dias, faixas ideais e críticas de temperatura e chuva, **fonte**, observacao |
| `fase_enso` | id, ano, mes, fase, intensidade, indice · único (ano, mes) |
| `cultivo` | id, usuario_id, municipio_id, cultura_id, apelido, area_ha, data_plantio, data_colheita_prevista, status · único (usuario_id, apelido) |
| `alerta` | id, cultivo_id, tipo, severidade, mensagem, data_prevista · único (cultivo_id, tipo, data_prevista) · ON DELETE CASCADE |
| `mensagem` | id, usuario_id (nulo se chat não vinculado), chat_id, direcao, conteudo, intencao, registrado_em |

Relacionamentos: `usuario 1─N cultivo`, `municipio 1─N cultivo`, `cultura 1─N cultivo`, `cultivo 1─N alerta`, `usuario 1─N mensagem`.

`status` do cultivo: `em_andamento`, `colhido`, `perdido`.
`tipo` do alerta: `geada`, `frio`, `calor`, `chuva_excessiva`, `deficit_hidrico`, `favoravel`.
`severidade`: `info`, `atencao`, `critico`.
`direcao` da mensagem: `recebida`, `enviada`.

---

## Regras de negócio

| # | Regra | Onde |
|---|---|---|
| 1 | `dataColheitaPrevista = dataPlantio + cultura.cicloDias` | `CultivoService`, ao criar |
| 2 | Data de plantio: até 1 ano no passado, até 6 meses no futuro | `CultivoService` → 400 |
| 3 | Apelido do cultivo único por usuário | banco + `CultivoService` → 409 |
| 4 | Cultivo `colhido` ou `perdido` não gera alerta novo | `AlertaService` |
| 5 | Avaliação compara previsão de 7 dias com as faixas da cultura | `AlertaService` |
| 6 | Alerta igual para a mesma data não duplica | banco + upsert |
| 7 | Município novo criado pela geocodificação; existente é reutilizado | `MunicipioService` |
| 8 | Cultura vinculada a cultivo em andamento não pode ser excluída | `CulturaService` → 409 |
| 9 | Fase do ENSO consultada por ano e mês (sem FK, sem cálculo) | `EnsoService` |
| 10 | **Se qualquer API externa falhar, o sistema não quebra** | try/catch nos services |
| 11 | Chat não vinculado recebe convite para se cadastrar | `AgenteService` |
| 12 | Toda mensagem recebida e enviada é salva em `mensagem` | `AgenteService` |

### Regra 5 em detalhe — o coração do sistema

```
minSemana   = menor temperature_2m_min dos 7 dias
maxSemana   = maior temperature_2m_max dos 7 dias
chuvaSemana = soma de precipitation_sum dos 7 dias

se minSemana <= cultura.tempCriticaBaixaC   → 'geada'            | critico
senão se minSemana < cultura.tempMinIdealC  → 'frio'             | atencao

se maxSemana >= cultura.tempCriticaAltaC    → 'calor'            | critico

se chuvaSemana > cultura.chuvaSemMaxMm      → 'chuva_excessiva'  | atencao
se chuvaSemana < cultura.chuvaSemMinMm      → 'deficit_hidrico'  | atencao

se nenhum disparou                          → 'favoravel'        | info
```

A mensagem é montada em português com o número e o dia da semana. Exemplo:
`"Mínima de 10,4 °C prevista para sexta-feira. O feijão sofre dano abaixo de 12 °C."`

---

## APIs externas

Só estas três. **Não adicione outras.** Todas são chamadas pelo backend, nunca pelo navegador.

### Open-Meteo — clima (gratuita, sem chave, CC BY 4.0)

Creditar no rodapé do site e no README.

```
# geocodificação do município
GET https://geocoding-api.open-meteo.com/v1/search?name=Uberlandia&count=5&language=pt&country=BR

# previsão de 7 dias
GET https://api.open-meteo.com/v1/forecast
    ?latitude=-18.91&longitude=-48.27
    &daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max
    &forecast_days=7&timezone=America/Sao_Paulo
```

### Telegram Bot API (Meta)

Número de teste gerado no painel de desenvolvedor, com até 5 destinatários liberados. O webhook precisa de URL pública HTTPS — em desenvolvimento, use ngrok.



### Modelo de linguagem

Chave em `LLM_API_KEY`. Usado **só para redigir**, conforme a regra de ouro acima.

### Fase do ENSO — carga única no seed, não é integração

Fonte: tabela ONI do Climate Prediction Center do NOAA (`cpc.ncep.noaa.gov`). Domínio público.
Conversão: valor ≥ +0,5 → El Niño · ≤ −0,5 → La Niña · entre os dois → Neutro.
Intensidade pelo valor absoluto: 0,5–0,9 fraco · 1,0–1,4 moderado · 1,5–1,9 forte · ≥ 2,0 muito forte.

### Faixas climáticas das culturas

Vêm de publicação da Embrapa e ficam na coluna `cultura.fonte`. **Nenhuma cultura entra no sistema sem fonte.** Se não houver referência, não cadastre a cultura — não invente número.

---

## Endpoints

```
POST   /auth/registrar
POST   /auth/login

GET                 /municipios/buscar?nome=       ← geocodificação
GET                 /municipios

GET    POST         /culturas
GET    PUT  DELETE  /culturas/{id}

GET    POST         /cultivos?status=&culturaId=&municipioId=
GET    PUT  DELETE  /cultivos/{id}
GET                 /cultivos/{id}/previsao
POST                /cultivos/{id}/avaliar         ← gera os alertas
GET                 /cultivos/{id}/contexto-enso

GET                 /alertas?cultivoId=&tipo=&severidade=&de=&ate=
DELETE              /alertas/{id}

GET                 /fases-enso?ano=
GET                 /painel/resumo

GET    POST         /webhook/telegram              ← recebe as mensagens do bot
GET                 /mensagens?chatId=
```

Erros: 400 validação · 401 não autenticado · 404 não encontrado · 409 conflito de regra.
Corpo do erro: `{ "detail": "mensagem em português" }`.

---

## Diagrama ER — como criar e manter

O diagrama é entregável obrigatório do CP-1 e precisa refletir o banco em qualquer checkpoint.

**A fonte da verdade é `/database/er_dbdiagram.txt`**, escrito em DBML. Para gerar ou atualizar o diagrama:

1. Abra `https://dbdiagram.io/d` e cole o conteúdo de `er_dbdiagram.txt`.
2. Confira se as 7 tabelas e os 5 relacionamentos aparecem.
3. Exporte em **PNG** e em **PDF** (menu Export).
4. Salve os dois em `/database/`, como `er_diagrama.png` e `er_diagrama.pdf`.
5. Comite os três arquivos juntos: DBML, PNG e PDF.

**Regra de consistência — toda mudança de schema move três arquivos ao mesmo tempo:**

```
database/schema/01_ddl.sql   →  o SQL que cria a tabela
database/er_dbdiagram.txt    →  a fonte do diagrama
database/er_diagrama.png/pdf →  a imagem exportada
```

Se você alterar um e esquecer os outros, o diagrama apresentado deixa de bater com o banco demonstrado — e é a primeira coisa que o professor percebe. Quando eu pedir mudança de schema, atualize o DDL e o DBML e **me avise para reexportar a imagem**, porque a exportação é manual.

Se o dbdiagram estiver fora do ar, o MySQL Workbench também gera o diagrama por engenharia reversa (Database → Reverse Engineer), mas o layout fica pior. Prefira o DBML.

---

## Checkpoints da disciplina

Cada checkpoint vale 10 pontos, assim divididos:

| Critério | Pontos |
|---|---|
| Apresentação | 2,5 |
| GitHub | 2,5 |
| Atas de reunião | 1,5 |
| Tecnologia | 1,5 |
| Live Code | 2,0 |

A AMOSTRATEC vale 50 (funcionamento end-to-end 25 · hospedagem 10 · qualidade técnica e defesa 15).

**Calendário oficial 2026/2 — quintas-feiras:**

| Data | Etapa |
|---|---|
| 27/08 | Apresentação do escopo |
| **03/09** | **CP-1 — Banco de dados: script SQL, modelo ER, termo de abertura** |
| 10/09 | Mentoria |
| 17/09 | CP-2 — Backend, API CRUD funcional |
| 24/09 | Mentoria |
| 01/10 | CP-3 — Integração, frontend consumindo API |
| 08/10 | Mentoria |
| 15/10 | CP-4 — MVP com fluxo completo end-to-end |
| 22/10 | Mentoria |
| 29/10 | CP-5 — Hospedagem ativa e deploy na nuvem |
| 10/12 | AMOSTRATEC — defesa final |

As semanas de mentoria entre os checkpoints são laboratório: use para tirar dúvida e adiantar o próximo.

**Datas ainda não confirmadas para 2026/2.** A sessão de 20/08 foi a apresentação de escopo.

| CP | Entrega técnica | Entrega de gestão |
|---|---|---|
| **CP-1** | Diagrama ER · script de criação · script de dados iniciais · banco rodando · README explicando tabelas e relacionamentos | Termo de abertura · cronograma · 2 atas · projeto no GitHub com issues, labels e responsáveis |
| **CP-2** | API com CRUD completo de pelo menos 2 entidades · tratamento de erro com status corretos · coleção do Insomnia · especificação da API em `/docs` | atas em dia · commits das duas |
| **CP-3** | Front consumindo a API · CRUD pela tela · filtros · feedback visual · **sistema já hospedado** | idem |
| **CP-4** | Fluxo completo: cadastro → previsão → alertas → agente no Telegram · todas as validações · autenticação | idem |
| **CP-5** | URL pública funcionando · banco em produção · README final com screenshots · relatório final | todas as atas em `/docs/atas` · board finalizado |

### Checklist detalhado

Antes de cada checkpoint, percorra a lista correspondente item por item. Se eu pedir "checa o CP-N", verifique o que dá para verificar no repositório e me diga o que está faltando.

**CP-1 — Banco de dados**

- [ ] Diagrama ER exportado em PNG e PDF em `/database`
- [ ] `01_ddl.sql` com todas as tabelas, PKs e FKs
- [ ] `02_dados_iniciais.sql` com INSERTs de exemplo em todas as tabelas
- [ ] Banco criado e populado, demonstrável ao vivo
- [ ] Queries de teste preparadas com antecedência (contagem por tabela e um SELECT com JOIN)
- [ ] README explicando cada tabela e cada relacionamento
- [ ] `/docs/termo_abertura.md` com nome, problema, objetivo, escopo, stack e integrantes
- [ ] `/docs/cronograma.md` de CP-1 a CP-5
- [ ] Duas atas em `/docs/atas`, no template do professor
- [ ] Projeto no GitHub com issues, labels e responsáveis
- [ ] Pastas `/src`, `/database` e `/docs` no repositório
- [ ] Pelo menos um commit de cada integrante
- [ ] As duas com acesso ao repositório na organização da turma

**CP-2 — API**

- [ ] CRUD completo (create, read, update, delete) de pelo menos 2 entidades
- [ ] Status HTTP corretos: 200, 201, 400, 404, 409
- [ ] Corpo de erro padronizado em português
- [ ] Coleção do Insomnia (ou Postman) commitada
- [ ] `.gitignore` configurado, sem `node_modules` nem `.env`
- [ ] README atualizado com instruções de como rodar
- [ ] `/docs/especificacao_api.md` com todos os endpoints
- [ ] Mínimo 2 atas novas
- [ ] Board com as tarefas do CP-2 em Done
- [ ] Cronograma atualizado
- [ ] Commits distribuídos entre as duas

**CP-3 — Integração**

- [ ] Todas as telas consumindo a API real, sem dado falso
- [ ] CRUD funcionando pela interface
- [ ] Filtros nas listagens
- [ ] Feedback visual de sucesso e de erro
- [ ] Navegação entre as telas
- [ ] **Sistema hospedado com URL pública** — não deixe para o CP-5
- [ ] Mínimo 3 atas novas
- [ ] Board e cronograma atualizados
- [ ] Retrospectiva breve registrada em ata

**CP-4 — MVP completo**

- [ ] Fluxo end-to-end: cadastra cultivo → recebe previsão → recebe alertas
- [ ] Agente do Telegram respondendo
- [ ] Todas as 12 regras de negócio implementadas
- [ ] Autenticação fechando as rotas
- [ ] Interface responsiva
- [ ] Nenhuma funcionalidade nova depois deste ponto
- [ ] Mínimo 3 atas novas
- [ ] Bugs e pendências como issues abertas no GitHub
- [ ] Branches por funcionalidade, com merge requests

**CP-5 — Produção e documentação**

- [ ] URL pública estável, testada no dia anterior
- [ ] Banco em produção com dados carregados
- [ ] README final com screenshots e créditos (Open-Meteo CC BY 4.0, NOAA, Embrapa)
- [ ] `docs/relatorio_final.md` — 1 página: planejado vs. entregue e lições aprendidas
- [ ] Cronograma final: cumprido vs. planejado
- [ ] Código limpo, sem log de depuração
- [ ] Repositório dentro da organização da turma no GitHub
- [ ] Todas as atas em `/docs/atas`
- [ ] Board finalizado, sem issue esquecida em `em-andamento`

**Em todos os checkpoints**

- [ ] As duas apresentam — participação de ambas é avaliada
- [ ] Ensaio de Live Coding com sorteio simulado antes da aula
- [ ] Ambiente local aberto numa aba como reserva, mais vídeo gravado da demonstração
- [ ] URL de produção acessada antes de apresentar, para acordar o serviço

**Hospedar já no CP-3, não no CP-5.** O professor recomenda explicitamente, e descobrir problema de deploy na última semana é o erro mais caro possível.

**Ordem de corte se o prazo apertar:** o agente no Telegram sai primeiro, depois o contexto do ENSO. O CRUD, a previsão e os alertas são intocáveis.

---

## Git e GitHub

Repositório remoto no **GitHub**, na organização da turma: `github.com/uniube-pi2-2026-2`. Você tem acesso ao git pelo terminal.

**Regras invioláveis:**

1. **Nunca faça push sem eu pedir explicitamente.** Commit local pode.
2. **Nunca use `--force`, `--amend` em commit já enviado, nem `reset --hard`** em nada que esteja no remoto.
3. **Nunca commite `.env`, token, senha ou credencial.** Se encontrar algo assim rastreado, pare e me avise antes de qualquer outra coisa.
4. **Nunca commite em nome da outra integrante.** A nota depende de cada uma ter commits próprios no histórico — o professor avalia autoria.
5. Commits pequenos e frequentes, um assunto por commit. **Commits semanais são obrigatórios.**
6. **Todo deploy exige um comentário registrando o que foi para o ar.** É requisito explícito do critério GitHub.

**Mensagens em português**, no formato `tipo: descrição no imperativo`, referenciando a issue:

```
feat: adiciona CRUD de cultura (#12)
fix: corrige cálculo da data de colheita prevista (#18)
docs: atualiza especificação da API (#7)
chore: configura conexão com MySQL (#3)
```

**Branches:** `main` protegida. Trabalho em branch por funcionalidade (`feat/crud-cultivo`), integração por merge request.

**Quadro Kanban:** GitHub Projects (aba Projects do repositório), com as colunas `To Do`, `Doing` e `Done`. Labels: `feature`, `bug`, `docs`, `database` e `futuro`. Milestone por checkpoint. Toda issue tem responsável.

Diferente do GitLab, no GitHub as colunas são de verdade — não são geradas por label.

Ideia nova vira issue com label `futuro` e **não é implementada**.

---

## Segredos

Tudo em `.env` na raiz, **fora do controle de versão**. O repositório guarda só o `.env.example`:

```
GITHUB_TOKEN=
DB_URL=
DB_USER=
DB_PASSWORD=
TELEGRAM_BOT_TOKEN=
LLM_API_KEY=
```

Confirme que `.env` está no `.gitignore` antes de qualquer commit.

---

## Como trabalhar comigo

- **Explique em português**, sempre.
- Ao criar algo novo, diga em uma frase **onde** ficou e **por quê** ali.
- Faça **uma coisa por vez**. Não gere cinco arquivos de uma vez sem eu revisar.
- Se eu pedir algo que quebre uma regra deste arquivo, **avise antes de fazer**.
- Se algo estiver ambíguo, **pergunte** em vez de assumir.
- Nada de TODO, código morto ou funcionalidade "para o futuro". O escopo é o que está aqui.
