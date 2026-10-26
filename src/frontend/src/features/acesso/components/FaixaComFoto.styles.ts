import styled from 'styled-components'
import folhas from '../../../assets/folhas.jpg'

// A cor de fundo aparece enquanto a foto carrega.
export const Foto = styled.div`
  background: ${({ theme }) => theme.cores.fundo.carregando} url(${folhas}) center / cover no-repeat;
`
