import { CloudSunRain, MessageCircle, Snowflake } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { useTheme } from 'styled-components'
import { erroGeral } from '../../shared/api/erros'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao } from '../../shared/ui/Botao'
import { Campo } from '../../shared/ui/Campo'
import { Marca } from '../../shared/ui/Marca'
import { Mensagem } from '../../shared/ui/Mensagem'
import * as S from './acesso.styles'
import { useEntrar } from './api'
import { FaixaVerde } from './components/FaixaVerde'
import { TelaDividida } from './components/TelaDividida'

const LEMA = 'A previsão do tempo traduzida para a sua lavoura.'

type Erros = { email?: string; senha?: string }

function validar(email: string, senha: string): Erros {
  const erros: Erros = {}
  if (!email.trim()) erros.email = 'Digite seu e-mail.'
  if (!senha) erros.senha = 'Digite sua senha.'
  return erros
}

export function Entrar() {
  const tema = useTheme()
  const { state } = useLocation()
  const entrar = useEntrar()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState<Erros>({})

  // Quem acabou de trocar a senha chega aqui com a mensagem de sucesso; quem teve a sessão
  // vencida, com o aviso.
  const mensagem = typeof state?.mensagem === 'string' ? state.mensagem : null
  const aviso = typeof state?.aviso === 'string' ? state.aviso : null
  const erro = erroGeral(entrar.error)

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const novosErros = validar(email, senha)
    setErros(novosErros)
    if (Object.keys(novosErros).length === 0) entrar.mutate({ email: email.trim(), senha })
  }

  const faixa = (
    <FaixaVerde comMarcador>
      <Marca sobreVerde grande />
      <S.CartaoDaFaixa>
        <S.ChamadaDaFaixa>{LEMA}</S.ChamadaDaFaixa>
        <S.ListaDaFaixa>
          <S.ItemDaFaixa>
            <Snowflake size={tema.icone.aviso} aria-hidden />
            Avisos de geada, calor e chuva feitos para a sua cultura
          </S.ItemDaFaixa>
          <S.ItemDaFaixa>
            <CloudSunRain size={tema.icone.aviso} aria-hidden />A semana inteira explicada em uma
            frase
          </S.ItemDaFaixa>
          <S.ItemDaFaixa>
            <MessageCircle size={tema.icone.aviso} aria-hidden />
            Os avisos também chegam no seu WhatsApp
          </S.ItemDaFaixa>
        </S.ListaDaFaixa>
      </S.CartaoDaFaixa>
    </FaixaVerde>
  )

  const topoNoCelular = (
    <FaixaVerde comMarcador>
      <div>
        <Marca sobreVerde grande />
        <S.Lema>{LEMA}</S.Lema>
      </div>
    </FaixaVerde>
  )

  return (
    <TelaDividida faixa={faixa} topoNoCelular={topoNoCelular}>
      {mensagem && <Mensagem texto={mensagem} />}
      <S.Formulario onSubmit={enviar} noValidate>
        <S.Titulo>Entrar</S.Titulo>
        <Campo
          rotulo="E-mail"
          type="email"
          placeholder="seuemail@exemplo.com"
          autoComplete="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          erro={erros.email ?? entrar.error?.campos.email}
        />
        <Campo
          rotulo="Senha"
          type="password"
          placeholder="Sua senha"
          autoComplete="current-password"
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          erro={erros.senha ?? entrar.error?.campos.senha}
        />
        <S.LinkDaDireita>
          <Link to="/esqueci-senha">Esqueci minha senha</Link>
        </S.LinkDaDireita>
        {aviso && !entrar.error && <AvisoDeErro titulo={aviso} />}
        {erro && (
          <AvisoDeErro
            titulo={erro.message}
            texto={
              erro.status === 401
                ? 'Confira e tente de novo. Se não lembrar, use “Esqueci minha senha”.'
                : undefined
            }
          />
        )}
        <Botao type="submit" disabled={entrar.isPending}>
          {entrar.isPending ? 'Entrando…' : 'Entrar'}
        </Botao>
        <S.Espaco />
        <S.Rodape>
          <span>Ainda não tem conta?</span>
          <Link to="/cadastro">Criar conta</Link>
        </S.Rodape>
      </S.Formulario>
    </TelaDividida>
  )
}
