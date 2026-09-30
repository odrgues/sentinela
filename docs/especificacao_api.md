# Especificação da API — CP-2

Backend em `src/backend` (Java 21 + Spring Boot 3 + Spring Data JPA), conectado ao MySQL do CP-1.

Base URL local: `http://localhost:8080`

## Usuário (`/api/usuario`)

CRUD completo do produtor cadastrado no site. Corresponde à tabela `usuario` do banco do CP-1.

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/usuario` | Cadastra um novo usuário |
| `GET` | `/api/usuario/{email}` | Consulta um usuário pelo e-mail |
| `PATCH` | `/api/usuario/{email}` | Atualiza campos do usuário (parcial) |
| `DELETE` | `/api/usuario/{email}` | Remove o usuário |

### `POST /api/usuario`

Cadastra um usuário. Senha é armazenada com hash BCrypt (`senha_hash`), nunca em texto puro.

**Request body**

| Campo | Tipo | Obrigatório | Regras |
|---|---|---|---|
| `nome` | string | sim | até 120 caracteres |
| `email` | string | sim | formato de e-mail válido, até 160 caracteres, único |
| `senha` | string | sim | mínimo 6 caracteres |
| `whatsappNumero` | string | não | até 20 caracteres, único quando informado |

```json
{
  "nome": "Teste Silva",
  "email": "teste.silva@example.com",
  "senha": "123456",
  "whatsappNumero": "+5534999990001"
}
```

**Respostas**

| Status | Quando | Corpo |
|---|---|---|
| `201 Created` | Cadastro criado | `UsuarioResponseDTO` (id, nome, email, whatsappNumero, criadoEm) |
| `400 Bad Request` | Campo inválido (ex: e-mail mal formatado, senha curta) | mensagem de validação |
| `400 Bad Request` | E-mail ou WhatsApp já cadastrados | mensagem de regra de negócio |

### `GET /api/usuario/{email}`

**Respostas**

| Status | Quando | Corpo |
|---|---|---|
| `200 OK` | Usuário encontrado | `UsuarioResponseDTO` |
| `404 Not Found` | Nenhum usuário com esse e-mail | mensagem de erro |

### `PATCH /api/usuario/{email}`

Atualização parcial — só os campos enviados são alterados.

**Request body** (todos os campos opcionais, mesmas regras de validação do `POST`)

```json
{
  "nome": "Teste Silva Atualizado"
}
```

**Respostas**

| Status | Quando | Corpo |
|---|---|---|
| `200 OK` | Atualizado com sucesso | `UsuarioResponseDTO` com os dados atuais |
| `400 Bad Request` | Novo e-mail/WhatsApp já em uso por outro usuário, ou campo inválido | mensagem de erro |
| `404 Not Found` | Nenhum usuário com o e-mail da URL | mensagem de erro |

### `DELETE /api/usuario/{email}`

**Respostas**

| Status | Quando | Corpo |
|---|---|---|
| `204 No Content` | Removido com sucesso | vazio |
| `404 Not Found` | Nenhum usuário com esse e-mail | mensagem de erro |

## Tratamento de erros

Handler global (`GlobalExceptionHandler`) padroniza as respostas de erro:

| Status | Quando |
|---|---|
| `400` | Validação de campo (`@Valid`) ou regra de negócio violada (e-mail/WhatsApp duplicado) |
| `404` | Recurso não encontrado (e-mail sem cadastro) |
| `500` | Qualquer erro inesperado não tratado |

## Como testar

1. Subir o banco do CP-1: `docker compose up -d` (raiz do repo)
2. Subir a API: `cd src/backend && ./mvnw spring-boot:run`
3. Importar `docs/insomnia_cp2.json` no Insomnia (ou usar os exemplos `curl` acima)

Evidência dos testes manuais executados em 30/09/2026: ver `docs/atas/ata_S06_2026-09-30.md`.
