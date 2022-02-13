import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';

import { feolifeReducer } from './store/reducer';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { MessageModule } from 'primeng/message';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SidebarModule } from 'primeng/sidebar';
import { HelloSidebarComponent } from './components/hello-sidebar/hello-sidebar.component';
import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';
import { AvatarModule } from 'primeng/avatar';
import { MenubarModule } from 'primeng/menubar';
import { TokenAuthInterceptor } from 'src/interceptor/token-auth-http-interceptor';
import { MenuModule } from 'primeng/menu';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({ state: feolifeReducer }),

    CardModule,
    ButtonModule,
    TabViewModule,
    InputTextModule,
    FieldsetModule,
    MessageModule,
    ProgressSpinnerModule,
    SidebarModule,
    AvatarModule,
    MenubarModule,
    MenuModule,
  ],
  declarations: [
    AppComponent,
    SignInFormComponent,
    HelloSidebarComponent,
    SignUpFormComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenAuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
