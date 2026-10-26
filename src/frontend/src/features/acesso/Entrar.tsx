import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { erroGeral } from '../../shared/api/erros'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao } from '../../shared/ui/Botao'
import { Campo } from '../../shared/ui/Campo'
import { Mensagem } from '../../shared/ui/Mensagem'
import { SoParaLeitor } from '../../shared/ui/SoParaLeitor'
import * as S from './acesso.styles'
import { useEntrar } from './api'
import { TelaDividida } from './components/TelaDividida'

type Erros = { email?: string; senha?: string }

function validar(email: string, senha: string): Erros {
  const erros: Erros = {}
  if (!email.trim()) erros.email = 'Digite seu e-mail.'
  if (!senha) erros.senha = 'Digite sua senha.'
  return erros
}

export function Entrar() {
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

  return (
    <TelaDividida>
      {mensagem && <Mensagem texto={mensagem} />}
      {/* O título não aparece (o logo abre a tela), mas dá nome a ela para o leitor de tela. */}
      <SoParaLeitor as="h1">Entrar</SoParaLeitor>
      <S.Formulario onSubmit={enviar} noValidate>
        <Campo
          rotulo="E-mail"
          type="email"
          placeholder="email@exemplo.com"
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
        <S.Rodape>
          <Link to="/cadastro">Criar conta</Link>
        </S.Rodape>
      </S.Formulario>
    </TelaDividida>
  )
}
