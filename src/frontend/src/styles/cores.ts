// As cores do canvas "Sentinela — Telas" (11/10). Só existe o tema claro.
export const cores = {
  destaque: {
    base: '#2F5D3A',
    hover: '#1F4128',
    suave: '#E1EEDC',
    sobreSuave: '#24492D',
    // A cultura escolhida na lista.
    escolhido: '#EEF4EA',
  },
  fundo: {
    pagina: '#F5F3EC',
    cartao: '#FFFFFF',
    campo: '#FFFFFF',
    mapa: '#E6E9D8',
    carregando: '#E2E0D6',
    carregandoSuave: '#ECEAE1',
    trilho: '#E4E7DC',
    semPrevisao: '#E6E7E2',
    mensagem: '#1C2A1F',
    // O escuro atrás das confirmações (Já colhi, Excluir).
    veu: 'rgba(20, 28, 22, 0.55)',
  },
  texto: {
    principal: '#1C2A1F',
    secundario: '#555F54',
    placeholder: '#7A8478',
    semPrevisao: '#2E3530',
    sobreDestaque: '#FFFFFF',
    sobreMarca: '#E4EEE1',
    icone: '#5F6B66',
  },
  borda: {
    cartao: '#DAD8CC',
    campo: '#C3CBBE',
    divisoria: '#E4E7DC',
    opcao: '#A9B2A5',
  },
  // Cada nível de aviso tem a cor do marcador no mapa e o fundo e o texto do selo.
  nivel: {
    critico: { marcador: '#B42318', fundo: '#FBE3DF', texto: '#8E1F12', corpo: '#5E160D' },
    atencao: { marcador: '#C27A0E', fundo: '#FCEFD3', texto: '#6E4300', corpo: '#4F3000' },
    ok: { marcador: '#2F5D3A', fundo: '#E1EEDC', texto: '#24492D', corpo: '#24492D' },
  },
  // Os ícones da previsão de cada dia.
  tempo: {
    sol: '#C27A0E',
    nuvem: '#5F6B66',
    chuva: '#1F5A7A',
  },
  // O dia de risco crítico na previsão do computador.
  diaCritico: {
    fundo: '#FFF4F2',
    borda: '#E9A79D',
  },
  enso: {
    fundo: '#E3EDF3',
    titulo: '#173F56',
    texto: '#1F3B4C',
  },
  // A faixa verde do login e do cadastro: os talhões, a divisa entre eles e a estrada.
  marca: {
    sol: '#F2D27A',
    estrada: '#D9B865',
    divisa: '#5B8C63',
    talhoes: ['#386B43', '#33643E', '#3D7348', '#3A6E45', '#35673F'],
    cartao: 'rgba(25, 52, 32, 0.82)',
  },
  erro: '#A3271A',
  sucesso: '#9CC3A3',
  foco: '#9CC3A3',
}

export type Cores = typeof cores
