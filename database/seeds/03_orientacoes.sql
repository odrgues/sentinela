-- Sentinela — "O que fazer" de cada aviso e as fases do ciclo (rodar depois do 02_dados_iniciais.sql)
-- Cada texto saiu de uma publicação oficial (Embrapa, MAPA, EPAMIG), citada na coluna fonte com a página.
-- Só manejo geral: nada de nome de produto, dose ou defensivo.
-- Como o backend escolhe: primeiro a recomendação da cultura; sem ela, a genérica (cultura_id nulo).
USE sentinela;
SET NAMES utf8mb4;

-- ============ Banana e goiaba (perenes) ============
SET @banana = (SELECT id FROM cultura WHERE nome = 'Banana');
SET @goiaba = (SELECT id FROM cultura WHERE nome = 'Goiaba');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
    (@banana, 'geada',
     'Ensaque os cachos para proteger as frutas do frio. Onde bate vento frio, mantenha quebra-vento, como renque de bambu.',
     'Embrapa Mandioca e Fruticultura (500 Perguntas Banana, 2012, p. 26-28 e 98)'),
    (@banana, 'calor',
     'Por que importa: a bananeira vai melhor perto de 28 °C. Acima de 35 °C o crescimento é freado, porque as folhas perdem água. Em dia de sol e ar seco, a planta de 7 a 12 meses gasta de 4 a 6 mm de água por dia, o dobro de um dia nublado. O que fazer: irrigue para manter a terra úmida, sem encharcar. Espalhe folhas e pedaços do tronco da própria bananeira nas entrelinhas: o solo coberto perde menos água e fica mais fresco.',
     'Embrapa Mandioca e Fruticultura (Banana: o produtor pergunta, a Embrapa responde, 2012, p. 22-24, 59-60 e 83)'),
    (@banana, 'chuva_excessiva',
     'Por que importa: a raiz da bananeira precisa de ar. Sem oxigênio ela apodrece rápido, e mais de 3 dias de solo encharcado causam dano que não se recupera. A água parada também deixa o bananal úmido, o que favorece o mal-de-sigatoka. O que fazer agora: drene o excesso de água da superfície em, no máximo, 2 horas. Folhas amarelas e caule mais fino mostram falta de ar na raiz. Para as próximas safras: evite plantar onde encharca ou faça um bom sistema de drenagem.',
     'Embrapa Mandioca e Fruticultura (Banana: o produtor pergunta, a Embrapa responde, 2ª ed., 2012, p. 55, 84 e 140)'),
    (@banana, 'deficit_hidrico',
     'Por que importa: a falta de água faz mal em todas as fases, mas pesa mais na formação da flor, no início do cacho e a partir do 7º mês. Com seca forte, as folhas amarelam e ressecam, o caule afina, os dedos ficam finos e a planta pode ter dificuldade para lançar o cacho. O que fazer: irrigue, dando prioridade ao bananal que já está florindo ou enchendo cacho. Cubra o solo com folhas e troncos da própria bananeira: a cobertura guarda cerca de 90% mais água que a terra descoberta.',
     'Embrapa Mandioca e Fruticultura (Banana: o produtor pergunta, a Embrapa responde, 2012, p. 22-24, 59-60 e 83)'),
    (@banana, 'favoravel',
     'Por que aproveitar: o adubo de cobertura deve ser aplicado quando o solo está com umidade adequada. O que fazer: faça a adubação de cobertura em meia-lua na frente do filho ou do neto. A quantidade de adubo vem da análise do solo. Capine as ruas: o mato compete com a bananeira por água, luz e nutrientes. Se for a época da desfolha, tire as folhas secas e mortas antes do desbaste e adube depois.',
     'Embrapa Mandioca e Fruticultura (Banana: o produtor pergunta, a Embrapa responde, 2012, p. 73, 92-93 e 96-97)'),
    (@goiaba, 'geada',
     'Geada queima folhas, ramos e brotos novos, e a planta nova é a que mais sofre. Deixe a poda de frutificação para depois do frio e mantenha quebra-vento contra o vento frio do sul.',
     'Embrapa (Coleção Plantar 27, 1995, p. 16 e 18; Coleção Plantar 66, 2010, p. 19-20, 48 e 103); Embrapa Semi-Árido (Frutas do Brasil 17, 2001, p. 25)'),
    (@goiaba, 'calor',
     'Por que importa: a goiabeira aguenta bem calor e seca (tolera até 46 °C), mas temperaturas extremas e falta de água podem derrubar muitas flores e frutinhos. A seca por muito tempo também atrasa a florada. O que fazer: se tem irrigação, não deixe faltar água. Mantenha adubo orgânico sob a copa: ele protege o solo do sol direto e da perda de água, principalmente em solo arenoso.',
     'Embrapa (Coleção Plantar 66, Goiaba, 2010, p. 19-22); Embrapa (Coleção Plantar 27, A cultura da goiaba, 1995, p. 54)'),
    (@goiaba, 'chuva_excessiva',
     'Não pode nem colha com a planta molhada de chuva ou orvalho. Dê saída à água parada, porque a goiabeira não vai bem em terra encharcada.',
     'Embrapa (Coleção Plantar 27, 1995, p. 18 e 62; Coleção Plantar 66, 2010, p. 104)'),
    (@goiaba, 'deficit_hidrico',
     'Por que importa: a goiabeira resiste à seca, mas falta de água por muito tempo atrasa a florada e aumenta a queda de frutos. Onde chove pouco e o sol é forte, é preciso irrigação complementar. O que fazer: irrigue, de preferência por gotejo ou microaspersão, que põem a água onde estão as raízes. Cubra o solo sob a copa com adubo orgânico para perder menos água. Sem irrigação, deixe a poda de frutificação para quando houver chuva segura depois dela.',
     'Embrapa (Coleção Plantar 66, Goiaba, 2010, p. 20-21 e 79); Embrapa (Coleção Plantar 27, A cultura da goiaba, 1995, p. 32 e 54)'),
    (@goiaba, 'favoravel',
     'Por que aproveitar: a goiabeira só floresce nas brotações de ramos maduros, e com clima adequado a poda pode ser feita em qualquer época do ano. O que fazer: faça a poda de frutificação em ramos maduros, com gemas prontas para brotar, se houver irrigação ou chuva garantida depois. Aproveite para tirar galhos secos, rasteiros ou atacados por pragas e para pôr adubo orgânico sob a copa. Em pomar novo, faça o coroamento com enxada.',
     'Embrapa (Coleção Plantar 66, Goiaba, 2010, p. 48 e 68); Embrapa (Coleção Plantar 27, A cultura da goiaba, 1995, p. 30, 32, 36 e 54)');

-- ============ Morango e chuchu (colheita contínua) ============
INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte)
SELECT c.id, f.nome, f.dia_inicio, f.dia_fim, f.orientacao, f.fonte
FROM cultura c
CROSS JOIN (
    SELECT 'Pegamento da muda' AS nome, 0 AS dia_inicio, 14 AS dia_fim,
           'Nas duas primeiras semanas a raiz ainda não puxa água: mantenha o solo sempre úmido, sem encharcar. Calor forte nessa fase mata muda recém-plantada.' AS orientacao,
           'IA EPAMIG 236 (2007) p.51; SP Morango Embrapa (2016) p.7-8' AS fonte
    UNION ALL
    SELECT 'Estabelecimento', 15, 34,
           'Planta formando folhas e raízes: regue com regularidade, sem excesso, que traz doença de raiz. Com a muda firme, entre 30 e 40 dias, cubra o canteiro.',
           'SP Morango Embrapa (2016) p.10 e p.33'
    UNION ALL
    SELECT 'Floração e frutos verdes', 35, 69,
           'Fase crítica de água: faltar água agora reduz número e tamanho dos frutos. Geada queima a flor aberta e calor acima de 30 °C falha a polinização, dando fruto deformado.',
           'IA EPAMIG 236 (2007) p.51; SP Morango (2016) p.33; Com. Téc. 229 (2009) p.2; Morangueiro Embrapa (2016) p.44-45'
    UNION ALL
    SELECT 'Colheita', 70, 220,
           'Colha a cada 1 a 3 dias, nas horas frescas, e não colha com chuva ou orvalho. Água regular sem encharcar e túnel fechado na chuva evitam podridão.',
           'SP Morango Embrapa (2016) p.11, p.29 e p.35'
) f
WHERE c.nome = 'Morango';

INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte)
SELECT c.id, f.nome, f.dia_inicio, f.dia_fim, f.orientacao, f.fonte
FROM cultura c
CROSS JOIN (
    SELECT 'Pegamento e crescimento inicial' AS nome, 0 AS dia_inicio, 59 AS dia_fim,
           'Planta pequena gasta pouca água, perto de 1 mm por dia: regue sem encharcar, que o excesso prejudica a raiz. A latada deve estar pronta até os 60 dias.' AS orientacao,
           'Circ. Téc. 139 Embrapa Hortaliças (2015) p.2 e p.8; Instr. Téc. 5 CNPH (1983) p.5' AS fonte
    UNION ALL
    SELECT 'Crescimento das ramas', 60, 104,
           'As ramas cobrem a latada e o consumo de água sobe rápido, chegando a 4 a 10 mm por dia. Proteja de vento forte, que quebra ramas e brotos novos.',
           'Circ. Téc. 139 (2015) p.3 e p.8; Instr. Téc. 5 (1983) p.2'
    UNION ALL
    SELECT 'Colheita', 105, 365,
           'Fase mais sensível à falta de água, desde o início da florada; colha a cada 1 a 3 dias, mesmo com preço baixo. Calor acima de 28 °C e chuva forte e prolongada derrubam flores e frutinhos.',
           'Circ. Téc. 139 (2015) p.2 e p.8; Plantar 14 (1994) p.13-14 e p.45-46; Catálogo Bras. Hortaliças (2010) p.27'
) f
WHERE c.nome = 'Chuchu';

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte)
SELECT c.id, r.tipo_alerta, r.texto, r.fonte
FROM cultura c
CROSS JOIN (
    SELECT 'geada' AS tipo_alerta,
           'Feche o túnel na tarde da véspera, com antecedência para guardar calor. Onde houver aspersão, ela ajuda a proteger flores e frutos pequenos da geada.' AS texto,
           'Morangueiro Embrapa (2016) p.216; SP Morango Embrapa (2016) p.29 e p.32' AS fonte
    UNION ALL
    SELECT 'frio',
           'Semana fria deixa o crescimento e o amadurecimento mais lentos. Mantenha o plástico no canteiro e feche o túnel no fim da tarde para segurar o calor.',
           'Morangueiro Embrapa (2016) p.59-60; SP Morango Embrapa (2016) p.11'
    UNION ALL
    SELECT 'calor',
           'Por que importa: calor acelera a maturação e o fruto fica menor, menos firme e sem sabor. Com o túnel fechado, o ar satura, a planta para de transpirar e a folha esquenta. O que fazer: em dia de sol, abra o túnel cedo, logo que o orvalho secar, dos dois lados. Se ventar, abra só o lado contrário ao vento. Não deixe faltar água, mas sem encharcar. Colha nas horas mais frescas e não deixe fruto ao sol.',
           'Embrapa Clima Temperado: O Morangueiro (2016) p. 59-60, 215-216 e 275; Sistema de Produção do Morango (versão eletrônica jul/2016), seções Práticas culturais p. 11/54 e Colheita e pós-colheita p. 35/54'
    UNION ALL
    SELECT 'chuva_excessiva',
           'Por que importa: o morangueiro precisa de solo úmido, mas sem passar do ponto; acima disso surgem doenças de difícil controle. Chuva frequente favorece o mofo cinzento, que apodrece os frutos. O que fazer agora: com chuva ou neblina, mantenha o túnel fechado e só abra com sol. Não irrigue com o solo encharcado. Evite colher em dia de chuva. Retire os frutos atacados por doença. Para as próximas safras: cubra os caminhos com palha, para não virar barro na época da colheita.',
           'Embrapa Clima Temperado (Sistema de Produção do Morango, versão eletrônica, jul/2016, p. 11-12, 18, 32 e 35 do PDF)'
    UNION ALL
    SELECT 'deficit_hidrico',
           'Por que importa: a raiz do morangueiro é rasa e a planta é extremamente sensível à falta de água. A fase mais crítica vai do início do fruto até o amadurecimento: com estresse hídrico a produção cai e os frutos amadurecem mais cedo. O que fazer: reforce a irrigação por gotejamento, até todo dia se a evaporação for forte ou o solo arenoso. Mantenha o solo úmido, perto da capacidade de campo, sem encharcar: o excesso favorece doenças de solo.',
           'Embrapa Clima Temperado, Sistema de Produção do Morango (versão eletrônica jul/2016), seção Irrigação e fertirrigação p. 31-33/54; IA EPAMIG 236 (2007) p. 51-52; O Morangueiro (Embrapa, 2016) p. 296'
    UNION ALL
    SELECT 'favoravel',
           'Por que aproveitar: o morango não amadurece depois de colhido, e folhas, flores e frutos doentes mantêm a doença na lavoura. O que fazer: colha todo dia ou, no máximo, a cada 3 dias, nas horas frescas, frutos com 50 a 75% da superfície vermelho-brilhante. Inspecione o canteiro e retire folhas, pedúnculos secos, flores sem polinizar e frutos doentes, toda semana. Abra o túnel de manhã, depois do orvalho.',
           'Embrapa Clima Temperado, Sistema de Produção do Morango (versão eletrônica jul/2016): seção Práticas culturais p. 11-12/54; seção Colheita e pós-colheita p. 35/54'
) r
WHERE c.nome = 'Morango';

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte)
SELECT c.id, r.tipo_alerta, r.texto, r.fonte
FROM cultura c
CROSS JOIN (
    SELECT 'geada' AS tipo_alerta,
           'Geada pode matar o chuchuzal inteiro. Com aspersão sobre a latada, ligue no começo da noite, com o ar ainda entre 4 °C e 0,5 °C, e só desligue quando o sol derreter o gelo.' AS texto,
           'Circ. Téc. 139 Embrapa Hortaliças (2015) p.2; Circ. Téc. 158 Embrapa Hortaliças (2017) p.21' AS fonte
    UNION ALL
    SELECT 'frio',
           'No frio o chuchuzeiro só vegeta e a produção cai; a planta gasta menos água, então reduza a irrigação. Retire ramas e folhas secas para arejar a latada.',
           'Circ. Téc. 139 (2015) p.2 e p.9; Plantar 14 (1994) p.26'
    UNION ALL
    SELECT 'calor',
           'Por que importa: acima de 28 °C o pólen perde a viabilidade, caem flores e frutinhos e as ramas crescem demais. A raiz é rasa (20 cm) e a planta transpira muito, por isso sofre com a falta de água. O que fazer: mantenha o solo úmido, sem encharcar, pois irrigar demais também pode favorecer rama em vez de fruto. Cubra o solo com palha para perder menos água. Na aspersão, evite regar de manhã, para não atrapalhar os insetos que polinizam.',
           'Embrapa Hortaliças (Circular Técnica 139, Irrigação na cultura do chuchu, 2015, p. 1, 2, 5 e 9); Embrapa CNPH (Coleção Plantar 14, 1994, p. 13)'
    UNION ALL
    SELECT 'chuva_excessiva',
           'Suspenda a irrigação e garanta a drenagem: o chuchuzeiro não tolera solo encharcado. Na chuva, a palha no solo pode piorar o excesso de água.',
           'Circ. Téc. 139 (2015) p.9; Instr. Téc. 5 CNPH (1983) p.2 e p.5'
    UNION ALL
    SELECT 'deficit_hidrico',
           'Por que importa: o chuchu sofre com a falta de água o ciclo todo, mais ainda quando começa a florescer e a produzir: ficam menos ramas, menos frutos e frutos menores. A raiz é rasa (20 cm). O que fazer: na seca, irrigue a cada 1 a 2 dias; em solo que segura pouca água, até duas vezes por dia. Com rega localizada (gotejamento) as raízes ficam só na área molhada e pedem regas ainda mais frequentes. Palha no solo segura a umidade.',
           'Embrapa Hortaliças (Circular Técnica 139, 2015, p. 1, 8, 9 e 16); Embrapa CNPH (Instrução Técnica 5, 1983, p. 5)'
    UNION ALL
    SELECT 'favoravel',
           'Por que aproveitar: o chuchu está no ponto 14 dias depois da flor e, aos 21 dias, já vira semente, de polpa fibrosa. Fruto esquecido na rama atrapalha o crescimento dela e os frutinhos dos nós seguintes. O que fazer: colha a cada 1 a 3 dias, mesmo com preço baixo. Retire ramas e folhas secas e amarre as brotações novas perto do solo: diminui pragas e doenças e deixa entrar ar e luz na latada. Mantenha o solo úmido, sem encharcar.',
           'Embrapa CNPH (Coleção Plantar 14, 1994, p. 26, 27 e 45-46); Embrapa Hortaliças (Circular Técnica 139, 2015, p. 2)'
) r
WHERE c.nome = 'Chuchu';

