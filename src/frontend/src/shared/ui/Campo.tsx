import { CircleAlert, Eye, EyeOff } from 'lucide-react'
import { useId, useState, type InputHTMLAttributes } from 'react'
import { useTheme } from 'styled-components'
import * as S from './Campo.styles'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  rotulo: string
  opcional?: boolean
  dica?: string
  erro?: string
}

// Rótulo, campo, erro e dica, já ligados entre si para o leitor de tela. No campo de senha, um
// botão no canto mostra ou esconde o que foi digitado.
export function Campo({ rotulo, opcional, dica, erro, ...entrada }: Props) {
  const id = useId()
  const tema = useTheme()
  const ehSenha = entrada.type === 'password'
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const idDoErro = `${id}-erro`
  const idDaDica = `${id}-dica`
  const descricao = [erro && idDoErro, dica && idDaDica].filter(Boolean).join(' ')

  return (
    <S.Grupo>
      <S.Rotulo htmlFor={id}>
        {rotulo}
        {opcional && <S.Opcional> (opcional)</S.Opcional>}
      </S.Rotulo>
      <S.CaixaDaEntrada>
        <S.Entrada
          id={id}
          aria-invalid={erro ? true : undefined}
          aria-describedby={descricao || undefined}
          $comErro={Boolean(erro)}
          $comBotao={ehSenha}
          {...entrada}
          type={ehSenha && mostrarSenha ? 'text' : entrada.type}
        />
        {ehSenha && (
          <S.BotaoDaSenha
            type="button"
            onClick={() => setMostrarSenha((mostrando) => !mostrando)}
            aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            aria-controls={id}
          >
            {mostrarSenha ? (
              <EyeOff size={tema.icone.busca} aria-hidden />
            ) : (
              <Eye size={tema.icone.busca} aria-hidden />
            )}
          </S.BotaoDaSenha>
        )}
      </S.CaixaDaEntrada>
      {erro && (
        <S.Erro id={idDoErro}>
          <CircleAlert size={tema.icone.erroDoCampo} aria-hidden />
          {erro}
        </S.Erro>
      )}
      {dica && <S.Dica id={idDaDica}>{dica}</S.Dica>}
    </S.Grupo>
  )
}
