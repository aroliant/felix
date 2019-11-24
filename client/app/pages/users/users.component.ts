import { Component, OnInit } from '@angular/core';
import { UserService } from 'client/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users = []
  actions = {
    userToDelete: {},
    userToAdd: {
      username: "",
      password: "",
      role: ""
    }
  }

  constructor(
    private userService: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.userService.getAllUsers().subscribe((getUsersStatus: any) => {
      if (getUsersStatus.success) {
        this.users = getUsersStatus.users
      } else {
        this.toastr.error(getUsersStatus.message)
      }
    })
  }

  deleteUser() {
    this.userService.removeUser(this.actions.userToDelete['username']).subscribe((userDeletionStatus: any) => {
      if (userDeletionStatus.success) {
        this.toastr.success(userDeletionStatus.message, 'Success!')
        this.users.splice(this.users.indexOf(this.actions.userToDelete), 1)
        this.closeDeleteUserModal()
      } else {
        this.toastr.error(userDeletionStatus.message)
        this.closeDeleteUserModal()
      }
    })
  }

  addUser() {

    this.userService.addUser(this.actions.userToAdd).subscribe((userAddStatus: any) => {
      if (userAddStatus.success) {
        this.toastr.success(userAddStatus.message, 'Success!')
        this.users.push(this.actions.userToAdd)
        this.closeAddUserModal()
        this.actions.userToAdd = {
          username: "",
          password: "",
          role: ""
        }
      } else {
        this.toastr.error(userAddStatus.message)
        this.closeAddUserModal()
      }
    })

  }


  openAddUserModal() {
    document.getElementById("AddUserModal").style.display = "block";
  }
  closeAddUserModal() {
    document.getElementById("AddUserModal").style.display = "none";
  }

  openDeleteUserModal(userIndex) {
    this.actions.userToDelete = this.users[userIndex]
    document.getElementById("DeleteUserModal").style.display = "block";
  }
  closeDeleteUserModal() {
    document.getElementById("DeleteUserModal").style.display = "none";
  }

}
