import express from 'express';
import fs from 'fs-extra'
import path from 'path'
import config from '../config';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/bucket', require('./bucket.route'));

// Pipe to handle GET Requests of Bucket Objects
router.get('/:bucketName/**', (req, res) => {
  const bucketName = req.params.bucketName
  const relativePath = req.params[0]
  const filePath = config.ROOT_FOLDER + "/buckets/" + bucketName + "/" + relativePath
  const fileName = path.basename(filePath)
  

  fs.exists(filePath, function (exists) {
    if (exists) {
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=" + fileName
      });
      return fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(400, { "Content-Type": "text/plain" });
      return res.end("File does not exist");
    }
  });

})


module.exports = router;