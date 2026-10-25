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
     'Não deixe faltar água: irrigue mantendo a terra úmida, sem encharcar. Espalhe folhas e troncos da própria bananeira nas entrelinhas para guardar a umidade e refrescar o solo.',
     'Embrapa Mandioca e Fruticultura (500 Perguntas Banana, 2012, p. 23-24 e 59-60)'),
    (@banana, 'chuva_excessiva',
     'Limpe e abra os drenos: a água parada deve sair em até 2 horas, porque mais de 3 dias de encharcamento estraga as raízes. Drenar rápido também ajuda a evitar o mal-de-sigatoka.',
     'Embrapa Mandioca e Fruticultura (500 Perguntas Banana, 2012, p. 55, 84 e 140)'),
    (@banana, 'deficit_hidrico',
     'Irrigue, principalmente se o bananal já está florindo ou enchendo cacho (a partir do 7º mês). Cubra o solo com restos da bananeira para segurar a umidade.',
     'Embrapa Mandioca e Fruticultura (500 Perguntas Banana, 2012, p. 59, 80 e 83)'),
    (@banana, 'favoravel',
     'Aproveite a terra úmida para a adubação de cobertura, em meia-lua na frente do filho. Bom momento também para capinar as ruas.',
     'Embrapa Mandioca e Fruticultura (500 Perguntas Banana, 2012, p. 73 e 92)'),
    (@goiaba, 'geada',
     'Geada queima folhas, ramos e brotos novos, e a planta nova é a que mais sofre. Deixe a poda de frutificação para depois do frio e mantenha quebra-vento contra o vento frio do sul.',
     'Embrapa (Coleção Plantar 27, 1995, p. 16 e 18; Coleção Plantar 66, 2010, p. 19-20, 48 e 103); Embrapa Semi-Árido (Frutas do Brasil 17, 2001, p. 25)'),
    (@goiaba, 'calor',
     'Irrigue sem deixar faltar água, principalmente na florada: calor forte e seca derrubam flores e frutinhos. Mantenha matéria orgânica sob a copa para proteger a terra do sol.',
     'Embrapa Semi-Árido (Frutas do Brasil 17, 2001, p. 25-26); Embrapa (Coleção Plantar 66, 2010, p. 22; Coleção Plantar 27, 1995, p. 54)'),
    (@goiaba, 'chuva_excessiva',
     'Não pode nem colha com a planta molhada de chuva ou orvalho. Dê saída à água parada, porque a goiabeira não vai bem em terra encharcada.',
     'Embrapa (Coleção Plantar 27, 1995, p. 18 e 62; Coleção Plantar 66, 2010, p. 104)'),
    (@goiaba, 'deficit_hidrico',
     'Irrigue: falta de água prolongada atrasa a florada e derruba frutos. Sem irrigação, deixe a poda de frutificação para quando a chuva voltar.',
     'Embrapa Semi-Árido (Frutas do Brasil 17, 2001, p. 26); Embrapa (Coleção Plantar 66, 2010, p. 21; Coleção Plantar 27, 1995, p. 32)'),
    (@goiaba, 'favoravel',
     'Boa semana para a poda de frutificação nos ramos maduros, com umidade para a brotação. Aproveite para fazer o coroamento (capina em volta do pé) e a adubação orgânica sob a copa.',
     'Embrapa (Coleção Plantar 27, 1995, p. 32, 36 e 54)');

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
           'Abra o túnel cedo, dos dois lados, e colha nas horas frescas sem deixar fruto ao sol. Não deixe faltar água: com calor e seca o fruto amadurece antes e fica menor.',
           'Morangueiro Embrapa (2016) p.216; SP Morango Embrapa (2016) p.11, p.33 e p.35'
    UNION ALL
    SELECT 'chuva_excessiva',
           'Deixe o túnel fechado durante a chuva e não irrigue com o solo encharcado. Não colha com chuva e tire do canteiro os frutos podres.',
           'SP Morango Embrapa (2016) p.11 e p.35'
    UNION ALL
    SELECT 'deficit_hidrico',
           'Reforce a irrigação por gotejamento, mantendo o solo úmido perto da capacidade de campo, sem encharcar. A falta de água pesa mais do fruto novo até o amadurecimento.',
           'SP Morango Embrapa (2016) p.32-33; IA EPAMIG 236 (2007) p.52'
    UNION ALL
    SELECT 'favoravel',
           'Semana boa: mantenha a irrigação regular e colha a cada 1 a 3 dias, nas horas frescas. Aproveite para tirar folhas, flores e frutos doentes do canteiro.',
           'SP Morango Embrapa (2016) p.11 e p.35'
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
           'Calor derruba flores e frutinhos: não deixe faltar água e use palha no solo para segurar a umidade. Evite irrigar por aspersão de manhã, para não atrapalhar as abelhas.',
           'Circ. Téc. 139 Embrapa Hortaliças (2015) p.2, p.5 e p.9'
    UNION ALL
    SELECT 'chuva_excessiva',
           'Suspenda a irrigação e garanta a drenagem: o chuchuzeiro não tolera solo encharcado. Na chuva, a palha no solo pode piorar o excesso de água.',
           'Circ. Téc. 139 (2015) p.9; Instr. Téc. 5 CNPH (1983) p.2 e p.5'
    UNION ALL
    SELECT 'deficit_hidrico',
           'Reforce a irrigação, com regas a cada 1 a 2 dias, e até duas por dia na seca em solo que segura pouca água. Na produção a planta é ainda mais sensível à falta de água.',
           'Instr. Téc. 5 CNPH (1983) p.5; Circ. Téc. 139 (2015) p.8'
    UNION ALL
    SELECT 'favoravel',
           'Semana boa: colha a cada 1 a 3 dias, mesmo com preço baixo, para não travar as novas floradas. Mantenha a água regular e retire ramas secas.',
           'Plantar 14 (1994) p.27 e p.45-46; Circ. Téc. 139 (2015) p.8'
) r
WHERE c.nome = 'Chuchu';

