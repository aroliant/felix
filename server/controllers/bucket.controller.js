
import low from 'lowdb'
import Busboy from 'busboy'
import FileSync from 'lowdb/adapters/FileSync'
import uuidv4 from 'uuid/v4'
import fs from 'fs-extra'
import klaw from 'klaw'
import path from 'path'
import through2 from 'through2'
import rimraf from 'rimraf'

import config from '../config'

const bucketsAdapter = new FileSync(config.ROOT_FOLDER + '/buckets.json')
const bucketsDB = low(bucketsAdapter)

bucketsDB.defaults({ "buckets": [] }).write()

export class BucketController {

  static createBucket(req, res) {

    const params = req.body

    try {
      if (bucketsDB.get('buckets').filter({ bucketName: params.bucketName }).value().length != 0) {
        return res.send({
          success: false,
          message: "Bucket Name Already Exists" 
        })
      }
    } catch (err) {
      return res.send({
        success: false,
        message: "Buckets cannot be accessed"
      })
    }

    const id = uuidv4();

    const bucket = {
      bucketID: id,
      bucketName: params.bucketName,
      size: "0KB",
      items: "0",
      database: params.bucketName + ".bucket.json",
      createdBy: params.userID,
      createdAt: Date.now()
    }

    try {
      bucketsDB.get('buckets').push(bucket).write()
    } catch (err) {
      return res.send({
        success: false,
        message: "Unable to create Bucket",
        error: err
      })
    }

    const bucketAdapter = new FileSync(config.ROOT_FOLDER + '/' + bucket.bucketName + '.bucket.json')
    const bucketDB = low(bucketAdapter)

    try {
      bucketDB.set('bucket', { // ok I'll chaneg those
        bucketName: req.body.bucketName,
        bucketID: id,
        size: "0KB",
        items: "0",
        database: bucket.database,
        createdBy: bucket.createdBy,
        createdAt: bucket.createdAt,
        domains: [],
        settings: {
          endPoint: "",
          sslEnabled: false,
          fileListing: "restricted"
        }
      })
        .write()
    } catch (err) {
      return res.send({
        success: false,
        message: "Bucket Failed to be Created",
        error: err
      })
    }

    fs.mkdir(config.ROOT_FOLDER + '/buckets/' + bucket.bucketName, function (err) {
      if (err) {
        return res.send({
          success: false,
          message: "Failed to Create New Folder",
          error: err
        });
      }
    });

    return res.send({
      success: true,
      message: "Bucket Created Successfully"
    });

  }

  static updateBucket(req, res) {
    const bucket = req.body
    const bucketName = (bucketsDB.get('buckets').find({ bucketID: bucket.bucketID }).value())['bucketName']
    const FileSyncBucket = require('lowdb/adapters/FileSync')
    const adapterBucket = new FileSyncBucket(config.ROOT_FOLDER + '/' + bucketName + '.bucket.json')
    const bucketDB = low(adapterBucket)

    try {
      bucketDB.get('bucket').assign(bucket).write()
    } catch (err) {
      return res.send({
        success: false,
        message: "Failed to Update Bucket",
        error: err
      });
    }

    res.send({
      success: true,
      message: "Bucket Updated Successfully"
    })
  }

  static getAllBuckets(req, res) {
    var buckets = []
    try {
      buckets = bucketsDB.get('buckets').value()
    } catch (err) {
      return res.send({
        success: false, 
        message: "Buckets cannot be Accessed",
        error: err
      });
    }

    return res.json({
       success: true,
       buckets: buckets
      });

  }

  static getBucket(req, res) {
    const bucketName = req.params.bucketName
    const adapterBucket = new FileSyncBucket(config.ROOT_FOLDER + '/' + bucketName + '.bucket.json')
    const bucketDB = low(adapterBucket)

    var bucket = {}

    try {
      bucket = bucketDB.get('bucket').value()
    } catch (err) {
      return res.send({
        success: false,
        message: "Buckets cannot be Accessed",
        error: err
      });
    }

    return res.json({
      success: true,
      bucket: bucket
    });

  }

  static deleteBucket(req, res) {
    const bucketID = req.params.bucketID
    var bucketName

    try {
      bucketName = (bucketsDB.get('buckets').find({ bucketID: bucketID }).value())['bucketName']
    } catch (err) {
      return res.send({
        success: false,
        message: "Bucket Not Found",
        error: err
      });
    }

    fs.unlink(config.ROOT_FOLDER + '/' + bucketName + '.bucket.json', function (err) {
      if (err) {
        return res.send({
          success: false,
          message: "Failed to Delete " + bucketName + " Folder",
          error: err
        });
      }
    })

    try {
      bucketsDB.get('buckets').remove({ bucketID: bucketID }).write()
    } catch (err) {
      return res.send({
        success: false,
        message: "Bucket Not Found",
        error: err
      })
    }

    rimraf(config.ROOT_FOLDER + '/buckets/' + bucketName, function (err) {
      if (err) {
        return res.send({
          success: false,
          message: "Failed to Delete " + bucketName + " Folder",
          error: err
        });
      }
    })

    return res.send({
      success: true,
      message: "Bucket Deleted Successfully"
    })

  }

  static searchObjects(req, res) {

    const params = req.body
    const rootPath = config.ROOT_FOLDER + '/buckets/' + params.bucketName
    let objects = []

    const proecessObject = through2.obj(function (item, enc, next) {
      const object = {
        name: item.path.replace(rootPath, ''),
        size: item.stats.size,
        createdAt: item.stats.ctime,
        modifiedAt: item.stats.mtime,
        objectType: item.stats.isDirectory() == true ? 'folder' : 'file'
      }
      objects.push(object)
      next()
    })

    klaw(rootPath + params.path, { depthLimit: 0 })
      .pipe(proecessObject)
      .on('data', item => objects.push(item))
      .on('error', (err, item) => {
        return res.json({
          success: false,
          message: "Failed to Search the Object",
          error: err
        });
      })
      .on('end', () => {
        return res.json({
          success: true,
          objects: objects
        })
      })

  }

  static deleteObjects(req, res) {
    var params = req.body;
    params.paths.forEach(object => {
      rimraf(config.ROOT_FOLDER + '/buckets/' + params.bucketName + '/' + object, () => {} );
  })
    return res.send({
      success: true,
      message:"Object Deleted Successfully"
  })
  }

  static uploadObjects(req, res) {

    const fileName = req.params[0]
    const absolutePath = config.ROOT_FOLDER + "/buckets/" + fileName

    const busboy = new Busboy({ headers: req.headers })

    fs.ensureFile(absolutePath, (err) => {

      if (err) {
        return res.json({
          success: false,
          message: "Unable to upload file",
          error: err
        })
      }

      busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        file.pipe(fs.createWriteStream(absolutePath));
      });

      busboy.on('finish', function () {
        return res.json({
          success: true,
          path: fileName
        })
      });

      busboy.on('error', (err) => { console.log(err) })

      return req.pipe(busboy)

    })

  }

}
