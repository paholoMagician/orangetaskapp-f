import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor( private http: HttpClient, private url: Environments, private route:Router ) { }

  logUser( model:any [] ) {
    return this.http.post( this.url.apiurl() + 'Login/login', model );
  }

  validate(): boolean {
    let email:any    = sessionStorage.getItem('email');
    let nombre:any   = sessionStorage.getItem('nombre');
    let UserCod: any = sessionStorage.getItem('coduser');
    if( UserCod == undefined || UserCod == null || UserCod == '' ) {
      return true;
    } else {
      return false;
    }
  }

  guardarUsuario(model:any[]) {
    return this.http.post( this.url.apiurl() + 'Usuario/guardarUsuario', model );
  }

  closeSession() {
    sessionStorage.removeItem('coduser');
    sessionStorage.removeItem('nombre');
    sessionStorage.removeItem('email');
  }

  crearCuenta( usercod:string, ccia:string, tcuenta:string ) {
    return this.http.get( this.url.apiurl() + 'Usuario/CrearCuentas/' + usercod + '/' + ccia + '/' + tcuenta );
  }

  guardarUbicacion( model:any [] ) {
    return this.http.post( this.url.apiurl() + 'Usuario/guardarUsuarioUbicacion', model );
  }
  
  obtenerModulos( coduser:string ) {
    return this.http.get( this.url.apiurl() + 'Modulos/GetModulos/'+coduser );
  }
  
  obtenerModulosDetalles( id:number ) {
    return this.http.get( this.url.apiurl() + 'Modulos/ObtenerDetalleModulo/'+id );
  }

}
