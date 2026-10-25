import { afterEach, describe, expect, it, vi } from 'vitest'
import { chamarApi, enderecoDaApi } from './cliente'
import { ErroApi, MENSAGENS } from './erros'
import { guardarToken } from './sessao'

function respostaDaApi(corpo: unknown, status = 200) {
  return new Response(JSON.stringify(corpo), { status })
}

function fetchFalso(resposta: Response) {
  const falso = vi.fn().mockResolvedValue(resposta)
  vi.stubGlobal('fetch', falso)
  return falso
}

async function erroDe(promessa: Promise<unknown>): Promise<ErroApi> {
  try {
    await promessa
  } catch (erro) {
    if (erro instanceof ErroApi) return erro
    throw erro
  }
  throw new Error('a chamarApi devia ter lançado erro')
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
})

describe('enderecoDaApi', () => {
  it('monta a URL com os parâmetros e pula os vazios', () => {
    expect(
      enderecoDaApi('cultivos/7/alertas', { severidade: 'critico', tipo: undefined, de: '' }),
    ).toBe('/api/cultivos/7/alertas?severidade=critico')
  })

  it('no build de produção, chama a API no endereço da VITE_API_URL', () => {
    vi.stubEnv('VITE_API_URL', 'https://api.sentinela.exemplo')

    expect(enderecoDaApi('culturas')).toBe('https://api.sentinela.exemplo/api/culturas')
  })
})

describe('chamarApi', () => {
  it('devolve o corpo da resposta', async () => {
    fetchFalso(respostaDaApi([{ id: 1, nome: 'Soja' }]))

    await expect(chamarApi('culturas')).resolves.toEqual([{ id: 1, nome: 'Soja' }])
  })

  it('manda o corpo em JSON com o método pedido', async () => {
    const falso = fetchFalso(respostaDaApi({ id: 7 }, 201))

    await chamarApi('cultivos', { metodo: 'POST', corpo: { apelido: 'Talhão do fundo' } })

    const [, pedido] = falso.mock.calls[0]
    expect(pedido.method).toBe('POST')
    expect(pedido.headers['Content-Type']).toBe('application/json')
    expect(pedido.body).toBe('{"apelido":"Talhão do fundo"}')
  })

  it('põe o token JWT quando a pessoa entrou', async () => {
    guardarToken('abc.def.ghi')
    const falso = fetchFalso(respostaDaApi({}))

    await chamarApi('painel')

    expect(falso.mock.calls[0][1].headers.Authorization).toBe('Bearer abc.def.ghi')
  })

  it('não manda Authorization sem token', async () => {
    const falso = fetchFalso(respostaDaApi({}))

    await chamarApi('culturas')

    expect(falso.mock.calls[0][1].headers.Authorization).toBeUndefined()
  })

  it('aceita o 204 sem corpo', async () => {
    fetchFalso(new Response(null, { status: 204 }))

    await expect(chamarApi('cultivos/7', { metodo: 'DELETE' })).resolves.toBeUndefined()
  })

  it('traz a mensagem e os erros de cada campo', async () => {
    fetchFalso(
      respostaDaApi({ mensagem: 'Confira os campos', campos: { email: 'E-mail inválido' } }, 400),
    )

    const erro = await erroDe(chamarApi('usuario', { metodo: 'POST', corpo: {} }))

    expect(erro.message).toBe('Confira os campos')
    expect(erro.status).toBe(400)
    expect(erro.campos).toEqual({ email: 'E-mail inválido' })
  })

  it('sem internet vira a mensagem de sem conexão', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    const erro = await erroDe(chamarApi('culturas'))

    expect(erro.message).toBe(MENSAGENS.semConexao)
    expect(erro.status).toBeNull()
  })

  it('um erro que não é JSON vira a mensagem do servidor', async () => {
    fetchFalso(new Response('Erro interno no servidor.', { status: 500 }))

    const erro = await erroDe(chamarApi('culturas'))

    expect(erro.message).toBe(MENSAGENS.servidor)
    expect(erro.status).toBe(500)
  })

  it('um 200 que não é JSON também é falha do servidor', async () => {
    fetchFalso(new Response('<html>', { status: 200 }))

    const erro = await erroDe(chamarApi('culturas'))

    expect(erro.message).toBe(MENSAGENS.servidor)
  })
})
