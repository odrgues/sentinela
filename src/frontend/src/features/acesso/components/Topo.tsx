import { Marca } from '../../../shared/ui/Marca'
import { Voltar, type Destino } from '../../../shared/ui/Voltar'
import * as S from './Topo.styles'

// A linha do alto das telas sem faixa verde: a seta de voltar e, se pedir, a marca no meio.
export function Topo({ voltar, comMarca = false }: { voltar?: Destino; comMarca?: boolean }) {
  return (
    <S.Topo>
      {voltar && <Voltar {...voltar} />}
      {comMarca && <Marca />}
      {voltar && comMarca && <S.Vazio />}
    </S.Topo>
  )
}
