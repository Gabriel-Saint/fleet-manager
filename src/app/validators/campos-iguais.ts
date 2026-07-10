import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms'

export function camposIguaisValidator(campoA: string, campoB: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(campoA)?.value
    const b = grupo.get(campoB)?.value
    return a === b ? null : { camposIguais: true }
  }
}
