import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule  } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatSortModule,MatTableModule,MatInputModule,MatDatepickerModule,MatNativeDateModule,MatFormFieldModule} from '@angular/material';




import { AppComponent } from './app.component';
import { FileDataComponent } from './file-data/file-data.component';
import { FileUtil } from './file-data/file.util';
import { filterPipe } from './file-data/file-data.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UniquePipe } from './unique.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FileDataComponent,
    UniquePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    HttpClientModule,
    MatSortModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTableModule,
    BrowserAnimationsModule
  ],
  providers: [FileUtil, filterPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
