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

const config = {
    ROOT_FOLDER,
    PORT,
}

module.exports = config;