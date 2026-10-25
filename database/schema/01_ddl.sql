-- Sentinela — Script de criação do banco
-- Projetos Integrados 2 (VIA231) — Jessica Rodrigues e Larissa Miuki
-- MySQL 8.0.16 ou superior (CHECK só é aplicado a partir dessa versão)


CREATE TABLE usuario (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nome             VARCHAR(120) NOT NULL,
    email            VARCHAR(160) NOT NULL UNIQUE,
    senha_hash       VARCHAR(255) NOT NULL,
    whatsapp_numero  VARCHAR(20) UNIQUE,              -- número do WhatsApp vinculado, formato E.164
    avisos_whatsapp  BOOLEAN NOT NULL DEFAULT TRUE,   -- comandos PARAR e VOLTAR do bot
    papel            VARCHAR(10) NOT NULL DEFAULT 'produtor',
    criado_em        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK (papel IN ('produtor', 'admin'))
);

-- Links de nova senha: guarda só o hash do código enviado por e-mail
CREATE TABLE redefinicao_senha (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id  INT NOT NULL,
    token_hash  CHAR(64) NOT NULL UNIQUE,   -- SHA-256 em hexadecimal
    expira_em   TIMESTAMP NOT NULL,
    usado_em    TIMESTAMP NULL,
    criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE municipio (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    nome       VARCHAR(120) NOT NULL,
    uf         CHAR(2) NOT NULL,
    latitude   DECIMAL(9,6) NOT NULL,
    longitude  DECIMAL(9,6) NOT NULL,
    UNIQUE (nome, uf)
);

CREATE TABLE cultura (
    id                    INT AUTO_INCREMENT PRIMARY KEY,
    nome                  VARCHAR(80) NOT NULL UNIQUE,
    tipo_ciclo            VARCHAR(10) NOT NULL DEFAULT 'anual',  -- regra da colheita prevista
    ciclo_dias            INT NOT NULL,              -- anual: até a colheita; contínua: até o fim da colheita; perene: até a 1ª colheita
    inicio_colheita_dias  INT NULL,                  -- contínua: dias do plantio até a colheita começar
    mes_inicio_colheita   INT NULL,                  -- perene com safra (café): mês em que a colheita começa
    mes_fim_colheita      INT NULL,
    temp_min_ideal_c      DECIMAL(4,1) NOT NULL,
    temp_max_ideal_c      DECIMAL(4,1) NOT NULL,
    temp_critica_baixa_c  DECIMAL(4,1) NOT NULL,
    temp_critica_alta_c   DECIMAL(4,1) NOT NULL,
    chuva_sem_min_mm      DECIMAL(5,1) NOT NULL,
    chuva_sem_max_mm      DECIMAL(5,1) NOT NULL,
    fonte                 VARCHAR(300) NOT NULL,   -- de onde vieram as faixas
    observacao            TEXT,
    CHECK (tipo_ciclo IN ('anual', 'cana', 'perene', 'continua')),
    CHECK (ciclo_dias > 0),
    CHECK (tipo_ciclo <> 'continua' OR inicio_colheita_dias BETWEEN 1 AND ciclo_dias),
    CHECK (mes_inicio_colheita IS NULL OR mes_inicio_colheita BETWEEN 1 AND 12),
    CHECK (mes_fim_colheita IS NULL OR mes_fim_colheita BETWEEN 1 AND 12),
    CHECK (temp_min_ideal_c < temp_max_ideal_c),
    CHECK (temp_critica_baixa_c <= temp_min_ideal_c),
    CHECK (temp_critica_alta_c >= temp_max_ideal_c),
    CHECK (chuva_sem_min_mm < chuva_sem_max_mm)
);

-- O que fazer em cada tipo de aviso. cultura_id nulo = vale para todas as culturas.
CREATE TABLE recomendacao (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    cultura_id   INT NULL,
    tipo_alerta  VARCHAR(25) NOT NULL,
    texto        TEXT NOT NULL,
    fonte        VARCHAR(300) NOT NULL,
    FOREIGN KEY (cultura_id) REFERENCES cultura(id),
    CHECK (tipo_alerta IN ('geada','frio','calor','chuva_excessiva','deficit_hidrico','favoravel'))
);

-- Fases do ciclo das culturas anuais, contadas em dias desde o plantio (ou o transplante)
CREATE TABLE fase_cultura (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    cultura_id   INT NOT NULL,
    nome         VARCHAR(60) NOT NULL,
    dia_inicio   INT NOT NULL,
    dia_fim      INT NOT NULL,
    orientacao   TEXT NOT NULL,
    fonte        VARCHAR(300) NOT NULL,
    UNIQUE (cultura_id, nome),
    FOREIGN KEY (cultura_id) REFERENCES cultura(id),
    CHECK (dia_inicio >= 0 AND dia_fim >= dia_inicio)
);

CREATE TABLE fase_enso (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    ano          INT NOT NULL,
    mes          INT NOT NULL,
    fase         VARCHAR(10) NOT NULL,
    intensidade  VARCHAR(15),
    indice       DECIMAL(4,2),
    UNIQUE (ano, mes),
    CHECK (mes BETWEEN 1 AND 12),
    CHECK (fase IN ('El Nino', 'La Nina', 'Neutro'))
);

CREATE TABLE cultivo (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id              INT NOT NULL,
    municipio_id            INT NOT NULL,
    cultura_id              INT NOT NULL,
    apelido                 VARCHAR(80) NOT NULL,
    area_ha                 DECIMAL(10,4),              -- 4 casas: uma horta de 50 m² é 0,005 ha
    latitude                DECIMAL(9,6) NOT NULL,      -- ponto exato marcado no mapa
    longitude               DECIMAL(9,6) NOT NULL,
    data_plantio            DATE NOT NULL,
    data_colheita_prevista  DATE NOT NULL,
    status                  VARCHAR(20) NOT NULL DEFAULT 'em_andamento',
    previsao_disponivel     BOOLEAN NOT NULL DEFAULT FALSE,  -- a última busca na Open-Meteo deu certo?
    previsao_atualizada_em  TIMESTAMP NULL,                  -- quando foi a última busca que deu certo
    criado_em               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, apelido),
    FOREIGN KEY (usuario_id)   REFERENCES usuario(id) ON DELETE CASCADE,
    FOREIGN KEY (municipio_id) REFERENCES municipio(id),
    FOREIGN KEY (cultura_id)   REFERENCES cultura(id),
    CHECK (status IN ('em_andamento', 'colhido', 'perdido')),
    CHECK (area_ha IS NULL OR area_ha > 0),
    CHECK (latitude BETWEEN -90 AND 90),
    CHECK (longitude BETWEEN -180 AND 180)
);

