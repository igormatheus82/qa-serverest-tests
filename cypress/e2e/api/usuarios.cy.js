describe('API | /usuarios', () => {
  const api = () => Cypress.env('apiUrl')
  const criados = []

  after(() => criados.forEach((id) => cy.excluirUsuarioApi(id)))

  it('CT-API-05 | Deve cadastrar um usuário com sucesso', () => {
    cy.gerarUsuario(false).then((usuario) => {
      cy.criarUsuarioApi(usuario).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.message).to.eq('Cadastro realizado com sucesso')
        expect(res.body._id).to.be.a('string').and.not.be.empty
        criados.push(res.body._id)
      })
    })
  })

  it('CT-API-06 | Não deve cadastrar usuário com e-mail já utilizado', () => {
    cy.gerarUsuario().then((usuario) => {
      cy.criarUsuarioApi(usuario).then((res) => criados.push(res.body._id))
      cy.criarUsuarioApi({ ...usuario, nome: 'Outro Nome' }).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body.message).to.eq('Este email já está sendo usado')
      })
    })
  })

  it('CT-API-07 | Deve buscar usuário por ID e não expor dados de outro usuário', () => {
    cy.gerarUsuario().then((usuario) => {
      cy.criarUsuarioApi(usuario).then((cadastro) => {
        criados.push(cadastro.body._id)
        cy.request(`${api()}/usuarios/${cadastro.body._id}`).then((res) => {
          expect(res.status).to.eq(200)
          expect(res.body).to.include({
            nome: usuario.nome,
            email: usuario.email,
            administrador: usuario.administrador,
            _id: cadastro.body._id,
          })
        })
      })
    })
  })

  it('CT-API-08 | Deve retornar 400 ao buscar usuário inexistente', () => {
    cy.request({ url: `${api()}/usuarios/ZZZZZZZZZZZZZZZZ`, failOnStatusCode: false }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body.message).to.eq('Usuário não encontrado')
    })
  })

  it('CT-API-09 | Deve editar o nome de um usuário', () => {
    cy.gerarUsuario().then((usuario) => {
      cy.criarUsuarioApi(usuario).then((cadastro) => {
        criados.push(cadastro.body._id)
        cy.request('PUT', `${api()}/usuarios/${cadastro.body._id}`, { ...usuario, nome: 'Nome Editado QA' })
          .then((res) => {
            expect(res.status).to.eq(200)
            expect(res.body.message).to.eq('Registro alterado com sucesso')
          })
        cy.request(`${api()}/usuarios/${cadastro.body._id}`).its('body.nome').should('eq', 'Nome Editado QA')
      })
    })
  })

  it('CT-API-10 | Deve excluir um usuário', () => {
    cy.gerarUsuario().then((usuario) => {
      cy.criarUsuarioApi(usuario).then((cadastro) => {
        cy.excluirUsuarioApi(cadastro.body._id).then((res) => {
          expect(res.status).to.eq(200)
          expect(res.body.message).to.eq('Registro excluído com sucesso')
        })
      })
    })
  })

  it('CT-API-11 | Deve validar formato de e-mail no cadastro', () => {
    cy.gerarUsuario().then((usuario) => {
      cy.criarUsuarioApi({ ...usuario, email: 'email-invalido' }).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body).to.have.property('email')
      })
    })
  })
})
