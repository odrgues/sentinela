-- Sentinela — Conta de demonstração (rodar depois do 02 e do 03)
-- João (joao@exemplo.com, senha 123456) com 4 lavouras perto de Uberaba, como no canvas:
-- uma com aviso crítico, duas com atenção (uma delas o canteiro de morango, já em colheita)
-- e uma sem risco. A previsão e os avisos são fixos,
-- com datas a partir de hoje, para o painel ter o que mostrar sem depender do clima do dia.
--
-- Pode rodar de novo quantas vezes quiser (ex.: na manhã da apresentação): apaga o João e recria.
-- A rotina das 6h e "Editar lavoura" trocam esses dados pela previsão de verdade da Open-Meteo.
USE sentinela;
SET NAMES utf8mb4;

DELETE FROM usuario WHERE email = 'joao@exemplo.com';

INSERT INTO usuario (nome, email, senha_hash, whatsapp_numero, avisos_whatsapp)
VALUES ('João', 'joao@exemplo.com', '$2a$10$LS0MO7dxEemCv1Nd3CgjI.jLlOwCy98W0iwNUWO57wFPahXX/MQtq',
        '+5534999999999', TRUE);
SET @joao = LAST_INSERT_ID();
SET @uberaba = (SELECT id FROM municipio WHERE nome = 'Uberaba' AND uf = 'MG');

-- "na quinta (29/10)": o mesmo formato que o backend grava nos avisos.
SET @hoje = CURDATE();

-- 1. As lavouras
INSERT INTO cultivo (usuario_id, municipio_id, cultura_id, apelido, area_ha, latitude, longitude,
                     data_plantio, data_colheita_prevista, previsao_disponivel, previsao_atualizada_em)
VALUES
    (@joao, @uberaba, (SELECT id FROM cultura WHERE nome = 'Soja'), 'Talhão do fundo', 12, -19.747812, -47.931804,
     @hoje - INTERVAL 45 DAY, @hoje - INTERVAL 45 DAY + INTERVAL 120 DAY, TRUE, NOW());
SET @soja = LAST_INSERT_ID();

INSERT INTO cultivo (usuario_id, municipio_id, cultura_id, apelido, area_ha, latitude, longitude,
                     data_plantio, data_colheita_prevista, previsao_disponivel, previsao_atualizada_em)
VALUES
    (@joao, @uberaba, (SELECT id FROM cultura WHERE nome = 'Milho'), 'Roça da baixada', 8, -19.775104, -47.901772,
     @hoje - INTERVAL 20 DAY, @hoje - INTERVAL 20 DAY + INTERVAL 120 DAY, TRUE, NOW());
SET @milho = LAST_INSERT_ID();

INSERT INTO cultivo (usuario_id, municipio_id, cultura_id, apelido, area_ha, latitude, longitude,
                     data_plantio, data_colheita_prevista, previsao_disponivel, previsao_atualizada_em)
VALUES
    (@joao, @uberaba, (SELECT id FROM cultura WHERE nome = 'Feijão'), 'Feijão da horta', 0.5, -19.761002, -47.915233,
     @hoje - INTERVAL 12 DAY, @hoje - INTERVAL 12 DAY + INTERVAL 90 DAY, TRUE, NOW());
SET @feijao = LAST_INSERT_ID();

-- Morango de 500 m² plantado em maio: no fim de outubro está na fase de colheita (do dia 70 ao 220).
INSERT INTO cultivo (usuario_id, municipio_id, cultura_id, apelido, area_ha, latitude, longitude,
                     data_plantio, data_colheita_prevista, previsao_disponivel, previsao_atualizada_em)
VALUES
    (@joao, @uberaba, (SELECT id FROM cultura WHERE nome = 'Morango'), 'Canteiro de morango', 0.05, -19.755390, -47.922610,
     @hoje - INTERVAL 160 DAY, @hoje - INTERVAL 160 DAY + INTERVAL 70 DAY, TRUE, NOW());
SET @morango = LAST_INSERT_ID();

-- 2. Previsão dos 7 dias (weather_code da Open-Meteo: 0 céu limpo, 1-2 poucas nuvens, 3 nublado, 61 chuva)
-- Soja: semana de calor forte, com máximas de 35,1 °C em média (o limite é 35 °C) e pico de 37 °C
-- no 4º dia, e só 22 mm de chuva.
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@soja, @hoje,                     21, 34,  0,  0),
(@soja, @hoje + INTERVAL 1 DAY,    21, 35,  0,  0),
(@soja, @hoje + INTERVAL 2 DAY,    22, 36,  0,  1),
(@soja, @hoje + INTERVAL 3 DAY,    22, 37,  0,  0),
(@soja, @hoje + INTERVAL 4 DAY,    23, 36,  0,  1),
(@soja, @hoje + INTERVAL 5 DAY,    22, 35,  4,  3),
(@soja, @hoje + INTERVAL 6 DAY,    21, 33, 18, 61);

