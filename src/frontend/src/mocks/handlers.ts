import { handlersDeAcesso } from './acesso'
import { culturas } from './dados/culturas'
import { handlersDaLavoura } from './lavoura'
import { sucesso } from './respostas'

export const handlers = [
  ...handlersDeAcesso,
  ...handlersDaLavoura,
  sucesso('get', 'culturas', culturas),
]
