import { ErroApi, MENSAGENS, erroDaResposta } from './erros'
import { encerrarSessaoVencida, lerToken } from './sessao'

export type Parametros = Record<string, string | number | undefined>

type Opcoes = {
  metodo?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  corpo?: unknown
  parametros?: Parametros
  // Para quando o 401 quer dizer outra coisa: no Excluir conta, é a senha errada.
  vencerSessaoNo401?: boolean
}

export function enderecoDaApi(caminho: string, parametros: Parametros = {}) {
  // Em desenvolvimento fica vazia e o Vite repassa /api para o backend. No build de produção,
  // é o endereço da API no Azure (ver .env.example).
  const base = import.meta.env.VITE_API_URL ?? ''
  const query = new URLSearchParams()
  for (const [chave, valor] of Object.entries(parametros)) {
    if (valor !== undefined && valor !== '') query.set(chave, String(valor))
  }
  const texto = query.toString()
  return texto ? `${base}/api/${caminho}?${texto}` : `${base}/api/${caminho}`
}

// O único lugar que chama a API. Põe o token, manda o corpo em JSON e
// transforma qualquer falha num ErroApi com a mensagem pronta para a pessoa.
export async function chamarApi<T>(caminho: string, opcoes: Opcoes = {}): Promise<T> {
  const { metodo = 'GET', corpo, parametros, vencerSessaoNo401 = true } = opcoes
  const cabecalhos: Record<string, string> = {}
  const token = lerToken()
  if (token) cabecalhos.Authorization = `Bearer ${token}`
  if (corpo !== undefined) cabecalhos['Content-Type'] = 'application/json'

  let resposta: Response
  try {
    resposta = await fetch(enderecoDaApi(caminho, parametros), {
      method: metodo,
      headers: cabecalhos,
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    })
  } catch {
    throw new ErroApi(MENSAGENS.semConexao, null)
  }

  // Um 401 com token é sessão vencida. Sem token, é o login dizendo que a senha está errada.
  if (resposta.status === 401 && token && vencerSessaoNo401) encerrarSessaoVencida()

  // 204: deu certo e não tem corpo (excluir lavoura, excluir conta).
  if (resposta.status === 204) return undefined as T

  let dados: unknown
  try {
    dados = await resposta.json()
  } catch {
    if (!resposta.ok) throw erroDaResposta(resposta.status, null)
    throw new ErroApi(MENSAGENS.servidor, resposta.status)
  }

  if (!resposta.ok) throw erroDaResposta(resposta.status, dados)
  return dados as T
}
