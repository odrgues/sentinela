# Especificação da API

Backend em `src/backend` (Java 21 + Spring Boot 3 + Spring Data JPA + MySQL 8). Esta é a referência das rotas como estão implementadas; as decisões de produto e o histórico estão no doc "Sentinela — Especificação da API".

## Convenções

- URL base: `http://localhost:8080/api` em desenvolvimento.
- Corpo sempre em JSON UTF-8, campos em camelCase.
- Login com token JWT no cabeçalho `Authorization: Bearer <token>`, válido por 7 dias.
- Rotas públicas: login, cadastro, esqueci a senha e nova senha. Todo o resto exige token, e o usuário vem do token, nunca da URL.
- Datas `AAAA-MM-DD`; data e hora em ISO 8601 com fuso (`2026-10-25T07:00:00-03:00`).
- Unidades: temperatura em °C, chuva em mm, área em hectares.
- Documentação interativa: `http://localhost:8080/swagger-ui.html`.

### Formato de erro (todas as rotas)

```json
{ "status": 400, "mensagem": "Confira os campos destacados.", "campos": { "apelido": "Dê um nome para a lavoura." } }
```

`campos` só aparece quando o erro é de um campo (validação ou conflito), com todos os campos que têm problema.

| Código | Quando |
|---|---|
| 200 / 201 / 204 | Deu certo / criou / deu certo sem corpo |
| 400 | Dado inválido ou faltando, JSON mal formado |
| 401 | Sem token, token vencido, ou e-mail/senha errados no login |
| 403 | Logado, mas sem permissão: cadastrar cultura sem ser admin, ou senha errada ao excluir a conta |
| 404 | Não existe (inclusive cultivo de outro usuário e `/api/cultivos/abc`) |
| 409 | Já existe: e-mail, WhatsApp ou apelido de lavoura repetido |
| 410 | Link de nova senha vencido, já usado ou inexistente |
| 429 | Pediu outro link de nova senha antes de 1 minuto |
| 500 | Erro inesperado (detalhe só no log) |

## Autenticação e senha

| Método | Rota | Sucesso |
|---|---|---|
| POST | `/api/auth/login` | 200 `{ token, usuario }` |
| POST | `/api/auth/esqueci-senha` | 200 sempre, tenha conta ou não |
| POST | `/api/auth/redefinir-senha` | 200 |

```json
POST /api/auth/login
{ "email": "joao@exemplo.com", "senha": "123456" }
200 { "token": "eyJ...", "usuario": { "id": 2, "nome": "João", "email": "joao@exemplo.com", "whatsappNumero": "+5534999999999", "avisosWhatsapp": true } }

POST /api/auth/esqueci-senha
{ "email": "joao@exemplo.com" }
200 { "mensagem": "Se existir uma conta com esse e-mail, enviamos um link." }

POST /api/auth/redefinir-senha
{ "token": "<código do link>", "novaSenha": "nova123" }
200 { "mensagem": "Senha alterada. Entre com a nova senha." }
```

O link `<FRONT_URL>/nova-senha?token=<código>` vale 30 minutos e uma vez só; o banco guarda só o hash SHA-256 do código. Sem `MAIL_HOST` configurado, o link aparece no log da API.

## Usuário

| Método | Rota | Sucesso |
|---|---|---|
| POST | `/api/usuario` | 201 `{ token, usuario }` (pública) |
| GET | `/api/usuario/me` | 200 |
| PATCH | `/api/usuario/me` | 200 |
| DELETE | `/api/usuario/me` | 204 |

```json
POST /api/usuario
{ "nome": "Maria", "email": "maria@exemplo.com", "senha": "abcdef", "whatsappNumero": "(34) 98888-7777" }

PATCH /api/usuario/me
{ "nome": "Maria Silva", "whatsappNumero": null, "avisosWhatsapp": false }

DELETE /api/usuario/me
{ "senha": "abcdef" }
```

- O WhatsApp é gravado no formato E.164 (`+5534988887777`).
- O PATCH aceita só `nome`, `whatsappNumero` (null desvincula) e `avisosWhatsapp`; campo ausente fica como está.
- Excluir a conta apaga os cultivos, a previsão e os alertas; as mensagens do WhatsApp ficam sem dono.

## Culturas

| Método | Rota | Sucesso |
|---|---|---|
| GET | `/api/culturas` | 200, em ordem alfabética |
| GET | `/api/culturas/{id}` | 200, com todas as faixas e a fonte |
| POST | `/api/culturas` | 201 (só `papel = admin`) |
| PATCH | `/api/culturas/{id}` | 200 (só `papel = admin`) |

```json
GET /api/culturas
[ { "id": 12, "nome": "Morango", "cicloDias": 220, "tipoCiclo": "continua", "descricaoCiclo": "Colhe a partir de 70 dias, por 5 meses" }, ... ]
```

