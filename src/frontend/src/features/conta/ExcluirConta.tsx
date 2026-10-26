import { useCallback, useState, type FormEvent, type ReactNode } from 'react'
import { erroGeral } from '../../shared/api/erros'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao } from '../../shared/ui/Botao'
import { Campo } from '../../shared/ui/Campo'
import { Confirmacao } from '../../shared/ui/Confirmacao'
import { useExcluirConta } from './api'

// O botão que abre a confirmação. Excluir pede a senha, para ninguém apagar a conta de
// quem esqueceu o celular aberto.
export function ExcluirConta({ abrir }: { abrir: (abrirConfirmacao: () => void) => ReactNode }) {
  const excluir = useExcluirConta()
  const [aberta, setAberta] = useState(false)
  const [senha, setSenha] = useState('')
  const [faltaSenha, setFaltaSenha] = useState(false)
  const { reset } = excluir
  const fechar = useCallback(() => {
    setAberta(false)
    setSenha('')
    setFaltaSenha(false)
    reset()
  }, [reset])

  // A senha errada vem como 401 (ou 403): fica embaixo do campo.
  const senhaErrada =
    excluir.error?.status === 401 || excluir.error?.status === 403
      ? excluir.error.message
      : undefined
  const erro = senhaErrada ? null : erroGeral(excluir.error)

  function confirmar(evento: FormEvent) {
    evento.preventDefault()
    setFaltaSenha(!senha)
    if (senha) excluir.mutate(senha)
  }

  return (
    <>
      {abrir(() => setAberta(true))}
      {aberta && (
        <Confirmacao
          titulo="Excluir sua conta?"
          nivel="critico"
          aoFechar={fechar}
          acoes={
            <>
              {erro && <AvisoDeErro titulo={erro.message} />}
              <Botao
                variante="perigo"
                type="submit"
                form="excluir-conta"
                disabled={excluir.isPending}
              >
                {excluir.isPending ? 'Excluindo…' : 'Excluir minha conta'}
              </Botao>
              <Botao variante="neutro" onClick={fechar}>
                Cancelar
              </Botao>
            </>
          }
        >
          <p>
            Suas lavouras e todos os avisos serão apagados, e você para de receber mensagens no
            WhatsApp.
          </p>
          <form id="excluir-conta" onSubmit={confirmar} noValidate>
            <Campo
              rotulo="Digite sua senha para confirmar"
              type="password"
              placeholder="Sua senha"
              autoComplete="current-password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              erro={faltaSenha ? 'Digite sua senha.' : (excluir.error?.campos.senha ?? senhaErrada)}
            />
          </form>
        </Confirmacao>
      )}
    </>
  )
}
