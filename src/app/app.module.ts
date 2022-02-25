import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
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
import { FillUpsTookitComponent } from './components/fill-ups-tookit/fill-ups-tookit.component';
import { DataViewModule } from 'primeng/dataview';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PickListModule } from 'primeng/picklist';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

import { RolesManagementComponent } from './components/roles-management/roles-management.component';
import { MainMenuBarComponent } from './components/main-menu-bar/main-menu-bar.component';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { RoleAssignmentToolkitComponent } from './components/role-assignment-toolkit/role-assignment-toolkit.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
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
    DataViewModule,
    InputNumberModule,
    TagModule,
    OverlayPanelModule,
    TableModule,
    DialogModule,
    InputSwitchModule,
    PickListModule,
    ConfirmPopupModule,
  ],
  declarations: [
    AppComponent,
    SignInFormComponent,
    HelloSidebarComponent,
    SignUpFormComponent,
    FillUpsTookitComponent,
    RolesManagementComponent,
    MainMenuBarComponent,
    HasPermissionDirective,
    RoleAssignmentToolkitComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenAuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
