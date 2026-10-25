import { describe, expect, it } from 'vitest'
import { ErroApi, MENSAGENS, erroDaResposta, erroPassageiro } from './erros'

describe('erroDaResposta', () => {
  it('nos 4xx usa a mensagem do backend', () => {
    expect(erroDaResposta(401, { mensagem: 'E-mail ou senha incorretos' }).message).toBe(
      'E-mail ou senha incorretos',
    )
    expect(erroDaResposta(410, { mensagem: 'Este link expirou' }).message).toBe('Este link expirou')
  })

  it('guarda só os erros de campo que são texto', () => {
    const erro = erroDaResposta(400, {
      mensagem: 'Confira os campos',
      campos: { email: 'E-mail inválido', senha: 6 },
    })

    expect(erro.campos).toEqual({ email: 'E-mail inválido' })
  })

  it('sem mensagem, o 401 diz que a sessão expirou e o 404 que não achou', () => {
    expect(erroDaResposta(401, null).message).toBe(MENSAGENS.sessaoExpirada)
    expect(erroDaResposta(404, null).message).toBe(MENSAGENS.naoEncontrado)
  })

  it('sem mensagem, os outros 4xx dizem que o pedido foi recusado', () => {
    expect(erroDaResposta(409, {}).message).toBe(MENSAGENS.pedidoRecusado)
  })

  it('no 5xx nunca mostra o texto do backend', () => {
    expect(erroDaResposta(500, { mensagem: 'NullPointerException' }).message).toBe(
      MENSAGENS.servidor,
    )
  })
})

describe('erroPassageiro', () => {
  it('sem internet e erro do servidor podem passar sozinhos', () => {
    expect(erroPassageiro(new ErroApi('x', null))).toBe(true)
    expect(erroPassageiro(new ErroApi('x', 500))).toBe(true)
    expect(erroPassageiro(new ErroApi('x', 503))).toBe(true)
  })

  it('pedido errado não passa tentando de novo', () => {
    expect(erroPassageiro(new ErroApi('x', 400))).toBe(false)
    expect(erroPassageiro(new ErroApi('x', 401))).toBe(false)
    expect(erroPassageiro(new ErroApi('x', 404))).toBe(false)
  })

  it('tempo esgotado (408) e muitas chamadas (429) passam tentando de novo', () => {
    expect(erroPassageiro(new ErroApi('x', 408))).toBe(true)
    expect(erroPassageiro(new ErroApi('x', 429))).toBe(true)
  })

  it('um erro que não é da API pode passar tentando de novo', () => {
    expect(erroPassageiro(new TypeError('quebrou ao ler a resposta'))).toBe(true)
  })
})