`tipoCiclo`: `anual` (colhe no fim do ciclo), `cana` (ano e meio se plantada de janeiro a março, senão 12 meses), `continua` (a colheita começa no dia `inicioColheitaDias` e vai até `cicloDias`) e `perene` (com `mesInicioColheita`/`mesFimColheita`, tem safra; sem eles, `cicloDias` é o tempo até a primeira colheita). `descricaoCiclo` já vem pronta para a lista.

Regras do cadastro de cultura: `fonte` obrigatória; crítica baixa ≤ ideal mínima < ideal máxima ≤ crítica alta; chuva mínima < máxima; nome repetido dá 409; não há DELETE.

## Cultivos

| Método | Rota | Sucesso |
|---|---|---|
| POST | `/api/cultivos` | 201 |
| GET | `/api/cultivos` | 200, lista simples |
| GET | `/api/cultivos/{id}` | 200, detalhe completo |
| GET | `/api/cultivos/{id}/alertas` | 200, histórico |
| PATCH | `/api/cultivos/{id}` | 200 |
| DELETE | `/api/cultivos/{id}` | 204 |

### Criar

```json
POST /api/cultivos
{ "culturaId": 3, "apelido": "Talhão do fundo", "dataPlantio": "2026-08-27", "areaHa": 12,
  "latitude": -19.747812, "longitude": -47.931804, "cidade": "Uberaba", "uf": "MG" }

201
{ "id": 1, "apelido": "Talhão do fundo", "cultura": "Soja", "culturaId": 3, "dataPlantio": "2026-08-27",
  "colheitaPrevista": "2026-12-25", "areaHa": 12.0, "latitude": -19.747812, "longitude": -47.931804,
  "municipio": "Uberaba – MG", "status": "em_andamento" }
```

- O município é procurado por `(cidade, uf)`; se não existir, é criado com o ponto marcado.
- A previsão usa sempre o ponto exato do cultivo. Ao salvar, a API já busca a previsão e gera os avisos.
- `areaHa` é opcional e aceita até 4 casas (300 m² = 0,03 ha).
- Apelido repetido para o mesmo usuário dá 409.

### Editar ou encerrar

```json
PATCH /api/cultivos/1
{ "apelido": "Talhão novo", "dataPlantio": "2026-08-30", "areaHa": null }

PATCH /api/cultivos/1
{ "status": "colhido" }
```

Manda só o que mudou. Mudar cultura, data ou ponto refaz a colheita prevista, a previsão e os avisos. `status` só vai de `em_andamento` para `colhido` ou `perdido`.

### Detalhe

```json
GET /api/cultivos/1
{
  "id": 1, "apelido": "Talhão do fundo", "cultura": "Soja", "culturaId": 3, "areaHa": 12.0,
  "municipio": "Uberaba – MG", "latitude": -19.747812, "longitude": -47.931804, "status": "em_andamento",
  "tipoCiclo": "anual", "dataPlantio": "2026-09-10", "colheitaPrevista": "2027-01-08",
  "diaAtual": 45, "cicloDias": 120, "safra": null, "explicacaoCiclo": null,
  "previsaoDisponivel": true, "previsaoAtualizadaEm": "2026-10-25T07:00:00-03:00",
  "enso": { "fase": "El Nino", "intensidade": "muito forte", "indice": 2.16, "mesPlantio": "2026-08",
            "frase": "Você plantou em setembro de 2026, e a NOAA ainda não publicou esse mês. Em agosto de 2026, último mês medido, o Pacífico estava em um El Niño muito forte. ..." },
  "fase": { "nome": "Desenvolvimento vegetativo", "diaInicio": 10, "diaFim": 47,
            "orientacao": "A soja tolera melhor a falta de água nesta fase, ...", "fonte": "Embrapa Soja (...)" },
  "alertas": [
    { "tipo": "calor", "severidade": "critico", "data": "2026-10-28",
      "mensagem": "Semana de calor forte: máximas de 35,1 °C em média, acima do limite de 35 °C para soja. O pico é de 37 °C na quarta (28/10).",
      "porque": "Para soja, o ideal é uma média entre 20 °C e 30 °C; com máximas acima de 35 °C ao longo da semana, a planta sofre com o calor. Fonte: Embrapa.",
      "oQueFazer": "Na soja, calor acima de 38 °C, principalmente com falta de água, derruba flores e vagens. ..." }
  ],
  "previsao": [
    { "data": "2026-10-25", "condicao": "sol", "minC": 21, "maxC": 34, "chuvaMm": 0.0, "nivel": "ok", "frase": "Dentro do ideal" }
  ]
}
```

