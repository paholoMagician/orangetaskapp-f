import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { LoginService } from '../login/services/login.service';
import { DashboardService } from './services/dashboard.service';
import { FormControl, FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ModalconfirmationComponent } from './modal/modalconfirmation/modalconfirmation.component';
import { ModalIconosComponent } from '../modal-iconos/modal-iconos.component';
import { ModalImageControlComponent } from '../modal-image-control/modal-image-control.component';
import { SharedService } from '../shared/services/shared.service';

import Swal from 'sweetalert2'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Environments } from 'src/app/environments/environments';
import { ModalListaComponent } from '../modal-lista/modal-lista.component';
import { FocusTrackingService } from './services/focus-tracking.service';

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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('description', { static: false }) descriptionTextArea!: ElementRef;
  _show_speeddial: boolean = true;
  _range_setts:    boolean = false;
  _color_setts:    boolean = false;
  _search_setts:   boolean = false;

  opacity_background: number = 0.5;

  height_console: number = 4;

  _IMGE: string | undefined;
  originalSizeKB: number | undefined;
  reducedSizeKB: number | undefined;
  reducedImageURL: string | undefined;

  primaryColor = '#3498db';
  secondaryColor = '#e74c3c';
  _dashboard: boolean = false;
  _show_spinner:boolean = false;
  _show_msj:boolean = true;
  _comunnity_view:boolean = false;
  _community_show:boolean = false;
  filter:any;
  _icon_services:string = 'pi pi-clock'
  _show_inputs:boolean = false;

  /**COLORES DE LA APP */
  /** ======================================= */
  _color_console:          any = '#546263'
  _color_message_response: any = 'white';
  _color_console_letras:   any = '#333939';
  _color_caja_mensajes:    any = '#4E4E4E';
  /** ======================================= */

  message_ia:any = ' wait for any response... '
  showlogin:boolean = true;
  _invitaciones_view: boolean = false;
  _comunidades_view: boolean = false;
  comunidadeslistaCreadas:any = [];
  comunidadeslistaPertenezco:any = [];

  actions: boolean = true;

  codcommunityedit:string = '';
  colorcommunityedit:string = '';
  iconcommunityedit:string = '';
  descripcommunityedit:string = '';
  nombrecommunityedit:string = '';
  icon_create_community: string = 'pi pi-check';
  _act_community: string = 'Crear'
  icon_show: boolean = false;

  radiusValue: any = "120";

  _task_manager:boolean = false;

  public msjForm = new FormGroup({
    title:       new FormControl(),
    subtitle:    new FormControl(),
    description: new FormControl(),
  });
  
  public communityForm = new FormGroup({
    nombrecomunity:      new FormControl(),
    descrip:             new FormControl(),
    color: new FormControl(),
  });

  
  items: any = [];
  radiuspeeddialbutton: string = '120';
  private urlHub: any = this.env.apiUrlHub();
  private connectionTableHub: HubConnection;
  private connectionComentarios: HubConnection;

  constructor( public dialog: MatDialog,
               private login: LoginService, 
               private focusTrackingService: FocusTrackingService,
               private env: Environments,
               private dash: DashboardService, private renderer: Renderer2,
               private sanitizer: DomSanitizer, private shared: SharedService ) {

                this.radiusValue = "120";
                this.radiusValue = Number(this.radiusValue);

                this.connectionTableHub = new HubConnectionBuilder()
                  .withUrl(this.urlHub+'tablaHub')
                  .build();
                this.connectionTableHub.on("TableMessage", message => this.TableMessage(message));

                this.connectionComentarios = new HubConnectionBuilder()
                  .withUrl(this.urlHub+'ComentariosHub')
                  .build();
                this.connectionComentarios.on("SendComentarios", message => this.SendComentarios(message));

               }

               onInputFocus() {
                this.focusTrackingService.inputHasFocus = true;
              }
            
              onInputBlur() {
                this.focusTrackingService.inputHasFocus = false;
              }
            

  nameuser:any;
  xcommun:any;
  ngOnInit() {  
    
    /** Obtencion de datos del sessionstorage */
    let xcoduser:any  = sessionStorage.getItem('coduser');
    let xnameuser:any = sessionStorage.getItem('nombre');
    if(!this.login.validate()) {
      
      console.warn(xnameuser);
      this.nameuser = xnameuser;
      this.showlogin  = false;
      this._dashboard = true; 


      /** Obtencion de datos del localstorage para colores de  tema de la app */
      let xcolor: any = localStorage.getItem('color-console');
      let xcolortexto: any = localStorage.getItem('color-console-texto');
      let xcolorcajas: any = localStorage.getItem('color-caja-mensaje');

      /** Obtencion de datos para inicializacion de las comunidades y funciones adyacentes */
      let xselectedRadioValue:any = localStorage.getItem('commuvalue');
      let xlocalComm:any = localStorage.getItem('communombre');
      let xcolorcomm:any = localStorage.getItem('commucolor');
      let xiconcomm:any = localStorage.getItem('commuicon');


      
      this.selectedRadioValue = xselectedRadioValue;

      if( xcolor == undefined || xcolortexto == undefined || xcolorcajas == undefined ) {
        xcolor = '#546263';
        xcolortexto = 'whitesmoke';
        xcolorcajas = '#394B4D';
      }

      this._color_console = xcolor;
      this._color_console_letras = xcolortexto;
      this._color_message_response = xcolortexto;
      this._color_caja_mensajes = xcolorcajas;
      this.localComm          = xlocalComm;
      this.colorcomm          = xcolorcomm;
      this.iconcomm           = xiconcomm;

      this.obtenerUsuarios();
      this.invitaciones();
      this.obtenerComunidadesPertenecientes();
      this.menuDesplegableRadius();



      this.connectionTableHub.start().then( ()=> {
        console.warn('Conexion fue establecida con el canal de mensajeria de las tablas');
      }).catch( e => {
        console.error(e);
      })
      this.connectionComentarios.start().then( () => {
        console.warn('Conexion fue establecida con el canal de mensajeria de los comentarios');
      }).catch(e=>{
        console.error(e);
      })

      this.showlogin = this.login.validate();




        // if( xcoduser == undefined || xcoduser == null || xcoduser == '' )  {
        //   this._show_inputs = false;
        //   return
        // } else {
        //   this._show_inputs = false;
        //   return
        // }
    }

  }

  closessesion() {

    this.login.closeSession();
    if(this.login.validate()) {
      this.showlogin  = true;
      this._dashboard = false;

      setTimeout(() => {
        window.location.reload()
      }, 500);

    }

  }

  menuDesplegableRadius() {
    this.items = [
      {
          icon: 'pi pi-comment',
          command: () => {
            this._show_inputs = !this._show_inputs;
              // this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
          }
      },
      {
          icon: 'pi pi-list',
          command: () => {
            this.openDialogLista('');
              // this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
          }
      },
      {
          icon: 'pi pi-image',
          command: () => {
            this.openDialogImagen('');
            // this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
          }
      }
  ];
  }
  
  actualizarTareaTerminada(codmsj:string, codcommunity:string) {
    var cod:any;
    const xcoduser: any = sessionStorage.getItem('coduser');
    console.log(codcommunity)
    cod = codcommunity
    if( cod == null ) {
      this.dash.tareaCompletada(codmsj, xcoduser).subscribe({
        next:(x) => {
          console.warn('Tarea terminada con exito');
          Toast.fire({
            icon: 'success',
            title: 'Tarea finalizada con éxito'
          })
        }, error: (e) => {
          console.error(e);
        }, complete: () => {
          this.obtenerMensajes(xcoduser);         
        }
      })        
    } else {
    this.dash.tareaCompletada(codmsj, codcommunity).subscribe({
      next:(x) => {
        console.warn('Tarea terminada con exito');
        Toast.fire({
          icon: 'success',
          title: 'Tarea finalizada con éxito'
        })
      }, error: (e) => {
        console.error(e);
      }, complete: () => {
        this.obtenerMensajes(codcommunity);       
      }
    })
  }

  }

  listaMensajes: any = [];
  private TableMessage( message:any ) {

    // this.listamensajesguardados.unshift(message);
    this.listamensajesguardadosGhost = [];
    this.listamensajesguardadosGhost.unshift(message);

    this.listamensajesguardadosGhost.filter( (element:any) => {
      if ( element.estado == 1 ) {
        element.color = 'beige';
        element.show = true;
        element.icon = 'pi pi-clock';
      } else if ( element.estado == 2 ) {
        element.color = 'yellowgreen';
        element.show = false;
        element.icon = 'pi pi-check';
      } else if ( element.estado == 3 ) {
        element.color = 'orangered';
        element.show = true;
        element.icon = 'pi pi-volume-up';
      } else if ( element.estado == 4 ) {
        element.color = 'gray';
        element.show = true;
        element.icon = 'pi pi-briefcase';
      }

      this.listamensajesguardados.push(element);
      this.arrmsjmodel.push(element);
    })

    this.cargarEstadoColores('#000000');
    this.obtenerEmoticones();

    this.listamensajesguardados.forEach((mensaje: any) => {
      this.obtenerReactionPost(mensaje.codmsj);
      this.obtenerComentarios(mensaje.codmsj);
    });
    
  }

  guardarPersistencia(name:string, value:any) {

    localStorage.setItem( name, value );

  }

  FiltrarUsuariosTomados() {
    this.listausuarios = this.listausuarios.filter((usuario:any) => {
      return !this.usuariocomminitylist.some((primero:any) => primero.coduser === usuario.coduser);
    });
  }


  /** TRABAJO CON COMUNIDAD */
  //#region 

  obtenerComunidadesPertenecientes() {
    
    this._show_spinner = true;
    const xcoduser:any = sessionStorage.getItem('coduser');
    /** COMUNIDAD QUE YO HE CREADO [1] */
    this.dash.ObtenerComunnityPerteneciente(xcoduser, 1).subscribe({
      next: (x) => {
        this.comunidadeslistaCreadas = x;
        console.warn('comunidadeslistaCreadas');
        console.warn(this.comunidadeslistaCreadas);
        this._show_spinner = false;
      }, error: (e) => {
        this._show_spinner = false;
      }
    })

    /** COMUNIDAD QUE YO PERTENEZCO [2] */
    this.dash.ObtenerComunnityPerteneciente(xcoduser, 2).subscribe({
      next: (x) => {
        this.comunidadeslistaPertenezco = x;
        console.warn('comunidadeslistaPertenezco');
        console.warn(this.comunidadeslistaPertenezco);
        this._show_spinner = false;
      }, error: (e) => {
        this._show_spinner = false;
      }
    })
  }

  listaUsuariosComunidad: any = [];
  gestionarComunidad( codcommunity:string, tp:number, invit:string ) {
    this._show_spinner = true;
    if ( tp == 1 || tp == 2 ){
    this.dash.gestionarComunidad(codcommunity, tp, invit).subscribe({
      next: (x) => {
        this._show_spinner = false;
        if( tp == 1 ) {
          this._color_message_response = 'yellowgreen';
          // console.warn('hecho cambiado, ' + codcommunity);
        }
        else if( tp == 2 ) {
          this.listaUsuariosComunidad = x;
          
          // console.warn('OBTENIDO DEL PROCEDURE LISTA PARTICIPANTES');
          // console.warn(this.listaUsuariosComunidad);
        }
      }, error: (e) => {
        console.error(e);
        this._color_message_response = 'orangered';
        this._show_spinner = false;
      }, complete: () => {
        this._color_message_response = '#000';
        this.obtenerComunidadesPertenecientes();
      }
    })  
    } else if (tp == 100) {
    this.dash.gestionarComunidad(codcommunity, tp, invit).subscribe({
      next: (x) => {
          this._color_message_response = 'yellowgreen';
          // console.warn('Comunidad eliminada, ' + codcommunity);
        }, error: (e) => {
          console.error(e);
          this._color_message_response = 'orangered';
        }, complete: () => {
          this._color_message_response = '#000';
          this.obtenerComunidadesPertenecientes();
        }
      })
    }
  }


  idcomunidad:number = 0;
  catchDataCommunityEdit(comunidades:any) {

    // console.warn(comunidades);
    this.idcomunidad = comunidades.id;

    // alert('este es el id de lacomunidad a guardar en la variable: ' + this.idcomunidad);

    this.listaUsuariosComunidad = [];
    this.usuariocomminitylist = [];
    this.codcommunityedit = comunidades.codcomunity;
    this.colorcommunityedit = comunidades.color;
    this.descripcommunityedit = comunidades.descrip;
    this.iconcommunityedit = comunidades.icon;
    this.nombrecommunityedit = comunidades.nombrecomunity;
    this._comunidades_view = false;
    this._comunnity_view = true;
    this.icon_create_community = 'pi pi-sync';
    this._act_community = 'Editar'
    this.gestionarComunidad( comunidades.codcomunity, 2, '---' );

    setTimeout(() => {
      this.listaUsuariosComunidad.filter ( ( element:any ) => {
        let userlog: any = sessionStorage.getItem('coduser');
          if( element.coduser != userlog ) {

          let xarray = {                 
              "nombre": element.usuarioInvitado,
              "email": element.emailInvited,
              "coduser": element.coduserinvite,
              "descripcion": '',
              "codcomunity": element.codcomunity,
              "estado": element.estado,
              "icon": element.icon,
              "nombrecomunity": element.nombrecomunity,
              "permison": element.permison,
              "usuarioCreadorCom": element.usuarioCreadorCom,
              "id": element.id
          }

          this.usuariocomminitylist.push(xarray);

        }
      })

      this.FiltrarUsuariosTomados();

    }, 700);

    this.communityForm.controls['nombrecomunity'].setValue(this.nombrecommunityedit);
    this.communityForm.controls['descrip'].setValue(this.descripcommunityedit);
    this.communityForm.controls['color'].setValue(this.colorcommunityedit);
    this.iconchoice = this.iconcommunityedit;

  }

  EliminarComunidadUsuario(codcommunity:string) {
    
    const x:any = sessionStorage.getItem('coduser');
    this.dash.EliminarComunidadUsuario(codcommunity, x).subscribe({
      next: (x) => {
        console.log('Usuario eliinado de la comunidad con exito!!');
        Toast.fire({
          icon: 'success',
          title: 'Se ha eliminado este usuario de la comunidad',
          position:'bottom'
        })
      }, error: (e) => {
        console.error(e);
      }
    })
  }

  submitCommunity() {
    switch(this.icon_create_community) {
      case 'pi pi-check':
        this.guardarCommunity();
        break;
      case 'pi pi-sync':
        this.editarCommunity();
        break;
    }

  }

  eliminarInvitacion(id:number) {
    this.dash.eliminarInvitacion(id).subscribe({
      next: (x) => {
        this.message_ia = '  Se ha eliminado esta invitación ';
        this._color_message_response = 'yellowgreen';
      }, 
      error: (e) => {
        // console.error(e);
        this.message_ia = '  Algo ha ocurrido: '  ;
        this._color_message_response = 'red';
      }, 
      complete: () => {
        this.invitaciones();
        setTimeout(() => {
          this.message_ia = ' wait for any response... '
          this._color_message_response = 'white'
        }, 1500);
      }
    })
  }

  
  cleanCommunity() {
    this.communityForm.controls['nombrecomunity'].setValue('');
    this.communityForm.controls['descrip'].setValue('');
    // this.communityForm.controls['coduserinvite'].setValue('');
    this.usuariocomminitylist = [];
    this.modelCommunity = [];
    this._comunidades_view = true;
    this._comunnity_view = false;

    this._act_community = 'Crear';
    this.icon_create_community = 'pi pi-check';
    setTimeout(() => {
      this.message_ia = ' wait for any response... '
      this._color_message_response = 'white'
    }, 2500);
  }


  modelCommunity: any = [];  
  guardarCommunity() {

    if( this.communityForm.controls['nombrecomunity'].value == undefined || this.communityForm.controls['nombrecomunity'].value == null || this.communityForm.controls['nombrecomunity'].value =='' )  {
      this.message_ia = ' No puedes enviar datos nulls o vacíos ';
      this._color_message_response = 'orangered';
    }   
    else {
      this.cargarEstadoColores('yellowgreen');
      const xcoduser:any = sessionStorage.getItem('coduser');
      let dates = new Date();
      let dia = dates.getDay();
      let mes = dates.getMonth();
      let anio = dates.getFullYear();

      let count = 1;

      let codec: any = 'COMMU-'+ xcoduser.slice(0,5)+'-'+this.dash.generateRandomString(15)+dia+mes+anio

      // console.log('EN BASE A ESTA LISTA ESTA GUARDANDO LA COMUNIDAD');
      // console.log(this.usuariocomminitylist)

        switch (this.icon_create_community) {
          case 'pi pi-check':
            this.usuariocomminitylist.filter((element:any) => {
              this.modelCommunity = { 
                "codcomunity": codec,
                "nombrecomunity": this.communityForm.controls['nombrecomunity'].value,
                "descrip":        this.communityForm.controls['descrip'].value,
                "feccrea": new Date(),
                "coduserinvite": element.coduser,
                "estado": 1,
                "permison": 0,
                "codusercrea": xcoduser,
                "icon": this.iconchoice,
                "color": this.communityForm.controls['color'].value
              }           

              // alert('ESTAS A PUNTO DE GUARDAR CON PERMISO DE CREACION');
              this.dash.guardarCommunity( this.modelCommunity ).subscribe({
                next: (x) => {
                  this.message_ia = ' La comunidad se ha creado con '+count+' usuario(s)';
                  this._color_message_response = 'yellowgreen';
                }, error: (e) => {
                  console.error(e);
                  this.message_ia = ' Algo ha pasado ';
                  this._color_message_response = 'orangered';
                  Toast.fire({
                    icon: 'error',
                    title: 'Algo ha ocurrido intentalo de nuevo',
                    position:'top-right'
                  })
                  this.cargarEstadoColores('orangered');
                }, complete: () => {
                  count ++;
                  this.cleanCommunity();
                  this.obtenerUsuarios();
                  this.obtenerComunidadesPertenecientes();
                  this.cargarEstadoColores('#000');
                  Toast.fire({
                    icon: 'success',
                    title: 'Comunidad generada',
                    position:'top-right'
                  })
                } 
                })
              }            
            )
          break;
          case 'pi pi-sync':

              // alert('ESTAS A PUNTO DE GUARDAR CON PERMISO DE EDICION')
              // console.warn('MODEL A GUARDAR')
              // console.warn(this.modelCommunity)
            this.dash.guardarCommunity( this.modelCommunity ).subscribe({
              next: (x) => {
                this.message_ia = ' La comunidad se ha creado con '+count+' usuario(s)';
                this._color_message_response = 'yellowgreen';
              }, error: (e) => {
                console.error(e);
                this.message_ia = ' Algo ha pasado ';
                this._color_message_response = 'orangered';
                Toast.fire({
                  icon: 'error',
                  title: 'Algo ha pasado vuelve a intentarlo',
                  position:'top-right'
                })
                this.cargarEstadoColores('orangered');
              }, complete: () => {
                // count ++;
                // this.cleanCommunity();
                // this.obtenerComunidadesPertenecientes();
                Toast.fire({
                  icon: 'success',
                  title: 'Se ha enviado la invitación exitosamente',
                  position:'top-right'
                })
                this.cargarEstadoColores('#000');
              } 
              })
            break;
      }

    
  }

  }


  editarCommunity() {

    if( this.communityForm.controls['nombrecomunity'].value == undefined || this.communityForm.controls['nombrecomunity'].value == null || this.communityForm.controls['nombrecomunity'].value =='' )  {
      this.message_ia = ' No puedes enviar datos nulls o vacíos ';
      this._color_message_response = 'orangered';
    }   
    else {
      this.cargarEstadoColores('yellowgreen');
      
      this.usuariocomminitylist.filter((element:any) => {

        this.modelCommunity = {
          "codcomunity":    this.codcommunityedit,
          "nombrecomunity": this.communityForm.controls['nombrecomunity'].value,
          "icon":           this.iconchoice,
          "color":          this.communityForm.controls['color'].value
        }
    
        console.log(this.modelCommunity);

        this.dash.actualizarComunidad( this.modelCommunity ).subscribe({
          next: (x) => {
            // this.message_ia = ' La comunidad se ha creado con '+count+' usuario(s)';
            this._color_message_response = 'yellowgreen';
            this.cargarEstadoColores('yellowgreen');
          }, error: (e) => {
            console.error(e);
            this.message_ia = ' Algo ha pasado ';
            this._color_message_response = 'orangered';
            Toast.fire({
              icon: 'error',
              title: 'Algo ha ocurrido intentalo de nuevo',
              position:'top-right'
            })
            this.cargarEstadoColores('orangered');
          }, complete: () => {
            this.cleanCommunity();
            this.obtenerComunidadesPertenecientes();
            this.obtenerUsuarios();
            this.cargarEstadoColores('#000');
            Toast.fire({
              icon: 'success',
              title: 'Comunidad actualizada',
              position:'top-right'
            })
          } 
        })      

      })
    
  }

  }

  usuariocomminitylist:any = [];
  asignarUsuarioCommunity(model:any) {

    this.eliminarUsuario(model)

    // if( this.permison_master_community = 0 ) 

    // icon_create_community = 'pi pi-sync'
    switch( this.icon_create_community )  {
      case 'pi pi-check':
        // alert('Estas asignando un usuario para una posible creacion');      
        this.usuariocomminitylist.push(model)
        // console.warn('usuariocomminitylist con permiso de creacion');
        // console.warn(this.usuariocomminitylist);
      break
      case 'pi pi-sync':

        // alert('Estas asignando un usuario para una posible edicion');      
        let x: any = sessionStorage.getItem('coduser');
        this.modelCommunity = {
                  "codcomunity": this.codcommunityedit,
                  "nombrecomunity": this.communityForm.controls['nombrecomunity'].value,
                  "descrip":        this.communityForm.controls['descrip'].value,
                  "feccrea": new Date(),
                  "coduserinvite": model.coduser,
                  "estado": 1,
                  "permison": 0,
                  "codusercrea": x,
                  "icon": this.iconchoice,
                  "color": this.communityForm.controls['color'].value
                }
              
        this.usuariocomminitylist.push(model)
        // console.warn('usuariocomminitylist con permiso de edicion');
        // console.warn(this.usuariocomminitylist);
        this.guardarCommunity();
      break;

    }



  }


  listausuarios:any = [];
  listausuariosGhost:any = [];
  obtenerUsuarios() {
    
    this.listausuarios = [];
    const xcoduser:any = sessionStorage.getItem('coduser');
    this.dash.obtenerUsuarioGeneral().subscribe({
      next:(x)=>{
        // this.listausuarios = x;
        this.listausuariosGhost = x;
        console.warn(this.listausuarios);
      },complete: () => {
        this.listausuariosGhost.filter((element:any)=>{
          if(xcoduser != element.coduser ){
            this.listausuarios.push(element);
          }
        })

        console.warn(this.listausuarios);

      }
    })
  }

  eliminarUsuario(usuario: any) {
    const index = this.listausuarios.indexOf(usuario);
    if (index !== -1) {
      this.listausuarios.splice(index, 1);
    }
  }

  eliminarUsuarioCommunity(usuario: any) {

      let index = this.usuariocomminitylist.indexOf(usuario);          
      if (index !== -1) {
        this.usuariocomminitylist.splice(index, 1);
      }


      switch( this.icon_create_community ) {
        case 'pi pi-check':
          this.listausuarios.push(usuario);
          // console.warn('=========================');
          // alert('ESTAS ELIMINANDO EN MODO CREACION')
          // console.log(this.icon_create_community);
          // console.warn(this.listausuarios);
          // console.warn('=========================');
        break;
        case 'pi pi-sync' :
          // console.warn('=========================');
          this.listausuarios.push(usuario);
          // this.gestionarComunidad( this.codcommunityedit, 1, '---' );
          // this.eliminarInvitacion();

          // console.warn(usuario)
          this.EliminarComunidadUsuario(usuario.coduser)
          // alert('ESTAS ELIMINANDO EN MODO EDICION')
          // console.warn('=========================');
          break;
      }


  }

