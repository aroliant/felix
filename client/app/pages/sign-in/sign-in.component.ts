import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'client/app/services/user.service';
import { AuthService } from 'client/app/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  user = {
    username: '',
    password: ''
  }

  logInText = 'Sign In'

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() { }

  login() {

    if (!(this.user.username == null || this.user.username == "")) {
      if ((this.user.password == null || this.user.password == "")) {
        this.toastr.error('Enter Password')
        return false;
      }
    } else {
      this.toastr.error('Enter User Name')
      return false;
    }

    this.logInText = 'Signing In Please Wait';

    this.authService.login(this.user)

    this.logInText = 'Sign In'

  }


}
