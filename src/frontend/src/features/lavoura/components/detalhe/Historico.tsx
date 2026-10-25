import { useState, type ReactNode } from 'react'
import { dataCompleta, diaEMes } from '../../../../shared/formato/data'
import { AvisoDeErro } from '../../../../shared/ui/AvisoDeErro'
import { Botao } from '../../../../shared/ui/Botao'
import { NIVEL, NOME_DO_NIVEL, type Severidade } from '../../../../shared/ui/nivel'
import { useHistorico } from '../../api'
import type { AvisoDoHistorico } from '../../tipos'
import * as S from './Detalhe.styles'
import { Escolha } from './Escolha'

type Filtro = Severidade | 'todos'

const FILTROS: { valor: Filtro; nome: string }[] = [
  { valor: 'todos', nome: 'Todos' },
  { valor: 'critico', nome: 'Crítico' },
  { valor: 'atencao', nome: 'Atenção' },
  { valor: 'info', nome: 'Tudo certo' },
]

function Selo({ aviso }: { aviso: AvisoDoHistorico }) {
  const nivel = NIVEL[aviso.severidade]
  return <S.Selo $nivel={nivel}>{NOME_DO_NIVEL[nivel]}</S.Selo>
}

// Todos os avisos que a lavoura já teve, do mais novo para o mais antigo. No computador, em
// tabela; no celular, em cartões.
export function Historico({ id, emTabela }: { id: string; emTabela: boolean }) {
  const [filtro, setFiltro] = useState<Filtro>('todos')
  const historico = useHistorico(id, filtro === 'todos' ? null : filtro)
  const avisos = historico.data?.pages.flatMap((pagina) => pagina.itens) ?? []

  let lista: ReactNode
  if (historico.isPending) {
    lista = <S.Vazio role="status">Carregando o histórico…</S.Vazio>
  } else if (historico.isError && avisos.length === 0) {
    lista = <AvisoDeErro titulo={historico.error.message} />
  } else if (avisos.length === 0) {
    lista = <S.Vazio>Nenhum aviso deste tipo até agora.</S.Vazio>
  } else if (emTabela) {
    lista = (
      <S.Tabela>
        <table>
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Nível</th>
              <th scope="col">Aviso</th>
            </tr>
          </thead>
          <tbody>
            {avisos.map((aviso, i) => (
              <tr key={`${aviso.data}-${aviso.tipo}-${i}`}>
                <td>{dataCompleta(aviso.data)}</td>
                <td>
                  <Selo aviso={aviso} />
                </td>
                <td>{aviso.mensagem}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </S.Tabela>
    )
  } else {
    lista = (
      <S.ListaDoHistorico>
        {avisos.map((aviso, i) => (
          <S.ItemDoHistorico key={`${aviso.data}-${aviso.tipo}-${i}`}>
            <Selo aviso={aviso} />
            <span>{aviso.mensagem}</span>
            <span>{diaEMes(aviso.data)}</span>
          </S.ItemDoHistorico>
        ))}
      </S.ListaDoHistorico>
    )
  }

  return (
    <S.Secao>
      <Escolha
        rotulo="Mostrar avisos"
        variante="filtros"
        opcoes={FILTROS}
        escolhida={filtro}
        aoEscolher={setFiltro}
      />
      {lista}
      {historico.hasNextPage && (
        <Botao
          variante="neutro"
          onClick={() => historico.fetchNextPage()}
          disabled={historico.isFetchingNextPage}
        >
          {historico.isFetchingNextPage ? 'Carregando…' : 'Ver mais avisos'}
        </Botao>
      )}
    </S.Secao>
  )
}
