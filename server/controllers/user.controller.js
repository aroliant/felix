import FileSync from 'lowdb/adapters/FileSync'
import low from 'lowdb'
import uuidv4 from 'uuid/v4'
import crypto from 'crypto';
import config from '../config'

const jwt = require('jsonwebtoken')
const jwtSignature = ';k9Ugd-/U#{3WUg>'

const usersAdapter = new FileSync(config.ROOT_FOLDER + '/users.json')
const usersDB = low(usersAdapter)

usersDB.defaults({ users: [] }).write()

const encryptionKey = 'Y@!2_b3Vh.jU{^*t'

export class UserController {

  static createDefaultUser(req, res) {

    const usersAdapter = new FileSync(config.ROOT_FOLDER + '/users.json')
    const usersDB = low(usersAdapter)

    const username = 'admin'
    const defaultPassword = 'admin'
    const role = 'admin'

    try {

      if (usersDB.get('users').filter({ username: username }).value().length != 0) {
        return console.log('default user already exists')
      }

    } catch (err) { }

    const id = uuidv4()

    const user = {
      id: id,
      username: username,
      password: crypto.createHmac('sha512', encryptionKey).update(defaultPassword).digest('hex'),
      role: role,
      status: "active"
    }

    try {
      usersDB.get('users').push(user).write()
    } catch (err) {
      return console.log('unable to write default user')
    }

    return console.log('default user created')
  }

  static loginUser(req, res) {

    const usersAdapter = new FileSync(config.ROOT_FOLDER + '/users.json')
    const usersDB = low(usersAdapter)

    const params = req.body

    var user = {
      username: params.username,
      password: crypto.createHmac('sha512', encryptionKey).update(params.password).digest('hex'),
      status: 'active'
    }

    try {

      const users = usersDB.get('users').filter(user).value()

      if (users.length == 0) {
        return res.json({
          success: false,
          message: "Invalid Username or Password or User Inactive"
        })
      }

      user = users[0]

    } catch (err) {

      return res.json({
        success: false,
        message: "Error occured while Authenticating"
      })

    }

    delete user.password

    return res.json({
      success: true,
      token: jwt.sign(user, jwtSignature)
    })

  }

  static getAllUsers(req, res) {

    const usersAdapter = new FileSync(config.ROOT_FOLDER + '/users.json')
    const usersDB = low(usersAdapter)

    var users = []
    try {
      users = usersDB.get('users').value()
    } catch (err) {
      return res.json({
        success: false,
        message: "Unable to get Users",
        error: err
      });
    }

    users.map((user, index) => {

      delete user.password

    })

    return res.json({
      success: true,
      users: users
    });

  }

  static addUser(req, res) {

    const usersAdapter = new FileSync(config.ROOT_FOLDER + '/users.json')
    const usersDB = low(usersAdapter)

    const params = req.body

    try {

      if (usersDB.get('users').filter({ username: params.username }).value().length != 0) {
        return res.json({
          success: false,
          message: "User Name already exists"
        })
      }

    } catch (err) {

      return res.json({
        success: false,
        message: "Error occured while creating User"
      })

    }

    const id = uuidv4()

    const user = {
      id: id,
      username: params.username,
      password: crypto.createHmac('sha512', encryptionKey).update(params.password).digest('hex'),
      role: params.role,
      status: "Active"
    }

    try {

      usersDB.get('users').push(user).write()

    } catch (err) {

      return res.json({
        success: false,
        message: "Unable to create User",
        error: err
      })

    }

    return res.json({
      success: true,
      message: "User Created Successfully",
    })

  }

  static removeUser(req, res) {

    const usersAdapter = new FileSync(config.ROOT_FOLDER + '/users.json')
    const usersDB = low(usersAdapter)

    const username = req.params.username

    try {

      usersDB.get('users').remove({ username: username }).write()

    } catch (err) {

      return res.json({
        success: false,
        message: "Unable to remove User",
        error: err.message
      })

    }

    return res.json({
      success: true,
      message: "User Removed Successfully",
    })

  }

  static updateUser(req, res) {

    const usersAdapter = new FileSync(config.ROOT_FOLDER + '/users.json')
    const usersDB = low(usersAdapter)

    const newUser = req.body
    var oldUser

    try {

      oldUser = usersDB.get('users').filter({ username: newUser.username }).value()

    } catch (err) {

      return res.json({
        success: false,
        message: "Unable to update User",
        error: err.message
      });

    }

    oldUser = oldUser[0]

    for (var key in oldUser) {

      if (key == "password" && newUser.password != undefined) {
        newUser.password = crypto.createHmac('sha512', encryptionKey).update(newUser.password).digest('hex')
      } else {
        if (newUser[key] == undefined) {
          newUser[key] = oldUser[key]
        }
      }

    }

    try {

      usersDB.get('users').find({ username: newUser.username }).assign(newUser).write()

    } catch (err) {

      return res.json({
        success: false,
        message: "Unable to update User",
        error: err
      });

    }

    return res.json({
      success: true,
      message: "User Updated !"
    })


  }
}