import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './services/login.service';
import { DashboardService } from '../dashboard/services/dashboard.service';
import Swal from 'sweetalert2'
import { FocusTrackingService } from '../dashboard/services/focus-tracking.service';
import { IpService } from '../dashboard/services/ip.service';
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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  _log:boolean = true;

  _login:boolean  = true;
  _signUp:boolean = false;

  @Output() logSuccessChange = new EventEmitter<boolean>();

  public loginForm = new FormGroup({
    email:    new FormControl(''),
    password: new FormControl('')
  });

  public signForm = new FormGroup({
    nombre:    new FormControl(''),
    email:    new FormControl(''),
    password: new FormControl(''),
    repassword: new FormControl('')
  });
  
  publicIpAddress: string | null = null;
  modelUbicacion: any = [];
  ngOnInit(): void {
    
  }

  encontrarMiIp() {
    this.ipService.getPublicIp().subscribe({
      next: (x:any) => {
        this.publicIpAddress = x.ip;
      }, error: (e) => {
        console.error(e);
      }
    })
  }

  constructor( private login: LoginService, private dash: DashboardService,
               private ipService: IpService,
               private focusTrackingService: FocusTrackingService ) { }



  onInputFocus() {
    this.focusTrackingService.inputHasFocus = true;
  }
  
  onInputBlur() {
    this.focusTrackingService.inputHasFocus = false;
  }
              
  onSubmitLogin() {
    this.loginUser();
  }

  onSubmitSignUp() {
    this.signUser();
  }

  desabilitar() {
    setTimeout(() => {
      this.btnDis = true;
    }, 500);
  }

  token:any;
  generarTOKEN(): string {
    this.token = this.dash.generateRandomString(15);
    return this.token;
  }

  msjSignUp:string = '';
  btnDis:boolean = true;
  passwordMatchValidator() {
    const password = this.signForm.controls['password'].value;
    const repassword = this.signForm.controls['repassword'].value;
    if (password === repassword) {
      this.btnDis = false;
    } else {
      this.btnDis = true;
    }
  }

  limpiarSignUp() {

  }

  modelUser: any = [];
  signUser() {

    let date = new Date();
    let dia: any = date.getDay();
    let mes: any = date.getMonth();
    let anio: any = date.getFullYear();
    const token = 'US-'+this.generarTOKEN()+dia+mes+anio;

    this.modelUser = {
      Nombre: this.signForm.controls['nombre'].value,
      Email : this.signForm.controls['email'].value,
      Password: this.signForm.controls['password'].value,
      Coduser : token,
      Descripcion : '',
      Estadoconexion: 1
    }

    console.warn(this.modelUser);

    this.login.guardarUsuario(this.modelUser).subscribe({
      next: (x) => {
        Swal.fire(
          '¿En hora buena?',
          'Haz creado tu cuenta exitósamente',
          'success'
        )
      }, error: (e) => {
        Swal.fire(
          'Oops Algo ha ocurrido!',
          'Intenalo de nuevo más tarde',
          'error'
        )
      }, complete: () => {
            this.encontrarMiIp();
            console.error(777);
            this.login.crearCuenta(token, '--', '001').subscribe({
              next: (x) => {
                console.warn('Modulos creados');
              },error: (e) => {
                console.error(e);
              }, complete: () => {
                let arr: any = [];
                arr = {
                  "coduser":     token,
                  "city":        this.modelUbicacion.city,
                  "country":     this.modelUbicacion.country,
                  "countryCode": this.modelUbicacion.countryCode,
                  "isp":         this.modelUbicacion.isp,
                  "lat":         this.modelUbicacion.lat,
                  "lon":         this.modelUbicacion.lon,
                  "org":         this.modelUbicacion.org,
                  "query":       this.publicIpAddress,
                  "region":      this.modelUbicacion.region,
                  "regionName":  this.modelUbicacion.regionName,
                  "status":      this.modelUbicacion.status,
                  "timezone":    this.modelUbicacion.timezone,
                  "zip":         this.modelUbicacion.zip,
                }
              
                this.login.guardarUbicacion(arr).subscribe({
                  next: (x) => { 
                    // console.warn('Ubicaicon por Ip guardada')
                  }, error: (e) => {
                    console.error(e);
                  }
                })
              }
            })
            console.error(778);
        this._signUp = false;
        this._login = true;
        this.loginForm.controls['email'].setValue(this.signForm.controls['email'].value);
        this.loginForm.controls['password'].setValue(this.signForm.controls['password'].value);
      }
    })

  }

  

  modelLogin:any = [];
  response:any=[];
  loginUser() {

    this.modelLogin = {
      "email":    this.loginForm.controls['email'].value,
      "password": this.loginForm.controls['password'].value,
    }

    console.warn(this.modelLogin)

    this.login.logUser( this.modelLogin ).subscribe({

      next: (x) => {
        console.log('RESPUESTA OK');
        console.log(x);
        this.response = x;
      }, error: (e) => {
        console.error(e);
        this.response = e;
      },complete: ()=>{
        console.warn(this.response);
        sessionStorage.setItem('coduser', this.response.coduser);
        sessionStorage.setItem('email',   this.response.email);
        sessionStorage.setItem('nombre',  this.response.nombre);

        this._log = this.login.validate();
        this.logSuccessChange.emit(this._log);

      }

    })
  }

}
