import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export const renavamValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = (control.value ?? '').trim()
  if (!valor) return null // vazio fica a cargo do Validators.required
  const formato = /^[0-9]{11}$/ // 11 dígitos
  return formato.test(valor) ? null : { renavam: true }
}