-- ============ Grãos: textos genéricos (valem para toda cultura sem texto próprio), feijão, milho e soja ============
-- A) Recomendações genéricas (cultura_id NULL)
INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
(NULL, 'geada', 'O estrago depende da fase da lavoura, de quanto a temperatura cai e de quantas horas o frio dura. Baixadas e beira de córrego sofrem mais, porque o ar frio se acumula ali. Nas próximas safras, semeie na época indicada pelo zoneamento (ZARC), para as fases sensíveis não pegarem o período de geada.', 'Embrapa Milho e Sorgo (Milho: 500 Perguntas 500 Respostas, 2011, p. 314-315)'),
(NULL, 'frio', 'Frio logo depois da semeadura atrasa a germinação e a emergência e deixa o ciclo mais longo. Se ainda vai semear, espere o solo esquentar. Em plantio cedo, com solo frio, semeie mais raso, onde a terra é mais quente.', 'Embrapa Arroz e Feijão (500 Perguntas Feijão, 2014, p. 26-27); Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 7); Embrapa Soja (500 Perguntas Soja, 2019, p. 45)'),
(NULL, 'calor', 'Por que importa: calor forte na floração derruba flores e vagens na soja e no feijão, e no milho reduz muito a produção. O estrago é maior quando também falta água. O que fazer: se puder irrigar, não deixe faltar água nessa fase. Próximas safras: use cultivar tolerante ao calor (indicado para o feijão) e semeie na época do Zoneamento Agrícola de Risco Climático, para a fase crítica não coincidir com o clima adverso.', 'Embrapa Soja (Tecnologias de Produção de Soja, SP 17, 2020, p. 40-42 e 51; 500 Perguntas Soja, 2019, p. 43); Embrapa Arroz e Feijão (500 Perguntas Feijão, 2014, p. 26-27); Embrapa Milho e Sorgo (Circ. Técnica 22, 2002, p. 11)'),
(NULL, 'chuva_excessiva', 'Confira terraços e plantio em nível para a enxurrada não levar o solo. Palhada no chão e pouco revolvimento ajudam a água a infiltrar. Não entre com máquina no solo encharcado, porque isso estraga o solo. Chuva sobre lavoura pronta para colher reduz a qualidade e o peso do grão.', 'Embrapa Soja (500 Perguntas Soja, 2019, p. 45, 47 e 75)'),
(NULL, 'deficit_hidrico', 'Por que importa: soja, feijão e milho sofrem mais com a falta de água na floração e no enchimento de grãos, quando a planta define o número e o peso dos grãos. O que fazer: se tem irrigação, priorize essas fases. Palha sobre o solo segura a umidade e reduz o número de irrigações. Se ainda não semeou, espere uma chuva que molhe bem o solo.', 'Embrapa Soja (Tecnologias de Produção de Soja, SP 17, 2020, p. 39 e 44-47); Embrapa Arroz e Feijão (500 Perguntas Feijão, 2014, p. 28 e 106); Embrapa Milho e Sorgo (500 Perguntas Milho, 2011, p. 70)'),
(NULL, 'favoravel', 'Por que aproveitar: a planta responde melhor ao controle de plantas daninhas, pragas e doenças feito na fase certa. O que fazer: olhe pelo menos 10 plantas ao acaso em vários pontos da lavoura e anote a fase delas. Na soja, as plantas daninhas atrapalham mais entre V1 e V6; no feijão, entre V4 e a floração. Acompanhe também as pragas: o monitoramento é contínuo.', 'Embrapa Soja (500 Perguntas Soja, 2019, p. 29-30, 141 e 159); Embrapa Arroz e Feijão (Conhecendo a fenologia do feijoeiro, 2018, p. 11; 500 Perguntas Feijão, 2014, p. 166 e 192)');

-- A) Recomendações específicas
INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'geada', 'Por que importa: o estrago da geada depende da fase da lavoura, de quanto a temperatura cai e de quantas horas o frio dura. Baixadas e beira de córrego sofrem mais, porque o ar frio se acumula ali. Frio logo depois da semeadura também atrasa a germinação e alonga o ciclo do feijão. O que fazer: olhe primeiro as áreas baixas e, antes de decidir qualquer coisa sobre a lavoura, peça ao técnico da assistência técnica da sua região para avaliar os danos. Próximas safras: semeie na época indicada para a região, para as fases sensíveis não pegarem o período de geada.', 'Embrapa (Milho: 500 Perguntas 500 Respostas, 2011, p. 314-315, sobre geada no milho); Embrapa Arroz e Feijão (Feijão: o produtor pergunta, a Embrapa responde, 2014, p. 27)'),
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'calor', 'Por que importa: do pouco antes da floração até o começo das vagens, calor forte, principalmente à noite, faz o feijão abortar flores e vagens e pode até atrapalhar a fecundação. Perto de 35 °C já há perda, e mais ainda se a água for pouca. O que fazer: mantenha água e nutrientes em dia, para a planta aguentar o crescimento acelerado. Próximas safras: use cultivar tolerante, reduza o nitrogênio e o número de plantas por área, para elas se sombrearem menos.', 'Embrapa Arroz e Feijão (500 Perguntas Feijão, 2014, p. 26-27)'),
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'deficit_hidrico', 'Por que importa: o feijão sofre pouco com falta de água quando está novo, mas é muito sensível na fase reprodutiva. Na pré-floração e floração, a seca derruba flores e reduz as vagens. Na formação e enchimento das vagens, derruba as vagens novas e deixa o grão leve. O que fazer: se irriga, é nessas fases que a água mais faz falta. Próximas safras: escolha época de semeadura de menor risco de seca na fase reprodutiva e use palha no solo, que reduz o número de irrigações.', 'Embrapa Arroz e Feijão (Conhecendo a fenologia do feijoeiro, 2018, p. 45-46; 500 Perguntas Feijão, 2014, p. 28-29 e 106)'),
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'chuva_excessiva', 'Por que importa: água demais no solo na floração favorece o mofo-branco, doença que piora quando as irrigações são muito frequentes. Na colheita, a chuva aumenta as perdas por doenças, acamamento e germinação do grão ainda na vagem. O que fazer: se irriga, aumente o intervalo entre as irrigações e revise o pivô para molhar por igual. Se a colheita pegar a época de chuva, faça a secagem do grão, até 13% ou menos de umidade, para preservar a qualidade. Próximas safras: semear fora da época indicada pode levar a colheita para o período chuvoso.', 'Embrapa Arroz e Feijão (Feijão: o produtor pergunta, a Embrapa responde, 2014, p. 139, 211-212 e 226)'),
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'frio', 'Por que importa: o feijão rende mais com cerca de 29 °C de dia e 21 °C de noite. Frio logo depois da semeadura pode impedir, reduzir ou atrasar a germinação das sementes e a emergência das plantas. Depois disso, o ciclo se alonga, a planta cresce menos e forma menos vagens, e a produtividade cai. O que fazer: confira a lavoura recém-semeada nos próximos dias e, se a emergência estiver falhando, converse com o técnico da assistência técnica da sua região antes de decidir sobre replantio.', 'Embrapa Arroz e Feijão (Feijão: o produtor pergunta, a Embrapa responde, 2014, p. 26-27)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'deficit_hidrico', 'Por que importa: na floração, sem água o cabelo da espiga e o pólen secam e a polinização falha. Dois dias de falta de água nessa fase cortam mais de 20% da produção, e 4 a 8 dias, mais de 50%. Antes, em V12, a falta de água já reduz o número de grãos e o tamanho da espiga. O que fazer: se tem irrigação, priorize as quatro semanas em torno do florescimento, duas antes e duas depois. Próximas safras: palha sobre o solo reduz a evaporação.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 2 e 9-10; 500 Perguntas Milho, 2011, p. 32-33 e 70)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'calor', 'Por que importa: do pendoamento ao embonecamento, o milho está mais exposto que em qualquer outra fase. Calor acima de 35 °C junto com falta de água pode reduzir muito a produção, e acima de 30 °C o pólen perde a viabilidade. O que fazer: se puder irrigar, não deixe faltar água nessa fase: o pólen dura menos com calor e ar seco. Próximas safras: palha cobrindo o solo diminui a variação de temperatura do solo e a evaporação da água.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 10-11; 500 Perguntas Milho, 2011, p. 34 e 70)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'chuva_excessiva', 'Por que importa: antes de a planta ter seis folhas, o ponto de crescimento do milho fica abaixo do solo, e o encharcamento pode matar a planta em poucos dias. Mesmo na fase mais tolerante (oito folhas), mais de cinco dias encharcado dá prejuízo sério e sem volta. No pendoamento, a planta é muito sensível, e o excesso de água pode contribuir para o pólen não ficar viável. O que fazer: se a lavoura está perto da colheita, aperte o colmo com os dedos; se 15% a 20% estiver podre, colha o quanto antes, porque chuva forte derruba a planta.', 'Embrapa Milho e Sorgo (Fisiologia do Milho, Circular Técnica 22, 2002, p. 8 e 11); Embrapa (Milho: 500 Perguntas 500 Respostas, 2011, p. 154)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'geada', 'No milho, geada até 5 folhas ou a partir do grão com dente (R5) quase não causa perda. O prejuízo é grande se a geada pegar a lavoura em pleno crescimento, perto do pendoamento ou no começo do enchimento de grãos. Baixadas e beira de córrego sofrem mais.', 'Embrapa Milho e Sorgo (500 Perguntas Milho, 2011, p. 315-316)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'frio', 'Frio no plantio deixa o milho lento para nascer e crescer, e o ciclo fica mais longo. Em plantio cedo, com solo frio, semeie mais raso, onde a terra é mais quente.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 6-7; 500 Perguntas Milho, 2011, p. 100)'),
((SELECT id FROM cultura WHERE nome = 'Soja'), 'chuva_excessiva', 'Por que importa: chuva na colheita molha o grão, que perde peso e qualidade, porque a umidade facilita o ataque de microrganismos que escurecem o grão. O risco é maior em lavoura dessecada, pois a vagem protege menos o grão. O que fazer: colha quando 95% das vagens estiverem maduras (fase R8), com o grão entre 15% e 18% de umidade, e não adie a colheita: chuva sobre a lavoura madura estraga o grão. Máquina em solo muito molhado estraga a estrutura do solo. Próximas safras: semear fora da época indicada deixa a lavoura mais exposta ao excesso de chuva na colheita.', 'Embrapa Soja (Soja: 500 Perguntas 500 Respostas, 2019, p. 44, 47 e 210-211)'),
((SELECT id FROM cultura WHERE nome = 'Soja'), 'calor', 'Por que importa: calor muito forte (acima de 38 a 40 °C) faz a soja abortar flores e vagens, e o estrago é maior se também faltar água. Na fase reprodutiva, o calor apressa a maturação. O que fazer: se puder irrigar, não deixe faltar água da floração ao enchimento de grãos, os períodos críticos. Próximas safras: semeie dentro do período do Zoneamento Agrícola de Risco Climático, para que os períodos críticos não peguem clima adverso.', 'Embrapa Soja (500 Perguntas Soja, 2019, p. 37, 43 e 46; Tecnologias de Produção de Soja, Sistemas de Produção 17, 2020, p. 40, 42 e 51)'),
((SELECT id FROM cultura WHERE nome = 'Soja'), 'deficit_hidrico', 'Por que importa: a soja aguenta melhor a falta de água enquanto cresce, mas é muito sensível na floração e no enchimento de grãos: caem flores, abortam vagens e o grão chocha. A seca no enchimento faz mais estrago que na floração: apressa a maturação e deixa o grão menor. O que fazer: se irriga, priorize essas fases. Depois de seca longa, só semeie quando a chuva molhar bem o solo. Próximas safras: plantio direto, rotação e palha guardam mais água.', 'Embrapa Soja (Tecnologias de Produção de Soja, Sistemas de Produção 17, 2020, p. 39, 44 e 46-48; 500 Perguntas Soja, 2019, p. 43)'),
((SELECT id FROM cultura WHERE nome = 'Soja'), 'frio', 'Frio deixa a soja lenta para emergir, atrasa o florescimento e alonga o ciclo. Na maturação, frio com umidade causa retenção foliar e atrasa a colheita. Semeie com o solo entre 20 °C e 30 °C.', 'Embrapa Soja (500 Perguntas Soja, 2019, p. 45-46; Tecnologias de Produção de Soja, Sistemas de Produção 17, 2020, p. 40-41)');

