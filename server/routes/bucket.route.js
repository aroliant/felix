const express = require('express');

import { BucketController } from '../controllers'

const router = express.Router();
module.exports = router;

// router.route('/objects').get((req, res) => BucketController.getObjects(req, res));
router.route('/').post((req, res) => BucketController.createBucket(req, res));
router.route('/').put((req, res) => BucketController.updateBucket(req, res));
router.route('/').get((req, res) => BucketController.getAllBuckets(req, res));
router.route('/:bucketID').get((req, res) => BucketController.getBucket(req, res));
router.route('/:bucketID').delete((req, res) => BucketController.deleteBucket(req, res));