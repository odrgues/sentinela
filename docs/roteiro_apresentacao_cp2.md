# Roteiro de Apresentação — CP-2 (Backend)

Duração alvo: ~10-12 minutos. Jessica e Larissa podem dividir os blocos como preferirem.

## Antes de começar (checklist)

- [ ] `docker compose up -d` (raiz do repo) — banco do CP-1 no ar
- [ ] `cd src/backend && ./mvnw spring-boot:run` — API no ar em `http://localhost:8080`
- [ ] Insomnia aberto com `docs/insomnia_cp2.json` importado
- [ ] Um cliente MySQL aberto (DBeaver, TablePlus ou `docker exec -it sentinela-mysql mysql -uroot -proot_local sentinela`) para mostrar a tabela `usuario` antes e depois das chamadas
- [ ] Ter `docs/especificacao_api.md` aberto numa aba, caso peçam para consultar

## 1. Abertura (30s)

"No CP-1 entregamos o banco de dados. No CP-2 entregamos a API que conecta a esse banco: uma API REST em Java com Spring Boot, com CRUD completo da entidade `Usuario` — 4 endpoints, acima do mínimo de 2 pedido."

## 2. Arquitetura da API (2-3 min)

Mostrar a estrutura de pastas em `src/backend/src/main/java/br/com/sentinela/backend/` e explicar o fluxo de uma requisição:

```
Controller  →  Service          →  Repository  →  Model (JPA)  →  MySQL
(rotas HTTP)   (regras de negócio)  (acesso a dados)  (tabela usuario)
```

- **`UsuarioController`**: recebe a requisição HTTP, valida o corpo (`@Valid`) e delega para o `Service`. Não tem regra de negócio nenhuma — só tradução HTTP ↔ Java.
- **`UsuarioService`**: onde vivem as regras — e-mail/WhatsApp não podem se repetir, senha é sempre criptografada (BCrypt) antes de salvar.
- **`UsuarioRepository`**: interface do Spring Data JPA — não tem implementação escrita à mão, o Spring gera as queries a partir do nome do método (`findByEmail`, `existsByEmail`).
- **`Usuario` (model)**: mapeia a classe Java para a tabela `usuario` do banco do CP-1, criada no CP-1.
- **DTOs** (`UsuarioRequestDTO`, `AtualizarUsuarioDTO`, `UsuarioResponseDTO`): o que entra numa requisição e o que sai numa resposta é diferente do modelo interno — por exemplo, a senha nunca aparece na resposta.
- **`GlobalExceptionHandler`**: centraliza o tratamento de erro, transformando exceções em respostas HTTP com o status correto (400, 404 ou 500), em vez de cada endpoint tratar erro na mão.

## 3. Demonstração ao vivo dos endpoints (5-7 min)

Rodar na ordem, pelo Insomnia (pasta "Usuário" da coleção), narrando o status code de cada resposta:

| # | Request no Insomnia | O que mostrar |
|---|---|---|
| 1 | Criar usuário (201) | Corpo da resposta com `id` gerado e `criadoEm`; **a senha não aparece** |
| 2 | Consultar usuário (200) | Mesmos dados voltando pelo e-mail |
| 3 | Atualizar usuário (200) | Só o `nome` foi enviado no corpo — `PATCH` é atualização parcial |
| 4 | Remover usuário (204) | Resposta vazia, status 204 |
| 5 | Consultar usuário inexistente (404) | Mensagem de erro clara, não um 500 genérico |
| 6 | Criar com e-mail inválido (400) | Mensagem de validação (`@Email`, `@NotBlank`) |
| 7 | Criar com e-mail duplicado (400) | Mensagem de regra de negócio, não de validação de campo — mostra a diferença entre os dois tipos de erro 400 |

Depois do passo 1, alternar para o cliente MySQL e rodar `SELECT * FROM usuario;` para provar que o dado realmente foi salvo no banco do CP-1 — não é uma simulação em memória. Repetir a consulta depois do passo 4 para mostrar que a remoção também é real.

## 4. Perguntas prováveis (preparar resposta)

- **"Por que só uma entidade tem CRUD?"** — O critério do CP-2 pede no mínimo 2 endpoints CRUD; entregamos 4 (create, read, update, delete) numa entidade só, bem acima do mínimo. As demais entidades (Cultura, Cultivo) entram no CP-3, junto com a integração do frontend.
- **"Cadê a autenticação?"** — É escopo do CP-4 no termo de abertura. Por isso os endpoints estão abertos por enquanto; havia inclusive um bug em que o Spring Security bloqueava tudo sem querer, corrigido nesta semana.
- **"Por que PATCH e não PUT na atualização?"** — `PATCH` porque a atualização é parcial (só os campos enviados mudam); `PUT` exigiria reenviar o objeto inteiro.
- **"Como o erro 500 é tratado?"** — Handler genérico no `GlobalExceptionHandler` captura qualquer exceção não prevista e devolve 500 com mensagem padrão, em vez de vazar stacktrace pro cliente.

## 5. Fechamento (30s)

"No CP-3 essa API ganha o frontend em React consumindo esses endpoints, mais o CRUD de Cultura e Cultivo, e o sistema vai para produção com URL pública."
