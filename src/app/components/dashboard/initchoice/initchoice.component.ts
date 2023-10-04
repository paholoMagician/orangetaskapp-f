import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { LoginService } from '../../login/services/login.service';
import { IpService } from '../services/ip.service';
import { FocusTrackingService } from '../services/focus-tracking.service';

@Component({
  selector: 'app-initchoice',
  templateUrl: './initchoice.component.html',
  styleUrls: ['./initchoice.component.scss']
})
export class InitchoiceComponent implements OnInit {

  @Output() appchoice: EventEmitter<any> = new EventEmitter<any>();

  constructor( private login: LoginService, private dash: DashboardService,
    private ipService: IpService,
    private focusTrackingService: FocusTrackingService ) { }

    ngOnInit(): void {
        this.modulos();
    }

    listaModulos:any = [];
    modulos() {
      const xcoduser: any = sessionStorage.getItem('coduser');
      this.login.obtenerModulos(xcoduser).subscribe({
        next: (mod) => {
          this.listaModulos = mod;
          // console.warn('>>>>>>>>>>>>>>>>>>');
          // console.warn(this.listaModulos);
          // console.warn('>>>>>>>>>>>>>>>>>>');
        }
      })
    }

    descriptionmod:string = '';
    titlemod:string = '';
    listDetalleModulo: any = [];
    setDescription(modulos:any) {
      this.descriptionmod = modulos.moduleDescription;
      this.titlemod = modulos.moduleName;
      this.login.obtenerModulosDetalles(modulos.id).subscribe({
        next: (detalle) => {
          this.listDetalleModulo = detalle;
        }
      })

    }

    emitAppChoice(data:any) {
      this.appchoice.emit(data);
    }


}
