import { useEffect } from 'react'
import { useRouteError } from 'react-router'
import { Botao } from '../../shared/ui/Botao'
import * as S from './ErroNaTela.styles'

// Quando uma tela quebra (por exemplo, o mapa falhando), mostra isto no lugar
// da tela, com a barra do topo no lugar, em vez do erro em inglês do React Router.
export function ErroNaTela() {
  const erro = useRouteError()

  useEffect(() => {
    console.error(erro)
  }, [erro])

  return (
    <S.Tela>
      <h1>Algo deu errado nesta tela</h1>
      <p>Tente carregar a página novamente.</p>
      <S.Acoes>
        <Botao onClick={() => window.location.reload()}>Carregar novamente</Botao>
      </S.Acoes>
    </S.Tela>
  )
}