-- ============ Grãos: textos genéricos (valem para toda cultura sem texto próprio), feijão, milho e soja ============
-- A) Recomendações genéricas (cultura_id NULL)
INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
(NULL, 'geada', 'O estrago depende da fase da lavoura, de quanto a temperatura cai e de quantas horas o frio dura. Baixadas e beira de córrego sofrem mais, porque o ar frio se acumula ali. Nas próximas safras, semeie na época indicada pelo zoneamento (ZARC), para as fases sensíveis não pegarem o período de geada.', 'Embrapa Milho e Sorgo (500 Perguntas Milho, 2011, p. 314-315); Embrapa Arroz e Feijão (Conhecendo a fenologia do feijoeiro, 2018, p. 46)'),
(NULL, 'frio', 'Frio logo depois da semeadura atrasa a germinação e a emergência e deixa o ciclo mais longo. Se ainda vai semear, espere o solo esquentar. Em plantio cedo, com solo frio, semeie mais raso, onde a terra é mais quente.', 'Embrapa Arroz e Feijão (500 Perguntas Feijão, 2014, p. 26-27); Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 7); Embrapa Soja (500 Perguntas Soja, 2019, p. 45)'),
(NULL, 'calor', 'O calor faz mais estrago quando falta água, principalmente na floração. Se puder irrigar, não deixe faltar água. Nas próximas safras, use cultivar tolerante ao calor e escolha uma época de semeadura em que a floração não caia no período mais quente.', 'Embrapa Soja (Tecnologias de Produção de Soja, Sistemas de Produção 17, 2020, p. 40 e 51); Embrapa Arroz e Feijão (500 Perguntas Feijão, 2014, p. 27)'),
(NULL, 'chuva_excessiva', 'Confira terraços e plantio em nível para a enxurrada não levar o solo. Palhada no chão e pouco revolvimento ajudam a água a infiltrar. Não entre com máquina no solo encharcado, porque isso estraga o solo. Chuva sobre lavoura pronta para colher reduz a qualidade e o peso do grão.', 'Embrapa Soja (500 Perguntas Soja, 2019, p. 45, 47 e 75)'),
(NULL, 'deficit_hidrico', 'Se tiver irrigação, priorize a floração e o enchimento de grãos, que são as fases que mais sofrem com a falta de água. Palhada sobre o solo segura a umidade e reduz o número de irrigações. Se ainda não semeou, espere uma chuva que molhe bem o solo antes de plantar.', 'Embrapa Soja (Tecnologias de Produção de Soja, Sistemas de Produção 17, 2020, p. 39 e 42); Embrapa Arroz e Feijão (500 Perguntas Feijão, 2014, p. 28 e 106)'),
(NULL, 'favoravel', 'Aproveite a semana boa para vistoriar a área e anotar a fase das plantas: olhe pelo menos 10 plantas em vários pontos da lavoura. Saber a fase ajuda a planejar os tratos culturais na hora certa.', 'Embrapa Soja (500 Perguntas Soja, 2019, p. 29-30); Embrapa Arroz e Feijão (500 Perguntas Feijão, 2014, p. 28)');

