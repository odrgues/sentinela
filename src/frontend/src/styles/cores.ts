export const cores = {
  destaque: {
    base: '#1C3A12',
    hover: '#1F4128',
    suave: '#E1EEDC',
    sobreSuave: '#24492D',
    // A cultura escolhida na lista.
    escolhido: '#EEF4EA',
  },
  fundo: {
    pagina: '#F5F3EC',
    cartao: '#FFFFFF',
    // Os cartões por cima do vidro verde (painel e nova lavoura): branco transparente, com o
    // fundo desfocado atrás (desfoque.cartao). O último número é a opacidade.
    cartaoNoVidro: 'rgba(255, 255, 255, 0.9)',
    // A borda fininha dos cartões transparentes, como o brilho na beira de um vidro.
    bordaNoVidro: 'rgba(255, 255, 255, 0.7)',
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
    // O marcador é a cor viva do nível: a legenda, os pinos do mapa e os ícones do resumo.
    // selo é a cor viva, transparente, atrás dos selos e do resumo do painel (texto por cima).
    critico: {
      marcador: '#E5322B',
      selo: 'rgba(229, 50, 43, 0.2)',
      fundo: '#FBE3DF',
      texto: '#8E1F12',
      corpo: '#5E160D',
    },
    atencao: {
      marcador: '#F5B400',
      selo: 'rgba(245, 180, 0, 0.28)',
      fundo: '#FCEFD3',
      texto: '#6E4300',
      corpo: '#4F3000',
    },
    ok: {
      marcador: '#2E9B4E',
      selo: 'rgba(46, 155, 78, 0.2)',
      fundo: '#E1EEDC',
      texto: '#24492D',
      corpo: '#24492D',
    },
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
  // O amarelo do broto da marca e do marcador do mapa.
  marca: {
    sol: '#F2D27A',
  },
  // A plantinha do logo: o caule, as folhas, o broto e o monte de terra, na cor do nome
  // (destaque.base). A nervura é da cor do cartão, um risco claro no meio da folha.
  planta: {
    caule: '#1C3A12',
    folha: '#1C3A12',
    broto: '#1C3A12',
    nervura: '#FFFFFF',
    terra: '#1C3A12',
  },
  // O logo claro, para ficar em cima do verde (o vidro do painel).
  plantaClara: {
    caule: '#FFFFFF',
    folha: '#FFFFFF',
    broto: '#FFFFFF',
    nervura: '#1C3A12',
    terra: '#FFFFFF',
  },
  // O verde por cima da foto desfocada da coluna do painel: mais escuro que o da marca
  // (destaque.base) e meio transparente, para a foto aparecer. O último número é a opacidade.
  vidro: {
    fundo: 'rgba(14, 32, 9, 0.6)',
    borda: 'rgba(255, 255, 255, 0.15)',
  },
  erro: '#A3271A',
  sucesso: '#9CC3A3',
  foco: '#9CC3A3',
}

export type Cores = typeof cores
