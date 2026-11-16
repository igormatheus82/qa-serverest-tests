describe('UI | Login', () => {
  let admin
  let comum

  before(() => {
    cy.criarUsuarioLogado(true).then((d) => (admin = d))
    cy.criarUsuarioLogado(false).then((d) => (comum = d))
  })

  after(() => {
    cy.excluirUsuarioApi(admin.id)
    cy.excluirUsuarioApi(comum.id)
  })

  it('CT-UI-01 | Administrador deve logar e ver a área administrativa', () => {
    cy.loginTela(admin.usuario.email, admin.usuario.password)

    cy.url().should('include', '/admin/home')
    cy.contains('h1', 'Bem Vindo').should('contain', admin.usuario.nome)
  })

  it('CT-UI-02 | Usuário comum deve logar e ver a loja', () => {
    cy.loginTela(comum.usuario.email, comum.usuario.password)

    cy.url().should('include', '/home').and('not.include', '/admin')
    cy.contains('h1', 'Serverest Store').should('be.visible')
  })

  it('CT-UI-03 | Deve exibir erro com senha inválida e permanecer na tela de login', () => {
    cy.loginTela(admin.usuario.email, 'senhaErrada')

    cy.contains('Email e/ou senha inválidos').should('be.visible')
    cy.url().should('include', '/login')
  })

  it('CT-UI-04 | Deve exibir mensagens de campos obrigatórios ao enviar vazio', () => {
    cy.visit('/login')
    cy.get('[data-testid="entrar"]').click()

    cy.contains('Email é obrigatório').should('be.visible')
    cy.contains('Password é obrigatório').should('be.visible')
    cy.url().should('include', '/login')
  })
})
