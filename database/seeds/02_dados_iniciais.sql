-- Sentinela — Dados iniciais: municípios, culturas, série do El Niño e o administrador
-- Rodar depois do 01_ddl.sql. Os textos de "O que fazer" e as fases estão no 03_orientacoes.sql;
-- a conta de demonstração, no 04_demonstracao.sql.
USE sentinela;

-- Configuração da sessão para UTF-8 completo (evita corrupção de acentos)
SET NAMES utf8mb4;

-- 1. Administrador: o único que cadastra culturas pela API (Postman). Senha: admin123
INSERT INTO usuario (nome, email, senha_hash, papel)
VALUES ('Administrador do Sentinela', 'admin@sentinela.com',
        '$2a$10$YolqDkXcxh6Ej9m4pJRHFOYCxYBpmmB5Df1.GGZw6PX7Y1g54SM0a', 'admin');

-- 2. Municípios (Com coordenadas geográficas). Outros entram sozinhos quando alguém marca uma lavoura no mapa.
INSERT INTO municipio (nome, uf, latitude, longitude)
VALUES
    ('Uberlândia',     'MG', -18.9186, -48.2772),
    ('Uberaba',        'MG', -19.7478, -47.9318),
    ('Araguari',       'MG', -18.6473, -48.1872),
    ('Patos de Minas', 'MG', -18.5789, -46.5181),
    ('Araxá',          'MG', -19.5902, -46.9438),
    ('Ituiutaba',      'MG', -18.9772, -49.4639),
    ('Patrocínio',     'MG', -18.9386, -46.9925),
    ('Frutal',         'MG', -20.0248, -48.9406),
    ('Monte Carmelo',  'MG', -18.7244, -47.4987),
    ('Belo Horizonte', 'MG', -19.9167, -43.9345);

-- 3. Culturas (Catálogo Agronômico). Faixas da especificação da API, seções Culturas e Culturas novas.
-- Chuva por semana = necessidade do ciclo (ou do ano, nas perenes) ÷ (ciclo ÷ 7).
INSERT INTO cultura
(nome, tipo_ciclo, ciclo_dias, temp_min_ideal_c, temp_max_ideal_c, temp_critica_baixa_c,
 temp_critica_alta_c, chuva_sem_min_mm, chuva_sem_max_mm, fonte, observacao)
VALUES
    ('Feijão', 'anual', 90, 18.0, 30.0, 12.0, 35.0, 20.0, 45.0,
     'Embrapa — Agência de Informação Tecnológica, Feijão / Clima',
     'Limites semanais de chuva derivados do total do ciclo.'),
    ('Milho', 'anual', 120, 24.0, 30.0, 10.0, 35.0, 29.4, 47.1,
     'Embrapa — Agência de Informação Tecnológica, Milho / Clima',
     'Limites semanais de chuva derivados do total do ciclo.'),
    ('Soja', 'anual', 120, 20.0, 30.0, 10.0, 35.0, 26.5, 47.1,
     'Embrapa — Agência de Informação Tecnológica, Soja / Exigências Climáticas',
     'Limites semanais de chuva derivados do total do ciclo.'),
    ('Cana-de-açúcar', 'cana', 365, 22.0, 30.0, 0.0, 35.0, 28.8, 38.4,
     'Embrapa Agropecuária Oeste (COT 209/2015); MAPA ZARC Port. SPA 4/2026; Embrapa Semiárido (Alice 2015)',
     'Soca 12 meses; cana-planta de ano e meio 15-18 meses. Chuva 1500-2000 mm/ciclo anual.'),
    ('Algodão', 'anual', 180, 20.0, 30.0, 14.0, 38.0, 27.2, 50.6,
     'MAPA ZARC algodão herbáceo (Port. SPA 256/2023, DF); Embrapa Algodão (Comtec 301/2006)',
     'Herbáceo. ~170 d emergência-maturação + ~10 d até emergência. Chuva 700-1300 mm/ciclo.'),
    ('Sorgo', 'anual', 100, 21.0, 34.0, 16.0, 38.0, 26.6, 42.0,
     'Embrapa Milho e Sorgo (Sistema de Produção Cultivo do Sorgo); MAPA ZARC sorgo granifero MG (Port. 275/2026)',
     'Granífero. Ótima 33-34 °C; produtividade cai abaixo de 16 °C e acima de 38 °C. Consumo 380-600 mm/ciclo.'),
    ('Trigo', 'anual', 110, 15.0, 25.0, 5.0, 32.0, 8.6, 21.6,
     'Embrapa Trigo (CT 33/2018); Embrapa Cerrados (Doc. 32/1990); PAB 18(12) 1983 (Azzi); MAPA ZARC trigo sequeiro MG',
     'Sequeiro do Cerrado, semeadura 15/03-05/04. Temperaturas de trigo tropical irrigado; chuva de Azzi (1942). Fonte fraca: revisar.'),
    ('Arroz', 'anual', 110, 20.0, 35.0, 15.0, 35.0, 29.5, 53.3,
     'MAPA ZARC arroz sequeiro MG (Port. 28/2022); Embrapa Arroz e Feijão (Circ. Téc. 36/2000, CT 230/2017); CBAgro 2023',
     'Terras altas. Esterilidade acima de 35 °C e abaixo de 15-19 °C. Chuva: mín. cultivar ciclo curto, máx. cultivar moderna.');

