import { useQueryClient } from '@tanstack/react-query'
import { UserRound } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import { Outlet, useLocation, useMatch, useNavigate, useSearchParams } from 'react-router'
import { useTheme } from 'styled-components'
import { MENSAGENS } from '../api/erros'
import { SESSAO_VENCIDA } from '../api/sessao'
import { useUsuario } from '../api/useUsuario'
import { Logo } from '../ui/Logo'
import * as S from './Casca.styles'
import { useNoComputador } from './useNoComputador'

function BarraDoTopo({ contaAberta }: { contaAberta: boolean }) {
  const tema = useTheme()
  const { data: usuario } = useUsuario()
  const { pathname } = useLocation()
  // No painel, o mapa ocupa a tela toda e a barra fica por cima dele. A conta abre por cima do
  // painel, então conta também.
  const noPainel = useMatch('/') !== null
  const naConta = useMatch('/conta') !== null
  // A nova lavoura e a edição são iguais ao painel: mapa na tela toda e vidro.
  const naNovaLavoura = useMatch('/lavouras/nova') !== null
  const naEdicao = useMatch('/lavouras/:id/editar') !== null
  const sobreOMapa = noPainel || naConta || naNovaLavoura || naEdicao

  return (
    <S.Barra $sobreOMapa={sobreOMapa}>
      <S.Esquerda>
        <S.LinkDaMarca to="/" aria-label="Sentinela, ir para o painel">
          <Logo pequeno />
        </S.LinkDaMarca>
        <S.Menu aria-label="Principal">
          <S.ItemDoMenu to="/" end>
            Painel
          </S.ItemDoMenu>
          <S.ItemDoMenu to="/lavouras/nova">Nova lavoura</S.ItemDoMenu>
        </S.Menu>
      </S.Esquerda>
      {/* A conta abre por cima da página em que a pessoa está (?conta no endereço), com a própria
          animação: sem a transição de página. */}
      <S.LinkDaConta
        to={{ pathname, search: '?conta' }}
        viewTransition={false}
        aria-current={contaAberta || naConta ? 'page' : undefined}
      >
        <S.Avatar aria-hidden>
          {usuario ? usuario.nome.charAt(0).toUpperCase() : <UserRound size={tema.icone.botao} />}
        </S.Avatar>
        Minha conta
      </S.LinkDaConta>
    </S.Barra>
  )
}

// Em volta das telas de quem entrou. No computador, a barra do topo com o menu; no celular,
// cada tela tem o próprio topo. Também leva de volta ao login quando o token vence. Com ?conta no
// endereço, abre a janela da conta por cima da página.
export function Casca({ janelaDaConta }: { janelaDaConta: ReactNode }) {
  const [busca] = useSearchParams()
  const contaAberta = busca.has('conta')
  const noComputador = useNoComputador()
  const navegar = useNavigate()
  const clienteDeConsultas = useQueryClient()

  useEffect(() => {
    function voltarAoLogin() {
      clienteDeConsultas.clear()
      navegar('/entrar', { replace: true, state: { aviso: MENSAGENS.sessaoExpirada } })
    }
    window.addEventListener(SESSAO_VENCIDA, voltarAoLogin)
    return () => window.removeEventListener(SESSAO_VENCIDA, voltarAoLogin)
  }, [clienteDeConsultas, navegar])

  return (
    <S.Pagina>
      {noComputador && <BarraDoTopo contaAberta={contaAberta} />}
      <S.Conteudo>
        <Outlet />
      </S.Conteudo>
      {contaAberta && janelaDaConta}
    </S.Pagina>
  )
}
