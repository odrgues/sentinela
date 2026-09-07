# Termo de Abertura do Projeto

**Sentinela** — Tradutor de previsão do tempo para pequenos produtores
Projetos Integrados 2 (VIA231) · Uniube · 2026/2

## 1. Identificação

| | |
|---|---|
| **Projeto** | Sentinela |
| **Equipe** | Jessica Rodrigues · Larissa Miuki |
| **Disciplina** | Projetos Integrados 2 (VIA231) |
| **Período** | 2026/2 |

## 2. Problema

A previsão do tempo é gratuita e está disponível em qualquer celular, mas é apresentada de forma genérica — em milímetros e graus. Traduzir esses números para o que significam em uma lavoura específica exige conhecimento agronômico que o produtor de pequeno e médio porte nem sempre tem à disposição, porque não conta com consultoria acompanhando o dia a dia da propriedade.

O resultado é que a informação existe, mas não chega em formato acionável.

## 3. Objetivo

Desenvolver um sistema web que relacione a previsão do tempo de um município com as exigências climáticas da cultura plantada, gerando alertas em linguagem direta sobre riscos como geada, calor excessivo, chuva acima do tolerado e déficit hídrico — acessível pelo site e por um agente de conversa no Telegram.

## 4. Público-alvo

Produtor rural de pequeno e médio porte que hoje consulta a previsão do tempo e interpreta por conta própria o que ela significa para sua lavoura.

## 5. Escopo

### 5.1 Incluído

**Cadastro (pelo site)**
- Cadastro, edição e exclusão de cultivos: cultura, município e data de plantio
- Busca de município por nome, com obtenção automática de coordenadas
- Cadastro de culturas e suas faixas ideais e críticas, com a fonte registrada
- Autenticação de usuários

**Consulta (pelo site e pelo Telegram)**
- Previsão de 7 dias por cultivo
- Alertas gerados pela comparação entre previsão e faixas da cultura
- Histórico de alertas com filtros
- Fase do El Niño / La Niña vigente no período do cultivo
- Agente de conversa no Telegram, que responde perguntas em linguagem natural

### 5.2 Excluído, com justificativa

| Fora do escopo | Por quê |
|---|---|
| Modelo preditivo próprio | Previsão meteorológica já é resolvida pelos modelos das agências internacionais |
| Treinamento de modelo de IA | O agente usa um modelo de linguagem pronto, apenas para redigir a resposta |
| Estatística sobre séries históricas | O problema identificado não é ausência de dado, é ausência de tradução |
| Gestão financeira, estoque e maquinário | Outro produto, com outro usuário e outro ciclo de uso |
| Aplicativo móvel nativo | O front responsivo atende o caso de uso e cabe no prazo |
| Cadastro pelo Telegram | O agente é canal de **consulta**; o CRUD permanece no site |

### 5.3 Divisão de canais

O site concentra todo o cadastro e edição. O Telegram é canal de consulta apenas: o produtor pergunta, o sistema responde. Isso mantém a validação de dados em um lugar só e reduz a superfície de erro.

## 6. Critérios de aceitação

O projeto é considerado pronto quando todos os cenários abaixo funcionarem de ponta a ponta:

**CA-1 — Cadastro de cultivo**
Dado um usuário autenticado, quando ele cadastra um cultivo informando cultura, município e data de plantio, então o sistema salva o cultivo e calcula automaticamente a data prevista de colheita somando o ciclo da cultura à data de plantio.

**CA-2 — Alerta de temperatura crítica**
Dado um cultivo de feijão em Uberlândia, quando a previsão de 7 dias indicar mínima abaixo de 12 °C, então o sistema gera um alerta do tipo `geada`, severidade `critico`, com a data e o valor previsto na mensagem.

**CA-3 — Alerta de chuva**
Dado um cultivo, quando a soma da chuva prevista para os 7 dias ultrapassar o limite semanal da cultura, então o sistema gera um alerta `chuva_excessiva`, severidade `atencao`.

**CA-4 — Condição favorável**
Dado um cultivo, quando nenhum limite da cultura for ultrapassado na semana, então o sistema gera um registro do tipo `favoravel`, severidade `info`.

**CA-5 — Sem duplicação**
Dado um cultivo já avaliado hoje, quando o usuário solicitar nova avaliação no mesmo dia, então o sistema não cria alertas duplicados para o mesmo tipo e a mesma data.

**CA-6 — Contexto climático**
Dado um cultivo, quando o usuário abrir seu detalhe, então o sistema exibe a fase do El Niño / La Niña vigente no mês do plantio.

