import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { useTheme } from 'styled-components'
import { erroPassageiro } from '../../shared/api/erros'
import { quandoFoi } from '../../shared/formato/data'
import { useNoComputador } from '../../shared/layout/useNoComputador'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao, BotaoLink } from '../../shared/ui/Botao'
import { Mensagem } from '../../shared/ui/Mensagem'
import { SemPrevisao } from '../../shared/ui/SemPrevisao'
import { Voltar } from '../../shared/ui/Voltar'
import { useLavoura } from './api'
import { AvisosDaSemana } from './components/detalhe/AvisosDaSemana'
import { CartaoDoEnso } from './components/detalhe/CartaoDoEnso'
import { Ciclo } from './components/detalhe/Ciclo'
import { FaseDoCiclo } from './components/detalhe/FaseDoCiclo'
import * as D from './components/detalhe/Detalhe.styles'
import { Escolha } from './components/detalhe/Escolha'
import { Historico } from './components/detalhe/Historico'
import { JaColhi } from './components/detalhe/JaColhi'
import { PrevisaoDaSemana } from './components/detalhe/PrevisaoDaSemana'
import * as S from './DetalheDaLavoura.styles'
import { resumoDaLavoura } from './detalhe'
import type { DetalheDaLavoura as Lavoura } from './tipos'

type Aba = 'previsao' | 'historico'

const ABAS: { valor: Aba; nome: string }[] = [
  { valor: 'previsao', nome: 'Próximos 7 dias' },
  { valor: 'historico', nome: 'Histórico' },
]

function Conteudo({
  id,
  lavoura,
  noComputador,
}: {
  id: string
  lavoura: Lavoura
  noComputador: boolean
}) {
  const [aba, setAba] = useState<Aba>('previsao')
  const emAndamento = lavoura.status === 'em_andamento'
  const atualizada = (
    <D.Atualizada>Previsão atualizada {quandoFoi(lavoura.previsaoAtualizadaEm)}</D.Atualizada>
  )

  const resumo = (
    <>
      {!emAndamento && (
        <S.Encerrada>
          Esta lavoura foi {lavoura.status === 'colhido' ? 'colhida' : 'perdida'} e não recebe mais
          avisos.
        </S.Encerrada>
      )}
      <Ciclo lavoura={lavoura} />
      {emAndamento && lavoura.fase && <FaseDoCiclo fase={lavoura.fase} />}
      {lavoura.enso && <CartaoDoEnso enso={lavoura.enso} perene={lavoura.tipoCiclo === 'perene'} />}
      {emAndamento && <AvisosDaSemana alertas={lavoura.alertas} />}
    </>
  )

  const abas = (
    <>
      <S.LinhaDasAbas>
        <Escolha
          rotulo="O que mostrar"
          variante="abas"
          opcoes={ABAS}
          escolhida={aba}
          aoEscolher={setAba}
        />
        {noComputador && aba === 'previsao' && lavoura.previsaoDisponivel && atualizada}
      </S.LinhaDasAbas>
      {aba === 'previsao' ? (
        <D.Secao>
          {!lavoura.previsaoDisponivel && (
            <SemPrevisao atualizadaEm={lavoura.previsaoAtualizadaEm} />
          )}
          {!noComputador && lavoura.previsaoDisponivel && atualizada}
          <PrevisaoDaSemana previsao={lavoura.previsao} emCartoes={noComputador} />
        </D.Secao>
      ) : (
        <Historico id={id} emTabela={noComputador} />
      )}
    </>
  )

  const acoes = emAndamento && (
    <S.Acoes>
      <BotaoLink to={`/lavouras/${id}/editar`} variante="neutro">
        Editar
      </BotaoLink>
      <JaColhi id={id} apelido={lavoura.apelido} />
    </S.Acoes>
  )

  if (noComputador) {
    return (
      <>
        <S.Cabecalho>
          <S.NomeGrande>
            <h1>{lavoura.apelido}</h1>
            <span>{resumoDaLavoura(lavoura, true)}</span>
          </S.NomeGrande>
          {acoes}
        </S.Cabecalho>
        <S.Colunas>
          <S.ColunaDaEsquerda>{resumo}</S.ColunaDaEsquerda>
          <S.ColunaDaDireita>{abas}</S.ColunaDaDireita>
        </S.Colunas>
      </>
    )
  }

  return (
    <>
      <S.Nome>
        <h1>{lavoura.apelido}</h1>
        <span>{resumoDaLavoura(lavoura)}</span>
      </S.Nome>
      {resumo}
      {abas}
      {acoes}
    </>
  )
}

// /lavouras/:id
export function DetalheDaLavoura() {
  const tema = useTheme()
  const { id = '' } = useParams()
  const noComputador = useNoComputador()
  const lavoura = useLavoura(id)
  const { state } = useLocation()

  // "Alterações salvas", depois de editar.
  const mensagem = typeof state?.mensagem === 'string' ? state.mensagem : null

  let conteudo = <D.Vazio role="status">Carregando a lavoura…</D.Vazio>
  if (lavoura.data) {
    conteudo = <Conteudo id={id} lavoura={lavoura.data} noComputador={noComputador} />
  } else if (lavoura.error?.status === 404) {
    // A API devolve 404 também para a lavoura de outra pessoa.
    conteudo = (
      <>
        <S.Nome>
          <h1>Lavoura não encontrada</h1>
          <span>Ela pode ter sido excluída, ou o endereço está errado.</span>
        </S.Nome>
        <BotaoLink to="/">Ir para o painel</BotaoLink>
      </>
    )
  } else if (lavoura.error) {
    conteudo = (
      <>
        <AvisoDeErro titulo={lavoura.error.message} />
        {erroPassageiro(lavoura.error) && (
          <Botao variante="neutro" onClick={() => lavoura.refetch()} disabled={lavoura.isFetching}>
            {lavoura.isFetching ? 'Tentando…' : 'Tentar de novo'}
          </Botao>
        )}
      </>
    )
  }

  if (noComputador) {
    return (
      <S.PaginaDoComputador>
        {mensagem && <Mensagem texto={mensagem} />}
        <S.VoltarAoPainel to="/">
          <ChevronLeft size={tema.icone.botao} strokeWidth={tema.tracoDoIcone.forte} aria-hidden />
          Painel
        </S.VoltarAoPainel>
        {conteudo}
      </S.PaginaDoComputador>
    )
  }

  return (
    <S.PaginaDoCelular>
      {mensagem && <Mensagem texto={mensagem} />}
      <div>
        <Voltar para="/" rotulo="Voltar para o painel" />
      </div>
      {conteudo}
    </S.PaginaDoCelular>
  )
}
