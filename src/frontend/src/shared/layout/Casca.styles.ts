import { Link, NavLink } from 'react-router'
import styled from 'styled-components'

export const Pagina = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`

export const Conteudo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`

export const Barra = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.espaco[6]};
  padding: ${({ theme }) => theme.espaco[6]} ${({ theme }) => theme.espaco[13]};
  background: ${({ theme }) => theme.cores.fundo.cartao};
  border-bottom: ${({ theme }) => theme.espessura.linha} solid
    ${({ theme }) => theme.cores.borda.cartao};
`

export const Esquerda = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[12]};
`

export const LinkDaMarca = styled(Link)`
  text-decoration: none;
`

export const Menu = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.espaco[2]};
`

export const ItemDoMenu = styled(NavLink)`
  padding: ${({ theme }) => theme.espaco[5]} ${({ theme }) => theme.espaco[8]};
  border-radius: ${({ theme }) => theme.raio.etiqueta};
  font-size: ${({ theme }) => theme.fonte.tamanho.corpo};
  font-weight: ${({ theme }) => theme.fonte.peso.forte};
  color: ${({ theme }) => theme.cores.texto.principal};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.cores.texto.principal};
    background: ${({ theme }) => theme.cores.fundo.carregandoSuave};
  }

  &[aria-current='page'] {
    background: ${({ theme }) => theme.cores.destaque.suave};
    color: ${({ theme }) => theme.cores.destaque.sobreSuave};
  }
`

export const LinkDaConta = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espaco[5]};
  padding: ${({ theme }) => theme.espaco[3]} ${({ theme }) => theme.espaco[6]}
    ${({ theme }) => theme.espaco[3]} ${({ theme }) => theme.espaco[3]};
  border-radius: ${({ theme }) => theme.raio.pilula};
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
