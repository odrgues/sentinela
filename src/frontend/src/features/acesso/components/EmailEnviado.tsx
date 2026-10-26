import { Mail } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { AvisoDeErro } from '../../../shared/ui/AvisoDeErro'
import { Botao, BotaoLink } from '../../../shared/ui/Botao'
import * as S from '../acesso.styles'
import { usePedirLink } from '../api'
import { Topo } from './Topo'

const ESPERA_PARA_PEDIR_DE_NOVO = 60 * 1000

// Depois de pedir o link: a pessoa vai ao e-mail, ou pede de novo depois de 1 minuto.
export function EmailEnviado({ email, aoVoltar }: { email: string; aoVoltar: () => void }) {
  const tema = useTheme()
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
        <S.IconeEmDestaque $tom="ok">
          <Mail size={tema.icone.destaque} aria-hidden />
        </S.IconeEmDestaque>
        <S.Cabecalho>
          <S.Titulo>Confira seu e-mail</S.Titulo>
          <S.Texto>
            Se existir uma conta com <strong>{email}</strong>, mandamos um link para criar uma senha
            nova.
          </S.Texto>
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
              Não chegou? Olhe também a caixa de <strong>spam</strong> ou{' '}
              <strong>lixo eletrônico</strong>.
            </span>
          </S.Dica>
        </S.Dicas>
        {pedirLink.error && <AvisoDeErro titulo={pedirLink.error.message} />}
        <Botao variante="neutro" onClick={pedirDeNovo} disabled={esperando || pedirLink.isPending}>
          {esperando ? 'Enviamos de novo. Aguarde 1 minuto para pedir outro.' : 'Enviar de novo'}
        </Botao>
        <BotaoLink to="/entrar" variante="contorno">
          Voltar para o login
        </BotaoLink>
      </S.Conteudo>
    </>
  )
}
