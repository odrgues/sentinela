import { Navigate, Outlet } from 'react-router'
import { lerToken } from '../../shared/api/sessao'

// As telas da lavoura e da conta: sem token, a pessoa vai para o login.
export function SoQuemEntrou() {
  return lerToken() ? <Outlet /> : <Navigate to="/entrar" replace />
}

// Login, cadastro e esqueci a senha: quem já entrou vai direto para o painel.
export function SoQuemNaoEntrou() {
  return lerToken() ? <Navigate to="/" replace /> : <Outlet />
}
