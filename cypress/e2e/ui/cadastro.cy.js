describe('UI | Cadastro de usuário', () => {
  const criados = []

  after(() => {
    // Limpa os usuários criados pela interface, buscando o id pelo e-mail
    criados.forEach((email) => {
      cy.request(`${Cypress.env('apiUrl')}/usuarios?email=${encodeURIComponent(email)}`).then((res) => {
        res.body.usuarios.forEach((u) => cy.excluirUsuarioApi(u._id))
      })
    })
  })

  const preencherCadastro = (usuario) => {
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="nome"]').type(usuario.nome)
    cy.get('[data-testid="email"]').type(usuario.email)
    cy.get('[data-testid="password"]').type(usuario.password, { log: false })
    if (usuario.administrador === 'true') {
      cy.get('[data-testid="checkbox"]').check()
    }
    cy.get('[data-testid="cadastrar"]').click()
  }

  it('CT-UI-05 | Deve cadastrar administrador e entrar automaticamente', () => {
    cy.gerarUsuario(true).then((usuario) => {
      criados.push(usuario.email)
      preencherCadastro(usuario)

      cy.contains('Cadastro realizado com sucesso').should('be.visible')
      cy.url().should('include', '/admin/home')
    })
  })

  it('CT-UI-06 | Deve cadastrar usuário comum e ir para a loja', () => {
    cy.gerarUsuario(false).then((usuario) => {
      criados.push(usuario.email)
      preencherCadastro(usuario)

      cy.url().should('include', '/home').and('not.include', '/admin')
    })
  })

  it('CT-UI-07 | Não deve cadastrar com e-mail já utilizado', () => {
    cy.gerarUsuario(false).then((usuario) => {
      criados.push(usuario.email)
      cy.criarUsuarioApi(usuario)

      preencherCadastro(usuario)

      cy.contains('Este email já está sendo usado').should('be.visible')
      cy.url().should('include', '/cadastrarusuarios')
    })
  })

  it('CT-UI-08 | Link "Entrar" deve voltar para a tela de login', () => {
    cy.visit('/cadastrarusuarios')
    cy.get('[data-testid="entrar"]').click()
    cy.url().should('include', '/login')
  })
})
