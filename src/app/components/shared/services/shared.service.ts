import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from 'src/app/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  iconsprimeng:any = [];

  constructor( private http: HttpClient, private env: Environments ) { }

  getIcons() {

    this.iconsprimeng = [
      { "icon": "pi pi-home", "name": "Home" },
      { "icon": "pi pi-search", "name": "Search" },
      { "icon": "pi pi-user", "name": "User" },
      { "icon": "pi pi-envelope", "name": "Envelope" },
      { "icon": "pi pi-bell", "name": "Bell" },
      { "icon": "pi pi-calendar", "name": "Calendar" },
      { "icon": "pi pi-check", "name": "Check" },
      { "icon": "pi pi-android", "name": "Android" },
      { "icon": "pi pi-apple", "name": "Apple" },
      { "icon": "pi pi-at", "name": "EMail" },
      { "icon": "pi pi-box", "name": "Box" },
      { "icon": "pi pi-briefcase", "name": "Briefcase" },
      { "icon": "pi pi-building", "name": "Building" },
      { "icon": "pi pi-camera", "name": "Camera" },
      { "icon": "pi pi-car", "name": "Car" },
      { "icon": "pi pi-check-square", "name": "Check 1" },
      { "icon": "pi pi-cloud", "name": "Cloud" },
      { "icon": "pi pi-cog", "name": "Conf" },
      { "icon": "pi pi-comment", "name": "Coment" },
      { "icon": "pi pi-comments", "name": "Coments" },
      { "icon": "pi pi-copy", "name": "Copy" },
      { "icon": "pi pi-credit-card", "name": "CrediCard" },
      { "icon": "pi pi-database", "name": "Database" },
      { "icon": "pi pi-desktop", "name": "Desktop" },
      { "icon": "pi pi-directions", "name": "Directions A" },
      { "icon": "pi pi-directions-alt", "name": "Directions B" },
      { "icon": "pi pi-discord", "name": "Dicord" },
      { "icon": "pi pi-dollar", "name": "Dollar" },
      { "icon": "pi pi-eraser", "name": "Erease" },
      { "icon": "pi pi-exclamation-circle", "name": "Exclamation" },
      { "icon": "pi pi-folder", "name": "Folder" },
      { "icon": "pi pi-flag-fill", "name": "Flag Fill" },
      { "icon": "pi pi-flag", "name": "Flag" },
      { "icon": "pi pi-gift", "name": "Gift" },
      { "icon": "pi pi-github", "name": "Github" },
      { "icon": "pi pi-globe", "name": "Globe" },
      { "icon": "pi pi-google", "name": "Google" },
      { "icon": "pi pi-hashtag", "name": "Hashtag" },
      { "icon": "pi pi-heart", "name": "Heart" },
      { "icon": "pi pi-heart-fill", "name": "Heart Fill" },
      { "icon": "pi pi-hourglass", "name": "Hourglass" },
      { "icon": "pi pi-id-card", "name": "Id Card" },
      { "icon": "pi pi-image", "name": "Image" },
      { "icon": "pi pi-instagram", "name": "Instagram" },
      { "icon": "pi pi-key", "name": "Key" },
      { "icon": "pi pi-language", "name": "Traductor" },
      { "icon": "pi pi-link", "name": "Link" },
      { "icon": "pi pi-linkedin", "name": "Linkedin" },
      { "icon": "pi pi-list", "name": "List" },
      { "icon": "pi pi-lock", "name": "Lock" },
      { "icon": "pi pi-lock-open", "name": "LockOpen" },
      { "icon": "pi pi-map-marker", "name": "Map" },
      { "icon": "pi pi-megaphone", "name": "Megaphone" },
      { "icon": "pi pi-microsoft", "name": "Microsoft" },
      { "icon": "pi pi-mobile", "name": "Mobile" },
      { "icon": "pi pi-money-bill", "name": "Money" },
      { "icon": "pi pi-money-bill", "name": "Money" },
      { "icon": "pi pi-percentage", "name": "Percentage" },
      { "icon": "pi pi-phone", "name": "Phone" },
      { "icon": "pi pi-prime", "name": "Prime" },
      { "icon": "pi pi-print", "name": "Print" },
      { "icon": "pi pi-question", "name": "Question" },
      { "icon": "pi pi-question-circle", "name": "Question Circle" },
      { "icon": "pi pi-reddit", "name": "Reddit" },
      { "icon": "pi pi-shopping-bag", "name": "Shoping Bag" },
      { "icon": "pi pi-shopping-cart", "name": "Shoping Cart" },
      { "icon": "pi pi-slack", "name": "Slack" },
      { "icon": "pi pi-star", "name": "Star" },
      { "icon": "pi pi-star-fill", "name": "Star Fill" },
      { "icon": "pi pi-stopwatch", "name": "Stopwatch" },
      { "icon": "pi pi-sun", "name": "Sun" },
      { "icon": "pi pi-table", "name": "Table" },
      { "icon": "pi pi-tag", "name": "Tag" },
      { "icon": "pi pi-tags", "name": "Tags" },
      { "icon": "pi pi-ticket", "name": "Ticket" },
      { "icon": "pi pi-truck", "name": "Truck" },
      { "icon": "pi pi-twitter", "name": "Twitter" },
      { "icon": "pi pi-verified", "name": "Verified" },
      { "icon": "pi pi-vimeo", "name": "Vimeo" },
      { "icon": "pi pi-wallet", "name": "Wallet" },
      { "icon": "pi pi-whatsapp", "name": "Whatsapp" },
      { "icon": "pi pi-wrench", "name": "Wrench" },
      { "icon": "pi pi-youtube", "name": "Youtube" },
      { "icon": "pi pi-chart-bar", "name": "Chart Bar" },
    ]
    
    return this.iconsprimeng;

  }

  guardarReactionPost(model:any[]) {
    return this.http.post( this.env.apiurl() + 'PostReaction/GuardarReactionPost', model );
  }

  guardarComentarios( model: any [] ) {
    return this.http.post( this.env.apiurl() + 'Comentarios/guardarComentarios', model );
  }

  obtenerComentarios( codmsj:string ) {
    return this.http.get( this.env.apiurl() + 'Comentarios/ObtenerComentarios/'+ codmsj );
  }

  cambiarEstadoComentario(id:any, estado:number, ccuser: string) {
    return this.http.get( this.env.apiurl() + 'Comentarios/ActualizarEstadoComentarios/'+ id + '/' + estado + '/' + ccuser);
  }

  emoticoneslist:any = [];
  emoticones():string {

    this.emoticoneslist = [
      {
        "id": 1,
        "emoticon_icon": "data:image/png;base64,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",
        "emoticon_nombre": "Me enoja"
      },
      {
        "id": 2,
        "emoticon_icon": "data:image/png;base64,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",
        "emoticon_nombre": "Buuuu"
      },{
        "id": 3,
        "emoticon_icon": "data:image/png;base64,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",
        "emoticon_nombre": "Hola"
      }, {
        "id": 4,
        "emoticon_icon": "data:image/png;base64,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",
        "emoticon_nombre": "Me encanta"
      }, {
        "id": 5,
        "emoticon_icon": "data:image/png;base64,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",
        "emoticon_nombre": "Me asusta"
      }
    ]

    return this.emoticoneslist;

  }



}
