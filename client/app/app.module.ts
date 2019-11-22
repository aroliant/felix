import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgBytesPipeModule } from 'angular-pipes';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { HelperService } from './services/helper.service';
import { SettingsService } from './services/settings.service';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { CreateBucketComponent } from './pages/buckets/create-bucket/create-bucket.component';
import { UploadFilesComponent } from './pages/buckets/bucket/modal/upload-files/upload-files.component';
import { MoveFilesComponent } from './pages/buckets/bucket/modal/move-files/move-files.component';
import { FoldersComponent } from './pages/buckets/bucket/modal/move-files/folder-component/folder-component.component';
import { PermissionsComponent } from './pages/buckets/bucket/modal/permissions/permissions.component';
import { MetaComponent } from './pages/buckets/bucket/modal/meta/meta.component';
import { ShareComponent } from './pages/buckets/bucket/modal/share/share.component';
import { DeleteComponent } from './pages/buckets/bucket/modal/delete/delete.component';
import { CustomToastrComponent } from './components/custom-toastr/custom-toastr.component';

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
    UploadFilesComponent,
    MoveFilesComponent,
    FoldersComponent,
    PermissionsComponent,
    MetaComponent,
    ShareComponent,
    DeleteComponent,
    CustomToastrComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgBytesPipeModule,
    LoadingBarHttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      toastComponent: CustomToastrComponent,
    })
  ],
  providers: [MainService, HelperService, SettingsService],
  bootstrap: [AppComponent],
  entryComponents: [CustomToastrComponent]
})
export class AppModule { }
