import { Component, Inject, OnInit } from '@angular/core';
import { DashboardComponent } from '../../dashboard.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-modalconfirmation',
  templateUrl: './modalconfirmation.component.html',
  styleUrls: ['./modalconfirmation.component.scss']
})
export class ModalconfirmationComponent implements OnInit {
  
  _btn_tarea: boolean = true;
  token: any;

  public confirmationForm = new FormGroup({
    seguridad: new FormControl(),
    checkconfirm: new FormControl()
  });
  
  constructor( public dialogRef: MatDialogRef<DashboardComponent>, 
               @Inject(MAT_DIALOG_DATA) public data: any, 
               private dash: DashboardService ) {}

  ngOnInit(): void {
    console.warn(this.data);
    this.generarTOKEN();
  }

  generarTOKEN(): string {
    this.token = this.dash.generateRandomString(15);
    return this.token;
  }

  val:any = null;
  onInputKeyUp(event: any) {
    const inputValue = event.target.value;
    this.val = inputValue === this.token;
    if( this.val ) {
      this._btn_tarea = false;
    } else {
      this._btn_tarea = true;
    }
  }

  closeDialog() {

    let arr = {

      eliminar: this.val,
      codec: this.data

    }

    this.dialogRef.close( arr )
  }

}
