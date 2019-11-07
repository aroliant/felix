
import low from 'lowdb'
import Busboy from 'busboy'
const FileSync = require('lowdb/adapters/FileSync')
const uuidv4 = require('uuid/v4');
const fs = require('fs-extra')
const klaw = require('klaw')
const path = require('path')
const through2 = require('through2')
var rimraf = require("rimraf");

import config from '../config'

const bucketsAdapter = new FileSync(config.ROOT_FOLDER + '/buckets.json')
const bucketsDB = low(bucketsAdapter)

bucketsDB.defaults({ "buckets": [] }).write()

export class BucketController {

  static createBucket(req, res) {
    const id = uuidv4();

    const bucket = {
      "bucketID": id,
      "name": req.body.bucketName,
      "size": "0KB",
      "items": "0",
      "database": req.body.bucketName + ".bucket.json",
      "createdBy": req.body.userID,
      "createdAt": Date.now()
    }

    bucketsDB.get('buckets')
      .push(bucket)
      .write()
    const bucketAdapter = new FileSync(config.ROOT_FOLDER + '/' + bucket.name + '.bucket.json')
    const bucketDB = low(bucketAdapter)
    bucketDB.set('bucket', {
      "name": req.body.bucketName,
      "bucketID": id,
      "size": "0KB",
      "items": "0",
      "database": bucket.database,
      "createdBy": bucket.createdBy,
      "createdAt": bucket.createdAt,
      "domains": [],
      "settings": {
        "endPoint": "",
        "sslEnabled": false,
        "fileListing": "restricted"
      }
    })
      .write()

    fs.mkdir(config.ROOT_FOLDER + '/buckets/' + bucket.name, () => { });

    return res.send({ "success": true })

  }

  static updateBucket(req, res) {
    const bucket = req.body
    const bucketName = (bucketsDB.get('buckets').find({ bucketID: bucket.bucketID }).value())['name']
    const FileSyncBucket = require('lowdb/adapters/FileSync')
    const adapterBucket = new FileSyncBucket(config.ROOT_FOLDER + '/' + bucketName + '.bucket.json')
    const bucketDB = low(adapterBucket)
    bucketDB.get('bucket')
      .assign(bucket)
      .write()
    res.send({ "success": true })
  }

  static getAllBuckets(req, res) {
    return res.json(bucketsDB.get('buckets').value());
  }

  static getBucket(req, res) {
    const bucketID = req.params.bucketID
    const bucketName = (bucketsDB.get('buckets').find({ bucketID: bucketID }).value())['name']
    const FileSyncBucket = require('lowdb/adapters/FileSync')
    const adapterBucket = new FileSyncBucket(config.ROOT_FOLDER + '/' + bucketName + '.bucket.json')
    const bucketDB = low(adapterBucket)
    return res.json(bucketDB.get('bucket').value());
  }

  static deleteBucket(req, res) {
    const bucketID = req.params.bucketID
    const bucketName = (bucketsDB.get('buckets').find({ bucketID: bucketID }).value())['name']
    fs.unlink(config.ROOT_FOLDER + '/' + bucketName + '.bucket.json', (err) => {
      if (err) {
        console.error(err)
        return res.send({ "success": false })
      }
    })
    bucketsDB.get('buckets')
      .remove({ bucketID: bucketID })
      .write()

    rimraf(config.ROOT_FOLDER + '/buckets/' + bucketName,()=>{})

    return res.send({ "success": true })

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
      .on('end', () => {
        return res.json({
          success: true,
          objects: objects
        })
      })

  }

  static deleteObjects(req, res) {
    var params = req.body;
    params.path.forEach(object => {
    rimraf(config.ROOT_FOLDER + '/buckets/' + params.bucketName + '/' + object, function () {});
    });

    return res.send({ "success": true })
  }

  static uploadObjects(req, res) {

    const fileName = req.params[0]
    const absolutePath = config.ROOT_FOLDER + "/buckets/" + fileName

    const busboy = new Busboy({ headers: req.headers })

    fs.ensureFile(absolutePath, (err) => {

      if (err) {
        return res.json({
          success: false,
          message: "Unable to upload file"
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
