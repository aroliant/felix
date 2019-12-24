import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync'

import { resolve } from './file-resolver'

const fileName = resolve();

console.log(`Resolve config filename ${fileName}`);

require('dotenv').config({ path: `./server/${fileName}` });

const REQUIRED_KEYS = [
    'ROOT_FOLDER',
    'PORT'
];

REQUIRED_KEYS.forEach((key) => {
    if (!(key in process.env)) {
        throw new Error(`Missing required config key: ${key}`);
    }
});

const {
    ROOT_FOLDER,
    PORT = 80,
} = process.env;

const settingsAdapter = new FileSync(process.env.ROOT_FOLDER + '/settings.json')
const settingsDB = low(settingsAdapter)

settingsDB.defaults({
    settings: {
        primaryDomain: '',
        primaryEmail: '',
        sslEnabled: false,
        forceSSL: false,
        keys: {
            enableKey: false,
            accessKey: '',
            apiKey: '',
            allowedOrigins: [],
            enableAPI: false
        }
    }
}).write()

let settings = {}
try {
    settings = settingsDB.get('settings').value()
} catch (err) {
    console.log(err)
}

const config = {
    ROOT_FOLDER,
    ETC_FOLDER: process.env.NODE_ENV === 'development' ? ROOT_FOLDER + '/' : '',
    PORT,
    PRIMARY_DOMAIN: settings.primaryDomain,
    PRIMARY_EMAIL: settings.primaryEmail
}

export default config;