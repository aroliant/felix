import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from 'client/environments/environment';
import { UserService } from './user.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthService {

  API_URL = environment.API_URL;

  constructor(
    private httpc: HttpClient,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {

    try {

      if (localStorage.getItem('token') != null)
        this.router.navigate(['/']);
      else
        this.router.navigate(['/login']);

    } catch (e) {

      this.router.navigate(['/login']);

    }

  }


  loginUser(user) {

    this.userService.loginUser(user).subscribe((loginResponse: any) => {

      if (loginResponse.success) {

        localStorage.setItem('token', loginResponse.user);
        this.toastr.success('Logged In', 'Success!')
        this.router.navigate(['/']);

      } else {

        this.toastr.error(loginResponse.message)

      }

    })

  }


  logout() {

    localStorage.removeItem('token');

  }


}