-- Café: perene com safra. A colheita vai de maio a agosto.
INSERT INTO cultura
(nome, tipo_ciclo, ciclo_dias, mes_inicio_colheita, mes_fim_colheita, temp_min_ideal_c, temp_max_ideal_c,
 temp_critica_baixa_c, temp_critica_alta_c, chuva_sem_min_mm, chuva_sem_max_mm, fonte, observacao)
VALUES
    ('Café', 'perene', 365, 5, 8, 18.0, 22.0, 1.0, 34.0, 23.0, 34.5,
     'Embrapa Cerrados (Comtec 35); Embrapa Café/IAC/EPAMIG (Simp. Cafés, Guaxupé); MAPA Port. 58/2005',
     'Arábica. Ideal = média anual. Geada: abrigo < 1 °C. Chuva 1200-1800 mm/ano. Colheita mai-ago.');

-- 4. Fases ENSO: ONI oficial da NOAA (oni.ascii.txt, atualizado em 03/10/2026), jan/2015 a ago/2026.
-- Cada temporada de 3 meses vai para o mês do meio. Índice >= +0,5 El Niño, <= -0,5 La Niña.
-- Atualizar uma vez por mês, depois do dia 5: acrescentar o mês novo e revisar os 2 anteriores.
INSERT INTO fase_enso (ano, mes, fase, intensidade, indice) VALUES
(2015,1,'El Nino','fraco',0.73),(2015,2,'El Nino','fraco',0.65),(2015,3,'El Nino','fraco',0.72),(2015,4,'El Nino','fraco',0.86),
(2015,5,'El Nino','moderado',1.04),(2015,6,'El Nino','moderado',1.19),(2015,7,'El Nino','moderado',1.44),(2015,8,'El Nino','forte',1.73),
(2015,9,'El Nino','muito forte',2.02),(2015,10,'El Nino','muito forte',2.28),(2015,11,'El Nino','muito forte',2.45),(2015,12,'El Nino','muito forte',2.59),
(2016,1,'El Nino','muito forte',2.50),(2016,2,'El Nino','muito forte',2.21),(2016,3,'El Nino','forte',1.69),(2016,4,'El Nino','moderado',1.11),
(2016,5,'El Nino','fraco',0.57),(2016,6,'Neutro',NULL,0.09),(2016,7,'Neutro',NULL,-0.19),(2016,8,'Neutro',NULL,-0.34),
(2016,9,'Neutro',NULL,-0.42),(2016,10,'La Nina','fraco',-0.51),(2016,11,'Neutro',NULL,-0.49),(2016,12,'Neutro',NULL,-0.37),
(2017,1,'Neutro',NULL,-0.08),(2017,2,'Neutro',NULL,0.08),(2017,3,'Neutro',NULL,0.27),(2017,4,'Neutro',NULL,0.32),
(2017,5,'Neutro',NULL,0.35),(2017,6,'Neutro',NULL,0.32),(2017,7,'Neutro',NULL,0.14),(2017,8,'Neutro',NULL,-0.07),
(2017,9,'Neutro',NULL,-0.23),(2017,10,'Neutro',NULL,-0.44),(2017,11,'La Nina','fraco',-0.61),(2017,12,'La Nina','fraco',-0.76),
(2018,1,'La Nina','fraco',-0.71),(2018,2,'La Nina','fraco',-0.67),(2018,3,'La Nina','fraco',-0.55),(2018,4,'Neutro',NULL,-0.35),
(2018,5,'Neutro',NULL,-0.07),(2018,6,'Neutro',NULL,0.13),(2018,7,'Neutro',NULL,0.20),(2018,8,'Neutro',NULL,0.30),
(2018,9,'El Nino','fraco',0.52),(2018,10,'El Nino','fraco',0.82),(2018,11,'El Nino','moderado',1.04),(2018,12,'El Nino','moderado',1.05),
(2019,1,'El Nino','fraco',0.99),(2019,2,'El Nino','fraco',0.94),(2019,3,'El Nino','fraco',0.87),(2019,4,'El Nino','fraco',0.82),
(2019,5,'El Nino','fraco',0.71),(2019,6,'El Nino','fraco',0.59),(2019,7,'Neutro',NULL,0.38),(2019,8,'Neutro',NULL,0.20),
(2019,9,'Neutro',NULL,0.31),(2019,10,'El Nino','fraco',0.51),(2019,11,'El Nino','fraco',0.72),(2019,12,'El Nino','fraco',0.75),
(2020,1,'El Nino','fraco',0.71),(2020,2,'El Nino','fraco',0.66),(2020,3,'El Nino','fraco',0.57),(2020,4,'Neutro',NULL,0.33),
(2020,5,'Neutro',NULL,0.04),(2020,6,'Neutro',NULL,-0.18),(2020,7,'Neutro',NULL,-0.29),(2020,8,'Neutro',NULL,-0.43),
(2020,9,'La Nina','fraco',-0.77),(2020,10,'La Nina','moderado',-1.00),(2020,11,'La Nina','moderado',-1.11),(2020,12,'La Nina','moderado',-1.06),
(2021,1,'La Nina','fraco',-0.99),(2021,2,'La Nina','fraco',-0.85),(2021,3,'La Nina','fraco',-0.74),(2021,4,'La Nina','fraco',-0.56),
(2021,5,'Neutro',NULL,-0.40),(2021,6,'Neutro',NULL,-0.31),(2021,7,'Neutro',NULL,-0.35),(2021,8,'Neutro',NULL,-0.46),
(2021,9,'La Nina','fraco',-0.64),(2021,10,'La Nina','fraco',-0.77),(2021,11,'La Nina','fraco',-0.91),(2021,12,'La Nina','fraco',-0.83),
(2022,1,'La Nina','fraco',-0.76),(2022,2,'La Nina','fraco',-0.68),(2022,3,'La Nina','fraco',-0.77),(2022,4,'La Nina','fraco',-0.86),
(2022,5,'La Nina','fraco',-0.83),(2022,6,'La Nina','fraco',-0.73),(2022,7,'La Nina','fraco',-0.70),(2022,8,'La Nina','fraco',-0.78),
(2022,9,'La Nina','fraco',-0.87),(2022,10,'La Nina','fraco',-0.89),(2022,11,'La Nina','fraco',-0.82),(2022,12,'La Nina','fraco',-0.70),
(2023,1,'La Nina','fraco',-0.55),(2023,2,'Neutro',NULL,-0.33),(2023,3,'Neutro',NULL,-0.11),(2023,4,'Neutro',NULL,0.19),
(2023,5,'Neutro',NULL,0.46),(2023,6,'El Nino','fraco',0.73),(2023,7,'El Nino','moderado',1.00),(2023,8,'El Nino','moderado',1.25),
(2023,9,'El Nino','forte',1.50),(2023,10,'El Nino','forte',1.74),(2023,11,'El Nino','forte',1.90),(2023,12,'El Nino','forte',1.99),
(2024,1,'El Nino','forte',1.84),(2024,2,'El Nino','forte',1.53),(2024,3,'El Nino','moderado',1.18),(2024,4,'El Nino','fraco',0.77),
(2024,5,'Neutro',NULL,0.43),(2024,6,'Neutro',NULL,0.18),(2024,7,'Neutro',NULL,0.06),(2024,8,'Neutro',NULL,-0.04),
(2024,9,'Neutro',NULL,-0.12),(2024,10,'Neutro',NULL,-0.19),(2024,11,'Neutro',NULL,-0.29),(2024,12,'Neutro',NULL,-0.43),
(2025,1,'Neutro',NULL,-0.46),(2025,2,'Neutro',NULL,-0.22),(2025,3,'Neutro',NULL,-0.08),(2025,4,'Neutro',NULL,0.02),
(2025,5,'Neutro',NULL,-0.04),(2025,6,'Neutro',NULL,-0.02),(2025,7,'Neutro',NULL,-0.11),(2025,8,'Neutro',NULL,-0.26),
(2025,9,'Neutro',NULL,-0.43),(2025,10,'La Nina','fraco',-0.57),(2025,11,'La Nina','fraco',-0.61),(2025,12,'La Nina','fraco',-0.60),
(2026,1,'Neutro',NULL,-0.39),(2026,2,'Neutro',NULL,-0.21),(2026,3,'Neutro',NULL,0.11),(2026,4,'Neutro',NULL,0.46),
(2026,5,'El Nino','fraco',0.95),(2026,6,'El Nino','moderado',1.39),(2026,7,'El Nino','forte',1.80),(2026,8,'El Nino','muito forte',2.16);

