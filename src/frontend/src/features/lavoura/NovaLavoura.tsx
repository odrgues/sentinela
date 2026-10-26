import { useState, type FormEvent } from 'react'
import { erroGeral } from '../../shared/api/erros'
import * as TelaComMapa from '../../shared/layout/TelaComMapa.styles'
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

// Mapa e formulário numa tela só. No computador, como o painel: o mapa na tela toda e o
// formulário num cartão em cima do vidro, à esquerda. No celular, o mapa no alto e o formulário
// numa folha logo abaixo.
export function NovaLavoura() {
  const noComputador = useNoComputador()
  const criar = useCriarLavoura()
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

  const mapa = <MarcarNoMapa aoMudarLocal={setLocal} telaCheia />

  const formulario = (
    <S.Formulario onSubmit={salvar} noValidate>
      <S.Cabecalho>
        <S.LinhaDoPasso>
          {!noComputador && <Voltar para="/" rotulo="Voltar para o painel" />}
          <S.TituloDaTela>Nova lavoura</S.TituloDaTela>
        </S.LinhaDoPasso>
        <S.Subtitulo>Marque no mapa e conte o que você plantou.</S.Subtitulo>
      </S.Cabecalho>
      <LocalMarcado local={local} />
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
      <TelaComMapa.Tela>
        <TelaComMapa.LadoDoMapa>{mapa}</TelaComMapa.LadoDoMapa>
        <TelaComMapa.Vidro aria-hidden />
        <TelaComMapa.Coluna>
          <S.CartaoDoFormulario>{formulario}</S.CartaoDoFormulario>
        </TelaComMapa.Coluna>
      </TelaComMapa.Tela>
    )
  }

  return (
    <>
      <S.MapaDoCelular>{mapa}</S.MapaDoCelular>
      <S.FolhaDoCelular>{formulario}</S.FolhaDoCelular>
    </>
  )
}
