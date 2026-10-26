import { describe, expect, it } from 'vitest'
import { explicacaoDoEnso, porcentagemDoCiclo, resumoDaLavoura, tituloDoEnso } from './detalhe'
import type { DetalheDaLavoura } from './tipos'

const enso = {
  fase: 'El Nino',
  intensidade: 'muito forte',
  indice: 2.16,
  mesPlantio: '2026-08',
  frase: '',
}

describe('tituloDoEnso', () => {
  it('põe o acento na fase e diz quando', () => {
    expect(tituloDoEnso(enso, false)).toBe('El Niño muito forte nesta safra')
    expect(tituloDoEnso({ ...enso, fase: 'La Nina', intensidade: 'fraca' }, true)).toBe(
      'La Niña fraca agora',
    )
  })

  it('na fase neutra, diz que não tem nenhum dos dois', () => {
    expect(tituloDoEnso({ ...enso, fase: 'Neutro' }, false)).toBe(
      'Sem El Niño nem La Niña nesta safra',
    )
  })
})

describe('resumoDaLavoura', () => {
  const soja = {
    cultura: 'Soja',
    tipoCiclo: 'anual',
    dataPlantio: '2026-08-27',
    areaHa: 12,
    municipio: 'Uberaba – MG',
  } as DetalheDaLavoura

  it('junta a cultura, o plantio e a área', () => {
    expect(resumoDaLavoura(soja)).toBe('Soja · plantada em 27/08 · 12 ha')
    expect(resumoDaLavoura(soja, true)).toBe('Soja · plantada em 27/08 · 12 ha · Uberaba – MG')
  })

  it('horta menor que 1 hectare aparece em m²', () => {
    expect(resumoDaLavoura({ ...soja, cultura: 'Chuchu', areaHa: 0.03 })).toBe(
      'Chuchu · plantada em 27/08 · 300 m²',
    )
  })

  it('na perene, diz desde quando existe, e sem área não mostra a área', () => {
    expect(
      resumoDaLavoura({
        ...soja,
        cultura: 'Café',
        tipoCiclo: 'perene',
        dataPlantio: '2019-03-01',
        areaHa: null,
      }),
    ).toBe('Café · lavoura desde 2019')
  })
})

describe('porcentagemDoCiclo', () => {
  it('fica entre 0 e 100', () => {
    expect(porcentagemDoCiclo(45, 120)).toBe(38)
    expect(porcentagemDoCiclo(130, 120)).toBe(100)
  })
})

describe('explicacaoDoEnso', () => {
  const enso = { intensidade: 'forte', indice: 1.8, mesPlantio: '2026-07', frase: '' }

  it('explica o El Niño, a La Niña e o neutro sem termo técnico', () => {
    expect(explicacaoDoEnso({ ...enso, fase: 'El Nino' })).toMatch(/mais quente que o normal/)
    expect(explicacaoDoEnso({ ...enso, fase: 'La Nina' })).toMatch(/mais frio que o normal/)
    expect(explicacaoDoEnso({ ...enso, fase: 'Neutro' })).toMatch(/está no normal/)
  })
})