-- 5. Culturas da agricultura familiar (levantadas em 25/10/2026, números lidos nos PDFs originais).
-- Banana e goiaba são perenes sem safra fixa: ciclo_dias = dias até a primeira colheita.
-- Morango e chuchu têm colheita contínua: começa no dia inicio_colheita_dias e vai até ciclo_dias.
INSERT INTO cultura
(nome, tipo_ciclo, ciclo_dias, temp_min_ideal_c, temp_max_ideal_c, temp_critica_baixa_c,
 temp_critica_alta_c, chuva_sem_min_mm, chuva_sem_max_mm, fonte, observacao)
VALUES
    ('Banana', 'perene', 540, 26.0, 28.0, 10.0, 35.0, 23.1, 41.5,
     'Embrapa Mandioca e Fruticultura (500 Perguntas Banana, 2012, p. 22-24 e 29); Embrapa (Sist. Prod. Banana Pará, 2014); MAPA ZARC banana MG (Port. 276/2019); Epagri/Ciram (Chilling da bananeira, 2021, p. 2-3); Flori et al. (Ciênc. Agrotec. 32(3), 2008, Cristais Paulista-SP, 918 m)',
     'Ideal = ótima 26-28 °C (média). Chilling começa abaixo de 12 °C; mínima < 10 °C = frio forte (Epagri conta horas < 10 °C). Acima de 35 °C desidrata as folhas. 1ª colheita ~18 meses a 800-900 m.'),
    ('Goiaba', 'perene', 730, 23.0, 28.0, 3.0, 37.0, 15.4, 42.7,
     'Embrapa Semi-Árido (Frutas do Brasil 17, 2001, p. 24-27; Com. Técnico 112, 2001); Embrapa (Plantar 27, 1995; Plantar 66, 2010); Embrapa Clima Temperado (Doc. 283, 2009, p. 16: geada = mínima de abrigo < 3 °C); Epagri/Ciram (Riscos climáticos, 2017-2018)',
     'Ideal 23-28 °C. Acima de 37 °C aborta flores. Mínima do ar < 3 °C indica geada na planta: queima brotos; -4 °C mata plantas novas. Chuva: mín. 800 mm/ano ÷ 52; máx. 6,1 mm/dia × 7. Colheita com 2 anos.');

