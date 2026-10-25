import * as S from './Detalhe.styles'

type Props<T extends string> = {
  rotulo: string
  opcoes: { valor: T; nome: string }[]
  escolhida: T
  aoEscolher: (valor: T) => void
  variante: 'abas' | 'filtros'
}

// Botões em que um fica marcado: as abas "Próximos 7 dias / Histórico" e os filtros do
// histórico. Clicar no que já está marcado não faz nada.
export function Escolha<T extends string>({
  rotulo,
  opcoes,
  escolhida,
  aoEscolher,
  variante,
}: Props<T>) {
  return (
    <S.Abas role="group" aria-label={rotulo} $variante={variante}>
      {opcoes.map(({ valor, nome }) => (
        <S.Aba
          key={valor}
          type="button"
          $variante={variante}
          aria-pressed={valor === escolhida}
          onClick={() => valor !== escolhida && aoEscolher(valor)}
        >
          {nome}
        </S.Aba>
      ))}
    </S.Abas>
  )
}
