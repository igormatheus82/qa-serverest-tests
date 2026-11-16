# Testes Automatizados — ServeRest (Cypress + Postman)

![Testes](https://github.com/igormatheus82/qa-serverest-tests/actions/workflows/ci.yml/badge.svg)
![Cypress](https://img.shields.io/badge/Cypress-14-17202C?logo=cypress)
![Postman](https://img.shields.io/badge/Postman-Newman-FF6C37?logo=postman)

Projeto de **Quality Assurance** com testes manuais documentados e testes automatizados de **API** e **E2E** da aplicação [ServeRest](https://serverest.dev), uma loja virtual feita para estudo de testes.

## O que tem aqui

| Entrega | Onde |
|---|---|
| Plano de testes (escopo, estratégia, riscos) | [`docs/plano-de-testes.md`](docs/plano-de-testes.md) |
| 25 casos de teste em **Gherkin** com prioridade | [`docs/casos-de-teste.md`](docs/casos-de-teste.md) |
| Modelo de bug report | [`docs/modelo-bug-report.md`](docs/modelo-bug-report.md) |
| Testes de API com **Cypress** (17 casos) | [`cypress/e2e/api`](cypress/e2e/api) |
| Testes E2E de interface com **Cypress** (8 casos) | [`cypress/e2e/ui`](cypress/e2e/ui) |
| Coleção **Postman** (11 requisições com asserts) | [`postman/`](postman) |
| Pipeline **CI** no GitHub Actions | [`.github/workflows/ci.yml`](.github/workflows/ci.yml) |

## Cobertura

- **Login**: credenciais válidas, senha errada, usuário inexistente, campos obrigatórios
- **Usuários**: CRUD completo, e-mail duplicado, e-mail inválido, usuário inexistente
- **Produtos**: cadastro por admin, **permissões** (sem token → 401, usuário comum → 403), nome duplicado, preço negativo (valor limite), contrato do JSON
- **Interface**: login de admin e usuário comum, mensagens de erro, validação de campos, cadastro e redirecionamentos

## Boas práticas aplicadas

- **Massa de dados independente**: cada teste cria os próprios dados com valores únicos e apaga tudo ao final (`after`)
- **Comandos customizados** (`cypress/support/commands.js`) para evitar repetição
- **Seletores estáveis** (`data-testid`) nos testes de interface
- **Setup via API** nos testes E2E (cria o usuário pela API e testa só o que importa na tela) — testes mais rápidos e menos frágeis
- Rastreabilidade: o ID do caso de teste (`CT-API-01`…) está no nome de cada teste automatizado

## Como rodar

Pré-requisito: **Node.js 18+**

```bash
git clone https://github.com/igormatheus82/qa-serverest-tests.git
cd qa-serverest-tests
npm install

npm test               # todos os testes Cypress (modo headless)
npm run test:api       # só API
npm run test:ui        # só interface
npm run cy:open        # abre a interface gráfica do Cypress
npm run test:postman   # coleção Postman via Newman
```

Para usar no **Postman**: importe `postman/ServeRest.postman_collection.json` e o ambiente `postman/ServeRest.postman_environment.json`, selecione o ambiente e rode a coleção no **Runner** (em ordem).

## Estrutura

```
qa-serverest-tests/
├── cypress/
│   ├── e2e/
│   │   ├── api/          # login, usuários, produtos
│   │   └── ui/           # login e cadastro pelo navegador
│   ├── fixtures/         # dados de exemplo
│   └── support/          # comandos customizados
├── docs/                 # plano, casos de teste e modelo de bug
├── postman/              # coleção e ambiente
└── .github/workflows/    # CI: Newman + Cypress
```

> ⚠️ O ServeRest online é público e **não permite teste de carga**. Os testes aqui são funcionais e criam pouca massa de dados.

## Próximos passos

- [ ] Cobrir o fluxo de carrinhos (`/carrinhos`)
- [ ] Relatório visual com Allure ou Mochawesome
- [ ] Rodar o ServeRest localmente via Docker no CI

---

Feito por **Igor Cavalcante** · [LinkedIn](https://www.linkedin.com/in/cavalcanteigor)