INSERT INTO cultura
(nome, tipo_ciclo, ciclo_dias, inicio_colheita_dias, temp_min_ideal_c, temp_max_ideal_c,
 temp_critica_baixa_c, temp_critica_alta_c, chuva_sem_min_mm, chuva_sem_max_mm, fonte, observacao)
VALUES
    ('Morango', 'continua', 220, 70, 15.0, 25.0, 3.0, 30.0, 14.0, 23.0,
     'Embrapa Clima Temperado (Morangueiro, 2016; Sist. Prod. 5, 2016; Com. Téc. 229, 2009; Doc. 283, 2009, p. 16-18); Epagri/Ciram (Riscos climáticos morango SC, 2017, p. 2-3); EPAMIG (Inf. Agropec. 236, 2007); Embrapa Hortaliças (Catálogo Bras. Hortaliças, 2010)',
     'Dias do transplante; colheita do dia 70 por ~5 meses. Mínima do ar < 3 °C indica geada na planta (flor aberta morre a -1 °C). Máxima > 30 °C: polinização falha (Epagri: média das máximas >= 27 °C já é alto risco).'),
    ('Chuchu', 'continua', 365, 105, 18.0, 27.0, 3.0, 28.0, 26.9, 42.3,
     'Embrapa Hortaliças (Circ. Téc. 139, 2015; Plantar 14, 1994; Instr. Téc. 5, 1983; Catálogo Bras. Hortaliças, 2010); Epagri/Ciram (Riscos climáticos chuchu SC, 2018, p. 3); Embrapa Clima Temperado (Doc. 283, 2009, p. 16)',
     'Colheita do dia 105 ao 365. Máxima > 28 °C: pólen inviável e queda de flores (a Epagri aplica 28 °C à média das máximas de 10 dias; no verão do Cerrado dispara). Mínima do ar < 3 °C: geada, que dizima a planta.');

