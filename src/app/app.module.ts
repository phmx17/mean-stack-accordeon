import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms'  // this is for ngModel
// Angular Materials
import { 
  MatInputModule, 
  MatCardModule, 
  MatButtonModule, 
  MatToolbarModule, 
  MatExpansionModule, 
  MatProgressSpinnerModule,
  MatPaginatorModule, MatPaginator
} from '@angular/material';
import { HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { HeaderComponent } from './header/header.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { AppRoutingModule } from './app.routing.module';
// import { PostsService } from './posts/posts.service'; // using @injectable instead

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent 
  ], 
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    HttpClientModule
  ],
  providers: [/*PostsService*/],
  bootstrap: [AppComponent]
})
export class AppModule { }
