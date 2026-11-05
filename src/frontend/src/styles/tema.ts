import { cores } from './cores'
import {
  altura,
  desfoque,
  espaco,
  espessura,
  fonte,
  icone,
  largura,
  marcador,
  quebra,
  raio,
  sombra,
  tracoDoIcone,
} from './medidas'
import { texturas } from './texturas'

export const tema = {
  cores,
  espaco,
  espessura,
  fonte,
  raio,
  sombra,
  altura,
  largura,
  quebra,
  icone,
  tracoDoIcone,
  marcador,
  desfoque,
  texturas,
}

export type Tema = typeof tema
