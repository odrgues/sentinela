import { LogOut } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useTheme } from 'styled-components'
import { erroGeral, erroPassageiro } from '../../shared/api/erros'
import type { Usuario } from '../../shared/api/tipos/usuario'
import { useUsuario } from '../../shared/api/useUsuario'
import { telefone } from '../../shared/formato/telefone'
import { useNoComputador } from '../../shared/layout/useNoComputador'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao } from '../../shared/ui/Botao'
import { Campo } from '../../shared/ui/Campo'
import { Chave } from '../../shared/ui/Chave'
import { Mensagem } from '../../shared/ui/Mensagem'
import { Voltar } from '../../shared/ui/Voltar'
import { usePedirTrocaDeSenha, useSair, useSalvarConta, type MudancasNaConta } from './api'
import { ExcluirConta } from './ExcluirConta'
import * as S from './MinhaConta.styles'

function Conta({ usuario }: { usuario: Usuario }) {
  const tema = useTheme()
  const noComputador = useNoComputador()
  const salvar = useSalvarConta()
  const trocarSenha = usePedirTrocaDeSenha()
  const sair = useSair()
  const [nome, setNome] = useState(usuario.nome)
  const [whatsapp, setWhatsapp] = useState(telefone(usuario.whatsappNumero))
  const [avisos, setAvisos] = useState(usuario.avisosWhatsapp ?? true)
  const [faltaNome, setFaltaNome] = useState(false)
  // Muda a cada salvar, para a mensagem "Alterações salvas" aparecer de novo.
  const [salvamentos, setSalvamentos] = useState(0)

  // O e-mail não muda, então o 409 só pode ser o WhatsApp de outra conta.
  const camposDaApi = salvar.error?.campos ?? {}
  const whatsappRepetido = salvar.error?.status === 409 ? salvar.error.message : undefined
  const erro = whatsappRepetido ? null : erroGeral(salvar.error)

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    setFaltaNome(!nome.trim())
    if (!nome.trim()) return

    const mudancas: MudancasNaConta = {}
    if (nome.trim() !== usuario.nome) mudancas.nome = nome.trim()
    if (whatsapp.trim() !== telefone(usuario.whatsappNumero)) {
      mudancas.whatsappNumero = whatsapp.trim() || null
    }
    if (avisos !== (usuario.avisosWhatsapp ?? true)) mudancas.avisosWhatsapp = avisos
    if (Object.keys(mudancas).length === 0) return

    salvar.mutate(mudancas, { onSuccess: () => setSalvamentos((vezes) => vezes + 1) })
  }

  const linkDaSenha = trocarSenha.isSuccess ? (
    <S.Enviado role="status">
      Mandamos um link para <strong>{usuario.email}</strong>. Ele vale por 30 minutos.
    </S.Enviado>
  ) : (
    <S.LinkDeTexto
      type="button"
      onClick={() => trocarSenha.mutate(usuario.email)}
      disabled={trocarSenha.isPending}
    >
      {trocarSenha.isPending ? 'Enviando o link…' : 'Trocar minha senha'}
    </S.LinkDeTexto>
  )

  return (
    <>
      {salvamentos > 0 && <Mensagem key={salvamentos} texto="Alterações salvas" />}
      <S.Formulario onSubmit={enviar} noValidate>
        <Campo
          rotulo="Nome"
          autoComplete="name"
          value={nome}
          onChange={(evento) => setNome(evento.target.value)}
          erro={faltaNome ? 'Digite seu nome.' : camposDaApi.nome}
        />
        <Campo
          rotulo="E-mail"
          type="email"
          value={usuario.email}
          readOnly
          dica="O e-mail é usado para entrar e não pode ser trocado."
        />
        <Campo
          rotulo="WhatsApp"
          type="tel"
          autoComplete="tel"
          placeholder="(34) 99999-9999"
          dica="É por aqui que chegam os avisos da sua lavoura."
          value={whatsapp}
          onChange={(evento) => setWhatsapp(evento.target.value)}
          erro={camposDaApi.whatsappNumero ?? whatsappRepetido}
        />
        <Chave
          rotulo="Receber avisos automáticos"
          explicacao="Riscos críticos às 6h e o resumo de segunda. Também dá para mandar PARAR ou VOLTAR no WhatsApp."
          ligada={avisos}
          aoMudar={setAvisos}
        />
        {erro && <AvisoDeErro titulo={erro.message} />}
        {trocarSenha.error && <AvisoDeErro titulo={trocarSenha.error.message} />}
        <S.LinhaDosBotoes>
          <Botao type="submit" disabled={salvar.isPending}>
            {salvar.isPending ? 'Salvando…' : 'Salvar'}
          </Botao>
          {linkDaSenha}
        </S.LinhaDosBotoes>
      </S.Formulario>

      <S.Espaco />

      {noComputador ? (
        <>
          <S.Faixa>
            <S.TextoDaFaixa>
              <strong>Sair desta conta</strong>
              <span>Você pode entrar de novo quando quiser.</span>
            </S.TextoDaFaixa>
            <Botao variante="neutro" onClick={sair}>
              <LogOut size={tema.icone.busca} aria-hidden />
              &nbsp;Sair
            </Botao>
          </S.Faixa>
          <ExcluirConta
            abrir={(abrirConfirmacao) => (
              <S.Faixa $perigo>
                <S.TextoDaFaixa $perigo>
                  <strong>Excluir minha conta</strong>
                  <span>Apaga suas lavouras e avisos. Isso não tem volta.</span>
                </S.TextoDaFaixa>
                <Botao variante="perigo" onClick={abrirConfirmacao}>
                  Excluir conta
                </Botao>
              </S.Faixa>
            )}
          />
        </>
      ) : (
        <>
          <Botao variante="neutro" onClick={sair}>
            <LogOut size={tema.icone.busca} aria-hidden />
            &nbsp;Sair
          </Botao>
          <ExcluirConta
            abrir={(abrirConfirmacao) => (
              <S.Excluir type="button" onClick={abrirConfirmacao}>
                Excluir minha conta
              </S.Excluir>
            )}
          />
        </>
      )}
    </>
  )
}

// /conta
export function MinhaConta() {
  const noComputador = useNoComputador()
  const usuario = useUsuario()

  let conteudo = <S.Aviso role="status">Carregando seus dados…</S.Aviso>
  if (usuario.data) {
    conteudo = <Conta usuario={usuario.data} />
  } else if (usuario.error) {
    conteudo = (
      <>
        <AvisoDeErro titulo={usuario.error.message} />
        {erroPassageiro(usuario.error) && (
          <Botao variante="neutro" onClick={() => usuario.refetch()}>
            Tentar de novo
          </Botao>
        )}
      </>
    )
  }

  return (
    <S.Pagina>
      {!noComputador && (
        <div>
          <Voltar para="/" rotulo="Voltar para o painel" />
        </div>
      )}
      <S.Titulo>Minha conta</S.Titulo>
      {conteudo}
    </S.Pagina>
  )
}
