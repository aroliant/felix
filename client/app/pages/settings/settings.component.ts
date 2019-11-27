import { Component, OnInit } from '@angular/core';
import { SettingsService } from 'client/app/services/settings.service';
import { ToastrService } from 'ngx-toastr';

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
      enableKey: false,
      accessKey: "",
      apiKey: "",
      allowedOrigins: []
    }
  }

  constructor(
    private settingsServie: SettingsService,
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