//#endregion

/** Otra Modal Dialog */
//#region 


async encodeImageFileAsURL(id: any, imageType: 'BANNER' | 'PERFIL') {
  const filesSelected = document.getElementById(id) as HTMLInputElement;
  const fileId: any = filesSelected.files;

  if (fileId.length > 0) {
    const file = fileId[0];

    this.originalSizeKB = Math.round(file.size / 1024);
    console.log('Peso original de la imagen:', this.originalSizeKB, 'KB');

    try {
      this._IMGE = await this.reduceImageFileSize(file, 150, imageType);
      this.reducedImageURL = this._IMGE;
      

      // Calcular y actualizar el tamaño de la imagen reducida en KB
      const reducedBlob = this.dataURLToBlob(this._IMGE);
      this.reducedSizeKB = Math.round(reducedBlob.size / 1024);
      console.log('Peso reducido de la imagen:', this.reducedSizeKB, 'KB');
    } catch (error) {
      console.error('Error reduciendo el tamaño de la imagen:', error);
    }
  }
}


async reduceImageFileSize(file: File, targetSizeKB: number, tipo:string): Promise<string> {

  const image = new Image();
  const imageLoaded = new Promise((resolve) => {
    image.onload = resolve;
    image.src = URL.createObjectURL(file);
  });
  await imageLoaded;

  const canvas = document.createElement('canvas');
  const ctx:any = canvas.getContext('2d');

  const maxSize = Math.sqrt(targetSizeKB * 1024);
  let width = image.width;
  let height = image.height;

  if (width > maxSize || height > maxSize) {
    if (width > height) {
      height *= maxSize / width;
      width = maxSize;
    } else {
      width *= maxSize / height;
      height = maxSize;
    }
  }

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0, width, height);

  // Puedes ajustar la calidad aquí (0.0 - 1.0)
  const reducedDataURL = canvas.toDataURL(file.type, 0.7);
  URL.revokeObjectURL(image.src);
  this.reducedImageURL = reducedDataURL;    
  return reducedDataURL;

}

