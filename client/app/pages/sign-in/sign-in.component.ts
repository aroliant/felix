import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'client/app/services/user.service';

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
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    if (localStorage.getItem('token') != null)
      this.router.navigate(['/']);
    else
      this.router.navigate(['/login']);

  }

  login() {
    this.logInText = 'Signing In Please Wait';

    if (!(this.user.username == null || this.user.username == "")) {
      if ((this.user.password == null || this.user.password == "")) {
        this.toastr.error('Enter Password')
        return false;
      }
    } else {
      this.toastr.error('Enter User Name')
      return false;
    }

    this.userService.loginUser(this.user).subscribe((loginResponse: any) => {

      this.logInText = 'Sign In'

      if (loginResponse.success) {

        console.log(loginResponse)
        localStorage.setItem('token', loginResponse.user);
        this.toastr.success('Logged In', 'Success!')
        this.router.navigate(['/']);

      } else {

        this.toastr.error(loginResponse.message)

      }

    })

    // this.auth.login(data).subscribe(
    //   (res: any) => {
    //     if (res.success) {
    //       this.enabled = false;
    //       localStorage.setItem('token', res.token);
    //       this.router.navigate(['/tickets/0']);
    //       if (res.err || res.error) {
    //         this.logInText = 'Login';
    //       }
    //     } else {
    //       this.logInText = 'Login';
    //       this.enabled = false;
    //     }
    //     (err) => {
    //       this.logInText = 'Login';
    //       this.enabled = false;
    //     }
    //   }
    // );
  }


}
