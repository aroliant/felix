const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
import { UserController } from './server/controllers'


const routes = require('./server/routes/index.route');

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

app.get('/', function (req, res) {
    res.send("...")
});

app.use('/', routes);

// Create Default User
UserController.createDefaultUser()

app.listen(PORT, function () {
    console.log('The API Server is Listening on Port : ', PORT);
});

process.on('uncaughtException', function (err) {
    console.log(err);
    process.exit(1);
})