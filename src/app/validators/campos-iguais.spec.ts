import { FormControl, FormGroup } from '@angular/forms'
import { camposIguaisValidator } from './campos-iguais'

describe('camposIguaisValidator', () => {
  const criarGrupo = (senha: string, confirmar: string) =>
    new FormGroup({
      senha: new FormControl(senha),
      confirmarSenha: new FormControl(confirmar)
    })

  it('retorna null quando os campos são iguais', () => {
    const grupo = criarGrupo('123456', '123456')
    expect(camposIguaisValidator('senha', 'confirmarSenha')(grupo)).toBeNull()
  })

  it('retorna erro quando os campos são diferentes', () => {
    const grupo = criarGrupo('123456', '654321')
    expect(camposIguaisValidator('senha', 'confirmarSenha')(grupo)).toEqual({ camposIguais: true })
  })
})
