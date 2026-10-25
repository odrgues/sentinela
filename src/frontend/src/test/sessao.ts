import { guardarToken } from '../shared/api/sessao'

// Para os testes das telas que pedem login.
export function jaEntrou() {
  guardarToken('token-de-teste')
}
