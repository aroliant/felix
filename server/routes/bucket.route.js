import express from 'express';

import { BucketController } from '../controllers'

const router = express.Router();
module.exports = router;

// Buckets

router.route('/').post((req, res) => BucketController.createBucket(req, res))
  .put((req, res) => BucketController.updateBucket(req, res))
  .get((req, res) => BucketController.getAllBuckets(req, res));

// Bucket - Settings SSL
router.route('/ssl').put((req, res) => BucketController.updateSSL(req, res))

router.route('/:bucketName').get((req, res) => BucketController.getBucket(req, res))
  .delete((req, res) => BucketController.deleteBucket(req, res));

// Objects

router.route('/objects/directories/:bucketName').get((req, res) => BucketController.getAllDirectories(req, res));

router.route('/objects/').post((req, res) => BucketController.searchObjects(req, res));
router.route('/objects/delete').post((req, res) => BucketController.deleteObjects(req, res));

router.route('/objects/folder').post((req, res) => BucketController.createFolder(req, res));

router.route('/objects/move').put((req, res) => BucketController.moveObjects(req, res));
router.route('/objects/share').put((req, res) => BucketController.shareObject(req, res));
router.route('/objects/filepermissions').put((req, res) => BucketController.updateObjectPermission(req, res));
router.route('/objects/meta').put((req, res) => BucketController.updateObjectMeta(req, res));

// File Upload
router.route('/objects/*').put((req, res) => BucketController.uploadObjects(req, res));