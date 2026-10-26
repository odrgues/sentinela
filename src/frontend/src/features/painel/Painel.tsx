import { CalendarCheck, Plus, UserRound } from 'lucide-react'
import { Link, Navigate, Outlet, useLocation, useMatch } from 'react-router'
import { useTheme } from 'styled-components'
import { erroPassageiro } from '../../shared/api/erros'
import { quandoFoi } from '../../shared/formato/data'
import { useNoComputador } from '../../shared/layout/useNoComputador'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao } from '../../shared/ui/Botao'
import { Mensagem } from '../../shared/ui/Mensagem'
import { ICONE_DO_NIVEL, NIVEL, NOME_DO_NIVEL } from '../../shared/ui/nivel'
import { SoParaLeitor } from '../../shared/ui/SoParaLeitor'
import { usePainel } from './api'
import { CartaoDaLavoura } from './components/CartaoDaLavoura'
import { Carregando } from './components/Carregando'
import { Clima } from './components/Clima'
import { Legenda, MapaDoPainel } from './components/MapaDoPainel'
import * as P from './components/Painel.styles'
import { SemPrevisao } from '../../shared/ui/SemPrevisao'
import * as S from './Painel.styles'
import { maisUrgente, proximaColheita, saudacao } from './textos'
import type { Painel as DadosDoPainel, LavouraNoPainel } from './tipos'

// O que mais pede atenção: a lavoura com o aviso mais grave e a próxima a colher.
function Destaques({ lavouras }: { lavouras: LavouraNoPainel[] }) {
  const tema = useTheme()
  const urgente = maisUrgente(lavouras)
  const colheita = proximaColheita(lavouras)
  if (!urgente && !colheita) return null
  const IconeDoAviso = urgente ? ICONE_DO_NIVEL[NIVEL[urgente.aviso.severidade]] : null

  return (
    <S.Destaques>
      {urgente && IconeDoAviso && (
        <S.Destaque $nivel={NIVEL[urgente.aviso.severidade]}>
          <IconeDoAviso size={tema.icone.selo} strokeWidth={tema.tracoDoIcone.forte} aria-hidden />
          <span>
            <strong>Mais urgente:</strong> {urgente.apelido}, {urgente.aviso.mensagem.toLowerCase()}
          </span>
        </S.Destaque>
      )}
      {colheita && (
        <S.Destaque>
          <CalendarCheck size={tema.icone.selo} strokeWidth={tema.tracoDoIcone.forte} aria-hidden />
          <span>
            <strong>Próxima colheita:</strong> {colheita.apelido},{' '}
            {colheita.faltam === 0 ? 'já no ponto' : `em ${colheita.faltam} dias`}
          </span>
        </S.Destaque>
      )}
    </S.Destaques>
  )
}

// "1 Crítico · 2 Atenção · 1 Tudo certo": quantas lavouras estão em cada nível de aviso.
function ResumoDosAvisos({ lavouras }: { lavouras: LavouraNoPainel[] }) {
  const niveis = (['critico', 'atencao', 'ok'] as const)
    .map((nivel) => ({
      nivel,
      quantas: lavouras.filter((lavoura) => NIVEL[lavoura.aviso.severidade] === nivel).length,
    }))
    .filter(({ quantas }) => quantas > 0)

  return (
    <S.Resumo aria-label="Avisos das lavouras">
      {niveis.map(({ nivel, quantas }) => (
        <S.ItemDoResumo key={nivel} $nivel={nivel}>
          <strong>{quantas}</strong>
          {NOME_DO_NIVEL[nivel]}
        </S.ItemDoResumo>
      ))}
    </S.Resumo>
  )
}

// O essencial de cada lavoura; o resto (o dia do ciclo, a fase, a previsão) fica na página dela.
function Conteudo({ painel, noComputador }: { painel: DadosDoPainel; noComputador: boolean }) {
  const tema = useTheme()

  return (
    <>
      {!painel.previsaoDisponivel && <SemPrevisao atualizadaEm={painel.previsaoAtualizadaEm} />}
      {noComputador ? (
        <S.CartaoDoClima>
          <Clima hoje={painel.hoje} />
          {painel.previsaoDisponivel && (
            <S.Atualizada>
              Previsão atualizada {quandoFoi(painel.previsaoAtualizadaEm)}
            </S.Atualizada>
          )}
          <ResumoDosAvisos lavouras={painel.cultivos} />
          <Destaques lavouras={painel.cultivos} />
        </S.CartaoDoClima>
      ) : (
        <Clima hoje={painel.hoje} />
      )}
      {/* No computador, o título não aparece (os quadrinhos falam por si) e "Nova lavoura" já
          está no menu do topo. */}
      {noComputador ? (
        <SoParaLeitor as="h2">Suas lavouras</SoParaLeitor>
      ) : (
        <P.CabecalhoDaLista>
          <h2>Suas lavouras</h2>
          <Link to="/lavouras/nova">
            <Plus size={tema.icone.botao} strokeWidth={tema.tracoDoIcone.forte} aria-hidden />
            Nova
          </Link>
        </P.CabecalhoDaLista>
      )}
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

  // A janela da conta (/conta) abre por cima do painel, pelo <Outlet />.
  const comAConta = useMatch('/conta') !== null

  // Sem nenhuma lavoura, o painel não tem o que mostrar: vai marcar a primeira. Com a conta
  // aberta, fica: a pessoa pode querer mexer na conta antes de ter lavoura.
  if (painel.data?.cultivos.length === 0 && !comAConta) {
    return <Navigate to="/lavouras/nova" replace />
  }

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
        <S.Vidro aria-hidden />
        <S.Coluna>
          {/* No computador, a saudação não aparece: fica só para o leitor de tela. */}
          <SoParaLeitor as="h1">{titulo}</SoParaLeitor>
          {conteudo}
        </S.Coluna>
        <S.LadoDoMapa>
          <MapaDoPainel
            lavouras={lavouras}
            folgaAEsquerda={parseFloat(tema.largura.colunaDoPainel)}
            folgaEmCima={parseFloat(tema.altura.barraDoTopo)}
          />
          <Legenda />
        </S.LadoDoMapa>
        <Outlet />
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
        {/* A saudação não aparece: fica só para o leitor de tela. */}
        <SoParaLeitor as="h1">{titulo}</SoParaLeitor>
        <S.BotaoDaConta to="/conta" aria-label="Minha conta" viewTransition={false}>
          <UserRound size={tema.icone.topo} aria-hidden />
        </S.BotaoDaConta>
      </S.TopoFlutuante>
      <S.Folha>
        <S.Alca aria-hidden />
        {conteudo}
      </S.Folha>
      <Outlet />
    </>
  )
}
