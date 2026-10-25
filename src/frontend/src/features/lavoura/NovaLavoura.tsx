import { useState, type FormEvent } from 'react'
import { erroGeral } from '../../shared/api/erros'
import { useNoComputador } from '../../shared/layout/useNoComputador'
import { AvisoDeErro } from '../../shared/ui/AvisoDeErro'
import { Botao } from '../../shared/ui/Botao'
import { Voltar } from '../../shared/ui/Voltar'
import { useCriarLavoura } from './api'
import { CamposDaLavoura } from './components/CamposDaLavoura'
import { LocalMarcado } from './components/LocalMarcado'
import { MarcarNoMapa } from './components/mapa/MarcarNoMapa'
import * as S from './NovaLavoura.styles'
import type { DadosDaLavoura, Local } from './tipos'
import { areaEmHectares, validarLavoura, type ErrosDaLavoura } from './validacao'

const SEM_DADOS: DadosDaLavoura = {
  culturaId: null,
  apelido: '',
  dataPlantio: '',
  area: '',
  unidade: 'ha',
}

// No celular, dois passos: onde fica (o mapa) e o que plantou (o formulário).
// No computador, os dois juntos.
export function NovaLavoura() {
  const noComputador = useNoComputador()
  const criar = useCriarLavoura()
  const [passo, setPasso] = useState<1 | 2>(1)
  const [local, setLocal] = useState<Local | null>(null)
  const [dados, setDados] = useState<DadosDaLavoura>(SEM_DADOS)
  const [erros, setErros] = useState<ErrosDaLavoura>({})
  const [faltaLocal, setFaltaLocal] = useState(false)

  // O 409 é o nome repetido: aparece embaixo do campo do nome, e não na caixa de erro.
  const nomeRepetido = criar.error?.status === 409 ? criar.error.message : undefined
  const camposDaApi = criar.error?.campos ?? {}
  const errosNaTela: ErrosDaLavoura = {
    cultura: erros.cultura ?? camposDaApi.culturaId,
    apelido: erros.apelido ?? camposDaApi.apelido ?? nomeRepetido,
    dataPlantio: erros.dataPlantio ?? camposDaApi.dataPlantio,
    area: erros.area ?? camposDaApi.areaHa,
  }
  const erro = nomeRepetido ? null : erroGeral(criar.error)

  function mudar(mudanca: Partial<DadosDaLavoura>) {
    setDados((atuais) => ({ ...atuais, ...mudanca }))
  }

  function salvar(evento: FormEvent) {
    evento.preventDefault()
    const novosErros = validarLavoura(dados)
    setErros(novosErros)
    setFaltaLocal(!local)
    if (!local || dados.culturaId === null || Object.keys(novosErros).length > 0) return

    criar.mutate({
      ...local,
      culturaId: dados.culturaId,
      apelido: dados.apelido.trim(),
      dataPlantio: dados.dataPlantio,
      areaHa: areaEmHectares(dados.area, dados.unidade),
    })
  }

  const mapa = (
    <MarcarNoMapa
      aoMudarLocal={setLocal}
      topo={
        !noComputador && (
          <>
            <S.LinhaDoPasso>
              <Voltar para="/" rotulo="Voltar para o painel" />
              <S.Passo>Passo 1 de 2</S.Passo>
            </S.LinhaDoPasso>
            <S.TituloNoMapa>Onde fica sua lavoura?</S.TituloNoMapa>
          </>
        )
      }
      rodape={
        !noComputador && (
          <Botao onClick={() => setPasso(2)} disabled={!local}>
            Confirmar local
          </Botao>
        )
      }
    />
  )

  const formulario = (
    <S.Formulario onSubmit={salvar} noValidate>
      {noComputador ? (
        <S.Cabecalho>
          <S.TituloDaTela>Nova lavoura</S.TituloDaTela>
          <S.Subtitulo>Marque no mapa e conte o que você plantou.</S.Subtitulo>
        </S.Cabecalho>
      ) : (
        <S.Cabecalho>
          <S.LinhaDoPasso>
            <Voltar aoClicar={() => setPasso(1)} rotulo="Voltar para o mapa" />
            <S.Passo>Passo 2 de 2</S.Passo>
          </S.LinhaDoPasso>
          <S.Titulo>O que você plantou?</S.Titulo>
        </S.Cabecalho>
      )}
      <LocalMarcado local={local} aoTrocar={noComputador ? undefined : () => setPasso(1)} />
      {faltaLocal && !local && <AvisoDeErro titulo="Marque no mapa onde fica a lavoura." />}
      <CamposDaLavoura dados={dados} mudar={mudar} erros={errosNaTela} />
      {erro && <AvisoDeErro titulo={erro.message} />}
      <Botao type="submit" disabled={criar.isPending}>
        {criar.isPending ? 'Salvando…' : 'Salvar e ver minha lavoura'}
      </Botao>
    </S.Formulario>
  )

  if (noComputador) {
    return (
      <S.Tela>
        {mapa}
        <S.ColunaDoFormulario>{formulario}</S.ColunaDoFormulario>
      </S.Tela>
    )
  }

  // O mapa continua montado no passo 2, só escondido: ao voltar, ele está onde a pessoa deixou.
  return (
    <>
      <div hidden={passo !== 1}>{mapa}</div>
      {passo === 2 && <S.PaginaDoCelular>{formulario}</S.PaginaDoCelular>}
    </>
  )
}
