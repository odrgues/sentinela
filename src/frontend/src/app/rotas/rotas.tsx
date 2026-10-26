import type { RouteObject } from 'react-router'
import { Cadastro } from '../../features/acesso/Cadastro'
import { Entrar } from '../../features/acesso/Entrar'
import { MinhaConta } from '../../features/conta/MinhaConta'
import { EsqueciSenha } from '../../features/acesso/EsqueciSenha'
import { NovaSenha } from '../../features/acesso/NovaSenha'
import { DetalheDaLavoura } from '../../features/lavoura/DetalheDaLavoura'
import { EditarLavoura } from '../../features/lavoura/EditarLavoura'
import { NovaLavoura } from '../../features/lavoura/NovaLavoura'
import { Painel } from '../../features/painel/Painel'
import { Casca } from '../../shared/layout/Casca'
import { SoQuemEntrou, SoQuemNaoEntrou } from './guardas'
import { ErroNaTela } from './ErroNaTela'
import { NaoEncontrada } from './NaoEncontrada'

// Uma rota por tela do canvas. A tela chama de "lavoura" o que a API chama de "cultivo".
export const rotas: RouteObject[] = [
  {
    element: <SoQuemNaoEntrou />,
    errorElement: <ErroNaTela />,
    children: [
      { path: '/entrar', element: <Entrar /> },
      { path: '/cadastro', element: <Cadastro /> },
      { path: '/esqueci-senha', element: <EsqueciSenha /> },
    ],
  },
  // O link do e-mail abre mesmo com alguém logado: "Trocar minha senha" passa por aqui.
  { path: '/nova-senha', element: <NovaSenha /> },
  {
    element: <SoQuemEntrou />,
    children: [
      {
        element: <Casca />,
        children: [
          {
            // Se uma tela quebrar, o erro aparece dentro da Casca, com a barra do topo.
            errorElement: <ErroNaTela />,
            children: [
              { path: '/', element: <Painel /> },
              { path: '/lavouras/nova', element: <NovaLavoura /> },
              { path: '/lavouras/:id', element: <DetalheDaLavoura /> },
              { path: '/lavouras/:id/editar', element: <EditarLavoura /> },
              { path: '/conta', element: <MinhaConta /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NaoEncontrada /> },
]
