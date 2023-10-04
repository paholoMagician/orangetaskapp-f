import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DashboardComponent } from '../dashboard/dashboard.component';

import Swal from 'sweetalert2'
import { ModalListaService } from './services/modal-lista.service';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { FocusTrackingService } from '../dashboard/services/focus-tracking.service';
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
})

@Component({
  selector: 'app-modal-lista',
  templateUrl: './modal-lista.component.html',
  styleUrls: ['./modal-lista.component.scss']
})
export class ModalListaComponent {
  
  _color_console_letras: any;
  _color_console: any;
  presupuestoChecked: boolean = false;
  titulo_lista:string = '';
  
  _pressupuesto:number = 0;

  nuevoElemento = '';
  elementos: any = [];
  listaHTML = '';

  tipoLista = 'ul';

  onInputFocus() {
    this.focusTrackingService.inputHasFocus = true;
  }

  onInputBlur() {
    this.focusTrackingService.inputHasFocus = false;
  }

  constructor( public dialogRef: MatDialogRef<DashboardComponent>, private dash: DashboardService, private focusTrackingService: FocusTrackingService,
    @Inject(MAT_DIALOG_DATA) public data: any, private lista: ModalListaService ) {}

  ngOnInit(): void {
    let xcolor: any = localStorage.getItem('color-console');
    let xcolortexto: any = localStorage.getItem('color-console-texto');
    let xcolorcajas: any = localStorage.getItem('color-caja-mensaje');

    if( xcolor == undefined || xcolortexto == undefined || xcolorcajas == undefined ) {
      
      xcolor = '#546263';
      xcolortexto = 'whitesmoke';
      xcolorcajas = '#394B4D';

    }

    const xcoduser:any = sessionStorage.getItem('coduser');
    this._color_console = xcolor;
    this._color_console_letras = xcolortexto;

  }
  
  view_valor = false;
  valor: number = 0;
  cantidad: number = 1;

  agregarElemento() {
  
      let arr = {
          mostrarValor: this.view_valor,
          nombre: this.nuevoElemento,
          valor: (this.valor * this.cantidad).toFixed(2),
          cantidad: this.cantidad,
          valorUnitario: this.valor,
          presupuestoInicial: this._pressupuesto
      }

      this.elementos.unshift(arr);  
      this.nuevoElemento = '';
      this.valor = 0;
      this.cantidad = 1;
      this.sumatoriaListas();
      this.generarHTML();
      this.validateListaLength();
      // console.warn(this.elementos);
      this.guardarListas();

  }
    
  modelListas:any = [];
  guardarListas() {
    let dates = new Date();
    let dia = dates.getDay();
    let mes = dates.getMonth();
    let anio = dates.getFullYear();
    const xcoduser: any = sessionStorage.getItem('coduser');
    let xcommunity: any = localStorage.getItem('commuvalue');

    if ( xcommunity == null ) xcommunity = xcoduser;

    // const codec: any = 'LIST-'+ xcoduser.slice(0,5)+'-'+this.dash.generateRandomString(15)+dia+mes+anio;

    this.modelListas = {
      "nombrelista":        this.titulo_lista,
      "valorUnitario":      this.valor,
      "cantidad":           this.cantidad,
      "presupuestoInicial": this._pressupuesto,
      "coduser":            xcoduser,
      "feccrea":            new Date(),
      "codcommunity":       xcommunity,
      "estado": 1
    }

    this.lista.guardarListas(this.modelListas)
              .subscribe({
      next: (x) => {
        Toast.fire({ 
                     icon: 'success', 
                     title: 'Iten guardado exitosamente',
                     position:'bottom'
                    })
      }, error: (e) => {
        console.error(e);
      }
    });

  }


  checkbox_dis:boolean = false;
  validateListaLength() {
    console.warn(this.elementos.length)
    if( this.elementos.length == 0 || this.elementos.length == undefined ) {
      this.checkbox_dis = false;
    } else if ( this.elementos.length > 0 ) {
      this.checkbox_dis = true;
    }
  }