-- 6. Hortaliças (levantadas em 25/10/2026). Além da Embrapa e do MAPA, alguns números vêm do IAC,
-- da Epagri e da FAO (Ecocrop), quando a Embrapa não dá o número; a coluna fonte diz qual.
INSERT INTO cultura
(nome, tipo_ciclo, ciclo_dias, inicio_colheita_dias, temp_min_ideal_c, temp_max_ideal_c,
 temp_critica_baixa_c, temp_critica_alta_c, chuva_sem_min_mm, chuva_sem_max_mm, fonte, observacao)
VALUES
    ('Tomate', 'continua', 160, 65, 18.0, 25.0, 3.0, 34.0, 18.2, 38.5,
     'MAPA (ZARC tomate, Port. SPA/MAPA 378/2026, p.1-2); Embrapa Hortaliças (Plantar 5, 1993, p.11-12; portal Tomate de mesa: Clima); IAC (Bol. Téc. 215, 2015, p.2); Embrapa Hortaliças (Irrigação por aspersão em hortaliças, 2017, Tab.18 p.77)',
     'Dias do transplante; colheita 65-160 d (IAC). Mín. crítica 3 °C no abrigo (ZARC). Máx. 34 °C = limite tolerado (Embrapa); flores já caem acima de 32 °C. Ideal = média 18-25 °C.'),
    ('Pepino', 'continua', 115, 45, 20.0, 30.0, 5.0, 38.0, 16.8, 35.7,
     'Embrapa Hortaliças (Circ. Téc. 113, 2013, p.3, p.15; Irrigação por aspersão em hortaliças, 2017, Tab.24 p.83); Pesq. Agrop. Gaúcha (Buriol et al., 2000, p.206-207); FAO Ecocrop (Cucumis sativus)',
     'Dias da semeadura direta; colheita 45-115 d. Não tolera geada: 5 °C no abrigo dá ~0 °C rente ao solo em noite de inversão. Máx. 38 °C é limite absoluto do Ecocrop (fonte FAO, sem número no Brasil).');

