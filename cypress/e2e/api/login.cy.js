describe('API | POST /login', () => {
  let usuario
  let usuarioId

  before(() => {
    cy.gerarUsuario().then((u) => {
      usuario = u
      cy.criarUsuarioApi(u).then((res) => (usuarioId = res.body._id))
    })
  })

  after(() => cy.excluirUsuarioApi(usuarioId))

  it('CT-API-01 | Deve logar com credenciais válidas e retornar token Bearer', () => {
    cy.loginApi(usuario.email, usuario.password).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.message).to.eq('Login realizado com sucesso')
      expect(res.body.authorization).to.match(/^Bearer\s.+/)
      expect(res.duration).to.be.lessThan(3000)
    })
  })

  it('CT-API-02 | Não deve logar com senha incorreta', () => {
    cy.loginApi(usuario.email, 'senhaErrada').then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body.message).to.eq('Email e/ou senha inválidos')
      expect(res.body).not.to.have.property('authorization')
    })
  })

  it('CT-API-03 | Não deve logar com e-mail não cadastrado', () => {
    cy.loginApi(`nao.existe.${Date.now()}@teste.com`, 'qualquer').then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body.message).to.eq('Email e/ou senha inválidos')
    })
  })

  it('CT-API-04 | Deve validar campos obrigatórios', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/login`,
      body: {},
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.email).to.eq('email é obrigatório')
      expect(res.body.password).to.eq('password é obrigatório')
    })
  })
})