dataURLToBlob(dataURL: string): Blob {

  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  return new Blob([arrayBuffer], { type: mimeString });
}


cargarEstadoColores(parameterColor:any) {

  
  const x = <HTMLDivElement> document.getElementById('carga');
  if( x != null ) {
    x.style.background = parameterColor
    x.style.transition = 'ease-in all 1.5s'

    setTimeout(() => {
      x.style.background = '#444'
    }, 1500);
  }
}

listainvitacionespendientes: any = [];
listainvitacionesrechazadas: any = [];
listainvitacionesaceptadas: any = [];
invitaciones() {
  this.listainvitacionespendientes = [];
  this.listainvitacionesrechazadas = [];
  this.listainvitacionesaceptadas = [];
  const xcoduser:any = sessionStorage.getItem('coduser');
  this.dash.obtenerInvitacionesComunidadesNoAceptadas(1,xcoduser,0, 1).subscribe(
  {      
    next: (x) => {
      this.listainvitacionespendientes = x;
    }
  })

  this.dash.obtenerInvitacionesComunidadesNoAceptadas(0,xcoduser,0, 2).subscribe(
  {      
    next: (y) => {
      this.listainvitacionesrechazadas = y;
    }
  })

  this.dash.obtenerInvitacionesComunidadesNoAceptadas(1,xcoduser,1,1).subscribe(
  {      
    next: (z) => {
      this.listainvitacionesaceptadas = z;
    }
  })

}

