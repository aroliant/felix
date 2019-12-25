import FileSync from 'lowdb/adapters/FileSync'
import low from 'lowdb'
import crypto from 'crypto';

import config from '../config'
import { SSLController } from '../controllers'

const settingsAdapter = new FileSync(config.ROOT_FOLDER + '/settings.json')
const settingsDB = low(settingsAdapter)

const accessEncryptionKey = '=77FJJ*4ZyjgzsK@'
const apiEncryptionKey = '&ncGzV5LvqX6VygA'

const date = new Date()

const defaultsSettingsDB = {
  settings: {
    primaryDomain: "",
    sslEnabled: false,
    forceSSL: false,
    keys: {
      enableAPI: false,
      accessKey: crypto.createHmac('sha512', accessEncryptionKey).update(date.toString()).digest('hex'),
      apiKey: crypto.createHmac('sha512', apiEncryptionKey).update(date.toString()).digest('hex'),
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
      config.PRIMARY_DOMAIN = settings.primaryDomain

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

  static updatePrimarySSL(req, res) {

    const settingsAdapter = new FileSync(config.ROOT_FOLDER + '/settings.json')
    const settingsDB = low(settingsAdapter)

    const settings = req.body

    if (!settings.primaryDomain) {
      return res.json({
        success: false,
        message: "Primary Domain name is required",
      })
    }

    if (!settings.primaryEmail) {
      return res.json({
        success: false,
        message: "Primary Email is required",
      })
    }

    try {

      settingsDB.get('settings').assign(settings).write()
      config.PRIMARY_DOMAIN = settings.primaryDomain
      config.PRIMARY_EMAIL = settings.primaryEmail

    } catch (err) {

      return res.json({
        success: false,
        message: "Unable to update Settings",
        error: err
      });

    }

    new SSLController().issueCertficate(config.PRIMARY_DOMAIN, config.PRIMARY_EMAIL).then(() => {

      return res.json({
        success: true,
        message: "Settings Updated !"
      })

    }).catch((err) => {

      return res.json({
        success: false,
        message: "Unable to update SSL for this domain",
        error: err,
      })

    })




  }

  static generateKeys(req, res) {

    const settingsAdapter = new FileSync(config.ROOT_FOLDER + '/settings.json')
    const settingsDB = low(settingsAdapter)

    var settings = req.body

    const date = new Date()

    settings.keys.accessKey = crypto.createHmac('sha512', accessEncryptionKey).update(date.toString()).digest('hex')
    settings.keys.apiKey = crypto.createHmac('sha512', apiEncryptionKey).update(date.toString()).digest('hex')

    try {

      settingsDB.get('settings').assign(settings).write()
      settings = settingsDB.get('settings').value()

    } catch (err) {

      return res.json({
        success: false,
        message: "Unable to generate keys",
        error: err.message
      });

    }

    return res.json({
      success: true,
      message: "Keys Generated !",
      settings: settings
    })

  }

  static getGlobalSettings(req, res) {
    return res.json({
      success: true,
      PRIMARY_DOMAIN: config.PRIMARY_DOMAIN,
    })
  }

}