- `alertas`: os avisos da semana, do mais grave para o mais leve. `oQueFazer` é o texto da cultura para aquele tipo de aviso ou, sem ele, o genérico; `null` se não houver.
- `fase`: a fase do ciclo em que `diaAtual` cai; `null` nas culturas sem fases cadastradas e nas perenes.
- `enso`: a fase do mês do plantio; nas perenes, e quando a NOAA ainda não publicou o mês do plantio, a do último mês medido; `null` se o plantio for anterior a 2015. `efeito` (o que a fase costuma trazer para a região), `oQueFazer` e `fonte` vêm da tabela `orientacao_enso`: primeiro o texto da cultura, senão o geral da fase; `null` se não houver.
- Perene: `diaAtual` e `cicloDias` vêm `null`; com safra (café), `safra` traz `"2026/27"` e `explicacaoCiclo` traz "A colheita vai de maio a agosto.".
- `previsao`: até 7 dias, de hoje em diante. `condicao`: `sol`, `sol_nuvens`, `nublado`, `chuva` ou `tempestade`. `nivel`: `ok`, `atencao` ou `critico`.

### Histórico

```json
GET /api/cultivos/1/alertas?severidade=atencao&tipo=deficit_hidrico&de=2026-09-01&ate=2026-10-31&pagina=0
{ "itens": [ { "tipo": "deficit_hidrico", "severidade": "atencao", "data": "2026-10-25", "mensagem": "..." } ],
  "total": 1, "pagina": 0, "tamanho": 20 }
```

Filtros opcionais, do mais novo para o mais antigo, 20 por página.

## Painel

```json
GET /api/painel
{
  "usuario": { "nome": "João" },
  "hoje": { "cidade": "Uberaba", "uf": "MG", "tempC": 34, "condicao": "sol", "condicaoTexto": "céu limpo" },
  "frase": "Talhão do fundo: calor forte na quarta. Roça da baixada: pouca chuva na semana.",
  "previsaoDisponivel": true, "previsaoAtualizadaEm": "2026-10-25T07:00:00-03:00",
  "cultivos": [
    { "id": 1, "apelido": "Talhão do fundo", "cultura": "Soja", "tipoCiclo": "anual", "diaAtual": 45, "cicloDias": 120,
      "safra": null, "latitude": -19.747812, "longitude": -47.931804, "fase": "Desenvolvimento vegetativo",
      "aviso": { "tipo": "calor", "severidade": "critico", "mensagem": "Calor forte na quarta" } }
  ]
}
```

- `cultivos`: só os `em_andamento`, do aviso mais grave para o mais leve. `aviso` é o mais grave da semana.
- `hoje`: a cidade da lavoura do topo da lista, com a máxima prevista para hoje (`tempC` nulo se a previsão de hoje não chegou).
- O painel lê do banco o que a rotina já calculou; nunca chama a Open-Meteo na hora. Se a última busca falhou, `previsaoDisponivel` vem `false` e os dados salvos continuam aparecendo.

## Como os avisos são calculados

Rotina diária às 6h (America/Sao_Paulo), e também ao criar ou editar uma lavoura: busca na Open-Meteo os 7 dias do ponto do cultivo, guarda em `previsao_diaria` e refaz os avisos de hoje em diante.

| Tipo | Quando | Severidade |
|---|---|---|
| `geada` | mínima de algum dia abaixo de `temp_critica_baixa_c` | critico |
| `calor` | média das máximas dos 7 dias acima de `temp_critica_alta_c` (data = dia mais quente) | critico |
| `frio` | média da semana abaixo de `temp_min_ideal_c` (não nas perenes) | atencao |
| `calor` | média da semana acima de `temp_max_ideal_c` (não nas perenes) | atencao |
| `chuva_excessiva` | chuva da semana acima de `chuva_sem_max_mm` | atencao |
| `deficit_hidrico` | chuva da semana abaixo de `chuva_sem_min_mm` | atencao |
| `favoravel` | nenhum dos casos acima | info |

A dupla (cultivo, tipo, data) é única. Avisos críticos novos vão para o WhatsApp de quem tem número e não mandou PARAR (hoje simulado: grava em `mensagem` e escreve no log).

## Outras rotas

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/alertas` | Todos os alertas do usuário, com `oQueFazer` |
| POST | `/api/alertas/processar/cultivo/{id}` | Busca a previsão e refaz os avisos de uma lavoura na hora |
| GET | `/api/enso/atual`, `/api/enso/historico` | Série do El Niño / La Niña |
| GET | `/api/clima/municipio/{id}` | Previsão de 7 dias de um município (Open-Meteo, na hora) |
| GET | `/api/whatsapp/historico` | Mensagens do usuário |
| POST | `/api/interno/rodar-rotina` | Só no perfil `dev`: roda a rotina das 6h na hora |
| POST | `/api/interno/atualizar-enso` | Só no perfil `dev`: busca a série do El Niño na NOAA (a rotina roda todo dia 6 às 7h) |

Coleção do Postman com todas as rotas: [`postman_sentinela.json`](postman_sentinela.json).
