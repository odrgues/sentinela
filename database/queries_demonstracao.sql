USE sentinela;

-- 1) Contagem de registros por tabela
SELECT 'usuario' AS tabela, COUNT(*) AS total FROM usuario
UNION ALL SELECT 'municipio', COUNT(*) FROM municipio
UNION ALL SELECT 'cultura', COUNT(*) FROM cultura
UNION ALL SELECT 'recomendacao', COUNT(*) FROM recomendacao
UNION ALL SELECT 'fase_cultura', COUNT(*) FROM fase_cultura
UNION ALL SELECT 'fase_enso', COUNT(*) FROM fase_enso
UNION ALL SELECT 'cultivo', COUNT(*) FROM cultivo
UNION ALL SELECT 'previsao_diaria', COUNT(*) FROM previsao_diaria
UNION ALL SELECT 'alerta', COUNT(*) FROM alerta
UNION ALL SELECT 'mensagem', COUNT(*) FROM mensagem;


-- 2) Cultivos com produtor, município e cultura (JOIN)
SELECT c.apelido, u.nome AS produtor, m.nome AS municipio, m.uf,
       cu.nome AS cultura, cu.tipo_ciclo, c.area_ha, c.data_plantio, c.data_colheita_prevista, c.status
FROM cultivo c
JOIN usuario u  ON u.id = c.usuario_id
JOIN municipio m ON m.id = c.municipio_id
JOIN cultura cu  ON cu.id = c.cultura_id
ORDER BY c.data_plantio;


-- 3) Avisos da semana de cada cultivo, com o "O que fazer": o da cultura ou, sem ele, o genérico
SELECT c.apelido, a.tipo, a.severidade, a.data_prevista, a.mensagem,
       COALESCE(rc.texto, rg.texto) AS o_que_fazer
FROM alerta a
JOIN cultivo c ON c.id = a.cultivo_id
LEFT JOIN recomendacao rc ON rc.cultura_id = c.cultura_id AND rc.tipo_alerta = a.tipo
LEFT JOIN recomendacao rg ON rg.cultura_id IS NULL AND rg.tipo_alerta = a.tipo
WHERE a.data_prevista >= CURDATE()
ORDER BY c.apelido, FIELD(a.severidade, 'critico', 'atencao', 'info'), a.data_prevista;


-- 4) Em que fase do ciclo cada lavoura está hoje (dias desde o plantio dentro da fase)
SELECT c.apelido, cu.nome AS cultura, DATEDIFF(CURDATE(), c.data_plantio) AS dia_do_ciclo,
       f.nome AS fase, f.orientacao, f.fonte
FROM cultivo c
JOIN cultura cu ON cu.id = c.cultura_id
LEFT JOIN fase_cultura f ON f.cultura_id = c.cultura_id
     AND DATEDIFF(CURDATE(), c.data_plantio) BETWEEN f.dia_inicio AND f.dia_fim
WHERE c.status = 'em_andamento';


-- 5) Previsão guardada para os próximos 7 dias de cada cultivo
SELECT c.apelido, p.data, p.temp_min_c, p.temp_max_c, p.chuva_mm, p.codigo_tempo
FROM previsao_diaria p
JOIN cultivo c ON c.id = p.cultivo_id
WHERE p.data BETWEEN CURDATE() AND CURDATE() + INTERVAL 6 DAY
ORDER BY c.apelido, p.data;


-- 6) Fase do El Niño / La Niña no mês do plantio de cada cultivo
SELECT c.apelido, c.data_plantio, e.fase, e.intensidade, e.indice
FROM cultivo c
LEFT JOIN fase_enso e ON e.ano = YEAR(c.data_plantio) AND e.mes = MONTH(c.data_plantio);


-- 7) Mensagens do agente com vínculo de usuário (LEFT JOIN)
SELECT m.chat_id, u.nome AS produtor_vinculado, m.direcao, m.conteudo,
       m.intencao, m.registrado_em
FROM mensagem m
LEFT JOIN usuario u ON u.id = m.usuario_id
ORDER BY m.chat_id, m.registrado_em;


-- 8) Faixas climáticas por cultura x cultivos em andamento (LEFT JOIN + GROUP BY)
SELECT cu.nome AS cultura, cu.tipo_ciclo, cu.temp_critica_baixa_c, cu.temp_critica_alta_c,
       cu.chuva_sem_min_mm, cu.chuva_sem_max_mm, COUNT(c.id) AS cultivos_em_andamento
FROM cultura cu
LEFT JOIN cultivo c ON c.cultura_id = cu.id AND c.status = 'em_andamento'
GROUP BY cu.id, cu.nome, cu.tipo_ciclo, cu.temp_critica_baixa_c, cu.temp_critica_alta_c,
         cu.chuva_sem_min_mm, cu.chuva_sem_max_mm
ORDER BY cultivos_em_andamento DESC, cu.nome;


-- 9) De onde veio cada número: culturas e quantos textos de orientação têm
SELECT cu.nome, cu.fonte,
       (SELECT COUNT(*) FROM recomendacao r WHERE r.cultura_id = cu.id) AS recomendacoes_proprias,
       (SELECT COUNT(*) FROM fase_cultura f WHERE f.cultura_id = cu.id) AS fases
FROM cultura cu
ORDER BY cu.nome;
