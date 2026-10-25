import { LockKeyhole } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { useTheme } from 'styled-components'
import { erroGeral } from '../../shared/api/erros'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao } from '../../shared/ui/Botao'
import { Campo } from '../../shared/ui/Campo'
import * as S from './acesso.styles'
import { usePedirLink } from './api'
import { EmailEnviado } from './components/EmailEnviado'
import { TelaCentral } from './components/TelaCentral'
import { Topo } from './components/Topo'

export function EsqueciSenha() {
  const tema = useTheme()
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
      <TelaCentral>
        <EmailEnviado email={enviadoPara} aoVoltar={() => setEnviadoPara(null)} />
      </TelaCentral>
    )
  }

  return (
    <TelaCentral>
      <Topo voltar={{ para: '/entrar', rotulo: 'Voltar para o login' }} />
      <S.Formulario onSubmit={enviar} noValidate>
        <S.IconeEmDestaque $tom="ok">
          <LockKeyhole size={tema.icone.destaque} aria-hidden />
        </S.IconeEmDestaque>
        <S.Cabecalho>
          <S.Titulo>Esqueceu a senha?</S.Titulo>
          <S.Texto>
            Sem problema. Digite o e-mail da sua conta e mandamos um link para você criar uma senha
            nova.
          </S.Texto>
        </S.Cabecalho>
        <Campo
          rotulo="E-mail"
          type="email"
          placeholder="seuemail@exemplo.com"
          autoComplete="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          erro={erroDoEmail ?? pedirLink.error?.campos.email}
        />
        {erro && <AvisoDeErro titulo={erro.message} />}
        <Botao type="submit" disabled={pedirLink.isPending}>
          {pedirLink.isPending ? 'Enviando…' : 'Enviar link'}
        </Botao>
        <S.Espaco />
        <S.Rodape>
          <span>Lembrou?</span>
          <Link to="/entrar">Voltar para o login</Link>
        </S.Rodape>
      </S.Formulario>
    </TelaCentral>
  )
}
