import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { AvisoDeErro } from '../../../shared/ui/AvisoDeErro'
import { Botao } from '../../../shared/ui/Botao'
import * as S from '../acesso.styles'
import { usePedirLink } from '../api'
import { Topo } from './Topo'

const ESPERA_PARA_PEDIR_DE_NOVO = 60 * 1000

// Depois de pedir o link: a pessoa vai ao e-mail, ou pede de novo depois de 1 minuto.
export function EmailEnviado({ email, aoVoltar }: { email: string; aoVoltar: () => void }) {
  const pedirLink = usePedirLink()
  const [esperando, setEsperando] = useState(false)

  useEffect(() => {
    if (!esperando) return
    const relogio = setTimeout(() => setEsperando(false), ESPERA_PARA_PEDIR_DE_NOVO)
    return () => clearTimeout(relogio)
  }, [esperando])

  function pedirDeNovo() {
    pedirLink.mutate(email, { onSuccess: () => setEsperando(true) })
  }

  return (
    <>
      <Topo voltar={{ aoClicar: aoVoltar, rotulo: 'Voltar' }} />
      <S.Conteudo>
        <S.Cabecalho>
          <S.Titulo>Confira seu e-mail</S.Titulo>
          <S.Explicacao>
            Se existir uma conta com <strong>{email}</strong>, mandamos um link para criar uma senha
            nova.
          </S.Explicacao>
        </S.Cabecalho>
        <S.Dicas>
          <S.Dica>
            <S.NumeroDaDica aria-hidden>1</S.NumeroDaDica>
            <span>
              O link vale por <strong>30 minutos</strong>.
            </span>
          </S.Dica>
          <S.Dica>
            <S.NumeroDaDica aria-hidden>2</S.NumeroDaDica>
            <span>
              Não chegou? Olhe também a caixa de <strong>spam</strong>.
            </span>
          </S.Dica>
        </S.Dicas>
        {pedirLink.error && <AvisoDeErro titulo={pedirLink.error.message} />}
        <Botao variante="neutro" onClick={pedirDeNovo} disabled={esperando || pedirLink.isPending}>
          {esperando ? 'Enviamos de novo. Aguarde 1 minuto para pedir outro.' : 'Enviar de novo'}
        </Botao>
        <S.Rodape>
          <Link to="/entrar">Voltar para o login</Link>
        </S.Rodape>
      </S.Conteudo>
    </>
  )
}
