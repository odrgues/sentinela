import { Info, Trash2 } from 'lucide-react'
import { useCallback, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useTheme } from 'styled-components'
import type { Cultura } from '../../shared/api/tipos/cultura'
import { erroGeral } from '../../shared/api/erros'
import { useCulturas } from '../../shared/api/useCulturas'
import * as TelaComMapa from '../../shared/layout/TelaComMapa.styles'
import { useNoComputador } from '../../shared/layout/useNoComputador'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao, BotaoLink } from '../../shared/ui/Botao'
import { Confirmacao } from '../../shared/ui/Confirmacao'
import { SoParaLeitor } from '../../shared/ui/SoParaLeitor'
import { Voltar } from '../../shared/ui/Voltar'
import { useEditarLavoura, useExcluirLavoura, useLavoura } from './api'
import { CamposDaLavoura } from './components/CamposDaLavoura'
import { LocalMarcado } from './components/LocalMarcado'
import { MarcarNoMapa } from './components/mapa/MarcarNoMapa'
import { dadosDaLavoura, localDaLavoura, oQueMudou } from './edicao'
import * as S from './EditarLavoura.styles'
import * as N from './NovaLavoura.styles'
import type { DadosDaLavoura, DetalheDaLavoura, Local } from './tipos'
import { validarLavoura, type ErrosDaLavoura } from './validacao'

function ExcluirLavoura({ id, apelido }: { id: string; apelido: string }) {
  const tema = useTheme()
  const excluir = useExcluirLavoura(id)
  const [aberta, setAberta] = useState(false)
  const fechar = useCallback(() => setAberta(false), [])

  return (
    <>
      <S.Excluir type="button" onClick={() => setAberta(true)}>
        Excluir esta lavoura
      </S.Excluir>
      {aberta && (
        <Confirmacao
          titulo={`Excluir o ${apelido}?`}
          nivel="critico"
          icone={<Trash2 size={tema.icone.confirmacao} aria-hidden />}
          aoFechar={fechar}
          acoes={
            <>
              {excluir.error && <AvisoDeErro titulo={excluir.error.message} />}
              <Botao
                variante="perigo"
                onClick={() => excluir.mutate()}
                disabled={excluir.isPending}
              >
                {excluir.isPending ? 'Excluindo…' : 'Sim, excluir lavoura'}
              </Botao>
              <Botao variante="neutro" onClick={fechar}>
                Cancelar
              </Botao>
            </>
          }
        >
          <p>A lavoura e todo o histórico de avisos dela serão apagados. Isso não tem volta.</p>
          <S.Aviso>
            Se você só terminou a colheita, use “Já colhi”: assim o histórico fica guardado.
          </S.Aviso>
        </Confirmacao>
      )}
    </>
  )
}

type Props = { id: string; lavoura: DetalheDaLavoura; culturas: Cultura[] }