actualizarEstadoInvitacion( estado: number,  permison: number, tipo:number, codcommunity:string )  {
  this._show_spinner = true;
  const xcoduser:any = sessionStorage.getItem('coduser');
  this.dash.actualizarEstadoInvitacion( estado, xcoduser, permison, tipo, codcommunity ).subscribe({
    next: (x) => {
      this._show_spinner = false;
      if( estado == 1 && permison == 0 ) {
        this.message_ia = ' Invitación reenviada ';
        this._color_message_response = 'orange';
      }
      else if ( estado == 1 && permison == 1 ) {
        this.message_ia = ' Invitación aceptada ';
        this._color_message_response = 'yellowgreen';
      }
      else if ( estado == 0 && permison == 0 ) {
        this.message_ia = ' Invitación rechazada ';
        this._color_message_response = 'orangered';
      }
    }, error: (e) => {
      this._show_spinner = false;
      console.error(e);
    }, complete: () => {
      this.invitaciones();
    }
  })
}


widthmsj:any = '100%';
filternotes() {
  if (this.filter) {
    this.listamensajesguardados = this.arrmsjmodel.filter((notes:any) =>
          notes.title.toLowerCase().includes(this.filter.toLowerCase()) ||
          notes.subtitle.toLowerCase().includes(this.filter.toLowerCase()) ||
          notes.description.toLowerCase().includes(this.filter.toLowerCase()) ||
          notes.nombre.toLowerCase().includes(this.filter.toLowerCase()) 
    );
  } else {
    this.listamensajesguardados = this.arrmsjmodel;
  }
}