**CA-7 — Agente no Telegram**
Dado um produtor com o Telegram vinculado à sua conta, quando ele enviar uma mensagem perguntando sobre sua lavoura, então o sistema responde em português com os cultivos e os alertas dele, e registra as duas mensagens no banco.

**CA-8 — Resiliência**
Dado que a API de clima esteja indisponível, quando o usuário acessar o sistema, então as telas continuam abrindo e o histórico de alertas continua visível; apenas a geração de novos alertas fica suspensa.

**CA-9 — Sistema publicado**
O sistema está acessível por uma URL pública, com banco em produção.

## 7. Premissas

O projeto assume que estas condições se mantêm. Se alguma mudar, o plano precisa ser revisto.

- A API do Open-Meteo continua gratuita para uso não comercial e sem exigência de chave.
- A Bot API do Telegram continua gratuita e sem limite relevante para o volume do projeto.
- A API do modelo de linguagem permanece disponível dentro do custo previsto.
- O MySQL utilizado é versão 8.0.16 ou superior, necessária para que as restrições CHECK sejam aplicadas.
- As faixas climáticas das culturas provêm de publicações públicas da Embrapa e do MAPA.
- As duas integrantes permanecem no grupo até o fim do semestre.

## 8. Restrições

- **Prazo:** entrega até o fim de outubro de 2026, distribuída em cinco checkpoints.
- **Equipe:** duas pessoas, ambas trabalhando durante o dia.
- **Avaliação por Live Coding:** qualquer integrante pode ser sorteada para modificar o código ao vivo, sem uso de IA. Isso restringe deliberadamente a complexidade da solução.
- **Stack definida:** Java 21 com Spring Boot, MySQL 8, React com Vite.
- **Infraestrutura gratuita:** hospedagem em camada gratuita, com as limitações de disponibilidade que isso implica.
- **Dados agronômicos:** nenhuma cultura entra no sistema sem fonte documentada.

## 9. Riscos e ordem de corte

Se o prazo apertar, a redução de escopo segue esta ordem, decidida antecipadamente:

1. **Agente no Telegram** — sai primeiro. O sistema continua completo pelo site.
2. **Contexto do El Niño / La Niña** — sai em segundo. É diferencial, não essencial.
3. **Histórico de alertas com filtros** — sai em terceiro.

**Intocáveis:** o CRUD de cultivos, a previsão de 7 dias e o motor de alertas. São o núcleo do produto e o que o sistema promete resolver.

Principais riscos identificados:

| Risco | Mitigação |
|---|---|
| Hospedagem gratuita hibernando na apresentação | Acessar a URL antes de apresentar, manter o ambiente local aberto e ter vídeo gravado |
| Indisponibilidade de API externa | Snapshot no banco e falha silenciosa, conforme CA-8 |
| Sorteio de Live Coding em código não dominado | Rodízio de tarefas e leitura cruzada semanal |
| Concentração de commits em uma integrante | Acompanhamento pelo board, com issues atribuídas |
| Faixas agronômicas sem fonte | Coluna `fonte` obrigatória; cultura sem referência não é cadastrada |

## 10. Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Backend | Java 21 + Spring Boot 3 |
| Persistência | Spring Data JPA |
| Banco de dados | MySQL 8 |
| Frontend | React 18 + Vite |
| Versionamento | Git + GitLab |

## 11. Fontes de dados externas

| Fonte | Uso | Licença |
|---|---|---|
| Open-Meteo | Coordenadas de municípios e previsão de 7 dias | CC BY 4.0 |
| Telegram Bot API | Canal de conversa do agente | Gratuita |
| API de modelo de linguagem | Redação das respostas do agente | Conforme provedor |
| NOAA / CPC | Classificação mensal das fases do ENSO | Domínio público |
| Embrapa / MAPA | Faixas climáticas de referência das culturas | Publicação pública |

## 12. Divisão de responsabilidades

| Integrante | Frente principal |
|---|---|
| Jessica Rodrigues | Backend, infraestrutura e documentação |
| Larissa Miuki | Banco de dados e frontend |

A partir do CP-3 há rodízio deliberado entre as frentes, de modo que ambas trabalhem em todas as camadas do sistema — exigência prática da avaliação por Live Coding.

## 13. Entregas por checkpoint

| Checkpoint | Entrega |
|---|---|
| CP-1 | Modelo ER, scripts SQL, banco populado e documentação inicial |
| CP-2 | API REST com CRUD conectado ao banco |
| CP-3 | Frontend integrado à API e sistema hospedado |
| CP-4 | MVP completo com previsão, alertas e agente no Telegram |
| CP-5 | Sistema em produção e documentação final |
