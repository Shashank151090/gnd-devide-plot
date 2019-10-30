import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileDataComponent } from './file-data/file-data.component';


const routes: Routes = [
  {path:"", component: FileDataComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
