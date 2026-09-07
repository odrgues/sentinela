-- Sentinela — Queries de demonstração do CP-1
-- Projetos Integrados 2 (VIA231) — Jessica Rodrigues e Larissa Miuki
-- Rodar com: USE sentinela;  antes das queries abaixo.

USE sentinela;

-- 1) Contagem de registros por tabela
-- Prova: as 7 tabelas exigidas existem e estão populadas com dados iniciais.
SELECT 'usuario' AS tabela, COUNT(*) AS total FROM usuario
UNION ALL SELECT 'municipio', COUNT(*) FROM municipio
UNION ALL SELECT 'cultura', COUNT(*) FROM cultura
UNION ALL SELECT 'fase_enso', COUNT(*) FROM fase_enso
UNION ALL SELECT 'cultivo', COUNT(*) FROM cultivo
UNION ALL SELECT 'alerta', COUNT(*) FROM alerta
UNION ALL SELECT 'mensagem', COUNT(*) FROM mensagem;


-- 2) Cultivos com produtor, município e cultura (JOIN)
-- Prova: os relacionamentos N:1 de cultivo com usuario, municipio e cultura funcionam.
SELECT c.apelido, u.nome AS produtor, m.nome AS municipio, m.uf,
       cu.nome AS cultura, c.data_plantio, c.data_colheita_prevista, c.status
FROM cultivo c
JOIN usuario u  ON u.id = c.usuario_id
JOIN municipio m ON m.id = c.municipio_id
JOIN cultura cu  ON cu.id = c.cultura_id
ORDER BY c.data_plantio;


-- 3) Alertas de cada cultivo (JOIN)
-- Prova: o relacionamento 1:N entre cultivo e alerta, e que os alertas trazem
-- tipo, severidade e mensagem em português conforme a regra 5.
SELECT c.apelido, a.tipo, a.severidade, a.data_prevista, a.mensagem
FROM alerta a
JOIN cultivo c ON c.id = a.cultivo_id
ORDER BY c.apelido, a.data_prevista;


-- 4) Fase do ENSO por ano
-- Prova: regra 9 — fase_enso é consultada só por ano e mês, sem FK e sem cálculo.
SELECT ano, mes, fase, intensidade, indice
FROM fase_enso
WHERE ano = 2026
ORDER BY mes;


-- 5) Mensagens do agente com vínculo de usuário (LEFT JOIN)
-- Prova: regra 11/12 — mensagem de chat vinculado mostra o produtor; mensagem
-- de chat não cadastrado mantém usuario_id nulo e ainda assim é salva.
SELECT m.chat_id, u.nome AS produtor_vinculado, m.direcao, m.conteudo,
       m.intencao, m.registrado_em
FROM mensagem m
LEFT JOIN usuario u ON u.id = m.usuario_id
ORDER BY m.chat_id, m.registrado_em;


-- 6) Faixas climáticas por cultura x cultivos em andamento (JOIN + GROUP BY)
-- Prova: regra 4 — só cultivo em_andamento é contado — e regra 5, mostrando
-- as faixas de temperatura e chuva que a avaliação usa para comparar com a previsão.
SELECT cu.nome AS cultura, cu.temp_critica_baixa_c, cu.temp_critica_alta_c,
       cu.chuva_sem_min_mm, cu.chuva_sem_max_mm, COUNT(c.id) AS cultivos_em_andamento
FROM cultura cu
JOIN cultivo c ON c.cultura_id = cu.id AND c.status = 'em_andamento'
GROUP BY cu.id, cu.nome, cu.temp_critica_baixa_c, cu.temp_critica_alta_c,
         cu.chuva_sem_min_mm, cu.chuva_sem_max_mm;