function Edicao({ id, lavoura, culturas }: Props) {
  const tema = useTheme()
  const navegar = useNavigate()
  const noComputador = useNoComputador()
  const editar = useEditarLavoura(id)
  const [antes] = useState(() => ({
    dados: dadosDaLavoura(lavoura, culturas),
    local: localDaLavoura(lavoura),
  }))
  const [dados, setDados] = useState<DadosDaLavoura>(antes.dados)
  const [local, setLocal] = useState<Local>(antes.local)
  const [erros, setErros] = useState<ErrosDaLavoura>({})
  // O mapa fica sempre à vista e o local muda conforme a pessoa mexe nele. Quando ele só abre no
  // ponto salvo, o ponto é o mesmo: não conta como mudança.
  const mudarLocalPeloMapa = useCallback((novo: Local | null) => {
    if (!novo) return
    setLocal((atual) =>
      novo.latitude === atual.latitude && novo.longitude === atual.longitude ? atual : novo,
    )
  }, [])

  const nomeRepetido = editar.error?.status === 409 ? editar.error.message : undefined
  const camposDaApi = editar.error?.campos ?? {}
  const errosNaTela: ErrosDaLavoura = {
    cultura: erros.cultura ?? camposDaApi.culturaId,
    apelido: erros.apelido ?? camposDaApi.apelido ?? nomeRepetido,
    dataPlantio: erros.dataPlantio ?? camposDaApi.dataPlantio,
    area: erros.area ?? camposDaApi.areaHa,
  }
  const erro = nomeRepetido ? null : erroGeral(editar.error)

  function salvar(evento: FormEvent) {
    evento.preventDefault()
    const novosErros = validarLavoura(dados)
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) return

    const mudancas = oQueMudou(antes, { dados, local })
    if (Object.keys(mudancas).length === 0) navegar(`/lavouras/${id}`)
    else editar.mutate(mudancas)
  }

  const formulario = (
    <N.Formulario onSubmit={salvar} noValidate>
      {/* No computador, o menu do topo já leva de volta e o formulário fala por si: o título
            fica só para o leitor de tela. */}
      {noComputador ? (
        <SoParaLeitor as="h1">Editar lavoura</SoParaLeitor>
      ) : (
        <N.LinhaDoPasso>
          <Voltar para={`/lavouras/${id}`} rotulo="Voltar para a lavoura" />
          <N.TituloDaTela>Editar lavoura</N.TituloDaTela>
        </N.LinhaDoPasso>
      )}
      <S.GrupoDoLocal>
        <S.RotuloDoLocal>Local</S.RotuloDoLocal>
        <LocalMarcado local={local} />
      </S.GrupoDoLocal>
      <CamposDaLavoura
        dados={dados}
        mudar={(mudanca) => setDados((atuais) => ({ ...atuais, ...mudanca }))}
        erros={errosNaTela}
      />
      <S.Recalcula>
        <Info size={tema.icone.busca} aria-hidden />
        Se mudar a cultura ou a data, a colheita prevista e os avisos são calculados de novo.
      </S.Recalcula>
      {erro && <AvisoDeErro titulo={erro.message} />}
      <Botao type="submit" disabled={editar.isPending}>
        {editar.isPending ? 'Salvando…' : 'Salvar alterações'}
      </Botao>
      <ExcluirLavoura id={id} apelido={lavoura.apelido} />
    </N.Formulario>
  )

  const mapa = <MarcarNoMapa inicio={local} aoMudarLocal={mudarLocalPeloMapa} telaCheia />

  // Como a nova lavoura. No computador: o mapa na tela toda e o formulário num cartão em cima do
  // vidro, à esquerda. No celular: o mapa no alto e o formulário numa folha que sobe até o meio.
  if (noComputador) {
    return (
      <TelaComMapa.Tela>
        <TelaComMapa.LadoDoMapa>{mapa}</TelaComMapa.LadoDoMapa>
        <TelaComMapa.Vidro aria-hidden />
        <TelaComMapa.Coluna>
          <N.CartaoDoFormulario>{formulario}</N.CartaoDoFormulario>
        </TelaComMapa.Coluna>
      </TelaComMapa.Tela>
    )
  }

  return (
    <>
      <N.MapaDoCelular>{mapa}</N.MapaDoCelular>
      <N.FolhaDoCelular>{formulario}</N.FolhaDoCelular>
    </>
  )
}

// /lavouras/:id/editar: os mesmos campos da Nova lavoura, já preenchidos.
export function EditarLavoura() {
  const { id = '' } = useParams()
  const lavoura = useLavoura(id)
  const culturas = useCulturas()

  if (lavoura.data && culturas.data) {
    return <Edicao key={id} id={id} lavoura={lavoura.data} culturas={culturas.data} />
  }

  const erro = lavoura.error ?? culturas.error
  return (
    <S.Pagina>
      <N.Formulario as="div">
        {erro?.status === 404 ? (
          <>
            <N.Titulo>Lavoura não encontrada</N.Titulo>
            <BotaoLink to="/">Ir para o painel</BotaoLink>
          </>
        ) : erro ? (
          <>
            <AvisoDeErro titulo={erro.message} />
            <Botao
              variante="neutro"
              onClick={() => {
                lavoura.refetch()
                culturas.refetch()
              }}
            >
              Tentar de novo
            </Botao>
          </>
        ) : (
          <S.Aviso role="status">Carregando a lavoura…</S.Aviso>
        )}
      </N.Formulario>
    </S.Pagina>
  )
}
