import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class Environments implements OnInit {
 
    constructor( private http: HttpClient ) {}

    // private apiUrl: any = 'http://localhost:5078/'
    private apiUrl: any = 'https://08549b20f27b.ngrok.app/';

    ngOnInit() {
        this.obtenerApiDB();
    }

    obtenerApiDB() {

        this.http.get('https://08549b20f27b.ngrok.app/api/ApiSystems/obtenerPrefix').subscribe( {
            next:( api ) => {
                console.log(api);
            }
        } )

    }

    apiurl():string {
        const env:string = this.apiUrl+'api/';
        // console.warn('Esta es mi API')
        // console.warn(this.apiUrl)
        // const env:string = 'https://72077092bfbe.ngrok.app/api/';
        return env;
    }

    apiUrlStorage(): string {
        const envstorage:string = this.apiUrl+'storage/';
        // const envstorage:string = 'https://72077092bfbe.ngrok.app/storage/';
        return envstorage;
    }

    apiUrlHub(): string {
        const envHub: string = this.apiUrl+'hubs/';
        // const envstorage:string = 'https://72077092bfbe.ngrok.app/hubs/';
        return envHub;
    }

}


