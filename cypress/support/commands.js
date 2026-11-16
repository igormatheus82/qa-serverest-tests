// Comandos customizados reutilizados pelos testes de API e de interface.

const api = () => Cypress.env('apiUrl')

/** Gera dados únicos para evitar conflito entre execuções (o ServeRest é público). */
Cypress.Commands.add('gerarUsuario', (administrador = true) => {
  const id = `${Date.now()}${Cypress._.random(1000, 9999)}`
  return cy.wrap({
    nome: `QA Igor ${id}`,
    email: `qa.igor.${id}@teste.com.br`,
    password: 'Senha@123',
    administrador: String(administrador),
  })
})

Cypress.Commands.add('criarUsuarioApi', (usuario) => {
  return cy.request({
    method: 'POST',
    url: `${api()}/usuarios`,
    body: usuario,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('loginApi', (email, password) => {
  return cy.request({
    method: 'POST',
    url: `${api()}/login`,
    body: { email, password },
    failOnStatusCode: false,
  })
})

/** Cria um usuário novo e devolve { usuario, id, token }. */
Cypress.Commands.add('criarUsuarioLogado', (administrador = true) => {
  return cy.gerarUsuario(administrador).then((usuario) => {
    return cy.criarUsuarioApi(usuario).then((cadastro) => {
      expect(cadastro.status).to.eq(201)
      return cy.loginApi(usuario.email, usuario.password).then((login) => {
        expect(login.status).to.eq(200)
        return { usuario, id: cadastro.body._id, token: login.body.authorization }
      })
    })
  })
})

Cypress.Commands.add('excluirUsuarioApi', (id) => {
  return cy.request({ method: 'DELETE', url: `${api()}/usuarios/${id}`, failOnStatusCode: false })
})

Cypress.Commands.add('criarProdutoApi', (token, produto) => {
  return cy.request({
    method: 'POST',
    url: `${api()}/produtos`,
    headers: token ? { Authorization: token } : {},
    body: produto,
    failOnStatusCode: false,
  })
})

Cypress.Commands.add('excluirProdutoApi', (token, id) => {
  return cy.request({
    method: 'DELETE',
    url: `${api()}/produtos/${id}`,
    headers: { Authorization: token },
    failOnStatusCode: false,
  })
})

// ---------------------------------------------------------------- interface

Cypress.Commands.add('loginTela', (email, senha) => {
  cy.visit('/login')
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(senha, { log: false })
  cy.get('[data-testid="entrar"]').click()
})
