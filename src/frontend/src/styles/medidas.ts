export const espaco = {
  1: '2px',
  2: '4px',
  3: '6px',
  4: '8px',
  5: '10px',
  6: '12px',
  7: '14px',
  8: '16px',
  9: '18px',
  10: '20px',
  11: '24px',
  12: '28px',
  13: '32px',
  14: '48px',
}

export const fonte = {
  familia: "'Figtree', system-ui, sans-serif",
  peso: {
    normal: 400,
    medio: 500,
    semiforte: 600,
    forte: 700,
    extra: 800,
  },
  tamanho: {
    legenda: '13px',
    pequeno: '14px',
    apoio: '15px',
    corpo: '16px',
    destaque: '17px',
    secao: '18px',
    campo: '17px',
    botao: '18px',
    frase: '19px',
    marcaNoTopo: '21px',
    titulo: '26px',
    tituloComputador: '28px',
    tituloDeAcesso: '32px',
    tituloNoMapa: '24px',
    tituloDaTela: '30px',
    tituloDoDetalhe: '34px',
    tituloDaConfirmacao: '24px',
    marca: '30px',
    marcaComputador: '34px',
    temperatura: '30px',
    temperaturaComputador: '34px',
  },
  alturaLinha: {
    justa: 1,
    media: 1.4,
    solta: 1.5,
  },
  espacamentoDaMarca: '-0.02em',
}

export const raio = {
  barra: '6px',
  selo: '8px',
  etiqueta: '10px',
  campo: '12px',
  botao: '14px',
  cartao: '16px',
  cartaoGrande: '18px',
  aba: '11px',
  quadro: '20px',
  folha: '24px',
  pilula: '999px',
  circulo: '50%',
}

export const sombra = {
  etiqueta: '0 2px 8px rgba(28, 42, 31, 0.18)',
  flutuante: '0 4px 16px rgba(28, 42, 31, 0.14)',
  mensagem: '0 6px 20px rgba(28, 42, 31, 0.25)',
  folha: '0 -6px 24px rgba(28, 42, 31, 0.14)',
  cartaoNoMapa: '0 6px 24px rgba(28, 42, 31, 0.16)',
  abaEscolhida: '0 1px 4px rgba(28, 42, 31, 0.15)',
  bolinhaDaChave: '0 1px 3px rgba(0, 0, 0, 0.25)',
}

export const altura = {
  toque: '44px',
  botaoRedondo: '48px',
  botaoSecundario: '52px',
  campo: '54px',
  botao: '56px',
  iconeEmDestaque: '64px',
  numeroDoPasso: '28px',
  avatar: '36px',
  opcao: '60px',
  bolinhaDaOpcao: '22px',
  listaDeCulturas: '232px',
  mapaNoComputador: '520px',
  mapaDoPainelNoComputador: '600px',
  // No celular, o mapa fica parado no alto e a folha com as lavouras sobe por cima dele.
  mapaNoCelular: '45dvh',
  inicioDaFolha: '40dvh',
  alcaDaFolha: '5px',
  bolinhaDaLegenda: '12px',
  carregandoLinha: '18px',
  carregandoTitulo: '24px',
  carregandoCartao: '92px',
  barraDoCiclo: '12px',
  aba: '46px',
  filtro: '40px',
  iconeDaConfirmacao: '56px',
  chave: '32px',
  bolinhaDaChave: '24px',
  faixaDoLogin: '290px',
  faixaDoComputador: '320px',
}

// Até 1024px, as telas de celular. Acima disso, o menu no topo e o conteúdo em colunas.
export const quebra = {
  computador: '1024px',
}

export const largura = {
  // As telas que não têm versão de computador ficam num cartão centralizado deste tamanho.
  cartaoCentral: '480px',
  formulario: '420px',
  textoDaFaixa: '460px',
  colunaDoFormulario: '480px',
  faixa: '520px',
  formularioDaLavoura: '520px',
  colunaDaLavoura: '400px',
  mapa: '560px',
  colunaDoPainel: '380px',
  alcaDaFolha: '44px',
  carregandoCurto: '70px',
  carregandoMedio: '140px',
  carregandoLongo: '220px',
  detalhe: '1280px',
  colunaDoDetalhe: '340px',
  colunaDaPrevisao: '600px',
  diaDaPrevisao: '96px',
  diaNaLista: '52px',
  seloDoHistorico: '82px',
  tabelaDoHistorico: '520px',
  chave: '52px',
  conta: '640px',
  textoDoPerigo: '360px',
}

export const espessura = {
  linha: '1px',
  borda: '1.5px',
  bordaDeErro: '2px',
  opcao: '2px',
  opcaoEscolhida: '7px',
  foco: '3px',
}

// Os ícones do lucide recebem número, e não texto com px.
export const icone = {
  selo: 16,
  botao: 18,
  erroDoCampo: 18,
  seta: 22,
  aviso: 22,
  marcaNoTopo: 22,
  topo: 24,
  destaque: 32,
  marca: 34,
  marcaComputador: 40,
  clima: 40,
  busca: 20,
  avisoDoDetalhe: 24,
  tempoNaLista: 26,
  tempoNoCartao: 34,
  confirmacao: 30,
}

// O marcador parado no meio do mapa, com a ponta no ponto marcado.
export const marcador = {
  largura: 56,
  altura: 72,
  // Os marcadores das lavouras no mapa do painel.
  larguraNoPainel: 40,
  alturaNoPainel: 52,
}

export const tracoDoIcone = {
  normal: 2,
  forte: 2.4,
}
