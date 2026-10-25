import { http, HttpResponse, type JsonBodyType } from 'msw'
import type { ErrosDosCampos } from '../shared/api/erros'

type Metodo = 'get' | 'post' | 'patch' | 'delete'

export function sucesso(metodo: Metodo, caminho: string, corpo: JsonBodyType, status = 200) {
  return http[metodo](`/api/${caminho}`, () => HttpResponse.json(corpo, { status }))
}

export function semCorpo(metodo: Metodo, caminho: string) {
  return http[metodo](`/api/${caminho}`, () => new HttpResponse(null, { status: 204 }))
}

export function erroDaApi(
  metodo: Metodo,
  caminho: string,
  status: number,
  mensagem: string,
  campos?: ErrosDosCampos,
) {
  return http[metodo](`/api/${caminho}`, () =>
    HttpResponse.json({ mensagem, ...(campos && { campos }) }, { status }),
  )
}

export function semConexao(metodo: Metodo, caminho: string) {
  return http[metodo](`/api/${caminho}`, () => HttpResponse.error())
}
