import { Component, OnInit } from '@angular/core';
import { UserService } from 'client/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { useAnimation } from '@angular/animations';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users = []
  actions = {
    userToDelete: {
      username: ''
    },
    userToAdd: {
      username: '',
      password: '',
      role: '',
      status: ''
    },
    userToEditIndex: 0
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

  updateUser() {

    if (this.users[this.actions.userToEditIndex].username == '') {
      this.toastr.warning('Enter User Name')
      return false
    }

    let user = {}

    if (this.users[this.actions.userToEditIndex].password === undefined || this.users[this.actions.userToEditIndex].password === '') {

      user = {
        username: this.users[this.actions.userToEditIndex].username,
        role: this.users[this.actions.userToEditIndex].role,
        status: this.users[this.actions.userToEditIndex].status
      }

      delete this.users[this.actions.userToEditIndex].password

    } else {

      user = {
        username: this.users[this.actions.userToEditIndex].username,
        password: this.users[this.actions.userToEditIndex].password,
        role: this.users[this.actions.userToEditIndex].role,
        status: this.users[this.actions.userToEditIndex].status
      }

    }

    this.userService.updateUser(user).subscribe((updateUserResponse: any) => {
      if (updateUserResponse.success) {
        this.toastr.success(updateUserResponse.message, 'Success!')
        this.closeEditUserModal()
      } else {
        this.toastr.error(updateUserResponse.message)
        this.closeEditUserModal()
      }
    })

  }

  addUser() {

    if (this.actions.userToAdd.username == '') {
      this.toastr.warning('Enter User Name')
      return false
    }

    if (this.actions.userToAdd.role == '') {
      this.toastr.warning('Select Role')
      return false
    }

    if (this.actions.userToAdd.password == '') {
      this.toastr.warning('Enter Password')
      return false
    }


    this.userService.addUser(this.actions.userToAdd).subscribe((userAddStatus: any) => {
      if (userAddStatus.success) {
        this.toastr.success(userAddStatus.message, 'Success!')
        this.users.push(this.actions.userToAdd)
        this.closeAddUserModal()
        this.actions.userToAdd = {
          username: '',
          password: '',
          role: '',
          status: 'active'
        }
      } else {
        this.toastr.error(userAddStatus.message)
        this.closeAddUserModal()
      }
    })

  }


  openAddUserModal() {
    document.getElementById('AddUserModal').style.display = 'block';
  }
  closeAddUserModal() {
    document.getElementById('AddUserModal').style.display = 'none';
  }

  openEditUserModal(userIndex) {
    this.actions.userToEditIndex = userIndex
    document.getElementById('EditUserModal').style.display = 'block';
  }
  closeEditUserModal() {
    document.getElementById('EditUserModal').style.display = 'none';
  }

  openDeleteUserModal(userIndex) {
    this.actions.userToDelete = this.users[userIndex]
    document.getElementById('DeleteUserModal').style.display = 'block';
  }
  closeDeleteUserModal() {
    document.getElementById('DeleteUserModal').style.display = 'none';
  }

}
