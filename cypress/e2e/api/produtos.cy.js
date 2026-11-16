describe('API | /produtos', () => {
  const api = () => Cypress.env('apiUrl')
  let admin
  let comum
  const produtosCriados = []

  const novoProduto = () =>
    cy.fixture('produto').then((p) => ({ ...p, nome: `${p.nome} ${Date.now()}${Cypress._.random(100, 999)}` }))

  before(() => {
    cy.criarUsuarioLogado(true).then((dados) => (admin = dados))
    cy.criarUsuarioLogado(false).then((dados) => (comum = dados))
  })

  after(() => {
    produtosCriados.forEach((id) => cy.excluirProdutoApi(admin.token, id))
    cy.excluirUsuarioApi(admin.id)
    cy.excluirUsuarioApi(comum.id)
  })

  it('CT-API-12 | Administrador deve cadastrar produto', () => {
    novoProduto().then((produto) => {
      cy.criarProdutoApi(admin.token, produto).then((res) => {
        expect(res.status).to.eq(201)
        expect(res.body.message).to.eq('Cadastro realizado com sucesso')
        produtosCriados.push(res.body._id)

        cy.request(`${api()}/produtos/${res.body._id}`).then((busca) => {
          expect(busca.body).to.include({ nome: produto.nome, preco: produto.preco, quantidade: produto.quantidade })
        })
      })
    })
  })

  it('CT-API-13 | Não deve cadastrar produto sem token', () => {
    novoProduto().then((produto) => {
      cy.criarProdutoApi(null, produto).then((res) => {
        expect(res.status).to.eq(401)
        expect(res.body.message).to.eq(
          'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
        )
      })
    })
  })

  it('CT-API-14 | Usuário comum não deve cadastrar produto (403)', () => {
    novoProduto().then((produto) => {
      cy.criarProdutoApi(comum.token, produto).then((res) => {
        expect(res.status).to.eq(403)
        expect(res.body.message).to.eq('Rota exclusiva para administradores')
      })
    })
  })

  it('CT-API-15 | Não deve cadastrar produto com nome duplicado', () => {
    novoProduto().then((produto) => {
      cy.criarProdutoApi(admin.token, produto).then((res) => produtosCriados.push(res.body._id))
      cy.criarProdutoApi(admin.token, produto).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body.message).to.eq('Já existe produto com esse nome')
      })
    })
  })

  it('CT-API-16 | Não deve aceitar preço negativo', () => {
    novoProduto().then((produto) => {
      cy.criarProdutoApi(admin.token, { ...produto, preco: -10 }).then((res) => {
        expect(res.status).to.eq(400)
        expect(res.body).to.have.property('preco')
      })
    })
  })

  it('CT-API-17 | Deve listar produtos com o contrato esperado', () => {
    cy.request(`${api()}/produtos`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.quantidade).to.eq(res.body.produtos.length)
      if (res.body.produtos.length) {
        expect(res.body.produtos[0]).to.have.all.keys('nome', 'preco', 'descricao', 'quantidade', '_id')
      }
    })
  })
})
