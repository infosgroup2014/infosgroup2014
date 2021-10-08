import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-idiomas',
  templateUrl: './idiomas.component.html',
  styleUrls: ['./idiomas.component.css']
})
export class IdiomasComponent implements OnInit {

    listaIdiomas=[
        {idioma:'Frances',lee:'SI',escribe:'NO',nivel:'Básico'},
        {idioma:'Ingles',lee:'SI',escribe:'SI',nivel:'Intermedio'},
        {idioma:'Italiano',lee:'NO',escribe:'NO',nivel:'Básico'},
        {idioma:'Español',lee:'SI',escribe:'SI',nivel:'Avanzado'}
    ];

  constructor() { }

  ngOnInit(): void {
  }

}
