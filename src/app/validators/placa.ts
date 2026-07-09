import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export const placaValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = (control.value ?? '').toUpperCase().trim()
  if (!valor) return null // vazio fica a cargo do Validators.required
  const formato = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/ // Mercosul (ABC1D23) + antigo (ABC1234)
  return formato.test(valor) ? null : { placa: true }
}
