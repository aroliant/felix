import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from 'client/environments/environment';

@Injectable()
export class SettingsService {

  API_URL = environment.API_URL;

  constructor(private httpc: HttpClient, private router: Router) {
  }

  // Settings

  getSettings() {
    return this.httpc.get(this.API_URL + '/settings/');
  }

  updateSettings(settings) {
    return this.httpc.put(this.API_URL + '/settings/', settings);
  }

  generateKeys(settings) {
    return this.httpc.put(this.API_URL + '/settings/generateKeys', settings);
  }

}
