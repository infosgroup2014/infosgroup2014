
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlanillaService } from '../servicio/planilla.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']

})
export class LoginComponent implements OnInit {
    constructor(public router: Router,public servicio:PlanillaService) {}



    ngOnInit() {
        console.log('INGRESO AL LOGIN');
        this.servicio.logueado=false;
    }

    onLoggedin() {
        localStorage.setItem('isLoggedin', 'true');
        this.servicio.logueado=true;
        this.router.navigate(['/pages/planilla']);

    }

}
