import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    BucketSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