-- B) Fases do ciclo
INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'Germinação e emergência (V0-V2)', 0, 16, 'Falta de água faz a semente apodrecer ou a plantinha não romper o solo, e frio atrasa a emergência. Semeie com o solo úmido e dentro da época do zoneamento (ZARC).', 'Embrapa Arroz e Feijão (Conhecendo a fenologia do feijoeiro, 2018, p. 45, 46 e 48; dias = lâmina total ÷ lâmina diária por estádio); 500 Perguntas Feijão, 2014, p. 26-27'),
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'Vegetativo (V3-V4)', 17, 41, 'É a fase que melhor tolera a falta de água, mas a seca reduz folhas e raízes. Palhada sobre o solo ajuda a guardar umidade.', 'Embrapa Arroz e Feijão (Conhecendo a fenologia do feijoeiro, 2018, p. 45 e 48; 500 Perguntas Feijão, 2014, p. 28 e 106)'),
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'Pré-floração e floração (R5-R6)', 42, 54, 'Fase mais sensível: falta de água e calor, principalmente à noite, derrubam flores. Não deixe faltar água, mas não encharque o solo, que favorece o mofo-branco.', 'Embrapa Arroz e Feijão (Conhecendo a fenologia do feijoeiro, 2018, p. 45 e 48; 500 Perguntas Feijão, 2014, p. 27 e 139)'),
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'Formação e enchimento das vagens (R7-R8)', 55, 85, 'Falta de água derruba vagens novas e deixa o grão leve, e encharcamento também prejudica. Se irriga, continue irrigando nesta fase, sem encharcar.', 'Embrapa Arroz e Feijão (Conhecendo a fenologia do feijoeiro, 2018, p. 45 e 48; Fundamentos para uma agricultura sustentável com ênfase no feijoeiro, 2009, cap. 3, p. 58)'),
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'Maturação (R9)', 86, 90, 'Agora a falta de chuva é desejável para o grão secar; chuva na colheita aumenta perdas e faz o grão brotar na vagem. Se colher úmido, seque o feijão antes de guardar.', 'Embrapa Arroz e Feijão (Fundamentos para uma agricultura sustentável com ênfase no feijoeiro, 2009, cap. 3, p. 55-56; 500 Perguntas Feijão, 2014, p. 211-212 e 226; Conhecendo a fenologia do feijoeiro, 2018, p. 45)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'Emergência e estabelecimento (VE-V3)', 0, 14, 'Frio e pouca umidade atrasam a emergência, e solo encharcado pode matar a planta em poucos dias. Em plantio cedo, com solo frio, semeie mais raso.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 6-8: emerge em 4 a 5 dias; V3 cerca de duas semanas após o plantio)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'Vegetativo (V4 a V17)', 15, 55, 'Por volta de 5 folhas a planta define quantos grãos pode ter, e falta de água deixa plantas menores e colmos finos. Encharcamento por mais de cinco dias causa prejuízo.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 8-10; 500 Perguntas Milho, 2011, p. 29)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'Pendoamento e espigamento (VT-R1)', 56, 84, 'Fase mais crítica: dois dias de seca no florescimento cortam mais de 20% da produção, e calor acima de 35 °C piora o dano. Se irriga, priorize estas quatro semanas e não encharque o solo.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 2, 6 e 10-11: floração aos 65 dias após a emergência; quatro semanas em torno do florescimento)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'Enchimento de grãos (R2-R4)', 85, 105, 'Falta de água agora gera grãos leves e pequenos, e geada nesta fase também causa perda grande. Se puder irrigar, mantenha a água.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 12-13: R5 cerca de 36 dias após a polinização; 500 Perguntas Milho, 2011, p. 315-316)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'Maturação (R5-R6)', 106, 120, 'A partir do grão com dente (R5), a geada quase não causa perda. Colha com 18% a 25% de umidade só se houver secagem; para guardar, o grão precisa estar com 13% a 15%.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 13-14: R6 de 50 a 60 dias após a polinização; 500 Perguntas Milho, 2011, p. 315)'),
((SELECT id FROM cultura WHERE nome = 'Soja'), 'Emergência', 0, 9, 'Tanto falta quanto excesso de água prejudicam o estande, e solo abaixo de 20 °C atrasa a emergência. Depois de seca longa, só semeie quando a chuva molhar bem o solo.', 'Embrapa Pesca e Aquicultura (Boletim de Pesquisa 18, ZARC soja, 2017, p. 18, média dos Grupos I e II); Embrapa Soja (Sistemas de Produção 17, 2020, p. 39 e 42; 500 Perguntas Soja, 2019, p. 45)'),
((SELECT id FROM cultura WHERE nome = 'Soja'), 'Desenvolvimento vegetativo', 10, 47, 'A soja tolera melhor a falta de água nesta fase, mas calor forte adianta a floração e deixa a planta baixa. Plantio direto e rotação guardam mais água no solo para as fases críticas.', 'Embrapa Pesca e Aquicultura (Boletim de Pesquisa 18, ZARC soja, 2017, p. 18, média dos Grupos I e II); Embrapa Soja (Sistemas de Produção 17, 2020, p. 40, 44 e 47)'),
((SELECT id FROM cultura WHERE nome = 'Soja'), 'Florescimento e enchimento de grãos', 48, 89, 'Fase mais crítica: seca e calor acima de 38 °C derrubam flores e vagens, e falta de água no enchimento é a mais prejudicial. Se irriga, priorize esta fase.', 'Embrapa Pesca e Aquicultura (Boletim de Pesquisa 18, ZARC soja, 2017, p. 18, média dos Grupos I e II); Embrapa Soja (Sistemas de Produção 17, 2020, p. 44-47; 500 Perguntas Soja, 2019, p. 46)'),
((SELECT id FROM cultura WHERE nome = 'Soja'), 'Maturação', 90, 120, 'Chuva prolongada agora atrasa a secagem e estraga a qualidade e o peso do grão, e frio com umidade atrasa a colheita. Não entre com máquina em solo encharcado.', 'Embrapa Pesca e Aquicultura (Boletim de Pesquisa 18, ZARC soja, 2017, p. 18, média dos Grupos I e II); Embrapa Soja (Sistemas de Produção 17, 2020, p. 40-42; 500 Perguntas Soja, 2019, p. 47)');

