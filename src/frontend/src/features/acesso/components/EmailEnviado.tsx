import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { AvisoDeErro } from '../../../shared/ui/AvisoDeErro'
import { Botao } from '../../../shared/ui/Botao'
import { Mensagem } from '../../../shared/ui/Mensagem'
import * as S from '../acesso.styles'
import { usePedirLink } from '../api'
import { Topo } from './Topo'

// O backend só manda um link por minuto para o mesmo e-mail.
const ESPERA_PARA_PEDIR_DE_NOVO = 60 * 1000

// "1:00", "0:09"
function relogio(segundos: number) {
  return `${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}`
}

// Depois de pedir o link: a pessoa vai ao e-mail, ou pede de novo quando a contagem chega a zero.
// A contagem começa já na chegada, porque o link acabou de ser pedido.
export function EmailEnviado({ email, aoVoltar }: { email: string; aoVoltar: () => void }) {
  const pedirLink = usePedirLink()
  const [liberaEm, setLiberaEm] = useState(() => Date.now() + ESPERA_PARA_PEDIR_DE_NOVO)
  const [agora, setAgora] = useState(() => Date.now())
  // Muda a cada link pedido de novo, para a confirmação aparecer outra vez.
  const [reenvios, setReenvios] = useState(0)

  const faltam = Math.max(0, Math.ceil((liberaEm - agora) / 1000))
  const esperando = faltam > 0

  useEffect(() => {
    if (!esperando) return
    const tique = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(tique)
  }, [esperando])

  function pedirDeNovo() {
    pedirLink.mutate(email, {
      onSuccess: () => {
        setLiberaEm(Date.now() + ESPERA_PARA_PEDIR_DE_NOVO)
        setAgora(Date.now())
        setReenvios((vezes) => vezes + 1)
      },
    })
  }

  return (
    <>
      {reenvios > 0 && <Mensagem key={reenvios} texto="Enviamos outro link" />}
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
          {esperando ? `Enviar de novo em ${relogio(faltam)}` : 'Enviar de novo'}
        </Botao>
        <S.Rodape>
          <Link to="/entrar">Voltar para o login</Link>
        </S.Rodape>
      </S.Conteudo>
    </>
  )
}