-- Milho: temperatura boa, mas só 12 mm na semana (o mínimo é 29,4 mm).
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@milho, @hoje,                    20, 31,  0,  1),
(@milho, @hoje + INTERVAL 1 DAY,   21, 32,  0,  0),
(@milho, @hoje + INTERVAL 2 DAY,   21, 33,  0,  0),
(@milho, @hoje + INTERVAL 3 DAY,   21, 33,  2,  2),
(@milho, @hoje + INTERVAL 4 DAY,   20, 31,  0,  1),
(@milho, @hoje + INTERVAL 5 DAY,   20, 30,  4,  3),
(@milho, @hoje + INTERVAL 6 DAY,   19, 29,  6, 61);

-- Feijão: tudo dentro do ideal (18 a 30 °C de média e 31 mm na semana).
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@feijao, @hoje,                   18, 29,  0,  1),
(@feijao, @hoje + INTERVAL 1 DAY,  18, 29,  0,  2),
(@feijao, @hoje + INTERVAL 2 DAY,  19, 28,  5, 61),
(@feijao, @hoje + INTERVAL 3 DAY,  19, 27,  8, 61),
(@feijao, @hoje + INTERVAL 4 DAY,  18, 29,  0,  1),
(@feijao, @hoje + INTERVAL 5 DAY,  18, 28,  6,  3),
(@feijao, @hoje + INTERVAL 6 DAY,  17, 27, 12, 61);

-- Morango: sem passar de 30 °C, mas com média de 25,1 °C, acima do ideal de 15 a 25 °C; 18 mm de chuva.
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@morango, @hoje,                  21, 30,  0,  1),
(@morango, @hoje + INTERVAL 1 DAY, 21, 30,  3, 61),
(@morango, @hoje + INTERVAL 2 DAY, 20, 29,  5, 61),
(@morango, @hoje + INTERVAL 3 DAY, 21, 30,  0,  1),
(@morango, @hoje + INTERVAL 4 DAY, 22, 30,  4,  3),
(@morango, @hoje + INTERVAL 5 DAY, 20, 29,  6, 61),
(@morango, @hoje + INTERVAL 6 DAY, 20, 28,  0,  2);

-- 3. Avisos da semana, iguais aos que o classificador do backend gera para essa previsão
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@soja, 'calor', 'critico',
 CONCAT('Semana de calor forte: máximas de 35,1 °C em média, acima do limite de 35 °C para soja. O pico é de 37 °C ',
        ELT(DAYOFWEEK(@hoje + INTERVAL 3 DAY), 'no domingo', 'na segunda', 'na terça', 'na quarta', 'na quinta', 'na sexta', 'no sábado'),
        ' (', DATE_FORMAT(@hoje + INTERVAL 3 DAY, '%d/%m'), ').'),
 @hoje + INTERVAL 3 DAY),
(@soja, 'deficit_hidrico', 'atencao',
 'Pouca chuva: só 22 mm previstos na semana. O mínimo para soja é 26,5 mm.', @hoje),
(@milho, 'deficit_hidrico', 'atencao',
 'Pouca chuva: só 12 mm previstos na semana. O mínimo para milho é 29,4 mm.', @hoje),
(@feijao, 'favoravel', 'info',
 'Tudo certo esta semana: chuva e temperatura dentro do ideal para feijão.', @hoje),
(@morango, 'calor', 'atencao',
 'Semana mais quente que o ideal para morango: média de 25,1 °C, acima de 25 °C.', @hoje);

-- 4. Histórico da soja: avisos das semanas anteriores
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@soja, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje - INTERVAL 7 DAY),
(@soja, 'chuva_excessiva', 'atencao', 'Chuva demais: 52 mm previstos na semana. O máximo para soja é 47,1 mm.', @hoje - INTERVAL 14 DAY),
(@soja, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje - INTERVAL 21 DAY),
(@soja, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 18 mm previstos na semana. O mínimo para soja é 26,5 mm.', @hoje - INTERVAL 28 DAY),
(@soja, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje - INTERVAL 35 DAY),
(@soja, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje - INTERVAL 42 DAY);

-- 5. Conversa de exemplo no WhatsApp
INSERT INTO mensagem (usuario_id, chat_id, direcao, conteudo, intencao) VALUES
(@joao, '+5534999999999', 'recebida', 'oi, como está minha lavoura essa semana?', 'consulta_alertas'),
(@joao, '+5534999999999', 'enviada',
 'Olá, João! No Talhão do fundo (soja), o calor passa do limite de 35 °C nesta semana. A Roça da baixada (milho) vai ter pouca chuva. O Feijão da horta está com tudo dentro do ideal.',
 NULL);
