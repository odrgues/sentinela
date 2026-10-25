import { Plus, Sprout, UserRound } from 'lucide-react'
import { Link, Navigate, useLocation } from 'react-router'
import { useTheme } from 'styled-components'
import { erroPassageiro } from '../../shared/api/erros'
import { quandoFoi } from '../../shared/formato/data'
import { useNoComputador } from '../../shared/layout/useNoComputador'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao } from '../../shared/ui/Botao'
import { Mensagem } from '../../shared/ui/Mensagem'
import { usePainel } from './api'
import { CartaoDaLavoura } from './components/CartaoDaLavoura'
import { Carregando } from './components/Carregando'
import { Clima } from './components/Clima'
import { Legenda, MapaDoPainel } from './components/MapaDoPainel'
import * as P from './components/Painel.styles'
import { SemPrevisao } from '../../shared/ui/SemPrevisao'
import * as S from './Painel.styles'
import { saudacao } from './textos'
import type { Painel as DadosDoPainel } from './tipos'

function Conteudo({ painel, noComputador }: { painel: DadosDoPainel; noComputador: boolean }) {
  const tema = useTheme()
  const clima = (
    <>
      <Clima hoje={painel.hoje} />
      <P.Frase>{painel.frase}</P.Frase>
    </>
  )

  return (
    <>
      {!painel.previsaoDisponivel && <SemPrevisao atualizadaEm={painel.previsaoAtualizadaEm} />}
      {noComputador ? (
        <S.CartaoDoClima>
          {clima}
          {painel.previsaoDisponivel && (
            <P.Atualizada>
              Previsão atualizada {quandoFoi(painel.previsaoAtualizadaEm)}
            </P.Atualizada>
          )}
        </S.CartaoDoClima>
      ) : (
        <S.Bloco>{clima}</S.Bloco>
      )}
      <P.CabecalhoDaLista>
        <h2>Suas lavouras</h2>
        <Link to="/lavouras/nova">
          <Plus size={tema.icone.botao} strokeWidth={tema.tracoDoIcone.forte} aria-hidden />
          {noComputador ? 'Nova lavoura' : 'Nova'}
        </Link>
      </P.CabecalhoDaLista>
      <P.Lista>
        {painel.cultivos.map((lavoura) => (
          <li key={lavoura.id}>
            <CartaoDaLavoura lavoura={lavoura} />
          </li>
        ))}
      </P.Lista>
    </>
  )
}

export function Painel() {
  const tema = useTheme()
  const noComputador = useNoComputador()
  const painel = usePainel()
  const { state } = useLocation()

  // "Lavoura salva!" depois de cadastrar uma lavoura.
  const mensagem = typeof state?.mensagem === 'string' ? state.mensagem : null

  // Sem nenhuma lavoura, o painel não tem o que mostrar: vai marcar a primeira.
  if (painel.data?.cultivos.length === 0) return <Navigate to="/lavouras/nova" replace />

  const nome = painel.data ? `, ${painel.data.usuario.nome}` : ''
  const titulo = `${saudacao(new Date().getHours())}${nome}`
  const lavouras = painel.data?.cultivos ?? []

  let conteudo = <Carregando />
  if (painel.data) {
    conteudo = <Conteudo painel={painel.data} noComputador={noComputador} />
  } else if (painel.error) {
    conteudo = (
      <>
        <AvisoDeErro titulo={painel.error.message} />
        {erroPassageiro(painel.error) && (
          <Botao variante="neutro" onClick={() => painel.refetch()} disabled={painel.isFetching}>
            {painel.isFetching ? 'Tentando…' : 'Tentar de novo'}
          </Botao>
        )}
      </>
    )
  }

  if (noComputador) {
    return (
      <S.Tela>
        {mensagem && <Mensagem texto={mensagem} />}
        <S.Coluna>
          <S.Titulo>{titulo}</S.Titulo>
          {conteudo}
        </S.Coluna>
        <S.LadoDoMapa>
          <MapaDoPainel lavouras={lavouras} />
          <Legenda />
        </S.LadoDoMapa>
      </S.Tela>
    )
  }

  return (
    <>
      {mensagem && <Mensagem texto={mensagem} />}
      <S.MapaNoAlto>
        <MapaDoPainel lavouras={lavouras} />
      </S.MapaNoAlto>
      <S.TopoFlutuante>
        <S.Saudacao>
          <Sprout size={tema.icone.marcaNoTopo} aria-hidden />
          {titulo}
        </S.Saudacao>
        <S.BotaoDaConta to="/conta" aria-label="Minha conta">
          <UserRound size={tema.icone.topo} aria-hidden />
        </S.BotaoDaConta>
      </S.TopoFlutuante>
      <S.Folha>
        <S.Alca aria-hidden />
        {conteudo}
      </S.Folha>
    </>
  )
}
