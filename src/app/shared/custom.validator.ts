
import { AbstractControl } from '@angular/forms';

export class CustomValidators {
    static validoCorreo(dominioValidar:string) {
        return (control : AbstractControl) : { [key: string] : any} | null => {
        const correo : string = control.value;
        const dominio = correo.substring(correo.lastIndexOf('@') + 1);
        console.log('correo:' + correo);
        console.log('dominio a validar:'+dominioValidar);
        console.log('dominio:'+ dominio);

        if (correo === '' || dominio.toLowerCase() === dominioValidar.toLowerCase()) {
          return null;
        }
        else {
          return { 'validoCorreo' : true };
        }

      };
      }
}