-- A) Recomendações específicas
INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'calor', 'O feijão sofre mais com calor do pouco antes da floração até o começo da formação das vagens. Calor, principalmente à noite, derruba flores e vagens. Mantenha água e nutrientes em dia. Nas próximas safras, use cultivar tolerante, não exagere no nitrogênio e reduza o número de plantas por área.', 'Embrapa Arroz e Feijão (500 Perguntas Feijão, 2014, p. 27)'),
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'deficit_hidrico', 'Falta de água na pré-floração e floração derruba flores e reduz o número de vagens. Na formação e enchimento das vagens, derruba as vagens novas e deixa o grão leve. Se irriga, dê prioridade a essas fases.', 'Embrapa Arroz e Feijão (Conhecendo a fenologia do feijoeiro, 2018, p. 45 e 47-48; 500 Perguntas Feijão, 2014, p. 28)'),
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'chuva_excessiva', 'No Cerrado, evite excesso de água no solo na floração do feijão, porque favorece o mofo-branco. Se irriga, espace mais as irrigações e revise o pivô para molhar por igual. Colheita em tempo chuvoso aumenta perdas e faz o grão brotar na vagem. Se colher úmido, seque o feijão antes de guardar.', 'Embrapa Arroz e Feijão (500 Perguntas Feijão, 2014, p. 139, 211-212 e 226)'),
((SELECT id FROM cultura WHERE nome = 'Feijão'), 'frio', 'Frio logo depois da semeadura pode impedir ou atrasar a germinação do feijão, alonga o ciclo e reduz as vagens por planta. Semeie dentro do período indicado pelo zoneamento (ZARC), que considera as condições de temperatura e de chuva.', 'Embrapa Arroz e Feijão (500 Perguntas Feijão, 2014, p. 27; Conhecendo a fenologia do feijoeiro, 2018, p. 46)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'deficit_hidrico', 'O milho sofre mais com seca de duas semanas antes até duas semanas depois do pendoamento. Dois dias sem água na floração podem cortar mais de 20% da produção, e 4 a 8 dias, mais de 50%. Se tiver irrigação, priorize essas quatro semanas.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 2 e 10; 500 Perguntas Milho, 2011, p. 32-33)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'calor', 'No pendoamento, calor acima de 35 °C junto com falta de água pode derrubar muito a produção do milho. Se puder irrigar, não deixe faltar água nessa fase.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 10-11)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'chuva_excessiva', 'Milho novo, com o ponto de crescimento ainda abaixo do solo, pode morrer em poucos dias com o solo encharcado. Encharcamento por mais de cinco dias causa prejuízo sério e sem volta. No pendoamento, excesso de água também prejudica o pólen.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 8 e 11)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'geada', 'No milho, geada até 5 folhas ou a partir do grão com dente (R5) quase não causa perda. O prejuízo é grande se a geada pegar a lavoura em pleno crescimento, perto do pendoamento ou no começo do enchimento de grãos. Baixadas e beira de córrego sofrem mais.', 'Embrapa Milho e Sorgo (500 Perguntas Milho, 2011, p. 315-316)'),
((SELECT id FROM cultura WHERE nome = 'Milho'), 'frio', 'Frio no plantio deixa o milho lento para nascer e crescer, e o ciclo fica mais longo. Em plantio cedo, com solo frio, semeie mais raso, onde a terra é mais quente.', 'Embrapa Milho e Sorgo (Circular Técnica 22, Fisiologia do Milho, 2002, p. 6-7; 500 Perguntas Milho, 2011, p. 100)'),
((SELECT id FROM cultura WHERE nome = 'Soja'), 'chuva_excessiva', 'Chuva na colheita da soja reduz a qualidade e o peso do grão, e o problema é maior em lavoura dessecada. Muitos dias nublados e chuva forte perto da floração também derrubam flores e vagens. Semear na época indicada reduz o risco de chuva na colheita.', 'Embrapa Soja (500 Perguntas Soja, 2019, p. 44 e 46-47)'),
((SELECT id FROM cultura WHERE nome = 'Soja'), 'calor', 'Na soja, calor acima de 38 °C, principalmente com falta de água, derruba flores e vagens. Calor na fase reprodutiva também apressa a maturação. Se puder irrigar, não deixe faltar água na floração e no enchimento de grãos.', 'Embrapa Soja (500 Perguntas Soja, 2019, p. 46; Tecnologias de Produção de Soja, Sistemas de Produção 17, 2020, p. 40)'),
((SELECT id FROM cultura WHERE nome = 'Soja'), 'deficit_hidrico', 'Na soja, falta de água no enchimento de grãos faz mais estrago que na floração: adianta a maturação e deixa o grão menor. Plantio direto e rotação de culturas aumentam a água guardada no solo. Depois de seca longa, só semeie quando a chuva molhar bem o solo.', 'Embrapa Soja (Tecnologias de Produção de Soja, Sistemas de Produção 17, 2020, p. 39 e 46-47)'),
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
 'Acima de 32 °C as flores caem e os frutos ficam ocos ou amarelados. Não deixe faltar água, colha nas horas frescas e guarde os frutos colhidos na sombra.',
 'Embrapa Plantar 5 (1993) p.11; portal Embrapa Tomate de mesa (Colheita; Irrigação); Marouelli et al. (2017) Tab.18 p.77'),
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'chuva_excessiva',
 'Excesso de água derruba flores, racha frutos e espalha doenças. Com chuva acima de 5 mm, adie a próxima irrigação e mantenha a drenagem limpa; no período chuvoso, prefira cultivo sob cobertura plástica.',
 'Portal Embrapa Tomate de mesa (Irrigação); Marouelli et al. (2017) p.104; Embrapa Plantar 5 (1993) p.14 e p.68'),
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'deficit_hidrico',
 'A falta de água pesa mais da floração ao amadurecimento dos frutos. Faça regas leves e frequentes, sem deixar o solo secar nem encharcar, para evitar rachadura e fundo-preto.',
 'Embrapa Plantar 5 (1993) p.30; portal Embrapa Tomate de mesa (Irrigação; Doenças fisiológicas)'),
