import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'client/app/services/settings.service';
import { ToastrService } from 'ngx-toastr';
import { HelperService } from 'client/app/services/helper.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings = {
    primaryDomain: "",
    sslEnabled: false,
    forceSSL: false,
    keys: {
      enableAPI: false,
      accessKey: "",
      apiKey: "",
      allowedOrigins: []
    }
  }

  constructor(
    private settingsServie: SettingsService,
    private helperService: HelperService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {

    this.settingsServie.getSettings().subscribe((getSettingsResponse: any) => {
      if (getSettingsResponse.success) {
        this.settings = getSettingsResponse.settings
      } else {
        this.toastr.error(getSettingsResponse.message)
      }
    })

  }

  toggleRefresh() {
    document.getElementById("toggleRefresh").style.animation = "rotation 1s 1 linear";
  }

  copyToClipBoard(key) {

    this.helperService.copyToClipboard(key);

  }

  updateSettingsDomain() {

    const settings = {
      primaryDomain: this.settings.primaryDomain,
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

    this.settings.keys.allowedOrigins.push({ originName: "" })

  }

  addOrigin() {

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
