// A API guarda o WhatsApp no formato internacional (+5534999999999). Na tela, o jeito que a
// pessoa escreve: (34) 99999-9999. O que não for celular do Brasil aparece como veio.
export function telefone(numero: string | null | undefined) {
  if (!numero) return ''
  const digitos = numero.replace(/\D/g, '')
  const nacional = digitos.startsWith('55') && digitos.length >= 12 ? digitos.slice(2) : digitos
  if (nacional.length === 11) {
    return `(${nacional.slice(0, 2)}) ${nacional.slice(2, 7)}-${nacional.slice(7)}`
  }
  if (nacional.length === 10) {
    return `(${nacional.slice(0, 2)}) ${nacional.slice(2, 6)}-${nacional.slice(6)}`
  }
  return numero
}
