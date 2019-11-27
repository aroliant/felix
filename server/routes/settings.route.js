import express from 'express';

import { SettingsController } from '../controllers'

const router = express.Router();
module.exports = router;

// Settings

router.route('/').put((req, res) => SettingsController.updateSettings(req, res));
router.route('/generateKeys').put((req, res) => SettingsController.generateKeys(req, res));
router.route('/').get((req, res) => SettingsController.getSettings(req, res));