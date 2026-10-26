import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { erroGeral } from '../../shared/api/erros'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao } from '../../shared/ui/Botao'
import { Campo } from '../../shared/ui/Campo'
import * as S from './acesso.styles'
import { usePedirLink } from './api'
import { EmailEnviado } from './components/EmailEnviado'
import { TelaDividida } from './components/TelaDividida'

export function EsqueciSenha() {
  const pedirLink = usePedirLink()
  const [email, setEmail] = useState('')
  const [erroDoEmail, setErroDoEmail] = useState<string>()
  const [enviadoPara, setEnviadoPara] = useState<string | null>(null)

  const erro = erroGeral(pedirLink.error)

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const digitado = email.trim()
    if (!digitado) {
      setErroDoEmail('Digite o e-mail da sua conta.')
      return
    }
    setErroDoEmail(undefined)
    pedirLink.mutate(digitado, { onSuccess: () => setEnviadoPara(digitado) })
  }

  if (enviadoPara) {
    return (
      <TelaDividida>
        <EmailEnviado email={enviadoPara} aoVoltar={() => setEnviadoPara(null)} />
      </TelaDividida>
    )
  }

  return (
    <TelaDividida>
      <S.Formulario onSubmit={enviar} noValidate>
        <S.Cabecalho>
          <S.Titulo>Esqueceu a senha?</S.Titulo>
          <S.Explicacao>
            Digite o e-mail da sua conta e enviaremos um link para você criar uma senha nova. O link
            vale por 30 minutos.
          </S.Explicacao>
        </S.Cabecalho>
        <Campo
          rotulo="E-mail"
          type="email"
          placeholder="email@exemplo.com"
          autoComplete="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          erro={erroDoEmail ?? pedirLink.error?.campos.email}
        />
        {erro && <AvisoDeErro titulo={erro.message} />}
        <Botao type="submit" disabled={pedirLink.isPending}>
          {pedirLink.isPending ? 'Enviando…' : 'Enviar link'}
        </Botao>
        <S.Rodape>
          <Link to="/entrar">Voltar para o login</Link>
        </S.Rodape>
      </S.Formulario>
    </TelaDividida>
  )
}
