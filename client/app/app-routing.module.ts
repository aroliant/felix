import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import { HomeComponent } from './pages/home/home.component';
import { BucketComponent } from './pages/buckets/bucket/bucket.component';
import { UsersComponent } from './pages/users/users.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { BucketsComponent } from './pages/buckets/buckets.component';
import { BucketSettingsComponent } from './pages/buckets/bucket/bucket-settings/bucket-settings.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { CreateBucketComponent } from './pages/buckets/create-bucket/create-bucket.component';
import { OtherComponent } from './layouts/other/other.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
      },
      {
        path: 'buckets',
        component: BucketsComponent,
      },
      {
        path: 'buckets/create',
        component: CreateBucketComponent,
      },
      {
        path: 'buckets/:bucketName',
        component: BucketComponent,
      },
      {
        path: 'buckets/:bucketName/bucket-settings',
        component: BucketSettingsComponent,
      },
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
    ]
  },
  {
    path: '',
    component: OtherComponent,
    children: [
      {
        path: 'sign-in',
        component: SignInComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
