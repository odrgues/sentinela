-- Sentinela — Conta de demonstração com muitas lavouras (rodar depois do 02 e do 03, e depois de criar a conta)
-- Conta: sentinela.uniube@gmail.com (Marcos Oliveira), criada pelo site com estas 12 lavouras (cultura, cidade):
--   Talhão Soja Norte (Soja, Uberaba MG) · Milharal da Divisa (Milho, Uberlândia MG)
--   Fazenda Cerrado 2 (Soja, Rio Verde GO) · Algodão do Oeste (Algodão, Luís Eduardo Magalhães BA)
--   Feijão da Serra (Feijão, Guarapuava PR) · Trigal de Passo Fundo (Trigo, Passo Fundo RS)
--   Café do Cerrado Mineiro (Café, Patrocínio MG) · Canavial Ribeirão (Cana-de-açúcar, Ribeirão Preto SP)
--   Estufa de Morango (Morango, Campos do Jordão SP) · Tomate de Atibaia (Tomate, Atibaia SP)
--   Horta Hidropônica (Alface, Jundiaí SP) · Bananal do Vale (Banana, Registro SP)
-- Este script não cria a conta nem as lavouras: ele só troca a previsão e os avisos das lavouras dela por dados fixos
-- a partir de hoje, para o painel mostrar avisos críticos, de atenção e "tudo certo", e o histórico ter
-- semanas anteriores. Os avisos seguem as mesmas regras e os mesmos textos do backend.
--
-- Pode rodar de novo quantas vezes quiser (ex.: na manhã da apresentação, depois das 6h).
-- A rotina das 6h e "Editar lavoura" trocam esses dados pela previsão de verdade da Open-Meteo.
-- Rodar com: mysql ... --init-command="SET time_zone='-03:00'" sentinela < este arquivo
USE sentinela;
SET NAMES utf8mb4;

SET @hoje = CURDATE();
SET @u = (SELECT id FROM usuario WHERE email = 'sentinela.uniube@gmail.com');


