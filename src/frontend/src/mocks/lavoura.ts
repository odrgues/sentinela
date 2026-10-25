import { http, HttpResponse } from 'msw'
import { culturas } from './dados/culturas'
import { detalhe, historico } from './dados/detalhe'
import { painel } from './dados/painel'
import { SENHA_DE_TESTE, usuario } from './dados/usuario'

type NovoCultivo = {
  culturaId: number
  apelido: string
  dataPlantio: string
  areaHa?: number
  latitude: number
  longitude: number
  cidade: string
  uf: string
}

// A conta de teste já tem uma lavoura com este nome: salvar outra igual dá 409.
export const APELIDO_REPETIDO = 'Talhão do fundo'

export const handlersDaLavoura = [
  http.get('/api/usuario/me', () => HttpResponse.json(usuario)),

  // O WhatsApp (34) 90000-0000 já está em outra conta.
  http.patch('/api/usuario/me', async ({ request }) => {
    const mudancas = (await request.json()) as Record<string, unknown>
    if (
      typeof mudancas.whatsappNumero === 'string' &&
      mudancas.whatsappNumero.includes('90000-0000')
    ) {
      return HttpResponse.json(
        { status: 409, mensagem: 'Este WhatsApp já está em outra conta.' },
        { status: 409 },
      )
    }
    return HttpResponse.json({ ...usuario, ...mudancas })
  }),

  // Como na especificação: a senha errada responde 401.
  http.delete('/api/usuario/me', async ({ request }) => {
    const { senha } = (await request.json()) as { senha?: string }
    if (senha !== SENHA_DE_TESTE) {
      return HttpResponse.json({ status: 401, mensagem: 'Senha incorreta.' }, { status: 401 })
    }
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/api/painel', () => HttpResponse.json(painel())),

  http.get('/api/cultivos/:id', ({ params }) => {
    const lavoura = detalhe(Number(params.id))
    if (!lavoura) {
      return HttpResponse.json(
        { status: 404, mensagem: 'Lavoura não encontrada.' },
        { status: 404 },
      )
    }
    return HttpResponse.json(lavoura)
  }),

  http.get('/api/cultivos/:id/alertas', ({ request }) => {
    const busca = new URL(request.url).searchParams
    const severidade = busca.get('severidade')
    const pagina = Number(busca.get('pagina') ?? 0)
    const tamanho = 20
    const todos = historico().filter((aviso) => !severidade || aviso.severidade === severidade)
    return HttpResponse.json({
      itens: todos.slice(pagina * tamanho, (pagina + 1) * tamanho),
      total: todos.length,
      pagina,
      tamanho,
    })
  }),

  http.patch('/api/cultivos/:id', async ({ params, request }) => {
    const lavoura = detalhe(Number(params.id))
    if (!lavoura) {
      return HttpResponse.json(
        { status: 404, mensagem: 'Lavoura não encontrada.' },
        { status: 404 },
      )
    }
    const mudancas = (await request.json()) as Record<string, unknown>
    const outra = painel().cultivos.find(
      ({ id, apelido }) => id !== lavoura.id && apelido === mudancas.apelido,
    )
    if (outra) {
      return HttpResponse.json(
        { status: 409, mensagem: 'Você já tem uma lavoura com esse nome.' },
        { status: 409 },
      )
    }
    return HttpResponse.json({ ...lavoura, ...mudancas })
  }),

  http.delete('/api/cultivos/:id', ({ params }) => {
    if (!detalhe(Number(params.id))) {
      return HttpResponse.json(
        { status: 404, mensagem: 'Lavoura não encontrada.' },
        { status: 404 },
      )
    }
    return new HttpResponse(null, { status: 204 })
  }),

  http.post('/api/cultivos', async ({ request }) => {
    const novo = (await request.json()) as NovoCultivo
    if (novo.apelido === APELIDO_REPETIDO) {
      return HttpResponse.json(
        { status: 409, mensagem: 'Você já tem uma lavoura com esse nome.' },
        { status: 409 },
      )
    }
    const cultura = culturas.find(({ id }) => id === novo.culturaId)
    return HttpResponse.json(
      {
        id: 10,
        apelido: novo.apelido,
        cultura: cultura?.nome ?? '',
        dataPlantio: novo.dataPlantio,
        colheitaPrevista: novo.dataPlantio,
        areaHa: novo.areaHa ?? null,
        latitude: novo.latitude,
        longitude: novo.longitude,
        municipio: `${novo.cidade} – ${novo.uf}`,
        status: 'em_andamento',
      },
      { status: 201 },
    )
  }),
]
