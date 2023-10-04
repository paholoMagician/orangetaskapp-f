import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { DashappmoduleModule } from './components/module/dashappmodule.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { ModalconfirmationComponent } from './components/dashboard/modal/modalconfirmation/modalconfirmation.component';
import { ModalIconosComponent } from './components/modal-iconos/modal-iconos.component';
import { ModalImageControlComponent } from './components/modal-image-control/modal-image-control.component';
import { ModalListaComponent } from './components/modal-lista/modal-lista.component';
import { InitchoiceComponent } from './components/dashboard/initchoice/initchoice.component';


@NgModule({
  declarations: [
    AppComponent,
    ModalconfirmationComponent,
    ModalIconosComponent,
    ModalImageControlComponent,
    ModalListaComponent,
  ],
  imports: [
    MatIconModule,
    DashappmoduleModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
