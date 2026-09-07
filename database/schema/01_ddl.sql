-- Sentinela — Script de criação do banco
-- Projetos Integrados 2 (VIA231) — Jessica Rodrigues e Larissa Miuki
-- MySQL 8.0.16 ou superior (CHECK só é aplicado a partir dessa versão)


CREATE TABLE usuario (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(120) NOT NULL,
    email       VARCHAR(160) NOT NULL UNIQUE,
    senha_hash  VARCHAR(255) NOT NULL,
    telegram_chat_id VARCHAR(32) UNIQUE,     -- id da conversa no Telegram
    criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    ciclo_dias            INT NOT NULL,
    temp_min_ideal_c      DECIMAL(4,1) NOT NULL,
    temp_max_ideal_c      DECIMAL(4,1) NOT NULL,
    temp_critica_baixa_c  DECIMAL(4,1) NOT NULL,
    temp_critica_alta_c   DECIMAL(4,1) NOT NULL,
    chuva_sem_min_mm      DECIMAL(5,1) NOT NULL,
    chuva_sem_max_mm      DECIMAL(5,1) NOT NULL,
    fonte                 VARCHAR(200),        -- de onde vieram as faixas
    observacao            TEXT,
    CHECK (ciclo_dias > 0),
    CHECK (temp_min_ideal_c < temp_max_ideal_c),
    CHECK (chuva_sem_min_mm < chuva_sem_max_mm)
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
    area_ha                 DECIMAL(10,2),
    data_plantio            DATE NOT NULL,
    data_colheita_prevista  DATE NOT NULL,
    status                  VARCHAR(20) NOT NULL DEFAULT 'em_andamento',
    criado_em               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (usuario_id, apelido),
    FOREIGN KEY (usuario_id)   REFERENCES usuario(id),
    FOREIGN KEY (municipio_id) REFERENCES municipio(id),
    FOREIGN KEY (cultura_id)   REFERENCES cultura(id),
    CHECK (status IN ('em_andamento', 'colhido', 'perdido')),
    CHECK (area_ha IS NULL OR area_ha > 0)
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

-- Histórico das conversas do agente no Telegram
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
