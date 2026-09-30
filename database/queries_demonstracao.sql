USE sentinela;

-- 1) Contagem de registros por tabela
SELECT 'usuario' AS tabela, COUNT(*) AS total FROM usuario
UNION ALL SELECT 'municipio', COUNT(*) FROM municipio
UNION ALL SELECT 'cultura', COUNT(*) FROM cultura
UNION ALL SELECT 'fase_enso', COUNT(*) FROM fase_enso
UNION ALL SELECT 'cultivo', COUNT(*) FROM cultivo
UNION ALL SELECT 'alerta', COUNT(*) FROM alerta
UNION ALL SELECT 'mensagem', COUNT(*) FROM mensagem;


-- 2) Cultivos com produtor, município e cultura (JOIN)
SELECT c.apelido, u.nome AS produtor, m.nome AS municipio, m.uf,
       cu.nome AS cultura, c.data_plantio, c.data_colheita_prevista, c.status
FROM cultivo c
JOIN usuario u  ON u.id = c.usuario_id
JOIN municipio m ON m.id = c.municipio_id
JOIN cultura cu  ON cu.id = c.cultura_id
ORDER BY c.data_plantio;


-- 3) Alertas de cada cultivo (JOIN) - relação entre cultivo e alerta e mostro a mensagem
SELECT c.apelido, a.tipo, a.severidade, a.data_prevista, a.mensagem
FROM alerta a
JOIN cultivo c ON c.id = a.cultivo_id
ORDER BY c.apelido, a.data_prevista;


-- 4) Fase do ENSO por ano
SELECT ano, mes, fase, intensidade, indice
FROM fase_enso
WHERE ano = 2026
ORDER BY mes;


-- 5) Mensagens do agente com vínculo de usuário (LEFT JOIN)
SELECT m.chat_id, u.nome AS produtor_vinculado, m.direcao, m.conteudo,
       m.intencao, m.registrado_em
FROM mensagem m
LEFT JOIN usuario u ON u.id = m.usuario_id
ORDER BY m.chat_id, m.registrado_em;


-- 6) Faixas climáticas por cultura x cultivos em andamento (JOIN + GROUP BY)
SELECT cu.nome AS cultura, cu.temp_critica_baixa_c, cu.temp_critica_alta_c,
       cu.chuva_sem_min_mm, cu.chuva_sem_max_mm, COUNT(c.id) AS cultivos_em_andamento
FROM cultura cu
JOIN cultivo c ON c.cultura_id = cu.id AND c.status = 'em_andamento'
GROUP BY cu.id, cu.nome, cu.temp_critica_baixa_c, cu.temp_critica_alta_c,
         cu.chuva_sem_min_mm, cu.chuva_sem_max_mm;
