import { BotaoLink } from '../../shared/ui/Botao'
import { Logo } from '../../shared/ui/Logo'
import * as S from './ErroNaTela.styles'

// Um endereço que não existe: o logo, o aviso e o caminho de volta, centralizados.
export function NaoEncontrada() {
  return (
    <S.TelaInteira>
      <Logo animado={false} />
      <h1>Página não encontrada</h1>
      <p>O endereço pode estar errado, ou a página não existe mais.</p>
      <S.Acoes>
        <BotaoLink to="/">Voltar para o painel</BotaoLink>
      </S.Acoes>
    </S.TelaInteira>
  )
}
