import FileSync from 'lowdb/adapters/FileSync'
import low from 'lowdb'

import config from '../config'

const settingsAdapter = new FileSync(config.ROOT_FOLDER + '/settings.json')
const settingsDB = low(settingsAdapter)

const defaultsSettingsDB = {
  settings: {
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
}

settingsDB.defaults(defaultsSettingsDB).write()


export class SettingsController {

  static getSettings(req, res) {

    const settingsAdapter = new FileSync(config.ROOT_FOLDER + '/settings.json')
    const settingsDB = low(settingsAdapter)

    var settings = {}

    try {
      settings = settingsDB.get('settings').value()
    } catch (err) {
      return res.json({
        success: false,
        message: "Unable to Get Current Settings",
        error: err
      });
    }

    return res.json({
      success: true,
      settings: settings
    });


  }

  static updateSettings(req, res) {

    const settingsAdapter = new FileSync(config.ROOT_FOLDER + '/settings.json')
    const settingsDB = low(settingsAdapter)

    const settings = req.body

    try {
      settingsDB.get('settings').assign(settings).write()
    } catch (err) {
      return res.json({
        success: false,
        message: "Unable to update Settings",
        error: err
      });
    }

    return res.json({
      success: true,
      message: "Settings Updated !"
    })


  }

}