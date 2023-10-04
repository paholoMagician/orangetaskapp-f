import { Component, Inject, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard/services/dashboard.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { StorageService } from '../dashboard/services/mediafilesservices/storage.service';
import { HttpEventType } from '@angular/common/http';
import { Environments } from 'src/app/environments/environments';
import { fadeInItems } from '@angular/material/menu';

@Component({
  selector: 'app-modal-image-control',
  templateUrl: './modal-image-control.component.html',
  styleUrls: ['./modal-image-control.component.scss']
})
export class ModalImageControlComponent implements OnInit {

  

  _color_console_letras:any;
  _color_console:any;
  link_generate:any;
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
    // this._color_message_response = xcolortexto;
    // this._color_caja_mensajes = xcolorcajas;

  }
  isImageSelected: boolean = false;
  selectedFile!: File;
  uploadProgress: number | null = null;
  uploadMessage: string | null = null;

  constructor(public dialogRef: MatDialogRef<DashboardComponent>, 
              @Inject(MAT_DIALOG_DATA) public data: any,
              private storageService: StorageService, private env: Environments) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const allowedImageExtensions = ['.jpg', '.jpeg', '.png'];
      const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
      this.isImageSelected = fileExtension ? allowedImageExtensions.includes('.' + fileExtension) : false;
    } else {
      this.isImageSelected = false;
    }
  }

  uploadFile() {

    if (this.selectedFile) {
      
      this.uploadProgress = null;
      this.uploadMessage = null;
      
      // Realiza el reemplazo del nombre del archivo
      const originalFileName = this.selectedFile.name;
      const fileNameWithUnderscores = originalFileName.replace(/ /g, "_");
      
      // Asigna el nuevo nombre al archivo
      this.selectedFile = new File([this.selectedFile], fileNameWithUnderscores);
  
      this.storageService.uploadFile(this.selectedFile).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            console.warn(this.selectedFile);
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.uploadMessage = 'Archivo cargado con éxito.';
          }
        },
        error: (error) => {
          this.uploadMessage = 'Error al cargar el archivo.';
          console.error('Error al cargar el archivo:', error);
        },
        complete: () => {
          // Completa el proceso, si es necesario
          // console.warn(this.env.apiUrlStorage()+fileNameWithUnderscores);
          this.link_generate = this.env.apiUrlStorage()+fileNameWithUnderscores;
        }
      });

    }

  }
  
  selectedOption: string = '';
  mostrarSeleccion() {
    console.log('Selección:', this.selectedOption);
  }

  closeDialog() {

    let arr = {

      linkFile: this.link_generate,
      mode: this.selectedOption

    }

    // this.uploadFile();
    setTimeout(() => {
      this.dialogRef.close( arr )
    }, 1000);


  }


  }









  

