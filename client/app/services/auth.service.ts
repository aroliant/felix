import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from 'client/environments/environment';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';

const jwtHelper = new JwtHelperService();

@Injectable()
export class AuthService {

  API_URL = 'http://felix.' + environment.API_URL;


  constructor(
    private httpc: HttpClient,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {

    try {

      if (localStorage.getItem('token') != null) {

        const token = localStorage.getItem('token')

        if (!jwtHelper.isTokenExpired(token)) {
          // this.router.navigate(['/']); This will force user to root path on every reload
        } else {
          this.router.navigate(['/login']);
        }

      } else {

        this.router.navigate(['/login']);

      }


    } catch (e) {

      this.router.navigate(['/login']);

    }

  }


  login(user) {

    this.userService.loginUser(user).subscribe((loginResponse: any) => {

      if (loginResponse.success) {

        localStorage.setItem('token', loginResponse.token);
        this.toastr.success('Logged In', 'Success!')
        this.router.navigate(['/buckets']);

      } else {

        this.toastr.error(loginResponse.message)

      }

    })

  }


  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getUser() {

    const token = localStorage.getItem('token');
    const user = jwtHelper.decodeToken(token);

    return user

  }


}