((SELECT id FROM cultura WHERE nome = 'Tomate'), 'favoravel',
 'Tempo bom é hora de adiantar amarrio, desbrota e capina. Vistorie a lavoura todos os dias.',
 'Embrapa Plantar 5 (1993) p.32-33 e p.35');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'geada',
 'O pepino não tolera geada. Onde ela ocorre, plante na primavera-verão ou cultive dentro de estufa, que segura o calor da noite.',
 'Embrapa Circ. Téc. 113 (2013) p.3'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'frio',
 'Frio prejudica mais a planta nova, até uns 35 dias, e abaixo de 12 °C o pepino quase não cresce. Em época fria, semeie em estufa ou adie a semeadura.',
 'Embrapa Circ. Téc. 113 (2013) p.3; Buriol et al., Pesq. Agrop. Gaúcha (2000) p.206'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'calor',
 'Calor forte aumenta as flores machos e o sol direto queima os frutos. Mantenha o solo úmido e, na estufa, deixe as laterais abertas.',
 'Embrapa Circ. Téc. 113 (2013) p.5-6'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'chuva_excessiva',
 'Chuva frequente e folha molhada favorecem doenças. Com chuva acima de 5 mm, adie a próxima irrigação e mantenha a área bem drenada.',
 'Embrapa Circ. Téc. 113 (2013) p.5 e p.11-12; Marouelli et al. (2017) p.104'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'deficit_hidrico',
 'O pepino é exigente em água e a falta dela, principalmente na floração e frutificação, derruba a produção. Mantenha o solo sempre úmido, perto da capacidade de campo.',
 'Embrapa Circ. Téc. 113 (2013) p.6-7; Marouelli et al. (2017) Tab.39 p.105'),
((SELECT id FROM cultura WHERE nome = 'Pepino'), 'favoravel',
 'Colha em dias alternados, tirando todos os frutos no ponto, o que estimula a planta a produzir mais. Aproveite para revisar o tutoramento.',
 'Embrapa Circ. Téc. 113 (2013) p.6 e p.15');

INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Alface'), 'Pegamento da muda', 0, 15, 'Regue pouco e várias vezes ao dia, mantendo úmidos os primeiros 10 cm de solo. Não deixe a muda murchar até ela pegar.', 'Marouelli et al., Irrigação por aspersão em hortaliças (Embrapa 2008) p.57 e 97; duração proporcional à FAO-56 Tab.11 (alface 20/30/15/10 d)'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'Crescimento das folhas', 16, 39, 'Mantenha o solo úmido, sem encharcar. Água em excesso aumenta as doenças.', 'Embrapa Hortaliças, Circular Técnica 56 (2007) p.14; duração: FAO-56 Tab.11'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'Formação da cabeça', 40, 53, 'É a fase em que a falta de água mais prejudica a alface. Não deixe o canteiro secar.', 'Marouelli et al., Irrigação por aspersão em hortaliças (Embrapa 2008) Tab.34 p.95'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'Pré-colheita e colheita', 54, 60, 'Colha antes do pendoamento, enquanto as folhas não ficaram amargas.', 'Catálogo Bras. Hortaliças (Embrapa/SEBRAE 2010) p.13; Marouelli et al. 2008 p.57 (pré-colheita 5-7 d)');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Alface'), 'geada', 'Ligue a aspersão no começo da noite, com o ar ainda entre 4 °C e 0,5 °C, e mantenha até o ar esquentar de manhã. A alface só aguenta geada leve.', 'Embrapa Hortaliças CT158 (2017) p.20-21; Embrapa Hortaliças CT56 (2007) p.4'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'frio', 'Com frio abaixo de 15 °C a alface cresce mais devagar, mas tolera bem. Nessa época, prefira cultivares de inverno.', 'Lima et al. 2025 (Embrapa Hortaliças) p.4; Embrapa CT56 (2007) p.4; Catálogo Bras. Hortaliças (2010) p.13'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'calor', 'Calor faz a alface pendoar e amargar: plante cultivar de verão, tolerante ao pendoamento. Cubra o solo com palha para manter umidade e temperatura amenas.', 'Embrapa Hortaliças CT56 (2007) p.4; 500 Perguntas Hortas (Embrapa 2014) p.126'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'chuva_excessiva', 'Na época das chuvas, faça canteiros mais altos (cerca de 20 cm) e abra drenos ao redor da área. Água parada estraga as plantas e traz doenças.', 'Embrapa Amapá, Circular Técnica 10 (2000) p.9; Embrapa Hortaliças CT56 (2007) p.14'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'deficit_hidrico', 'Irrigue os canteiros todos os dias, sem encharcar. A falta de água na formação da cabeça é a que mais prejudica.', 'Makishima, O cultivo de hortaliças (Embrapa 1993) p.51; Marouelli et al. 2008 Tab.34 p.95'),
((SELECT id FROM cultura WHERE nome = 'Alface'), 'favoravel', 'Tempo bom para a alface: mantenha a irrigação regular e colha no ponto, antes do pendoamento.', 'Catálogo Bras. Hortaliças (Embrapa/SEBRAE 2010) p.13');

INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Couve'), 'Pegamento da muda', 0, 19, 'Regue com frequência e pouca água até a muda pegar. Falta de água nessa fase é crítica para a couve.', 'Embrapa Hortaliças CT158 (2017) p.7-8; duração: FAO-56 Tab.11 (crucíferas, fase inicial 20 d)'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'Crescimento das plantas', 20, 79, 'A couve sente falta de água em todo o ciclo. Mantenha o solo úmido, sem encharcar.', 'Embrapa Hortaliças CT158 (2017) p.8; Catálogo Bras. Hortaliças (2010) p.29 (colheita aos 80-90 d)'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'Colheita das folhas', 80, 180, 'Colha a cada 7 a 10 dias as folhas com 20 a 30 cm, puxando o talo para baixo. Tire os brotos ladrões, que podem virar mudas.', 'Trani et al., Bol. Téc. IAC 214 (2015) p.26-27');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Couve'), 'geada', 'Ligue a aspersão no começo da noite, com o ar ainda entre 4 °C e 0,5 °C, e mantenha até o ar esquentar de manhã. Gotejamento não protege contra geada.', 'Embrapa Hortaliças CT158 (2017) p.20-21'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'frio', 'A couve é planta de outono-inverno e aguenta bem o frio. Só fique atento às noites de geada.', 'Trani et al., Bol. Téc. IAC 214 (2015) p.8'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'calor', 'Acima de 28 °C a couve sofre e produz menos. Sombra ajuda: o consórcio com quiabo sombreia a couve no calor.', 'Trani et al., Bol. Téc. IAC 214 (2015) p.8; Santos et al., Cultivo da Couve-de-folhas (Poisson/Embrapa Semiárido 2026) p.29'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'chuva_excessiva', 'Use canteiros elevados e terreno com boa drenagem, para não juntar água no pé da planta. Chuva demais lava o adubo e aumenta as doenças.', 'Santos et al., Cultivo da Couve-de-folhas (2026) p.18, 25; Embrapa Hortaliças CT158 (2017) p.8'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'deficit_hidrico', 'A couve sente falta de água em todo o ciclo. Irrigue com regularidade, sem encharcar.', 'Embrapa Hortaliças CT158 (2017) p.8; Marouelli et al. 2008 Tab.34 p.95'),
((SELECT id FROM cultura WHERE nome = 'Couve'), 'favoravel', 'Tempo bom para a couve: mantenha a irrigação e colha as folhas a cada 7 a 10 dias.', 'Trani et al., Bol. Téc. IAC 214 (2015) p.26');

INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'Pegamento e expansão das folhas', 0, 29, 'Mantenha o solo sempre úmido até a muda pegar, porque falta de água agora é crítica. Folhas grandes nesta fase garantem cabeça grande depois.', 'Embrapa Circ. Téc. 158 (2017) p.8; Coleção Plantar 74 (2015) p.28 (estádio 2, 30-60 d após a emergência) e p.37 (muda com 30-35 d)'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'Diferenciação floral', 30, 59, 'Calor forte por muitos dias atrasa a cabeça, e frio abaixo de 10 °C por muitos dias faz ela sair miúda e antes da hora. Não deixe faltar água nem adubo.', 'Coleção Plantar 74 (2015) p.24, 26-27 e 28 (estádio 3, 60-90 d após a emergência)'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'Formação da cabeça e colheita', 60, 90, 'Fase que mais sente falta de água: nos dias secos e quentes regue com mais frequência. Colha nas horas frescas, com a cabeça firme e os botões ainda fechados.', 'Embrapa Circ. Téc. 158 (2017) p.8; Coleção Plantar 74 (2015) p.28 (estádio 4, 90-120 d após a emergência), p.44 e p.117-119');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'geada', 'Se tem aspersão, ligue no começo da noite, com o ar ainda entre 4 e 0,5 °C, e mantenha ligada até o ar esquentar e o gelo derreter. Onde geia sempre, use túnel sobre os canteiros.', 'Embrapa Circ. Téc. 158 (2017) p.19-21; Coleção Plantar 74 (2015) p.42'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'frio', 'Frio abaixo de 10 °C por muitos dias faz a cabeça sair pequena e antes da hora. Na época fria plante cultivar de inverno e não deixe faltar água nem adubo no começo do ciclo.', 'Coleção Plantar 74 (2015) p.25-27'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'calor', 'Calor acima de 25 °C por vários dias atrasa e deforma a cabeça: no verão use cultivar de verão. Palhada sobre o solo segura o calor, e plástico preto no canteiro esquenta ainda mais a terra.', 'Coleção Plantar 74 (2015) p.24-25, 43 e 51'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'chuva_excessiva', 'Chuva demais traz doença e solo encharcado prejudica a raiz: plante em canteiro alto e evite área mal drenada. Na época das chuvas, cobertura tipo guarda-chuva protege a lavoura.', 'Embrapa Circ. Téc. 158 (2017) p.8; Coleção Plantar 74 (2015) p.26-27 e 42-43'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'deficit_hidrico', 'Sem chuva, irrigue com mais frequência, principalmente quando a cabeça está se formando, que é a fase mais sensível. Falta de água deixa a cabeça desigual e pequena.', 'Embrapa Circ. Téc. 158 (2017) p.8; Coleção Plantar 74 (2015) p.44'),
((SELECT id FROM cultura WHERE nome = 'Brócolis'), 'favoravel', 'Tempo ameno é o que o brócolis prefere: siga com a irrigação regular. Nas primeiras semanas após o transplante, mantenha a lavoura livre de mato.', 'Coleção Plantar 74 (2015) p.23 e p.48');

