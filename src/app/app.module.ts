import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule  } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatSortModule,MatTableModule,MatInputModule,MatDialogModule,MatDatepickerModule,MatNativeDateModule,MatFormFieldModule} from '@angular/material';




import { AppComponent } from './app.component';
import { FileDataComponent, DialogOverviewExampleDialog } from './file-data/file-data.component';
import { FileUtil } from './file-data/file.util';
import { filterPipe } from './file-data/file-data.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UniquePipe } from './unique.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FileDataComponent,
    DialogOverviewExampleDialog,
    UniquePipe,
	filterPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ChartsModule,
    HttpClientModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTableModule,
    BrowserAnimationsModule
  ],
  entryComponents: [DialogOverviewExampleDialog],
  providers: [FileUtil, filterPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
