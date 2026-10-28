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
  10: '18px',
  11: '20px',
  12: '24px',
  13: '28px',
  14: '40px',
}

export const fonte = {
  // Corpo e títulos. Os pesos carregados estão no main.tsx.
  familia: "'Google Sans', system-ui, sans-serif",
  // O nome no logo. O arquivo da Mortane fica em public/fontes/mortane/ (ver EstiloGlobal.ts).
  familiaDoLogo: "'Mortane', 'Google Sans', system-ui, sans-serif",
  // Dentro dos cartões do painel: o das lavouras e o de resumo.
  familiaDosCartoes: "'Noto Sans', 'Google Sans', system-ui, sans-serif",
  peso: {
    normal: 400,
    medio: 500,
    semiforte: 600,
    forte: 700,
    extra: 800,
  },
  tamanho: {
    logo: '34px',
    // O logo na barra do topo das telas de dentro.
    logoPequeno: '22px',
    // Os textos miúdos, como a fonte das orientações.
    mini: '12px',
    legenda: '12px',
    pequeno: '13px',
    apoio: '12px',
    // A escala do site, tirada da tela de entrar: 12 para apoio, 13 para o texto normal, 15 para
    // títulos de seção, 16/18 para títulos de tela e 20 para números em destaque.
    corpo: '13px',
    destaque: '12px',
    secao: '16px',
    campo: '13px',
    botao: '13px',
    frase: '19px',
    marcaNoTopo: '21px',
    titulo: '22px',
    tituloComputador: '16px',
    tituloDeAcesso: '18px',
    tituloNoMapa: '24px',
    tituloDaTela: '18px',
    tituloDoDetalhe: '18px',
    // Números em destaque: a temperatura do painel, a data do aviso.
    numero: '20px',
    // O nome da lavoura nos quadrinhos do painel.
    nomeDaLavoura: '15px',
    // O título dos quadros de confirmação ("Excluir sua conta?", "Já colheu?").
    tituloDaConfirmacao: '15px',
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
  // O rótulo em maiúsculas (a cultura, no alto dos quadrinhos do painel).
  espacamentoDoRotulo: '0.06em',
}

export const raio = {
  barra: '6px',
  selo: '8px',
  etiqueta: '10px',
  campo: '30px',
  botao: '25px',
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
  // O vidro da coluna do painel, flutuando por cima do mapa: a sombra cai para a direita.
  vidro: '3px 0 22px rgba(28, 42, 31, 0.18)',
  abaEscolhida: '0 1px 4px rgba(28, 42, 31, 0.15)',
  bolinhaDaChave: '0 1px 3px rgba(0, 0, 0, 0.25)',
}

export const altura = {
  toque: '40px',
  botaoRedondo: '44px',
  // O padrão de tamanho do site inteiro (o do painel e das telas de acesso): campos de 44, botão
  // principal de 46 e botões secundários de 40.
  botaoSecundario: '36px',
  campo: '40px',
  botao: '42px',
  iconeEmDestaque: '64px',
  numeroDoPasso: '28px',
  avatar: '32px',
  // A faixa das pílulas do topo no computador (o logo, o menu e a conta).
  barraDoTopo: '64px',
  opcao: '44px',
  bolinhaDaOpcao: '22px',
  listaDeCulturas: '232px',
  // A lista de culturas na folha da nova lavoura no celular.
  listaDeCulturasPequena: '176px',
  mapaNoComputador: '520px',
  // No celular, o mapa fica parado no alto e a folha com as lavouras sobe por cima dele.
  mapaNoCelular: '52dvh',
  inicioDaFolha: '40dvh',
  alcaDaFolha: '5px',
  bolinhaDaLegenda: '12px',
  carregandoLinha: '18px',
  carregandoTitulo: '24px',
  carregandoCartao: '92px',
  barraDoCiclo: '12px',
  // A faixa com a foto de satélite no alto da página da lavoura.
  heroi: '148px',
  heroiNoCelular: '132px',
  // A escala de temperatura do gráfico da semana, com a máxima em cima e a mínima embaixo.
  trilhaDoGrafico: '150px',
  trilhaDoGraficoPequena: '124px',
  // A faixa das barrinhas de chuva, embaixo da escala.
  chuvaNoGrafico: '32px',
  chuvaNoGraficoPequena: '24px',
  // A barrinha do ciclo nos cartões das lavouras do painel.
  barraDoCicloPequena: '6px',
  // A altura mínima dos quadrinhos das lavouras no painel do computador (quase a largura deles).
  quadrinhoDaLavoura: '172px',
  aba: '36px',
  filtro: '36px',
  iconeDaConfirmacao: '44px',
  chave: '32px',
  bolinhaDaChave: '24px',
  // O cartão centralizado das telas de acesso (formulário e foto lado a lado) e a faixa da
  // foto no alto do celular.
  cartaoDeAcesso: '120px',
  faixaDaFoto: '80px',
  // A faixa com a foto no alto da janela da conta.
  faixaDaConta: '96px',
}

// Até 1024px, as telas de celular. Acima disso, o menu no topo e o conteúdo em colunas.
export const quebra = {
  computador: '1024px',
}

export const largura = {
  // As telas que não têm versão de computador ficam num cartão centralizado deste tamanho.
  cartaoCentral: '480px',
  formulario: '380px',
  textoDaFaixa: '460px',
  cartaoDeAcesso: '800px',
  mapa: '560px',
  // A coluna de cartões que flutua por cima do mapa no painel do computador.
  colunaDoPainel: '460px',
  alcaDaFolha: '44px',
  carregandoCurto: '70px',
  carregandoMedio: '140px',
  carregandoLongo: '220px',
  detalhe: '1280px',
  // A página da lavoura no computador: larga, mas com respiro dos lados nas telas grandes.
  paginaDaLavoura: '1440px',
  // O ciclo ao lado do gráfico da semana.
  colunaDoCiclo: '320px',
  // O bloco com o dia do aviso, no computador.
  diaDoAviso: '72px',
  // A barrinha da temperatura (da mínima à máxima) e a da chuva, em cada dia do gráfico.
  capsulaDoGrafico: '10px',
  barraDeChuva: '16px',
  // A amostra de cor na legenda do gráfico.
  amostraDaLegenda: '18px',
  // O ponto que marca a lavoura na foto de satélite do alto.
  pontoDoHeroi: '14px',
  // Cada dia do gráfico da semana, na página da lavoura.
  diaNoGrafico: '88px',
  diaNoGraficoPequeno: '76px',
  seloDoHistorico: '82px',
  tabelaDoHistorico: '520px',
  chave: '52px',
}

export const espessura = {
  linha: '1px',
  borda: '1.5px',
  bordaDeErro: '2px',
  opcao: '2px',
  opcaoEscolhida: '7px',
  // A linha em volta do que está com foco (navegando pelo teclado ou clicando num campo).
  foco: '2px',
}

// Os ícones do lucide recebem número, e não texto com px.
export const icone = {
  selo: 16,
  botao: 18,
  erroDoCampo: 15,
  seta: 22,
  aviso: 22,
  marcaNoTopo: 22,
  topo: 24,
  destaque: 32,
  marca: 34,
  marcaComputador: 40,
  // A plantinha à direita do nome, no logo das telas de acesso.
  logo: 40,
  logoPequeno: 28,
  clima: 40,
  busca: 20,
  avisoDoDetalhe: 20,
  tempoNaLista: 26,
  tempoNoCartao: 26,
  confirmacao: 22,
}

// O marcador parado no meio do mapa, com a ponta no ponto marcado.
export const marcador = {
  // Os marcadores do mapa: o de marcar a lavoura e os das lavouras no painel.
  largura: 36,
  altura: 46,
}

// Quanto o mapa fica borrado atrás do vidro da coluna do painel.
export const desfoque = {
  // O mapa atrás do vidro da coluna do painel e da nova lavoura.
  vidro: '18px',
  // O que fica atrás dos cartões transparentes.
  cartao: '14px',
  // A tela atrás das janelas (Minha conta, as confirmações).
  veu: '8px',
}

export const tracoDoIcone = {
  normal: 2,
  forte: 2.4,
  // O caule da plantinha do logo, no desenho de 120 por 120 (mais grosso porque o desenho é pequeno).
  caule: 5,
}
