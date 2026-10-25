import { CircleAlert, Search } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTheme } from 'styled-components'
import { useCulturas } from '../../../shared/api/useCulturas'
import { Botao } from '../../../shared/ui/Botao'
import { Erro } from '../../../shared/ui/Campo.styles'
import { SoParaLeitor } from '../../../shared/ui/SoParaLeitor'
import { descricaoDoCiclo, paraBusca } from '../ciclo'
import * as S from './EscolherCultura.styles'

// Até 6 culturas cabem sem rolar; acima disso, a lista ganha a busca.
const CULTURAS_SEM_BUSCA = 6

type Props = {
  escolhida: number | null
  aoEscolher: (id: number) => void
  erro?: string
}

export function EscolherCultura({ escolhida, aoEscolher, erro }: Props) {
  const tema = useTheme()
  const id = useId()
  const culturas = useCulturas()
  const [busca, setBusca] = useState('')

  const lista = useRef<HTMLDivElement>(null)
  const carregou = culturas.isSuccess

  // Na edição, a cultura marcada pode estar no fim da lista: rola até ela ao abrir.
  useEffect(() => {
    const caixa = lista.current
    const marcada = caixa?.querySelector<HTMLElement>('label:has(input:checked)')
    if (caixa && marcada) caixa.scrollTop = marcada.offsetTop - caixa.offsetTop
  }, [carregou])

  const todas = culturas.data ?? []
  const comBusca = todas.length > CULTURAS_SEM_BUSCA
  const visiveis = todas.filter((cultura) => paraBusca(cultura.nome).includes(paraBusca(busca)))

  return (
    <S.Grupo aria-describedby={erro ? `${id}-erro` : undefined}>
      <S.Legenda>Cultura</S.Legenda>
      {comBusca && (
        <S.Busca>
          <SoParaLeitor as="label" htmlFor={`${id}-busca`}>
            Procurar cultura
          </SoParaLeitor>
          <Search size={tema.icone.busca} aria-hidden />
          <S.EntradaDaBusca
            id={`${id}-busca`}
            type="search"
            placeholder="Procurar cultura"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </S.Busca>
      )}
      <S.Lista ref={lista} $comErro={Boolean(erro)}>
        {culturas.isPending && <S.Aviso>Carregando as culturas…</S.Aviso>}
        {culturas.isError && (
          <S.Aviso role="alert">
            {culturas.error.message}{' '}
            <Botao variante="neutro" onClick={() => culturas.refetch()}>
              Tentar de novo
            </Botao>
          </S.Aviso>
        )}
        {culturas.isSuccess && visiveis.length === 0 && (
          <S.Aviso>Nenhuma cultura com esse nome.</S.Aviso>
        )}
        {visiveis.map((cultura) => (
          <S.Opcao key={cultura.id}>
            <S.Radio
              type="radio"
              name={`${id}-cultura`}
              value={cultura.id}
              checked={escolhida === cultura.id}
              onChange={() => aoEscolher(cultura.id)}
              aria-labelledby={`${id}-nome-${cultura.id}`}
              aria-describedby={`${id}-ciclo-${cultura.id}`}
            />
            <S.Textos>
              <S.Nome id={`${id}-nome-${cultura.id}`}>{cultura.nome}</S.Nome>
              <S.Ciclo id={`${id}-ciclo-${cultura.id}`}>{descricaoDoCiclo(cultura)}</S.Ciclo>
            </S.Textos>
          </S.Opcao>
        ))}
      </S.Lista>
      {erro && (
        <Erro id={`${id}-erro`}>
          <CircleAlert size={tema.icone.erroDoCampo} aria-hidden />
          {erro}
        </Erro>
      )}
    </S.Grupo>
  )
}