  generarHTML() {

    console.warn(this.cantidadChecked)
    console.warn(this.totalChecked)

    if( this.presupuestoChecked ) {
      this.listaHTML = `<div class=" d-flex flex-column bg-light">
        <div class="text-secondary w-100 d-flex justify-content-between align-items-center flex-wrap fs-5 pt-3">
            <div class="d-flex justify-content-between" > 
              <div> 
                <span>${this.titulo_lista} </span> 
              </div>
              <div>
                <small> <strong>(${this.elementos.length})</strong> </small>
              </div>
            </div> 
            <div class="d-flex justify-content-between">  
              <div>
                <small>Presupuesto: </small>
                <span> $ ${this._pressupuesto.toFixed(2)} </span>   
              </div>
              <div> / </div>
              <div> 
                <small>  Excedente: </small>  
                <span> $ ${(this._pressupuesto - this.cantidadTodal).toFixed(2)}</span>
              </div>
            </div>
        </div> <hr> <ul class="list-group">  \n`;
    } else if ( !this.presupuestoChecked ) {
      this.listaHTML = `<div class=" d-flex flex-column bg-light">
          <div class="text-secondary w-100 d-flex justify-content-center align-items-center fs-4 pt-3">
              <div class="d-flex justify-content-between"> 
                <span> ${this.titulo_lista} </span> &nbsp; 
                <small> <strong>(${this.elementos.length})</strong> </small>
              </div> 
          </div> <hr> <ul class="list-group">  \n`;
    }

    

    if( this.cantidadChecked && !this.totalChecked ) {
      this.elementos.forEach((elemento:any) => {
        this.listaHTML += `
          <li class="list-group-item d-flex flex-column">
            <div class="d-flex justify-content-between" style="border-bottom: dashed 1px gray">
              <small> Cantidad: </small> 
              <span> <strong> ${elemento.cantidad} </strong> </span>
            </div>
            <div class="d-flex justify-content-between" style="border-bottom: dashed 1px #F1F1F1">
              <small> Nombre: </small> 
              <span> <strong> ${elemento.nombre.toString().toUpperCase()} </strong> </span>
            </div>
          </li>`;
      });  
    }

    else if ( this.totalChecked && !this.cantidadChecked ) {
      this.elementos.forEach((elemento:any) => {
        this.listaHTML += `
          <li class="list-group-item d-flex flex-column">
            <div class="d-flex justify-content-between" style="border-bottom: dashed 1px gray"> <small>Nombre: </small>   <span>
              <strong>${elemento.nombre.toString().toUpperCase()}</strong>
              </span> 
              </div>
            <div class="d-flex justify-content-between" style="border-bottom: dashed 1px gray"> <small>Valor U.:</small>  <span>
              <strong>${elemento.valorUnitario}</strong>
              </span> 
              </div>
          </li>`;
      });
    }

    else if ( !this.totalChecked && !this.cantidadChecked ) {
      this.elementos.forEach((elemento:any) => {
        this.listaHTML += `
          <li class="list-group-item d-flex flex-column">
            <div class="d-flex justify-content-between"> <small>Item: </small> 
             <span><strong> ${elemento.nombre.toString().toUpperCase()} </strong> </span>        </div>
          </li>`;
      });
    }

    else if ( this.cantidadChecked && this.totalChecked ) {

      this.elementos.forEach((elemento:any) => {
        this.listaHTML += `
          <li class="list-group-item d-flex flex-column p-2">
            <div class="d-flex justify-content-between" style="border-bottom: dashed 1px gray"> 
              <small>Cantidad: </small>
               <span>
                <strong>${elemento.cantidad}</strong></span>      
              </div>
            <div class="d-flex justify-content-between" style="border-bottom: dashed 1px gray"> 
              <small>Nombre: </small>
                 <span>
                <strong>${elemento.nombre}</strong></span>        
              </div>
            <div class="d-flex justify-content-between" style="border-bottom: dashed 1px gray"> 
              <small>Valor U.:</small>
                <span>
                <strong>$ ${elemento.valorUnitario}</strong></span> 
              </div>
            <div class="d-flex justify-content-between" style="border-bottom: dashed 1px gray"> 
              <small>Total: </small>
                  <span>
                <strong class="text-success fs-3" >$ ${elemento.valor}</strong></span>         
              </div>
          </li>`;
      });
    }

    this.listaHTML += '</ul>';

    if( this.cantidadChecked && this.totalChecked ) {
      this.listaHTML += `<div class=" bg-warning text-dark p-2 fs-2 w-100 d-flex justify-content-end " >                          
                              <div>
                                <span> TOTAL: </span> &nbsp; 
                                <strong>$ ${this.cantidadTodal.toFixed(2)} </strong> 
                              </div>                          
                            </div>
                          </div>`;
    }

    
  }
  elementoSeleccionado: any;
  eliminarItem(index: number) {

    if (index >= 0 && index < this.elementos.length) {
      this.elementoSeleccionado = this.elementos[index];
      this.nuevoElemento = this.elementoSeleccionado.nombre;
      this.valor         = this.elementoSeleccionado.valorUnitario;
      this.cantidad      = this.elementoSeleccionado.cantidad;
      // console.warn(this.elementoSeleccionado);
      this.elementos.splice(index, 1);
    }

    this.validateListaLength();
    this.generarHTML();

  }

  colorpresupuesto: string = 'gray';
  cantidadChecked = false;
  totalChecked = false;
  cantidadTodal: number = 0;
  sumatoriaListas():number {
    this.cantidadTodal = 0;
    this.elementos.filter((x:any)=>{
      this.cantidadTodal += Number(x.valor);
    })


    if( this.cantidadTodal > this._pressupuesto ) {
      Toast.fire({ icon: 'warning', title: 'Este item excede el valor del presupuesto',    position:'bottom' })
      this.colorpresupuesto = 'orangered';
    } else {
      this.colorpresupuesto = 'yellowgreen';
    }
    
    return this.cantidadTodal;
    
  }
  
  closeDialog(opt:number) {
    let arr: any = {
      listagenerada: this.listaHTML,
      generar: opt
    }
    this.dialogRef.close( arr )
  }

}
