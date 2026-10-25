import { Link } from 'react-router'

export function NaoEncontrada() {
  return (
    <>
      <h1>Página não encontrada</h1>
      <Link to="/">Voltar para o painel</Link>
    </>
  )
}
