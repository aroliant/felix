import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'client/app/services/settings.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'client/app/services/helper.service';
import { AuthService } from 'client/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings = {
    primaryDomain: '',
    primaryEmail: '',
    sslEnabled: false,
    forceSSL: false,
    keys: {
      enableAPI: false,
      accessKey: '',
      apiKey: '',
      allowedOrigins: []
    }
  }

  user: any

  constructor(
    private settingsServie: SettingsService,
    private helperService: HelperService,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    window.scrollTo(0, 0);

    this.user = this.authService.getUser()

    this.settingsServie.getSettings().subscribe((getSettingsResponse: any) => {
      if (getSettingsResponse.success) {
        this.settings = getSettingsResponse.settings
      } else {
        this.toastr.error(getSettingsResponse.message)
      }
    })

  }

  toggleRefresh() {
    document.getElementById('toggleRefresh').style.animation = 'rotation 1s 1 linear';
  }

  copyToClipBoard(key) {
    this.helperService.copyToClipboard(key);
  }

  updateSettingsDomain() {

    if (this.settings.primaryDomain == '') {
      this.toastr.warning('Enter Primary Domain')
      return false;
    }

    const settings = {
      primaryDomain: this.settings.primaryDomain,
      primaryEmail: this.settings.primaryEmail,
      sslEnabled: this.settings.sslEnabled,
      forceSSL: this.settings.forceSSL,
    }

    this.settingsServie.updateSettings(settings).subscribe((updateSettingsResponse: any) => {
      if (updateSettingsResponse.success) {
        this.toastr.success(updateSettingsResponse.message, 'Success!')
      } else {
        this.toastr.error(updateSettingsResponse.message)
      }
    })

  }

  updateEnableAPI() {

    this.settings.keys.enableAPI = !this.settings.keys.enableAPI

    this.settingsServie.updateSettings(this.settings).subscribe(() => { })

  }

  refreshAPIKeys() {

    this.settingsServie.generateKeys(this.settings).subscribe((refreshAPIKeysResponse: any) => {
      if (refreshAPIKeysResponse.success) {
        this.settings = refreshAPIKeysResponse.settings
      }
    })

  }

  addOriginInputBox() {

    this.settings.keys.allowedOrigins.push({ originName: '' })

  }

  addOrigin() {

    this.settings.keys.allowedOrigins.map((allowedOrigin, i) => {
      if (allowedOrigin['originName'] == '') {
        this.settings.keys.allowedOrigins.splice(this.settings.keys.allowedOrigins.indexOf(allowedOrigin), 1)
      }
    })

    this.settingsServie.updateSettings(this.settings).subscribe((updateSettingsResponse: any) => {
      if (updateSettingsResponse.success) {
        this.toastr.success(updateSettingsResponse.message, 'Success!')
      } else {
        this.toastr.error(updateSettingsResponse.message)
      }
    })

  }

  removeOrigin(allowedOriginsIndex) {

    this.settings.keys.allowedOrigins.splice(allowedOriginsIndex, 1)

  }

}
