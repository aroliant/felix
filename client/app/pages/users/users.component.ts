import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }


  openAddUserModal() {
    document.getElementById("AddUserModal").style.display = "block";
  }
  closeAddUserModal() {
    document.getElementById("AddUserModal").style.display = "none";
  }

  openDeleteUserModal() {
    document.getElementById("DeleteUserModal").style.display = "block";
  }
  closeDeleteUserModal() {
    document.getElementById("DeleteUserModal").style.display = "none";
  }

}
