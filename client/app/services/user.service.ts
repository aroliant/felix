import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from 'client/environments/environment';

@Injectable()
export class UserService {

  API_URL = environment.API_URL;

  constructor(private httpc: HttpClient, private router: Router) {
  }

  // Users

  createDefaultUser() {
    return this.httpc.post(this.API_URL + '/user/default', {});
  }

  loginUser(user) {
    return this.httpc.put(this.API_URL + '/user/login', user);
  }

  getAllUsers() {
    return this.httpc.get(this.API_URL + '/user/');
  }

  addUser(user) {
    return this.httpc.post(this.API_URL + '/user/', user);
  }

  removeUser(username) {
    return this.httpc.delete(this.API_URL + '/user/' + username);
  }

  updateUser(user) {
    return this.httpc.put(this.API_URL + '/user/', user);
  }

}
