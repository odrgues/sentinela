import { Link, NavLink } from 'react-router'
import styled, { css } from 'styled-components'

export const Pagina = styled.div`
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`

export const Conteudo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

// A barra do topo no computador: o logo, o menu e a conta em pílulas brancas, sem faixa atrás.
// No painel, ela flutua por cima do mapa.
export const Barra = styled.header<{ $sobreOMapa: boolean }>`
  position: ${({ $sobreOMapa }) => ($sobreOMapa ? 'absolute' : 'relative')};
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  height: ${({ theme }) => theme.altura.barraDoTopo};
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* Na troca de página, a barra não some e volta: fica parada (ver EstiloGlobal). */
  view-transition-name: barra-do-topo;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: 0 ${({ theme }) => theme.espaco[10]};
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
`

const pilula = css`
  height: ${({ theme }) => theme.altura.botaoRedondo};
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-radius: ${({ theme }) => theme.raio.pilula};
  box-shadow: ${({ theme }) => theme.sombra.flutuante};
`

export const Esquerda = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[5]};
`

// O logo fica solto, sem pílula atrás.
export const LinkDaMarca = styled(Link)`
  display: flex;
  align-items: center;
  margin-right: ${({ theme }) => theme.espaco[5]};
  text-decoration: none;
`

export const Menu = styled.nav`
  ${pilula}
  gap: ${({ theme }) => theme.espaco[2]};
  padding: 0 ${({ theme }) => theme.espaco[2]};
`

export const ItemDoMenu = styled(NavLink)`
  padding: ${({ theme }) => theme.espaco[4]} ${({ theme }) => theme.espaco[8]};
  border-radius: ${({ theme }) => theme.raio.pilula};
  font-size: ${({ theme }) => theme.fonte.tamanho.pequeno};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.texto.principal};
  text-decoration: none;
  transition: background 200ms ease;

  &:hover {
    color: ${({ theme }) => theme.cores.texto.principal};
    background: ${({ theme }) => theme.cores.fundo.carregandoSuave};
  }

  &[aria-current='page'] {
    background: ${({ theme }) => theme.cores.destaque.suave};
    color: ${({ theme }) => theme.cores.destaque.sobreSuave};
  }
`

export const LinkDaConta = styled(Link)`
  ${pilula}
  gap: ${({ theme }) => theme.espaco[5]};
  padding: 0 ${({ theme }) => theme.espaco[8]} 0 ${({ theme }) => theme.espaco[3]};
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.texto.principal};
  text-decoration: none;

  &:hover,
  &[aria-current='page'] {
    color: ${({ theme }) => theme.cores.texto.principal};
    background: ${({ theme }) => theme.cores.destaque.suave};
  }
`

export const Avatar = styled.span`
  width: ${({ theme }) => theme.altura.avatar};
  height: ${({ theme }) => theme.altura.avatar};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.raio.circulo};
  background: ${({ theme }) => theme.cores.destaque.base};
  color: ${({ theme }) => theme.cores.texto.sobreDestaque};
  font-weight: ${({ theme }) => theme.fonte.peso.extra};
`