-- ============ Hortaliças: tomate, pepino, alface, couve, brócolis e repolho ============
INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'Pegamento da muda', 0, 14,
 'Transplante nas horas frescas e com o solo úmido. Mantenha a terra úmida até a muda pegar, sem encharcar.',
 'Embrapa Plantar 5 (1993) p.29 e p.31; ZARC tomate (Port. 378/2026) p.2'),
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'Crescimento vegetativo', 15, 29,
 'Regas um pouco mais espaçadas fazem a raiz crescer mais. O mato atrapalha muito até uns 35 dias: capine, tutore e amarre as plantas.',
 'Embrapa Plantar 5 (1993) p.30, p.32-33 e p.35'),
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'Floração e frutificação', 30, 64,
 'Fase mais sensível: falta de água e calor acima de 32 °C derrubam flores e dão fruto oco. Faça regas leves e frequentes, sem encharcar.',
 'Embrapa Plantar 5 (1993) p.11 e p.30-31; IAC Bol. Téc. 215 (2015) p.5; Marouelli et al. (2017) Tab.39 p.105'),
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'Colheita', 65, 160,
 'Colha quando a ponta do fruto mudar de cor, nas horas frescas, e guarde os frutos colhidos na sombra. Água regular: seca e encharcamento alternados racham o fruto e dão fundo-preto.',
 'IAC Bol. Téc. 215 (2015) p.2; Embrapa Plantar 5 (1993) p.60-61; portal Embrapa Tomate de mesa (Colheita; Doenças fisiológicas)');

INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'Germinação e estabelecimento', 0, 14,
 'Planta nova é a que mais sofre com frio: em época fria, semeie em estufa ou espere esquentar. Mantenha o solo úmido, sem encharcar.',
 'Embrapa Circ. Téc. 113 (2013) p.3 e p.6; Marouelli et al. (2017) Tab.24 p.83'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'Crescimento das ramas', 15, 34,
 'Até uns 35 dias o frio ainda atrasa muito a planta. Tutore cedo e mantenha a terra úmida.',
 'Embrapa Circ. Téc. 113 (2013) p.3 e p.6'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'Floração', 35, 44,
 'Começa a fase mais sensível à falta de água: não deixe o solo secar. Calor forte aumenta as flores machos e reduz os frutos.',
 'Embrapa Circ. Téc. 113 (2013) p.5-6; Marouelli et al. (2017) Tab.39 p.105'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'Colheita', 45, 115,
 'Colha em dias alternados e tire todos os frutos no ponto, até os sem valor de venda, para a planta seguir produzindo. Mantenha o solo sempre úmido.',
 'Embrapa Circ. Téc. 113 (2013) p.6 e p.15');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'geada',
 'Geada queima folhas e frutos e pode matar o tomateiro. Onde ela ocorre, plante fora da época de geada ou cultive sob plástico com as laterais fechadas, longe de baixadas onde o ar frio se acumula.',
 'Embrapa Plantar 5 (1993) p.12, p.14 e p.68-69'),
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'frio',
 'Frio atrasa o crescimento e alonga o ciclo. Na estufa ou sob plástico, mantenha as laterais fechadas nos dias frios.',
 'ZARC tomate (Port. SPA/MAPA 378/2026) p.1; Embrapa Plantar 5 (1993) p.68-69'),
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'calor',
 'Por que importa: acima de 32 °C as flores caem, o desenvolvimento dos frutos fica inibido e eles saem ocos. Calor acima de 28 °C por muito tempo tira a firmeza e a cor: o fruto fica amarelado. O que fazer: não deixe faltar água, com regas leves e frequentes da floração à maturação. Se for transplantar, faça nas horas mais frescas do dia, com o solo úmido.',
 'Embrapa (Plantar 5, Tomate, 1993, p. 11, 29 e 30)'),
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'chuva_excessiva',
 'Excesso de água derruba flores, racha frutos e espalha doenças. Com chuva acima de 5 mm, adie a próxima irrigação e mantenha a drenagem limpa; no período chuvoso, prefira cultivo sob cobertura plástica.',
 'Portal Embrapa Tomate de mesa (Irrigação); Marouelli et al. (2017) p.104; Embrapa Plantar 5 (1993) p.14 e p.68'),
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'deficit_hidrico',
 'Por que importa: da floração até o início da maturação o tomateiro é o mais sensível à falta de água. Mesmo moderada, ela reduz o tamanho dos frutos. Se for forte, reduz o número de frutos e pode causar o fundo-preto. O que fazer: faça regas leves e frequentes, para manter úmida a camada de solo das raízes (até uns 40 cm). Não encharque: o excesso de água derruba flores e favorece o fundo-preto e as doenças.',
 'Embrapa Hortaliças (Irrigação da cultura do tomateiro orgânico, 2014, p. 59-60 e 104); Embrapa (Plantar 5, Tomate, 1993, p. 30-31)'),
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'favoravel',
 'Por que aproveitar: o tomateiro de crescimento indeterminado precisa de tutor para não crescer apoiado no chão, e o mato disputa água, luz e nutrientes com ele. O que fazer: amarre as plantas nas estacas ou no arame conforme crescem, faça a desbrota (tire os brotos laterais, deixando só as hastes que vai conduzir) e mantenha a lavoura sem mato até o início da colheita. Olhe a plantação todo dia, para notar doenças e pragas.',
 'Embrapa (Plantar 5, Tomate, 1993, p. 32-34)');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'geada',
 'O pepino não tolera geada. Onde ela ocorre, plante na primavera-verão ou cultive dentro de estufa, que segura o calor da noite.',
 'Embrapa Circ. Téc. 113 (2013) p.3'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'frio',
 'Frio prejudica mais a planta nova, até uns 35 dias, e abaixo de 12 °C o pepino quase não cresce. Em época fria, semeie em estufa ou adie a semeadura.',
 'Embrapa Circ. Téc. 113 (2013) p.3; Buriol et al., Pesq. Agrop. Gaúcha (2000) p.206'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'calor',
 'Por que importa: o pepino se adapta a temperaturas de 20 a 30 °C. Com temperaturas altas, nascem mais flores masculinas e menos femininas, e o sol direto nos frutos pode machucá-los (manchas brancas ou bege). O que fazer: mantenha o solo bem úmido, perto da capacidade de campo. Na estufa, na época quente, deixe as laterais abertas para evitar temperaturas muito altas.',
 'Embrapa Hortaliças (Circular Técnica 113, A cultura do pepino, 2013, p. 3 e 5-6)'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'chuva_excessiva',
 'Chuva frequente e folha molhada favorecem doenças. Com chuva acima de 5 mm, adie a próxima irrigação e mantenha a área bem drenada.',
 'Embrapa Circ. Téc. 113 (2013) p.5 e p.11-12; Marouelli et al. (2017) p.104'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'deficit_hidrico',
 'Por que importa: o pepino exige muita água e a falta é muito prejudicial, principalmente em solo de textura leve. A floração e a frutificação são as fases mais críticas. O que fazer: mantenha a umidade do solo próxima da capacidade de campo. No outono-inverno quase toda a água vem da irrigação. Na primavera-verão, ela só completa a chuva que faltou.',
 'Embrapa Hortaliças (Circular Técnica 113, A cultura do pepino, 2013, p. 5-7); Marouelli et al. (Irrigação por aspersão em hortaliças, 4ª ed., Embrapa, 2017, p. 105-106)'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'favoravel',
 'Por que aproveitar: colher em dias alternados estimula a frutificação e aumenta a produção. O que fazer: colha em dias alternados e tire da planta todos os frutos no ponto, até os que não servem para vender (caipira: 12 a 14 cm; aodai e japonês: 21 a 23 cm). Mantenha a planta tutorada: o tutor ajuda no controle de pragas e doenças e melhora a qualidade dos frutos. Capine se precisar.',
 'Embrapa Hortaliças (Circular Técnica 113, A cultura do pepino, 2013, p. 14-15)');

INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Alface'), 'Pegamento da muda', 0, 15, 'Regue pouco e várias vezes ao dia, mantendo úmidos os primeiros 10 cm de solo. Não deixe a muda murchar até ela pegar.', 'Marouelli et al., Irrigação por aspersão em hortaliças (Embrapa 2008) p.57 e 97; duração proporcional à FAO-56 Tab.11 (alface 20/30/15/10 d)'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'Crescimento das folhas', 16, 39, 'Mantenha o solo úmido, sem encharcar. Água em excesso aumenta as doenças.', 'Embrapa Hortaliças, Circular Técnica 56 (2007) p.14; duração: FAO-56 Tab.11'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'Formação da cabeça', 40, 53, 'É a fase em que a falta de água mais prejudica a alface. Não deixe o canteiro secar.', 'Marouelli et al., Irrigação por aspersão em hortaliças (Embrapa 2008) Tab.34 p.95'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'Pré-colheita e colheita', 54, 60, 'Colha antes do pendoamento, enquanto as folhas não ficaram amargas.', 'Catálogo Bras. Hortaliças (Embrapa/SEBRAE 2010) p.13; Marouelli et al. 2008 p.57 (pré-colheita 5-7 d)');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Alface'), 'geada', 'Ligue a aspersão no começo da noite, com o ar ainda entre 4 °C e 0,5 °C, e mantenha até o ar esquentar de manhã. A alface só aguenta geada leve.', 'Embrapa Hortaliças CT158 (2017) p.20-21; Embrapa Hortaliças CT56 (2007) p.4'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'frio', 'Com frio abaixo de 15 °C a alface cresce mais devagar, mas tolera bem. Nessa época, prefira cultivares de inverno.', 'Lima et al. 2025 (Embrapa Hortaliças) p.4; Embrapa CT56 (2007) p.4; Catálogo Bras. Hortaliças (2010) p.13'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'calor', 'Por que importa: acima de 25 °C e com dias longos, a alface encurta a fase de crescimento, floresce cedo (pendoa) e as folhas ficam grossas, pequenas e, com o pendão, amargas. O que fazer: regue mais vezes nos dias quentes e de sol e cubra o canteiro com palha, que mantém umidade e temperatura mais amenas. Colha antes de pendoar. Próximas safras: use cultivar de verão, resistente ao pendoamento precoce.', 'Embrapa Hortaliças (CT 56, 2007, p. 4); Makishima (O cultivo de hortaliças, Embrapa, 1993, p. 12 e 50); Embrapa/SEBRAE (Catálogo Brasileiro de Hortaliças, 2010, p. 13); Embrapa (Hortas: o produtor pergunta, a Embrapa responde, p. 126); Embrapa Hortaliças (CT 47, 2007, p. 3, 9 e 15)'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'chuva_excessiva', 'Na época das chuvas, faça canteiros mais altos (cerca de 20 cm) e abra drenos ao redor da área. Água parada estraga as plantas e traz doenças.', 'Embrapa Amapá, Circular Técnica 10 (2000) p.9; Embrapa Hortaliças CT56 (2007) p.14'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'deficit_hidrico', 'Por que importa: a alface tem ciclo curto e raiz rasa, e sente logo a falta de água. Nas alfaces de cabeça, a fase mais sensível é a formação da cabeça. Sem água, cai a produção e a qualidade das folhas. O que fazer: irrigue o canteiro todo dia, e mais vezes nos dias quentes e de sol. Palha sobre o canteiro ajuda a manter a umidade. Não encharque: água em excesso aumenta as doenças.', 'Embrapa (Hortas: o produtor pergunta, a Embrapa responde, p. 126 e 143-144); Marouelli et al. (Embrapa, 2017, p. 105); Makishima (Embrapa, 1993, p. 51); Embrapa Hortaliças (CT 47, 2007, p. 9; CT 56, 2007, p. 14)'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'favoravel', 'Por que aproveitar: a alface se desenvolve melhor em temperaturas de 12 a 22 °C. Quando pendoa, as folhas ficam amargas. O que fazer: colha as plantas bem desenvolvidas, antes que fiquem fibrosas ou pendoem. Regue o canteiro todo dia. Tire as ervas do leito do canteiro. A alface de verão fica pronta de 50 a 70 dias após o plantio; a de inverno, de 60 a 80. Se for transplantar, faça no fim da tarde e regue em seguida.', 'Makishima (O cultivo de hortaliças, Embrapa, 1993, p. 50-51); Embrapa/SEBRAE (Catálogo Brasileiro de Hortaliças, 2010, p. 13); Embrapa Hortaliças (CT 47, 2007, p. 9 e 15; CT 56, 2007, p. 15)');

INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Couve'), 'Pegamento da muda', 0, 19, 'Regue com frequência e pouca água até a muda pegar. Falta de água nessa fase é crítica para a couve.', 'Embrapa Hortaliças CT158 (2017) p.7-8; duração: FAO-56 Tab.11 (crucíferas, fase inicial 20 d)'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'Crescimento das plantas', 20, 79, 'A couve sente falta de água em todo o ciclo. Mantenha o solo úmido, sem encharcar.', 'Embrapa Hortaliças CT158 (2017) p.8; Catálogo Bras. Hortaliças (2010) p.29 (colheita aos 80-90 d)'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'Colheita das folhas', 80, 180, 'Colha a cada 7 a 10 dias as folhas com 20 a 30 cm, puxando o talo para baixo. Tire os brotos ladrões, que podem virar mudas.', 'Trani et al., Bol. Téc. IAC 214 (2015) p.26-27');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Couve'), 'geada', 'Ligue a aspersão no começo da noite, com o ar ainda entre 4 °C e 0,5 °C, e mantenha até o ar esquentar de manhã. Gotejamento não protege contra geada.', 'Embrapa Hortaliças CT158 (2017) p.20-21'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'frio', 'A couve é planta de outono-inverno e aguenta bem o frio. Só fique atento às noites de geada.', 'Trani et al., Bol. Téc. IAC 214 (2015) p.8'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'calor', 'Por que importa: a couve é de outono-inverno e, acima de 28 °C (referência do Estado de São Paulo), se desenvolve pior e produz menos. Falta de água com sol forte murcha a planta e pode queimar folhas e brotos. O que fazer: se não chover, reponha a água todos os dias e cubra o solo com palha para guardar a umidade.', 'Trani et al. (Boletim Técnico IAC 214, Couve de folha: do plantio à pós-colheita, 2015, p. 8 e 12-13)'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'chuva_excessiva', 'Use canteiros elevados e terreno com boa drenagem, para não juntar água no pé da planta. Chuva demais lava o adubo e aumenta as doenças.', 'Santos et al., Cultivo da Couve-de-folhas (2026) p.18, 25; Embrapa Hortaliças CT158 (2017) p.8'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'deficit_hidrico', 'Por que importa: a couve sente falta de água em todo o ciclo. Ela murcha e, com sol forte, pode queimar folhas e brotos; planta com sede também sofre mais com pulgões. O que fazer: se não chover, reponha a água todo dia, sem encharcar, pois o excesso apodrece as raízes. Cubra o solo com palha: ela reduz as regas.', 'Embrapa Hortaliças (Circular Técnica 158, 2017, p. 1-2 e 8); Trani et al. (Boletim Técnico IAC 214, 2015, p. 12-13)'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'favoravel', 'Por que aproveitar: a couve produz melhor com média de 16 a 22 °C e máxima de até 28 °C. O que fazer: colha a cada 7 a 10 dias as folhas bem desenvolvidas (20 a 30 cm), puxando o talo para baixo, e deixe os maços na água até a venda, para não murcharem. Tire os brotos "ladrões" das axilas: podem virar mudas. Ao tirar o mato, só roce a superfície, para não ferir as raízes, por onde entram bactérias.', 'Trani et al. (Boletim Técnico IAC 214, Couve de folha: do plantio à pós-colheita, 2015, p. 8, 23, 26-27)');

INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'Pegamento e expansão das folhas', 0, 29, 'Mantenha o solo sempre úmido até a muda pegar, porque falta de água agora é crítica. Folhas grandes nesta fase garantem cabeça grande depois.', 'Embrapa Circ. Téc. 158 (2017) p.8; Coleção Plantar 74 (2015) p.28 (estádio 2, 30-60 d após a emergência) e p.37 (muda com 30-35 d)'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'Diferenciação floral', 30, 59, 'Calor forte por muitos dias atrasa a cabeça, e frio abaixo de 10 °C por muitos dias faz ela sair miúda e antes da hora. Não deixe faltar água nem adubo.', 'Coleção Plantar 74 (2015) p.24, 26-27 e 28 (estádio 3, 60-90 d após a emergência)'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'Formação da cabeça e colheita', 60, 90, 'Fase que mais sente falta de água: nos dias secos e quentes regue com mais frequência. Colha nas horas frescas, com a cabeça firme e os botões ainda fechados.', 'Embrapa Circ. Téc. 158 (2017) p.8; Coleção Plantar 74 (2015) p.28 (estádio 4, 90-120 d após a emergência), p.44 e p.117-119');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'geada', 'Se tem aspersão, ligue no começo da noite, com o ar ainda entre 4 e 0,5 °C, e mantenha ligada até o ar esquentar e o gelo derreter. Onde geia sempre, use túnel sobre os canteiros.', 'Embrapa Circ. Téc. 158 (2017) p.19-21; Coleção Plantar 74 (2015) p.42'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'frio', 'Frio abaixo de 10 °C por muitos dias faz a cabeça sair pequena e antes da hora. Na época fria plante cultivar de inverno e não deixe faltar água nem adubo no começo do ciclo.', 'Coleção Plantar 74 (2015) p.25-27'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'calor', 'Por que importa: acima de 25 °C por vários dias, o brócolis atrasa a formação da cabeça, que sai menor, com botões desiguais e folhinhas entre eles. O que fazer: se irrigar, regue com mais frequência, principalmente na formação da cabeça. No calor, evite cobrir o canteiro com plástico, que esquenta ainda mais a terra. Próximas safras: no verão, plante cultivar de verão.', 'Embrapa (Coleção Plantar 74, A cultura dos brócolis, 2015, p. 23-25, 27 e 43-44)'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'chuva_excessiva', 'Chuva demais traz doença e solo encharcado prejudica a raiz: plante em canteiro alto e evite área mal drenada. Na época das chuvas, cobertura tipo guarda-chuva protege a lavoura.', 'Embrapa Circ. Téc. 158 (2017) p.8; Coleção Plantar 74 (2015) p.26-27 e 42-43'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'deficit_hidrico', 'Por que importa: o brócolis é exigente em água, e a fase mais sensível é a formação da cabeça. Sem água ela sai desigual em formato, tamanho e firmeza, e a produção cai. Falta de água no começo do ciclo também pode antecipar o florescimento. O que fazer: no tempo seco, irrigue com mais frequência, sem encharcar: o excesso derruba a cabeça. Palha no solo reduz a necessidade de regas.', 'Embrapa Hortaliças (Circular Técnica 158, Irrigação no cultivo de brássicas, 2017, p. 2 e 8); Embrapa (Coleção Plantar 74, 2015, p. 26-27, 44 e 47)'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'favoravel', 'Por que aproveitar: a temperatura define o tamanho e a qualidade da cabeça, e o brócolis rende melhor com 20 a 24 °C antes de ela aparecer e 15 a 18 °C depois. O que fazer: mantenha a terra úmida, sem encharcar, pois o brócolis é exigente em água, principalmente na formação da cabeça. Nas primeiras semanas depois do transplante, deixe a lavoura no limpo, para o mato não disputar água, luz e nutrientes.', 'Embrapa (Coleção Plantar 74, A cultura dos brócolis, 2015, p. 23, 44 e 48); Embrapa Hortaliças (Circular Técnica 158, 2017, p. 8)');

INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'Pegamento da muda', 0, 19, 'Nos primeiros 20 dias regue todo dia, pouco de cada vez, até a muda pegar. Falta de água agora é crítica.', 'Sistema de Produção para Repolho, Boletim 362 EMATER-DF/CNPH (1981) p.18 do PDF; Embrapa Circ. Téc. 158 (2017) p.8'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'Crescimento das folhas', 20, 44, 'A planta cresce devagar e forma as folhas que vão sustentar a cabeça; falta de água moderada aqui prejudica pouco. Faça a adubação de cobertura e mantenha o mato controlado.', 'FAO Land & Water, Cabbage (crescimento lento na 1ª metade do ciclo); Embrapa Circ. Téc. 158 (2017) p.8; Boletim 362 EMATER-DF/CNPH (1981) p.18 do PDF'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'Formação da cabeça', 45, 79, 'Fase mais sensível à falta de água: sem rega a cabeça fica pequena e frouxa. Calor forte também atrapalha o fechamento da cabeça.', 'Embrapa Circ. Téc. 158 (2017) p.8; Catálogo Bras. de Hortaliças (2010) p.52; FAO Land & Water, Cabbage'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'Compactação e colheita', 80, 90, 'Mantenha a água constante: chuva forte ou rega pesada depois de dias secos racha a cabeça. Colha quando a cabeça estiver bem fechada e firme.', 'Embrapa Circ. Téc. 158 (2017) p.7-8; Boletim 362 EMATER-DF/CNPH (1981) p.18 do PDF; FAO Land & Water, Cabbage (maturação de 10 a 20 dias)');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'geada', 'Repolho formado aguenta geada leve, mas muda nova sofre mais. Se tem aspersão, ligue no começo da noite, com o ar ainda entre 4 e 0,5 °C, e mantenha até o gelo derreter.', 'Embrapa Circ. Téc. 158 (2017) p.19-21; Catálogo Bras. de Hortaliças (2010) p.52; FAO Ecocrop ficha 554; FAO Land & Water, Cabbage'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'frio', 'Frio de 4 a 7 °C por várias semanas pode fazer o repolho soltar o pendão em vez de fechar a cabeça. Na época fria, plante cultivar de inverno.', 'FAO Ecocrop ficha 554; FAO Land & Water, Cabbage; Catálogo Bras. de Hortaliças (2010) p.52'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'calor', 'Por que importa: no calor o repolho não forma bem a cabeça. O que fazer: não deixe faltar água, sem encharcar. Em dia muito quente e seco, transplante as mudas no fim da tarde. Palha sobre o solo reduz a necessidade de rega. Próximas safras: no verão, plante cultivar de verão ou adaptada a temperaturas mais altas.', 'Embrapa/SEBRAE (Catálogo Brasileiro de Hortaliças, 2010, p. 52); Embrapa Hortaliças (Circular Técnica 158, 2017, p. 2, 7-8 e 17)'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'chuva_excessiva', 'Chuva demais encharca o solo, traz doença e pode rachar a cabeça. Na época das chuvas plante na parte alta do sulco ou em canteiro, longe de área mal drenada.', 'Embrapa Circ. Téc. 158 (2017) p.8; Boletim 362 EMATER-DF/CNPH (1981) p.17 do PDF'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'deficit_hidrico', 'Por que importa: o repolho é mais sensível à falta de água na formação da cabeça, que sai desigual em formato, tamanho e firmeza. Seca seguida de rega ou chuva forte racha a cabeça. O que fazer: priorize a rega nessa fase e mantenha a umidade parecida de um dia para o outro, sem encharcar. Aperte um punhado de terra: está bom quando solta gotas, mas não escorre.', 'Embrapa Hortaliças (Circular Técnica 158, 2017, p. 2 e 8); Embrapa/SEBRAE (Catálogo Brasileiro de Hortaliças, 2010, p. 52); Embrapa Acre (Circular Técnica 11, 1994, p. 12)'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'favoravel', 'Por que aproveitar: o repolho se dá bem entre 15 e 25 °C e é exigente em água e adubação. O que fazer: mantenha a água constante, sem encharcar, para a cabeça não rachar. Mantenha a lavoura no limpo: o mato sombreia o repolho.', 'Embrapa/SEBRAE (Catálogo Brasileiro de Hortaliças, 2010, p. 52); Embrapa Acre (Circular Técnica 11, 1994, p. 13)');

