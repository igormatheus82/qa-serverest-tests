# Casos de Teste

Formato BDD (Gherkin). **Prioridade**: A = Alta, M = Média, B = Baixa. Todos os casos abaixo estão automatizados — o ID aparece no nome do teste no Cypress.

## Login (API)

```gherkin
Funcionalidade: Autenticação

  # CT-API-01 (A)
  Cenário: Login com credenciais válidas
    Dado que existe um usuário cadastrado
    Quando envio POST /login com e-mail e senha corretos
    Então o status deve ser 200
    E a resposta deve conter um token "Bearer"

  # CT-API-02 (A)
  Cenário: Login com senha incorreta
    Dado que existe um usuário cadastrado
    Quando envio POST /login com a senha incorreta
    Então o status deve ser 401
    E a mensagem deve ser "Email e/ou senha inválidos"
    E nenhum token deve ser retornado

  # CT-API-03 (M)
  Cenário: Login com e-mail não cadastrado
    Quando envio POST /login com um e-mail inexistente
    Então o status deve ser 401

  # CT-API-04 (M)
  Cenário: Login sem e-mail e senha
    Quando envio POST /login com o corpo vazio
    Então o status deve ser 400
    E a resposta deve informar que e-mail e senha são obrigatórios
```

## Usuários (API)

```gherkin
Funcionalidade: Gestão de usuários

  # CT-API-05 (A)
  Cenário: Cadastrar usuário válido
    Quando envio POST /usuarios com dados válidos
    Então o status deve ser 201
    E a resposta deve conter o _id do usuário

  # CT-API-06 (A)
  Cenário: Cadastrar usuário com e-mail já utilizado
    Dado que já existe um usuário com o e-mail "x@teste.com"
    Quando envio POST /usuarios com o mesmo e-mail
    Então o status deve ser 400
    E a mensagem deve ser "Este email já está sendo usado"

  # CT-API-07 (M)
  Cenário: Buscar usuário por ID
    Dado que cadastrei um usuário
    Quando envio GET /usuarios/{_id}
    Então os dados retornados devem ser os do usuário cadastrado

  # CT-API-08 (B)
  Cenário: Buscar usuário inexistente
    Quando envio GET /usuarios com um ID que não existe
    Então o status deve ser 400
    E a mensagem deve ser "Usuário não encontrado"

  # CT-API-09 (M)
  Cenário: Editar usuário
    Quando envio PUT /usuarios/{_id} com um novo nome
    Então o status deve ser 200
    E ao consultar o usuário o nome deve estar atualizado

  # CT-API-10 (M)
  Cenário: Excluir usuário
    Quando envio DELETE /usuarios/{_id}
    Então a mensagem deve ser "Registro excluído com sucesso"

  # CT-API-11 (M)
  Cenário: Cadastrar com e-mail em formato inválido
    Quando envio POST /usuarios com o e-mail "email-invalido"
    Então o status deve ser 400
```

## Produtos (API)

```gherkin
Funcionalidade: Gestão de produtos

  # CT-API-12 (A)
  Cenário: Administrador cadastra produto
    Dado que estou autenticado como administrador
    Quando envio POST /produtos com dados válidos
    Então o status deve ser 201
    E o produto deve ser retornado no GET /produtos/{_id}

  # CT-API-13 (A)
  Cenário: Cadastro de produto sem token
    Quando envio POST /produtos sem o header Authorization
    Então o status deve ser 401

  # CT-API-14 (A)
  Cenário: Usuário comum tenta cadastrar produto
    Dado que estou autenticado como usuário comum
    Quando envio POST /produtos
    Então o status deve ser 403
    E a mensagem deve ser "Rota exclusiva para administradores"

  # CT-API-15 (M)
  Cenário: Produto com nome duplicado
    Dado que já existe o produto "Mouse X"
    Quando cadastro outro produto com o nome "Mouse X"
    Então o status deve ser 400

  # CT-API-16 (M) — valor limite
  Cenário: Produto com preço negativo
    Quando envio POST /produtos com preço -10
    Então o status deve ser 400

  # CT-API-17 (B) — contrato
  Cenário: Listagem de produtos
    Quando envio GET /produtos
    Então "quantidade" deve ser igual ao tamanho da lista
    E cada produto deve ter nome, preco, descricao, quantidade e _id
```

## Interface (E2E)

```gherkin
Funcionalidade: Login e cadastro pelo navegador

  # CT-UI-01 (A)
  Cenário: Administrador faz login
    Dado que estou na tela de login
    Quando informo e-mail e senha de um administrador
    Então devo ver a área administrativa com "Bem Vindo <nome>"

  # CT-UI-02 (A)
  Cenário: Usuário comum faz login
    Quando faço login com um usuário comum
    Então devo ser direcionado para a loja "Serverest Store"

  # CT-UI-03 (A)
  Cenário: Login com senha inválida
    Quando faço login com a senha incorreta
    Então devo ver a mensagem "Email e/ou senha inválidos"
    E devo permanecer na tela de login

  # CT-UI-04 (M)
  Cenário: Login com campos vazios
    Quando clico em "Entrar" sem preencher os campos
    Então o navegador deve impedir o envio do formulário

  # CT-UI-05 (A)
  Cenário: Cadastro de administrador
    Quando preencho o cadastro marcando "administrador"
    Então devo ver "Cadastro realizado com sucesso"
    E devo entrar na área administrativa

  # CT-UI-06 (M)
  Cenário: Cadastro de usuário comum
    Quando preencho o cadastro sem marcar "administrador"
    Então devo ser direcionado para a loja

  # CT-UI-07 (A)
  Cenário: Cadastro com e-mail já utilizado
    Dado que já existe um usuário com meu e-mail
    Quando tento me cadastrar
    Então devo ver "Este email já está sendo usado"

  # CT-UI-08 (B)
  Cenário: Voltar para o login
    Dado que estou na tela de cadastro
    Quando clico em "Entrar"
    Então devo ir para a tela de login
```
