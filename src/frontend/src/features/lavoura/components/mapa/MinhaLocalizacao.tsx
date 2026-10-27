import { LocateFixed } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from 'styled-components'
import { Botao } from '../../../../shared/ui/Botao'
import type { Ponto } from '../../tipos'
import * as S from './Mapa.styles'

const DEZ_SEGUNDOS = 10 * 1000

// Usa o GPS do próprio navegador.
export function MinhaLocalizacao({ aoAchar }: { aoAchar: (ponto: Ponto) => void }) {
  const tema = useTheme()
  const [procurando, setProcurando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  function procurar() {
    if (!navigator.geolocation) {
      setErro('Este navegador não mostra a sua localização. Busque pela cidade.')
      return
    }
    setProcurando(true)
    setErro(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setProcurando(false)
        aoAchar({ latitude: coords.latitude, longitude: coords.longitude })
      },
      () => {
        setProcurando(false)
        setErro('Não conseguimos a sua localização. Busque pela cidade.')
      },
      { enableHighAccuracy: true, timeout: DEZ_SEGUNDOS },
    )
  }

  return (
    <>
      <Botao variante="contorno" onClick={procurar} disabled={procurando}>
        <LocateFixed size={tema.icone.busca} aria-hidden />
        &nbsp;{procurando ? 'Procurando…' : 'Usar minha localização'}
      </Botao>
      {erro && <S.ErroPequeno role="alert">{erro}</S.ErroPequeno>}
    </>
  )
}
