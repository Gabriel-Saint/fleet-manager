import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export const chassiValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = (control.value ?? '').toUpperCase().trim()
  if (!valor) return null // vazio fica a cargo do Validators.required
  const formato = /^[A-HJ-NPR-Z0-9]{17}$/ // VIN: 17 caracteres, sem I, O, Q
  return formato.test(valor) ? null : { chassi: true }
}
