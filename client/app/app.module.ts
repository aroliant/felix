import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultComponent } from './layouts/default/default.component';
import { OtherComponent } from './layouts/other/other.component';
import { HomeComponent } from './pages/home/home.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BucketComponent } from './pages/buckets/bucket/bucket.component';
import { UsersComponent } from './pages/users/users.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { BucketsComponent } from './pages/buckets/buckets.component';
import { BucketSettingsComponent } from './pages/buckets/bucket/bucket-settings/bucket-settings.component';

import { MainService } from './services/main.service';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { CreateBucketComponent } from './pages/buckets/create-bucket/create-bucket.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    OtherComponent,
    HomeComponent,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
    BucketComponent,
    UsersComponent,
    SettingsComponent,
    BucketsComponent,
    BucketSettingsComponent,
    SignInComponent,
    CreateBucketComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
