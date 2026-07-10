import { FormControl } from '@angular/forms'
import { chassiValidator } from './chassi'

describe('chassiValidator', () => {
  it('aceita VIN válido de 17 caracteres', () => {
    expect(chassiValidator(new FormControl('9BWZZZ377VT004251'))).toBeNull()
  })

  it('aceita minúsculo (normaliza para maiúsculo)', () => {
    expect(chassiValidator(new FormControl('9bwzzz377vt004251'))).toBeNull()
  })

  it('rejeita menos de 17 caracteres', () => {
    expect(chassiValidator(new FormControl('9BWZZZ377'))).toEqual({ chassi: true })
  })

  it('rejeita caracteres proibidos (I, O, Q)', () => {
    expect(chassiValidator(new FormControl('9BWZZZ377VT00425I'))).toEqual({ chassi: true })
  })

  it('ignora vazio (fica a cargo do required)', () => {
    expect(chassiValidator(new FormControl(''))).toBeNull()
  })
})
