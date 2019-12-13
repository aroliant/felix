const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
import fs from 'fs-extra';
// Relative Imports
import { UserController } from './controllers'
import config from '../server/config';


const routes = require('./routes/index.route');

const PORT = process.env.PORT || 3000

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.options("*", (req, res) => {
    return res.send('')
})

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

// Create Default User
UserController.createDefaultUser()

// Creating default files and folders
fs.ensureFileSync(`${config.ROOT_FOLDER}/buckets.json`)
fs.ensureFileSync(`${config.ROOT_FOLDER}/users.json`)
fs.ensureFileSync(`${config.ROOT_FOLDER}/settings.json`)
fs.ensureDirSync(`${config.ROOT_FOLDER}/buckets`)
fs.ensureDirSync(`${config.ROOT_FOLDER}/meta`)

app.listen(PORT, function () {
    console.log('The API Server is Listening on Port : ', PORT);
});

process.on('uncaughtException', function (err) {
    console.log(err);
    process.exit(1);
})