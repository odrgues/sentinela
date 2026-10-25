import { useCulturas } from '../../../shared/api/useCulturas'
import { hoje } from '../../../shared/formato/data'
import { Campo } from '../../../shared/ui/Campo'
import type { DadosDaLavoura } from '../tipos'
import type { ErrosDaLavoura } from '../validacao'
import { EscolherCultura } from './EscolherCultura'

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
        dica={
          perene ? 'No café, a colheita prevista é sempre a próxima, a partir de maio.' : undefined
        }
        value={dados.dataPlantio}
        onChange={(evento) => mudar({ dataPlantio: evento.target.value })}
        erro={erros.dataPlantio}
      />
      <Campo
        rotulo="Tamanho em hectares"
        opcional
        inputMode="decimal"
        placeholder="Ex.: 12"
        value={dados.area}
        onChange={(evento) => mudar({ area: evento.target.value })}
        erro={erros.area}
      />
    </>
  )
}
