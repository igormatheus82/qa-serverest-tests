# Plano de Testes — ServeRest

## 1. Objetivo

Validar as principais funcionalidades da aplicação **ServeRest** (loja virtual de estudo), cobrindo a API REST e a interface web, com foco em autenticação, cadastro de usuários e gestão de produtos.

## 2. Escopo

| Dentro do escopo | Fora do escopo |
|---|---|
| `POST /login` | Testes de carga/performance (proibidos no ambiente público) |
| CRUD de `/usuarios` | Carrinhos (`/carrinhos`) — próxima etapa |
| CRUD de `/produtos` e regras de permissão | Testes de segurança aprofundados |
| Telas de login e cadastro (front) | Compatibilidade mobile |

## 3. Ambientes

| Item | Valor |
|---|---|
| API | https://serverest.dev |
| Front-end | https://front.serverest.dev |
| Navegadores | Electron (padrão do Cypress) e Chrome |

## 4. Estratégia

- **Testes de API**: validação de status code, mensagens, contrato (campos do JSON) e regras de permissão. Ferramentas: **Cypress** (`cy.request`) e **Postman/Newman**.
- **Testes E2E (interface)**: fluxos críticos do usuário com **Cypress**, usando seletores `data-testid` para estabilidade.
- **Massa de dados**: cada teste cria seus próprios usuários/produtos com dados únicos (timestamp) e os exclui ao final, para não depender do estado do ambiente público.
- **Técnicas**: particionamento de equivalência (dados válidos × inválidos), análise de valor limite (preço negativo, campos vazios) e testes de permissão (admin × usuário comum × sem token).

## 5. Critérios

- **Entrada**: ambiente disponível e documentação Swagger acessível.
- **Saída**: 100% dos casos de prioridade **Alta** executados e aprovados; defeitos encontrados registrados.

## 6. Riscos

| Risco | Mitigação |
|---|---|
| Ambiente público instável ou com limite de requisições (429) | `retries` no Cypress e execução fora de horário de pico |
| Dados criados por outras pessoas no ambiente | Massa de dados própria e única por execução |

## 7. Rastreabilidade

Os casos de teste estão descritos em [`casos-de-teste.md`](casos-de-teste.md) (formato Gherkin), cada um com ID (`CT-API-xx`, `CT-UI-xx`) que aparece também no nome do teste automatizado.
