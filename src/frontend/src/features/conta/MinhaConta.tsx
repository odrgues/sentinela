import { LogOut, X } from 'lucide-react'
import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useLocation, useNavigate } from 'react-router'
import { useTheme } from 'styled-components'
import { erroGeral, erroPassageiro } from '../../shared/api/erros'
import type { Usuario } from '../../shared/api/tipos/usuario'
import { useUsuario } from '../../shared/api/useUsuario'
import { telefone } from '../../shared/formato/telefone'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao } from '../../shared/ui/Botao'
import { Campo } from '../../shared/ui/Campo'
import { Chave } from '../../shared/ui/Chave'
import { Mensagem } from '../../shared/ui/Mensagem'
import { SoParaLeitor } from '../../shared/ui/SoParaLeitor'
import { usePedirTrocaDeSenha, useSair, useSalvarConta, type MudancasNaConta } from './api'
import { ExcluirConta } from './ExcluirConta'
import * as S from './MinhaConta.styles'

function Conta({ usuario }: { usuario: Usuario }) {
  const tema = useTheme()
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
          explicacao="Riscos críticos às 6h e o resumo de segunda."
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

      <S.Rodape>
        <Botao variante="neutro" onClick={sair}>
          <LogOut size={tema.icone.selo} aria-hidden />
          &nbsp;Sair
        </Botao>
        <ExcluirConta
          abrir={(abrirConfirmacao) => (
            <S.Excluir type="button" onClick={abrirConfirmacao}>
              Excluir minha conta
            </S.Excluir>
          )}
        />
      </S.Rodape>
    </>
  )
}

// Fecha a janela: primeiro ela sai animada, depois volta para a página de onde veio (ou para o
// painel, se a pessoa abriu /conta direto; ou tira o ?conta do endereço).
function useFechar() {
  const navegar = useNavigate()
  const { key, pathname } = useLocation()
  const [fechando, setFechando] = useState(false)
  const relogio = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(relogio.current), [])

  function fechar() {
    if (fechando) return
    setFechando(true)
    const semMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    relogio.current = setTimeout(
      () => {
        if (key !== 'default') navegar(-1)
        // Aberta direto pelo endereço: tira o ?conta (ou sai de /conta para o painel).
        else if (pathname === '/conta') navegar('/', { replace: true, viewTransition: false })
        else navegar(pathname, { replace: true, viewTransition: false })
      },
      semMovimento ? 0 : S.DURACAO_DA_SAIDA,
    )
  }

  return { fechando, fechar }
}

// A janela por cima da tela: no computador, no meio; no celular, sobe de baixo. Fecha com o X,
// com Esc ou tocando fora, e devolve o foco para quem abriu.
function Janela({ children }: { children: ReactNode }) {
  const tema = useTheme()
  const idDoTitulo = useId()
  const janela = useRef<HTMLDivElement>(null)
  const { fechando, fechar } = useFechar()
  const fecharComEsc = useEffectEvent(() => fechar())

  useEffect(() => {
    const quemAbriu = document.activeElement as HTMLElement | null
    janela.current?.focus()

    // Com a confirmação de excluir aberta por cima, o Esc é dela.
    function aoApertar(evento: KeyboardEvent) {
      if (evento.key === 'Escape' && janela.current?.contains(document.activeElement)) {
        fecharComEsc()
      }
    }
    document.addEventListener('keydown', aoApertar)
    return () => {
      document.removeEventListener('keydown', aoApertar)
      quemAbriu?.focus()
    }
  }, [])

  return createPortal(
    <S.Veu
      $fechando={fechando}
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) fechar()
      }}
    >
      <S.Janela
        ref={janela}
        $fechando={fechando}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idDoTitulo}
        tabIndex={-1}
      >
        {/* O título não aparece (a foto abre a janela), mas dá nome a ela para o leitor de tela. */}
        <SoParaLeitor as="h1" id={idDoTitulo}>
          Minha conta
        </SoParaLeitor>
        <S.Faixa>
          <S.Alca aria-hidden />
          <S.Fechar type="button" onClick={fechar} aria-label="Fechar">
            <X size={tema.icone.botao} aria-hidden />
          </S.Fechar>
        </S.Faixa>
        <S.Corpo>{children}</S.Corpo>
      </S.Janela>
    </S.Veu>,
    document.body,
  )
}

// A janela da conta: com ?conta no endereço, abre por cima da página atual (na Casca); em /conta,
// por cima do painel.
export function MinhaConta() {
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

  return <Janela>{conteudo}</Janela>
}
