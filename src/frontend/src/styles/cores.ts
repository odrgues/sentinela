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
    pagina: '#FFFFFF',
    cartao: '#FFFFFF',
    // Os cartões por cima do vidro (painel e nova lavoura): branco transparente, com o
    // fundo desfocado atrás (desfoque.cartao). O último número é a opacidade.
    cartaoNoVidro: 'rgba(255, 255, 255, 0.9)',
    // A borda fininha dos cartões transparentes, como o brilho na beira de um vidro.
    bordaNoVidro: 'rgba(255, 255, 255, 0.7)',
    campo: '#FFFFFF',
    // O fundo da página da lavoura: um verde-acinzentado bem claro, para os cartões brancos
    // saltarem dele com a sombra. rebaixado é o que fica "afundado" dentro de um cartão branco.
    paginaDaLavoura: '#F1F4E9',
    rebaixado: '#F5F7EF',
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
      // O ícone em cima do marcador cheio (o círculo do resumo da semana).
      sobreMarcador: '#FFFFFF',
      selo: 'rgba(229, 50, 43, 0.2)',
      fundo: '#FBE3DF',
      texto: '#8E1F12',
      corpo: '#5E160D',
    },
    atencao: {
      marcador: '#F5B400',
      sobreMarcador: '#3F2800',
      selo: 'rgba(245, 180, 0, 0.28)',
      fundo: '#FCEFD3',
      texto: '#6E4300',
      corpo: '#4F3000',
    },
    ok: {
      marcador: '#2E9B4E',
      sobreMarcador: '#FFFFFF',
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
  // O escurecido por cima da foto do alto da página da lavoura, mais forte à esquerda (texto).
  heroi: {
    escuro: 'rgba(14, 32, 9, 0.82)',
    claro: 'rgba(14, 32, 9, 0.2)',
    // O ponto que marca a lavoura na foto de satélite, no amarelo do broto da marca, e o anel
    // que pulsa em volta dele.
    ponto: '#F2D27A',
    anel: 'rgba(242, 210, 122, 0.55)',
    contornoDoPonto: 'rgba(14, 32, 9, 0.6)',
  },
  // O gráfico da semana: a barrinha de cada dia vai do frio (embaixo) ao quente (em cima); atrás
  // dela, a faixa ideal da cultura e os limites de calor e de frio, tracejados.
  grafico: {
    quente: '#E8A33A',
    frio: '#8DB9D4',
    faixaIdeal: 'rgba(46, 155, 78, 0.13)',
    bordaDaFaixa: 'rgba(46, 155, 78, 0.35)',
    limiteDeCalor: '#E5322B',
    limiteDeFrio: '#2F7DB0',
    chuva: '#6FA7CB',
    // O dia do aviso que a pessoa está olhando.
    diaEmFoco: '#EEF4EA',
  },
  enso: {
    fundo: '#E3EDF3',
    fundoFim: '#D3E3EC',
    titulo: '#173F56',
    texto: '#1F3B4C',
    // As ondinhas de fundo e a linha entre as partes do cartão.
    onda: 'rgba(23, 63, 86, 0.16)',
    divisoria: 'rgba(23, 63, 86, 0.16)',
  },
  // O cartão do ciclo da lavoura: verde-escuro como a faixa do alto, com as curvas de nível
  // por trás. O dia de hoje no ciclo é o amarelo do broto (marca.sol).
  ciclo: {
    fundo: '#21461A',
    fundoFim: '#112A0B',
    texto: '#F2F7EE',
    textoSuave: 'rgba(242, 247, 238, 0.74)',
    trilho: 'rgba(255, 255, 255, 0.16)',
    feito: '#A9D493',
    textura: 'rgba(255, 255, 255, 0.07)',
    painel: 'rgba(255, 255, 255, 0.09)',
    borda: 'rgba(255, 255, 255, 0.16)',
  },
  // O amarelo do broto da marca e do marcador do mapa.
  marca: {
    sol: '#F2D27A',
    // O marcador vermelho no meio do mapa, para marcar onde fica a lavoura.
    alfinete: '#E5322B',
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
  // O vidro da coluna do painel e da nova lavoura: um branco neutro e transparente, com o mapa
  // borrado atrás dando a cor. O último número é a opacidade.
  vidro: {
    fundo: 'rgba(255, 255, 255, 0.42)',
  },
  erro: '#A3271A',
  sucesso: '#9CC3A3',
  foco: '#9CC3A3',
}

export type Cores = typeof cores
