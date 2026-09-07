# Sentinela

Sistema de acompanhamento de cultivos que traduz a previsão do tempo para o que ela significa em cada lavoura.

Trabalho da disciplina **Projetos Integrados 2 (VIA231)** — Uniube.
Equipe: **Jessica Rodrigues** e **Larissa Miuki**.

> Este README cobre o que já está pronto no **CP-1 (banco de dados)**. As demais partes (API, front-end, agente no Telegram) chegam nos próximos checkpoints.

---

## Como rodar o banco

Pré-requisito: Docker.

```bash
docker compose up -d
```

Isso sobe um MySQL 8.0 na porta `3306`, com o banco `sentinela` já criado (usuário `root`, senha `root_local` — ver `docker-compose.yml`).

Depois, execute os scripts na ordem:

```bash
mysql -h127.0.0.1 -P3306 -uroot -proot_local sentinela < database/schema/01_ddl.sql
mysql -h127.0.0.1 -P3306 -uroot -proot_local sentinela < database/seeds/02_dados_iniciais.sql
```

As queries de teste usadas na demonstração ficam em `database/queries_demonstracao.sql`.

---

## Diagrama ER

Fonte: `database/er_dbdiagram.txt` (DBML, editável em [dbdiagram.io](https://dbdiagram.io)).
Exportado em `database/er_diagrama.png` e `database/er_diagrama.pdf`.

---

## As 7 tabelas

| Tabela | O que guarda |
|---|---|
| `usuario` | Quem usa o sistema — produtor cadastrado no site. `telegram_chat_id` liga a conta a uma conversa no Telegram (fica nulo até o produtor vincular). |
| `municipio` | Município onde um cultivo está plantado, com latitude/longitude — é o ponto usado para buscar a previsão na Open-Meteo. Criado por geocodificação na primeira vez que aparece; reaproveitado depois. |
| `cultura` | Uma cultura agrícola (feijão, milho, soja...) e suas faixas ideais e críticas de temperatura e chuva. Toda linha tem `fonte` preenchida — vêm de publicações da Embrapa, nunca de valor inventado. |
| `fase_enso` | Classificação mensal do fenômeno El Niño / La Niña (fase, intensidade, índice ONI), carregada uma vez no seed a partir da série do NOAA. Não tem relação com nenhuma outra tabela — é só consultada por ano e mês. |
| `cultivo` | O registro central: um produtor plantou uma cultura, num município, numa data. Guarda a data de colheita prevista (calculada) e o status atual. |
| `alerta` | Um aviso gerado ao comparar a previsão de 7 dias de um cultivo com as faixas da sua cultura — por exemplo, risco de geada ou de déficit hídrico. |
| `mensagem` | Histórico de conversa do agente no Telegram: toda mensagem recebida e enviada é salva aqui, mesmo quando o chat ainda não está vinculado a nenhum usuário. |

---

## Os 5 relacionamentos

```
usuario   1───N  cultivo
municipio 1───N  cultivo
cultura   1───N  cultivo
cultivo   1───N  alerta   (ON DELETE CASCADE — apagar o cultivo apaga seus alertas)
usuario   1───N  mensagem (usuario_id fica nulo se o chat não for vinculado)
```

- **`cultivo` é o centro do modelo**: cada linha aponta para o produtor (`usuario_id`), o local (`municipio_id`) e a cultura plantada (`cultura_id`). É daqui que tudo o mais deriva.
- **`alerta` depende de `cultivo`**: um alerta não existe sozinho, sempre pertence a um cultivo. Apagar o cultivo apaga os alertas junto (`ON DELETE CASCADE`).
- **`mensagem` depende de `usuario`, mas de forma opcional**: `usuario_id` pode ser nulo, porque o agente responde a qualquer chat que escrever — mesmo um número ainda não cadastrado no site.
- **`fase_enso` não tem FK com ninguém**: é uma tabela de referência solta, consultada por ano/mês quando o sistema mostra o contexto climático de um cultivo.

---

## Créditos

- Previsão do tempo e geocodificação: [Open-Meteo](https://open-meteo.com) (CC BY 4.0)
- Fase do ENSO: [NOAA — Climate Prediction Center](https://www.cpc.ncep.noaa.gov) (domínio público)
- Faixas climáticas das culturas: publicações da Embrapa (fonte registrada em cada linha de `cultura.fonte`)
