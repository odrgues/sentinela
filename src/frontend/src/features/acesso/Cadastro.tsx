import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { erroGeral } from '../../shared/api/erros'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao } from '../../shared/ui/Botao'
import { Campo } from '../../shared/ui/Campo'
import * as S from './acesso.styles'
import { useCadastrar } from './api'
import { TelaDividida } from './components/TelaDividida'

const TAMANHO_MINIMO_DA_SENHA = 6

type Erros = { nome?: string; email?: string; senha?: string }

function validar(nome: string, email: string, senha: string): Erros {
  const erros: Erros = {}
  if (!nome.trim()) erros.nome = 'Digite seu nome.'
  if (!email.trim()) erros.email = 'Digite seu e-mail.'
  if (senha.length < TAMANHO_MINIMO_DA_SENHA) {
    erros.senha = 'A senha precisa ter pelo menos 6 caracteres.'
  }
  return erros
}

export function Cadastro() {
  const cadastrar = useCadastrar()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [erros, setErros] = useState<Erros>({})

  const camposDaApi = cadastrar.error?.campos ?? {}
  const erro = erroGeral(cadastrar.error)

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const novosErros = validar(nome, email, senha)
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) return

    cadastrar.mutate({
      nome: nome.trim(),
      email: email.trim(),
      senha,
      whatsappNumero: whatsapp.trim() || undefined,
    })
  }

  return (
    <TelaDividida>
      <S.Formulario onSubmit={enviar} noValidate>
        <S.Cabecalho>
          <S.Titulo>Criar conta</S.Titulo>
          <S.Explicacao>
            Leva menos de um minuto. Depois você marca a sua lavoura no mapa.
          </S.Explicacao>
        </S.Cabecalho>
        <Campo
          rotulo="Seu nome"
          placeholder="Como você quer ser chamado"
          autoComplete="name"
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
          erro={erros.nome ?? camposDaApi.nome}
        />
        <Campo
          rotulo="E-mail"
          type="email"
          placeholder="email@exemplo.com"
          autoComplete="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          erro={erros.email ?? camposDaApi.email}
        />
        <Campo
          rotulo="Senha"
          type="password"
          placeholder="*********"
          autoComplete="new-password"
          dica="Pelo menos 6 caracteres."
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          erro={erros.senha ?? camposDaApi.senha}
        />
        <Campo
          rotulo="WhatsApp"
          opcional
          type="tel"
          placeholder="(34) 99999-9999"
          autoComplete="tel"
          dica="Para receber os avisos no WhatsApp."
          value={whatsapp}
          onChange={(evento) => setWhatsapp(evento.target.value)}
          erro={camposDaApi.whatsappNumero}
        />
        {erro && <AvisoDeErro titulo={erro.message} />}
        <Botao type="submit" disabled={cadastrar.isPending}>
          {cadastrar.isPending ? 'Criando a conta…' : 'Criar conta'}
        </Botao>
        <S.Rodape>
          <span>Já tem conta?</span>
          <Link to="/entrar">Entrar</Link>
        </S.Rodape>
      </S.Formulario>
    </TelaDividida>
  )
}