-- Talhão Soja Norte (Soja)
SET @c0 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Talhão Soja Norte');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c0;
DELETE FROM previsao_diaria WHERE cultivo_id = @c0;
DELETE FROM alerta WHERE cultivo_id = @c0;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c0, @hoje + INTERVAL 0 DAY, 21, 35, 0, 0),
(@c0, @hoje + INTERVAL 1 DAY, 21, 36, 0, 0),
(@c0, @hoje + INTERVAL 2 DAY, 22, 37, 0, 1),
(@c0, @hoje + INTERVAL 3 DAY, 22, 37, 2, 0),
(@c0, @hoje + INTERVAL 4 DAY, 23, 36, 4, 1),
(@c0, @hoje + INTERVAL 5 DAY, 22, 35, 6, 3),
(@c0, @hoje + INTERVAL 6 DAY, 21, 34, 0, 2);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c0, 'calor', 'critico', CONCAT('Semana de calor forte: máximas de 35,7 °C em média, acima do limite de 35 °C para soja. O pico é de 37 °C ', CONCAT(ELT(DAYOFWEEK(@hoje + INTERVAL 2 DAY), 'no domingo', 'na segunda', 'na terça', 'na quarta', 'na quinta', 'na sexta', 'no sábado'), ' (', DATE_FORMAT(@hoje + INTERVAL 2 DAY, '%d/%m'), ')'), '.'), @hoje + INTERVAL 2 DAY),
(@c0, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 12 mm previstos na semana. O mínimo para soja é 26,5 mm.', @hoje + INTERVAL 0 DAY),
(@c0, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje - INTERVAL 7 DAY),
(@c0, 'frio', 'atencao', 'Semana mais fria que o ideal para soja: média de 18,5 °C, abaixo de 20 °C.', @hoje - INTERVAL 14 DAY),
(@c0, 'calor', 'atencao', 'Semana mais quente que o ideal para soja: média de 31,5 °C, acima de 30 °C.', @hoje - INTERVAL 21 DAY),
(@c0, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje - INTERVAL 28 DAY),
(@c0, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje - INTERVAL 35 DAY),
(@c0, 'frio', 'atencao', 'Semana mais fria que o ideal para soja: média de 17 °C, abaixo de 20 °C.', @hoje - INTERVAL 42 DAY);

-- Milharal da Divisa (Milho)
SET @c1 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Milharal da Divisa');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c1;
DELETE FROM previsao_diaria WHERE cultivo_id = @c1;
DELETE FROM alerta WHERE cultivo_id = @c1;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c1, @hoje + INTERVAL 0 DAY, 19, 25, 24, 61),
(@c1, @hoje + INTERVAL 1 DAY, 19, 26, 30, 61),
(@c1, @hoje + INTERVAL 2 DAY, 20, 27, 8, 3),
(@c1, @hoje + INTERVAL 3 DAY, 19, 28, 4, 2),
(@c1, @hoje + INTERVAL 4 DAY, 19, 29, 10, 61),
(@c1, @hoje + INTERVAL 5 DAY, 20, 29, 9, 61),
(@c1, @hoje + INTERVAL 6 DAY, 19, 28, 3, 1);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c1, 'frio', 'atencao', 'Semana mais fria que o ideal para milho: média de 23,4 °C, abaixo de 24 °C.', @hoje + INTERVAL 0 DAY),
(@c1, 'chuva_excessiva', 'atencao', 'Chuva demais: 88 mm previstos na semana. O máximo para milho é 47,1 mm.', @hoje + INTERVAL 0 DAY),
(@c1, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para milho.', @hoje - INTERVAL 7 DAY),
(@c1, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 19,4 mm previstos na semana. O mínimo para milho é 29,4 mm.', @hoje - INTERVAL 14 DAY),
(@c1, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para milho.', @hoje - INTERVAL 21 DAY),
(@c1, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para milho.', @hoje - INTERVAL 28 DAY),
(@c1, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 20,4 mm previstos na semana. O mínimo para milho é 29,4 mm.', @hoje - INTERVAL 35 DAY),
(@c1, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para milho.', @hoje - INTERVAL 42 DAY);

-- Fazenda Cerrado 2 (Soja)
SET @c2 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Fazenda Cerrado 2');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c2;
DELETE FROM previsao_diaria WHERE cultivo_id = @c2;
DELETE FROM alerta WHERE cultivo_id = @c2;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c2, @hoje + INTERVAL 0 DAY, 20, 29, 6, 61),
(@c2, @hoje + INTERVAL 1 DAY, 20, 30, 2, 1),
(@c2, @hoje + INTERVAL 2 DAY, 21, 31, 0, 0),
(@c2, @hoje + INTERVAL 3 DAY, 20, 30, 8, 61),
(@c2, @hoje + INTERVAL 4 DAY, 21, 32, 10, 61),
(@c2, @hoje + INTERVAL 5 DAY, 20, 31, 4, 3),
(@c2, @hoje + INTERVAL 6 DAY, 21, 30, 3, 1);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c2, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje + INTERVAL 0 DAY),
(@c2, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje - INTERVAL 7 DAY),
(@c2, 'calor', 'atencao', 'Semana mais quente que o ideal para soja: média de 31,5 °C, acima de 30 °C.', @hoje - INTERVAL 14 DAY),
(@c2, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje - INTERVAL 21 DAY),
(@c2, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje - INTERVAL 28 DAY),
(@c2, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 15,5 mm previstos na semana. O mínimo para soja é 26,5 mm.', @hoje - INTERVAL 35 DAY),
(@c2, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para soja.', @hoje - INTERVAL 42 DAY);

-- Algodão do Oeste (Algodão)
SET @c3 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Algodão do Oeste');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c3;
DELETE FROM previsao_diaria WHERE cultivo_id = @c3;
DELETE FROM alerta WHERE cultivo_id = @c3;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c3, @hoje + INTERVAL 0 DAY, 21, 33, 0, 0),
(@c3, @hoje + INTERVAL 1 DAY, 22, 34, 0, 0),
(@c3, @hoje + INTERVAL 2 DAY, 21, 35, 1, 1),
(@c3, @hoje + INTERVAL 3 DAY, 22, 36, 0, 0),
(@c3, @hoje + INTERVAL 4 DAY, 23, 36, 3, 2),
(@c3, @hoje + INTERVAL 5 DAY, 22, 35, 0, 0),
(@c3, @hoje + INTERVAL 6 DAY, 21, 34, 2, 3);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c3, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 6 mm previstos na semana. O mínimo para algodão é 27,2 mm.', @hoje + INTERVAL 0 DAY),
(@c3, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para algodão.', @hoje - INTERVAL 7 DAY),
(@c3, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 13,2 mm previstos na semana. O mínimo para algodão é 27,2 mm.', @hoje - INTERVAL 14 DAY),
(@c3, 'frio', 'atencao', 'Semana mais fria que o ideal para algodão: média de 18,5 °C, abaixo de 20 °C.', @hoje - INTERVAL 21 DAY),
(@c3, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para algodão.', @hoje - INTERVAL 28 DAY),
(@c3, 'calor', 'atencao', 'Semana mais quente que o ideal para algodão: média de 32 °C, acima de 30 °C.', @hoje - INTERVAL 35 DAY),
(@c3, 'calor', 'atencao', 'Semana mais quente que o ideal para algodão: média de 31,5 °C, acima de 30 °C.', @hoje - INTERVAL 42 DAY);

-- Feijão da Serra (Feijão)
SET @c4 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Feijão da Serra');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c4;
DELETE FROM previsao_diaria WHERE cultivo_id = @c4;
DELETE FROM alerta WHERE cultivo_id = @c4;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c4, @hoje + INTERVAL 0 DAY, 12, 17, 3, 3),
(@c4, @hoje + INTERVAL 1 DAY, 8, 16, 8, 61),
(@c4, @hoje + INTERVAL 2 DAY, 9, 18, 12, 61),
(@c4, @hoje + INTERVAL 3 DAY, 12, 20, 6, 3),
(@c4, @hoje + INTERVAL 4 DAY, 13, 21, 0, 1),
(@c4, @hoje + INTERVAL 5 DAY, 13, 22, 4, 2),
(@c4, @hoje + INTERVAL 6 DAY, 12, 20, 7, 3);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c4, 'geada', 'critico', CONCAT('Frio de 8 °C ', CONCAT(ELT(DAYOFWEEK(@hoje + INTERVAL 1 DAY), 'no domingo', 'na segunda', 'na terça', 'na quarta', 'na quinta', 'na sexta', 'no sábado'), ' (', DATE_FORMAT(@hoje + INTERVAL 1 DAY, '%d/%m'), ')'), ', abaixo do limite de 12 °C para feijão.'), @hoje + INTERVAL 1 DAY),
(@c4, 'geada', 'critico', CONCAT('Frio de 9 °C ', CONCAT(ELT(DAYOFWEEK(@hoje + INTERVAL 2 DAY), 'no domingo', 'na segunda', 'na terça', 'na quarta', 'na quinta', 'na sexta', 'no sábado'), ' (', DATE_FORMAT(@hoje + INTERVAL 2 DAY, '%d/%m'), ')'), ', abaixo do limite de 12 °C para feijão.'), @hoje + INTERVAL 2 DAY),
(@c4, 'frio', 'atencao', 'Semana mais fria que o ideal para feijão: média de 15,2 °C, abaixo de 18 °C.', @hoje + INTERVAL 0 DAY),
(@c4, 'frio', 'atencao', 'Semana mais fria que o ideal para feijão: média de 15 °C, abaixo de 18 °C.', @hoje - INTERVAL 7 DAY),
(@c4, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para feijão.', @hoje - INTERVAL 14 DAY),
(@c4, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para feijão.', @hoje - INTERVAL 21 DAY),
(@c4, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para feijão.', @hoje - INTERVAL 28 DAY),
(@c4, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para feijão.', @hoje - INTERVAL 35 DAY),
(@c4, 'chuva_excessiva', 'atencao', 'Chuva demais: 65 mm previstos na semana. O máximo para feijão é 45 mm.', @hoje - INTERVAL 42 DAY);

-- Trigal de Passo Fundo (Trigo)
SET @c5 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Trigal de Passo Fundo');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c5;
DELETE FROM previsao_diaria WHERE cultivo_id = @c5;
DELETE FROM alerta WHERE cultivo_id = @c5;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c5, @hoje + INTERVAL 0 DAY, 6, 17, 2, 3),
(@c5, @hoje + INTERVAL 1 DAY, 5, 18, 0, 1),
(@c5, @hoje + INTERVAL 2 DAY, 3, 19, 0, 0),
(@c5, @hoje + INTERVAL 3 DAY, 4, 21, 0, 0),
(@c5, @hoje + INTERVAL 4 DAY, 7, 22, 5, 3),
(@c5, @hoje + INTERVAL 5 DAY, 8, 23, 12, 61),
(@c5, @hoje + INTERVAL 6 DAY, 9, 24, 3, 3);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c5, 'geada', 'critico', CONCAT('Frio de 3 °C ', CONCAT(ELT(DAYOFWEEK(@hoje + INTERVAL 2 DAY), 'no domingo', 'na segunda', 'na terça', 'na quarta', 'na quinta', 'na sexta', 'no sábado'), ' (', DATE_FORMAT(@hoje + INTERVAL 2 DAY, '%d/%m'), ')'), '. Risco de geada para trigo, que sofre abaixo de 5 °C.'), @hoje + INTERVAL 2 DAY),
(@c5, 'geada', 'critico', CONCAT('Frio de 4 °C ', CONCAT(ELT(DAYOFWEEK(@hoje + INTERVAL 3 DAY), 'no domingo', 'na segunda', 'na terça', 'na quarta', 'na quinta', 'na sexta', 'no sábado'), ' (', DATE_FORMAT(@hoje + INTERVAL 3 DAY, '%d/%m'), ')'), '. Risco de geada para trigo, que sofre abaixo de 5 °C.'), @hoje + INTERVAL 3 DAY),
(@c5, 'frio', 'atencao', 'Semana mais fria que o ideal para trigo: média de 13,3 °C, abaixo de 15 °C.', @hoje + INTERVAL 0 DAY),
(@c5, 'chuva_excessiva', 'atencao', 'Chuva demais: 22 mm previstos na semana. O máximo para trigo é 21,6 mm.', @hoje + INTERVAL 0 DAY),
(@c5, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para trigo.', @hoje - INTERVAL 7 DAY),
(@c5, 'calor', 'atencao', 'Semana mais quente que o ideal para trigo: média de 27 °C, acima de 25 °C.', @hoje - INTERVAL 14 DAY),
(@c5, 'frio', 'atencao', 'Semana mais fria que o ideal para trigo: média de 14 °C, abaixo de 15 °C.', @hoje - INTERVAL 21 DAY),
(@c5, 'calor', 'atencao', 'Semana mais quente que o ideal para trigo: média de 27,5 °C, acima de 25 °C.', @hoje - INTERVAL 28 DAY),
(@c5, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para trigo.', @hoje - INTERVAL 35 DAY),
(@c5, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para trigo.', @hoje - INTERVAL 42 DAY);

-- Café do Cerrado Mineiro (Café)
SET @c6 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Café do Cerrado Mineiro');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c6;
DELETE FROM previsao_diaria WHERE cultivo_id = @c6;
DELETE FROM alerta WHERE cultivo_id = @c6;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c6, @hoje + INTERVAL 0 DAY, 18, 27, 6, 61),
(@c6, @hoje + INTERVAL 1 DAY, 19, 26, 4, 3),
(@c6, @hoje + INTERVAL 2 DAY, 18, 28, 3, 2),
(@c6, @hoje + INTERVAL 3 DAY, 19, 29, 7, 61),
(@c6, @hoje + INTERVAL 4 DAY, 19, 29, 2, 1),
(@c6, @hoje + INTERVAL 5 DAY, 19, 30, 5, 61),
(@c6, @hoje + INTERVAL 6 DAY, 19, 30, 3, 3);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c6, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para café.', @hoje + INTERVAL 0 DAY),
(@c6, 'chuva_excessiva', 'atencao', 'Chuva demais: 42,5 mm previstos na semana. O máximo para café é 34,5 mm.', @hoje - INTERVAL 7 DAY),
(@c6, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para café.', @hoje - INTERVAL 14 DAY),
(@c6, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 4 mm previstos na semana. O mínimo para café é 23 mm.', @hoje - INTERVAL 21 DAY),
(@c6, 'chuva_excessiva', 'atencao', 'Chuva demais: 48,5 mm previstos na semana. O máximo para café é 34,5 mm.', @hoje - INTERVAL 28 DAY),
(@c6, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 11 mm previstos na semana. O mínimo para café é 23 mm.', @hoje - INTERVAL 35 DAY),
(@c6, 'geada', 'critico', CONCAT('Frio de -1 °C ', CONCAT(ELT(DAYOFWEEK(@hoje - INTERVAL 40 DAY), 'no domingo', 'na segunda', 'na terça', 'na quarta', 'na quinta', 'na sexta', 'no sábado'), ' (', DATE_FORMAT(@hoje - INTERVAL 40 DAY, '%d/%m'), ')'), '. Risco de geada para café, que sofre abaixo de 1 °C.'), @hoje - INTERVAL 40 DAY);

-- Canavial Ribeirão (Cana-de-açúcar)
SET @c7 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Canavial Ribeirão');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c7;
DELETE FROM previsao_diaria WHERE cultivo_id = @c7;
DELETE FROM alerta WHERE cultivo_id = @c7;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c7, @hoje + INTERVAL 0 DAY, 21, 31, 4, 3),
(@c7, @hoje + INTERVAL 1 DAY, 21, 32, 0, 0),
(@c7, @hoje + INTERVAL 2 DAY, 22, 33, 0, 1),
(@c7, @hoje + INTERVAL 3 DAY, 22, 32, 2, 2),
(@c7, @hoje + INTERVAL 4 DAY, 22, 31, 0, 1),
(@c7, @hoje + INTERVAL 5 DAY, 21, 30, 8, 61),
(@c7, @hoje + INTERVAL 6 DAY, 21, 30, 3, 3);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c7, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 17 mm previstos na semana. O mínimo para cana-de-açúcar é 28,8 mm.', @hoje + INTERVAL 0 DAY),
(@c7, 'calor', 'atencao', 'Semana mais quente que o ideal para cana-de-açúcar: média de 31,5 °C, acima de 30 °C.', @hoje - INTERVAL 7 DAY),
(@c7, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para cana-de-açúcar.', @hoje - INTERVAL 14 DAY),
(@c7, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para cana-de-açúcar.', @hoje - INTERVAL 21 DAY),
(@c7, 'chuva_excessiva', 'atencao', 'Chuva demais: 54,4 mm previstos na semana. O máximo para cana-de-açúcar é 38,4 mm.', @hoje - INTERVAL 28 DAY),
(@c7, 'frio', 'atencao', 'Semana mais fria que o ideal para cana-de-açúcar: média de 19 °C, abaixo de 22 °C.', @hoje - INTERVAL 35 DAY),
(@c7, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para cana-de-açúcar.', @hoje - INTERVAL 42 DAY);

-- Estufa de Morango (Morango)
SET @c8 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Estufa de Morango');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c8;
DELETE FROM previsao_diaria WHERE cultivo_id = @c8;
DELETE FROM alerta WHERE cultivo_id = @c8;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c8, @hoje + INTERVAL 0 DAY, 11, 21, 12, 61),
(@c8, @hoje + INTERVAL 1 DAY, 12, 22, 18, 61),
(@c8, @hoje + INTERVAL 2 DAY, 12, 23, 6, 3),
(@c8, @hoje + INTERVAL 3 DAY, 13, 22, 9, 61),
(@c8, @hoje + INTERVAL 4 DAY, 12, 23, 4, 3),
(@c8, @hoje + INTERVAL 5 DAY, 11, 22, 10, 61),
(@c8, @hoje + INTERVAL 6 DAY, 12, 21, 5, 3);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c8, 'chuva_excessiva', 'atencao', 'Chuva demais: 64 mm previstos na semana. O máximo para morango é 23 mm.', @hoje + INTERVAL 0 DAY),
(@c8, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para morango.', @hoje - INTERVAL 7 DAY),
(@c8, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para morango.', @hoje - INTERVAL 14 DAY),
(@c8, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para morango.', @hoje - INTERVAL 21 DAY),
(@c8, 'chuva_excessiva', 'atencao', 'Chuva demais: 49 mm previstos na semana. O máximo para morango é 23 mm.', @hoje - INTERVAL 28 DAY),
(@c8, 'frio', 'atencao', 'Semana mais fria que o ideal para morango: média de 12 °C, abaixo de 15 °C.', @hoje - INTERVAL 35 DAY),
(@c8, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para morango.', @hoje - INTERVAL 42 DAY);

-- Tomate de Atibaia (Tomate)
SET @c9 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Tomate de Atibaia');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c9;
DELETE FROM previsao_diaria WHERE cultivo_id = @c9;
DELETE FROM alerta WHERE cultivo_id = @c9;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c9, @hoje + INTERVAL 0 DAY, 17, 26, 4, 3),
(@c9, @hoje + INTERVAL 1 DAY, 18, 27, 2, 3),
(@c9, @hoje + INTERVAL 2 DAY, 18, 27, 8, 61),
(@c9, @hoje + INTERVAL 3 DAY, 17, 26, 6, 61),
(@c9, @hoje + INTERVAL 4 DAY, 18, 28, 3, 3),
(@c9, @hoje + INTERVAL 5 DAY, 19, 28, 5, 2),
(@c9, @hoje + INTERVAL 6 DAY, 18, 27, 4, 3);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c9, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para tomate.', @hoje + INTERVAL 0 DAY),
(@c9, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 10,2 mm previstos na semana. O mínimo para tomate é 18,2 mm.', @hoje - INTERVAL 7 DAY),
(@c9, 'frio', 'atencao', 'Semana mais fria que o ideal para tomate: média de 15 °C, abaixo de 18 °C.', @hoje - INTERVAL 14 DAY),
(@c9, 'calor', 'atencao', 'Semana mais quente que o ideal para tomate: média de 26,5 °C, acima de 25 °C.', @hoje - INTERVAL 21 DAY),
(@c9, 'calor', 'atencao', 'Semana mais quente que o ideal para tomate: média de 27,5 °C, acima de 25 °C.', @hoje - INTERVAL 28 DAY),
(@c9, 'calor', 'atencao', 'Semana mais quente que o ideal para tomate: média de 27,5 °C, acima de 25 °C.', @hoje - INTERVAL 35 DAY),
(@c9, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para tomate.', @hoje - INTERVAL 42 DAY);

-- Horta Hidropônica (Alface)
SET @c10 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Horta Hidropônica');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c10;
DELETE FROM previsao_diaria WHERE cultivo_id = @c10;
DELETE FROM alerta WHERE cultivo_id = @c10;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c10, @hoje + INTERVAL 0 DAY, 19, 31, 3, 1),
(@c10, @hoje + INTERVAL 1 DAY, 20, 33, 0, 0),
(@c10, @hoje + INTERVAL 2 DAY, 19, 32, 5, 61),
(@c10, @hoje + INTERVAL 3 DAY, 20, 34, 0, 0),
(@c10, @hoje + INTERVAL 4 DAY, 21, 33, 4, 3),
(@c10, @hoje + INTERVAL 5 DAY, 20, 32, 2, 1),
(@c10, @hoje + INTERVAL 6 DAY, 20, 33, 6, 61);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c10, 'calor', 'atencao', 'Semana mais quente que o ideal para alface: média de 26,2 °C, acima de 25 °C.', @hoje + INTERVAL 0 DAY),
(@c10, 'frio', 'atencao', 'Semana mais fria que o ideal para alface: média de 12 °C, abaixo de 15 °C.', @hoje - INTERVAL 7 DAY),
(@c10, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para alface.', @hoje - INTERVAL 14 DAY),
(@c10, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 7 mm previstos na semana. O mínimo para alface é 20 mm.', @hoje - INTERVAL 21 DAY),
(@c10, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 9 mm previstos na semana. O mínimo para alface é 20 mm.', @hoje - INTERVAL 28 DAY),
(@c10, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para alface.', @hoje - INTERVAL 35 DAY),
(@c10, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para alface.', @hoje - INTERVAL 42 DAY);

-- Bananal do Vale (Banana)
SET @c11 = (SELECT id FROM cultivo WHERE usuario_id = @u AND apelido = 'Bananal do Vale');
UPDATE cultivo SET previsao_disponivel = TRUE, previsao_atualizada_em = NOW() WHERE id = @c11;
DELETE FROM previsao_diaria WHERE cultivo_id = @c11;
DELETE FROM alerta WHERE cultivo_id = @c11;
INSERT INTO previsao_diaria (cultivo_id, data, temp_min_c, temp_max_c, chuva_mm, codigo_tempo) VALUES
(@c11, @hoje + INTERVAL 0 DAY, 19, 28, 14, 61),
(@c11, @hoje + INTERVAL 1 DAY, 18, 27, 9, 61),
(@c11, @hoje + INTERVAL 2 DAY, 19, 29, 12, 3),
(@c11, @hoje + INTERVAL 3 DAY, 20, 30, 6, 61),
(@c11, @hoje + INTERVAL 4 DAY, 20, 31, 8, 3),
(@c11, @hoje + INTERVAL 5 DAY, 21, 32, 3, 1),
(@c11, @hoje + INTERVAL 6 DAY, 20, 30, 5, 61);
INSERT INTO alerta (cultivo_id, tipo, severidade, mensagem, data_prevista) VALUES
(@c11, 'chuva_excessiva', 'atencao', 'Chuva demais: 57 mm previstos na semana. O máximo para banana é 41,5 mm.', @hoje + INTERVAL 0 DAY),
(@c11, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para banana.', @hoje - INTERVAL 7 DAY),
(@c11, 'deficit_hidrico', 'atencao', 'Pouca chuva: só 6,1 mm previstos na semana. O mínimo para banana é 23,1 mm.', @hoje - INTERVAL 14 DAY),
(@c11, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para banana.', @hoje - INTERVAL 21 DAY),
(@c11, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para banana.', @hoje - INTERVAL 28 DAY),
(@c11, 'chuva_excessiva', 'atencao', 'Chuva demais: 73,5 mm previstos na semana. O máximo para banana é 41,5 mm.', @hoje - INTERVAL 35 DAY),
(@c11, 'favoravel', 'info', 'Tudo certo esta semana: chuva e temperatura dentro do ideal para banana.', @hoje - INTERVAL 42 DAY);
