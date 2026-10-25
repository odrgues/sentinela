import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { chamarApi } from '../../shared/api/cliente'
import type { ErroApi } from '../../shared/api/erros'
import { apagarToken } from '../../shared/api/sessao'
import type { Usuario } from '../../shared/api/tipos/usuario'

// Só o que mudou. whatsappNumero: null desvincula o WhatsApp.
export type MudancasNaConta = {
  nome?: string
  whatsappNumero?: string | null
  avisosWhatsapp?: boolean
}

export function useSalvarConta() {
  const clienteDeConsultas = useQueryClient()

  return useMutation<Usuario, ErroApi, MudancasNaConta>({
    mutationFn: (mudancas) =>
      chamarApi<Usuario>('usuario/me', { metodo: 'PATCH', corpo: mudancas }),
    onSuccess: (usuario) => {
      clienteDeConsultas.setQueryData(['usuario'], usuario)
      clienteDeConsultas.invalidateQueries({ queryKey: ['painel'] })
    },
  })
}

// "Trocar minha senha" não tem rota própria: manda o mesmo link do "Esqueci minha senha".
export function usePedirTrocaDeSenha() {
  return useMutation<unknown, ErroApi, string>({
    mutationFn: (email) => chamarApi('auth/esqueci-senha', { metodo: 'POST', corpo: { email } }),
  })
}

// Sair é só apagar o token e o que ficou guardado da conta.
export function useSair() {
  const navegar = useNavigate()
  const clienteDeConsultas = useQueryClient()

  return () => {
    apagarToken()
    clienteDeConsultas.clear()
    navegar('/entrar', { replace: true })
  }
}

export function useExcluirConta() {
  const navegar = useNavigate()
  const clienteDeConsultas = useQueryClient()

  return useMutation<void, ErroApi, string>({
    // A especificação responde 401 para a senha errada; aqui o 401 não é sessão vencida.
    mutationFn: (senha) =>
      chamarApi<void>('usuario/me', {
        metodo: 'DELETE',
        corpo: { senha },
        vencerSessaoNo401: false,
      }),
    onSuccess: () => {
      apagarToken()
      clienteDeConsultas.clear()
      navegar('/entrar', { replace: true, state: { mensagem: 'Sua conta foi excluída.' } })
    },
  })
}
