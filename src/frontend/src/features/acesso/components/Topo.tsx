import { Voltar, type Destino } from '../../../shared/ui/Voltar'
import * as S from './Topo.styles'

// A linha do alto das telas de acesso: a seta de voltar.
export function Topo({ voltar }: { voltar: Destino }) {
  return (
    <S.Topo>
      <Voltar {...voltar} />
    </S.Topo>
  )
}
