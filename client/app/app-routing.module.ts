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
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'buckets',
        component: BucketsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'buckets/create',
        component: CreateBucketComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'buckets/:bucketName',
        component: BucketComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'buckets/:bucketName/bucket-settings',
        component: BucketSettingsComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: '',
    component: OtherComponent,
    children: [
      {
        path: 'login',
        component: SignInComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
