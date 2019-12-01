import express from 'express';

import { BucketController } from '../controllers'

const router = express.Router();
module.exports = router;

// Buckets

router.route('/').post((req, res) => BucketController.createBucket(req, res))
  .put((req, res) => BucketController.updateBucket(req, res))
  .get((req, res) => BucketController.getAllBuckets(req, res));

router.route('/:bucketName').get((req, res) => BucketController.getBucket(req, res))
  .delete((req, res) => BucketController.deleteBucket(req, res));

// Objects

router.route('/objects/directories/:bucketName').get((req, res) => BucketController.getAllDirectories(req, res));

router.route('/objects/').post((req, res) => BucketController.searchObjects(req, res));
router.route('/objects/delete').post((req, res) => BucketController.deleteObjects(req, res));

router.route('/objects/folder').post((req, res) => BucketController.createFolder(req, res));
router.route('/objects/move').put((req, res) => BucketController.moveObjects(req, res));


router.route('/objects/*').put((req, res) => BucketController.uploadObjects(req, res));