INSERT INTO cultura (nome, tipo_ciclo, ciclo_dias, inicio_colheita_dias, temp_min_ideal_c, temp_max_ideal_c, temp_critica_baixa_c, temp_critica_alta_c, chuva_sem_min_mm, chuva_sem_max_mm, fonte, observacao) VALUES
('Alface', 'anual', 60, NULL, 15, 25, 3, 35, 20, 39,
 'Catálogo Bras. Hortaliças (Embrapa/SEBRAE 2010) p.13; Lima et al. 2025, Embrapa Hortaliças, Cad. Pedagógico 22(11) p.4-5,11; Embrapa CT56 (2007) p.4; Embrapa CT158 (2017) p.19-21; Marouelli et al., Irrigação por aspersão em hortaliças (Embrapa 2008) Tab.7 p.61-62',
 'Dias do transplante (alface de verão: 50-70 d). Ideal = média 15-25 °C. 35 °C = Tmáx de vulnerabilidade muito alta (>30 já é alta). Mínima do ar < 3 °C indica geada (Embrapa Doc. 283); só tolera geada leve.');

INSERT INTO cultura (nome, tipo_ciclo, ciclo_dias, inicio_colheita_dias, temp_min_ideal_c, temp_max_ideal_c, temp_critica_baixa_c, temp_critica_alta_c, chuva_sem_min_mm, chuva_sem_max_mm, fonte, observacao) VALUES
('Couve', 'continua', 180, 80, 16, 22, 3, 28, 20, 39,
 'Trani et al., Bol. Téc. IAC 214 (2015) p.8, 26-27; Catálogo Bras. Hortaliças (Embrapa/SEBRAE 2010) p.29; Makishima, O cultivo de hortaliças (Embrapa 1993) p.12, 75; Embrapa CT158 (2017) p.8, 19-21; Marouelli et al. (Embrapa 2008) Tab.37 p.101',
 'Couve-manteiga; dias do transplante. Colhe de 80 d até 6 meses (pode ir a 8). Ideal = média 16-22 °C (IAC). 28 °C (IAC/Embrapa) vai disparar em dias quentes de verão. Mínima do ar < 3 °C: geada (Embrapa Doc. 283).');

INSERT INTO cultura (nome, tipo_ciclo, ciclo_dias, inicio_colheita_dias, temp_min_ideal_c, temp_max_ideal_c, temp_critica_baixa_c, temp_critica_alta_c, chuva_sem_min_mm, chuva_sem_max_mm, fonte, observacao) VALUES
('Brócolis', 'anual', 90, NULL, 15.0, 24.0, 3.0, 35.0, 23.0, 51.0,
 'Embrapa Coleção Plantar 74 Brócolis (2015) p.23-28; Embrapa Circ. Téc. 158 Irrigação no cultivo de brássicas (2017) p.7 e 19-21; Catálogo Bras. de Hortaliças (2010) p.22; FAO Ecocrop ficha 556 (ótimo 15-24 °C, absoluto 3-35 °C)',
 'Dias do transplante (muda de 30-35 d). Ideal 15-24 °C na média semanal (Plantar 74: 20-24 antes e 15-18 depois da cabeça). Crítica 3 °C: folha fica até 6 °C mais fria que o ar. 35 °C = máx. absoluta FAO. Água: 300-650 mm/ciclo.');

INSERT INTO cultura (nome, tipo_ciclo, ciclo_dias, inicio_colheita_dias, temp_min_ideal_c, temp_max_ideal_c, temp_critica_baixa_c, temp_critica_alta_c, chuva_sem_min_mm, chuva_sem_max_mm, fonte, observacao) VALUES
('Repolho', 'anual', 90, NULL, 15.0, 24.0, 3.0, 32.0, 23.0, 51.0,
 'Catálogo Bras. de Hortaliças Embrapa/Sebrae (2010) p.52; Embrapa Circ. Téc. 158 Irrigação no cultivo de brássicas (2017) p.7-8 e 19-21; FAO Ecocrop ficha 554 (ótimo 15-24 °C, absoluto 7-32 °C, letal -1 °C na fase jovem); FAO Land & Water, Cabbage',
 'Dias do transplante. Ideal 15-24 °C na média semanal. Crítica 3 °C: folha fica até 6 °C mais fria que o ar e muda nova morre a -1 °C. 32 °C = máx. absoluta FAO (média), pode avisar em dia muito quente. Água: 300-650 mm/ciclo.');
