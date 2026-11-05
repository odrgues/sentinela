import { RefreshCw, Sprout } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useParams } from 'react-router'
import { useTheme } from 'styled-components'
import { erroPassageiro } from '../../shared/api/erros'
import { quandoFoi } from '../../shared/formato/data'
import { useNoComputador } from '../../shared/layout/useNoComputador'
import { fotoDeSatelite, mapaLigado } from '../../shared/mapa/mapa'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao, BotaoLink } from '../../shared/ui/Botao'
import { Logo } from '../../shared/ui/Logo'
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
import { ResumoDaSemana } from './components/detalhe/ResumoDaSemana'
import * as S from './DetalheDaLavoura.styles'
import { resumoDaLavoura } from './detalhe'
import type { DetalheDaLavoura as Lavoura } from './tipos'

type Aba = 'previsao' | 'historico'

// A foto de satélite do alto: larga e baixa como a faixa, com uns 2,5 km de um lado ao outro.
const FOTO_DO_HEROI = { largura: 1600, altura: 400, metrosPorPixel: 1.6 }

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
  const tema = useTheme()
  const [aba, setAba] = useState<Aba>('previsao')
  // O dia do aviso que a pessoa está olhando, aceso no gráfico.
  const [diaEmFoco, setDiaEmFoco] = useState<string | null>(null)
  const emAndamento = lavoura.status === 'em_andamento'
  const atualizada = (
    <D.Atualizada>
      <RefreshCw size={tema.icone.selo} aria-hidden />
      Previsão atualizada {quandoFoi(lavoura.previsaoAtualizadaEm)}
    </D.Atualizada>
  )

  const encerrada = !emAndamento && (
    <S.Encerrada>
      Esta lavoura foi {lavoura.status === 'colhido' ? 'colhida' : 'perdida'} e não recebe mais
      avisos.
    </S.Encerrada>
  )
  const fase = emAndamento && lavoura.fase && <FaseDoCiclo fase={lavoura.fase} />
  const enso = lavoura.enso && (
    <CartaoDoEnso enso={lavoura.enso} perene={lavoura.tipoCiclo === 'perene'} />
  )
  const avisos = emAndamento && (
    <AvisosDaSemana alertas={lavoura.alertas} aoOlhar={noComputador ? setDiaEmFoco : undefined} />
  )
  const resumo = emAndamento && lavoura.previsaoDisponivel && (
    <ResumoDaSemana alertas={lavoura.alertas} />
  )

  const abas = (
    <D.CartaoDoGrafico>
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
          <PrevisaoDaSemana
            previsao={lavoura.previsao}
            limites={lavoura.limites}
            diaEmFoco={diaEmFoco}
          />
        </D.Secao>
      ) : (
        <Historico id={id} emTabela={noComputador} />
      )}
    </D.CartaoDoGrafico>
  )

  const acoes = emAndamento && (
    <S.Acoes>
      <BotaoLink to={`/lavouras/${id}/editar`}>Editar</BotaoLink>
      <JaColhi id={id} apelido={lavoura.apelido} />
    </S.Acoes>
  )

  // A faixa do alto, com a foto de satélite do lugar da lavoura e o ponto onde ela foi marcada: a
  // cultura numa etiqueta, o nome da lavoura em destaque e o resumo.
  const foto = mapaLigado()
    ? fotoDeSatelite(
        lavoura.latitude,
        lavoura.longitude,
        FOTO_DO_HEROI.largura,
        FOTO_DO_HEROI.altura,
        FOTO_DO_HEROI.metrosPorPixel,
      )
    : undefined
  const comResumo = emAndamento && lavoura.previsaoDisponivel
  const heroi = (
    <S.Heroi $foto={foto} $comResumo={comResumo}>
      {foto && (
        <>
          <S.PontoDaLavoura aria-hidden />
          <S.CreditoDaFoto>Imagens © Esri</S.CreditoDaFoto>
        </>
      )}
      <S.TextosDoHeroi>
        <S.EtiquetaDaCultura>
          <Sprout size={tema.icone.selo} aria-hidden />
          {lavoura.cultura}
        </S.EtiquetaDaCultura>
        <h1>{lavoura.apelido}</h1>
        <span>{resumoDaLavoura(lavoura, noComputador)}</span>
      </S.TextosDoHeroi>
      {noComputador && acoes}
    </S.Heroi>
  )

  // A fase de agora vai dentro do cartão do ciclo.
  const ciclo = <Ciclo lavoura={lavoura}>{fase}</Ciclo>

  if (noComputador) {
    return (
      <>
        {heroi}
        {resumo}
        {/* A previsão e os avisos à esquerda. À direita, em que ponto do ciclo a lavoura está e o
            que a fase pede e, embaixo, o El Niño, que é o contexto da safra. */}
        <S.Grade>
          <S.Principal>
            {abas}
            {avisos}
          </S.Principal>
          <S.Lateral>
            {encerrada}
            {ciclo}
            {enso}
          </S.Lateral>
        </S.Grade>
      </>
    )
  }

  return (
    <>
      {heroi}
      {resumo}
      {encerrada}
      {abas}
      {ciclo}
      {avisos}
      {enso}
      {acoes}
    </>
  )
}

// /lavouras/:id
export function DetalheDaLavoura() {
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
      <S.NaoEncontrada>
        <h1>Lavoura não encontrada</h1>
        <span>Ela pode ter sido excluída, ou o endereço está errado.</span>
        <BotaoLink to="/">Ir para o painel</BotaoLink>
      </S.NaoEncontrada>
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
        <S.FundoDaLavoura />
        {mensagem && <Mensagem texto={mensagem} />}
        {conteudo}
      </S.PaginaDoComputador>
    )
  }

  return (
    <S.PaginaDoCelular>
      <S.FundoDaLavoura />
      {mensagem && <Mensagem texto={mensagem} />}
      <S.TopoDoCelular>
        <Voltar para="/" rotulo="Voltar para o painel" />
        <Logo pequeno animado={false} />
      </S.TopoDoCelular>
      {conteudo}
    </S.PaginaDoCelular>
  )
}
