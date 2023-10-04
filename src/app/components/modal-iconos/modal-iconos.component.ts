import { Component, Inject, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-modal-iconos',
  templateUrl: './modal-iconos.component.html',
  styleUrls: ['./modal-iconos.component.scss']
})
export class ModalIconosComponent implements OnInit {
  
  constructor(public dialogRef: MatDialogRef<DashboardComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any, 
              private dash: DashboardService, private icons: SharedService) {}

  gicons:any=[];              
  giconsghost:any=[];              
  _color_console:any;
  _color_console_letras:any;
  ngOnInit(): void {
    
    this.gicons = this.icons.getIcons();
    this.giconsghost = this.icons.getIcons();
    let xcolor: any = localStorage.getItem('color-console');
    this._color_console = xcolor;
    let xcolortexto: any = localStorage.getItem('color-console-texto');
    this._color_console_letras = xcolortexto;

  }

  filter:any;

  filternotes() {
    if (this.filter) {
      this.gicons = this.giconsghost.filter((icons:any) =>
          icons.name.toLowerCase().includes(this.filter.toLowerCase())
      );
    } else {
      this.gicons = this.giconsghost;
    }
  }

  iconChoice:string = '';
  closeDialog(iconchoice:any) {

    let arr = {

      iconchoice: iconchoice

    }

    this.dialogRef.close( arr )
  }

}
