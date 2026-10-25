import { useQueryClient } from '@tanstack/react-query'
import { UserRound } from 'lucide-react'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'
import { useTheme } from 'styled-components'
import { MENSAGENS } from '../api/erros'
import { SESSAO_VENCIDA } from '../api/sessao'
import { useUsuario } from '../api/useUsuario'
import { Marca } from '../ui/Marca'
import * as S from './Casca.styles'
import { useNoComputador } from './useNoComputador'

function BarraDoTopo() {
  const tema = useTheme()
  const { data: usuario } = useUsuario()

  return (
    <S.Barra>
      <S.Esquerda>
        <S.LinkDaMarca to="/" aria-label="Sentinela, ir para o painel">
          <Marca />
        </S.LinkDaMarca>
        <S.Menu aria-label="Principal">
          <S.ItemDoMenu to="/" end>
            Painel
          </S.ItemDoMenu>
          <S.ItemDoMenu to="/lavouras/nova">Nova lavoura</S.ItemDoMenu>
        </S.Menu>
      </S.Esquerda>
      <S.LinkDaConta to="/conta">
        <S.Avatar aria-hidden>
          {usuario ? usuario.nome.charAt(0).toUpperCase() : <UserRound size={tema.icone.botao} />}
        </S.Avatar>
        Minha conta
      </S.LinkDaConta>
    </S.Barra>
  )
}

// Em volta das telas de quem entrou. No computador, a barra do topo com o menu; no celular,
// cada tela tem o próprio topo. Também leva de volta ao login quando o token vence.
export function Casca() {
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
      {noComputador && <BarraDoTopo />}
      <S.Conteudo>
        <Outlet />
      </S.Conteudo>
    </S.Pagina>
  )
}