-- ============ El Niño e La Niña: o que costumam trazer para a região e o que fazer ============
-- No Sudeste e no Brasil Central o efeito na chuva é fraco ou incerto (Cemaden, NT 564/2023); o sinal
-- mais firme é na temperatura. Os textos dizem isso, sem prometer mais do que as fontes mostram, e em
-- palavras do dia a dia: "época de plantio indicada (o ZARC)", "variedade", "plante em etapas".
-- Gerais (valem para todas as culturas)
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('El Nino', NULL, 'Costuma fazer mais calor que o normal. Na chuva não dá para saber: em alguns anos de El Niño choveu menos aqui, em outros choveu mais.', 'Plante na época indicada para o seu município (o ZARC) e olhe a previsão do tempo antes de decidir. Se der, tenha irrigação e faça um seguro da lavoura (seguro rural ou Proagro).', 'Cemaden, Nota Técnica 564/2023, item 25, p. 5; Guimarães e Reis (Embrapa Milho e Sorgo), O fenômeno ENOS e a temperatura no Brasil, p. 2-3; Embrapa, Nota Técnica El Niño 2026/2027 (163 medidas), p. 77-78, 82 e 85');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('La Nina', NULL, 'Costuma fazer um pouco menos de calor. No Cerrado a chuva não muda de um jeito certo, mas já teve ano em que as chuvas demoraram mais para começar.', 'Plante na época indicada para o seu município (o ZARC), mas só com a terra bem úmida. Plante em etapas, com variedades de ciclos diferentes, para não arriscar tudo de uma vez.', 'Embrapa Cerrados, La Niña: sua influência na próxima safra de soja do Centro-Oeste (2010), p. 1-2; Embrapa Arroz e Feijão, BPD 70 (2026), p. 9; Guimarães e Reis (Embrapa Milho e Sorgo), p. 3; Embrapa, Nota Técnica El Niño 2026/2027, p. 78');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('Neutro', NULL, 'Sem El Niño nem La Niña, o mar do Pacífico não deve mudar o tempo desta safra.', 'Plante na época indicada para o seu município (o ZARC) e acompanhe a previsão do tempo.', 'Embrapa, Nota Técnica El Niño 2026/2027 (163 medidas), p. 17 e 77-78');

-- Específicas por cultura
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('El Nino', (SELECT id FROM cultura WHERE nome = 'Soja'), 'Num estudo da Embrapa com as chuvas de 1980 a 2013, o El Niño não mudou a época de plantar soja em Goiás, vizinho do Triângulo Mineiro.', 'Plante na época de sempre, a indicada para o seu município (o ZARC). Escolha uma variedade feita para a região e que produza bem todo ano.', 'Embrapa Arroz e Feijão, Boletim de Pesquisa e Desenvolvimento 70 (2026), p. 8-10 e 14; Embrapa, Nota Técnica El Niño 2026/2027, p. 78 e 83');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('El Nino', (SELECT id FROM cultura WHERE nome = 'Café'), 'Se as chuvas da primavera atrasarem ou vierem com falhas, o café pode florir aos poucos, desigual, e os frutinhos novos (o chumbinho) podem cair.', 'Se tiver irrigação, guarde a água para as fases que mais importam: a florada, quando os frutinhos se formam e quando os grãos enchem.', 'Embrapa, Nota Técnica El Niño 2026/2027 (163 medidas), seção 3.6, p. 61, e medida 4.11.2-3, p. 121');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('La Nina', (SELECT id FROM cultura WHERE nome = 'Soja'), 'Em Goiás, vizinho do Triângulo Mineiro, nos anos de La Niña o tempo bom para plantar soja ficou 23% mais curto, e a melhor data ficou mais para frente.', 'Se depois vai plantar a safrinha, prefira soja de ciclo curto. Plante em etapas: primeiro as de ciclo curto, por último as de ciclo longo.', 'Embrapa Arroz e Feijão, Boletim de Pesquisa e Desenvolvimento 70 (2026), p. 10 e 14; Embrapa Cerrados, La Niña: sua influência na próxima safra de soja do Centro-Oeste (2010), p. 2');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('La Nina', (SELECT id FROM cultura WHERE nome = 'Milho'), 'Em anos de La Niña a terra seca mais no fim da época das chuvas, e o milho safrinha plantado tarde produz menos.', 'Plante a safrinha cedo, na época indicada para o seu município (o ZARC), com milho de ciclo curto. Se a soja atrasou muito, pense se vale a pena plantar a safrinha.', 'Embrapa Arroz e Feijão, Boletim de Pesquisa e Desenvolvimento 70 (2026), p. 10 e 14 (estudo em GO, MT, TO e RO)');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('La Nina', (SELECT id FROM cultura WHERE nome = 'Sorgo'), 'Na safrinha, em ano de La Niña, a terra pode ficar mais seca.', 'O sorgo aguenta melhor a falta de água. Por isso é uma boa escolha para a safrinha nesses anos.', 'Embrapa Arroz e Feijão, Boletim de Pesquisa e Desenvolvimento 70 (2026), p. 10 e 14 (estudo em GO, MT, TO e RO)');

-- Hortaliças (mesma orientação para todas; INSERT ... SELECT gera uma linha por cultura)
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte)
SELECT 'El Nino', id, 'Em ano de El Niño, o calor forte e as ondas de calor ficam mais comuns no Sudeste, e muitas hortaliças sofrem com isso.', 'Plante em etapas, em datas diferentes, e use variedades que aguentam calor. Não deixe faltar água e cubra a terra com palha.', 'Embrapa, Nota Técnica El Niño 2026/2027 (163 medidas), p. 40 e 106; Guimarães e Reis (Embrapa Milho e Sorgo), O fenômeno ENOS e a temperatura no Brasil, p. 2-3'
FROM cultura WHERE nome IN ('Alface','Couve','Brócolis','Repolho','Tomate','Pepino','Chuchu','Morango');

-- ============ Chuva em excesso: Café, Cana-de-açúcar e Trigo (antes usavam o texto genérico) ============
INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Café'), 'chuva_excessiva', 'Por que importa: se a chuva pegar a colheita, ela derruba muito fruto no chão e favorece fermentação no terreiro e no secador, dando grãos pretos, ardidos e fermentados, que depreciam muito a bebida. O que fazer: se a colheita está em andamento e há chuva persistente prevista, colha primeiro as áreas mais expostas, para os frutos não ficarem no campo. Não deixe o café colhido amontoado nem parado em saco. Se chover no terreiro, faça leiras grandes no sentido do declive e troque-as de lugar várias vezes; passada a chuva, revolva até secar. Separe o lote colhido depois da chuva.', 'Embrapa (Nota Técnica El Niño 2026/2027, Rede Zarc, 2026, p. 65 e 122); Embrapa/CNI/SENAI/SEBRAE (Manual de Segurança e Qualidade para a Cultura do Café, 2004, p. 19 e 21-22)'),
((SELECT id FROM cultura WHERE nome = 'Cana-de-açúcar'), 'chuva_excessiva', 'Por que importa: com muita chuva perto do corte, a água dilui o açúcar no colmo (cai o ATR, o açúcar total recuperável) e a cana chega "verde", com pouca pureza, à usina. A chuva pode parar o corte e o transporte, e tempestade com vento tomba o canavial. A colhedora em solo úmido compacta a terra. O que fazer: não entre com máquina em solo encharcado; ajuste a ordem do corte pela textura e pela trafegabilidade dos talhões. Depois de temporal ou alagamento, confira os talhões tombados e as soqueiras. Para as próximas safras: mantenha a palha no solo, que ajuda a água a infiltrar.', 'Embrapa (Nota Técnica El Niño 2026/2027, Rede Zarc, 2026, p. 65, 118, 125 e 126-127); Embrapa (Nota Técnica El Niño, Centro-Oeste, set. 2026, p. 24)'),
((SELECT id FROM cultura WHERE nome = 'Trigo'), 'chuva_excessiva', 'Por que importa: chuva e umidade com o grão já maduro ativam uma enzima que degrada o amido. O grão germina na espiga, o número de queda cai e o trigo perde a aptidão para pão, indo para ração com deságio. O que fazer: colha assim que o grão permitir a entrada da máquina; com chuva intensa e frequente prevista, dá para colher mais úmido e secar depois. Evite entrar com máquina em solo encharcado. Para as próximas safras: prefira cultivar com mais tolerância à germinação na espiga.', 'Embrapa (Nota Técnica El Niño 2026/2027, Rede Zarc, 2026, p. 45 e 92); Embrapa (Nota Técnica: Ações para Mitigação dos Efeitos do El Niño 2026/2027 na Agricultura do Sul do Brasil, 2026, p. 13)');
