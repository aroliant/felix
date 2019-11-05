const express = require('express');

import { BucketController } from '../controllers'

const router = express.Router();
module.exports = router;

router.route('/objects').get((req, res) => BucketController.getObjects(req, res));
router.route('/create').put((req, res) => BucketController.createBucket(req, res));
router.route('/update').post((req, res) => BucketController.updateBucket(req, res));
router.route('/all').get((req, res) => BucketController.getAllBuckets(req, res));
router.route('/:bucketID').get((req, res) => BucketController.getBucket(req, res));
router.route('/delete/:bucketID').delete((req, res) => BucketController.deleteBucket(req, res));