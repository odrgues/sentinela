import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { chamarApi } from '../../shared/api/cliente'
import type { ErroApi } from '../../shared/api/erros'
import { apagarToken, guardarToken } from '../../shared/api/sessao'
import type { Entrada } from '../../shared/api/tipos/usuario'

export const SENHA_ALTERADA = 'Senha alterada. Entre com a nova senha.'

type DadosDoLogin = { email: string; senha: string }

export function useEntrar() {
  const navegar = useNavigate()

  return useMutation<Entrada, ErroApi, DadosDoLogin>({
    mutationFn: (dados) => chamarApi<Entrada>('auth/login', { metodo: 'POST', corpo: dados }),
    onSuccess: ({ token }) => {
      guardarToken(token)
      navegar('/')
    },
  })
}

type DadosDoCadastro = {
  nome: string
  email: string
  senha: string
  whatsappNumero?: string
}

// A pessoa já sai do cadastro logada e vai marcar a primeira lavoura.
export function useCadastrar() {
  const navegar = useNavigate()

  return useMutation<Entrada, ErroApi, DadosDoCadastro>({
    mutationFn: (dados) => chamarApi<Entrada>('usuario', { metodo: 'POST', corpo: dados }),
    onSuccess: ({ token }) => {
      guardarToken(token)
      navegar('/lavouras/nova')
    },
  })
}

// O backend responde 200 tendo conta ou não, para ninguém descobrir quem tem cadastro.
export function usePedirLink() {
  return useMutation<unknown, ErroApi, string>({
    mutationFn: (email) => chamarApi('auth/esqueci-senha', { metodo: 'POST', corpo: { email } }),
  })
}

type DadosDaNovaSenha = { token: string; novaSenha: string }

// Depois de trocar a senha, a pessoa entra de novo, mesmo se estava logada.
export function useRedefinirSenha() {
  const navegar = useNavigate()

  return useMutation<unknown, ErroApi, DadosDaNovaSenha>({
    mutationFn: (dados) => chamarApi('auth/redefinir-senha', { metodo: 'POST', corpo: dados }),
    onSuccess: () => {
      apagarToken()
      navegar('/entrar', { state: { mensagem: SENHA_ALTERADA } })
    },
  })
}