calcuWidth() {
  this.cleanCommunity();
  switch(this._community_show) {
    case true:
      this.widthmsj = '75%';
      console.warn(this.widthmsj)
      break;
    case false:
      this.widthmsj = '100%';
      console.warn(this.widthmsj)
      break;
  }

}

cambiarEstadoMSJ( estado:number, coduser:string, codmsj:string ) {

  this.dash.estadoMSJ( estado, coduser, codmsj ).subscribe({
    next: (x) => {
      this.message_ia = '  Estado cambiado a tarea completada ';
      this._color_message_response = 'yellowgreen';
    }, error: (e) => {
      this.message_ia = '  Algo ha ocurrido: '  ;
      this._color_message_response = 'red';
    },complete: () => {
      this.obtenerMensajes(this.selectedRadioValue);
      setTimeout(() => {
        this.message_ia = ' wait for any response... '
        this._color_message_response = 'white'
      }, 1000);
    }
  })

}

  onLogSuccessChange(newValue: boolean) {
    const xuser:any = sessionStorage.getItem('nombre');
    if( newValue ) {
      this.message_ia = ' Verifica tus credenciales '
      this._show_inputs = false;
      this._color_message_response = 'red'
    }
    else {
      this.message_ia = ' Bienvenido ' + xuser.toString().toUpperCase();
      this._color_message_response = 'yellowgreen';
      this._show_inputs = false;
      // this.obtenerMensajes();
      this._dashboard = true;
      this.obtenerComunidadesPertenecientes();
      this.obtenerUsuarios();
      this.invitaciones();
    }
  }

  sanitize(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
  
  cambiarColorConsola(data:any) {
    console.log('COLOR CONSOLE')
    console.log(data)
    localStorage.setItem('color-console', data);
  }
  cambiarColorConsolaTexto(data:any) {
    localStorage.setItem('color-console-texto', data);
  }

  cambiarColorCajaMensajes(data:any) {
    localStorage.setItem('color-caja-mensaje', data);
  }

  limpiar() {
    this.msjForm.controls['title'].setValue('');
    this.msjForm.controls['subtitle'].setValue('');
    this.msjForm.controls['description'].setValue('');
    this.iconbtn = 'pi pi-send';
    setTimeout(() => {
      this.message_ia = ' wait for any response... '
      this._color_message_response = 'white'
    }, 1000);
  }

  guardarReactionPost(data:any, codpost:any) {

    this._show_spinner = true;
    const xcoduser:any = sessionStorage.getItem('coduser');
    
    this.arrayPost = {
      "codemoticon": data.id,
      "codpost": codpost,
      "coduser": xcoduser
    }

    this.shared.guardarReactionPost(this.arrayPost).subscribe({
      next: (x) => {
        this.cargarEstadoColores('yellowgreen');
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this.cargarEstadoColores('orangered');
        this._show_spinner = false;
      }, complete: () => {
        this.obtenerReactionPost(codpost);
      }
    })

  }

  cancelBtn() {
    this.comment = true;
    this.viewbtncancel = false;
    this.iconbtn = 'pi pi-send';
    this.msjForm.controls['title'].setValue('')
    this.msjForm.controls['subtitle'].setValue('')
    this.msjForm.controls['description'].setValue('')
  }

  comment: boolean = true;
  // commentPrefix:string = '';
  viewbtncancel:boolean = false;
  usermsj:any;
  getDataForComment(codmsj:string, usermsj:string) {
    console.warn(1000)
    this.codmsj = codmsj;
    this.usermsj = usermsj;
    this.comment = false;
    this.viewbtncancel = true;
    this.iconbtn = 'pi pi-comments';
    this._placeholdermsj = 'Escribir un comentario';
    if(!this._show_inputs) {
      this._show_inputs = true;

      setTimeout(() => {
        this.descriptionTextArea.nativeElement.focus();
      }, 500);

    }
  }

  modelComentarios:any = [];
  _placeholdermsj: string = 'Escribir una publicación';
  guardarComentarios() {
    this._show_spinner = true;
    // this.msjForm.controls['description'].setValue('');
    const xcoduser:any = sessionStorage.getItem('coduser');
    const xnombre: any = sessionStorage.getItem('nombre');
    this.modelComentarios = {
      "codmsj": this.codmsj,
      "coduser": xcoduser,
      "feccrea": new Date(),
      "comentario1": `<div class="bg-warning p-1 w-100 rounded-pill text-dark" >RE: ${xnombre.toString().toUpperCase() }  >></div> <br> <div class="p-2 w-100" > ${this.msjForm.controls['description'].value} </div>`,
      "estado": 1
    }

    this.shared.guardarComentarios(this.modelComentarios).subscribe({
      next: (x) => {
        this.cargarEstadoColores('yellowgreen');
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this.cargarEstadoColores('orangered');
        this._show_spinner = false;
      }, complete: () => {
        // console.warn(1);
        // alert(this.selectedRadioValue);
        // let xcommu:any = localStorage.getItem('commuvalue');
        // this.obtenerMensajes(xcommu);
        // console.warn(2);
        this._placeholdermsj = 'Escribir una publicación...'
        this.cancelBtn();
      }
    })    
  }

  listamensajesguardados: any = [];
  listamensajesguardadosGhost:any = [];
  arrmsjmodel:any = []
  obtenerMensajes(codtipo:any) {
    this.cargarEstadoColores('yellowgreen');
    const xcoduser:any = sessionStorage.getItem('coduser');
    this.listamensajesguardados = [];
    this.arrmsjmodel = [];
    
    this.dash.obtenerMesj(codtipo).subscribe({
      next: (x) => {
        this.listamensajesguardadosGhost = x;
        console.warn('------MENSAJES GUARDADOS------');
        console.warn(this.listamensajesguardadosGhost);
        console.warn('********************************')
        this.cargarEstadoColores('yellowgreen');
      },error: (e) => {
        console.error(e)
        this.cargarEstadoColores('orangered');
      },complete: () => {
        this.listamensajesguardadosGhost.filter( (element:any) => {
          
          const xcoduser: any = sessionStorage.getItem('coduser');
          console.warn('---------------FA----------------')
          console.warn(xcoduser + ' : ' + element.coduser)
          console.warn('---------------FA----------------')

          if ( xcoduser === element.coduser  ) {
            element.actionsdelete = true;
            
          } else if ( xcoduser != element.coduser ) {
            element.dislike = true ;
          }

          if ( element.estado == 1 ) {
            element.color = 'beige';
            element.show = true;
            element.icon = 'pi pi-clock';
          } else if ( element.estado == 2 ) {
            element.color = 'yellowgreen';
            element.show = false;
            element.icon = 'pi pi-check';
            element.finalizadas = true;
          } else if ( element.estado == 3 ) {
            element.color = 'orangered';
            element.show = true;
            element.icon = 'pi pi-volume-up';
          } else if ( element.estado == 4 ) {
            element.color = 'gray';
            element.show = true;
            element.icon = 'pi pi-briefcase';
          }

          this.listamensajesguardados.push(element);
          this.arrmsjmodel.push(element);
        })

        this.cargarEstadoColores('#000000');
        this.obtenerEmoticones();

        this.listamensajesguardados.forEach((mensaje: any) => {
          this.obtenerComentarios (mensaje.codmsj);
          this.obtenerReactionPost(mensaje.codmsj);

        });
      }
    })
    //} , 1500)
  }


   
  listacomentarios: any = [];
  listacomentariosGhost: any = [];
  obtenerComentarios( codmsj:string ) {

    this._show_spinner = true;
    this.listacomentarios = [];
    this.listacomentariosGhost = [];
    let mensaje: any;
    this.shared.obtenerComentarios(codmsj).subscribe({
      next: (x) => {
        this._show_spinner = false;
        this.listacomentariosGhost = x;
        console.warn('COMENTARIOS');
        console.warn(this.listacomentariosGhost);
        this.listacomentariosGhost.filter((element: any) => {
          if (element.estadoComentario == 3 || element.estadoComentario == 1) {
              console.warn(element);
              this.listacomentarios.push(element);
              if (element.estadoComentario == 3) {
                  element.colorcoment = 'yellowgreen';
              }
          }
      });
      
      // Luego, asocia los comentarios con las publicaciones correspondientes
      this.listamensajesguardados.forEach((mensaje: any) => {
          mensaje.comentariosPosts = this.listacomentarios.filter((comentario: any) => comentario.codmsj === mensaje.codmsj);
      });
        if (mensaje) {
          mensaje.comentariosPosts = this.listacomentarios; 
        }
      }, error: (e) => {
        console.error(e);
        this._show_spinner = false;
      }, complete: () => {
        
      }
    })
  }

  arrcomentarios:any = [];
  private SendComentarios( comentarios:any ) {
    console.log(comentarios.codmsj);
    this.arrcomentarios = [];
    this.arrcomentarios = {
      "idcomentario": comentarios.idcomentario,
        "coduser":     comentarios.coduser,
        // "codmsj":      comentarios.codmsj,
        "feccrea":     comentarios.feccrea,
        "comentario": comentarios.comentario1,
        "estado":      comentarios.estado,
        "nombre":      comentarios.nombre
    }

    console.warn('ESTE ES EL MODELO DE COMENTARIO ENVIADO');
    console.warn(this.arrcomentarios);

    const mensaje = this.listamensajesguardados.find((msj: any) => msj.codmsj === comentarios.codmsj);  
    if (mensaje) {
      mensaje.comentariosPosts.push(this.arrcomentarios);
      console.log(mensaje);
    }
  }

  
  codmsj:any;
  iconbtn:any = 'pi pi-send';
  catchData(data:any) {
    this.codmsj = data.codmsj;
    this.msjForm.controls['title'].setValue( data.title );
    this.msjForm.controls['subtitle'].setValue( data.subtitle );
    this.msjForm.controls['description'].setValue( data.description );
    this.iconbtn = 'pi pi-sync';
    this.viewbtncancel = true;
  }

  onSubmit() {

    switch(this.iconbtn) {
      case 'pi pi-sync':
        this.actualizarMensaje();
        break
      case 'pi pi-send':
        this.guardarMensaje();
        break;
      case 'pi pi-comments':
        this.guardarComentarios();
        break;
    }

  }



  actualizarMensaje() {

    // this.dash.actualizarMensajes()
    if( this.msjForm.controls['title'].value == undefined || this.msjForm.controls['title'].value == null || this.msjForm.controls['title'].value =='' )  {
      this.message_ia = ' No puedes enviar datos nulls o vacíos ';
      this._color_message_response = 'orangered';
    }   
    else if ( this.msjForm.controls['description'].value == undefined || this.msjForm.controls['description'].value == null || this.msjForm.controls['description'].value =='' ) {
      this.message_ia = ' No puedes enviar datos nulls o vacíos ';
      this._color_message_response = 'orangered';
    }
    else {
      this._show_spinner = true;
      this.message_ia = ' Mensaje enviado ';
      this._color_message_response = 'yellowgreen';
      this.cargarEstadoColores('yellowgreen');
      const xcoduser:any = sessionStorage.getItem('coduser');
        
          this.modelMsj = {
            "title": this.msjForm.controls['title'].value,
            "subtitle": this.msjForm.controls['subtitle'].value,
            "codmsj":this.codmsj,
            "description": this.msjForm.controls['description'].value,
            "feccrea": new Date(),
            "coduser": xcoduser,
            "estado": 1,
            "fechacumple": new Date(),
            "tipo": 1,
            "codtipo": this.selectedRadioValue
          }

          // console.warn(this.modelMsj)
        
          this.dash.actualizarMensajes(this.codmsj, this.modelMsj).subscribe({
            next: (x) => {
              this.message_ia = ' Mensaje guardado '
              this._color_message_response = 'yellowgreen'
              this._show_spinner = false;
              Toast.fire({
                icon: 'success',
                title: 'Tarea actualizada con éxito'
              })
            }, error: (e) => {
              console.error(e);
              this.message_ia = ' Algo ha salido mal: '
              this._color_message_response = 'red'
              this._show_spinner = false;
              this.cargarEstadoColores('orangered');
            }, complete: () => {
              //OJO
              this.obtenerMensajes(this.selectedRadioValue);
              this.limpiar();
              this.cancelBtn();
              this.cargarEstadoColores('#000');
            }
          })

    }


  }


 

  cambiarEstadoComentario(id:any, estado:number) {
    const xcoduser: any = sessionStorage.getItem('coduser');
    this._show_spinner = true;
    this._color_message_response = 'yellowgreen'
    this.shared.cambiarEstadoComentario(id, estado, xcoduser).subscribe({

      next: (x) => {
        this._color_message_response = '#444'
        this._show_spinner = false;
      }, error: (e) => {
        console.error(e);
        this._color_message_response = 'orangered'
        this._show_spinner = false;
      }, complete: () => {
        this.obtenerMensajes(this.selectedRadioValue);
      }
    })
  }

  listEmoticones:any = [];
  arrayPost: any = [];
  listaReactionPost:any = [];
  obtenerEmoticones() {
    this.listEmoticones = this.shared.emoticones();
    console.warn('Estos son los emoticones');
    console.warn(this.listEmoticones);
  }

  obtenerReactionPost(codmsj: any) {
    this.dash.obtenerReaction(codmsj).subscribe({
      next: (x) => {
        const mensaje = this.listamensajesguardados.find((msj: any) => msj.codmsj === codmsj);    
        if (mensaje) {
          mensaje.reactions = x;
          mensaje.reactions.forEach((reaccion: any) => {
            const emoticon = this.listEmoticones.find((emo: any) => emo.id === reaccion.codemoticon);
            if (emoticon) {
              reaccion.icono = emoticon.emoticon_icon;
            }
          });
        }
    
        console.warn(this.listaReactionPost);
      },
      error: (e) => {
        // Maneja el error si es necesario
      }
    });
  }
  
  

  
  localComm:string = '';
  colorcomm:string = '';
  iconcomm:string = '';
  onRadioSelect(value: any) { 
    console.warn('value>>>>>>>>>>>>')
    console.warn(value)
    console.warn('value>>>>>>>>>>>>')
    this.selectedRadioValue = value.codcomunity;
    this.localComm = value.nombrecomunity;
    this.colorcomm = value.color;
    this.iconcomm = value.icon;
    localStorage.setItem('commuvalue', this.selectedRadioValue);
    localStorage.setItem('communombre', this.localComm);
    localStorage.setItem('commucolor', this.colorcomm);
    localStorage.setItem('commuicon', this.iconcomm);


    // setInterval(() => {
      this.obtenerMensajes(this.selectedRadioValue);      
      // },500)
  }
  
  onRadioSelectPersonal() {

    this.localComm = 'Tareas Personales';
    this.colorcomm = '#0FC5D4';
    this.iconcomm = 'pi pi-user';

    localStorage.setItem('commuvalue', this.selectedRadioValue);
    localStorage.setItem('communombre', this.localComm);
    localStorage.setItem('commucolor', this.colorcomm);
    localStorage.setItem('commuicon', this.iconcomm);

    const xcoduser:any = sessionStorage.getItem('coduser');
    this.selectedRadioValue = xcoduser;
    localStorage.setItem('commuvalue', this.selectedRadioValue);
    this.obtenerMensajes(this.selectedRadioValue);

  }

  modelMsj:any = [];
  selectedRadioValue: any;
  guardarMensaje() {

    if (this.selectedRadioValue  == null || this.selectedRadioValue  == undefined || this.selectedRadioValue == '') {

      Toast.fire({
        icon: 'warning',
        title: 'Mensaje enviado a una comunidad inexistente',
        footer: 'Por favor elige una comunidad para interactuar',
        position: 'center'
      })
      return;
    }

    else {    

    if( this.msjForm.controls['title'].value == undefined || this.msjForm.controls['title'].value == null || this.msjForm.controls['title'].value =='' )  {
      this.message_ia = ' No puedes enviar datos nulls o vacíos ';
      this._color_message_response = 'orangered';
    }   
    else if ( this.msjForm.controls['description'].value == undefined || this.msjForm.controls['description'].value == null || this.msjForm.controls['description'].value =='' ) {
      this.message_ia = ' No puedes enviar datos nulls o vacíos ';
      this._color_message_response = 'orangered';
    }
    else {
      this.cargarEstadoColores('yellowgreen');
      this._show_spinner = true;
      this.message_ia = ' Mensaje enviado ';
      this._color_message_response = 'yellowgreen';
      const xcoduser:any = sessionStorage.getItem('coduser');
      let dates = new Date();
      let dia = dates.getDay();
      let mes = dates.getMonth();
      let anio = dates.getFullYear();
      let codec: any = 'MSJ-'+ xcoduser.slice(0,5)+'-'+this.dash.generateRandomString(15)+dia+mes+anio

      this.modelMsj = {
        "title": this.msjForm.controls['title'].value ,
        "subtitle": this.msjForm.controls['subtitle'].value ? null : '',
        "codmsj":codec,
        "description": this.msjForm.controls['description'].value,
        "feccrea": new Date(),
        "coduser": xcoduser,
        "estado": 1,
        "fechacumple": new Date(),
        "tipo": 1,
        "codtipo": this.selectedRadioValue
      }
        
      this.dash.guardarMensaje(this.modelMsj).subscribe({
        next: (x) => {
          this._show_spinner = false;
          this.message_ia = ' Mensaje guardado '
          this._color_message_response = 'yellowgreen'
        }, error: (e) => {
          console.error(e);
          this.message_ia = ' Algo ha salido mal: '  
          this._color_message_response = 'red'
          this._show_spinner = false;
          Toast.fire({
            icon: 'error',
            title: 'Algo ha ocurrido, intenta de nuevo'
          })
          this.cargarEstadoColores('orangered');
        }, complete: () => {
          //OJO
          // this.obtenerMensajes(this.selectedRadioValue);
          this.limpiar()
          this.cargarEstadoColores('#000');
          Toast.fire({
            icon: 'success',
            title: 'Se ha publicado correctamente'
          })
        }
      })

    }
    }
  }
  _show_btn_mwnu: boolean = false;
  openDialog(data:any): void { 

    const dialogRef = this.dialog.open( ModalconfirmationComponent, {
      height: '250px',
      width:  '75%',
      data: data, 
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if(result.eliminar) {
        this.eliminaMsj(result.codec);
      }

    });

  }

  _menu_giant_app:boolean = true;
  recibirAppChoice(event:any) {
    console.log('event');
    console.log(event);

    switch(event.id) {
      case 1:
        this._task_manager = true;
        this._menu_giant_app = false;
        break;
    }
  }

  ordenarMensajes() {
    const ordenAscendente = this.ordenAscendente;
  
    this.listamensajesguardados.sort((a: any, b: any) => {
      const fechaA = new Date(a.feccrea).getTime();
      const fechaB = new Date(b.feccrea).getTime();
  
      if (ordenAscendente) {
        return fechaA - fechaB;
      } else {
        return fechaB - fechaA;
      }

    });

  }

  ordenAscendente: boolean = true;
  botonActivo:boolean = false;
  botonActivoCheck:boolean = false;
  botonActivoPendientes:boolean = false;
  cambiarOrdenDePublicaciones() {
    this.ordenAscendente = !this.ordenAscendente;
    if (this.botonActivo) {
      this.botonActivo = false;
    } else {
      this.botonActivo = true;
    }
    this.ordenarMensajes();
  }

  cambiarOrdenDePublicacionesTerminadas() {
    this.listamensajesguardados = [];
    if(this.botonActivoCheck) {
      this.botonActivoCheck = false;
      console.log(this.botonActivoCheck)
      this.listamensajesguardados = this.arrmsjmodel;
    } else {
      this.botonActivoCheck = true;
      this.botonActivoPendientes = false;
      console.log(this.botonActivoCheck)
      this.arrmsjmodel.filter((element:any) => {
        if(element.estado == 2) this.listamensajesguardados.push(element);
      })
      
    }

  }

  cambiarOrdenDePublicacionesPendientes() {
    this.listamensajesguardados = [];
    if(this.botonActivoPendientes) {
      this.botonActivoPendientes = false;
      console.log(this.botonActivoPendientes)
      this.listamensajesguardados = this.arrmsjmodel;
    } else {
      this.botonActivoPendientes = true;
      this.botonActivoCheck = false;
      console.log(this.botonActivoPendientes)
      this.arrmsjmodel.filter((element:any) => {
        if(element.estado == 1) this.listamensajesguardados.push(element);
      }) 
    }
  }

  openDialogLista(data:any) {
    const dialogRef = this.dialog.open( ModalListaComponent, {
      height: '80vh',
      width:  '80%',
      data: data, 
    });

    dialogRef.afterClosed().subscribe( result => {

      if( this.confirmacionCerrarModal ){
        if ( !this._show_inputs ) this._show_inputs = true;
      }

      if( result.generar == 1 ) {
      
        this.msjForm.controls['description'].setValue( `<div > ${this.msjForm.controls['description'].value ? '' : '' } </div> 
                                   <hr> 
                                   <div class="rounded-3 p-2 shadow  m-1 " style="min-width: 200px; max-width: 400px;" > 
                                    ${result.listagenerada}
                                   </div> ` );
      }

      
      
    })

  }
  
  grid_style= 'tareas'
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    console.warn(event)
    console.log(this._dashboard)

    if (this._dashboard) {   
    if (!this.focusTrackingService.inputHasFocus) {
      switch(event.key) {
        case '1':
          switch ( this._show_speeddial ) {
            case true:
              console.warn(this._show_speeddial)
              this._show_speeddial = false;
              break;
              case false:
              console.warn(this._show_speeddial)
              this._show_speeddial = true;
              break;
          }
          break;
        case '2':
          switch ( this._show_inputs ) {
            case true:
              this._show_inputs = false;
              break;
            case false:
              this._show_inputs = true;
              break;
        }
        break;
        case '3':
          this.openDialogImagen('');
          break;
        case '4':
          this.openDialogLista('');
          break;
        case '5':            
          switch ( this._community_show ) {
            case true:
              this._community_show = false;
              this.widthmsj = '100%';
              break;
            case false:
              this._community_show = true;
              this.widthmsj = '75%';
              break;
          }
        break;
        case 'g':
          switch(this.grid_style) {
            case 'tareas d-flex justify-content-evenly flex-wrap align-items-start':
              this.grid_style = 'tareas';
              break;
            case 'tareas':
              this.grid_style = 'tareas d-flex justify-content-evenly flex-wrap align-items-start';
              break;
          }
          break;
      }
    }
  }
  }



  confirmacionCerrarModal: boolean = true;
  openDialogImagen(data:any): void { 

    console.warn(data);

    const dialogRef = this.dialog.open( ModalImageControlComponent, {
      height: '400px',
      width:  '80%',
      data: data, 
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if( this.confirmacionCerrarModal ){
        if ( !this._show_inputs ) this._show_inputs = true;
        console.warn(result.mode);
      }

      if( result.mode == 'view' ) {
        this.msjForm.controls['description'].setValue( `<div> ${this.msjForm.controls['description'].value } </div>  <hr>  <div class="p-2 rounded-3 shadow  m-1 " > <img src="${result.linkFile}" width="75%" > <div> ` );
      }

      else if ( result.mode == 'link' ) {
        this.msjForm.controls['description'].setValue( `<div> ${this.msjForm.controls['description'].value } </div>  <hr> <div class="p-2 rounded-3 shadow  m-1 " > <small class="text-secondary" > Descarga el archivo aquí: </small> <a class="btn btn-warning btn-sm d-flex align-items-center" href="${result.linkFile}"> <i class="pi pi-cloud-download" ></i> Click Aquí </a> <div> ` );
      }

    });
  }

  iconchoice: string = 'pi pi-tag';
  openDialogIcon(): void {

    const dialogRef = this.dialog.open( ModalIconosComponent, {
        height: '400px',
        width:  '75%',
        data: [], 
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      this.iconchoice = result.iconchoice
      
    });

  }

  eliminaMsj( codmsj:any ) {
    this._show_spinner = true;
    this.dash.eliminarMsj( codmsj ).subscribe({
      next: (x) => {
        this._show_spinner = false;
        this.message_ia = ' Mensaje eliminado ! '
        this._color_message_response = 'yellowgreen'
      }, error: (e) => {
        this.message_ia = ' Algo ha salido mal: '  
        this._color_message_response = 'red'
        this._show_spinner = false;
      }, complete: () => {
        //OJO
        this.obtenerMensajes(this.selectedRadioValue);
      }
    })
  }
//#endregion
}



