import { hoje } from '../../shared/formato/data'
import type { Painel } from '../../features/painel/tipos'

// As três lavouras do canvas, perto de Uberaba, da mais grave para a mais leve.
export function painel(): Painel {
  return {
    usuario: { nome: 'João' },
    hoje: {
      cidade: 'Uberaba',
      uf: 'MG',
      tempC: 29,
      condicao: 'sol_nuvens',
      condicaoTexto: 'sol com poucas nuvens',
    },
    frase: 'Semana quente e com pouca chuva. Na quinta, o calor passa do limite da soja.',
    previsaoDisponivel: true,
    previsaoAtualizadaEm: `${hoje()}T07:00:00-03:00`,
    cultivos: [
      {
        id: 1,
        apelido: 'Talhão do fundo',
        cultura: 'Soja',
        tipoCiclo: 'anual',
        diaAtual: 45,
        cicloDias: 120,
        safra: null,
        latitude: -19.747812,
        longitude: -47.931804,
        fase: 'Desenvolvimento vegetativo',
        aviso: { tipo: 'calor', severidade: 'critico', mensagem: 'Calor forte na quinta' },
      },
      {
        id: 2,
        apelido: 'Roça da baixada',
        cultura: 'Milho',
        tipoCiclo: 'anual',
        diaAtual: 20,
        cicloDias: 120,
        safra: null,
        latitude: -19.775104,
        longitude: -47.901772,
        fase: 'Vegetativo (V4 a V17)',
        aviso: {
          tipo: 'deficit_hidrico',
          severidade: 'atencao',
          mensagem: 'Pouca chuva na semana',
        },
      },
      {
        id: 3,
        apelido: 'Feijão da horta',
        cultura: 'Feijão',
        tipoCiclo: 'anual',
        diaAtual: 12,
        cicloDias: 90,
        safra: null,
        latitude: -19.761002,
        longitude: -47.915233,
        fase: 'Germinação e emergência (V0-V2)',
        aviso: { tipo: 'favoravel', severidade: 'info', mensagem: 'Tudo certo esta semana' },
      },
    ],
  }
}
