import { Component, OnInit } from '@angular/core';
import { AuthService } from 'client/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  user = {}

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.user = this.authService.getUser()
  }

}
