-- Sentinela — Dados Iniciais Atualizados
USE sentinela;

-- Configuração da sessão para UTF-8 completo (evita corrupção de acentos)
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Usuários (Incluindo a coluna avisos_whatsapp = true)
INSERT INTO usuario (id, nome, email, senha_hash, whatsapp_numero, avisos_whatsapp)
VALUES
    (1, 'Jessica Rodrigues', 'jessicaRo@gmail.com', 'hashJessica1', '+5534991234501', true),
    (2, 'Larissa Miuki',     'LarissaMiu@gmail.com', 'hashLarissa1', '+5534991234502', true),
    (3, 'João Produtor',     'joao.produtor@exemplo.com', 'hashJoao1',  '+5534991234503', true);

-- 2. Municípios (Com coordenadas geográficas)
INSERT INTO municipio (id, nome, uf, latitude, longitude)
VALUES
    (1, 'Uberlândia',     'MG', -18.9186, -48.2772),
    (2, 'Uberaba',        'MG', -19.7478, -47.9318),
    (3, 'Araguari',       'MG', -18.6473, -48.1872),
    (4, 'Patos de Minas', 'MG', -18.5789, -46.5181),
    (5, 'Araxá',          'MG', -19.5902, -46.9438),
    (6, 'Ituiutaba',      'MG', -18.9772, -49.4639),
    (7, 'Patrocínio',     'MG', -18.9386, -46.9925),
    (8, 'Frutal',         'MG', -20.0248, -48.9406),
    (9, 'Monte Carmelo',  'MG', -18.7244, -47.4987),
    (10, 'Belo Horizonte', 'MG', -19.9167, -43.9345);

-- 3. Culturas (Catálogo Agronômico)
INSERT INTO cultura
(id, nome, ciclo_dias, temp_min_ideal_c, temp_max_ideal_c, temp_critica_baixa_c,
 temp_critica_alta_c, chuva_sem_min_mm, chuva_sem_max_mm, fonte, observacao)
VALUES
    (1, 'Feijão', 90, 18.0, 30.0, 12.0, 35.0, 20.0, 45.0,
     'Embrapa — Agência de Informação Tecnológica, Feijão / Clima',
     'Limites semanais de chuva derivados do total do ciclo.'),
    (2, 'Milho', 120, 24.0, 30.0, 10.0, 35.0, 29.4, 47.1,
     'Embrapa — Agência de Informação Tecnológica, Milho / Clima',
     'Limites semanais de chuva derivados do total do ciclo.'),
    (3, 'Soja', 120, 20.0, 30.0, 10.0, 35.0, 26.5, 47.1,
     'Embrapa — Agência de Informação Tecnológica, Soja / Exigências Climáticas',
     'Limites semanais de chuva derivados do total do ciclo.');

-- 4. Fases ENSO (Classificação mensal NOAA/CPC)
INSERT INTO fase_enso (ano, mes, fase, intensidade, indice) VALUES
                                                                (2025, 1,'La Nina','fraco',-0.60),(2025, 2,'La Nina','fraco',-0.55),
                                                                (2025, 3,'Neutro',NULL,-0.30),   (2025, 4,'Neutro',NULL,-0.10),
                                                                (2025, 5,'Neutro',NULL, 0.05),   (2025, 6,'Neutro',NULL, 0.10),
                                                                (2025, 7,'Neutro',NULL,-0.05),   (2025, 8,'Neutro',NULL,-0.25),
                                                                (2025, 9,'Neutro',NULL,-0.40),   (2025,10,'La Nina','fraco',-0.55),
                                                                (2025,11,'La Nina','fraco',-0.75),(2025,12,'La Nina','moderado',-1.05),
                                                                (2026, 1,'La Nina','moderado',-1.20),(2026, 2,'La Nina','fraco',-0.70),
                                                                (2026, 3,'La Nina','fraco',-0.55),(2026, 4,'Neutro',NULL,-0.35),
                                                                (2026, 5,'Neutro',NULL,-0.20),   (2026, 6,'Neutro',NULL,-0.10),
                                                                (2026, 7,'Neutro',NULL,-0.15),   (2026, 8,'Neutro',NULL,-0.30),
                                                                (2026, 9,'Neutro',NULL,-0.40),   (2026,10,'La Nina','fraco',-0.50),
                                                                (2026,11,'La Nina','fraco',-0.65),(2026,12,'La Nina','fraco',-0.80);

-- 5. Cultivos / Lavouras por Usuário
INSERT INTO cultivo
(id, usuario_id, municipio_id, cultura_id, apelido, area_ha, data_plantio, data_colheita_prevista, status)
VALUES
    (1, 1, 1, 1, 'Feijão da Fazenda',   12.50, '2026-08-10', '2026-11-08', 'em_andamento'),
    (2, 2, 4, 3, 'Soja Sagrada',        15.60, '2026-07-25', '2026-11-22', 'em_andamento'),
    (3, 3, 3, 2, 'Milho do milharal',   10.50, '2026-05-01', '2026-08-29', 'em_andamento'),
    (4, 3, 1, 1, 'Feijão da várzea',     8.00, '2026-09-10', '2026-12-09', 'em_andamento');

-- 6. Alertas Climáticos
INSERT INTO alerta (id, cultivo_id, tipo, severidade, mensagem, data_prevista)
VALUES
    (1, 1,'geada','critico','Mínima de 10,4 °C prevista. O feijão sofre dano abaixo de 12 °C.','2026-08-20'),
    (2, 1,'chuva_excessiva','atencao','61 mm acumulados nos próximos 7 dias, acima do limite de 45 mm para feijão.','2026-08-22'),
    (3, 2,'calor','critico','Máxima de 36,2 °C prevista, acima do limite de 35 °C para soja.','2026-08-18'),
    (4, 2,'deficit_hidrico','atencao','12 mm previstos na semana, abaixo do mínimo de 25 mm para soja.','2026-08-21'),
    (5, 3,'chuva_excessiva','atencao','58 mm acumulados nos próximos 7 dias, acima do limite de 50 mm para milho.','2026-08-19'),
    (6, 3,'favoravel','info','Chuva e temperatura dentro da faixa ideal para a cultura nesta semana.','2026-08-23'),
    (7, 4,'favoravel','info','Chuva e temperatura dentro da faixa ideal para a cultura nesta semana.','2026-09-15');

-- 7. Histórico do Agente de WhatsApp
INSERT INTO mensagem (id, usuario_id, chat_id, direcao, conteudo, intencao)
VALUES
    (1, 3,'+5534991234503','recebida','oi, como esta minha lavoura essa semana?','consulta_alertas'),
    (2, 3,'+5534991234503','enviada','Olá! Você tem 2 cultivos em andamento. No Milho do milharal, em Araguari, há 58 mm de chuva previstos nos próximos 7 dias, acima do limite para a cultura. O Feijão da várzea, em Uberlândia, está com condições favoráveis.',NULL),
    (3, 3,'+5534991234503','recebida','e a previsao pro feijao?','consulta_previsao'),
    (4, 3,'+5534991234503','enviada','Para Uberlândia nos próximos 7 dias: mínimas entre 14 e 19 °C, máximas entre 27 e 31 °C, e 8 mm de chuva no acumulado. Dentro da faixa ideal para o feijão.',NULL),
    (5, NULL,'+5534999998888','recebida','bom dia','saudacao'),
    (6, NULL,'+5534999998888','enviada','Bom dia! Não encontrei essa conta vinculada ao Sentinela. Cadastre-se pelo site e vincule seu WhatsApp para acompanhar seus cultivos por aqui.',NULL);