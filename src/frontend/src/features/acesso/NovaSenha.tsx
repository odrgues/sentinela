import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router'
import { erroGeral } from '../../shared/api/erros'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao, BotaoLink } from '../../shared/ui/Botao'
import { Campo } from '../../shared/ui/Campo'
import * as S from './acesso.styles'
import { useRedefinirSenha } from './api'
import { TelaDividida } from './components/TelaDividida'

const TAMANHO_MINIMO_DA_SENHA = 6

type Erros = { senha?: string; repetida?: string }

function validar(senha: string, repetida: string): Erros {
  const erros: Erros = {}
  if (senha.length < TAMANHO_MINIMO_DA_SENHA) {
    erros.senha = 'A senha precisa ter pelo menos 6 caracteres.'
  }
  if (!repetida) erros.repetida = 'Digite a senha de novo.'
  else if (repetida !== senha) erros.repetida = 'As senhas não são iguais.'
  return erros
}

function LinkExpirado() {
  return (
    <TelaDividida>
      <S.Conteudo>
        <S.Cabecalho>
          <S.Titulo>Este link expirou</S.Titulo>
          <S.Explicacao>
            Por segurança, o link vale por 30 minutos e só pode ser usado uma vez. Peça um novo,
            leva um minuto.
          </S.Explicacao>
        </S.Cabecalho>
        <BotaoLink to="/esqueci-senha">Pedir outro link</BotaoLink>
        <S.Rodape>
          <Link to="/entrar">Voltar para o login</Link>
        </S.Rodape>
      </S.Conteudo>
    </TelaDividida>
  )
}

// A tela que o link do e-mail abre: /nova-senha?token=…
export function NovaSenha() {
  const [busca] = useSearchParams()
  const token = busca.get('token')
  const redefinir = useRedefinirSenha()
  const [senha, setSenha] = useState('')
  const [repetida, setRepetida] = useState('')
  const [erros, setErros] = useState<Erros>({})

  // Sem token no endereço, ou o backend dizendo que o link venceu (410).
  if (!token || redefinir.error?.status === 410) return <LinkExpirado />

  const erro = erroGeral(redefinir.error)

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    const novosErros = validar(senha, repetida)
    setErros(novosErros)
    if (Object.keys(novosErros).length === 0 && token) {
      redefinir.mutate({ token, novaSenha: senha })
    }
  }

  return (
    <TelaDividida>
      <S.Formulario onSubmit={enviar} noValidate>
        <S.Cabecalho>
          <S.Titulo>Crie uma senha nova</S.Titulo>
          <S.Explicacao>
            Depois de salvar, você volta para o login e entra com a senha nova.
          </S.Explicacao>
        </S.Cabecalho>
        <Campo
          rotulo="Nova senha"
          type="password"
          placeholder="Crie uma senha"
          autoComplete="new-password"
          dica="Pelo menos 6 caracteres."
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          erro={erros.senha ?? redefinir.error?.campos.novaSenha}
        />
        <Campo
          rotulo="Repita a nova senha"
          type="password"
          placeholder="Digite de novo"
          autoComplete="new-password"
          value={repetida}
          onChange={(evento) => setRepetida(evento.target.value)}
          erro={erros.repetida}
        />
        {erro && <AvisoDeErro titulo={erro.message} />}
        <Botao type="submit" disabled={redefinir.isPending}>
          {redefinir.isPending ? 'Salvando…' : 'Salvar nova senha'}
        </Botao>
      </S.Formulario>
    </TelaDividida>
  )
}
