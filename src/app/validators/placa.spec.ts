import { FormControl } from '@angular/forms'
import { placaValidator } from './placa'

describe('placaValidator', () => {
  it('aceita placa Mercosul (ABC1D23)', () => {
    expect(placaValidator(new FormControl('ABC1D23'))).toBeNull()
  })

  it('aceita placa antiga (ABC1234)', () => {
    expect(placaValidator(new FormControl('ABC1234'))).toBeNull()
  })

  it('aceita minúsculo (normaliza para maiúsculo)', () => {
    expect(placaValidator(new FormControl('abc1d23'))).toBeNull()
  })

  it('rejeita formato inválido', () => {
    expect(placaValidator(new FormControl('AB12'))).toEqual({ placa: true })
  })

  it('ignora vazio (fica a cargo do required)', () => {
    expect(placaValidator(new FormControl(''))).toBeNull()
  })
})
