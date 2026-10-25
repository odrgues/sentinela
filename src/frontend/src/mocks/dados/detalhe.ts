import type {
  AvisoDoHistorico,
  DetalheDaLavoura,
  DiaDePrevisao,
} from '../../features/lavoura/tipos'
import { hoje } from '../../shared/formato/data'
import { culturas } from './culturas'
import { painel } from './painel'

// Os dias de hoje em diante, no formato da API.
function diasAPartirDeHoje(quantos: number) {
  const [ano, mes, dia] = hoje().split('-').map(Number)
  return Array.from({ length: quantos }, (_, i) => {
    const data = new Date(ano, mes - 1, dia + i)
    return [
      data.getFullYear(),
      String(data.getMonth() + 1).padStart(2, '0'),
      String(data.getDate()).padStart(2, '0'),
    ].join('-')
  })
}

function diasAntesDeHoje(quantos: number, intervalo: number) {
  const [ano, mes, dia] = hoje().split('-').map(Number)
  return Array.from({ length: quantos }, (_, i) => {
    const data = new Date(ano, mes - 1, dia - i * intervalo)
    return [
      data.getFullYear(),
      String(data.getMonth() + 1).padStart(2, '0'),
      String(data.getDate()).padStart(2, '0'),
    ].join('-')
  })
}

// A semana do canvas: quente, com o pico na quinta posição e chuva no fim.
function previsao(): DiaDePrevisao[] {
  const semana: Omit<DiaDePrevisao, 'data'>[] = [
    { condicao: 'sol', minC: 19, maxC: 31, chuvaMm: 0, nivel: 'ok', frase: 'Dentro do ideal' },
    { condicao: 'sol', minC: 20, maxC: 33, chuvaMm: 0, nivel: 'ok', frase: 'Dentro do ideal' },
    { condicao: 'sol', minC: 21, maxC: 34, chuvaMm: 0, nivel: 'ok', frase: 'Dentro do ideal' },
    {
      condicao: 'sol',
      minC: 21,
      maxC: 35,
      chuvaMm: 0,
      nivel: 'atencao',
      frase: 'Mais quente que o ideal',
    },
    {
      condicao: 'sol',
      minC: 22,
      maxC: 36,
      chuvaMm: 0,
      nivel: 'critico',
      frase: 'Calor forte: risco',
    },
    { condicao: 'nublado', minC: 20, maxC: 30, chuvaMm: 4, nivel: 'ok', frase: 'Dentro do ideal' },
    { condicao: 'chuva', minC: 19, maxC: 27, chuvaMm: 18, nivel: 'ok', frase: 'Chuva boa' },
  ]
  const datas = diasAPartirDeHoje(7)
  return semana.map((dia, i) => ({ ...dia, data: datas[i] }))
}

export function detalhe(id: number): DetalheDaLavoura | null {
  const doPainel = painel().cultivos.find((lavoura) => lavoura.id === id)
  if (!doPainel) return null
  const datas = diasAPartirDeHoje(7)

  const alertas: DetalheDaLavoura['alertas'] = []
  if (doPainel.aviso.severidade === 'critico') {
    alertas.push({
      tipo: 'calor',
      severidade: 'critico',
      data: datas[4],
      mensagem: `Calor de 36 °C. Passa do limite que a ${doPainel.cultura.toLowerCase()} aguenta.`,
      porque:
        'A soja se desenvolve bem com média entre 20 °C e 30 °C e começa a sofrer acima de 35 °C. Fonte: Embrapa.',
    })
  }
  if (doPainel.aviso.severidade !== 'info') {
    alertas.push({
      tipo: 'seca',
      severidade: 'atencao',
      data: datas[0],
      mensagem: 'Pouca chuva: só 22 mm previstos na semana.',
      porque: 'A lavoura precisa de 27 a 47 mm de chuva por semana. Fonte: Embrapa.',
    })
  }

  return {
    id,
    apelido: doPainel.apelido,
    cultura: doPainel.cultura,
    culturaId: culturas.find(({ nome }) => nome === doPainel.cultura)?.id,
    areaHa: 12,
    municipio: 'Uberaba – MG',
    latitude: doPainel.latitude,
    longitude: doPainel.longitude,
    status: 'em_andamento',
    tipoCiclo: 'anual',
    dataPlantio: '2026-08-27',
    colheitaPrevista: '2026-12-25',
    diaAtual: doPainel.diaAtual,
    cicloDias: doPainel.cicloDias,
    safra: null,
    previsaoDisponivel: true,
    previsaoAtualizadaEm: `${hoje()}T07:00:00-03:00`,
    enso: {
      fase: 'El Nino',
      intensidade: 'muito forte',
      indice: 2.16,
      mesPlantio: '2026-08',
      frase:
        'Você plantou em agosto de 2026, durante um El Niño muito forte. Em anos assim, o tempo pode fugir do normal da região: vale acompanhar os avisos de perto.',
    },
    alertas,
    previsao: previsao(),
  }
}

// 25 avisos semanais, para o histórico ter mais de uma página.
export function historico(): AvisoDoHistorico[] {
  const modelos: Omit<AvisoDoHistorico, 'data'>[] = [
    {
      tipo: 'calor',
      severidade: 'critico',
      mensagem: 'Calor forte: 36 °C previstos. A soja aguenta até 35 °C.',
    },
    {
      tipo: 'seca',
      severidade: 'atencao',
      mensagem: 'Pouca chuva: 22 mm na semana. O ideal é de 27 a 47 mm.',
    },
    {
      tipo: 'favoravel',
      severidade: 'info',
      mensagem: 'Semana boa: temperatura e chuva dentro do ideal.',
    },
    {
      tipo: 'chuva',
      severidade: 'atencao',
      mensagem: 'Chuva demais: 52 mm na semana. O máximo para a soja é 47 mm.',
    },
    {
      tipo: 'favoravel',
      severidade: 'info',
      mensagem: 'Semana boa: temperatura e chuva dentro do ideal.',
    },
  ]
  return diasAntesDeHoje(25, 7).map((data, i) => ({ ...modelos[i % modelos.length], data }))
}
