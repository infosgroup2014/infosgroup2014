import { Banco } from "./Banco";
import { ProgramacionPla } from "./ProgramacionPla";

export class ArchivoNBRequest{
    banco:Banco;
    descripcion:string;
    programacionPrincipal:ProgramacionPla;
    programaciones:ProgramacionPla[];
    constructor(){

    }
}
