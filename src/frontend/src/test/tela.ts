// O jsdom não tem matchMedia, e o useNoComputador pergunta por ele.
// Os testes rodam no celular; quem quer o computador chama telaDeComputador().
function fingirTela(noComputador: boolean) {
  window.matchMedia = (consulta: string) =>
    ({
      matches: noComputador,
      media: consulta,
      addEventListener: () => {},
      removeEventListener: () => {},
    }) as unknown as MediaQueryList
}

export function telaDeCelular() {
  fingirTela(false)
}

export function telaDeComputador() {
  fingirTela(true)
}
