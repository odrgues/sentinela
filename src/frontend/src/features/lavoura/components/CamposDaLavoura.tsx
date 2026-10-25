import { useCulturas } from '../../../shared/api/useCulturas'
import { hoje } from '../../../shared/formato/data'
import { Campo } from '../../../shared/ui/Campo'
import type { DadosDaLavoura, UnidadeDeArea } from '../tipos'
import type { ErrosDaLavoura } from '../validacao'
import { Escolha } from './detalhe/Escolha'
import { EscolherCultura } from './EscolherCultura'

const UNIDADES: { valor: UnidadeDeArea; nome: string }[] = [
  { valor: 'ha', nome: 'Hectares' },
  { valor: 'm2', nome: 'Metros quadrados (horta)' },
]

// Na perene, a data é de quando a lavoura existe; na hortaliça de muda, conta o transplante.
function dicaDaData(perene: boolean, continua: boolean) {
  if (perene) return 'Se a lavoura já produz, pode ser uma data aproximada.'
  if (continua) return 'Se plantou muda, use a data em que ela foi para o canteiro.'
  return undefined
}

type Props = {
  dados: DadosDaLavoura
  mudar: (mudanca: Partial<DadosDaLavoura>) => void
  erros: ErrosDaLavoura
}

// A cultura, o nome, a data e a área. Os mesmos campos em Nova lavoura e em Editar lavoura.
export function CamposDaLavoura({ dados, mudar, erros }: Props) {
  const culturas = useCulturas()
  const escolhida = culturas.data?.find((cultura) => cultura.id === dados.culturaId)
  const perene = escolhida?.tipoCiclo === 'perene'
  const continua = escolhida?.tipoCiclo === 'continua'
  const emMetros = dados.unidade === 'm2'

  return (
    <>
      <EscolherCultura
        escolhida={dados.culturaId}
        aoEscolher={(culturaId) => mudar({ culturaId })}
        erro={erros.cultura}
      />
      <Campo
        rotulo="Nome para esta lavoura"
        placeholder="Ex.: Talhão do fundo"
        dica="Para você reconhecer quando tiver mais de uma."
        value={dados.apelido}
        onChange={(evento) => mudar({ apelido: evento.target.value })}
        erro={erros.apelido}
      />
      <Campo
        rotulo={perene ? 'Desde quando a lavoura existe?' : 'Quando plantou?'}
        type="date"
        max={hoje()}
        dica={dicaDaData(perene, continua)}
        value={dados.dataPlantio}
        onChange={(evento) => mudar({ dataPlantio: evento.target.value })}
        erro={erros.dataPlantio}
      />
      <Campo
        rotulo={emMetros ? 'Tamanho em m²' : 'Tamanho em hectares'}
        opcional
        inputMode="decimal"
        placeholder={emMetros ? 'Ex.: 500' : 'Ex.: 12'}
        value={dados.area}
        onChange={(evento) => mudar({ area: evento.target.value })}
        erro={erros.area}
      />
      <Escolha
        rotulo="Unidade do tamanho"
        variante="filtros"
        opcoes={UNIDADES}
        escolhida={dados.unidade ?? 'ha'}
        aoEscolher={(unidade) => mudar({ unidade })}
      />
    </>
  )
}
