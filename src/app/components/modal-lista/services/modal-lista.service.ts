import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ModalListaService {

  constructor( private env: Environments, private http: HttpClient  ) { }

  guardarListas( model:any[] ) {
    return this.http.post( this.env.apiurl()+'Listas/guardarLista',model);
  }


}
