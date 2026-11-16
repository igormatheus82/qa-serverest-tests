# Modelo de Bug Report

> Modelo que uso para registrar defeitos (ex.: Jira). O exemplo abaixo é **ilustrativo**, apenas para mostrar o formato.

| Campo | Exemplo |
|---|---|
| **ID** | BUG-001 |
| **Título** | [Produtos] Cadastro aceita produto com quantidade negativa |
| **Ambiente** | API https://serverest.dev · Postman 11 · 16/11/2026 |
| **Severidade** | Média — gera dado inconsistente no estoque |
| **Prioridade** | Alta |
| **Pré-condição** | Usuário administrador autenticado |

### Passos para reproduzir

1. Fazer `POST /login` com um usuário administrador e copiar o token.
2. Fazer `POST /produtos` com o header `Authorization` e o corpo:
   ```json
   { "nome": "Produto Teste", "preco": 10, "descricao": "teste", "quantidade": -5 }
   ```

### Resultado esperado

Status `400` com mensagem informando que `quantidade` deve ser maior ou igual a zero.

### Resultado obtido

*(descrever exatamente o que aconteceu: status, corpo da resposta, prints)*

### Evidências

- Print/vídeo da requisição e da resposta
- `curl` para reprodução:
  ```bash
  curl -X POST https://serverest.dev/produtos \
    -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
    -d '{"nome":"Produto Teste","preco":10,"descricao":"teste","quantidade":-5}'
  ```

---

**Boas práticas que sigo:** um defeito por report, título que diz *onde* e *o quê*, passos reproduzíveis por outra pessoa, resultado esperado × obtido sempre explícitos e evidência anexada.
