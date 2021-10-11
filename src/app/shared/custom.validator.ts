
import { AbstractControl, Validators } from '@angular/forms';

export class CustomValidators {
    static validoCorreo(dominioValidar:string) {
        return (control : AbstractControl) : { [key: string] : any} | null => {


        const correo : string = control.value;
        console.log('correo:' + correo);

        if (!correo) {
          return null;
        }


        const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        const dominio = correo.substring(correo.lastIndexOf('@') + 1);

        console.log('dominio a validar:'+ dominioValidar.toLowerCase());
        console.log('dominio:'+ dominio.toLowerCase());

        if (regularExpression.test(String(correo).toLowerCase())) {
//        if (dominio.toLowerCase() === dominioValidar.toLowerCase()) {
          console.log('se cumplio'+ regularExpression.test(String(correo).toLowerCase()));
          return null;
        }
        else {
          console.log('no se cumplio'+ regularExpression.test(String(correo).toLowerCase()));
          return { 'validoCorreo' : true };
        }

      };
      };

}