INSERT INTO fase_cultura (cultura_id, nome, dia_inicio, dia_fim, orientacao, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'Pegamento da muda', 0, 19, 'Nos primeiros 20 dias regue todo dia, pouco de cada vez, até a muda pegar. Falta de água agora é crítica.', 'Sistema de Produção para Repolho, Boletim 362 EMATER-DF/CNPH (1981) p.18 do PDF; Embrapa Circ. Téc. 158 (2017) p.8'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'Crescimento das folhas', 20, 44, 'A planta cresce devagar e forma as folhas que vão sustentar a cabeça; falta de água moderada aqui prejudica pouco. Faça a adubação de cobertura e mantenha o mato controlado.', 'FAO Land & Water, Cabbage (crescimento lento na 1ª metade do ciclo); Embrapa Circ. Téc. 158 (2017) p.8; Boletim 362 EMATER-DF/CNPH (1981) p.18 do PDF'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'Formação da cabeça', 45, 79, 'Fase mais sensível à falta de água: sem rega a cabeça fica pequena e frouxa. Calor forte também atrapalha o fechamento da cabeça.', 'Embrapa Circ. Téc. 158 (2017) p.8; Catálogo Bras. de Hortaliças (2010) p.52; FAO Land & Water, Cabbage'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'Compactação e colheita', 80, 90, 'Mantenha a água constante: chuva forte ou rega pesada depois de dias secos racha a cabeça. Colha quando a cabeça estiver bem fechada e firme.', 'Embrapa Circ. Téc. 158 (2017) p.7-8; Boletim 362 EMATER-DF/CNPH (1981) p.18 do PDF; FAO Land & Water, Cabbage (maturação de 10 a 20 dias)');

INSERT INTO recomendacao (cultura_id, tipo_alerta, texto, fonte) VALUES
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'geada', 'Repolho formado aguenta geada leve, mas muda nova sofre mais. Se tem aspersão, ligue no começo da noite, com o ar ainda entre 4 e 0,5 °C, e mantenha até o gelo derreter.', 'Embrapa Circ. Téc. 158 (2017) p.19-21; Catálogo Bras. de Hortaliças (2010) p.52; FAO Ecocrop ficha 554; FAO Land & Water, Cabbage'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'frio', 'Frio de 4 a 7 °C por várias semanas pode fazer o repolho soltar o pendão em vez de fechar a cabeça. Na época fria, plante cultivar de inverno.', 'FAO Ecocrop ficha 554; FAO Land & Water, Cabbage; Catálogo Bras. de Hortaliças (2010) p.52'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'calor', 'No calor a cabeça não fecha bem: no verão plante cultivar de verão, resistente ao calor. Nos dias quentes, não deixe faltar água.', 'Catálogo Bras. de Hortaliças (2010) p.52; Embrapa Acre Circ. Téc. 11 (1994) p.8'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'chuva_excessiva', 'Chuva demais encharca o solo, traz doença e pode rachar a cabeça. Na época das chuvas plante na parte alta do sulco ou em canteiro, longe de área mal drenada.', 'Embrapa Circ. Téc. 158 (2017) p.8; Boletim 362 EMATER-DF/CNPH (1981) p.17 do PDF'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'deficit_hidrico', 'Sem chuva, priorize a irrigação na formação da cabeça, que é a fase mais sensível. Regue sempre, sem deixar secar e depois encharcar, para a cabeça não rachar.', 'Embrapa Circ. Téc. 158 (2017) p.8; FAO Land & Water, Cabbage'),
((SELECT id FROM cultura WHERE nome = 'Repolho'), 'favoravel', 'Tempo ameno é o ideal para o repolho fechar a cabeça: siga com a irrigação regular. Faça a adubação de cobertura no tempo certo, aos 30 e aos 60 dias do transplante.', 'FAO Land & Water, Cabbage; Boletim 362 EMATER-DF/CNPH (1981) p.18 do PDF');

-- ============ El Niño e La Niña: o que costumam trazer para a região e o que fazer ============
-- No Sudeste e no Brasil Central o efeito na chuva é fraco ou incerto (Cemaden, NT 564/2023); o sinal
-- mais firme é na temperatura. Os textos dizem isso, sem prometer mais do que as fontes mostram.
-- Gerais (valem para todas as culturas)
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('El Nino', NULL, 'Na chuva o efeito é incerto na região (em alguns El Niños choveu menos, em outros mais); o mais comum é fazer mais calor que o normal.', 'Plante dentro da janela do ZARC e acompanhe a previsão do tempo antes de decidir. Se puder, planeje irrigação e faça seguro rural ou Proagro.', 'Cemaden, Nota Técnica 564/2023, item 25, p. 5; Guimarães e Reis (Embrapa Milho e Sorgo), O fenômeno ENOS e a temperatura no Brasil, p. 2-3; Embrapa, Nota Técnica El Niño 2026/2027 (163 medidas), p. 77-78, 82 e 85');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('La Nina', NULL, 'No Cerrado a La Niña não muda a chuva de forma certa, mas já atrasou o início das águas; costuma fazer um pouco menos de calor.', 'Plante dentro da janela do ZARC, mas só com boa umidade no solo. Escalone o plantio, usando cultivares de ciclos diferentes.', 'Embrapa Cerrados, La Niña: sua influência na próxima safra de soja do Centro-Oeste (2010), p. 1-2; Embrapa Arroz e Feijão, BPD 70 (2026), p. 9; Guimarães e Reis (Embrapa Milho e Sorgo), p. 3; Embrapa, Nota Técnica El Niño 2026/2027, p. 78');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('Neutro', NULL, 'Pacífico perto do normal, sem El Niño nem La Niña: não há sinal do Pacífico para esta safra.', 'Siga a janela do ZARC do seu município e acompanhe a previsão do tempo.', 'Embrapa, Nota Técnica El Niño 2026/2027 (163 medidas), p. 17 e 77-78');

