import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FillUpsTookitComponent } from './components/fill-ups-tookit/fill-ups-tookit.component';

const routes: Routes = [
  { path: 'fill-ups', component: FillUpsTookitComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