-- Previsão de 7 dias de cada cultivo, guardada pela rotina das 6h (o painel lê daqui)
CREATE TABLE previsao_diaria (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    cultivo_id     INT NOT NULL,
    data           DATE NOT NULL,
    temp_min_c     DECIMAL(4,1) NOT NULL,
    temp_max_c     DECIMAL(4,1) NOT NULL,
    chuva_mm       DECIMAL(5,1) NOT NULL,
    codigo_tempo   INT NOT NULL,              -- weather_code da Open-Meteo
    atualizado_em  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cultivo_id, data),
    FOREIGN KEY (cultivo_id) REFERENCES cultivo(id) ON DELETE CASCADE
);

CREATE TABLE alerta (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    cultivo_id     INT NOT NULL,
    tipo           VARCHAR(25) NOT NULL,
    severidade     VARCHAR(10) NOT NULL,
    mensagem       TEXT NOT NULL,
    data_prevista  DATE NOT NULL,
    gerado_em      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cultivo_id, tipo, data_prevista),
    FOREIGN KEY (cultivo_id) REFERENCES cultivo(id) ON DELETE CASCADE,
    CHECK (tipo IN ('geada','frio','calor','chuva_excessiva','deficit_hidrico','favoravel')),
    CHECK (severidade IN ('info','atencao','critico'))
);

-- Histórico das conversas do agente no WhatsApp
CREATE TABLE mensagem (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id   INT NULL,                    -- nulo quando o chat não é cadastrado
    chat_id      VARCHAR(32) NOT NULL,
    direcao      VARCHAR(10) NOT NULL,
    conteudo     TEXT NOT NULL,
    intencao     VARCHAR(30),
    registrado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE SET NULL,
    CHECK (direcao IN ('recebida','enviada')),
    CHECK (intencao IS NULL OR intencao IN
           ('saudacao','consulta_cultivos','consulta_previsao','consulta_alertas','nao_identificada'))
);

CREATE INDEX idx_cultivo_usuario_status ON cultivo (usuario_id, status);
CREATE INDEX idx_alerta_cultivo_data    ON alerta (cultivo_id, data_prevista);
CREATE INDEX idx_mensagem_chat_data     ON mensagem (chat_id, registrado_em);
