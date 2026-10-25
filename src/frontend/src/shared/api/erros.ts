export const MENSAGENS = {
  sessaoExpirada: 'Sua sessão expirou. Entre de novo.',
  naoEncontrado: 'Não encontramos o que você procurou.',
  pedidoRecusado: 'Não foi possível fazer isso agora. Confira os dados e tente de novo.',
  servidor: 'O servidor teve um problema. Tente de novo em alguns minutos.',
  semConexao: 'Sem conexão com o servidor. Confira a internet e tente de novo.',
}

export type ErrosDosCampos = Record<string, string>

export class ErroApi extends Error {
  readonly status: number | null
  readonly campos: ErrosDosCampos

  constructor(mensagem: string, status: number | null, campos: ErrosDosCampos = {}) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
    this.campos = campos
  }
}

// O formato de erro combinado com o backend: { mensagem, campos }.
type CorpoDeErro = {
  mensagem?: unknown
  campos?: unknown
}

function texto(valor: unknown): string | undefined {
  return typeof valor === 'string' && valor !== '' ? valor : undefined
}

function errosDosCampos(valor: unknown): ErrosDosCampos {
  if (typeof valor !== 'object' || valor === null) return {}
  return Object.fromEntries(
    Object.entries(valor).filter((par): par is [string, string] => typeof par[1] === 'string'),
  )
}

export function erroDaResposta(status: number, corpo: unknown): ErroApi {
  const { mensagem, campos } = (corpo ?? {}) as CorpoDeErro
  const mensagemDaApi = texto(mensagem)

  // Nos 4xx, a mensagem do backend é a melhor: "E-mail ou senha incorretos", "Este link expirou".
  if (status >= 400 && status < 500 && mensagemDaApi) {
    return new ErroApi(mensagemDaApi, status, errosDosCampos(campos))
  }
  if (status === 401) return new ErroApi(MENSAGENS.sessaoExpirada, status)
  if (status === 404) return new ErroApi(MENSAGENS.naoEncontrado, status)
  if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
    return new ErroApi(MENSAGENS.pedidoRecusado, status, errosDosCampos(campos))
  }
  return new ErroApi(MENSAGENS.servidor, status)
}

// Sem conexão, erro do servidor ou resposta que não deu para ler podem passar sozinhos;
// pedido errado não.
export function erroPassageiro(erro: Error) {
  if (!(erro instanceof ErroApi)) return true
  if (erro.status === null || erro.status < 400) return true
  return erro.status >= 500 || erro.status === 408 || erro.status === 429
}

// O erro que vai na caixa em cima do botão. Quando a API aponta os campos, cada erro aparece
// embaixo do seu campo, e a caixa não aparece.
export function erroGeral(erro: ErroApi | null): ErroApi | null {
  if (!erro || Object.keys(erro.campos).length > 0) return null
  return erro
}