-- Específicas por cultura
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('El Nino', (SELECT id FROM cultura WHERE nome = 'Soja'), 'Em estudo da Embrapa com chuvas de 1980 a 2013, o El Niño não mudou o início do plantio em Goiás, vizinho do Triângulo.', 'Siga a janela do ZARC normalmente. Escolha cultivar adaptada à região e de produção estável.', 'Embrapa Arroz e Feijão, Boletim de Pesquisa e Desenvolvimento 70 (2026), p. 8-10 e 14; Embrapa, Nota Técnica El Niño 2026/2027, p. 78 e 83');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('El Nino', (SELECT id FROM cultura WHERE nome = 'Café'), 'Se as chuvas da primavera atrasarem ou vierem falhadas, a florada pode sair desuniforme e o chumbinho pode cair.', 'Se tiver irrigação, priorize a água na florada, no pegamento e no enchimento dos grãos.', 'Embrapa, Nota Técnica El Niño 2026/2027 (163 medidas), seção 3.6, p. 61, e medida 4.11.2-3, p. 121');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('La Nina', (SELECT id FROM cultura WHERE nome = 'Soja'), 'Em Goiás, vizinho do Triângulo, a janela de plantio ficou 23% mais curta e a data ideal atrasou em anos de La Niña.', 'Se for plantar safrinha depois, prefira soja de ciclo mais curto. Escalone: comece pelas precoces e termine pelas de ciclo mais longo.', 'Embrapa Arroz e Feijão, Boletim de Pesquisa e Desenvolvimento 70 (2026), p. 10 e 14; Embrapa Cerrados, La Niña: sua influência na próxima safra de soja do Centro-Oeste (2010), p. 2');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('La Nina', (SELECT id FROM cultura WHERE nome = 'Milho'), 'Em anos de La Niña o solo fica mais seco no fim das águas, e o milho safrinha plantado tarde rende menos.', 'Plante a safrinha cedo, dentro da janela do ZARC, com milho de ciclo curto. Se a soja atrasou muito, avalie não plantar a safrinha.', 'Embrapa Arroz e Feijão, Boletim de Pesquisa e Desenvolvimento 70 (2026), p. 10 e 14 (estudo em GO, MT, TO e RO)');
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte) VALUES ('La Nina', (SELECT id FROM cultura WHERE nome = 'Sorgo'), 'Na safrinha de ano de La Niña o solo pode ficar mais seco.', 'O sorgo sofre menos com a falta de água e é uma boa opção de 2ª safra nesses anos.', 'Embrapa Arroz e Feijão, Boletim de Pesquisa e Desenvolvimento 70 (2026), p. 10 e 14 (estudo em GO, MT, TO e RO)');

-- Hortaliças (mesma orientação para todas; INSERT ... SELECT gera uma linha por cultura)
INSERT INTO orientacao_enso (fase, cultura_id, efeito, texto, fonte)
SELECT 'El Nino', id, 'Em ano de El Niño o calor e as ondas de calor ficam mais prováveis no Sudeste, e muitas hortaliças sofrem com isso.', 'Escalone os plantios e use cultivares que aguentam calor. Cuide bem da irrigação e mantenha o solo coberto.', 'Embrapa, Nota Técnica El Niño 2026/2027 (163 medidas), p. 40 e 106; Guimarães e Reis (Embrapa Milho e Sorgo), O fenômeno ENOS e a temperatura no Brasil, p. 2-3'
FROM cultura WHERE nome IN ('Alface','Couve','Brócolis','Repolho','Tomate','Pepino','Chuchu','Morango');
