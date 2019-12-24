import express from 'express';
import fs from 'fs-extra'
import path from 'path'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import crypto from 'crypto'
import mime from 'mime-types'

import config from '../config';
import { DomainController, SSLController } from '../controllers'

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/bucket', require('./bucket.route'));

router.use('/settings', require('./settings.route'));

router.use('/user', require('./user.route'));

// Domain Handling Middleware
router.use('/', (req, res, next) => {

  // Pass /.well-known requests
  if (req.path.split('/')[1] === '.well-known') {
    return next()
  }

  // Handle Domains from Domain Registry
  const host = req.hostname
  const bucket = DomainController.resolveDomainBucket(host)
  if (bucket) {
    const bucketName = bucket.bucket
    const relativePath = decodeURIComponent(req.url.replace('/', ''))
    console.log('Processing file', relativePath)
    return processAndServeFile(bucketName, relativePath, req, res)
  }
  return next()
})

// Handle ACME Challenge
router.get('/.well-known/acme-challenge/:token', (req, res) => SSLController.handleDomainChallenge(req, res))

// Pipe to handle GET Requests of Bucket Objects
router.get('/:bucketName/**', (req, res) => {

  const bucketName = req.params.bucketName
  const relativePath = req.params[0]

  processAndServeFile(bucketName, relativePath, req, res)

})

function processAndServeFile(bucketName, relativePath, req, res) {

  const shareParam = req.query.share
  const filePath = config.ROOT_FOLDER + "/buckets/" + bucketName + "/" + relativePath
  const fileName = path.basename(filePath)

  // Read the file's meta before sending the response
  const metaFilePath = config.ROOT_FOLDER + "/meta/" + bucketName + "/" + relativePath.substring(0, relativePath.lastIndexOf('/')) + "meta.json"

  // Check if meta file exists
  if (!fs.existsSync(metaFilePath)) {
    console.log('unable to retrive meta path', metaFilePath)
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("404 Not Found")
  }

  const adapter = new FileSync(metaFilePath)
  const db = low(adapter)

  const fileMeta = db.get('meta').get('children').find({ name: fileName }).value()

  if (!fileMeta) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("404 Not Found")
  }

  // Public / Private Restriction
  if (!fileMeta.public && !shareParam) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("403 Forbidden")
  }

  // Check for File Sharing 
  if (shareParam) {
    // 1. Share Token
    const shareToken = crypto.createHash('md5').update(fileMeta.sharingExpiresOn).digest('hex')

    if (shareParam != shareToken) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      return res.end("403 Forbidden: Invalid Share Token")
    }
    // 2. Check Share Expiry Time
    if (fileMeta.sharingExpiresOn < Date.now()) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      return res.end("403 Forbidden: Sharing Expired")
    }
  }

  fs.exists(filePath, function (exists) {
    if (exists) {
      res.writeHead(200, {
        "Content-Type": mime.contentType(fileName),
        //"Content-Disposition": "attachment; filename=" + fileName,
        ...fileMeta.meta // Append custom meta for Object
      });
      return fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("File does not exist");
    }
  });

}


module.exports = router;