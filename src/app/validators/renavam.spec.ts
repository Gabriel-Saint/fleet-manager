import { FormControl } from '@angular/forms'
import { renavamValidator } from './renavam'

describe('renavamValidator', () => {
  it('aceita 11 dígitos', () => {
    expect(renavamValidator(new FormControl('12345678901'))).toBeNull()
  })

  it('rejeita menos de 11 dígitos', () => {
    expect(renavamValidator(new FormControl('123'))).toEqual({ renavam: true })
  })

  it('rejeita valor com letra', () => {
    expect(renavamValidator(new FormControl('1234567890a'))).toEqual({ renavam: true })
  })

  it('ignora vazio (fica a cargo do required)', () => {
    expect(renavamValidator(new FormControl(''))).toBeNull()
  })
})
