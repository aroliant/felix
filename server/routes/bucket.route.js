const express = require('express');

import { BucketController } from '../controllers'

const router = express.Router();
module.exports = router;

router.route('/objects').get((req, res) => BucketController.getProduct(req, res));
