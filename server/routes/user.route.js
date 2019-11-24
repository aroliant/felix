import express from 'express';

import { UserController } from '../controllers'

const router = express.Router();
module.exports = router;

// User

router.route('/default').post((req, res) => UserController.createDefaultUser(req, res));
router.route('/login').put((req, res) => UserController.loginUser(req, res));
router.route('/').get((req, res) => UserController.getAllUsers(req, res));
router.route('/').post((req, res) => UserController.addUser(req, res));
router.route('/:username').delete((req, res) => UserController.removeUser(req, res));
router.route('/').put((req, res) => UserController.updateUser(req, res));